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
            <td>${formatDate(citizen.created_at)}</td>
            <td>${citizen.lastname}</td>
            <td>${citizen.firstname}</td>
            <td>${citizen.gender}</td>
            <td>${calculateAge(citizen.date_of_birth)}</td>
            <td>${citizen.services_availed}</td>
            <td>${citizen.address}</td>
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


// Function to format the date
function formatDate(dateString) {
  if (!dateString) return 'N/A'; // Handle case where dateString is null or undefined
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options);
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