const toDoListScreen = document.querySelector(".toDoListScreen");
const formInputValue = document.querySelector(".toDoListScreen__form--input");
const toDoListScreen__list = document.querySelector(".toDoListScreen__list");

let toDos = [];

//할 일 삭제 기능
function delToDo(event) {
  const li = event.target.parentElement;
  li.remove();
  toDos = toDos.filter((toDo) => toDo.id !== Number(li.id));
  saveToDos();
}

//할 일 체크 기능
function checkToDo(event) {
  const li = event.target.parentElement;
  const span = li.querySelector("span");

  span.classList.toggle("checked");
}

//로컬 스토리지 저장 기능
function saveToDos() {
  localStorage.setItem("toDos", JSON.stringify(toDos));
}

//입력 받은 할 일 보여주기
function showToDoList(toDoListObj) {
  const li = document.createElement("li");
  li.id = toDoListObj.id;

  const buttonCheck = document.createElement("button");
  buttonCheck.innerText = "✓";
  const span = document.createElement("span");
  span.innerText = toDoListObj.value;
  const buttonDel = document.createElement("button");
  buttonDel.innerText = "✕";

  buttonCheck.addEventListener("click", checkToDo);
  buttonDel.addEventListener("click", delToDo);

  li.appendChild(buttonCheck);
  li.appendChild(span);
  li.appendChild(buttonDel);
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
  };
  toDos.push(toDoListObj);

  saveToDos();
  showToDoList(toDoListObj);

  formInputValue.value = "";
}

toDoListScreen.addEventListener("submit", handleToDoSubmit);
const svaedToDos = localStorage.getItem("toDos");
