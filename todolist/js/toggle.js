const btn = document.querySelector(".toggle--btn");
const mainScreen = document.querySelector(".main");

mainScreen.classList.add("hidden");

btn.addEventListener("click", function () {
  btn.classList.add("hidden");
  mainScreen.classList.remove("hidden");
});
