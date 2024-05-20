// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Function to generate a unique task id
function generateTaskId() {
  return nextId++;
}

// Function to create a task card
function createTaskCard(task) {
  return `
    <div class="card task-card mb-3" id="task-${task.id}">
      <div class="card-body">
        <h5 class="card-title">${task.title}</h5>
        <p class="card-text">${task.description}</p>
        <button class="btn btn-danger btn-sm delete-task" data-id="${task.id}">Delete</button>
      </div>
    </div>
  `;
}

// Function to render the task list and make cards draggable
function renderTaskList() {
  $('#todo-cards, #in-progress-cards, #done-cards').empty();
  taskList.forEach(task => {
    const taskCard = createTaskCard(task);
    $(`#${task.status}-cards`).append(taskCard);
  });

  $(".task-card").draggable({
    revert: "invalid",
    helper: "clone",
    start: function(event, ui) {
      ui.helper.css('z-index', 1000);
    }
  });

  $(".delete-task").click(handleDeleteTask);
}

// Function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();
  const title = $('#taskTitle').val();
  const description = $('#taskDescription').val();

  const newTask = {
    id: generateTaskId(),
    title,
    description,
    status: 'todo'
  };

  taskList.push(newTask);
  localStorage.setItem("tasks", JSON.stringify(taskList));
  localStorage.setItem("nextId", JSON.stringify(nextId));

  renderTaskList();
  $('#formModal').modal('hide');
  $('#taskForm')[0].reset();
}

// Function to handle deleting a task
function handleDeleteTask(event) {
  const taskId = $(event.target).data('id');
  taskList = taskList.filter(task => task.id !== taskId);
  localStorage.setItem("tasks", JSON.stringify(taskList));

  renderTaskList();
}

// Function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  const taskId = ui.draggable.attr('id').split('-')[1];
  const newStatus = $(this).closest('.lane').attr('id');

  taskList = taskList.map(task => {
    if (task.id == taskId) {
      task.status = newStatus;
    }
    return task;
  });

  localStorage.setItem("tasks", JSON.stringify(taskList));
  renderTaskList();
}

// When the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  renderTaskList();

  $('#taskForm').submit(handleAddTask);

  $(".card-body").droppable({
    accept: ".task-card",
    drop: handleDrop
  });

  // Assuming you have a due date field in your form with the ID #dueDate
  if ($('#dueDate').length) {
    $("#dueDate").datepicker();
  }
});
