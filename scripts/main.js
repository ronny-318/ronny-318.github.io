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
                startTimer(); 
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
    
    // 로그 데이터 생성 (날짜와 시간 포함)
    const newLog = {
        date: formatDate(), // constants.js에 정의한 12월 26일 형태
        time: timeString,   // 14:30 형태
        message: manualTask ? `✅ ${manualTask}` : (isWorkTime ? `🍅 ${currentRound}회기 집중 완료!` : "☕ 휴식 완료!"),
        type: isWorkTime ? "work" : "rest"
    };

    // 로그 저장
    pomodoroLogs.push(newLog);
    saveToLocal();
    
    // 회기 카운트 및 다음 단계 설정
    if (isWorkTime) {
        if (currentRound >= MAX_ROUNDS) {
            triggerConfetti(); // 3회기 완료 시 폭죽
            setTimeout(() => {
            alert("🎊 대단해요! 3회기를 모두 마쳤습니다. 긴 휴식을 가져보세요!");
            }, 500);
            currentRound = 1;
        } else {
            currentRound++;
        }
    }

    // 상태 전환 (집중 <-> 휴식)
    isWorkTime = !isWorkTime;
    timeInSeconds = isWorkTime ? 25 * 60 : 5 * 60;
    
    updateUI();
}

// main.js
function finishTaskEarly() {
    const input = document.getElementById('task-input');
    if (!input) return; // input 요소를 못 찾으면 중단

    const value = input.value.trim();
    if (!value) {
        alert("할 일을 적어주세요!");
        return;
    }

    // 1. 데이터 기록 (여기서 formatDate 함수가 constants.js에 있어야 함)
    const now = new Date();
    const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const newLog = {
        date: formatDate(), // constants.js에 정의됨
        time: timeString,
        message: `✅ ${value}`,
        type: "work"
    };

    pomodoroLogs.push(newLog);
    saveToLocal();
    
    // 2. 입력창 비우기
    input.value = "";

    // 3. 모달 띄우기 (커스텀 모달 HTML이 있는지 확인)
    const modal = document.getElementById('custom-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.querySelector('div').classList.add('animate-bounce-in');
        
        // 버튼 이벤트 연결
        document.getElementById('modal-yes').onclick = () => {
            modal.classList.add('hidden');
            stopTimer();
            isWorkTime = true; // 현재 집중 종료
            completePomodoro(); // 상태 전환 및 휴식 시작
            startTimer();
        };

        document.getElementById('modal-no').onclick = () => {
            modal.classList.add('hidden');
            updateUI(); // 화면 갱신만
        };
    } else {
        // 모달이 없으면 바로 다음으로 (방어 로직)
        completePomodoro();
    }
}

// main.js 아무 곳에나 추가
function triggerConfetti() {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        // 양쪽에서 터지는 효과
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
}

// 이벤트 등록 및 초기화
document.getElementById('task-input')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') finishTaskEarly();
});

updateUI();