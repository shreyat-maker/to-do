
const frontPage = document.getElementById("frontPage");
const appContainer = document.getElementById("appContainer");
const startBtn = document.getElementById("startBtn");

const taskInput = document.getElementById("taskInput");
const prioritySelect = document.getElementById("prioritySelect");
const dueDateInput = document.getElementById("dueDate");
const addTaskBtn = document.getElementById("addTask");

const taskList = document.getElementById("taskList");
const completedList = document.getElementById("completedList");
const trashList = document.getElementById("trashList");

const clearAllBtn = document.getElementById("clearAll");
const showTasks = document.getElementById("showTasks");
const showCompleted = document.getElementById("showCompleted");
const showTrash = document.getElementById("showTrash");
const showNotes = document.getElementById("showNotes");

const completedSection = document.getElementById("completedSection");
const trashSection = document.getElementById("trashSection");
const notesSection = document.getElementById("notesSection");
const taskInputSection = document.getElementById("taskInputSection");

const countTasks = document.getElementById("countTasks");
const countCompleted = document.getElementById("countCompleted");
const countTrash = document.getElementById("countTrash");

const noteInput = document.getElementById("noteInput");
const addNoteBtn = document.getElementById("addNote");
const clearNotesBtn = document.getElementById("clearNotes");
const notesList = document.getElementById("notesList");


let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let trash = JSON.parse(localStorage.getItem("trash")) || [];
let notes = JSON.parse(localStorage.getItem("notes")) || [];

startBtn.addEventListener("click", () => {
  frontPage.style.display = "none";
  appContainer.style.display = "flex";
});

function saveAll() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("trash", JSON.stringify(trash));
  localStorage.setItem("notes", JSON.stringify(notes));
}


function renderTasks() {
 
  countTasks.textContent = tasks.filter(t => !t.completed).length;
  countCompleted.textContent = tasks.filter(t => t.completed).length;
  countTrash.textContent = trash.length;

  
  taskList.innerHTML = "";
  tasks.filter(t=>!t.completed).forEach((task,index)=>{
    const li=document.createElement("li");
    li.innerHTML=`
      <div>
        <span>${task.text}</span>
        <span class="task-meta">
          Priority: <span class="badge ${task.priority.toLowerCase()}">${task.priority}</span>
          ${task.dueDate?` | Due: ${task.dueDate}`:""}
        </span>
      </div>
      <div class="task-buttons">
        <button class="complete" onclick="markComplete(${index})">✔</button>
        <button class="edit" onclick="editTask(${index})">✏</button>
        <button class="delete" onclick="deleteTask(${index})">🗑</button>
      </div>
    `;
    taskList.appendChild(li);
  });

 
  completedList.innerHTML = "";
  tasks.filter(t=>t.completed).forEach(task=>{
    const li=document.createElement("li");
    li.classList.add("completed");
    li.innerHTML=`
      <div>
        <span>${task.text}</span>
        <span class="task-meta">
          Priority: <span class="badge ${task.priority.toLowerCase()}">${task.priority}</span>
          ${task.dueDate?` | Due: ${task.dueDate}`:""}
        </span>
      </div>
    `;
    completedList.appendChild(li);
  });

  trashList.innerHTML="";
  trash.forEach((task,index)=>{
    const li=document.createElement("li");
    li.classList.add("trashed");
    li.innerHTML=`
      <div>
        <span>${task.text}</span>
        <span class="task-meta">
          Priority: <span class="badge ${task.priority.toLowerCase()}">${task.priority}</span>
          ${task.dueDate?` | Due: ${task.dueDate}`:""}
        </span>
      </div>
      <div class="task-buttons">
        <button class="restore" onclick="restoreTask(${index})">♻️ Restore</button>
        <button class="delete" onclick="permanentDelete(${index})">❌ Delete</button>
      </div>
    `;
    trashList.appendChild(li);
  });

  
  notesList.innerHTML="";
  notes.forEach((note,index)=>{
    const li=document.createElement("li");
    li.innerHTML=`
      <div>
        <span>${note.text}</span>
        <span class="task-meta">Added on: ${note.date}</span>
      </div>
      <div class="task-buttons">
        <button class="delete" onclick="deleteNote(${index})">🗑</button>
      </div>
    `;
    notesList.appendChild(li);
  });
}

addTaskBtn.addEventListener("click",()=>{
  const text=taskInput.value.trim();
  const priority=prioritySelect.value;
  const dueDate=dueDateInput.value;
  if(!text) return alert("Enter a task!");
  tasks.push({text,priority,dueDate,completed:false});
  saveAll(); renderTasks();
  taskInput.value=""; dueDateInput.value="";
});
function markComplete(index){ tasks[index].completed=true; saveAll(); renderTasks(); }
function editTask(index){ const newText=prompt("Edit task:",tasks[index].text); if(newText){ tasks[index].text=newText; saveAll(); renderTasks(); } }
function deleteTask(index){ trash.push(tasks[index]); tasks.splice(index,1); saveAll(); renderTasks(); }
function restoreTask(index){ tasks.push(trash[index]); trash.splice(index,1); saveAll(); renderTasks(); }
function permanentDelete(index){ if(confirm("Permanently delete?")){ trash.splice(index,1); saveAll(); renderTasks(); } }
clearAllBtn.addEventListener("click",()=>{ if(confirm("Clear all tasks and trash?")){ tasks=[]; trash=[]; notes=[]; saveAll(); renderTasks(); } });

addNoteBtn.addEventListener("click",()=>{
  const text=noteInput.value.trim();
  if(!text) return alert("Write something!");
  notes.push({text,date:new Date().toLocaleString()});
  saveAll(); renderTasks();
  noteInput.value="";
});
function deleteNote(index){ notes.splice(index,1); saveAll(); renderTasks(); }
clearNotesBtn.addEventListener("click",()=>{ if(confirm("Clear all notes?")){ notes=[]; saveAll(); renderTasks(); } });

showTasks.addEventListener("click",()=>{
  taskInputSection.style.display="flex";
  taskList.style.display="block";
  completedSection.style.display="none";
  trashSection.style.display="none";
  notesSection.style.display="none";
});
showCompleted.addEventListener("click",()=>{
  taskInputSection.style.display="none";
  taskList.style.display="none";
  completedSection.style.display="block";
  trashSection.style.display="none";
  notesSection.style.display="none";
});
showTrash.addEventListener("click",()=>{
  taskInputSection.style.display="none";
  taskList.style.display="none";
  completedSection.style.display="none";
  trashSection.style.display="block";
  notesSection.style.display="none";
});
showNotes.addEventListener("click",()=>{
  taskInputSection.style.display="none";
  taskList.style.display="none";
  completedSection.style.display="none";
  trashSection.style.display="none";
  notesSection.style.display="block";
});

renderTasks();
