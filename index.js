let tasks = [];
let completedAllTasks = false;

window.onload = function() {
    tasks = readTasksFromLocalStorage();
    renderTasks(tasks);

    const filter = window.location.hash.slice(2);
    activateFilter(filter)
}

function renderTasks() {
    const tasksUl = document.getElementsByClassName("todo-list")[0];
    tasks.forEach(task => {
        const li = getLiHtml(task);
        tasksUl.innerHTML += li;
    });

    updateItemsLeft();
}

function addTask(e) {
    if (e.key === "Enter") {
        e.preventDefault();

        const target = e.target;
        const newText = target.value;

        const task = {
            id: getNewTaskId(tasks),
            text: newText,
            completed: false
        };
    
        tasks.push(task);
        const tasksUl = document.getElementsByClassName("todo-list")[0];
        const li = getLiHtml(task);
    
        tasksUl.innerHTML += li;

        const newTodoInput = document.getElementsByClassName("new-todo")[0];
        newTodoInput.value = '';

        if (tasks.length == 1) {
            const toggleCheckbox = document.getElementsByClassName("toggle-all")[0];
            toggleCheckbox.style.display = 'block';
            enableFooter();
        }

        updateItemsLeft();
    }
}

function deleteTask(id) {
    let arrIndex = 0;
    tasks.forEach((task, index) => {
        if (task.id == id) arrIndex = index;
    });

    tasks.splice(arrIndex, 1);

    const elem = document.getElementById(`task-${id}`);
    elem.parentNode.removeChild(elem);

    if (!tasks.length) {
        const toggleCheckbox = document.getElementsByClassName("toggle-all")[0];
        toggleCheckbox.style.display = 'none';
        disableFooter();
        return;
    }

    updateItemsLeft();
}

function getLiHtml(task) {
    const taskId = `task-${task.id}`;
    const editId = `edit-${task.id}`;
    const completedClass = task.completed ? 'completed' : '';
    const checked = task.completed ? 'checked' : '';

    const li = `
    <li id="${taskId}" class="${completedClass}" ondblclick="toggleEditTask(${task.id}, true)">
        <div class="view">
            <input class="toggle" type="checkbox" ${checked} onclick="toggleCompleted(${task.id});">
            <label>${task.text}</label>
            <button class="destroy" onclick="deleteTask(${task.id});"></button>
        </div>
        <input id="${editId}" class="edit" value="${task.text}" onblur="toggleEditTask(${task.id}, false)" onkeydown="toggleEditTask(${task.id}, false, event)" onchange="editTask(event, ${task.id})">
    </li>`;

    return li;
}

function toggleCompleted(taskId) {
    let taskToChange = tasks.find(t => t.id == taskId);
    taskToChange.completed = !taskToChange.completed;
    let liToChange = document.getElementById(`task-${taskToChange.id}`);

    const activeFilter = getActiveFilter();

    if (!taskToChange.completed) {
        liToChange.className = '';
        if (activeFilter === 'completed') {
            liToChange.style.display = 'none';
        }
    } else {
        liToChange.className = 'completed';
        if (activeFilter === 'active') {
            liToChange.style.display = 'none';
        }
    }

    updateItemsLeft();
}

function activateFilter(filter) {
    switch(filter) {
        case 'active': {
            filterActive();
            break;
        }
        case 'completed': {
            filterCompleted();
            break;
        }
        default: {
            filterAll();
            break;
        }
    }
}

function filterAll() {
    activateFilterButton('all');
    tasks.forEach(task => {
        const taskLi = document.getElementById(`task-${task.id}`);
        taskLi.style.display = 'block';
    })
}

function filterActive() {
    activateFilterButton('active');
    tasks.forEach(task => {
        const taskLi = document.getElementById(`task-${task.id}`);
        if (!task.completed) {
            taskLi.style.display = 'block';
            return;
        }
        taskLi.style.display = 'none';
    })
}

function filterCompleted() {
    activateFilterButton('completed');
    tasks.forEach(task => {
        const taskLi = document.getElementById(`task-${task.id}`);
        if (task.completed) {
            taskLi.style.display = 'block';
            return;
        }
        taskLi.style.display = 'none';
    })
}

function activateFilterButton(filter) {
    const filters = getFiltersElements();
    
    for (filterName in filters) {
        const element = filters[filterName];
        if (filterName === filter) {
            element.className = 'selected';
            continue;
        }
        element.className = '';
    }
}

function getFiltersElements() {
    const all = document.getElementById('all-filter');
    const active = document.getElementById('active-filter');
    const completed = document.getElementById('completed-filter');

    return {
        all,
        active,
        completed
    }
}

function getActiveFilter() {
    const filters = getFiltersElements();

    for (filterName in filters) {
        const element = filters[filterName];
        if (element.className) {
            return filterName;
        }
    }
}

function updateItemsLeft() {
    let itemsLeftElement = document.getElementsByClassName("todo-count")[0];
    let textToSet = '';
    const count = getTasksActiveCount();

    if (count == 1) {
        textToSet = '1 item left';
    } else {
        textToSet = `${count} items left`
    }

    itemsLeftElement.innerHTML = textToSet;

    toggleClearCompleted(count);

    updateToggleAllTasksCheckbox(!count);

    updateTasksInLocalStorage();
}

function toggleClearCompleted(shouldDisplay) {
    let clearCompletedElement = document.getElementsByClassName("clear-completed")[0];

    if (shouldDisplay) {
        clearCompletedElement.style.display = 'block';
    } else {
        clearCompletedElement.style.display = 'none';
    }
}

function clearCompleted() {
    const idsToDelete = [];
    tasks.forEach(task => {
        if (task.completed) idsToDelete.push(task.id);
    });

    idsToDelete.forEach(id => {
        deleteTask(id);
    });

}

function toggleEditTask(taskId, editable, e) {
    const taskLi = document.getElementById(`task-${taskId}`);
    if (!taskLi) return;

    const focusInput = document.getElementById(`edit-${taskId}`);

    if (editable) {
        setTimeout(function() { focusInput.focus(); }, 1);

        taskLi.className = 'editing'
    } else {
        if (e && e.key === 'Enter') {
            focusInput.blur();
        }
        if (!e) {
            const task = tasks.find(t => t.id == taskId);
            taskLi.className = task.completed ? 'completed' : ''
        }
    }
}

function editTask(e, taskId) {
    const target = e.target;
    const newText = target.value;

    tasks.forEach(task => {
        if (task.id == taskId) {
            task.text = newText;
            if (newText) {
                updateTaskLi(task);
            } else {
                deleteTask(taskId);
            }
        }
    });
    updateTasksInLocalStorage();
}

function updateTaskLi(task) {
    const taskLi = document.getElementById(`task-${task.id}`);
    let label = taskLi.children[0].children[1];
    let editInput = taskLi.children[1];

    label.innerHTML = task.text;
    editInput.value = task.text;
}

function getTasksActiveCount() {
    return tasks.reduce((counter, task) => {
        return !task.completed ? ++counter : counter
    }, 0);
}

function disableFooter() {
    const footer = document.getElementsByClassName('footer')[0];
    footer.style.display = 'none';
}

function enableFooter() {
    const footer = document.getElementsByClassName('footer')[0];
    footer.style.display = 'block';
}

function getNewTaskId(tasks) {
    if (!tasks.length) return "1";
    const id = +tasks[tasks.length - 1].id + 1;
    return String(id);
}

function toggleAllTasks() {
    if (!completedAllTasks) {
        tasks.forEach(task => {
            if (!task.completed) {
                const taskLi = document.getElementById(`task-${task.id}`);
                const taskCheckbox = taskLi.children[0].children[0];

                task.completed = true;
                taskCheckbox.checked = true;
                taskLi.className = 'completed';
            }
        });
        //updateToggleAllTasksCheckbox(true);
    } else {
        tasks.forEach(task => {
            const taskLi = document.getElementById(`task-${task.id}`);
            const taskCheckbox = taskLi.children[0].children[0];

            task.completed = false;
            taskCheckbox.checked = false;
            taskLi.className = '';
        });
        //updateToggleAllTasksCheckbox(false);
    }

    updateItemsLeft();
}

function updateToggleAllTasksCheckbox(enabled) {
    const toggleCheckbox = document.getElementsByClassName("toggle-all")[0];
    if (enabled) {
        completedAllTasks = true;
        toggleCheckbox.checked = true;
    } else {
        completedAllTasks = false;
        toggleCheckbox.checked = false;
    }
}

function readTasksFromLocalStorage() {
    return JSON.parse(localStorage.getItem('tasks'));
}

function updateTasksInLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
