const start = document.querySelector(".start");
const startIcon = document.querySelector(".start__icon");
const calculatorGreetings = document.querySelector(".calculator");

const HIDDEN_CLASSNAME = "hidden";

function startCalculator() {
  start.classList.add(HIDDEN_CLASSNAME);
  calculatorGreetings.classList.remove(HIDDEN_CLASSNAME);
}

calculatorGreetings.classList.add(HIDDEN_CLASSNAME);
startIcon.addEventListener("click", startCalculator);
