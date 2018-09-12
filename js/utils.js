function getNewTaskId(tasks) {
    if (!tasks.length) return "1";
    const id = +tasks[tasks.length - 1].id + 1;
    return String(id);
}

function getTasksActiveCount() {
    return state.tasks.reduce((counter, task) => {
        return !task.completed ? ++counter : counter
    }, 0);
}

function getDomElement(name, byId) {
    if (byId) return document.getElementById(name);
    return document.getElementsByClassName(name)[0];
}

function addEventListeners(elementsHandlers) {
    elementsHandlers.forEach(item => {
        const element = getDomElement(item.name);
        element.addEventListener(item.event, (e) => {
            item.handler(e)
        })
    })
}
