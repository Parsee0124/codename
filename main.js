
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, ref, set, push, get, onValue, update } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyD8uxvprTCzafTnu6XAhLiNQCjpF7ThCDE",
  authDomain: "codename-c87d7.firebaseapp.com",
  databaseURL: "https://codename-c87d7-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "codename-c87d7",
  storageBucket: "codename-c87d7.appspot.com",
  messagingSenderId: "467635472662",
  appId: "1:467635472662:web:40f82f6e380b15e51ea837"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const createRoomBtn = document.getElementById("createRoom");
const joinRoomBtn = document.getElementById("joinRoom");
const roomIdInput = document.getElementById("roomIdInput");
const wordInput = document.getElementById("wordInput");
const startGameBtn = document.getElementById("startGame");
const endGameBtn = document.getElementById("endGame");
const board = document.getElementById("board");

let currentRoomId = null;

function showGameUI() {
  document.getElementById("lobby").style.display = "none";
  document.getElementById("game").style.display = "block";

  const isGM = localStorage.getItem("isGM") === "true";
  wordInput.disabled = !isGM;
  startGameBtn.style.display = isGM ? "inline-block" : "none";
  endGameBtn.style.display = isGM ? "inline-block" : "none";
}

function renderBoard(words) {
  board.innerHTML = "";
  words.forEach(word => {
    const card = document.createElement("div");
    card.className = "card";
    card.textContent = word;
    board.appendChild(card);
  });
}

createRoomBtn.onclick = async () => {
  const roomId = Math.floor(10000 + Math.random() * 90000).toString();
  await set(ref(db, "rooms/" + roomId), {
    createdAt: Date.now()
  });
  localStorage.setItem("isGM", "true");
  currentRoomId = roomId;
  showGameUI();
  alert("ルームID: " + roomId);
};

joinRoomBtn.onclick = async () => {
  const roomId = roomIdInput.value;
  const snapshot = await get(ref(db, "rooms/" + roomId));
  if (snapshot.exists()) {
    localStorage.setItem("isGM", "false");
    currentRoomId = roomId;
    showGameUI();
  } else {
    alert("ルームが存在しません");
  }
};

startGameBtn.onclick = async () => {
  const words = wordInput.value.trim().split(/\s+/);
  if (words.length < 25) {
    alert("25個以上の単語を入力してください");
    return;
  }
  // 25個ランダム選択
  const selected = [];
  while (selected.length < 25) {
    const rand = words[Math.floor(Math.random() * words.length)];
    if (!selected.includes(rand)) selected.push(rand);
  }
  await update(ref(db, "rooms/" + currentRoomId), {
    words: selected
  });
};

// 単語が更新されたら自動で盤面に表示
onValue(ref(db, "rooms"), snapshot => {
  if (!currentRoomId) return;
  const data = snapshot.val();
  const room = data[currentRoomId];
  if (room && room.words) {
    renderBoard(room.words);
  }
});
