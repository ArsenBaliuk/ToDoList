const addButton = document.getElementById('add-task');
const inputTask = document.getElementById('input-task');
const plannedTasks = document.getElementById('planned-tasks');
const completedTasks = document.getElementById('completed-tasks');


function createNewTask(task, completed) {

    const singleTask = document.createElement('li');
    const checkbox = document.createElement('button');
    checkbox.className = "checkbox";
    if(completed) {
        checkbox.innerHTML = "<input type='checkbox' checked='checked'>";

    } else {
        checkbox.innerHTML = "<input type='checkbox'>";
    }
    const label = document.createElement('label');
    label.innerText = task;

    const input = document.createElement('input');
    input.type = "text";

    const actionButtons = document.createElement('div');
    actionButtons.className = "action-buttons";
    actionButtons.innerHTML = " <button class='edit'></button>\n" + "<button class='delete'></button>";

    singleTask.appendChild(checkbox);
    singleTask.appendChild(label);
    singleTask.appendChild(input);
    singleTask.appendChild(actionButtons);

    return singleTask;

}

function addTask() {
    if(inputTask.value) {
        const singleTask = createNewTask(inputTask.value, false);
        plannedTasks.appendChild(singleTask);
        bindTaskEvents(singleTask, completedTask)
        inputTask.value = "";
    }
    saveListTasks();
}

addButton.onclick = addTask;

function deleteTask() {
    const singleTask = this.parentNode.parentNode;
    const ul = singleTask.parentNode;
    ul.removeChild(singleTask);
    saveListTasks();
}

function editTask() {
    const editButton = this;
    const singleTask = this.parentNode.parentNode;
    const label = singleTask.querySelector('label');
    const input = singleTask.querySelector('input[type=text]');

    const containsClass = singleTask.classList.contains('editMode');

    if(containsClass) {
        label.innerText = input.value;
        editButton.className = "edit";
        saveListTasks();
    } else {
        input.value =label.innerText;
        editButton.className = "save";
    }
    singleTask.classList.toggle('editMode');

}

function completedTask() {
    const singleTask = this.parentNode.parentNode;
    const checkbox = singleTask.querySelector('button.checkbox input');
    checkbox.className = "completed";
    checkbox.innerHTML = "<input type='checkbox' checked='checked'>";

    completedTasks.appendChild(singleTask);
    bindTaskEvents(singleTask, plannedTask);
    saveListTasks();
}

function plannedTask() {
    const singleTask = this.parentNode.parentNode;
    const checkbox = singleTask.querySelector('button.checkbox input');
    checkbox.className = "planned";

    plannedTasks.appendChild(singleTask);
    bindTaskEvents(singleTask, completedTask);
    saveListTasks();
}

function bindTaskEvents(singleTask, checkboxEvent) {

    const checkbox = singleTask.querySelector('button.checkbox input');
    const editButton = singleTask.querySelector('button.edit');
    const deleteButton = singleTask.querySelector('button.delete');

    checkbox.onclick = checkboxEvent;
    editButton.onclick = editTask;
    deleteButton.onclick = deleteTask;
}

function saveListTasks() {

    const plannedTasksArr = [];
    for (let i = 0; i < plannedTasks.children.length; i++) {
        plannedTasksArr.push(plannedTasks.children[i].getElementsByTagName('label')[0].innerText);
    }

    const completedTasksArr = [];
    for (let i = 0; i < completedTasks.children.length; i++) {
        completedTasksArr.push(completedTasks.children[i].getElementsByTagName('label')[0].innerText);
    }


    localStorage.removeItem('todo')
    localStorage.setItem('todo', JSON.stringify({
        plannedTasks: plannedTasksArr,
        completedTasks: completedTasksArr
    }));
}

function loadListTasks() {
    return JSON.parse(localStorage.getItem('todo'));
}

const data = loadListTasks();

for(let i = 0; i<data.plannedTasks.length; i++) {
    const singleTask = createNewTask(data.plannedTasks[i], false);
    plannedTasks.appendChild(singleTask);
    bindTaskEvents(singleTask, completedTask);
}

for(let i = 0; i<data.completedTasks.length; i++) {
    const singleTask = createNewTask(data.completedTasks[i], true);
    const checkbox = document.createElement('button');
    checkbox.innerHTML = "<input type='checkbox' checked='checked'>";

    completedTasks.appendChild(singleTask);
    bindTaskEvents(singleTask, plannedTask);
}