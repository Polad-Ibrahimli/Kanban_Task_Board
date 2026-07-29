var allTasks = loadFromStorage();
let editingId=null;
let draggedId=null;

const board = document.querySelector('.board');
const columns = document.querySelectorAll('.column');
const modal = document.querySelector('.modal');
const addTaskBtn = document.querySelector('.add-task-btn');
const cancelBtn = document.querySelector('.cancel-btn');
const saveBtn = document.querySelector('.save-btn');
const titleInput = document.querySelector('#title');
const descInput = document.querySelector('#description');
const priorityInput = document.querySelector('#priority');
const searchInput = document.querySelector('.task-search');
const priorityFilter = document.querySelector('.priority-filter');


function render(tasks=allTasks){
    columns.forEach(column=>{
        const columnName=column.dataset.column;
        const taskList=column.querySelector(".task-list");
        const countBadge=column.querySelector(".task-count");

        taskList.innerHTML="";

        const tasksInColumn=tasks.filter(t=>t.column===columnName);
        countBadge.textContent=tasksInColumn.length;

        if (tasksInColumn.length==0){
            taskList.innerHTML=`<div class="empty-state">Burada tapşırıq yoxdur.</div>`
            return;
        }

        tasksInColumn.forEach(task=>{
            const card=document.createElement("div");
            card.className="task-card";
            card.dataset.id=task.id;
            card.draggable=true;

            card.innerHTML = `
                <span class="priority-badge priority-${task.priority}">${task.priority}</span>
                <div class="task-card-title">${task.title}</div>
                <div class="task-card-desc">${task.description}</div>
                <div class="task-card-footer">
                    <span>${task.createdAt}</span>
                    <div class="actions">
                        <button class="edit-btn">✏️</button>
                        <button class="delete-btn">🗑️</button>
                    </div>
                </div>
            `;
            taskList.appendChild(card);

        })

    })
    saveToStorage();

}
render();

addTaskBtn.addEventListener("click",()=>{
    modal.classList.add("active");
});

cancelBtn.addEventListener("click",()=>{
    closeModal();
})

modal.addEventListener("click",(e)=>{
    if(e.target===modal){
        closeModal();
    }
})

function closeModal(){
    modal.classList.remove("active");
    titleInput.value="";
    descInput.value="";
    priorityInput.value="low";
    editingId=null;
}

saveBtn.addEventListener("click",()=>{
    const title=titleInput.value.trim();
    const description=descInput.value.trim();
    const priority=priorityInput.value;

    if(title===""){
        alert("Başlıq mütləqdir!");
        return;
    }

    const isDuplicate=allTasks.some(t=>t.title.toLowerCase()===title.toLowerCase()&&t.id!==editingId);

    if(isDuplicate){
        alert("Bu adda tapşırıq artıq mövcuddur!");
        return;
    }

    if(editingId){
        task=allTasks.find(t=>t.id===editingId);

        task.id=editingId;
        task.title=title;
        task.description=description;
        task.priority=priority;
    }
    else{
        const newTask={
            id:Date.now(),
            title,
            description,
            priority,
            column:"to-do",
            createdAt:new Date().toLocaleDateString("en-Us",{month:"2-digit",day:"2-digit"})

        };
        allTasks.push(newTask);
    }

    render();
    closeModal();
    
});

board.addEventListener("click",(e)=>{
    const card=e.target.closest(".task-card");

    if(!card){
        return;
    }
    var taskId=Number(card.dataset.id);

    if(e.target.classList.contains("delete-btn")){
        allTasks=allTasks.filter(t=>t.id!==taskId);
        render();
    }
    else if(e.target.classList.contains("edit-btn")){
        editingId=taskId;
        const task=allTasks.find(t=>t.id===editingId);

        titleInput.value = task.title;
        descInput.value = task.description;
        priorityInput.value = task.priority;

        modal.classList.add("active");

    }
})

let draggedTaskId = null;

board.addEventListener("dragstart", (e) => {
    const card = e.target.closest(".task-card");
    if (!card) return;
    draggedTaskId = Number(card.dataset.id);
    e.dataTransfer.setData("text/plain", draggedTaskId);
    card.classList.add("dragging");
});

board.addEventListener("dragend", (e) => {
    const card = e.target.closest(".task-card");
    if (card) card.classList.remove("dragging");
});

columns.forEach(column => {
    const taskList = column.querySelector(".task-list");

    taskList.addEventListener("dragover", (e) => {
        e.preventDefault(); // required, or drop will never fire
        taskList.classList.add("drag-over");
    });

    taskList.addEventListener("dragleave", () => {
        taskList.classList.remove("drag-over");
    });

    taskList.addEventListener("drop", (e) => {
        e.preventDefault();
        taskList.classList.remove("drag-over");

        const task = allTasks.find(t => t.id === draggedTaskId);
        if (task) {
            task.column = column.dataset.column;
            render();
        }
        draggedTaskId = null;
    });
});



// ---- LOCAL STORAGE ----
function saveToStorage() {
    localStorage.setItem('kanbanTasks', JSON.stringify(allTasks));
}

function loadFromStorage() {
    const saved = localStorage.getItem('kanbanTasks');
    return saved ? JSON.parse(saved) : [];
}




// ---- SEARCH & FILTER ----
function applyFilters() {
    const keyword = searchInput.value.trim().toLowerCase();
    const priority = priorityFilter.value;

    const filtered = allTasks.filter(task => {
        const matchesKeyword = task.title.toLowerCase().includes(keyword);
        const matchesPriority = (priority === "all") || (task.priority === priority);
        return matchesKeyword && matchesPriority;
    });

    render(filtered);
}

searchInput.addEventListener("input", applyFilters);
priorityFilter.addEventListener("change", applyFilters);