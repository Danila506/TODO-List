import '../src/output.css'; // Укажите правильный путь к вашему CSS-файлу

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
    const taskDiv = document.createElement("button");
    taskDiv.classList.add(
        "bg-[#101826]",
        "text-white",
        "rounded-xl",
        "py-2",
        "px-4",
        "mb-2",
        "flex",
        "items-center",
        "justify-between"
    );

    const taskTextElement = document.createElement("span");
    taskTextElement.textContent = task.text;

    // Добавляем класс, если задача выполнена
    if (task.completed) {
        taskTextElement.classList.add("line-through", "opacity-50");
    }

    // Обработчик клика по задаче (переключение статуса)
    taskDiv.addEventListener("click", function () {
        toggleComplete(task.id); // Переключаем статус задачи
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

    // Обработчик клика по кнопке "EDIT"
    editButton.addEventListener("click", function (event) {
        event.stopPropagation(); // Останавливаем всплытие события

        // Создаем поле ввода
        const inputField = document.createElement("input");
        inputField.type = "text";
        inputField.value = task.text;
        inputField.classList.add(
            "bg-transparent",
            "outline-none",
            "text-white",
            "flex-1"
        );

        // Заменяем текстовый элемент на поле ввода
        taskDiv.replaceChild(inputField, taskTextElement);
        inputField.focus(); // Устанавливаем фокус на поле ввода

        // Флаг для отслеживания завершения редактирования
        let isEditingFinished = false;

        // Функция для завершения редактирования
        const finishEditing = () => {
            if (isEditingFinished) return; // Если редактирование уже завершено, выходим
            isEditingFinished = true; // Устанавливаем флаг

            const newText = inputField.value.trim();
            if (newText !== "") {
                task.text = newText; // Обновляем текст задачи
                taskTextElement.textContent = newText; // Обновляем текстовый элемент
            }
            // Возвращаем текстовый элемент на место
            taskDiv.replaceChild(taskTextElement, inputField);
            saveTasks(); // Сохраняем изменения
            displayTasks(tasks); // Обновляем отображение задач
        };

        // Завершаем редактирование при нажатии Enter
        inputField.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                finishEditing();
            }
        });

        // Завершаем редактирование при потере фокуса
        inputField.addEventListener("blur", function () {
            finishEditing();
        });
    });

    // Обработчик клика по кнопке "DELETE"
    deleteButton.addEventListener("click", function (event) {
        event.stopPropagation(); // Останавливаем всплытие события
        deleteTask(task.id); // Удаляем задачу
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

// Функция для добавления новой задачи
function addTask(text) {
    const newTask = {
        id: Date.now().toString(),
        text: text,
        completed: false,
    };
    tasks.push(newTask);
    saveTasks();
    displayTasks(tasks);
}

// Функция для удаления задачи
function deleteTask(taskId) {
    tasks = tasks.filter((task) => task.id !== taskId);
    saveTasks();
    displayTasks(tasks);
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
