const display = document.querySelector(".calculator__display--number");
const btns = document.querySelectorAll(".calculator__btn");
const previousDisplay = document.querySelector(".calculator__display--previous");
const btnAcDel = document.querySelector(".calculator__btn--acdel");

let currentInput = "0";
let previousInput = null;
let operator = null;
let shouldResetDisplay = false;

function handlePreviousDisplay(prev, operator, curr) {
  previousDisplay.textContent = `${prev}${operator}${curr}`;
}

function handleBtnAcDel(event) {
  const btnAcDel = event.target.textContent;
  if (btnAcDel == "ac") {
    currentInput = "0";
    previousInput = null;
    operator = null;
    shouldResetDisplay = false;
    previousDisplay.textContent = "";
  } else {
    //btnAcDel == "del"
    if (shouldResetDisplay) {
      if (operator) {
        operator = null;
        currentInput = previousInput;
        previousInput = null;
      }
      shouldResetDisplay = false;
    } else {
      if (currentInput.length === 1) {
        currentInput = "0";
      } else {
        currentInput = currentInput.slice(0, -1);
      }
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
  } else if (operator === "-") {
    currentInput = (prev - curr).toString();
  } else if (operator === "x") {
    currentInput = (prev * curr).toString();
  } else if (operator === "/") {
    currentInput = (prev / curr).toString();
  } else {
    //%
    currentInput = (prev % curr).toString();
  }
  handlePreviousDisplay(prev, operator, curr);

  previousInput = null;
  operator = null;
  shouldResetDisplay = true;

  updateDisplay();
  setTimeout(() => {
    // 동기, 비동기 문제
    btnAcDel.textContent = "ac";
  }, 0);
}

function handleOperatorInput(clickButtonValue) {
  previousInput = currentInput;
  operator = clickButtonValue;
  shouldResetDisplay = true;
  updateDisplay();
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
  if (previousInput !== null && operator !== null && shouldResetDisplay) {
    display.textContent = previousInput + "" + operator;
  } else {
    display.textContent = currentInput;
  }
}

//화면 클릭
function handleButtonClick(event) {
  const clickButtonValue = event.target.textContent;

  if (!isNaN(clickButtonValue)) {
    //Number
    handleNumberInput(clickButtonValue);
  } else if (clickButtonValue == "ac" || clickButtonValue == "del") {
    handleBtnAcDel(event);
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
    btnAcDel.textContent = "ac";
    calculate();
  } else {
    // %, /, x, -, +,
    handleOperatorInput(clickButtonValue);
  }
}

btns.forEach((btn) => {
  btn.addEventListener("click", handleButtonClick);

  //버튼 클릭 효과
  btn.addEventListener("click", function () {
    this.classList.add("btnActive");
    setTimeout(() => {
      this.classList.remove("btnActive");
    }, 75);
  });

  btn.addEventListener("click", function () {
    if (display.textContent != 0) {
      btnAcDel.textContent = "del";
    } else {
      btnAcDel.textContent = "ac";
    }
  });
});
updateDisplay();
