

window.addEventListener("DOMContentLoaded", () => {
  const theme = document.querySelector("#theme") as HTMLButtonElement;

const config = localStorage.getItem("theme");

const body = document.querySelector("body");

body.dataset.theme = config === "light" ? "light" : "dark";

theme.onclick = () => {
  const body = document.querySelector("body");
  let mode = body.dataset.theme as string;
  mode = mode === "light" ? "dark" : "light";
  body.dataset.theme = mode;
  localStorage.setItem("theme", mode);
};
})