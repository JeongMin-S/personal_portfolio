import React, { useState, useEffect, useRef } from "react";

function WordGame({ words }) {
  const [chapters, setChapters] = useState([]); // [[10개], [10개], ...]
  const [currentChapter, setCurrentChapter] = useState(0); // index 기반 (0부터)
  const [currentIndex, setCurrentIndex] = useState(0); // 챕터 내 인덱스

  const [selectedRow, setSelectedRow] = useState(null);
  const [givenColumn, setGivenColumn] = useState("");
  const [firstAnswerColumn, setFirstAnswerColumn] = useState("");
  const [userAnswers, setUserAnswers] = useState({ first: "", second: "" });
  const [results, setResults] = useState(null);
  const [hints, setHints] = useState({});

  const [focusedHintIndex, setFocusedHintIndex] = useState(0);
  const hintButtonRefs = useRef([]);
  const firstInputRef = useRef(null);

  useEffect(() => {
    if (words && words.length > 0) {
      const shuffled = [...words].sort(() => 0.5 - Math.random());
      const chapterized = [];
      for (let i = 0; i < shuffled.length; i += 10) {
        chapterized.push(shuffled.slice(i, i + 10));
      }
      setChapters(chapterized);
      setCurrentChapter(0);
      setCurrentIndex(0);
    }
  }, [words]);

  useEffect(() => {
    if (chapters.length > 0 && chapters[currentChapter]) {
      generateGame(chapters[currentChapter]);
    }
  }, [chapters, currentChapter, currentIndex]);

  function generateGame(chapterData) {
    const nextRow = chapterData[currentIndex];
    if (!nextRow) return;
    setSelectedRow(nextRow);

    const allowedGivenCols = ["W", "M"];
    const givenCol =
      allowedGivenCols[Math.floor(Math.random() * allowedGivenCols.length)];
    setGivenColumn(givenCol);
    const firstCol = givenCol === "W" ? "M" : "W";
    setFirstAnswerColumn(firstCol);
    setUserAnswers({ first: "", second: "" });

    const hintsObj = {};

    const correctFirst = nextRow[firstCol];
    if (correctFirst) {
      const allWords = chapterData
        .map((row) => row[firstCol])
        .filter((word, i, arr) => word && arr.indexOf(word) === i);
      let otherHints = allWords.filter((w) => w !== correctFirst);
      otherHints = otherHints.sort(() => 0.5 - Math.random()).slice(0, 5);
      hintsObj[firstCol] = [...otherHints, correctFirst].sort(
        () => 0.5 - Math.random()
      );
    }

    const correctP = nextRow["P"];
    if (correctP) {
      const allP = chapterData
        .map((row) => row["P"])
        .filter((word, i, arr) => word && arr.indexOf(word) === i);
      let otherPHints = allP.filter((w) => w !== correctP);
      otherPHints = otherPHints.sort(() => 0.5 - Math.random()).slice(0, 5);
      hintsObj["P"] = [...otherPHints, correctP].sort(
        () => 0.5 - Math.random()
      );
    }

    setHints(hintsObj);
    setResults(null);
  }

  function handleInputChange(e, field) {
    setUserAnswers({ ...userAnswers, [field]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!selectedRow || givenColumn === "" || !firstAnswerColumn) return;

    const trimmedFirst = userAnswers.first.trim();
    const trimmedSecond = userAnswers.second.trim();

    const correctFirst = selectedRow[firstAnswerColumn].trim();
    const correctP = selectedRow["P"].trim();
    const correctW = selectedRow["W"].trim();

    const res = {
      first: trimmedFirst === correctFirst,
      second: trimmedSecond === correctP || trimmedSecond === correctW,
    };

    setResults(res);
  }

  function handleRestart() {
    const chapter = chapters[currentChapter];
    if (!chapter) return;

    if (currentIndex + 1 >= chapter.length) {
      const reshuffled = [...chapter].sort(() => 0.5 - Math.random());
      const newChapters = [...chapters];
      newChapters[currentChapter] = reshuffled;
      setChapters(newChapters);
      setCurrentIndex(0);
    } else {
      setCurrentIndex(currentIndex + 1);
    }

    setTimeout(() => {
      if (hintButtonRefs.current[0]) {
        hintButtonRefs.current[0].focus();
        setFocusedHintIndex(0);
      }
    }, 0);
  }

  function handleChapterChange(chapterNum) {
    setCurrentChapter(chapterNum);
    setCurrentIndex(0);
  }

  if (!selectedRow || givenColumn === "" || !firstAnswerColumn)
    return <div>로딩 중...</div>;

  const chapterTotal = chapters[currentChapter]?.length || 0;

  return (
    <div style={{ textAlign: "center", fontSize: "2rem" }}>
      {chapters.length > 1 && (
        <div style={{ marginBottom: "1rem" }}>
          {chapters.map((_, i) => (
            <button
              key={i}
              style={{
                margin: "0 5px",
                padding: "5px 10px",
                fontWeight: currentChapter === i ? "bold" : "normal",
              }}
              onClick={() => handleChapterChange(i)}
            >
              Chapter {i + 1}
            </button>
          ))}
        </div>
      )}

      <p style={{ marginBottom: "1rem" }}>
        Chapter {currentChapter + 1} / {chapters.length} - 문제:{" "}
        {currentIndex + 1} / {chapterTotal}
      </p>

      <p>
        <span>{selectedRow[givenColumn]}</span>
      </p>

      <div className="input-group">
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {hints[firstAnswerColumn] &&
            hints[firstAnswerColumn].map((hint, idx) => (
              <button
                key={idx}
                ref={(el) => (hintButtonRefs.current[idx] = el)}
                tabIndex={focusedHintIndex === idx ? 0 : -1}
                style={{
                  padding: "6px 12px",
                  border:
                    userAnswers.first === hint
                      ? "2px solid green"
                      : "1px solid #ccc",
                  borderRadius: "6px",
                  backgroundColor:
                    userAnswers.first === hint ? "#e1ffe1" : "#fff",
                  cursor: "pointer",
                  color: "black",
                }}
                onClick={() => {
                  setUserAnswers((prev) => ({ ...prev, first: hint }));
                  setFocusedHintIndex(idx);
                }}
                onKeyDown={(e) => {
                  const key = e.key;
                  if (["1", "2", "3", "4", "5", "6"].includes(key)) {
                    const index = parseInt(key, 10) - 1;
                    const selectedHint = hints[firstAnswerColumn][index];
                    if (selectedHint) {
                      setUserAnswers((prev) => ({
                        ...prev,
                        first: selectedHint,
                      }));
                      setFocusedHintIndex(index);
                      hintButtonRefs.current[index]?.focus();
                    }
                  } else if (e.key === "Enter") {
                    setUserAnswers((prev) => ({ ...prev, first: hint }));
                  }
                }}
              >
                {hint}
              </button>
            ))}
        </div>
        {results && results.first !== undefined && (
          <div style={{ marginTop: "5px" }}>
            {results.first ? (
              <span style={{ color: "green", fontWeight: "bold" }}>정답!</span>
            ) : (
              <span style={{ color: "red", fontWeight: "bold" }}>
                오답 (정답: {selectedRow[firstAnswerColumn]})
              </span>
            )}
          </div>
        )}
      </div>

      <div className="input-group">
        <p className="hint">{hints["P"] && hints["P"].join(", ")}</p>
        <input
          type="text"
          value={userAnswers.second}
          onChange={(e) => handleInputChange(e, "second")}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit(e);
            }
          }}
          list="hiragana-hints"
        />

        {results && results.second !== undefined && (
          <div style={{ marginTop: "5px" }}>
            {results.second ? (
              <span style={{ color: "green", fontWeight: "bold" }}>정답!</span>
            ) : (
              <span style={{ color: "red", fontWeight: "bold" }}>
                오답 (정답: {selectedRow["P"]})
              </span>
            )}
          </div>
        )}
      </div>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button onClick={handleRestart}>새 문제</button>
        <button onClick={handleSubmit}>제출</button>
      </div>
    </div>
  );
}

export default WordGame;
