import "../src/output.css"; // Укажите правильный путь к вашему CSS-файлу
import "animate.css";

const newTaskForm = document.getElementById("newTaskForm");
const newTaskInput = document.getElementById("newTaskInput");
const tasksContainer = document.getElementById("tasks");

const tasksKey = "todoTasks";

// Функция для загрузки задач из localStorage
function loadTasks() {
    const tasksString = localStorage.getItem(tasksKey);
    return tasksString ? JSON.parse(tasksString) : [];
}

// Функция для сохранения задач в localStorage
function saveTasks() {
    localStorage.setItem(tasksKey, JSON.stringify(tasks));
}

// Функция для создания элемента задачи
function createTaskElement(task) {
    const taskDiv = document.createElement("div"); // Используем <div> вместо <button>
    taskDiv.setAttribute("data-task-id", task.id);
    taskDiv.classList.add(
        "bg-[#101826]",
        "text-white",
        "rounded-xl",
        "py-2",
        "px-4",
        "mb-2",
        "flex",
        "items-center",
        "justify-between",
        "cursor-pointer" // Добавляем курсор, чтобы элемент выглядел кликабельным
    );

    const taskTextElement = document.createElement("span");
    taskTextElement.textContent = task.text;

    if (task.completed) {
        taskTextElement.classList.add("line-through", "opacity-50");
    }

    taskDiv.addEventListener("click", function () {
        toggleComplete(task.id);

        // Анимация при переключении статуса
        taskDiv.classList.add("animate__animated", "animate__flipInX");
        taskDiv.addEventListener("animationend", () => {
            taskDiv.classList.remove("animate__flipInX");
        });
    });

    // Предотвращаем действие по умолчанию для пробела
    taskDiv.addEventListener("keydown", function (e) {
        if (e.key === " ") {
            e.preventDefault(); // Предотвращаем действие по умолчанию (клик)
        }
    });

    const buttons = document.createElement("div");
    buttons.classList.add("flex", "gap-2");

    const editButton = document.createElement("button");
    editButton.textContent = "EDIT";
    editButton.classList.add(
        "bg-[linear-gradient(to_right,#ec4899,#8b5cf6)]",
        "text-[#ec4899]",
        "text-transparent",
        "bg-clip-text",
        "cursor-pointer",
        "font-bold",
        "transition",
        "duration-300",
        "hover:opacity-80"
    );

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "DELETE";
    deleteButton.classList.add(
        "text-[#dc143c]",
        "font-bold",
        "cursor-pointer",
        "transition",
        "duration-300",
        "hover:opacity-80"
    );

    editButton.addEventListener("click", function (event) {
        event.stopPropagation();

        // Анимация при редактировании
        taskDiv.classList.add("animate__animated", "animate__pulse");

        const inputField = document.createElement("input");
        inputField.type = "text";
        inputField.value = task.text;
        inputField.classList.add(
            "bg-transparent",
            "outline-none",
            "text-white",
            "flex-1"
        );

        taskDiv.replaceChild(inputField, taskTextElement);
        inputField.focus();
        inputField.setSelectionRange(0, inputField.value.length); // Выделяем весь текст

        let isEditingFinished = false;

        const finishEditing = () => {
            if (isEditingFinished) return;
            isEditingFinished = true;

            const newText = inputField.value.trim();
            if (newText !== "") {
                task.text = newText;
                taskTextElement.textContent = newText;
            }
            taskDiv.replaceChild(taskTextElement, inputField);
            saveTasks();
            displayTasks(tasks);

            // Убираем анимацию после завершения редактирования
            taskDiv.classList.remove("animate__pulse");
        };

        inputField.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                finishEditing();
            }
            if (e.key === "Escape") {
                taskDiv.replaceChild(taskTextElement, inputField); // Отмена редактирования
            }
            if (e.key === " ") {
                e.stopPropagation(); // Останавливаем всплытие
            }
        });

        inputField.addEventListener("blur", function () {
            finishEditing();
        });
    });

    deleteButton.addEventListener("click", function (event) {
        event.stopPropagation();
        deleteTask(task.id);
    });

    taskDiv.appendChild(taskTextElement);
    buttons.appendChild(editButton);
    buttons.appendChild(deleteButton);
    taskDiv.appendChild(buttons);

    return taskDiv;
}

// Функция для отображения задач на странице
function displayTasks(tasks) {
    tasksContainer.innerHTML = ""; // Очищаем контейнер задач
    tasks.forEach((task) => {
        const taskElement = createTaskElement(task);
        tasksContainer.appendChild(taskElement);
    });
}

function deleteTask(taskId) {
    const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
    if (taskElement) {
        // Анимация перед удалением
        taskElement.classList.add("animate__animated", "animate__fadeOutUp");
        taskElement.addEventListener("animationend", () => {
            tasks = tasks.filter((task) => task.id !== taskId);
            saveTasks();
            displayTasks(tasks);
        });
    }
}
// Функция для добавления новой задачи
function addTask(text) {
    const newTask = {
        id: Date.now().toString(),
        text: text,
        completed: false,
    };
    tasks.push(newTask);
    saveTasks();

    // Анимация для новой задачи
    const taskElement = createTaskElement(newTask);
    taskElement.classList.add("animate__animated", "animate__fadeInDown");
    tasksContainer.appendChild(taskElement);
}

// Функция для переключения статуса задачи
function toggleComplete(taskId) {
    tasks = tasks.map((task) => {
        if (task.id === taskId) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    saveTasks();
    displayTasks(tasks);
}

// Получаем массив задач из localStorage
let tasks = loadTasks();
const clearAllButton = document.getElementById("clearAllButton");

// Функция для очистки всех задач
function clearAllTasks() {
    const taskElements = tasksContainer.querySelectorAll("[data-task-id]");

    // Анимация для каждого элемента
    taskElements.forEach((taskElement) => {
        taskElement.classList.add("animate__animated", "animate__fadeOutUp");
    });

    // Ждем завершения анимации перед удалением
    setTimeout(() => {
        tasks = [];
        saveTasks();
        displayTasks(tasks);
    }, 500); // Время должно соответствовать длительности анимации
}

// Обработчик для кнопки "Clear all"
clearAllButton.addEventListener("click", function () {
    clearAllTasks();
});

// Отображаем задачи на странице при загрузке
displayTasks(tasks);

// Добавляем обработчик события для отправки формы
newTaskForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Предотвращаем отправку формы

    const taskText = newTaskInput.value.trim();
    if (taskText !== "") {
        addTask(taskText);
        newTaskInput.value = ""; // Очищаем поле ввода
    }
});
