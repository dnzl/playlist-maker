// Mock data for testing the application without making API calls

import { SetlistResponse } from './types';

export const mockArtists = [
  {
    mbid: "b49b81cc-d5b7-4bdd-aadb-385df8c69a9f",
    name: "Metallica",
    url: "https://www.setlist.fm/setlists/metallica-3bd6bc5c.html"
  },
  {
    mbid: "65f4f0c5-ef9e-490c-aee3-909e7ae6b2ab",
    name: "Radiohead",
    url: "https://www.setlist.fm/setlists/radiohead-3bd6bc5c.html"
  },
  {
    mbid: "b8a7c51f-362c-4dcb-a259-bc6e0095f0a6",
    name: "Ed Sheeran",
    url: "https://www.setlist.fm/setlists/ed-sheeran-3bd6bc5c.html"
  }
];

export const mockSetlists: Record<string, SetlistResponse> = {
  "b49b81cc-d5b7-4bdd-aadb-385df8c69a9f": { // Metallica
    setlist: [
      {
        sets: {
          set: [
            {
              song: [
                { name: "Enter Sandman" },
                { name: "For Whom the Bell Tolls" },
                { name: "Sad But True" },
                { name: "The Unforgiven" },
                { name: "Wherever I May Roam" },
                { name: "Nothing Else Matters" },
                { name: "One" },
                { name: "Master of Puppets" }
              ]
            }
          ]
        }
      },
      {
        sets: {
          set: [
            {
              song: [
                { name: "Enter Sandman" },
                { name: "Creeping Death" },
                { name: "For Whom the Bell Tolls" },
                { name: "The Memory Remains" },
                { name: "One" },
                { name: "Nothing Else Matters" },
                { name: "Master of Puppets" }
              ]
            }
          ]
        }
      },
      {
        sets: {
          set: [
            {
              song: [
                { name: "Hardwired" },
                { name: "For Whom the Bell Tolls" },
                { name: "The Memory Remains" },
                { name: "One" },
                { name: "Nothing Else Matters" },
                { name: "Master of Puppets" }
              ]
            }
          ]
        }
      }
    ]
  },
  "65f4f0c5-ef9e-490c-aee3-909e7ae6b2ab": { // Radiohead
    setlist: [
      {
        sets: {
          set: [
            {
              song: [
                { name: "Daydreaming" },
                { name: "Desert Island Disk" },
                { name: "Ful Stop" },
                { name: "Pyramid Song" },
                { name: "Everything in Its Right Place" },
                { name: "Idioteque" },
                { name: "Paranoid Android" },
                { name: "Karma Police" }
              ]
            }
          ]
        }
      },
      {
        sets: {
          set: [
            {
              song: [
                { name: "Daydreaming" },
                { name: "Ful Stop" },
                { name: "Lotus Flower" },
                { name: "Everything in Its Right Place" },
                { name: "Idioteque" },
                { name: "Paranoid Android" },
                { name: "Karma Police" }
              ]
            }
          ]
        }
      },
      {
        sets: {
          set: [
            {
              song: [
                { name: "Burn the Witch" },
                { name: "Daydreaming" },
                { name: "Ful Stop" },
                { name: "Everything in Its Right Place" },
                { name: "Idioteque" },
                { name: "Paranoid Android" }
              ]
            }
          ]
        }
      }
    ]
  },
  "b8a7c51f-362c-4dcb-a259-bc6e0095f0a6": { // Ed Sheeran
    setlist: [
      {
        sets: {
          set: [
            {
              song: [
                { name: "Castle on the Hill" },
                { name: "Eraser" },
                { name: "The A Team" },
                { name: "Don't" },
                { name: "Shape of You" },
                { name: "Perfect" },
                { name: "Thinking Out Loud" }
              ]
            }
          ]
        }
      },
      {
        sets: {
          set: [
            {
              song: [
                { name: "Castle on the Hill" },
                { name: "Eraser" },
                { name: "The A Team" },
                { name: "Shape of You" },
                { name: "Perfect" },
                { name: "Thinking Out Loud" }
              ]
            }
          ]
        }
      },
      {
        sets: {
          set: [
            {
              song: [
                { name: "Castle on the Hill" },
                { name: "The A Team" },
                { name: "Shape of You" },
                { name: "Perfect" }
              ]
            }
          ]
        }
      }
    ]
  }
}; 