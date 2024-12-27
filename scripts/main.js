// checklist.html

// input 요소와 ul 요소 가져오기
const newTodoInput = document.getElementById('new-todo');
const todoList = document.getElementById('todo-list');

// Enter 키를 눌렀을 때 새로운 li 요소 추가하는 함수
newTodoInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter' && newTodoInput.value.trim() !== '') {
        // 새 todo 텍스트 가져오기
        const newTodoText = newTodoInput.value.trim();

        // 새로운 li 요소 생성
        const newLi = document.createElement('li');
        
        // 체크박스와 텍스트 추가
        const newCheckbox = document.createElement('input');
        newCheckbox.type = 'checkbox';
        newCheckbox.className = 'done';
        const newText = document.createTextNode(' ' + newTodoText);
        
        newLi.appendChild(newCheckbox);
        newLi.appendChild(newText);

        // 새로운 li 요소를 ul에 추가
        todoList.appendChild(newLi);

        // input 필드 비우기
        newTodoInput.value = '';
    }
});


// 현재 날짜 표시
function getCurrentDate() {
    const now = new Date();
    
    const year = now.getFullYear();
    const month = String(now.getMonth() +1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

document.getElementById('current-date').textContent = getCurrentDate();