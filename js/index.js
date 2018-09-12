let state = {
    tasks: [],
    completed_all: false
};

window.onload = function() {
    init();
}

function init() {
    addEventListeners([
        {name: 'new-todo', event: 'keydown', handler: addTask},
        {name: 'toggle-all', event: 'click', handler: toggleAllTasks},
        {name: 'all-filter', event: 'click', handler: filterAll},
        {name: 'active-filter', event: 'click', handler: filterActive},
        {name: 'completed-filter', event: 'click', handler: filterCompleted},
        {name: 'clear-completed', event: 'click', handler: clearCompleted}
    ]);

    state.tasks = readTasksFromLocalStorage();
    renderTasks(state.tasks);

    const filter = window.location.hash.slice(2);
    activateFilter(filter);
}

function updateElements() {
    const count = getTasksActiveCount();

    updateItemsLeft(count);

    toggleClearCompleted(count);

    updateToggleAllTasksCheckbox(!count);

    updateTasksInLocalStorage();
}
