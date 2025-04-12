import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CallbackHandler from "./components/CallbackHandler";
import { PlaylistMakerApp } from "./PlaylistMaker";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PlaylistMakerApp />} />
        <Route path="/callback" element={<CallbackHandler />} />
      </Routes>
    </Router>
  );
}

export default App;
