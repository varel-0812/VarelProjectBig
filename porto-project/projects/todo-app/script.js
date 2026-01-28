// Todo App - Full Functionality with Drag & Drop
document.addEventListener('DOMContentLoaded', () => {
    class TodoApp {
        constructor() {
            this.tasks = JSON.parse(localStorage.getItem('todoTasks')) || [];
            this.currentFilter = 'all';
            this.draggedItem = null;
            this.init();
        }
        
        init() {
            this.renderTasks();
            this.updateStats();
            this.setupEventListeners();
            this.loadSampleTasks();
        }
        
        loadSampleTasks() {
            if (this.tasks.length === 0) {
                const sampleTasks = [
                    {
                        id: Date.now() + 1,
                        text: "Buat website portfolio cinematic",
                        completed: true,
                        priority: "high",
                        dueDate: new Date().toISOString().split('T')[0],
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: Date.now() + 2,
                        text: "Pelajari JavaScript lanjutan",
                        completed: false,
                        priority: "medium",
                        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: Date.now() + 3,
                        text: "Desain UI untuk project baru",
                        completed: false,
                        priority: "high",
                        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: Date.now() + 4,
                        text: "Update CV dan portfolio",
                        completed: false,
                        priority: "medium",
                        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                        createdAt: new Date().toISOString()
                    }
                ];
                
                this.tasks = sampleTasks;
                this.saveTasks();
                this.renderTasks();
                this.updateStats();
            }
        }
        
        addTask(text, priority, dueDate) {
            const newTask = {
                id: Date.now(),
                text: text.trim(),
                completed: false,
                priority: priority || 'medium',
                dueDate: dueDate || null,
                createdAt: new Date().toISOString()
            };
            
            this.tasks.push(newTask);
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            this.showNotification('Tugas ditambahkan!');
        }
        
        toggleTask(id) {
            const taskIndex = this.tasks.findIndex(task => task.id === id);
            if (taskIndex !== -1) {
                this.tasks[taskIndex].completed = !this.tasks[taskIndex].completed;
                this.saveTasks();
                this.renderTasks();
                this.updateStats();
            }
        }
        
        editTask(id, newText) {
            const taskIndex = this.tasks.findIndex(task => task.id === id);
            if (taskIndex !== -1) {
                this.tasks[taskIndex].text = newText.trim();
                this.saveTasks();
                this.renderTasks();
            }
        }
        
        deleteTask(id) {
            this.tasks = this.tasks.filter(task => task.id !== id);
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            this.showNotification('Tugas dihapus!');
        }
        
        updateTaskPriority(id, priority) {
            const taskIndex = this.tasks.findIndex(task => task.id === id);
            if (taskIndex !== -1) {
                this.tasks[taskIndex].priority = priority;
                this.saveTasks();
                this.renderTasks();
            }
        }
        
        clearCompleted() {
            const completedCount = this.tasks.filter(task => task.completed).length;
            if (completedCount === 0) {
                this.showNotification('Tidak ada tugas yang selesai!');
                return;
            }
            
            if (confirm(`Hapus ${completedCount} tugas yang selesai?`)) {
                this.tasks = this.tasks.filter(task => !task.completed);
                this.saveTasks();
                this.renderTasks();
                this.updateStats();
                this.showNotification('Tugas selesai dihapus!');
            }
        }
        
        clearAll() {
            if (this.tasks.length === 0) {
                this.showNotification('Tidak ada tugas!');
                return;
            }
            
            if (confirm('Hapus semua tugas?')) {
                this.tasks = [];
                this.saveTasks();
                this.renderTasks();
                this.updateStats();
                this.showNotification('Semua tugas dihapus!');
            }
        }
        
        filterTasks(filter) {
            this.currentFilter = filter;
            this.renderTasks();
        }
        
        getFilteredTasks() {
            switch(this.currentFilter) {
                case 'active':
                    return this.tasks.filter(task => !task.completed);
                case 'completed':
                    return this.tasks.filter(task => task.completed);
                case 'high':
                    return this.tasks.filter(task => task.priority === 'high');
                default:
                    return this.tasks;
            }
        }
        
        renderTasks() {
            const taskList = document.getElementById('taskList');
            const filteredTasks = this.getFilteredTasks();
            
            if (filteredTasks.length === 0) {
                taskList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-clipboard-list"></i>
                        <h3>Tidak ada tugas</h3>
                        <p>Tambahkan tugas pertama Anda!</p>
                    </div>
                `;
                return;
            }
            
            taskList.innerHTML = '';
            
            filteredTasks.forEach(task => {
                const taskItem = this.createTaskElement(task);
                taskList.appendChild(taskItem);
            });
            
            this.setupDragAndDrop();
        }
        
        createTaskElement(task) {
            const li = document.createElement('div');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            li.draggable = true;
            li.dataset.id = task.id;
            
            const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
            
            li.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <div class="task-content">
                    <div class="task-text">${task.text}</div>
                    <div class="task-meta">
                        <span class="priority-badge ${task.priority}">
                            ${this.getPriorityLabel(task.priority)}
                        </span>
                        ${task.dueDate ? `
                            <span class="due-date-badge ${isOverdue ? 'overdue' : ''}">
                                <i class="fas fa-calendar"></i>
                                ${this.formatDate(task.dueDate)}
                            </span>
                        ` : ''}
                    </div>
                </div>
                <div class="task-actions">
                    <button class="task-btn edit-btn" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="task-btn delete-btn" title="Hapus">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            // Checkbox event
            const checkbox = li.querySelector('.task-checkbox');
            checkbox.addEventListener('change', () => this.toggleTask(task.id));
            
            // Edit button event
            const editBtn = li.querySelector('.edit-btn');
            editBtn.addEventListener('click', () => this.promptEditTask(task.id, task.text));
            
            // Delete button event
            const deleteBtn = li.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => this.deleteTask(task.id));
            
            // Priority badge click to change priority
            const priorityBadge = li.querySelector('.priority-badge');
            priorityBadge.addEventListener('click', () => this.cyclePriority(task.id));
            
            return li;
        }
        
        cyclePriority(id) {
            const taskIndex = this.tasks.findIndex(task => task.id === id);
            if (taskIndex === -1) return;
            
            const priorities = ['low', 'medium', 'high'];
            const currentIndex = priorities.indexOf(this.tasks[taskIndex].priority);
            const nextIndex = (currentIndex + 1) % priorities.length;
            
            this.updateTaskPriority(id, priorities[nextIndex]);
            this.showNotification(`Prioritas diubah ke ${this.getPriorityLabel(priorities[nextIndex])}`);
        }
        
        promptEditTask(id, currentText) {
            const newText = prompt('Edit tugas:', currentText);
            if (newText !== null && newText.trim() !== '') {
                this.editTask(id, newText);
                this.showNotification('Tugas diperbarui!');
            }
        }
        
        getPriorityLabel(priority) {
            const labels = {
                'low': 'Rendah',
                'medium': 'Sedang',
                'high': 'Tinggi'
            };
            return labels[priority] || 'Sedang';
        }
        
        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        }
        
        updateStats() {
            const totalTasks = this.tasks.length;
            const completedTasks = this.tasks.filter(task => task.completed).length;
            const pendingTasks = totalTasks - completedTasks;
            
            document.getElementById('totalTasks').textContent = totalTasks;
            document.getElementById('completedTasks').textContent = completedTasks;
            document.getElementById('pendingTasks').textContent = pendingTasks;
        }
        
        saveTasks() {
            localStorage.setItem('todoTasks', JSON.stringify(this.tasks));
        }
        
        exportTasks() {
            const exportData = {
                exportedAt: new Date().toISOString(),
                totalTasks: this.tasks.length,
                tasks: this.tasks
            };
            
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
            
            const exportFileDefaultName = `todo-tasks-${new Date().toISOString().split('T')[0]}.json`;
            
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
            
            this.showNotification('Tugas diexport!');
        }
        
        setupDragAndDrop() {
            const taskItems = document.querySelectorAll('.task-item');
            
            taskItems.forEach(item => {
                item.addEventListener('dragstart', this.handleDragStart.bind(this));
                item.addEventListener('dragover', this.handleDragOver.bind(this));
                item.addEventListener('drop', this.handleDrop.bind(this));
                item.addEventListener('dragend', this.handleDragEnd.bind(this));
            });
        }
        
        handleDragStart(e) {
            this.draggedItem = e.target;
            e.target.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', e.target.innerHTML);
        }
        
        handleDragOver(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            
            const afterElement = this.getDragAfterElement(e.clientY);
            const taskList = document.getElementById('taskList');
            
            if (afterElement == null) {
                taskList.appendChild(this.draggedItem);
            } else {
                taskList.insertBefore(this.draggedItem, afterElement);
            }
        }
        
        handleDrop(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        handleDragEnd(e) {
            e.target.classList.remove('dragging');
            
            // Update task order in array
            const newTaskOrder = [];
            document.querySelectorAll('.task-item').forEach(item => {
                const taskId = parseInt(item.dataset.id);
                const task = this.tasks.find(t => t.id === taskId);
                if (task) newTaskOrder.push(task);
            });
            
            this.tasks = newTaskOrder;
            this.saveTasks();
        }
        
        getDragAfterElement(y) {
            const draggableElements = [...document.querySelectorAll('.task-item:not(.dragging)')];
            
            return draggableElements.reduce((closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;
                
                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            }, { offset: Number.NEGATIVE_INFINITY }).element;
        }
        
        setupEventListeners() {
            // Add task button
            const addBtn = document.getElementById('addTaskBtn');
            const taskInput = document.getElementById('taskInput');
            const prioritySelect = document.getElementById('prioritySelect');
            const dueDate = document.getElementById('dueDate');
            
            addBtn.addEventListener('click', () => {
                const text = taskInput.value.trim();
                if (text) {
                    this.addTask(text, prioritySelect.value, dueDate.value);
                    taskInput.value = '';
                    taskInput.focus();
                    dueDate.value = '';
                }
            });
            
            // Enter key in input
            taskInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const text = taskInput.value.trim();
                    if (text) {
                        this.addTask(text, prioritySelect.value, dueDate.value);
                        taskInput.value = '';
                        taskInput.focus();
                        dueDate.value = '';
                    }
                }
            });
            
            // Filter buttons
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.filterTasks(btn.dataset.filter);
                });
            });
            
            // Clear completed button
            document.getElementById('clearCompletedBtn').addEventListener('click', () => {
                this.clearCompleted();
            });
            
            // Clear all button
            document.getElementById('clearAllBtn').addEventListener('click', () => {
                this.clearAll();
            });
            
            // Export button
            document.getElementById('exportBtn').addEventListener('click', () => {
                this.exportTasks();
            });
        }
        
        showNotification(message) {
            // Remove existing notifications
            document.querySelectorAll('.notification').forEach(n => n.remove());
            
            // Create notification element
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.textContent = message;
            
            document.body.appendChild(notification);
            
            // Remove notification after 3 seconds
            setTimeout(() => {
                notification.style.animation = 'slideIn 0.3s ease reverse';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }
    }
    
    // Initialize the app
    const todoApp = new TodoApp();
});