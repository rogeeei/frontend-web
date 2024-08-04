import {
    backendURL,
    showNavAdminPages,
    errorNotification,
    successNotification,
  } from "../utils/utils.js";
  
  // Get Admin Pages
  showNavAdminPages();

  async function fetchDemographicSummary() {
    try {
        const response = await fetch('/api/demographic-summary');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data); // Check data structure

        // Process gender data
        const genderData = data.gender_summary || [];
        const genderContainer = document.querySelector('.card.gender .card-body');
        genderContainer.innerHTML = genderData.map(g => `<p>${g.gender}: ${g.count}</p>`).join('');

        // Process age group data
        const ageData = data.age_groups || [];
        const ageContainer = document.querySelector('.card.age .card-body');
        ageContainer.innerHTML = ageData.map(a => `<p>${a.age_group}: ${a.count}</p>`).join('');
    } catch (error) {
        console.error('Error fetching demographic summary:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchDemographicSummary);
