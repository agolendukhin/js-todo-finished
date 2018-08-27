const url = 'http://5b746c6ea583740014190933.mockapi.io/api/v1/tasks';
const req = new XMLHttpRequest();

let tasks = [];

req.responseType = 'json';
req.open('GET', url, true);
req.onload  = function() {
    tasks = req.response;
 
    const tasksUl = document.getElementsByClassName("todo-list")[0];
    tasks.forEach(task => { // id="task-13"
        const li = getLiHtml(task);
        tasksUl.innerHTML += li;
    });
    console.log('tasks init', tasks);
 };
req.send(null);

const newTodoInput = document.getElementsByClassName("new-todo")[0];
newTodoInput.addEventListener("keydown", function(event) {
    console.log('keydown');
    if (event.key === "Enter") {
        event.preventDefault();
        // => call keypress
        const target = event.target;
        const newText = target.value;

        const task = {
            id: getMaxId(tasks) + 1,
            text: newText,
            completed: false
        };

        tasks.push(task);
        const tasksUl = document.getElementsByClassName("todo-list")[0];
        const li = getLiHtml(task);

        tasksUl.innerHTML += li;

        newTodoInput.value = '';
        console.log(tasks);
    }
});

newTodoInput.addEventListener("keypress", function(event) {
    console.log('keypress');
});

// [{id: 1}, {id: 5}, {id: 10}]
// Math.max(1,2,34,5)
// Math.max([1,2,34,5])
// Math.max(null, [1,2,34,5])

function getMaxId(tasks) {
    const ids = tasks.map(t => t.id);
    return Math.max.apply(null, ids);
}

function deleteTask(id) {
    const elem = document.getElementById(`task-${id}`);
    elem.parentNode.removeChild(elem);
}

function getLiHtml(task) {
    const taskId = `task-${task.id}`;
    const completedClass = task.completed ? 'completed' : '';
    const checked = task.completed ? 'checked' : '';

    const li = `
    <li id="${taskId}" class="${completedClass}">
        <div class="view">
            <input class="toggle" type="checkbox" ${checked} onclick="markCompleted(${task.id});">
            <label>${task.text}</label>
            <button class="destroy" onclick="deleteTask(${task.id});"></button>
        </div>
        <input class="edit" value="${task.text}">
    </li>`;

    return li;
}

function markCompleted(taskId) {
    let taskToChange = tasks.find(t => t.id == taskId);
    taskToChange.completed = !taskToChange.completed;
    let liToChange = document.getElementById(`task-${taskToChange.id}`);
    if (!taskToChange.completed) {
        liToChange.classList.remove('completed');
    } else {
        liToChange.classList.add('completed');
    }
    console.log('tasks', tasks);
}
