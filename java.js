const districtSelect = document.getElementById("district-select");
const mandalSelect = document.getElementById("mandal-select");
const villageSelect = document.getElementById("village-select");
const otpHint = document.getElementById("otp-hint");
const otpInput = document.getElementById("otp-input");
const sarpanchForm = document.getElementById("sarpanch-form");
const adminForm = document.getElementById("admin-form");

const sarpanchDashboard = document.querySelector("#sarpanch-dashboard .dashboard-details");
const adminDashboard = document.querySelector("#admin-dashboard .dashboard-details");
const sarpanchTable = document.getElementById("sarpanch-table");

let villagesData = [];
let generatedOtp = null;

const DEFAULT_ADMIN_EMAIL = "admin@gmail.com";
const DEFAULT_ADMIN_PASSWORD = "12345";

const populateSelect = (select, options) => {
  select.innerHTML = '<option value="">Select</option>';
  options.forEach((option) => {
    const element = document.createElement("option");
    element.value = option;
    element.textContent = option;
    select.appendChild(element);
  });
};

const updateDistricts = () => {
  const districts = [...new Set(villagesData.map((entry) => entry.district))];
  populateSelect(districtSelect, districts);
  populateSelect(mandalSelect, []);
  populateSelect(villageSelect, []);
};

const updateMandals = (district) => {
  const mandals = villagesData
    .filter((entry) => entry.district === district)
    .map((entry) => entry.mandal);
  populateSelect(mandalSelect, [...new Set(mandals)]);
  populateSelect(villageSelect, []);
};

const updateVillages = (district, mandal) => {
  const villages = villagesData
    .filter((entry) => entry.district === district && entry.mandal === mandal)
    .map((entry) => entry.village);
  populateSelect(villageSelect, villages);
};

const updateVillageDashboard = (villageInfo) => {
  sarpanchDashboard.classList.remove("hidden");
  document.getElementById("village-name").textContent = villageInfo.village;
  document.getElementById("village-district").textContent = `${villageInfo.mandal}, ${villageInfo.district}`;
  document.getElementById("village-population").textContent = villageInfo.population;
  document.getElementById("village-households").textContent = villageInfo.households;
  document.getElementById("village-occupation").textContent = villageInfo.occupation;
  document.getElementById("village-sarpanch").textContent = villageInfo.sarpanch;
  document.getElementById("village-contact").textContent = villageInfo.contact;
  document.getElementById("village-focus").textContent = villageInfo.focus;
};

const updateAdminTable = () => {
  sarpanchTable.innerHTML = "";
  villagesData.forEach((entry) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${entry.district}</td>
      <td>${entry.mandal}</td>
      <td>${entry.village}</td>
      <td>${entry.sarpanch}</td>
      <td>${entry.contact}</td>
    `;
    sarpanchTable.appendChild(row);
  });
};

fetch("villages.json")
  .then((response) => response.json())
  .then((data) => {
    villagesData = data;
    updateDistricts();
  });

districtSelect.addEventListener("change", (event) => {
  updateMandals(event.target.value);
});

mandalSelect.addEventListener("change", (event) => {
  updateVillages(districtSelect.value, event.target.value);
});

document.getElementById("generate-otp").addEventListener("click", () => {
  const mobileNumber = document.getElementById("mobile-number").value.trim();
  if (mobileNumber.length !== 10 || Number.isNaN(Number(mobileNumber))) {
    otpHint.textContent = "Enter a valid 10-digit mobile number.";
    generatedOtp = null;
    return;
  }
  generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
  otpHint.textContent = `Demo OTP: ${generatedOtp}`;
});

sarpanchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const district = districtSelect.value;
  const mandal = mandalSelect.value;
  const village = villageSelect.value;
  const otp = otpInput.value.trim();
  const villageInfo = villagesData.find(
    (entry) =>
      entry.district === district &&
      entry.mandal === mandal &&
      entry.village === village
  );

  if (!generatedOtp || otp !== generatedOtp) {
    otpHint.textContent = "OTP does not match. Please generate again.";
    return;
  }

  if (!villageInfo) {
    otpHint.textContent = "Please complete the location selection.";
    return;
  }

  otpHint.textContent = "Login successful.";
  updateVillageDashboard(villageInfo);
  otpInput.value = "";
  generatedOtp = null;
});

adminForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.getElementById("admin-email").value.trim();
  const password = document.getElementById("admin-password").value.trim();

  if (email !== DEFAULT_ADMIN_EMAIL || password !== DEFAULT_ADMIN_PASSWORD) {
    alert("Invalid admin credentials.");
    return;
  }

  adminDashboard.classList.remove("hidden");
  updateAdminTable();
});
