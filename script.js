let mode = "player"; // または "gm"
const colors = ["red", "blue", "neutral", "black"];

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function updateCounter() {
  const input = document.getElementById("word-input").value;
  const count = input.trim().split(/\s+/).filter(w => w.length > 0).length;
  document.getElementById("counter").innerText = count + " / 25";
}

document.getElementById("word-input").addEventListener("input", updateCounter);

function startGame() {
  const input = document.getElementById("word-input").value.trim().split(/\s+/).filter(w => w.length > 0);
  if (input.length < 25) {
    alert("25個以上の単語を入力してください");
    return;
  }

  const selectedWords = input.sort(() => 0.5 - Math.random()).slice(0, 25);
  const board = document.getElementById("board");
  board.innerHTML = "";

  let colorPool = Array(9).fill("red").concat(Array(8).fill("blue"), Array(7).fill("neutral"), ["black"]);
  shuffle(colorPool);

  selectedWords.forEach((word, index) => {
    const div = document.createElement("div");
    const color = colorPool[index];
    div.className = "card";
    div.textContent = word;

    if (mode === "gm") {
      div.classList.add("gm-" + color);
    }

    div.addEventListener("click", () => {
      if (mode === "player") {
        div.classList.add("revealed-" + color);
      }
    });

    board.appendChild(div);
  });
}

function toggleMode() {
  mode = (mode === "player") ? "gm" : "player";
  startGame();
}
