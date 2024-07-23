import {
    backendURL,
    showNavAdminPages,
    errorNotification,
    successNotification,
  } from "../utils/utils.js";
  
  // Initialize navigation and fetch data
  showNavAdminPages();
  getHistory();
  
  async function getHistory(query = "") {
    try {
      const response = await fetch(`${backendURL}/api/citizen-history${query ? `?search=${query}` : ""}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      if (response.ok) {
        const histories = await response.json();
        let tableBody = "";
        histories.forEach((history) => {
          tableBody += `
            <tr>
              <td>${history.date}</td>
              <td>${history.citizen.lastname}</td>
              <td>${history.citizen.firstname}</td>
              <td>${history.citizen.gender}</td>
              <td>${calculateAge(history.citizen.date_of_birth)}</td>
              <td>${history.citizen.services_availed}</td>
              <td>${history.diagnostic.diagnosis}</td>
              <td>${history.citizen.address}</td>
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
  
  // Event listeners for search functionality
  document.getElementById("searchButton").addEventListener("click", async () => {
    const query = document.getElementById("searchInput").value;
    await getHistory(query);
  });
  
  document.getElementById("searchInput").addEventListener("keypress", async (e) => {
    if (e.key === "Enter") {
      const query = e.target.value;
      await getHistory(query);
    }
  });
  