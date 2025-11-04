// DOM元素
const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const taskCount = document.getElementById('task-count');
const clearCompletedBtn = document.getElementById('clear-completed');
const filterBtns = document.querySelectorAll('.filter-btn');

// 状态变量
let todos = [];
let currentFilter = 'all';

// 初始化
function init() {
    // 从本地存储加载待办事项
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
        todos = JSON.parse(savedTodos);
    }
    
    // 渲染待办事项
    renderTodos();
    
    // 更新任务计数
    updateTaskCount();
    
    // 添加事件监听器
    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });
    
    clearCompletedBtn.addEventListener('click', clearCompleted);
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentFilter = btn.dataset.filter;
            // 更新活动状态
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            // 重新渲染
            renderTodos();
        });
    });
}

// 添加待办事项
function addTodo() {
    const text = todoInput.value.trim();
    
    if (text) {
        const newTodo = {
            id: Date.now(),
            text: text,
            completed: false
        };
        
        todos.push(newTodo);
        saveTodos();
        renderTodos();
        updateTaskCount();
        
        // 清空输入框
        todoInput.value = '';
        
        // 聚焦回输入框
        todoInput.focus();
    }
}

// 渲染待办事项
function renderTodos() {
    todoList.innerHTML = '';
    
    // 根据当前过滤器获取要显示的待办事项
    let filteredTodos = todos;
    
    if (currentFilter === 'active') {
        filteredTodos = todos.filter(todo => !todo.completed);
    } else if (currentFilter === 'completed') {
        filteredTodos = todos.filter(todo => todo.completed);
    }
    
    // 创建并添加每个待办事项的DOM元素
    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = 'todo-item';
        li.dataset.id = todo.id;
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'todo-checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', toggleTodoStatus);
        
        const span = document.createElement('span');
        span.className = 'todo-text' + (todo.completed ? ' completed' : '');
        span.textContent = todo.text;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '删除';
        deleteBtn.addEventListener('click', deleteTodo);
        
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);
        
        todoList.appendChild(li);
    });
}

// 切换待办事项状态
function toggleTodoStatus(e) {
    const todoId = parseInt(e.target.parentElement.dataset.id);
    const todo = todos.find(t => t.id === todoId);
    
    if (todo) {
        todo.completed = e.target.checked;
        saveTodos();
        updateTaskCount();
        
        // 更新文本样式
        const textSpan = e.target.nextElementSibling;
        if (todo.completed) {
            textSpan.classList.add('completed');
        } else {
            textSpan.classList.remove('completed');
        }
    }
}

// 删除待办事项
function deleteTodo(e) {
    const todoId = parseInt(e.target.parentElement.dataset.id);
    const todoIndex = todos.findIndex(t => t.id === todoId);
    
    if (todoIndex !== -1) {
        // 添加删除动画效果
        const todoElement = e.target.parentElement;
        todoElement.style.opacity = '0';
        todoElement.style.height = '0';
        todoElement.style.padding = '0';
        todoElement.style.margin = '0';
        todoElement.style.overflow = 'hidden';
        todoElement.style.transition = 'all 0.3s ease';
        
        // 延迟删除实际数据，等待动画完成
        setTimeout(() => {
            todos.splice(todoIndex, 1);
            saveTodos();
            renderTodos();
            updateTaskCount();
        }, 300);
    }
}

// 清除已完成的待办事项
function clearCompleted() {
    todos = todos.filter(todo => !todo.completed);
    saveTodos();
    renderTodos();
    updateTaskCount();
}

// 更新任务计数
function updateTaskCount() {
    const activeTodos = todos.filter(todo => !todo.completed);
    taskCount.textContent = `${activeTodos.length} 个待办事项`;
}

// 保存待办事项到本地存储
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// 启动应用
init();