const display = document.querySelector(".calculator__display--number");
const btns = document.querySelectorAll(".calculator__btn");

const previousDisplay = document.querySelector(".calculator__display--previous");
//calculator__previous--display
// calculator__display--previous
let currentInput = "0";
let previousInput = null;
let operator = null;
let shouldResetDisplay = false;

function handlePreviousDisplay(prev, operator, curr) {
  previousDisplay.textContent = `${prev}${operator}${curr}`;
}

function resetCalculator() {
  if (shouldResetDisplay) {
    currentInput = "0";
    previousInput = null;
    operator = null;
    shouldResetDisplay = false;
    previousDisplay.textContent = null;
  } else {
    if (currentInput.length > 1) {
      currentInput = currentInput.slice(0, -1);
    } else {
      currentInput = "0";
    }
  }
  updateDisplay();
}
function calculate() {
  if (!operator || previousInput === null) {
    return;
  }
  const prev = parseFloat(previousInput);
  const curr = parseFloat(currentInput);

  if (operator === "+") {
    currentInput = (prev + curr).toString();
    handlePreviousDisplay(prev, operator, curr);
  } else if (operator === "-") {
    currentInput = (prev - curr).toString();
    handlePreviousDisplay(prev, operator, curr);
  } else if (operator === "x") {
    currentInput = (prev * curr).toString();
    handlePreviousDisplay(prev, operator, curr);
  } else if (operator === "/") {
    currentInput = (prev / curr).toString();
    handlePreviousDisplay(prev, operator, curr);
  } else {
    //%
    currentInput = (prev % curr).toString();
    handlePreviousDisplay(prev, operator, curr);
  }
  previousInput = null;
  operator = null;
  shouldResetDisplay = true;
  updateDisplay();
}

function handleOperatorInput(clickButtonValue) {
  previousInput = currentInput;
  operator = clickButtonValue;
  shouldResetDisplay = true; //?
}

function handleNumberInput(number) {
  if (shouldResetDisplay) {
    currentInput = number;
    shouldResetDisplay = false;
  } else {
    if (currentInput === "0") {
      currentInput = number;
    } else {
      currentInput = currentInput + number;
    }
  }
  updateDisplay();
}

function updateDisplay() {
  display.textContent = currentInput;
}

//화면 클릭
function handleButtonClick(event) {
  const clickButtonValue = event.target.textContent;

  if (!isNaN(clickButtonValue)) {
    //Number
    handleNumberInput(clickButtonValue);
  } else if (clickButtonValue == "ac") {
    resetCalculator();
  } else if (clickButtonValue == "+/-") {
    currentInput *= -1;
    updateDisplay();
  } else if (clickButtonValue == ".") {
    if (!currentInput.includes(".")) {
      currentInput += ".";
      updateDisplay();
    }
  } else if (clickButtonValue == "a") {
    // 이전 기록 확인
  } else if (clickButtonValue == "=") {
    calculate();
  } else {
    // %, /, x, -, +,
    handleOperatorInput(clickButtonValue);
  }
}

updateDisplay();

btns.forEach((btn) => {
  btn.addEventListener("click", handleButtonClick);
});
