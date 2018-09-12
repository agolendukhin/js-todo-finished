function renderTasks(tasks) {
    const tasksUl = getDomElement('todo-list');
    tasks.forEach(task => {
        const li = getLiHtml(task);
        tasksUl.innerHTML += li;
    });

    updateElements();
}

function addTask(e) {
    console.log('addTask')
    if (e.key === 'Enter') {
        e.preventDefault();

        const target = e.target;
        const newText = target.value;

        const task = {
            id: getNewTaskId(state.tasks),
            text: newText,
            completed: false
        };
    
        state.tasks.push(task);
        const tasksUl = getDomElement('todo-list');
        const li = getLiHtml(task);
    
        tasksUl.innerHTML += li;

        const newTodoInput = getDomElement('new-todo');
        newTodoInput.value = '';

        if (state.tasks.length == 1) {
            const toggleCheckbox = getDomElement('toggle-all');
            toggleCheckbox.style.display = 'block';
            enableFooter();
        }

        updateElements();
    }
}

function deleteTask(id) {
    let arrIndex = 0;
    state.tasks.forEach((task, index) => {
        if (task.id == id) arrIndex = index;
    });

    state.tasks.splice(arrIndex, 1);

    const elem = getDomElement(`task-${id}`, true);
    elem.parentNode.removeChild(elem);

    if (!state.tasks.length) {
        const toggleCheckbox = getDomElement('toggle-all');
        toggleCheckbox.style.display = 'none';
        disableFooter();
        return;
    }

    updateElements();
}

function editTask(e, taskId) {
    const target = e.target;
    const newText = target.value;

    state.tasks.forEach(task => {
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

function clearCompleted() {
    const idsToDelete = [];
    state.tasks.forEach(task => {
        if (task.completed) idsToDelete.push(task.id);
    });

    idsToDelete.forEach(id => {
        deleteTask(id);
    });
}
