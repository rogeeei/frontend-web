import {
    backendURL,
    showNavAdminPages,
    errorNotification,
  } from "../utils/utils.js";
  
  // Get Admin Pages
  showNavAdminPages();
  
  // Get citizen ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const citizenId = urlParams.get("citizen_id");
  
  // Fetch and display citizen details
  getCitizenDetails(citizenId);
  
  async function getCitizenDetails(id) {
    try {
      const response = await fetch(`${backendURL}/api/citizen/${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      if (response.ok) {
        const citizen = await response.json();
        const citizenDetailsDiv = document.getElementById("citizenDetails");
        citizenDetailsDiv.innerHTML = `
          <p><strong>Last Name:</strong> ${citizen.lastname}</p>
          <p><strong>First Name:</strong> ${citizen.firstname}</p>
          <p><strong>Middle Name:</strong> ${citizen.middle_name}</p>
          <p><strong>Suffix:</strong> ${citizen.suffix}</p>
          <p><strong>Address:</strong> ${citizen.address}</p>
          <p><strong>Date of Birth:</strong> ${citizen.date_of_birth}</p>
          <p><strong>Gender:</strong> ${citizen.gender}</p>
          <p><strong>Citizen Status:</strong> ${citizen.citizen_status}</p>
          <p><strong>Blood Type:</strong> ${citizen.blood_type}</p>
          <p><strong>Height:</strong> ${citizen.height}</p>
          <p><strong>Weight:</strong> ${citizen.weight}</p>
          <p><strong>Allergies:</strong> ${citizen.allergies}</p>
          <p><strong>Condition:</strong> ${citizen.condition}</p>
          <p><strong>Medication:</strong> ${citizen.medication}</p>
          <p><strong>Emergency Contact Name:</strong> ${citizen.emergency_contact_name}</p>
          <p><strong>Emergency Contact Number:</strong> ${citizen.emergency_contact_no}</p>
          <p><strong>Services Availed:</strong> ${citizen.services_availed}</p>
        `;
      } else {
        errorNotification("HTTP-Error: " + response.status);
      }
    } catch (error) {
      errorNotification("An error occurred: " + error.message);
    }
  }
  