// Firebaseの設定と初期化
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyD8uxvprTCzafTnu6XAhLiNQCjpF7ThCDE",
  authDomain: "codename-c87d7.firebaseapp.com",
  databaseURL: "https://codename-c87d7-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "codename-c87d7",
  storageBucket: "codename-c87d7.appspot.com",
  messagingSenderId: "467635472662",
  appId: "1:467635472662:web:40f82f6e380b15e51ea837"
};

// FirebaseアプリとRealtime Databaseのエクスポート
export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
