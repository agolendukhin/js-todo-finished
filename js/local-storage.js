function readTasksFromLocalStorage() {
    return JSON.parse(localStorage.getItem('tasks'));
}

function updateTasksInLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(state.tasks));
}
