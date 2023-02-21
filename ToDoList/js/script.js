
class ToDoList {
    constructor() {
        this.plannedTasks = document.getElementById("planned-tasks");
        this.completedTasks = document.getElementById("completed-tasks");
        this.taskInput = document.getElementById("input-task");
        this.addTaskBtn = document.getElementById("add-task");
        this.addTaskBtn.addEventListener("click", this.addTask.bind(this));
    }

    createNewTask(task, completed) {

        const singleTask = document.createElement('li');
        const checkbox = document.createElement('button');
        checkbox.className = "checkbox";
        if (completed) {
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

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = "<button class='delete'></button>"
        singleTask.appendChild(checkbox);
        singleTask.appendChild(label);
        singleTask.appendChild(input);
        singleTask.appendChild(actionButtons);

        return singleTask;

    }
}

class SaveAndLoadTasks extends ToDoList {

    saveListTasks() {
        const plannedTasksList = document.getElementById("planned-tasks");

        const plannedTasksArr = [];
        for (let i = 0; i < plannedTasksList.children.length; i++) {
            plannedTasksArr.push(plannedTasksList.children[i].getElementsByTagName('label')[0].innerText);
        }

        const completedTasksList = document.getElementById("completed-tasks");

        const completedTasksArr = [];
        for (let i = 0; i < completedTasksList.children.length; i++) {
            completedTasksArr.push(completedTasksList.children[i].getElementsByTagName('label')[0].innerText);
        }

        localStorage.removeItem('todo')
        localStorage.setItem('todo', JSON.stringify({
            plannedTasks: plannedTasksArr,
            completedTasks: completedTasksArr
        }));
    }

    loadListTasks() {
        return JSON.parse(localStorage.getItem('todo'));
    }

    loader() {

        const data = this.loadListTasks();
        for(let i = 0; i<data.plannedTasks.length; i++) {
            const singleTask = this.createNewTask(data.plannedTasks[i], false);
            this.plannedTasks.appendChild(singleTask);
            this.bindTaskEvents(singleTask, this.completedTask);
        }

        for(let i = 0; i<data.completedTasks.length; i++) {
            const singleTask = this.createNewTask(data.completedTasks[i], true);
            const checkbox = document.createElement('button');
            checkbox.innerHTML = "<input type='checkbox' checked='checked'>";

            this.completedTasks.appendChild(singleTask);
            this.bindTaskEvents(singleTask, this.plannedTask);
        }

    }

}

class ActionsWithTasks extends SaveAndLoadTasks {
    addTask() {
        if(this.taskInput.value) {
            const singleTask = this.createNewTask(this.taskInput.value, false);
            this.plannedTasks.appendChild(singleTask);
            this.bindTaskEvents(singleTask, this.completedTask)
            this.taskInput.value = "";
        }
        // this.saveListTasks();
    }

    deleteTask() {

        const singleTask = this.parentNode.parentNode;
        if (singleTask) {
        const ul = singleTask.parentNode;
        ul.removeChild(singleTask);
        }
        // this.saveListTasks();
    }
    editTask() {
        const editButton = this;
        const singleTask = this.parentNode.parentNode;
        const label = singleTask.querySelector('label');
        const input = singleTask.querySelector('input[type=text]');

        const containsClass = singleTask.classList.contains('editMode');

        if(containsClass) {
            label.innerText = input.value;
            editButton.className = "edit";
        } else {
            input.value =label.innerText;
            editButton.className = "save";
        }
        singleTask.classList.toggle('editMode');
        // this.saveListTasks();

    }

    completedTask() {
        const singleTask = this.parentNode.parentNode;
        const completedTasksList = document.getElementById("completed-tasks");
        const checkbox = singleTask.querySelector('button.checkbox input');
        checkbox.className = "completed";
        checkbox.innerHTML = "<input type='checkbox' checked='checked'>";
        completedTasksList.appendChild(singleTask);
        console.log(singleTask);

        this.bindTaskEvents(singleTask, this.plannedTask);
        // this.saveListTasks();
    }

    plannedTask() {
        const singleTask = this.parentNode.parentNode;
        const checkbox = singleTask.querySelector('button.checkbox input');
        checkbox.className = "planned";

        this.plannedTasks.appendChild(singleTask);
        this.saveListTasks();
        this.bindTaskEvents(singleTask, this.completedTask);
    }

    bindTaskEvents(singleTask, checkboxEvent) {

        const checkbox = singleTask.querySelector('button.checkbox input');
        const editButton = singleTask.querySelector('button.edit');
        const deleteButton = singleTask.querySelector('button.delete');
        const saveButton = document.getElementById("save-progress");

        checkbox.onclick = checkboxEvent;
        editButton.onclick = this.editTask;
        deleteButton.onclick = this.deleteTask;
        saveButton.onclick = this.saveListTasks;

    }

}


const toDoList = new ActionsWithTasks();
toDoList.loader();