// ==============================
// Select Elements
// ==============================

const studentForm = document.getElementById("studentForm");

const fullName = document.getElementById("fullName");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const course = document.getElementById("course");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const phoneError = document.getElementById("phoneError");
const courseError = document.getElementById("courseError");

const studentTableBody = document.getElementById("studentTableBody");

const submitBtn = document.getElementById("submitBtn");
const submitLabel = submitBtn.querySelector(".btn-stamp__label");
const ledgerTab = document.querySelector(".ledger-card__tab");

const emptyState = document.getElementById("emptyState");
const studentCount = document.getElementById("studentCount");
const toast = document.getElementById("toast");

const YEAR = new Date().getFullYear();

// ==============================
// Variables
// ==============================

let editingRow = null;
let serialNumber = 1;

// ==============================
// Form Submit
// ==============================

studentForm.addEventListener("submit", function (event) {

    event.preventDefault();

    if (validateForm()) {

        if (editingRow === null) {
            addStudent();
        } else {
            updateStudent();
        }

        clearForm();
    }

});

// ==============================
// Validation
// ==============================

function validateForm() {

    let isValid = true;

    // Clear previous errors
    nameError.textContent = "";
    emailError.textContent = "";
    phoneError.textContent = "";
    courseError.textContent = "";

    [fullName, email, phone, course].forEach(function (field) {
        field.classList.remove("is-invalid");
    });

    // Name Validation
    if (fullName.value.trim() === "") {
        nameError.textContent = "Full Name is required.";
        fullName.classList.add("is-invalid");
        isValid = false;
    }

    // Email Validation
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

    if (email.value.trim() === "") {

        emailError.textContent = "Email is required.";
        email.classList.add("is-invalid");
        isValid = false;

    } else if (!emailPattern.test(email.value.trim())) {

        emailError.textContent = "Enter a valid email.";
        email.classList.add("is-invalid");
        isValid = false;
    }

    // Phone Validation
    const phonePattern = /^03\d{9}$/;

    if (phone.value.trim() === "") {

        phoneError.textContent = "Phone number is required.";
        phone.classList.add("is-invalid");
        isValid = false;

    } else if (!phonePattern.test(phone.value.trim())) {

        phoneError.textContent = "Phone must be 11 digits.";
        phone.classList.add("is-invalid");
        isValid = false;
    }

    // Course Validation
    if (course.value === "") {

        courseError.textContent = "Please select a course.";
        course.classList.add("is-invalid");
        isValid = false;
    }

    return isValid;
}

// ==============================
// Helpers
// ==============================

function makeStudentId(seq) {
    return `STD-${YEAR}-${String(seq).padStart(4, "0")}`;
}

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () {
        toast.classList.remove("is-visible");
    }, 2600);
}

function refreshMeta() {

    const rows = studentTableBody.querySelectorAll("tr");

    studentCount.textContent = rows.length + " enrolled";

    if (rows.length === 0) {
        emptyState.classList.add("is-visible");
    } else {
        emptyState.classList.remove("is-visible");
    }

}

// ==============================
// Add Student
// ==============================

function addStudent() {

    const row = document.createElement("tr");

    row.classList.add("is-new");

    row.innerHTML = `
        <td>
            <span class="student-id">
                <span class="student-id__seal">&#9670;</span>
                ${makeStudentId(serialNumber)}
            </span>
        </td>
        <td>${fullName.value}</td>
        <td>${email.value}</td>
        <td>${phone.value}</td>
        <td><span class="course-badge">${course.value}</span></td>

        <td>
            <div class="row-actions">
                <button class="icon-btn icon-btn--edit btn btn-sm" title="Edit">&#9998;</button>
                <button class="icon-btn icon-btn--delete btn btn-sm" title="Remove">&#10005;</button>
            </div>
        </td>
    `;

    studentTableBody.appendChild(row);

    serialNumber++;

    showToast(fullName.value + " stamped into the roster.");

    refreshMeta();

    // Edit Button
    row.querySelector(".icon-btn--edit").addEventListener("click", function () {

        editingRow = row;

        fullName.value = row.cells[1].textContent;
        email.value = row.cells[2].textContent;
        phone.value = row.cells[3].textContent;
        course.value = row.cells[4].textContent;

        submitLabel.textContent = "Update Record";
        ledgerTab.textContent = "Editing Record";

        fullName.focus();

    });

    // Delete Button
    row.querySelector(".icon-btn--delete").addEventListener("click", function () {

        const removedName = row.cells[1].textContent;

        row.remove();

        updateSerialNumbers();

        refreshMeta();

        showToast(removedName + " removed from the roster.");

        if (editingRow === row) {

            clearForm();

            editingRow = null;

            submitLabel.textContent = "Stamp & Enroll";
            ledgerTab.textContent = "New Admission";
        }

    });

}

// ==============================
// Update Student
// ==============================

function updateStudent() {

    editingRow.cells[1].textContent = fullName.value;
    editingRow.cells[2].textContent = email.value;
    editingRow.cells[3].textContent = phone.value;
    editingRow.cells[4].innerHTML = `<span class="course-badge">${course.value}</span>`;

    showToast("Record updated for " + fullName.value + ".");

    editingRow = null;

    submitLabel.textContent = "Stamp & Enroll";
    ledgerTab.textContent = "New Admission";

}

// ==============================
// Clear Form
// ==============================

function clearForm() {

    studentForm.reset();

    [fullName, email, phone, course].forEach(function (field) {
        field.classList.remove("is-invalid");
    });

    nameError.textContent = "";
    emailError.textContent = "";
    phoneError.textContent = "";
    courseError.textContent = "";

}

// ==============================
// Update Serial / Student IDs
// ==============================

function updateSerialNumbers() {

    const rows = studentTableBody.querySelectorAll("tr");

    serialNumber = 1;

    rows.forEach(function (row) {

        row.cells[0].innerHTML = `
            <span class="student-id">
                <span class="student-id__seal">&#9670;</span>
                ${makeStudentId(serialNumber)}
            </span>
        `;

        serialNumber++;

    });

}

// ==============================
// Init
// ==============================

refreshMeta();