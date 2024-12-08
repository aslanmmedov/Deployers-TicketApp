
import {
  addNewData,
  deleteDataById,
  editDataById,
  editDataByIdPatch,
  getAllData,
} from "../services/api/admin-dash";

let body = document.querySelector("body");
// adding-new task

let addBtn = document.querySelector(".add-btn");
let taskName = document.querySelector(".task-name");
let taskDesc = document.querySelector(".task-description");
let taskTopic = document.querySelector(".task-topic");
let taskDeadline = document.querySelector(".task-deadline");

// console.log(window.location.pathname)

addBtn.addEventListener("click", async function addNewTask(e) {
  e.preventDefault();
  let isOnPage = {
    isOnPage: true,
  };
  if (window.location.pathname === "/teacher-dashboard.html") {
    await editDataByIdPatch("teachers", 1, isOnPage);
  }

  let teachers = await getAllData("teachers");
  let teacher = teachers.data.find((d) => d.isOnPage === true);

  let taskContent = {
    title: taskName.value.trim(),
    description: taskDesc.value.trim(),
    topic: taskTopic.value.trim(),
    deadline: taskDeadline.value,
    createdAt: new Date().toISOString(),
    teacherId: teacher.id,
    assignments: [],
  };
  await addNewData("tasks", taskContent);

  resetInput();
  createTaskCards();
});

function resetInput() {
  taskName.value = "";
  taskDesc.value = "";
  taskTopic.value = "";
  taskDeadline.value = "";
}

// Mobile menu functionality
const mobileMenuButton = document.querySelector(".mobile-menu-button");
const sidebar = document.querySelector(".sidebar");
const overlay = document.querySelector(".overlay");

function toggleMobileMenu() {
  sidebar.classList.toggle("translate-x-0");
  sidebar.classList.toggle("z-40");
  //  overlay.classList.toggle('hidden');
  //  setTimeout(() => overlay.classList.toggle('opacity-0'), 0);
  //  document.body.style.overflow = sidebar.classList.contains('translate-x-0') ? 'hidden' : '';
}

mobileMenuButton.addEventListener("click", toggleMobileMenu);
overlay.addEventListener("click", toggleMobileMenu);

// Close mobile menu on window resize if open
window.addEventListener("resize", () => {
  if (
    window.innerWidth >= 1024 &&
    sidebar.classList.contains("translate-x-0")
  ) {
    toggleMobileMenu();
  }
});

// Notification animation
const notificationIcon = document.querySelector(
  ".material-icons-outlined:nth-child(2)"
);
setInterval(() => {
  notificationIcon.classList.add("scale-110");
  setTimeout(() => notificationIcon.classList.remove("scale-110"), 200);
}, 5000);

//  teacher dashboard

let rpMain = document.querySelector(".tc-dsh-main");

rpMain.addEventListener("click", function () {
  window.location.replace("index.html");
});

//Add student side bar

let studSide = document.querySelector(".stud-add");

let studTasks = document.querySelector(".stud-tasks-cards");

async function createTaskCards() {
  let res = await getAllData("tasks");
  studTasks.innerHTML = "";
  res.data.forEach((task) => {
    let tabElem = document.createElement("div");
    tabElem.className =
      "bg-white rounded-xl shadow-lg p-6 h-64 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-slide-up flex flex-col gap-3";
    tabElem.style = "animation-delay: 0.1s";
    tabElem.innerHTML = `
                    <h3 class="text-xl font-bold text-indigo-800">${task.title}</h3>
                    <p>${task.description}</p>
                    <div class = "flex flex-col mt-8">
                    <span>Topic: ${task.topic}</span>
                    <span class="grade-point">Deadline: ${task.deadline}</span>
                    </div>
                    <div class = "flex gap-2 justify-end mt-2">
                        <button class = "edit btn-stud-task px-4 py-1 min-w-[40px] text-center text-white bg-blue-800 border border-blue-800 rounded-lg active:text-blue-800 hover:bg-transparent hover:text-blue-800 focus:outline-none focus:ring" data-id="${task.id}">Edit</button>
                    <button class = "delete btn-stud-task px-4 py-1 min-w-[40px] text-center text-white bg-blue-800 border border-blue-800 rounded-lg active:text-blue-800 hover:bg-transparent hover:text-blue-800 focus:outline-none focus:ring" data-id="${task.id}">Delete</button>
                    </div>
                    `;
    studTasks.appendChild(tabElem);
  });

  let dltBtn = document.querySelectorAll(".delete");
  let editBtn = document.querySelectorAll(".edit");

  dltBtn.forEach((btn) => {
    btn.addEventListener("click", function () {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3730A3",
        cancelButtonColor: "#E0E7FF",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          let dataId = btn.getAttribute("data-id");
          deleteDataById("tasks", dataId);
          btn.parentElement.parentElement.remove();
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });
        }
      });
    });
  });

  let editModal = document.querySelector(".edit-task-form");
  editModal.classList.add("-none");

  editBtn.forEach((btn) => {
    let dataIdEdit = btn.getAttribute("data-id");

    btn.addEventListener("click", function (e) {
      editModal.classList.remove("-none");
      const taskId = this.getAttribute("data-id");
      // let clsBtn = document.querySelector(".close-btn");
      // clsBtn.addEventListener("click",function(){
      //   editModal.classList.add("-none")
      // })
      const selectedTask = res.data.find((q) => q.id === taskId);
       console.log(selectedTask)
      // e.preventDefault();

      // deleteDataById("tasks",dataId);
      // btn.parentElement.parentElement.remove();
      let tNameUpdate = document.querySelector(".t-name-update");
      let tTopicUpdate = document.querySelector(".t-topic-update");
      let tDescUpdate = document.querySelector(".t-desc-update");
      let tDeadlineUpdate = document.querySelector(".t-deadline-update");
      let editForm = document.querySelector(".edit-form");

      console.log(tNameUpdate.value );

      // console.log(tNameUpdate.ariaValueMax.trim());

    
      editForm.addEventListener("submit", function (e) {

        let newData = {
          title: tNameUpdate.value.trim(),
          description: tDescUpdate.value.trim(),
          topic: tTopicUpdate.value.trim(),
          deadline: tDeadlineUpdate.value,
        };

        editDataByIdPatch("tasks", dataIdEdit, newData);
      });
    });
  });
}
createTaskCards();
async function createStudentTable() {
  let res = await getAllData("students");
  res.data.forEach((student) => {
    let tabElem = document.createElement("div");
    tabElem.className =
      "bg-white rounded-xl shadow-lg mt-6 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl";

    tabElem.innerHTML += `
              <div class = "flex justify-between">
                <h4 class = "stud-name">${student.fullName}</h4>
                <button class = " btn-stud-task px-6 py-2 min-w-[50px] text-center text-white bg-indigo-800 border border-indigo-800 rounded active:text-indigo-800 hover:bg-transparent hover:text-indigo-800 focus:outline-none focus:ring" data-id = "${student.id}">Tasks</button>
              </div>
        `;
    studSide.appendChild(tabElem);
  });

  let btnTask = document.querySelectorAll(".btn-stud-task");

  btnTask.forEach((btn) => {
    btn.addEventListener("click", function () {});
  });
}
createStudentTable();

// Task display form
let activateForm = document.querySelector(".activate-form");
let activeTask = document.querySelector(".active-task");
let clsTaskForm = document.querySelector(".close-form");

clsTaskForm.classList.add("-none");
activateForm.addEventListener("click", function () {
  activeTask.classList.add("-block");
  clsTaskForm.classList.remove("-none");
  clsTaskForm.addEventListener("click", function () {
    activeTask.classList.remove("-block");
    clsTaskForm.classList.add("-none");
  });
});


