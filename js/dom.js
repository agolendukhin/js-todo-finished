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
    let taskToChange = state.tasks.find(t => t.id == taskId);
    taskToChange.completed = !taskToChange.completed;
    let liToChange = getDomElement(`task-${taskToChange.id}`, true);

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

    updateElements();
}

function updateItemsLeft(count) {
    let itemsLeftElement = getDomElement('todo-count');
    
    let textToSet = '';
    if (count == 1) {
        textToSet = '1 item left';
    } else {
        textToSet = `${count} items left`
    }

    itemsLeftElement.innerHTML = textToSet;
}

function toggleClearCompleted(shouldDisplay) {
    let clearCompletedElement = getDomElement('clear-completed');

    if (shouldDisplay) {
        clearCompletedElement.style.display = 'block';
    } else {
        clearCompletedElement.style.display = 'none';
    }
}


function toggleEditTask(taskId, editable, e) {
    const taskLi = getDomElement(`task-${taskId}`, true);
    if (!taskLi) return;

    const focusInput = getDomElement(`edit-${taskId}`, true);

    if (editable) {
        setTimeout(function() { focusInput.focus(); }, 1);

        taskLi.className = 'editing'
    } else {
        if (e && e.key === 'Enter') {
            focusInput.blur();
        }
        if (!e) {
            const task = state.tasks.find(t => t.id == taskId);
            taskLi.className = task.completed ? 'completed' : ''
        }
    }
}

function updateTaskLi(task) {
    const taskLi = getDomElement(`task-${task.id}`, true);
    let label = taskLi.children[0].children[1];
    let editInput = taskLi.children[1];

    label.innerHTML = task.text;
    editInput.value = task.text;
}

function toggleAllTasks() {
    if (!state.completed_all) {
        state.tasks.forEach(task => {
            if (!task.completed) {
                const taskLi = getDomElement(`task-${task.id}`, true);
                const taskCheckbox = taskLi.children[0].children[0];

                task.completed = true;
                taskCheckbox.checked = true;
                taskLi.className = 'completed';
            }
        });
    } else {
        state.tasks.forEach(task => {
            const taskLi = getDomElement(`task-${task.id}`, true);
            const taskCheckbox = taskLi.children[0].children[0];

            task.completed = false;
            taskCheckbox.checked = false;
            taskLi.className = '';
        });
    }

    updateElements();
}

function updateToggleAllTasksCheckbox(enabled) {
    const toggleCheckbox = getDomElement('toggle-all');
    if (enabled) {
        state.completed_all = true;
        toggleCheckbox.checked = true;
    } else {
        state.completed_all = false;
        toggleCheckbox.checked = false;
    }
}
