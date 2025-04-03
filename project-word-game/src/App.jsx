import React, { useState } from "react";
import CSVSelector from "./components/CSVSelector";
import WordGame from "./components/WordGame";

function App() {
  const [words, setWords] = useState(null);

  return (
    <div className="card">
      <div className="header">
        <h1>단어 맞추기 게임</h1>
      </div>
      {!words ? (
        <CSVSelector onFileLoaded={setWords} />
      ) : (
        <WordGame words={words} />
      )}
    </div>
  );
}

export default App;
