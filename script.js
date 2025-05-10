// Hardcoded credentials (VULNERABILITY)
const adminUser = {
    id: "1001",
    username: "admin",
    password: "admin123",
    isAdmin: true,
    displayName: "Administrator",
    roleParam: "admin_role"
};

const regularUser = {
    id: "1002",
    username: "user",
    password: "password123",
    isAdmin: false,
    displayName: "Regular User",
    roleParam: "user_role"
};

const allUsers = [adminUser, regularUser];
let currentUser = null;
let tasks = [
    { id: 1, title: "Complete project", description: "Finish the quarterly project", priority: "high" },
    { id: 2, title: "Team meeting", description: "Attend weekly team meeting", priority: "medium" },
    { id: 3, title: "Buy groceries", description: "Milk, eggs, bread", priority: "low" }
];

// Event listeners initialization
document.addEventListener('DOMContentLoaded', function() {
    // Login form submission
    document.getElementById("login-form").addEventListener("submit", function(e) {
        e.preventDefault();
        
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        
        // Vulnerable authentication (no hashing, direct comparison)
        if (username === adminUser.username && password === adminUser.password) {
            login(adminUser);
        } else if (username === regularUser.username && password === regularUser.password) {
            login(regularUser);
        } else {
            showMessage("login-message", "Invalid username or password", "error");
        }
    });

    // Logout handler
    document.getElementById("logout-btn").addEventListener("click", function() {
        currentUser = null;
        document.getElementById("login-section").style.display = "block";
        document.getElementById("tasks-section").style.display = "none";
        document.getElementById("login-message").innerHTML = "";
        document.getElementById("username").value = "";
        document.getElementById("password").value = "";
    });

    // Task form submission
    document.getElementById("task-form").addEventListener("submit", function(e) {
        e.preventDefault();
        
        const title = document.getElementById("task-title").value;
        const description = document.getElementById("task-description").value;
        const priority = document.getElementById("task-priority").value;
        
        // No input validation (VULNERABILITY)
        const newTask = {
            id: tasks.length + 1,
            title: title,
            description: description,
            priority: priority
        };
        
        tasks.push(newTask);
        loadTasks();
        
        // Reset form
        document.getElementById("task-form").reset();
    });

    // Search form submission
    document.getElementById("search-form").addEventListener("submit", function(e) {
        e.preventDefault();
        
        const query = document.getElementById("search-query").value;
        
        // SQL Injection vulnerability simulation (VULNERABILITY)
        // In a real app, this would be a server request with SQL, but we'll simulate it
        if (query.includes("'") || query.includes(";") || query.includes("--")) {
            // Simulating successful SQL injection
            document.getElementById("search-results").innerHTML = `
                <div class="message error">
                    SQL Error: Unclosed quotation mark after the character string
                    <br>
                    <strong>Query:</strong> SELECT * FROM tasks WHERE title LIKE '%${query}%' OR description LIKE '%${query}%'
                </div>
                <table>
                    <tr>
                        <th>Username</th>
                        <th>Password</th>
                        <th>Role</th>
                    </tr>
                    <tr>
                        <td>admin</td>
                        <td>admin123</td>
                        <td>Administrator</td>
                    </tr>
                    <tr>
                        <td>user</td>
                        <td>password123</td>
                        <td>User</td>
                    </tr>
                </table>
            `;
            return;
        }
        
        // Regular search
        const results = tasks.filter(task => 
            task.title.toLowerCase().includes(query.toLowerCase()) || 
            task.description.toLowerCase().includes(query.toLowerCase())
        );
        
        if (results.length > 0) {
            let resultsHtml = `<p>Found ${results.length} results:</p><ul>`;
            results.forEach(task => {
                // XSS vulnerability (VULNERABILITY)
                resultsHtml += `<li>
                    <strong>${task.title}</strong> - 
                    ${task.description} (${task.priority})
                </li>`;
            });
            resultsHtml += `</ul>`;
            document.getElementById("search-results").innerHTML = resultsHtml;
        } else {
            document.getElementById("search-results").innerHTML = "<p>No tasks found.</p>";
        }
    });

    // Settings form submission - with privilege escalation vulnerability
    document.getElementById("settings-form").addEventListener("submit", function(e) {
        e.preventDefault();
        
        const displayName = document.getElementById("display-name").value;
        const roleParam = document.getElementById("role-param").value;
        
        // Update user info
        currentUser.displayName = displayName;
        
        // Privilege escalation vulnerability (VULNERABILITY)
        // A user can change their role by modifying the roleParam
        if (roleParam === "admin_role") {
            currentUser.isAdmin = true;
            document.getElementById("admin-panel").style.display = "block";
            showMessage("welcome-message", "Settings updated. Admin privileges enabled!", "success");
        } else {
            showMessage("welcome-message", "Settings updated", "success");
        }
        
        document.getElementById("welcome-message").innerHTML = `Welcome, ${currentUser.username}! ${currentUser.isAdmin ? "<strong>Admin privileges enabled</strong>" : ""}`;
    });
    
    // Admin panel buttons
    document.getElementById("reset-db-btn").addEventListener("click", function() {
        document.getElementById("admin-results").innerHTML = "<div class='message success'>Database reset successful</div>";
    });
    
    document.getElementById("view-all-users-btn").addEventListener("click", function() {
        let usersHtml = "<h3>All Users</h3><ul>";
        allUsers.forEach(user => {
            usersHtml += `<li>${user.username} (${user.id}) - Role: ${user.isAdmin ? "Admin" : "User"} - Password: ${user.password}</li>`;
        });
        usersHtml += "</ul>";
        document.getElementById("admin-results").innerHTML = usersHtml;
    });
});

// Login function
function login(user) {
    currentUser = user;
    
    // DOM-based XSS vulnerability (VULNERABILITY)
    document.getElementById("welcome-message").innerHTML = `Welcome, ${currentUser.username}! ${currentUser.isAdmin ? "<strong>Admin privileges enabled</strong>" : ""}`;
    
    document.getElementById("login-section").style.display = "none";
    document.getElementById("tasks-section").style.display = "block";
    
    // Set user settings form
    document.getElementById("user-id").value = currentUser.id;
    document.getElementById("display-name").value = currentUser.displayName;
    document.getElementById("role-param").value = currentUser.roleParam;
    
    // Show/hide admin panel based on user role
    document.getElementById("admin-panel").style.display = currentUser.isAdmin ? "block" : "none";
    
    // Check URL parameters for privilege escalation vulnerability
    checkUrlParameters();
    
    loadTasks();
}

// Load tasks into the table
function loadTasks() {
    const tasksList = document.getElementById("tasks-list");
    tasksList.innerHTML = "";
    
    tasks.forEach(task => {
        // XSS vulnerability (VULNERABILITY)
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${task.title}</td>
            <td>${task.description}</td>
            <td>${task.priority}</td>
            <td>
                <button onclick="deleteTask(${task.id})">Delete</button>
                <button onclick="viewTaskDetails(${task.id})">View</button>
            </td>
        `;
        tasksList.appendChild(row);
    });
}

// Delete a task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    loadTasks();
}

// View task details
function viewTaskDetails(id) {
    const task = tasks.find(task => task.id === id);
    
    if (task) {
        // DOM-based XSS vulnerability (VULNERABILITY)
        const detailsHtml = `
            <div class="container">
                <h3>${task.title}</h3>
                <p>${task.description}</p>
                <p>Priority: ${task.priority}</p>
                <button onclick="closeTaskDetails()">Close</button>
            </div>
        `;
        
        const detailsElement = document.createElement("div");
        detailsElement.id = "task-details";
        detailsElement.innerHTML = detailsHtml;
        
        document.body.appendChild(detailsElement);
    }
}

// Close task details modal
function closeTaskDetails() {
    const detailsElement = document.getElementById("task-details");
    if (detailsElement) {
        detailsElement.remove();
    }
}

// Check URL parameters for privilege escalation
function checkUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Privilege escalation vulnerability (VULNERABILITY)
    // Allow role elevation through URL parameter
    if (urlParams.has('role')) {
        const roleParam = urlParams.get('role');
        if (roleParam === 'admin') {
            // Vulnerable implementation: allows any user to become admin through URL parameter
            currentUser.isAdmin = true;
            document.getElementById("admin-panel").style.display = "block";
            document.getElementById("welcome-message").innerHTML = `Welcome, ${currentUser.username}! <strong>Admin privileges enabled</strong>`;
            showMessage("welcome-message", "Role updated to admin", "success");
        }
    }
    
    // Process any direct user ID parameter (another vulnerability)
    if (urlParams.has('userid')) {
        const requestedUserId = urlParams.get('userid');
        // No authorization check (VULNERABILITY)
        // This lets anyone switch to any user account by just changing the URL
        const targetUser = allUsers.find(user => user.id === requestedUserId);
        if (targetUser) {
            currentUser = targetUser;
            document.getElementById("user-id").value = currentUser.id;
            document.getElementById("display-name").value = currentUser.displayName;
            document.getElementById("role-param").value = currentUser.roleParam;
            document.getElementById("admin-panel").style.display = currentUser.isAdmin ? "block" : "none";
            document.getElementById("welcome-message").innerHTML = `Welcome, ${currentUser.username}! ${currentUser.isAdmin ? "<strong>Admin privileges enabled</strong>" : ""}`;
        }
    }
}

// Show message with timeout
function showMessage(elementId, message, type) {
    const element = document.getElementById(elementId);
    element.innerHTML = `<div class="message ${type}">${message}</div>`;
    
    setTimeout(() => {
        element.innerHTML = "";
    }, 3000);
}