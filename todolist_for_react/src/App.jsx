import { useState, useEffect } from "react";

function App() {
  // -메인 화면
  //     -달력
  //         달력에 특정 날짜 클릭 시 해당 날짜의 todolist 출력
  //         완료하지 않은 할 일 존재 시 달력에 표시(완료하지 않은 할 일의 개수 표시)
  //     -투두리스트(할 일 목표 표시)
  //         할 일 추가 기능!
  //         할 일 삭제 기능!
  //         할 일 완료 했을 때 체크 기능!
  //         할 일 수정 기능!

  const [toDoList, setToDoList] = useState(() => {
    const savedToDoList = localStorage.getItem("toDoList");
    return savedToDoList ? JSON.parse(savedToDoList) : [];
  });
  const [text, setText] = useState("");

  useEffect(() => {
    const savedToDoList = localStorage.getItem("toDoList");
    if (savedToDoList) {
      setToDoList(JSON.parse(savedToDoList));
    }
  }, []);

  // toDoList 상태가 변경될 때마다 로컬 스토리지에 저장합니다.
  useEffect(() => {
    localStorage.setItem("toDoList", JSON.stringify(toDoList));
  }, [toDoList]);

  const onChange = (event) => {
    setText(event.target.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    if (text === "") return;
    setToDoList((currentArray) => [
      { text, completed: false, editing: false },
      ...currentArray,
    ]);
    setText("");
  };

  //수정모드 토글
  const toggleEditMode = (index) => {
    setToDoList((currentArray) =>
      currentArray.map((item, i) =>
        i === index ? { ...item, editing: !item.editing } : item
      )
    );
  };

  //수정
  const updateToDo = (index, newText) => {
    setToDoList((currentArray) =>
      currentArray.map((item, i) =>
        i === index ? { ...item, text: newText, editing: false } : item
      )
    );
  };

  //할일 삭제 기능
  const delToDo = (index) => {
    setToDoList((currentArray) =>
      currentArray.filter((item, i) => i !== index)
    );
  };

  //할일 체크 기능
  const checkToDo = (index) => {
    setToDoList((currentArray) =>
      currentArray.map((item, i) =>
        i === index ? { ...item, completed: !item.completed } : item
      )
    );
  };

  return (
    <>
      <div>Calendar</div>
      <div>
        <form onSubmit={onSubmit}>
          <input
            onChange={onChange}
            value={text}
            placeholder="Add Your ToDoList"
            type="text"
            required
          />
          <button>Add</button>
        </form>
        <hr />
        {toDoList.map((item, index) => (
          <div
            key={index}
            style={{
              textDecoration: item.completed ? "line-through" : "none",
            }}
          >
            {item.editing ? (
              <>
                <input
                  type="text"
                  value={item.text}
                  onChange={(e) => {
                    const newText = e.target.value;

                    setToDoList((currentArray) =>
                      currentArray.map((el, i) =>
                        i === index ? { ...el, text: newText } : el
                      )
                    );
                  }}
                />
                <button onClick={() => updateToDo(index, item.text)}>⏎</button>
              </>
            ) : (
              <>
                <button onClick={() => checkToDo(index)}>✓</button>
                {item.text}
                <button onClick={() => delToDo(index)}>✕</button>
                <button onClick={() => toggleEditMode(index)}>✍︎</button>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
