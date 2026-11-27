// This project uses localStorage instead of a database.
// Complaints are saved in the browser after they are submitted.
// The login is only a demo: any valid mobile number or email works,
// and any 6-digit number is accepted as the OTP.

const storageKey = "simpleComplaintPortalV2";
const userKey = "simpleComplaintPortalUser";

const exampleComplaints = [
  {
    id: "CMP-1001",
    name: "Aarav Mehta",
    email: "aarav@example.com",
    category: "Service",
    priority: "High",
    subject: "Service request is delayed",
    description: "My service request has not been updated.",
    attachment: "",
    status: "In Progress",
    date: "2026-11-02"
  },
  {
    id: "CMP-1002",
    name: "Meera Kapoor",
    email: "meera@example.com",
    category: "Billing",
    priority: "Medium",
    subject: "Incorrect amount on invoice",
    description: "The invoice includes an extra charge.",
    attachment: "invoice.pdf",
    status: "Resolved",
    date: "2026-11-04"
  }
];

let complaints = JSON.parse(localStorage.getItem(storageKey)) || exampleComplaints;

const form = document.querySelector("#complaintForm");
const tableBody = document.querySelector("#complaintsBody");
const searchInput = document.querySelector("#searchInput");
const statusFilter = document.querySelector("#statusFilter");

const loginSection = document.querySelector("#loginSection");
const appContent = document.querySelector("#appContent");
const mainNav = document.querySelector("#mainNav");
const userLabel = document.querySelector("#userLabel");
const loginForm = document.querySelector("#loginForm");
const otpForm = document.querySelector("#otpForm");
const loginIdInput = document.querySelector("#loginId");
const otpInput = document.querySelector("#otpInput");
const loginMessage = document.querySelector("#loginMessage");

let pendingUser = "";

function saveComplaints() {
  localStorage.setItem(storageKey, JSON.stringify(complaints));
}

function statusClass(status) {
  return status.toLowerCase().replace(" ", "-");
}

function updateDashboard() {
  document.querySelector("#totalCount").textContent = complaints.length;
  document.querySelector("#openCount").textContent = complaints.filter(item => item.status === "Open").length;
  document.querySelector("#progressCount").textContent = complaints.filter(item => item.status === "In Progress").length;
  document.querySelector("#resolvedCount").textContent = complaints.filter(item => item.status === "Resolved").length;
}

function getVisibleComplaints() {
  const searchText = searchInput.value.toLowerCase();
  const selectedStatus = statusFilter.value;

  return complaints.filter(item => {
    const matchesSearch = `${item.id} ${item.name} ${item.subject}`.toLowerCase().includes(searchText);
    const matchesStatus = selectedStatus === "All" || item.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });
}

function showComplaints() {
  const visibleComplaints = getVisibleComplaints();
  tableBody.innerHTML = "";
  document.querySelector("#emptyMessage").hidden = visibleComplaints.length !== 0;

  visibleComplaints.forEach(item => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.id}</td>
      <td><strong>${item.subject}</strong><br><small>${item.name}</small></td>
      <td>${item.category}</td>
      <td>${item.priority}</td>
      <td><span class="status ${statusClass(item.status)}">${item.status}</span></td>
      <td>${item.date}</td>
    `;
    tableBody.appendChild(row);
  });
}

function newTrackingId() {
  return `CMP-${Date.now().toString().slice(-6)}`;
}

// ---------- Login and logout ----------

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidMobile(value) {
  return /^\d{10}$/.test(value);
}

function showLoginMessage(text, isError) {
  loginMessage.textContent = text;
  loginMessage.classList.toggle("not-found", isError);
}

function resetLoginForms() {
  pendingUser = "";
  loginForm.reset();
  otpForm.reset();
  loginForm.hidden = false;
  otpForm.hidden = true;
  showLoginMessage("", false);
}

// Shows either the login box or the portal, depending on whether a user is logged in
function updateLoginView() {
  const user = localStorage.getItem(userKey);
  const loggedIn = Boolean(user);

  loginSection.hidden = loggedIn;
  appContent.hidden = !loggedIn;
  mainNav.hidden = !loggedIn;
  userLabel.textContent = loggedIn ? user : "";
}

loginForm.addEventListener("submit", event => {
  event.preventDefault();
  const value = loginIdInput.value.trim();

  if (!isValidEmail(value) && !isValidMobile(value)) {
    showLoginMessage("Please enter a valid 10-digit mobile number or email address.", true);
    return;
  }

  pendingUser = value;
  loginForm.hidden = true;
  otpForm.hidden = false;
  otpInput.focus();
  showLoginMessage(`OTP sent to ${pendingUser}. (Demo: enter any 6-digit number.)`, false);
});

// Allow only digits in the OTP box
otpInput.addEventListener("input", () => {
  otpInput.value = otpInput.value.replace(/\D/g, "");
});

otpForm.addEventListener("submit", event => {
  event.preventDefault();

  if (!/^\d{6}$/.test(otpInput.value)) {
    showLoginMessage("The OTP must be exactly 6 digits.", true);
    return;
  }

  localStorage.setItem(userKey, pendingUser);
  resetLoginForms();
  updateLoginView();
  window.scrollTo(0, 0);
});

document.querySelector("#changeIdButton").addEventListener("click", resetLoginForms);

document.querySelector("#logoutButton").addEventListener("click", () => {
  localStorage.removeItem(userKey);
  resetLoginForms();
  updateLoginView();
  window.scrollTo(0, 0);
});

// ---------- Complaints ----------

form.addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(form);
  const file = document.querySelector("#attachment").files[0];
  const complaint = {
    id: newTrackingId(),
    name: data.get("name"),
    email: data.get("email"),
    category: data.get("category"),
    priority: data.get("priority"),
    subject: data.get("subject"),
    description: data.get("description"),
    attachment: file ? file.name : "",
    status: "Open",
    date: new Date().toLocaleDateString()
  };

  complaints.unshift(complaint);
  saveComplaints();
  updateDashboard();
  showComplaints();
  form.reset();
  document.querySelector("#formMessage").textContent = `Complaint submitted. Your tracking ID is ${complaint.id}.`;
});

searchInput.addEventListener("input", showComplaints);
statusFilter.addEventListener("change", showComplaints);

document.querySelector("#trackButton").addEventListener("click", () => {
  const trackingId = document.querySelector("#trackingInput").value.trim().toUpperCase();
  const result = document.querySelector("#trackingResult");
  const complaint = complaints.find(item => item.id === trackingId);

  if (complaint) {
    result.classList.remove("not-found");
    result.textContent = `${complaint.id}: ${complaint.subject} is ${complaint.status}.`;
  } else {
    result.classList.add("not-found");
    result.textContent = "Complaint not found. Please check the tracking ID.";
  }
});

saveComplaints();
updateDashboard();
showComplaints();
updateLoginView();
