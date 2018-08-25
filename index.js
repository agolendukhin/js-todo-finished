const url = 'http://5b746c6ea583740014190933.mockapi.io/api/v1/tasks';
const req = new XMLHttpRequest();

let tasks = [];

req.responseType = 'json';
req.open('GET', url, true);
req.onload  = function() {
    tasks = req.response;
 
    const tasksUl = document.getElementsByClassName("todo-list")[0];
    tasks.forEach(task => {
         const li = `
         <li class="">
             <div class="view">
                 <input class="toggle" type="checkbox">
                 <label>${task.text}</label>
                 <button class="destroy"></button>
             </div>
             <input class="edit" value="${task.text}">
         </li>`;
         tasksUl.innerHTML += li;
    });
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
        const li = `
        <li class="">
            <div class="view">
                <input class="toggle" type="checkbox">
                <label>${task.text}</label>
                <button class="destroy"></button>
            </div>
            <input class="edit" value="${task.text}">
        </li>`;
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
