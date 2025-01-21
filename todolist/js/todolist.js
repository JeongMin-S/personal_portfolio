const toDoListScreen = document.querySelector(".toDoListScreen");
const formInputValue = document.querySelector(".toDoListScreen__form--input");
const toDoListScreen__list = document.querySelector(".toDoListScreen__list");
const toDoCal = document.querySelector(".toDoListScreen_cal");

//로컬 스토리지
let toDos = [];

//현재 시간
let selectedDate = new Date()
  .toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" })
  .split(". ")
  .map((num) => num.padStart(2, "0"))
  .join("-")
  .replace(/\.$/, "");
toDoCal.innerText = selectedDate;

//할 일 수정 기능
function modDo(event) {
  const li = event.target.parentElement;
  const span = li.querySelector("span");
  const modMode = event.target;

  if (modMode.innerText === "⏎") {
    const input = li.querySelector("input");
    const newValue = input.value;

    span.innerText = newValue;
    span.style.display = "inline";
    input.remove();

    const toDoIndex = toDos.findIndex((toDo) => toDo.id === Number(li.id));
    if (toDoIndex > -1) {
      toDos[toDoIndex].value = newValue;
      saveToDos(); //
    }

    modMode.innerText = "✍︎";
  } else {
    const input = document.createElement("input");
    input.type = "text";
    input.value = span.innerText;
    span.style.display = "none";
    li.insertBefore(input, span.nextSibling);
    modMode.innerText = "⏎";
  }
}

//할 일 삭제 기능
function delToDo(event) {
  const li = event.target.parentElement;
  li.remove();
  toDos = toDos.filter((toDo) => toDo.id !== Number(li.id));
  saveToDos();
  updateCalendarEvents();
}

//할 일 체크 기능
function checkToDo(event) {
  const li = event.target.parentElement;
  const span = li.querySelector("span");

  span.classList.toggle("checked");

  const toDoIndex = toDos.findIndex((toDo) => toDo.id === Number(li.id));
  if (toDoIndex > -1) {
    toDos[toDoIndex].checked = span.classList.contains("checked"); // ✅ 체크 여부 저장
    saveToDos();
    updateCalendarEvents(); // ✅ 캘린더 업데이트 추가
  }
}

//로컬 스토리지 저장 기능
function saveToDos() {
  localStorage.setItem("toDos", JSON.stringify(toDos));
}

//입력 받은 할 일 보여주기
function showToDoList(toDoListObj) {
  const li = document.createElement("li");
  li.id = toDoListObj.id;
  li.draggable = "true";

  const buttonCheck = document.createElement("button");
  buttonCheck.innerText = "✓";
  const span = document.createElement("span");
  span.innerText = toDoListObj.value;
  const buttonDel = document.createElement("button");
  buttonDel.innerText = "✕";
  const buttonMod = document.createElement("button");
  buttonMod.innerText = "✍︎";

  buttonCheck.addEventListener("click", checkToDo);
  buttonDel.addEventListener("click", delToDo);
  buttonMod.addEventListener("click", modDo);

  li.appendChild(buttonCheck);
  li.appendChild(span);
  li.appendChild(buttonDel);
  li.appendChild(buttonMod);
  toDoListScreen__list.append(li);
}

//할 일 저장하기
function handleToDoSubmit(event) {
  event.preventDefault();

  const newToDo = formInputValue.value;
  console.log(newToDo);

  const toDoListObj = {
    id: Date.now(),
    value: newToDo,
    checked: false,
    date: selectedDate,
  };
  toDos.push(toDoListObj);

  saveToDos();
  showToDoList(toDoListObj);
  showToDoListByDate(selectedDate); // 현재 선택한 날짜의 목록 표시
  updateCalendarEvents();
  formInputValue.value = "";
}

function updateSelectedDate(date) {
  selectedDate = date;
  showToDoListByDate(selectedDate);
  toDoCal.innerText = selectedDate;
}

toDoListScreen.addEventListener("submit", handleToDoSubmit);
const svaedToDos = localStorage.getItem("toDos");
