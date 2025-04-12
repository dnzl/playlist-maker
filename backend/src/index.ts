import express, { RequestHandler } from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import { mockArtists, mockSetlists } from "./mockData";
import { SetlistArtist, SetlistResponse, SongStatistics } from "./types";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// Setlist.fm API configuration
const SETLIST_API_KEY = process.env.SETLIST_API_KEY;
const SETLIST_BASE_URL = "https://api.setlist.fm/rest/1.0";

// Flag to use mock data instead of API calls
const USE_MOCK_DATA = process.env.USE_MOCK_DATA === "true";

// Middleware
app.use(cors());
app.use(express.json());

// Create axios instance with default config
const setlistApi = axios.create({
  baseURL: SETLIST_BASE_URL,
  headers: {
    "x-api-key": SETLIST_API_KEY,
    Accept: "application/json",
  },
});

// Helper function to process setlists and get song statistics
function processSetlists(setlists: SetlistResponse["setlist"]): SongStatistics[] {
  const songMap = new Map<string, number>();
  const songPositions = new Map<string, number[]>();
  let totalShows = 0;

  setlists.forEach(setlist => {
    // Check if the setlist has sets and songs
    if (setlist.sets?.set?.length > 0) {
      let hasSongs = false;
      let songPosition = 1; // Start with 1-based indexing

      // Check if any set has songs
      setlist.sets.set.forEach(set => {
        if (set.song?.length > 0) {
          hasSongs = true;
          set.song.forEach(song => {
            const currentCount = songMap.get(song.name) || 0;
            songMap.set(song.name, currentCount + 1);

            // Track the position of each song
            if (!songPositions.has(song.name)) {
              songPositions.set(song.name, []);
            }
            songPositions.get(song.name)?.push(songPosition);
            songPosition++;
          });
        }
      });

      // Only increment show count if the setlist had songs
      if (hasSongs) {
        totalShows++;
      }
    }
  });

  // Calculate average position for each song
  const songAverages = new Map<string, number>();
  songPositions.forEach((positions, songName) => {
    const average = positions.reduce((sum, pos) => sum + pos, 0) / positions.length;
    songAverages.set(songName, average);
  });

  // Convert to array and sort by average position
  return Array.from(songMap.entries())
    .map(([name, totalPlays]) => ({
      name,
      totalPlays,
      showCount: totalShows,
      averagePosition: songAverages.get(name) || 0,
    }))
    .sort((a, b) => a.averagePosition - b.averagePosition);
}

// Helper function to find the best matching artist
async function findBestMatchingArtist(searchTerm: string): Promise<SetlistArtist> {
  // Load artists data (either from mock or API)
  let artists: SetlistArtist[];

  if (USE_MOCK_DATA) {
    // Use mock data
    artists = mockArtists;
  } else {
    console.log("Searching for artist:", searchTerm);
    // Use real API
    const artistResponse = await setlistApi.get("/search/artists", {
      params: {
        artistName: searchTerm,
        sort: "relevance",
      },
    });
    artists = (artistResponse.data.artist || []) as SetlistArtist[];
  }

  // Filter artists based on search term (same logic regardless of data source)
  const filteredArtists = artists.filter(artist =>
    artist.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filteredArtists.length === 0) {
    throw new Error("No artists found");
  }

  // Find the best match (case insensitive)
  return (
    filteredArtists.find(artist => artist.name.toLowerCase() === searchTerm.toLowerCase()) ||
    filteredArtists[0]
  );
}

// Helper function to get setlist data for an artist
async function getSetlistData(mbid: string): Promise<SetlistResponse> {
  if (USE_MOCK_DATA) {
    // Get mock setlist data
    const mockSetlist = mockSetlists[mbid];
    if (!mockSetlist) {
      throw new Error("No setlist found for this artist");
    }
    return mockSetlist;
  } else {
    console.log("Getting setlist for artist:", mbid);
    // Get the setlist for the artist
    const setlistResponse = await setlistApi.get(`/artist/${mbid}/setlists`);
    return setlistResponse.data;
  }
}

// Search artist endpoint
const searchArtist: RequestHandler = (req, res) => {
  const artistName = req.query.q as string;

  if (!artistName) {
    res.status(400).json({ error: "Artist name is required" });
    return;
  }

  if (USE_MOCK_DATA) {
    // Filter mock artists based on search term
    const filteredArtists = mockArtists.filter(artist =>
      artist.name.toLowerCase().includes(artistName.toLowerCase())
    );
    res.json({ artist: filteredArtists });
    return;
  }
  console.log("Searching for artist:", artistName);
  setlistApi
    .get("/search/artists", {
      params: {
        artistName,
        sort: "relevance",
      },
    })
    .then(response => {
      res.json(response.data);
    })
    .catch(error => {
      console.error("Error searching artist:", error);
      res.status(500).json({ error: "Failed to search artist" });
    });
};

// Get setlist by artist MBID endpoint
const getSetlist: RequestHandler = (req, res) => {
  const mbid = req.query.mbid as string;

  if (!mbid) {
    res.status(400).json({ error: "Artist MBID is required" });
    return;
  }

  if (USE_MOCK_DATA) {
    // Return mock setlist data if available
    const mockSetlist = mockSetlists[mbid];
    if (mockSetlist) {
      res.json(mockSetlist);
    } else {
      res.status(404).json({ error: "No setlist found for this artist" });
    }
    return;
  }
  console.log("Getting setlist for artist:", mbid);
  setlistApi
    .get(`/artist/${mbid}/setlists`)
    .then(response => {
      res.json(response.data);
    })
    .catch(error => {
      console.error("Error getting setlist:", error);
      res.status(500).json({ error: "Failed to get setlist" });
    });
};

// Combined search artist and get setlist endpoint
const searchArtistSetlist: RequestHandler = async (req, res) => {
  const searchTerm = req.query.q as string;

  if (!searchTerm) {
    res.status(400).json({ error: "Search term is required" });
    return;
  }

  try {
    // Find the best matching artist
    const foundArtist = await findBestMatchingArtist(searchTerm);

    // Get setlist data for the artist
    const setlistData = await getSetlistData(foundArtist.mbid);

    // Process the setlists to get song statistics
    const songStats = processSetlists(setlistData.setlist);

    res.json({
      artist: foundArtist,
      songs: songStats,
    });
  } catch (error) {
    console.error("Error in search-artist-setlist:", error);

    if (error instanceof Error) {
      if (error.message === "No artists found") {
        res.status(404).json({ error: "No artists found" });
      } else if (error.message === "No setlist found for this artist") {
        res.status(404).json({ error: "No setlist found for this artist" });
      } else {
        res.status(500).json({ error: "Failed to search artist and get setlist" });
      }
    } else {
      res.status(500).json({ error: "Failed to search artist and get setlist" });
    }
  }
};

// Register routes
app.get("/search-setlist-artist", searchArtist);
app.get("/get-setlist", getSetlist);
app.get("/search-artist-setlist", searchArtistSetlist);

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Using mock data: ${USE_MOCK_DATA}`);
});
