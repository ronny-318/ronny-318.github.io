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
    
    pomodoroLogs.push({
        time: timeString,
        message: manualTask ? `✅ ${manualTask}` : (isWorkTime ? `${currentRound}회기 집중 완료!` : "☕ 휴식 완료!"),
        type: isWorkTime ? "work" : "rest"
    });
    saveToLocal();
    
    if (isWorkTime) {
        if (currentRound >= MAX_ROUNDS) {
            alert("🎊 4회기 완료!");
            currentRound = 1;
        } else {
            currentRound++;
        }
    }

    isWorkTime = !isWorkTime;
    timeInSeconds = isWorkTime ? 25 * 60 : 5 * 60;
    updateUI();
}

// ... finishTaskEarly, openPiP 함수 생략 (기존 코드 그대로) ...

// 이벤트 등록 및 초기화
document.getElementById('task-input')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') finishTaskEarly();
});

updateUI();