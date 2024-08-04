import {
  backendURL,
  showNavAdminPages,
  errorNotification,
  successNotification,
} from "../utils/utils.js";

// Get Admin Pages
showNavAdminPages();

// Fetch and display citizen data
getCitizens();

async function getCitizens(query = "") {
  try {
    const response = await fetch(`${backendURL}/api/citizen${query ? `?search=${query}` : ""}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.ok) {
      const citizens = await response.json();
      let tableBody = "";
      citizens.forEach((citizen) => {
        tableBody += `
          <tr>
            <td>${citizen.lastname}</td>
            <td>${citizen.firstname}</td>
            <td>${citizen.gender}</td>
            <td>${calculateAge(citizen.date_of_birth)}</td>
            <td>${citizen.services_availed}</td>
            <td>${citizen.address}</td>
            <td><button class="btn btn-info btn-sm" onclick="viewCitizen(${citizen.citizen_id})">View</button></td>
            <td><button class="btn btn-warning btn-sm" onclick="editCitizen(${citizen.citizen_id})">Edit</button></td>
          </tr>`;
      });
      document.querySelector("table tbody").innerHTML = tableBody;
    } else {
      errorNotification("HTTP-Error: " + response.status);
    }
  } catch (error) {
    errorNotification("An error occurred: " + error.message);
  }
}

// Function to calculate age from birthdate
function calculateAge(birthdate) {
  if (!birthdate) return 'N/A'; // Handle case where birthdate is null or undefined
  const birthDate = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

// Placeholder functions for view and edit buttons
function viewCitizen(id) {
  console.log("Viewing citizen with ID:", id);
  // Implement view functionality
}

async function editCitizen(id) {
  console.log("Editing citizen with ID:", id);

  try {
    const response = await fetch(`${backendURL}/api/citizen/${id}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.ok) {
      const citizen = await response.json();
      document.getElementById("citizen_id").value = citizen.citizen_id;
      document.getElementById("firstname").value = citizen.firstname;
      document.getElementById("middle_name").value = citizen.middle_name;
      document.getElementById("lastname").value = citizen.lastname;
      document.getElementById("suffix").value = citizen.suffix;
      document.getElementById("address").value = citizen.address;
      document.getElementById("date_of_birth").value = citizen.date_of_birth;
      document.getElementById("gender").value = citizen.gender;
      document.getElementById("citizen_status").value = citizen.citizen_status;
      document.getElementById("blood_type").value = citizen.blood_type;
      document.getElementById("height").value = citizen.height;
      document.getElementById("weight").value = citizen.weight;
      document.getElementById("allergies").value = citizen.allergies;
      document.getElementById("condition").value = citizen.condition;
      document.getElementById("medication").value = citizen.medication;
      document.getElementById("emergency_contact_name").value = citizen.emergency_contact_name;
      document.getElementById("emergency_contact_no").value = citizen.emergency_contact_no;
      document.getElementById("services_availed").value = citizen.services_availed;

      // Show the modal
      const modalElement = document.getElementById("citizen_form_modal");
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    } else {
      errorNotification("HTTP-Error: " + response.status);
    }
  } catch (error) {
    errorNotification("An error occurred: " + error.message);
  }
}

document.getElementById("form_citizen").addEventListener("submit", async (e) => {
  e.preventDefault();

  const submitButton = document.querySelector("#form_citizen button[type='submit']");
  submitButton.disabled = true;
  submitButton.innerHTML = `<div class="spinner-border me-2" role="status"></div><span>Saving...</span>`;

  const formData = new FormData(document.getElementById("form_citizen"));
  const citizenId = document.getElementById("citizen_id").value;

  try {
    const response = await fetch(`${backendURL}/api/citizen/${citizenId}`, {
      method: citizenId ? "PUT" : "POST", // Use PUT for updating if citizenId exists, otherwise POST for creating
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    if (response.ok) {
      const json = await response.json();
      successNotification("Citizen details saved successfully.", 5);
      document.getElementById("form_citizen").reset();

      // Hide the modal
      const modalElement = document.getElementById("citizen_form_modal");
      const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
      modal.hide();

      await getCitizens(); // Refresh the table with the new data
    } else if (response.status === 422) {
      const json = await response.json();
      console.log('Validation errors:', json);
      errorNotification(json.message, 5);
    } else {
      throw new Error("Network response was not ok.");
    }
  } catch (error) {
    errorNotification("An error occurred: " + error.message, 5);
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = `Save`;
  }
});

// Attach functions to the window object
window.viewCitizen = viewCitizen;
window.editCitizen = editCitizen;

// Handle form submission and search functionality
document.getElementById("form_citizen").addEventListener("submit", async (e) => {
  e.preventDefault();

  const query = document.getElementById("searchInput").value;
  await getCitizens(query);

  const submitButton = document.querySelector("#form_citizen button[type='submit']");
  submitButton.disabled = true;
  submitButton.innerHTML = `<div class="spinner-border me-2" role="status"></div><span>Saving...</span>`;

  const formData = new FormData(document.getElementById("form_citizen"));

  // Log formData entries to ensure 'date_of_birth' is present
  for (const [key, value] of formData.entries()) {
    console.log(key, value);
  }

  try {
    const response = await fetch(`${backendURL}/api/citizen`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    if (response.ok) {
      const json = await response.json();
      successNotification("Citizen details saved successfully.", 5);
      document.getElementById("form_citizen").reset();

      // Hide the modal
      const modalElement = document.getElementById("citizen_form_modal");
      const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
      modal.hide();

      await getCitizens(); // Refresh the table with the new data
    } else if (response.status === 422) {
      const json = await response.json();
      console.log('Validation errors:', json);
      errorNotification(json.message, 5);
    } else {
      throw new Error("Network response was not ok.");
    }
  } catch (error) {
    errorNotification("An error occurred: " + error.message, 5);
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = `Add`;
  }
});

// Handle search button click
document.getElementById("searchButton").addEventListener("click", async () => {
  const query = document.getElementById("searchInput").value;
  await getCitizens(query);
});

// Handle search input keypress (Enter key)
document.getElementById("searchInput").addEventListener("keypress", async (e) => {
  if (e.key === "Search") {
    const query = e.target.value;
    await getCitizens(query);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const table = document.getElementById('citizen_table');
  const tbody = table.querySelector('tbody');

  // Function to sort table rows
  function sortTable(order) {
      const rowsArray = Array.from(tbody.querySelectorAll('tr'));

      rowsArray.sort((rowA, rowB) => {
          const lastNameA = rowA.cells[0].textContent.trim();
          const lastNameB = rowB.cells[0].textContent.trim();

          if (order === 'Ascending') {
              return lastNameA.localeCompare(lastNameB);
          } else {
              return lastNameB.localeCompare(lastNameA);
          }
      });

      // Append sorted rows
      rowsArray.forEach(row => tbody.appendChild(row));
  }

  // Event listener for dropdown menu
  document.querySelectorAll('.dropdown-menu .dropdown-item').forEach(item => {
      item.addEventListener('click', (event) => {
          const order = event.target.textContent;
          sortTable(order);
      });
  });

  // Function to search through table
  function searchTable() {
      const searchInput = document.getElementById('searchInput').value.toLowerCase();
      const rows = tbody.querySelectorAll('tr');

      rows.forEach(row => {
          const cells = Array.from(row.cells);
          const matched = cells.some(cell => cell.textContent.toLowerCase().includes(searchInput));
          row.style.display = matched ? '' : 'none';
      });
  }

  // Event listener for search button
  document.getElementById('searchButton').addEventListener('click', searchTable);

  // Event listener for search input
  document.getElementById('searchInput').addEventListener('input', searchTable);
});
