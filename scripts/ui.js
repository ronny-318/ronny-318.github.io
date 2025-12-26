function updateUI() {
    const timerDisplay = document.getElementById('timer');
    const statusMessage = document.getElementById('status');
    const startBtn = document.getElementById('start-pause-btn');
    const taskArea = document.getElementById('task-area');
    const progressBar = document.getElementById('progress-line');

    if (!timerDisplay || !startBtn || !progressBar) return;

    // 1. 시간 및 상태 문구 갱신
    timerDisplay.textContent = formatTime(timeInSeconds);
    statusMessage.textContent = isWorkTime ? `${currentRound}회기: 집중 중 🔥` : "☕ 잠깐 쉬어가세요!";
    
    // 2. 버튼 텍스트 변경
    startBtn.textContent = isPaused ? "시작" : "일시정지";

    // 3. 스텝 바 업데이트
    const lineWidth = ((currentRound - 1) / (MAX_ROUNDS - 1)) * 100;
    progressBar.style.width = `${lineWidth}%`;

    for (let i = 1; i <= MAX_ROUNDS; i++) {
        const step = document.getElementById(`step-${i}`);
        if (!step) continue;
        if (i < currentRound) {
            step.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>`;
            step.className = "step-dot completed-step";
        } else if (i === currentRound) {
            step.innerHTML = i;
            step.className = "step-dot active-step";
        } else {
            step.innerHTML = i;
            step.className = "step-dot";
        }
    }
    
    // 4. 상태에 따른 색상 전환
    startBtn.className = isWorkTime 
        ? "bg-red-500 hover:bg-red-600 text-white px-12 py-3 rounded-full font-bold transition w-full shadow-lg"
        : "bg-blue-500 hover:bg-blue-600 text-white px-12 py-3 rounded-full font-bold transition w-full shadow-lg";

    if (taskArea) isWorkTime ? taskArea.classList.remove('hidden') : taskArea.classList.add('hidden');
    renderLogs();
}

function renderLogs() {
    const logList = document.getElementById('log-list');
    const logCount = document.getElementById('log-count');
    if (!logList) return;
    if (logCount) logCount.textContent = pomodoroLogs.length;

    logList.innerHTML = pomodoroLogs.length === 0 
        ? `<p class="text-sm text-gray-400 text-center py-10">아직 기록이 없습니다.</p>`
        : pomodoroLogs.slice().reverse().map(log => `
            <li class="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl border-l-4 ${log.type === 'work' ? 'border-red-500' : 'border-blue-500'}">
                <span class="text-xl">${log.type === 'work' ? '🍅' : '☕'}</span>
                <div>
                    <p class="text-[10px] text-gray-400 font-mono">${log.time}</p>
                    <p class="text-sm font-bold text-gray-700">${log.message}</p>
                </div>
            </li>
        `).join('');
}