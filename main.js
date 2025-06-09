
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, set, onValue, get, child } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyD8uxvprTCzafTnu6XAhLiNQCjpF7ThCDE",
  authDomain: "codename-c87d7.firebaseapp.com",
  databaseURL: "https://codename-c87d7-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "codename-c87d7",
  storageBucket: "codename-c87d7.firebasestorage.app",
  messagingSenderId: "467635472662",
  appId: "1:467635472662:web:40f82f6e380b15e51ea837"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// 以下は関数の骨組み（本物はこのあと実装拡張する）
window.createRoom = async function () {
  const roomId = Math.floor(Math.random() * 100000).toString();
  await set(ref(db, "rooms/" + roomId), { status: "waiting" });
  alert("ルームID: " + roomId);
};

window.joinRoom = async function () {
  const roomId = document.getElementById("roomId").value;
  const snap = await get(child(ref(db), "rooms/" + roomId));
  if (snap.exists()) {
    alert("ルーム参加成功: " + roomId);
    document.getElementById("setup").style.display = "none";
    document.getElementById("roleSelect").style.display = "block";
  } else {
    alert("ルームが見つかりません");
  }
};

window.selectRole = function (role) {
  document.getElementById("roleSelect").style.display = "none";
  document.getElementById("game").style.display = "block";
};

window.startGame = function () {
  const words = document.getElementById("wordInput").value.trim().split(/\s+/).slice(0, 25);
  const board = document.getElementById("board");
  board.innerHTML = "";
  words.forEach(word => {
    const div = document.createElement("div");
    div.className = "card neutral";
    div.textContent = word;
    board.appendChild(div);
  });
};

window.endGame = function () {
  if (confirm("本当に終了しますか？")) {
    location.reload();
  }
};
