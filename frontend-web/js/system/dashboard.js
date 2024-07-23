import {
  backendURL,
  showNavAdminPages,
  successNotification,
  errorNotification,
} from "../utils/utils.js";

// Get Admin Pages
showNavAdminPages();

// Logout Btn
const btn_logout = document.getElementById("btn_logout");
btn_logout.onclick = async () => {
  // Access Logout API Endpoint
  const response = await fetch(backendURL + "/api/logout", {
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });

  // Get response if 200-299 status code
  if (response.ok) {
    // Clear Tokens
    localStorage.clear();

    successNotification("Logout Successful.");
    // Redirect Page
    window.location.pathname = "/frontend-web/";
  }
  // Get response if 400 or 500 status code
  else {
    const json = await response.json();

    errorNotification(json.message, 10);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  // Display the current date and time
  const date = new Date();
  const formattedDate = date.toLocaleString(); // Format the date and time
  document.getElementById("currentTimestamp").textContent = formattedDate;

  // Fetch user location and update Barangay name
  fetchUserLocation();
});

// JavaScript to handle adding services
document.getElementById("addServiceForm").addEventListener("submit", function (event) {
  event.preventDefault();

  // Get form values
  const serviceName = document.getElementById("serviceName").value;
  const serviceDescription = document.getElementById("serviceDescription").value;

  // Create a new row for the table
  const tableBody = document.getElementById("serviceTableBody");
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
    <td>${serviceName}</td>
    <td>${serviceDescription}</td>
    <td>
      <a href="#" class="btn btn-info btn-sm">Edit</a>
      <a href="#" class="btn btn-danger btn-sm">Delete</a>
    </td>
  `;
  tableBody.appendChild(newRow);

  // Reset the form and close the modal
  document.getElementById("addServiceForm").reset();
  const modal = bootstrap.Modal.getInstance(document.getElementById("addServiceModal"));
  modal.hide();
});
