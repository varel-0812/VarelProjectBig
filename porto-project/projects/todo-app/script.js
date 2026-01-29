document.addEventListener('DOMContentLoaded', function() {
    // Elemen DOM
    const todoInput = document.getElementById('todoInput');
    const addTodoBtn = document.getElementById('addTodoBtn');
    const todoList = document.getElementById('todoList');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const clearCompletedBtn = document.getElementById('clearCompletedBtn');
    const sortSelect = document.getElementById('sortSelect');
    const totalCount = document.getElementById('totalCount');
    const pendingCount = document.getElementById('pendingCount');
    const completedCount = document.getElementById('completedCount');
    
    // State aplikasi
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let currentFilter = 'all';
    let currentSort = 'date-desc';
    
    // Inisialisasi aplikasi
    function init() {
        renderTodoList();
        updateStats();
        attachEventListeners();
        
        // Load sort preference
        const savedSort = localStorage.getItem('todoSort');
        if (savedSort) {
            sortSelect.value = savedSort;
            currentSort = savedSort;
        }
    }
    
    // Render daftar todo
    function renderTodoList() {
        // Filter todos berdasarkan filter aktif
        let filteredTodos = todos.filter(todo => {
            if (currentFilter === 'active') return !todo.completed;
            if (currentFilter === 'completed') return todo.completed;
            return true;
        });
        
        // Sort todos berdasarkan pilihan
        filteredTodos = sortTodos(filteredTodos);
        
        // Clear list
        todoList.innerHTML = '';
        
        // Jika tidak ada todo, tampilkan pesan kosong
        if (filteredTodos.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = `
                <i class="fas fa-clipboard-check"></i>
                <h3>Tidak ada tugas</h3>
                <p>${currentFilter === 'all' ? 'Tambahkan tugas pertama Anda di atas' : 
                  currentFilter === 'active' ? 'Tidak ada tugas aktif' : 
                  'Tidak ada tugas yang selesai'}</p>
            `;
            todoList.appendChild(emptyState);
            return;
        }
        
        // Render setiap todo
        filteredTodos.forEach(todo => {
            const todoElement = createTodoElement(todo);
            todoList.appendChild(todoElement);
        });
    }
    
    // Buat elemen todo
    function createTodoElement(todo) {
        const todoElement = document.createElement('div');
        todoElement.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        todoElement.dataset.id = todo.id;
        
        const date = new Date(todo.date);
        const formattedDate = date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        todoElement.innerHTML = `
            <div class="todo-checkbox ${todo.completed ? 'checked' : ''}">
                ${todo.completed ? '<i class="fas fa-check"></i>' : ''}
            </div>
            <div class="todo-text">${todo.text}</div>
            <div class="todo-date">${formattedDate}</div>
            <div class="todo-actions">
                <button class="edit-btn" title="Edit tugas">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn" title="Hapus tugas">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;
        
        // Event listeners untuk elemen todo
        const checkbox = todoElement.querySelector('.todo-checkbox');
        const editBtn = todoElement.querySelector('.edit-btn');
        const deleteBtn = todoElement.querySelector('.delete-btn');
        const todoText = todoElement.querySelector('.todo-text');
        
        checkbox.addEventListener('click', () => toggleTodoCompletion(todo.id));
        deleteBtn.addEventListener('click', () => deleteTodo(todo.id));
        editBtn.addEventListener('click', () => editTodo(todo.id, todoText));
        
        // Klik dua kali untuk edit
        todoText.addEventListener('dblclick', () => editTodo(todo.id, todoText));
        
        return todoElement;
    }
    
    // Tambah todo baru
    function addTodo() {
        const text = todoInput.value.trim();
        
        if (text === '') {
            showNotification('Masukkan teks tugas terlebih dahulu', 'error');
            return;
        }
        
        const newTodo = {
            id: Date.now(),
            text: text,
            completed: false,
            date: new Date().toISOString()
        };
        
        todos.push(newTodo);
        saveTodos();
        renderTodoList();
        updateStats();
        
        // Reset input
        todoInput.value = '';
        todoInput.focus();
        
        showNotification('Tugas berhasil ditambahkan', 'success');
    }
    
    // Toggle status selesai/belum
    function toggleTodoCompletion(id) {
        todos = todos.map(todo => {
            if (todo.id === id) {
                return { ...todo, completed: !todo.completed };
            }
            return todo;
        });
        
        saveTodos();
        renderTodoList();
        updateStats();
        
        const todo = todos.find(t => t.id === id);
        const message = todo.completed ? 'Tugas ditandai sebagai selesai' : 'Tugas ditandai sebagai aktif';
        showNotification(message, 'info');
    }
    
    // Edit todo
    function editTodo(id, todoTextElement) {
        const todo = todos.find(t => t.id === id);
        if (!todo) return;
        
        const currentText = todo.text;
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentText;
        input.className = 'edit-input';
        
        // Ganti teks dengan input
        todoTextElement.innerHTML = '';
        todoTextElement.appendChild(input);
        input.focus();
        input.select();
        
        // Fungsi untuk menyimpan edit
        function saveEdit() {
            const newText = input.value.trim();
            
            if (newText === '') {
                showNotification('Teks tugas tidak boleh kosong', 'error');
                todoTextElement.textContent = currentText;
                return;
            }
            
            if (newText === currentText) {
                todoTextElement.textContent = currentText;
                return;
            }
            
            // Update todo
            todos = todos.map(t => {
                if (t.id === id) {
                    return { ...t, text: newText };
                }
                return t;
            });
            
            saveTodos();
            renderTodoList();
            showNotification('Tugas berhasil diperbarui', 'success');
        }
        
        // Event listeners untuk edit
        input.addEventListener('blur', saveEdit);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                saveEdit();
            }
        });
    }
    
    // Hapus todo
    function deleteTodo(id) {
        if (!confirm('Apakah Anda yakin ingin menghapus tugas ini?')) {
            return;
        }
        
        todos = todos.filter(todo => todo.id !== id);
        saveTodos();
        renderTodoList();
        updateStats();
        showNotification('Tugas berhasil dihapus', 'success');
    }
    
    // Hapus semua todo yang selesai
    function clearCompletedTodos() {
        const completedCount = todos.filter(todo => todo.completed).length;
        
        if (completedCount === 0) {
            showNotification('Tidak ada tugas yang selesai', 'info');
            return;
        }
        
        if (!confirm(`Apakah Anda yakin ingin menghapus ${completedCount} tugas yang selesai?`)) {
            return;
        }
        
        todos = todos.filter(todo => !todo.completed);
        saveTodos();
        renderTodoList();
        updateStats();
        showNotification(`${completedCount} tugas selesai telah dihapus`, 'success');
    }
    
    // Update statistik
    function updateStats() {
        const total = todos.length;
        const completed = todos.filter(todo => todo.completed).length;
        const pending = total - completed;
        
        totalCount.textContent = total;
        pendingCount.textContent = pending;
        completedCount.textContent = completed;
    }
    
    // Filter todo
    function setFilter(filter) {
        currentFilter = filter;
        
        // Update tombol filter aktif
        filterButtons.forEach(btn => {
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        renderTodoList();
    }
    
    // Sort todo
    function sortTodos(todoArray) {
        const sorted = [...todoArray];
        
        switch (currentSort) {
            case 'date-desc':
                return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
            case 'date-asc':
                return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
            case 'alpha-asc':
                return sorted.sort((a, b) => a.text.localeCompare(b.text));
            case 'alpha-desc':
                return sorted.sort((a, b) => b.text.localeCompare(a.text));
            default:
                return sorted;
        }
    }
    
    // Simpan todos ke localStorage
    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }
    
    // Tampilkan notifikasi
    function showNotification(message, type) {
        // Hapus notifikasi sebelumnya jika ada
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Buat notifikasi baru
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 
                          type === 'error' ? 'fa-exclamation-circle' : 
                          'fa-info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Tambahkan ke DOM
        document.body.appendChild(notification);
        
        // Animasi masuk
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Hapus setelah 3 detik
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }
    
    // Attach event listeners
    function attachEventListeners() {
        // Tambah todo
        addTodoBtn.addEventListener('click', addTodo);
        todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addTodo();
            }
        });
        
        // Filter buttons
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                setFilter(btn.dataset.filter);
            });
        });
        
        // Hapus yang selesai
        clearCompletedBtn.addEventListener('click', clearCompletedTodos);
        
        // Sort
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            localStorage.setItem('todoSort', currentSort);
            renderTodoList();
        });
        
        // Tambah beberapa contoh todo untuk pertama kali
        if (todos.length === 0) {
            const exampleTodos = [
                { id: 1, text: 'Selamat datang di Elegant Todo List', completed: true, date: new Date(Date.now() - 86400000).toISOString() },
                { id: 2, text: 'Klik dua kali pada tugas untuk mengedit', completed: false, date: new Date(Date.now() - 43200000).toISOString() },
                { id: 3, text: 'Coba tandai tugas ini sebagai selesai', completed: false, date: new Date().toISOString() }
            ];
            
            todos = exampleTodos;
            saveTodos();
            renderTodoList();
            updateStats();
        }
    }
    
    // Tambah style untuk notifikasi
    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 10px;
            color: white;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 1000;
            transform: translateX(150%);
            transition: transform 0.3s ease;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification.success {
            background: linear-gradient(to right, #00b894, #00a085);
        }
        
        .notification.error {
            background: linear-gradient(to right, #e74c3c, #c0392b);
        }
        
        .notification.info {
            background: linear-gradient(to right, #3498db, #2980b9);
        }
        
        .notification i {
            font-size: 1.2rem;
        }
        
        @media (max-width: 768px) {
            .notification {
                top: 10px;
                right: 10px;
                left: 10px;
                transform: translateY(-150%);
            }
            
            .notification.show {
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(notificationStyles);
    
    // Jalankan aplikasi
    init();
});