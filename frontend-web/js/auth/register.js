import {
  backendURL,
  successNotification,
  errorNotification,
} from "../utils/utils.js";

// Form Register
const form_register = document.getElementById("form_register");

form_register.onsubmit = async (e) => {
  e.preventDefault();

  // Disable Button
  document.querySelector("#form_register button").disabled = true;
  document.querySelector(
    "#form_register button"
  ).innerHTML = `<div class="spinner-border me-2" role="status">
                    </div>
                    <span>Loading...</span>`;

  // Get Values of Form (input, textarea, select) set it as form-data
  const formData = new FormData(form_register);

  // Add User Role to those who registered
  formData.append("role", "User");

  // Fetch API User Register Endpoint
  const response = await fetch(backendURL + "/api/user", {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: formData,
  });

  // Get response if 200-299 status code
  if (response.ok) {
    form_register.reset();

    successNotification("Successfully registered account.", 5);
  }
  // Get response if 422 status code
  else if (response.status == 422) {
    const json = await response.json();

    errorNotification(json.message, 5);
  }

  // Enable Button
  document.querySelector("#form_register button").disabled = false;
  document.querySelector("#form_register button").innerHTML = `Create Account`;
};
