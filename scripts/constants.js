let pomodoroLogs = JSON.parse(localStorage.getItem('pomodoro_data')) || []; 
let isWorkTime = true;
let timeInSeconds = 25 * 60;
let isPaused = true;
let intervalId = null;
const MAX_ROUNDS = 3;
let currentRound = 1; 


const saveToLocal = () => {
    localStorage.setItem('pomodoro_data', JSON.stringify(pomodoroLogs));
};

const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const formatDate = () => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    return `${month}월 ${date}일`;
};