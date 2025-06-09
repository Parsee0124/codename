
let words = [];
let shuffledWords = [];
let cardColors = [];
let isGameMaster = false;
let flippedStates = [];

document.getElementById('wordInput').addEventListener('input', updateWordCount);

function updateWordCount() {
  const inputText = document.getElementById('wordInput').value.trim();
  const wordList = inputText.split(/\n|\r/).filter(w => w.trim() !== '');
  document.getElementById('wordCount').textContent = `現在 ${wordList.length} 個`;
  words = wordList;
}

function startGame() {
  if (words.length < 25) {
    alert("単語は最低25個必要です。");
    return;
  }
  // 単語と色を初期化
  shuffledWords = shuffle(words).slice(0, 25);
  cardColors = assignColors();
  flippedStates = new Array(25).fill(false);
  renderBoard();
}

function toggleMode() {
  isGameMaster = !isGameMaster;
  document.getElementById("modeLabel").textContent = isGameMaster ? "ゲームマスター" : "プレイヤー";
  renderBoard(); // 状態を変えずに再描画だけ
}

function renderBoard() {
  const board = document.getElementById("board");
  board.innerHTML = "";

  shuffledWords.forEach((word, i) => {
    const btn = document.createElement("button");
    btn.textContent = word;
    btn.className = "card";

    if (flippedStates[i]) {
      btn.classList.add("flipped", cardColors[i]);
    } else if (isGameMaster) {
      btn.classList.add(cardColors[i]);
    }

    btn.onclick = () => {
      if (!flippedStates[i]) {
        flippedStates[i] = true;
        renderBoard();
      }
    };
    board.appendChild(btn);
  });
}

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function assignColors() {
  const colors = Array(9).fill("red")
    .concat(Array(8).fill("blue"))
    .concat(Array(7).fill("neutral"))
    .concat("assassin");
  return shuffle(colors);
}
