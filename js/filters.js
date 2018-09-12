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
    state.tasks.forEach(task => {
        const taskLi = getDomElement(`task-${task.id}`, true);
        taskLi.style.display = 'block';
    })
}

function filterActive() {
    activateFilterButton('active');
    state.tasks.forEach(task => {
        const taskLi = getDomElement(`task-${task.id}`, true);
        if (!task.completed) {
            taskLi.style.display = 'block';
            return;
        }
        taskLi.style.display = 'none';
    })
}

function filterCompleted() {
    activateFilterButton('completed');
    state.tasks.forEach(task => {
        const taskLi = getDomElement(`task-${task.id}`, true);
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
            element.classList.add('selected');
            continue;
        }
        element.classList.remove('selected');
    }
}

function getFiltersElements() {
    const all = getDomElement('all-filter');
    const active = getDomElement('active-filter');
    const completed = getDomElement('completed-filter');

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
