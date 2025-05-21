const btnPerc = document.getElementById("%");
const btnC = document.querySelector("#C");
const btnRnd = document.querySelector("#rnd");
const btnDel = document.getElementById("<=");
const btnOneX = document.getElementById("1/x");
const btnPow = document.getElementById("x**2");
const btnSqX = document.querySelector("#sqX");
const buttons = document.querySelectorAll(".number-btn");
const operatorsBtn = document.querySelectorAll(".operator-btn");
const btnEquals = document.getElementById("equal");
const btnNegate = document.getElementById("+-");
const btnFloat = document.getElementById(".");
const display = document.querySelector("#display");
const toggleBtn = document.getElementById("theme-toggle");

const displayValue = display.value;
const operatorsMas = ["+", "-", "*", "/"];

let shouldClearInput = false; //Delete after operation
let floatPerm = true;

//Button Rnd
btnRnd.onclick = function () {
  display.value = display.value + String(Math.floor(Math.random() * 99) + 1);
};
//Button C
btnC.onclick = function () {
  shouldClearInput = false;
  display.value = "";
  floatPerm = true;
};

//Button 1/x
btnOneX.onclick = () => {
  if (display.value !== "") {
    display.value = parseFloat((1 / eval(display.value)).toFixed(10));
    shouldClearInput = true;
    floatPerm = true;
  }
};

//Button x**2
btnPow.onclick = () => {
  if (display.value !== "") {
    display.value = eval(display.value) ** 2;
    shouldClearInput = true;
    floatPerm = true;
  }
};

//Button sqX
btnSqX.onclick = () => {
  if (display.value !== "") {
    display.value = parseFloat(Math.sqrt(eval(display.value)).toFixed(10));
    shouldClearInput = true;
    floatPerm = true;
  }
};

//Button Float .
btnFloat.onclick = () => {
  const displ = display.value;
  if (display.value === "") {
    display.value = "0.";
    floatPerm = false;
  } else if (!lastCharIsOperator(displ) && displ[displ.length - 1] !== "." && floatPerm === true) {
    display.value = display.value + ".";
    floatPerm = false;
  }
};

//Button Delete <=
btnDel.onclick = function () {
  shouldClearInput = false;
  display.value = display.value.slice(0, -1);
};

//Buttons 1-9 Click
buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (shouldClearInput) {
      display.value = "";
      shouldClearInput = false;
    }
    if (display.value.length < 20) {
      display.value += btn.textContent;
    }
  });
});

//Buttons +-*/
function lastCharIsOperator(str) {
  return operatorsMas.includes(str[str.length - 1]);
}

operatorsBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (shouldClearInput) {
      shouldClearInput = false;
      display.value += btn.textContent;
    } else if (display.value !== "" && !lastCharIsOperator(display.value) && display.value[display.value.length - 1] !== ".") {
      display.value += btn.textContent;
      floatPerm = true;
    }
  });
});

//Button =
btnEquals.onclick = function () {
  if (!lastCharIsOperator(display.value) && display.value !== "") {
    display.value = parseFloat(eval(display.value).toFixed(10));
    shouldClearInput = true;
    floatPerm = true;
  }
};
//Button +-

function lastIndexOperator() {
  const last = operatorsMas.reduce((maxIndex, elemOper) => {
    let index = display.value.lastIndexOf(elemOper);
    return index > maxIndex ? index : maxIndex;
  }, -1);
  return last;
}

btnNegate.onclick = function () {
  if (display.value === "") return;
  const lastOpIndex = lastIndexOperator();
  const indexAfterOp = lastOpIndex + 1;

  if (lastOpIndex !== -1) {
    const sliceAfterOp = display.value.slice(indexAfterOp);
    const indexBeforOp = display.value[lastOpIndex - 1];

    if ((display.value[lastOpIndex] === "-" && operatorsMas.includes(indexBeforOp)) || indexBeforOp === undefined) {
      display.value = display.value.slice(0, lastOpIndex) + display.value.slice(indexAfterOp);
    } else display.value = display.value.slice(0, indexAfterOp) + "-" + sliceAfterOp;
  } else display.value = "-" + display.value;
};

//Button %
btnPerc.onclick = function () {
  if (display.value === "") return;
  const lastOpIndex = lastIndexOperator();
  const indexAfterOp = lastOpIndex + 1;
  if (lastOpIndex !== -1 && display.value.slice(indexAfterOp) >= 1) {
    display.value = display.value.slice(0, indexAfterOp) + display.value.slice(indexAfterOp) / 100;
  } else if (display.value >= 1) {
    display.value = display.value / 100;
  }
};

//Tema Button
toggleBtn.onclick = function () {
  const themeToDark = [
    document.body,
    document.querySelector(".calculator"),
    document.getElementById("display"),
    ...document.querySelectorAll(".number-btn-color"),
    document.getElementById("equal"),
    ...document.querySelectorAll(".oper-color"),
    ...document.querySelectorAll(".circl-btn"),
  ];
  themeToDark.forEach((el) => {
    if (el) {
      el.classList.toggle("dark");
    }
  });

  toggleBtn.textContent = document.body.classList.contains("dark") ? "🌚" : "🌞";
  //Save Theme
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
};

// Auto Thema
window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("theme") === "dark") {
    toggleBtn.click();
  }
});
