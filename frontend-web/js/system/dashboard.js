import {
  backendURL,
  showNavAdminPages,
  successNotification,
  errorNotification,
} from "../utils/utils.js";

// Show Admin Pages
showNavAdminPages();

// Logout Button
const btn_logout = document.getElementById("btn_logout");
if (btn_logout) {
  btn_logout.addEventListener('click', async () => {
    try {
      const response = await fetch(`${backendURL}/api/logout`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        localStorage.clear();
        successNotification("Logout Successful.");
        window.location.pathname = "/frontend-web/";
      } else {
        const json = await response.json();
        errorNotification(`Logout failed: ${json.message}`, 10);
      }
    } catch (error) {
      errorNotification("An error occurred during logout: " + error.message);
    }
  });
}

// Fetch and display services
async function getServices(query = "") {
  try {
    const response = await fetch(`${backendURL}/api/services${query ? `?search=${query}` : ""}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.ok) {
      const services = await response.json();
      let cardHTML = "";
      services.forEach((service) => {
        cardHTML += `
          <div class="card mb-3" style="width: 18rem;" data-id="${service.id}">
            <div class="card-body">
              <h5 class="card-title">${service.name}</h5>
              <p class="card-text">${service.description}</p>
              <div class="card-buttons">
                <button class="btn btn-edit" onclick="editService(${service.id})">View</button>
                <button class="btn btn-delete" onclick="deleteService(${service.id})">Delete</button>
              </div>
            </div>
          </div>`;
      });
      document.getElementById("servicesContainer").innerHTML = cardHTML;
    } else {
      errorNotification(`Failed to load services: HTTP Error ${response.status}`);
    }
  } catch (error) {
    errorNotification("An error occurred while fetching services: " + error.message);
  }
}

// Initial load of services
getServices();

// Handle form submission for adding a new service
document.getElementById("addServiceForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const submitButton = e.target.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.innerHTML = `<div class="spinner-border me-2" role="status"></div><span>Saving...</span>`;

  const formData = new FormData(e.target);

  try {
    const response = await fetch(`${backendURL}/api/services`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    if (response.ok) {
      successNotification("Service added successfully.");
      document.getElementById("addServiceForm").reset();

            // Hide the modal
            const modalElement = document.getElementById("addServiceModal");
            const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
            modal.hide();
      

      await getServices(); // Refresh the services list
    } else if (response.status === 422) {
      const json = await response.json();
      errorNotification(json.message);
    } else {
      throw new Error("Network response was not ok.");
    }
  } catch (error) {
    errorNotification("An error occurred: " + error.message);
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = `Add Service`;
  }
});


// Attach function to the global window object
window.deleteService = async function (serviceId) {
  if (!confirm("Are you sure you want to delete this service?")) {
    return; // Abort if the user cancels the deletion
  }

  try {
    const response = await fetch(`${backendURL}/api/services/${serviceId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.ok) {
      successNotification("Service deleted successfully.");
      await getServices(); // Refresh the list of services
    } else {
      const json = await response.json();
      errorNotification(`Failed to delete service: ${json.message}`);
    }
  } catch (error) {
    errorNotification("An error occurred while deleting the service: " + error.message);
  }
};

// Define the editService function similarly if needed
window.editService = function (serviceId) {
  // Implement the edit functionality here
  console.log("Edit service with ID:", serviceId);
};

