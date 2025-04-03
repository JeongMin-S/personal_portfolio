import React, { useState } from "react";

// 미리 업로드된 CSV 파일의 계층 구조 예시
// 예: "csv/eng/a/17page.csv", "csv/eng/a/21page.csv", "csv/jpn/wokrmaster/17page.csv", 등
const csvStructure = {
  jpn: {
    "2ndstep": {
      page9: "word/jpn/2ndstep/page9.csv",
      page17: "word/jpn/2ndstep/page17.csv",
      page25: "word/jpn/2ndstep/page25.csv",
    },
    daisukinihongo: {
      chapter3: "word/jpn/daisukinihongo/chapter3.csv",
    },
    personal: {
      i: "word/jpn/personal/i.csv",
      na: "word/jpn/personal/na.csv",
    },
  },
};

function parseCSV(csvString) {
  const lines = csvString.trim().split("\n");
  if (lines.length < 2) return [];
  const headers = lines[0].split(",");
  return lines.slice(1).map((line) => {
    const values = line.split(",");
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = values[index];
    });
    return obj;
  });
}

function CSVSelector({ onFileLoaded }) {
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedBook, setSelectedBook] = useState("");
  const [selectedPage, setSelectedPage] = useState("");

  function loadCSV(url) {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("CSV 파일 로드 실패: " + response.status);
        }
        return response.text();
      })
      .then((text) => {
        const data = parseCSV(text);
        if (data.length === 0) {
          alert("CSV 파일 내용이 비어있습니다.");
          return;
        }
        onFileLoaded(data);
      })
      .catch((err) => {
        console.error(err);
        alert("CSV 파일을 불러오지 못했습니다.");
      });
  }

  function handleLanguageChange(e) {
    setSelectedLanguage(e.target.value);
    setSelectedBook("");
    setSelectedPage("");
  }

  function handleBookChange(e) {
    setSelectedBook(e.target.value);
    setSelectedPage("");
  }

  function handlePageChange(e) {
    setSelectedPage(e.target.value);
    if (selectedLanguage && selectedBook && e.target.value) {
      const url = csvStructure[selectedLanguage][selectedBook][e.target.value];
      loadCSV(url);
    }
  }

  function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (event) {
      const text = event.target.result;
      const data = parseCSV(text);
      if (data.length === 0) {
        alert("CSV 파일 내용이 비어있습니다.");
        return;
      }
      onFileLoaded(data);
    };
    reader.readAsText(file);
  }

  return (
    <div>
      <div className="section">
        <p className="section-title">미리 업로드된 CSV 파일 선택</p>
        <div>
          <select value={selectedLanguage} onChange={handleLanguageChange}>
            <option value="">-- 언어 선택 --</option>
            {Object.keys(csvStructure).map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>
        {selectedLanguage && (
          <div>
            <select value={selectedBook} onChange={handleBookChange}>
              <option value="">-- 책/폴더 선택 --</option>
              {Object.keys(csvStructure[selectedLanguage]).map((book) => (
                <option key={book} value={book}>
                  {book}
                </option>
              ))}
            </select>
          </div>
        )}
        {selectedLanguage && selectedBook && (
          <div>
            <select value={selectedPage} onChange={handlePageChange}>
              <option value="">-- 페이지 선택 --</option>
              {Object.keys(csvStructure[selectedLanguage][selectedBook]).map(
                (page) => (
                  <option key={page} value={page}>
                    {page}
                  </option>
                )
              )}
            </select>
          </div>
        )}
      </div>
      <div className="section">
        <p className="section-title">또는 내 로컬 파일 업로드</p>
        <input type="file" accept=".csv" onChange={handleFileUpload} />
      </div>
      <pre>
        CSV 파일 예시:
        {"\n"}W,M,P{"\n"}あれ,저것,あれ{"\n"}椅子,의자,いす{"\n"}傘,우산,かさ
      </pre>
    </div>
  );
}

export default CSVSelector;
