const authWrapper = document.querySelector('.auth-wrapper');
const loginTrigger = document.querySelector('.login-trigger');
const registerTrigger = document.querySelector('.register-trigger');

/* ================= TOGGLE FORM ================= */
registerTrigger.addEventListener('click', (e) => {
    e.preventDefault();
    authWrapper.classList.add('toggled');
});

loginTrigger.addEventListener('click', (e) => {
    e.preventDefault();
    authWrapper.classList.remove('toggled');
});

/* ================= REGISTER ================= */
const registerForm = document.querySelector('.credentials-panel.signup form');

registerForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const username = registerForm.querySelector('input[type="text"]').value;
    const email = registerForm.querySelector('input[type="email"]').value;
    const password = registerForm.querySelector('input[type="password"]').value;

    if (!username || !email || !password) {
        alert('Semua data wajib diisi!');
        return;
    }

    const userData = {
        username,
        email,
        password
    };

    localStorage.setItem('registeredUser', JSON.stringify(userData));

    alert('Registrasi berhasil! Silakan login.');
    authWrapper.classList.remove('toggled');
});

/* ================= LOGIN ================= */
const loginForm = document.querySelector('.credentials-panel.signin form');

loginForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const username = loginForm.querySelector('input[type="text"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;

    const storedUser = JSON.parse(localStorage.getItem('registeredUser'));

    if (!storedUser) {
        alert('Akun belum terdaftar!');
        return;
    }

    if (
        username === storedUser.username &&
        password === storedUser.password
    ) {
        alert('Login berhasil!');
        // 🔥 GANTI halaman tujuan di sini
        window.location.href = 'front/front.html';
    } else {
        alert('Username atau password salah!');
    }
});

/* ================= TOGGLE PASSWORD ================= */
document.querySelectorAll('.toggle-password').forEach(icon => {
    icon.addEventListener('click', () => {
        const input = icon.parentElement.querySelector('.password-input');

        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.replace('fa-eye-slash', 'fa-eye');
        }
    });
});