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
      const json = await response.json();
      let tableBody = "";
      json.forEach((citizen) => {
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
  const difference = Date.now() - birthDate.getTime();
  const age = new Date(difference).getUTCFullYear() - 1970;
  return age;
}

// Placeholder functions for view and edit buttons
function viewCitizen(id) {
  console.log("Viewing citizen with ID:", id);
  // Implement view functionality
}

function editCitizen(id) {
  console.log("Editing citizen with ID:", id);
  // Implement edit functionality
}

document.getElementById("form_citizen").addEventListener("submit", async (e) => {
  e.preventDefault();

  document.getElementById("searchButton").addEventListener("click", async () => {
    const query = document.getElementById("searchInput").value;
    await getCitizens(query);
  });

  document.getElementById("searchInput").addEventListener("keypress", async (e) => {
    if (e.key === "Enter") {
      const query = e.target.value;
      await getCitizens(query);
    }
  });

  const submitButton = document.querySelector("#form_citizen button[type='submit']");
  submitButton.disabled = true;
  submitButton.innerHTML = `<div class="spinner-border me-2" role="status"></div><span>Saving...</span>`;

  const formData = new FormData(document.getElementById("form_citizen"));

  // Log formData entries to ensure 'date_of_birth' is present
  for (const [key, value] of formData.entries()) {
    console.log(key, value); // This should include 'date_of_birth' if present
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
