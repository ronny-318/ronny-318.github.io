function updateUI() {
    const timerDisplay = document.getElementById('timer');
    const progressBar = document.getElementById('progress-line');
    const totalTime = isWorkTime ? 25 * 60 : 5 * 60;
    const elapsedPercent = ((totalTime - timeInSeconds) / totalTime) * 100;

    // 1. 타이머 텍스트 갱신
    timerDisplay.textContent = formatTime(timeInSeconds);

    // 2. 스텝 바 선(Line) 업데이트 (휴식 시간에만 길어짐)
    if (progressBar) {
        let baseWidth = ((currentRound - 1) / (MAX_ROUNDS - 1)) * 100;
        if (!isWorkTime) {
            // 휴식 중일 때는 다음 칸으로 가는 선이 실시간으로 길어짐
            const segmentWidth = (1 / (MAX_ROUNDS - 1)) * 100;
            baseWidth += (elapsedPercent / 100) * segmentWidth;
        }
        progressBar.style.width = `calc(${baseWidth}% )`;
    }

    // 3. 원형(Dot) 업데이트
    for (let i = 1; i <= MAX_ROUNDS; i++) {
        const step = document.getElementById(`step-${i}`);
        if (!step) continue;

        if (i < currentRound) {
            step.innerHTML = "✓";
            step.className = "step-dot completed-step";
            step.style.setProperty('--progress', '100%');
        } else if (i === currentRound) {
            step.innerHTML = i;
            if (isWorkTime) {
                // 집중 중일 때만 원 테두리 애니메이션 적용
                step.className = "step-dot active-focus";
                step.style.setProperty('--progress', `${elapsedPercent}%`);
            } else {
                // 휴식 중일 때는 다음 원으로 넘어가기 전 완료 상태로 유지
                step.className = "step-dot completed-step";
            }
        } else {
            step.innerHTML = i;
            step.className = "step-dot";
            step.style.setProperty('--progress', '0%');
        }
    }
    
    // 4. 상태에 따른 색상 전환
    startBtn.className = isWorkTime 
        ? "bg-red-500 hover:bg-red-600 text-white px-12 py-3 rounded-full font-bold transition w-full shadow-lg"
        : "bg-blue-500 hover:bg-blue-600 text-white px-12 py-3 rounded-full font-bold transition w-full shadow-lg";

    if (taskArea) isWorkTime ? taskArea.classList.remove('hidden') : taskArea.classList.add('hidden');
    renderLogs();
}

// ui.js

// 드롭다운 메뉴에 저장된 날짜들을 업데이트하는 함수
function updateDateDropdown() {
    const dateFilter = document.getElementById('date-filter');
    if (!dateFilter) return;

    // 중복 제거된 날짜 목록 추출 (예: ["12월 26일", "12월 25일"])
    const uniqueDates = [...new Set(pomodoroLogs.map(log => log.date))].sort((a, b) => b.localeCompare(a));
    
    const currentValue = dateFilter.value;
    dateFilter.innerHTML = '<option value="all">전체 날짜</option>';
    
    uniqueDates.forEach(date => {
        if (date) {
            const option = document.createElement('option');
            option.value = date;
            option.textContent = date;
            dateFilter.appendChild(option);
        }
    });
    
    dateFilter.value = currentValue; // 이전 선택값 유지
}

function renderLogs() {
    const logList = document.getElementById('log-list');
    const logCount = document.getElementById('log-count');
    const dateFilter = document.getElementById('date-filter');
    if (!logList) return;

    // 드롭다운 날짜 목록 갱신 (로그가 추가될 때마다 실행)
    updateDateDropdown();

    const selectedDate = dateFilter ? dateFilter.value : 'all';

    // 필터링 로직: 전체가 아니면 선택된 날짜만 거름
    const filteredLogs = selectedDate === 'all' 
        ? pomodoroLogs 
        : pomodoroLogs.filter(log => log.date === selectedDate);

    // 헤더 옆의 횟수 업데이트
    if (logCount) logCount.textContent = filteredLogs.length;

    if (filteredLogs.length === 0) {
        logList.innerHTML = `<p class="text-sm text-gray-400 text-center py-10">기록이 없습니다.</p>`;
        return;
    }

    logList.innerHTML = filteredLogs.slice().reverse().map(log => `
        <li class="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl border-l-4 ${log.type === 'work' ? 'border-red-500' : 'border-blue-500'}">
            <span class="text-xl mt-1">${log.type === 'work' ? '🍅' : '☕'}</span>
            <div class="flex-1">
                <div class="flex justify-between items-center mb-1">
                    <p class="text-[10px] text-gray-400 font-mono">${log.date || ''} ${log.time || ''}</p>
                </div>
                <p class="text-sm font-bold text-gray-700 leading-snug">${log.message}</p>
            </div>
        </li>
    `).join('');
}


function updateUI() {
    const timerDisplay = document.getElementById('timer');
    const statusMessage = document.getElementById('status');
    const waterLevel = document.getElementById('water-level');
    const roundIndicator = document.getElementById('round-indicator');
    if (roundIndicator) {
        // MAX_ROUNDS에 맞게 라운드 텍스트 조정
        roundIndicator.textContent = `Round ${currentRound}/${MAX_ROUNDS}`;
    };
    const startBtn = document.getElementById('start-pause-btn');

    const totalTime = isWorkTime ? 25 * 60 : 5 * 60;
    const progressPercent = ((totalTime - timeInSeconds) / totalTime) * 100;

    // 1. 시간 및 라운드 업데이트
    timerDisplay.textContent = formatTime(timeInSeconds);
    statusMessage.textContent = isWorkTime ? "Focusing" : "Resting";
    roundIndicator.textContent = `Round ${currentRound}/4`;

    // 2. 물 채우기 애니메이션
    if (waterLevel) {
        waterLevel.style.height = `${progressPercent}%`;
        
        // 집중/휴식 색상 교체
        if (isWorkTime) {
            waterLevel.className = "absolute bottom-0 left-[-50%] w-[200%] transition-all duration-1000 bg-red-500/80";
            startBtn.className = "bg-red-500 hover:bg-red-600 text-white px-12 py-4 rounded-2xl font-black transition-all w-full shadow-lg";
        } else {
            waterLevel.className = "absolute bottom-0 left-[-50%] w-[200%] transition-all duration-1000 bg-blue-500/80";
            startBtn.className = "bg-blue-500 hover:bg-blue-600 text-white px-12 py-4 rounded-2xl font-black transition-all w-full shadow-lg";
        }
    }

    startBtn.textContent = isPaused ? "시작하기" : "잠시 멈춤";
    renderLogs();
}