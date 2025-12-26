// --- 1. 상태 변수 및 초기화 ---
let pomodoroLogs = JSON.parse(localStorage.getItem('pomodoro_data')) || []; 
let isWorkTime = true;
let timeInSeconds = 25 * 60;
let isPaused = true;
let intervalId = null;

// --- 2. 유틸리티 및 저장 함수 ---
const saveToLocal = () => {
    localStorage.setItem('pomodoro_data', JSON.stringify(pomodoroLogs));
};

const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

// --- 3. 화면 업데이트 함수 ---
function updateUI() {
    const timerDisplay = document.getElementById('timer');
    const statusMessage = document.getElementById('status');
    const startBtn = document.getElementById('start-pause-btn');
    const taskArea = document.getElementById('task-area');
    const progressBar = document.getElementById('progress-bar');

    // 안전장치: 요소가 없으면 실행 중단
    if (!timerDisplay || !startBtn || !progressBar) return;

    // 1. 시간 및 상태 문구 갱신
    timerDisplay.textContent = formatTime(timeInSeconds);
    statusMessage.textContent = isWorkTime ? "🔥 집중할 시간!" : "☕ 잠깐 쉬어가세요!";
    
    // 2. 버튼 텍스트 변경 (핵심!)
    startBtn.textContent = isPaused ? "시작" : "일시정지";

    // 3. 프로그레스 바 업데이트
    const totalTime = isWorkTime ? 25 * 60 : 5 * 60;
    const progressPercent = ((totalTime - timeInSeconds) / totalTime) * 100;
    progressBar.style.width = `${progressPercent}%`;
    
    // 4. 상태(집중/휴식)에 따른 UI 전환
    if (isWorkTime) {
        progressBar.classList.add('bg-red-500');
        progressBar.classList.remove('bg-blue-500');
        startBtn.className = "bg-red-500 hover:bg-red-600 text-white px-12 py-3 rounded-full font-bold transition w-full shadow-lg shadow-red-100";
        if (taskArea) taskArea.classList.remove('hidden');
    } else {
        progressBar.classList.add('bg-blue-500');
        progressBar.classList.remove('bg-red-500');
        startBtn.className = "bg-blue-500 hover:bg-blue-600 text-white px-12 py-3 rounded-full font-bold transition w-full shadow-lg shadow-blue-100";
        if (taskArea) taskArea.classList.add('hidden');
    }

    renderLogs();
}

function renderLogs() {
    const logList = document.getElementById('log-list');
    const logCount = document.getElementById('log-count');
    if (!logList) return;

    if (logCount) logCount.textContent = pomodoroLogs.length;

    if (pomodoroLogs.length === 0) {
        logList.innerHTML = `<p class="text-sm text-gray-400 text-center py-10">아직 기록이 없습니다.</p>`;
        return;
    }

    logList.innerHTML = pomodoroLogs.slice().reverse().map(log => `
        <li class="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl border-l-4 ${log.type === 'work' ? 'border-red-500' : 'border-blue-500'}">
            <span class="text-xl">${log.type === 'work' ? '🍅' : '☕'}</span>
            <div>
                <p class="text-[10px] text-gray-400 font-mono">${log.time}</p>
                <p class="text-sm font-bold text-gray-700">${log.message}</p>
            </div>
        </li>
    `).join('');
}

// --- 4. 핵심 기능 함수 ---
function startTimer() {
    if (isPaused) {
        isPaused = false;
        intervalId = setInterval(() => {
            if (timeInSeconds > 0) {
                timeInSeconds--;
                updateUI(); 
            } else {
                stopTimer();
                completePomodoro();
                startTimer(); // 자동 다음 단계 시작
            }
        }, 1000);
    } else {
        stopTimer();
    }
    updateUI();
}

function stopTimer() {
    clearInterval(intervalId);
    isPaused = true;
}

function completePomodoro(manualTask = null) {
    const now = new Date();
    const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const newLog = {
        time: timeString,
        message: manualTask ? `✅ ${manualTask}` : (isWorkTime ? "🍅 25분 집중 완료!" : "☕ 휴식 완료!"),
        type: isWorkTime ? "work" : "rest"
    };

    pomodoroLogs.push(newLog);
    saveToLocal();
    
    isWorkTime = !isWorkTime;
    timeInSeconds = isWorkTime ? 25 * 60 : 5 * 60;
    updateUI();
}

function finishTaskEarly() {
    const input = document.getElementById('task-input');
    const value = input.value.trim();
    if (!value) return alert("할 일을 적어주세요!");

    const wantToRest = confirm(`"${value}"를 기록하고 지금 바로 휴식할까요?`);
    
    if (wantToRest) {
        stopTimer();
        completePomodoro(value);
        startTimer(); // 휴식 타이머 시작
    } else {
        // 기록만 남기기
        const now = new Date();
        const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        pomodoroLogs.push({ time: timeString, message: `✅ ${value}`, type: "work" });
        saveToLocal();
        renderLogs();
    }
    input.value = "";
}

// --- 5. PiP 기능 ---
async function openPiP() {
    if (!('documentPictureInPicture' in window)) {
        alert("이 브라우저는 팝업 타이머 기능을 지원하지 않습니다.");
        return;
    }

    const timerCard = document.getElementById('timer-card');
    const pipWindow = await window.documentPictureInPicture.requestWindow({
        width: 380,
        height: 480,
    });

    [...document.styleSheets].forEach((styleSheet) => {
        try {
            const cssRules = [...styleSheet.cssRules].map((rule) => rule.cssText).join('');
            const style = document.createElement('style');
            style.textContent = cssRules;
            pipWindow.document.head.appendChild(style);
        } catch (e) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = styleSheet.href;
            pipWindow.document.head.appendChild(link);
        }
    });

    pipWindow.document.body.appendChild(timerCard);
    pipWindow.document.body.classList.add('flex', 'items-center', 'justify-center', 'h-screen', 'bg-gray-100');

    pipWindow.addEventListener("pagehide", (event) => {
        const mainContainer = document.getElementById('main-container');
        const card = event.target.querySelector('#timer-card');
        if (card && mainContainer) mainContainer.appendChild(card);
    });
}

// 초기 실행
updateUI();