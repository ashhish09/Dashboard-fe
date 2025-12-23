function openfeatures() {
  let featall = document.querySelectorAll(".div");
  let fmain = document.querySelectorAll(".featuremain");
  let maincontent = document.querySelector(".main");
  let back = document.querySelectorAll(".featuremain .back");

  featall.forEach((elem) => {
    elem.addEventListener("click", () => {
      fmain[elem.id].style.display = "block";
      maincontent.style.display = "none";
    });
  });

  back.forEach((elemm) => {
    elemm.addEventListener("click", () => {
      fmain[elemm.id].style.display = "none";
      maincontent.style.display = "block";
    });
  });
}

openfeatures();

let input = document.querySelector(".btn input");
let add = document.querySelector(".btn button");
let teenu = document.querySelector(".teenu");

add.addEventListener("click", () => {
  if (input.value.trim() === "") {
    alert("Please enter a task");
    return;
  }
  let li = document.createElement("li");
  li.textContent = input.value;

  let icon = document.createElement("i");
  icon.className = "ri-close-large-line";
  li.appendChild(icon);

  teenu.appendChild(li);
  input.value = "";

  adddata();
});
teenu.addEventListener("click", (e) => {
  if (e.target.classList.contains("ri-close-large-line")) {
    e.target.parentElement.remove();
  } else if (e.target.tagName === "LI") {
    e.target.classList.toggle("checked");
  }
  adddata();
});
teenu.addEventListener("dblclick", (e) => {
  if (e.target.tagName === "LI") {
    e.target.classList.toggle("checked");
    adddata();
  }
});
function adddata() {
  let tasks = [];
  document.querySelectorAll(".teenu li").forEach((li) => {
    tasks.push({
      task: li.firstChild.textContent,
      completed: li.classList.contains("checked"),
    });
  });
  localStorage.setItem("data", JSON.stringify(tasks));
}
function showdata() {
  let data = JSON.parse(localStorage.getItem("data")) || [];
  teenu.textContent = "";
  data.forEach((item) => {
    let li = document.createElement("li");
    li.textContent = item.task;
    if (item.completed) {
      li.classList.add("checked");
    }
    let icon = document.createElement("i");
    icon.className = "ri-close-large-line";
    li.appendChild(icon);

    teenu.appendChild(li);
  });
}

showdata();

//
const planner = document.getElementById("planner");
const STORAGE_KEY = "dailyPlanner";

function formatTime(hour) {
  let start = hour;
  let end = hour + 1;

  const format = (h) => {
    let period = h >= 12 ? "PM" : "AM";
    let time = h % 12 || 12;
    return `${time}:00 ${period}`;
  };

  return `${format(start)} - ${format(end)}`;
}
function createPlanner() {
  let savedData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

  for (let hour = 9; hour < 21; hour++) {
    let block = document.createElement("div");
    block.className = "dailytime";
    block.dataset.time = hour;

    let label = document.createElement("p");
    label.textContent = formatTime(hour);

    let input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Write your plan...";
    input.value = savedData[hour] || "";

    input.addEventListener("input", () => {
      savedData[hour] = input.value;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedData));
    });

    block.appendChild(label);
    block.appendChild(input);
    planner.appendChild(block);
  }
}

createPlanner();

async function getQuote() {
  try {
    let response = await fetch(
      `https://random-quotes-freeapi.vercel.app/api/random?time=${Date.now()}`
    );

    let quotee = await response.json();
   console.log(quotee);

    document.querySelector(".quote-card .quote").textContent = `${quotee.quote}`;
    document.querySelector(".author").textContent = `— ${quotee.author}`;
  } catch (error) {
    console.error("Error:", error);  
    document.querySelector(".quote").textContent =
      "Keep going. Even loading takes patience 💫";
    document.querySelector(".author").textContent = "";
  }
}

getQuote();


let workDuration = 25 * 60;
let breakDuration = 5 * 60;
let seconds = workDuration;
let timerMode = "work"; 

let timer = document.querySelector(".timer h1");
let start = document.querySelector(".start");
let pause = document.querySelector(".pause");
let reset = document.querySelector(".reset");
let change=document.querySelector("#change");

let timerId; 

function update() {
  let min = Math.floor(seconds / 60);
  let sec = seconds % 60;
  timer.textContent = `${min}:${sec < 10 ? "0" + sec : sec}`;
}

function startTimer() {
  start.disabled = true;
  pause.disabled = false;
  reset.disabled = false;

  timerId = setInterval(function () {
    seconds--;
    update();

    if (seconds <= 0) {
      clearInterval(timerId);
      timerId = null;

      if (timerMode === "work") {
        timerMode = "break";
        seconds = breakDuration;
        change.textContent="Break session";
       
      } else {
        timerMode = "work";
        seconds = workDuration;
        change.textContent="Work session";
      
      }

      update();
      start.disabled = false;
      pause.disabled = true;
      reset.disabled = false;
    }
  }, 1000);
}

start.addEventListener("click", startTimer);

pause.addEventListener("click", () => {
  start.disabled = false;
  pause.disabled = true;
  reset.disabled = false;
  clearInterval(timerId); 
});

reset.addEventListener("click", () => {
  start.disabled = false;
  pause.disabled = true;
  reset.disabled = true;

  clearInterval(timerId);
  timerId = null;

  seconds = timerMode === "work" ? workDuration : breakDuration;
  update();
});

update();



const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector(".status");
const resetBtn = document.querySelector(".reset");

let currentPlayer = "X";
let gameActive = true;
let board = ["", "", "", "", "", "", "", "", ""];

const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function handleCellClick(e) {
  const index = e.target.dataset.index;
  

  if (board[index] !== "" || !gameActive) return;

  board[index] = currentPlayer;
  e.target.textContent = currentPlayer;
  e.target.classList.add(currentPlayer.toLowerCase());

  checkResult();
}

function checkResult() {
  let roundWon = false;

  for (let combo of winningCombos) {
    const [a, b, c] = combo;
    if (
      board[a] &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    statusText.textContent = `Player ${currentPlayer} Wins 🎉`;
    gameActive = false;
    return;
  }

  if (!board.includes("")) {
    statusText.textContent = "It's a Draw 🤝";
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = `Player ${currentPlayer}'s Turn`;
}

function resetGame() {
  currentPlayer = "X";
  gameActive = true;
  board = ["", "", "", "", "", "", "", "", ""];

  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("x", "o");
  });

  statusText.textContent = "Player X's Turn";
}

cells.forEach(cell => cell.addEventListener("click", handleCellClick));
resetBtn.addEventListener("click", resetGame);


const clockContainer = document.querySelector(".clock-container");

function updateClock() {
  const d = new Date();
  let h = d.getHours();
  let m = d.getMinutes();
  let s = d.getSeconds();

  let ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;

  clockContainer.innerHTML = `
    <div class="clock">
      <span>${String(h).padStart(2,"0")}</span>
      <span class="colon">:</span>
      <span>${String(m).padStart(2,"0")}</span>
      <span class="colon">:</span>
      <span>${String(s).padStart(2,"0")}</span>
      <span class="ampm">${ampm}</span>
    </div>
    <p class="date">${d.toDateString()}</p>
  `;
}
setInterval(updateClock, 1000);
updateClock();

const greet = document.querySelector(".greet");
const focusBtn = document.querySelector(".focus-btn");
const quote = document.querySelector(".quote");
async function getQuote() {
  try {
    let response = await fetch(
      `https://random-quotes-freeapi.vercel.app/api/random?time=${Date.now()}`
    );

    let quotee = await response.json();


    document.querySelector(".focus-box .quote").textContent = quotee.quote;
     document.querySelector(".quote-card .quote").textContent = `${quotee.quote}`;

    const author = document.querySelector(".author");
    if (author) author.textContent = `— ${quotee.author}`;

  } catch (error) {
    document.querySelector(".focus-box .quote").textContent =
      "Keep going. Even loading takes patience 💫";
  }
}

let hour = new Date().getHours();
greet.textContent =
  hour < 12 ? "Good Morning ☀️" :
  hour < 18 ? "Good Afternoon 🌤" :
  "Good Evening 🌙";






const apiKey = "3699851753b7c75d9c566319d117dbd3";
const cityEl = document.querySelector(".city");
const tempEl = document.querySelector(".temp");
const descEl = document.querySelector(".desc");
const iconEl = document.querySelector(".weather-icon");

async function getWeather(lat, lon) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
  );
  const data = await res.json();

  cityEl.textContent = data.name;
  tempEl.textContent = `${Math.round(data.main.temp)} °C`;
  descEl.textContent = data.weather[0].description;
}

navigator.geolocation.getCurrentPosition(pos => {
  getWeather(pos.coords.latitude, pos.coords.longitude);
});




document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".container-news-cricket");

  container.innerHTML = '<p class="loading">Loading cricket news...</p>';

  const API_KEY = "de26f3fe9cc94507bb6c0c6c99ad459e";
  const API_URL = `https://newsapi.org/v2/everything?q=cricket&sortBy=popularity&language=en&apiKey=${API_KEY}`;

  fetch(API_URL)
    .then(res => {
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      return res.json();
    })
    .then(data => {
    
      if (!data.articles || data.articles.length === 0) {
        container.innerHTML = '<p class="no-news">No cricket news found.</p>';
        return;
      }

      container.innerHTML = "";

      data.articles.forEach(news => {
        const card = document.createElement("div");
        card.className = "news-container";

        card.innerHTML = `
          <img src="${news.urlToImage || 'https://via.placeholder.com/300x200'}" alt="${news.title}">
          <div class="news-content">
            <h3>${news.title}</h3>
          </div>
        `;

        card.addEventListener("click", () => {
          window.open(news.url, "_blank");
        });

        container.appendChild(card);
      });
    })
    .catch(err => {
      console.error("Cricket news error:", err);
      container.innerHTML = `<p class="error">Failed to load cricket news. Please try again later.</p>`;
    });
});