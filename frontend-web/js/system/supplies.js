import {
    backendURL,
    showNavAdminPages,
    successNotification,
    errorNotification,
} from "../utils/utils.js";

document.addEventListener('DOMContentLoaded', function () {
    function showTable(table) {
        const medicineTable = document.getElementById('medicine_table');
        const equipmentTable = document.getElementById('equipment_table');
        const addMedicineButton = document.getElementById('add_medicine_button');
        const addEquipmentButton = document.getElementById('add_equipment_button');

        if (table === 'medicine') {
            medicineTable.style.display = 'block';
            equipmentTable.style.display = 'none';
            addMedicineButton.style.display = 'inline-block';
            addEquipmentButton.style.display = 'none';
        } else if (table === 'equipment') {
            medicineTable.style.display = 'none';
            equipmentTable.style.display = 'block';
            addMedicineButton.style.display = 'none';
            addEquipmentButton.style.display = 'inline-block';
        }
    }

    showTable('medicine');
    showTable('equipment');

    document.querySelectorAll('.btn-group button').forEach(button => {
        button.addEventListener('click', function () {
            const table = this.textContent.toLowerCase();
            showTable(table);
        });
    });

    document.querySelector('.dropdown-menu').addEventListener('click', function (event) {
        if (event.target.tagName === 'A') {
            const sortOrder = event.target.textContent.toLowerCase();
            console.log('Sort order selected:', sortOrder);
            // Implement sorting logic here
        }
    });

    // Handle form submissions for medicine
    document.getElementById('form_medicine').addEventListener('submit', async function (event) {
        event.preventDefault();

        const submitButton = document.querySelector("#form_medicine button[type='submit']");
        submitButton.disabled = true;
        submitButton.innerHTML = `<div class="spinner-border me-2" role="status"></div><span>Saving...</span>`;

        const formData = new FormData(this);

        try {
            const response = await fetch(`${backendURL}/api/medicine`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: formData,
            });

            if (response.ok) {
                const json = await response.json();
                successNotification("Medicine details saved successfully.", 5);
                document.getElementById("form_medicine").reset();
                
                // Hide the modal
                const modalElement = document.getElementById("medicine_modal");
                const modal = bootstrap.Modal.getInstance(modalElement);
                if (modal) {
                    modal.hide();
                } else {
                    const bsModal = new bootstrap.Modal(modalElement);
                    bsModal.hide();
                }

                await getMedicine(); // Refresh the table with the new data
            } else if (response.status === 422) {
                const json = await response.json();
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

    // Handle form submissions for equipment
    document.getElementById('form_equipment').addEventListener('submit', async function (event) {
        event.preventDefault();

        const submitButton = document.querySelector("#form_equipment button[type='submit']");
        submitButton.disabled = true;
        submitButton.innerHTML = `<div class="spinner-border me-2" role="status"></div><span>Saving...</span>`;

        const formData = new FormData(this);

        try {
            const response = await fetch(`${backendURL}/api/equipment`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: formData,
            });

            if (response.ok) {
                const json = await response.json();
                successNotification("Equipment details saved successfully.", 5);
                document.getElementById("form_equipment").reset();
                
                // Hide the modal
                const modalElement = document.getElementById("equipment_modal");
                const modal = bootstrap.Modal.getInstance(modalElement);
                if (modal) {
                    modal.hide();
                } else {
                    const bsModal = new bootstrap.Modal(modalElement);
                    bsModal.hide();
                }

                await getEquipment(); // Refresh the table with the new data
            } else if (response.status === 422) {
                const json = await response.json();
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

    // Fetch and display medicine data
    async function getMedicine() {
        try {
            const response = await fetch(`${backendURL}/api/medicine`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (response.ok) {
                const json = await response.json();
                let tableBody = "";
                json.forEach((medicine) => {
                    tableBody += `
                        <tr>
                          <td>${medicine.medicine_id}</td>
                          <td>${medicine.name}</td>
                          <td>${medicine.usage_description}</td>
                          <td>${medicine.quantity}</td>
                          <td>${medicine.expiration_date}</td>
                          <td>${medicine.batch_no}</td>
                          <td>${medicine.location}</td>
                          <td>${medicine.medicine_status}</td>
                          <td><button class="btn btn-warning btn-sm" onclick="editMedicine(${medicine.medicine_id})">Edit</button></td>
                        </tr>`;
                });
                document.querySelector("#medicine_table tbody").innerHTML = tableBody;
            } else {
                errorNotification("HTTP-Error: " + response.status);
            }
        } catch (error) {
            errorNotification("An error occurred: " + error.message);
        }
    }

    // Fetch and display equipment data
    async function getEquipment() {
        try {
            const response = await fetch(`${backendURL}/api/equipment`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (response.ok) {
                const json = await response.json();
                let tableBody = "";
                json.forEach((equipment) => {
                    tableBody += `
                        <tr>
                          <td>${equipment.equipment_id}</td>
                          <td>${equipment.description}</td>
                          <td>${equipment.quantity}</td>
                          <td>${equipment.location}</td>
                          <td>${equipment.condition}</td>
                          <td>${equipment.equipment_status}</td>
                          <td><button class="btn btn-warning btn-sm" onclick="editEquipment(${equipment.equipment_id})">Edit</button></td>
                        </tr>`;
                });
                document.querySelector("#equipment_table tbody").innerHTML = tableBody;
            } else {
                errorNotification("HTTP-Error: " + response.status);
            }
        } catch (error) {
            errorNotification("An error occurred: " + error.message);
        }
    }

    function editMedicine(id) {
        console.log("Editing medicine with ID:", id);
        // Implement edit functionality
    }

    function editEquipment(id) {
        console.log("Editing equipment with ID:", id);
        // Implement edit functionality
    }

    // Fetch and display medicine and equipment data initially
    getMedicine();
    getEquipment();

    // Get Admin Pages
    showNavAdminPages();
});
