import { setRouter } from "../router/router.js";

// Set Router
setRouter();

// Backend URL
const backendURL = "http://healthy-barrio-backend.test";

// Function to handle response
async function handleResponse(response) {
  if (response.ok) {
    const json = await response.json();

    // Update user ID
    if (document.getElementById("user_id")) {
      document.getElementById("user_id").value = json.id;
    }
  } else {
    const json = await response.json();
    errorNotification(json.message, 10);
  }
}

// Show Admin Pages Navigation
function showNavAdminPages() {
  if (localStorage.getItem("role") === "Admin") {
    document.getElementById("nav_admin_pages").innerHTML = `
      <div class="sb-sidenav-menu-heading">Admin Pages</div>
      <a class="nav-link active" href="users.html">
        <div class="sb-nav-link-icon">
          <i class="fas fa-user"></i>
        </div>
        Users
      </a>`;
  }
}

// Notifications
function successNotification(message, timeout = 5) {
  const notificationElement = document.getElementById('successNotification');
  if (!notificationElement) {
    console.error('Notification element not found.');
    return;
  }
  notificationElement.textContent = message;
  notificationElement.style.display = 'block';
  setTimeout(() => {
    notificationElement.style.display = 'none';
  }, timeout * 1000);
}

function errorNotification(message, duration = 5) {
  const notificationElement = document.getElementById('errorNotification'); // Ensure this ID matches your HTML

  if (notificationElement) {
    notificationElement.textContent = message;
    notificationElement.classList.add('show'); // Assuming 'show' class makes it visible

    setTimeout(() => {
      notificationElement.classList.remove('show');
    }, duration * 1000);
  } else {
    console.error('Notification element not found.');
  }
}

export {
  backendURL,
  showNavAdminPages,
  successNotification,
  errorNotification,
};
