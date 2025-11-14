let currentTool = "lip";
let currentColor = "#FFB7D3";

const tools = document.querySelectorAll(".tool");
const swatches = document.querySelectorAll(".swatch");
const face = document.getElementById("face");

// tool change
tools.forEach(btn => {
  btn.addEventListener("click", () => {
    tools.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentTool = btn.dataset.tool;
  });
});

// color change
swatches.forEach(s => {
  s.addEventListener("click", () => {
    swatches.forEach(x => x.classList.remove("selected"));
    s.classList.add("selected");
    currentColor = s.dataset.color;
  });
});

// click to apply makeup
face.addEventListener("click", e => {
  const part = e.target.id;

  if (currentTool === "lip" && part === "lip") {
    e.target.setAttribute("fill", currentColor);
  }

  if (currentTool === "blush" && (part === "cheekL" || part === "cheekR")) {
    e.target.setAttribute("fill", currentColor + "88"); // transparan
  }

  if (currentTool === "eye" && (part === "eyeL" || part === "eyeR")) {
    e.target.setAttribute("fill", currentColor + "AA");
  }
});
