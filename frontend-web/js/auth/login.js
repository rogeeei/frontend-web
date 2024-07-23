import {
  backendURL,
  successNotification,
  errorNotification,
} from "../utils/utils.js";

const form_login = document.getElementById("form_login");

form_login.onsubmit = async (e) => {
  e.preventDefault();

  document.querySelector("#form_login button").disabled = true;
  document.querySelector("#form_login button").innerHTML = `<div class="spinner-border me-2" role="status"></div><span>Loading...</span>`;

  const formData = new FormData(form_login);

  // Debug: Log formData
  console.log('Form Data:', [...formData.entries()]);

  try {
    const response = await fetch(backendURL + "/api/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    });

    if (response.ok) {
      const json = await response.json();
      console.log('Response JSON:', json); // Log the full response

      // Check if token and role are present in response
      if (json.data && json.data.token && json.data.data) {
        localStorage.setItem("token", json.data.token);
        localStorage.setItem("role", json.data.data.role);

        form_login.reset();

        successNotification("Successfully logged in.");
        window.location.pathname = "/frontend-web/dashboard.html";
      } else {
        errorNotification("Login failed. Token or role not found.", 5);
      }
    } else if (response.status == 422) {
      const json = await response.json();
      errorNotification(json.message, 5);
    }
  } catch (error) {
    console.error('Fetch error:', error); // Log error for debugging
    errorNotification("An error occurred. Please try again.", 5);
  } finally {
    document.querySelector("#form_login button").disabled = false;
    document.querySelector("#form_login button").innerHTML = `Login`;
  }
};
