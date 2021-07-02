const config = localStorage.getItem("theme");

window.addEventListener("DOMContentLoaded", () => {
  const body = document.querySelector("body");

  body.dataset.theme = config;

  const theme = document.querySelector("#theme") as HTMLButtonElement;
  theme.onclick = () => {
    const body = document.querySelector("body");
    let mode = body.dataset.theme as string;
    mode = mode === "light" ? "dark" : "light";
    body.dataset.theme = mode;
    localStorage.setItem("theme", mode);
  };
});
