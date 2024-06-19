document.addEventListener('DOMContentLoaded', function () {
    // User registration
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault(); // Prevent default form submission

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // Check password strength before allowing registration
            if (!isStrongPassword(password)) {
                alert('Password does not meet strength requirements.');
                return;
            }

            const users = JSON.parse(localStorage.getItem('users')) || [];
            users.push({ username, password });
            localStorage.setItem('users', JSON.stringify(users));

            alert('Registration successful!');
            window.location.href = 'login.html'; // Redirect to login page after successful registration
        });
    }

    // User login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault(); // Prevent default form submission

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(user => user.username === username && user.password === password);

            if (user) {
                localStorage.setItem('loggedInUser', username);
                alert('Login successful!');
                window.location.href = 'index.html'; // Redirect to index.html after successful login
            } else {
                alert('Invalid username or password!');
            }
        });
    }

    // Function to check if user is logged in
    function checkLogin() {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (!loggedInUser) {
            window.location.href = 'login.html'; // Redirect to login page if not logged in
        }
    }

    // Call checkLogin on pages that require authentication
    if (document.getElementById('login-page')) { // Make sure to have an identifier on the login page
        checkLogin();
    }

    // Function to check if a password is strong
    function isStrongPassword(password) {
        // Customize your password strength criteria here
        return password.length >= 8 &&
            /[A-Z]/.test(password) &&
            /[a-z]/.test(password) &&
            /[0-9]/.test(password);
    }
});
