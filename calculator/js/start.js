const start = document.querySelector(".start");
const startIcon = document.querySelector(".start__icon");
const calculator = document.querySelector(".calculator");

const HIDDEN_CLASSNAME = "hidden";

function startCalculator() {
  start.classList.add(HIDDEN_CLASSNAME);
  calculator.classList.remove(HIDDEN_CLASSNAME);
}

calculator.classList.add(HIDDEN_CLASSNAME);
startIcon.addEventListener("click", startCalculator);
