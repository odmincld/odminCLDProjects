//Start
//Fetch for Json
async function fetchTasks() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");
    return await response.json();
  } catch (err) {
    console.error("Ошибка загрузки:", err);
    return [];
  }
}

const mainUl = document.querySelector(".task-list");
const inputDiv = document.querySelector(".input-button");
const createTaskBtn = document.querySelector("#new-task-btn");
const inputTask = document.querySelector("#new-task-input");
const container = document.querySelector(".container");

//p Empty
function updateEmptyMessage() {
  const emptyMessage = document.getElementById("empty-message");
  const hasTasks = mainUl.querySelector("li");
  emptyMessage.style.display = hasTasks ? "none" : "block";
}

//Button Add
createTaskBtn.onclick = function () {
  let inputValue = inputTask.value;
  if (inputValue !== "") {
    const li = createTaskItem(inputValue);
    mainUl.prepend(li);
    inputTask.value = "";
    saveTasksToLocalStorage();
    updateEmptyMessage();
  }
};
//Enter in input
inputTask.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    createTaskBtn.click(); // имитируем клик по кнопке
  }
});

//Create li with buttons
function createTaskItem(task) {
  //Create li
  const createLi = document.createElement("li");
  createLi.className = "task";

  //Create Span
  const textSpan = document.createElement("span");
  textSpan.className = "task-text";
  textSpan.textContent = task["title"] || task;
  createLi.appendChild(textSpan);

  //Create div-button
  const divBtn = document.createElement("div");
  divBtn.className = "div-btn";
  createLi.appendChild(divBtn);

  //Create Btn in li
  const taskBtn = document.createElement("button");
  taskBtn.className = "task-btn list-btn";
  divBtn.appendChild(taskBtn);

  const deleteTaskBtn = document.createElement("button");
  deleteTaskBtn.className = "delete-btn list-btn";
  divBtn.appendChild(deleteTaskBtn);

  if (task["completed"] === true) {
    setTimeout(() => {
      const taskBtn = createLi.querySelector(".task-btn");
      taskBtn?.click();
    });
  }
  return createLi;
}

//Buttons function

container.addEventListener("click", function (event) {
  const li = event.target.closest("li");
  if (!li) return;

  const isDoneBtn = event.target.matches(".task-btn");
  const isDeleteBtn = event.target.matches(".delete-btn");

  //Logic DoneBtn
  if (isDoneBtn) {
    li.classList.toggle("task-done");
    event.target.classList.toggle("active");
    saveTasksToLocalStorage();
  }

  //Logic DeleteBtn
  else if (isDeleteBtn) {
    li.remove();
    saveTasksToLocalStorage();
    updateEmptyMessage();
  }
});

//Add Li in Ul
function renderTaskList(tasks) {
  tasks.forEach((task) => {
    const li = createTaskItem(task);
    mainUl.appendChild(li);
  });
  updateEmptyMessage();
}

// fetchTasks().then(renderTaskList);

const searchBtn = document.querySelector("#search-btn");
const searchInput = document.querySelector("#search-input");
searchInput.style.display = "none";

function activateSearch() {
  inputDiv.style.display = "none";
  searchInput.style.display = "flex";
  searchInput.focus();

  //Search logic
  searchInput.addEventListener("input", () => {
    const value = searchInput.value.toLowerCase();
    const list = document.querySelectorAll(".task-list li");
    list.forEach((li) => {
      console.log(li);
      const text = li.firstChild.textContent.toLowerCase();
      li.style.display = text.includes(value) ? "" : "none";
    });
  });
  document.addEventListener("click", handleOutsideClick);
}

function deactivateSearch() {
  if (searchInput.style.display !== "none") {
    const list = document.querySelectorAll(".task-list li");
    searchInput.value = "";
    searchInput.style.display = "none";
    inputDiv.style.display = "flex";

    list.forEach((li) => (li.style.display = ""));
    document.removeEventListener("click", handleOutsideClick);
  }
}

function handleOutsideClick(event) {
  const clickOutside =
    searchInput.style.display !== "none" && !event.target.closest(".list-btn") && !searchInput.contains(event.target) && event.target !== searchBtn;

  if (clickOutside) {
    deactivateSearch();
  }
}

//Search Btn Logic
searchBtn.addEventListener("click", () => {
  if (searchInput.style.display === "none") {
    activateSearch();
  } else deactivateSearch();
});

//Redactor li
container.addEventListener("dblclick", function (event) {
  const textSpan = event.target.closest(".task-text");
  if (!textSpan) return;
  const li = textSpan.closest("li");
  const oldText = textSpan.textContent;

  //Create Input
  const input = document.createElement("input");
  input.type = "text";
  input.value = oldText;
  input.className = "edit-input";
  input.style.flex = "1";

  textSpan.replaceWith(input);
  input.focus();

  function saveEdit() {
    const newText = input.value.trim();
    const finaleText = newText === "" ? oldText : newText;

    const newSpan = document.createElement("span");
    newSpan.className = "task-text";
    newSpan.textContent = finaleText;

    input.replaceWith(newSpan);
    saveTasksToLocalStorage();
  }
  input.addEventListener("blur", saveEdit);
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      saveEdit();
    }
  });
});

//Save Tasks
const STORAGE_KEY = "myTasks";

function saveTasksToLocalStorage() {
  const tasks = Array.from(document.querySelectorAll(".task-list li")).map((li) => {
    return {
      title: li.querySelector(".task-text").textContent,
      completed: li.classList.contains("task-done"),
    };
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

const storedTasks = loadTasksFromLocalStorage();

renderTaskList(storedTasks);
