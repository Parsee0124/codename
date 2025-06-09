import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, set, get, onValue, update, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

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

const appDiv = document.getElementById("app");

let roomId = null;
let isGM = false;
let myRole = null;

function renderInitial() {
  appDiv.innerHTML = \`
    <h2>コードネーム風ゲーム</h2>
    <button id="createRoom">ルーム作成</button>
    <input id="roomInput" placeholder="ルーム番号" />
    <button id="joinRoom">参加</button>
  \`;

  document.getElementById("createRoom").onclick = async () => {
    roomId = Math.floor(100000 + Math.random() * 900000).toString();
    isGM = true;
    await set(ref(db, "rooms/" + roomId), {
      gm: true,
      state: "waiting"
    });
    enterRoom();
  };

  document.getElementById("joinRoom").onclick = () => {
    const input = document.getElementById("roomInput").value;
    if (input.length === 6) {
      roomId = input;
      isGM = false;
      enterRoom();
    }
  };
}

function enterRoom() {
  appDiv.innerHTML = \`
    <h2>ルーム：\${roomId}</h2>
    <div id="roleSelect"></div>
    <div id="wordInputArea">\${isGM ? "<textarea id='wordInput' rows='5' cols='30'></textarea><br><button id='startGame'>ゲームスタート</button>" : ""}</div>
    <div id="board"></div>
    <button id="toggleView">モード切替</button>
    <button id="endGame">ゲーム終了</button>
  \`;

  if (!isGM) renderRoleSelection();

  if (isGM) {
    document.getElementById("startGame").onclick = async () => {
      const inputWords = document.getElementById("wordInput").value.split(/\s+/).filter(w => w);
      if (inputWords.length < 25) {
        alert("25単語以上入力してください");
        return;
      }
      const selected = [];
      while (selected.length < 25) {
        const i = Math.floor(Math.random() * inputWords.length);
        const word = inputWords[i];
        if (!selected.includes(word)) selected.push(word);
      }
      const roles = assignRoles();
      const board = selected.map((word, i) => ({
        word,
        revealed: false,
        role: roles[i]
      }));
      await update(ref(db, "rooms/" + roomId), {
        board,
        state: "started"
      });
    };
  }

  document.getElementById("toggleView").onclick = () => {
    appDiv.classList.toggle("spymaster-view");
  };

  document.getElementById("endGame").onclick = async () => {
    if (confirm("ゲームを終了しますか？")) {
      await remove(ref(db, "rooms/" + roomId));
      renderInitial();
    }
  };

  onValue(ref(db, "rooms/" + roomId + "/board"), (snap) => {
    const board = snap.val();
    if (board) renderBoard(board);
  });
}

function renderRoleSelection() {
  const roles = ["赤チームSM", "赤チームエージェント", "青チームSM", "青チームエージェント", "観戦者"];
  const container = document.getElementById("roleSelect");
  container.innerHTML = "<p>役職を選択：</p>";
  roles.forEach(role => {
    const btn = document.createElement("button");
    btn.textContent = role;
    btn.onclick = () => {
      myRole = role;
      container.innerHTML = "<p>あなたの役職：" + myRole + "</p>";
    };
    container.appendChild(btn);
  });
}

function renderBoard(board) {
  const boardDiv = document.getElementById("board");
  boardDiv.innerHTML = "";
  const grid = document.createElement("div");
  grid.className = "grid";
  board.forEach((card, index) => {
    const div = document.createElement("div");
    div.className = "card";
    div.textContent = card.word;
    div.dataset.role = card.role;
    if (card.revealed) {
      div.classList.add("revealed", card.role);
    } else if (appDiv.classList.contains("spymaster-view")) {
      div.classList.add(card.role);
    }
    div.onclick = async () => {
      if (isGM && !card.revealed) {
        board[index].revealed = true;
        await set(ref(db, "rooms/" + roomId + "/board"), board);
      }
    };
    grid.appendChild(div);
  });
  boardDiv.appendChild(grid);
}

function assignRoles() {
  const roles = Array(9).fill("red")
    .concat(Array(8).fill("blue"))
    .concat(Array(7).fill("neutral"))
    .concat("black");
  for (let i = roles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [roles[i], roles[j]] = [roles[j], roles[i]];
  }
  return roles;
}

renderInitial();