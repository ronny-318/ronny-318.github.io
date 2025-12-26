let pomodoroLogs = JSON.parse(localStorage.getItem('pomodoro_data')) || []; 
let isWorkTime = true;
let timeInSeconds = 25 * 60;
let isPaused = true;
let intervalId = null;
let currentRound = 1; 
const MAX_ROUNDS = 4;

const saveToLocal = () => {
    localStorage.setItem('pomodoro_data', JSON.stringify(pomodoroLogs));
};

const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};