const addButton = document.getElementById("task-button");
const taskList = document.getElementById("task-list");
const taskInput = document.getElementById("text-input");

addButton.addEventListener("click", () => {
    const taskText = taskInput.value;
    if (taskText.trim() !== "") {
        const taskItem = document.createElement("li");
        taskItem.textContent = taskText
        taskList.append(taskItem);
        taskInput.value = "";
        
    }
});