const content = document.querySelector("#content");
const form = document.querySelector("#bookingForm");
const updateBtn = document.querySelector("#update");

// FORMAT DATE
function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

// LOAD DATA
window.addEventListener("load", getBookings);

// GET BOOKINGS
function getBookings() {
  fetch("https://booking-ni-shi.onrender.com/api/users")
    .then(res => res.json())
    .then(data => {
      let html = "";

      data.forEach(el => {
        html += `
        <li class="employee-item">
          <div class="employee-info">

            <div class="info-field">
              <span class="info-label">ID</span>
              <span>${el.id}</span>
            </div>

            <div class="info-field">
              <span class="info-label">Name</span>
              <span>${el.customer_name}</span>
            </div>

            <div class="info-field">
              <span class="info-label">PC</span>
              <span>${el.pc_number}</span>
            </div>

            <div class="info-field">
              <span class="info-label">Date</span>
              <span>${formatDate(el.booking_date)}</span>
            </div>

            <div class="info-field">
              <span class="info-label">Time</span>
              <span>${el.start_time} - ${el.end_time}</span>
            </div>

            <div class="info-field">
              <span class="info-label">Contact</span>
              <span>${el.contact_number}</span>
            </div>

          </div>

          <div class="action-buttons">
            <button onclick="editBooking(${el.id})">Edit</button>
            <button onclick="deleteBooking(${el.id})">Delete</button>
          </div>
        </li>
        `;
      });

      content.innerHTML = html;
    })
    .catch(err => {
      console.log(err);
      content.innerHTML = "Failed to load data";
    });
}

// ADD BOOKING
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const booking = {
    customer_name: document.querySelector("#customer_name").value,
    pc_number: document.querySelector("#pc_number").value,
    booking_date: document.querySelector("#booking_date").value,
    start_time: document.querySelector("#start_time").value,
    end_time: document.querySelector("#end_time").value,
    status: "Pending",
    contact_number: document.querySelector("#contact_number").value,
  };

  fetch("https://booking-ni-shi.onrender.com/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(booking),
  })
  .then(() => {
    alert("Booking Added");
    location.reload();
  })
  .catch(err => console.log(err));
});

// EXPOSE TO GLOBAL SCOPE (fixes inline onclick not finding functions)
window.editBooking = editBooking;
window.deleteBooking = deleteBooking;

// DELETE
function deleteBooking(id) {
  if (confirm("Delete this booking?")) {
    fetch(`https://booking-ni-shi.onrender.com/api/users/${id}`, {
      method: "DELETE",
    })
    .then(() => {
      alert("Deleted");
      location.reload();
    })
    .catch(err => console.log(err));
  }
}

// EDIT (FILL FORM)
function editBooking(id) {
  fetch(`https://booking-ni-shi.onrender.com/api/users/${id}`)
    .then(res => res.json())
    .then(data => {
      const b = data[0];

      document.querySelector("#customer_name").value = b.customer_name;
      document.querySelector("#pc_number").value = b.pc_number;
      document.querySelector("#booking_date").value = b.booking_date;
      document.querySelector("#start_time").value = b.start_time;
      document.querySelector("#end_time").value = b.end_time;
      document.querySelector("#contact_number").value = b.contact_number;
      document.querySelector("#ID").value = b.id;

      updateBtn.disabled = false; // enable update only after edit is loaded
    })
    .catch(err => console.log(err));
}

// UPDATE
updateBtn.addEventListener("click", () => {
  const id = document.querySelector("#ID").value;

  if (!id) {
    alert("Please click Edit on a booking first.");
    return;
  }

  const booking = {
    customer_name: document.querySelector("#customer_name").value,
    pc_number: document.querySelector("#pc_number").value,
    booking_date: document.querySelector("#booking_date").value,
    start_time: document.querySelector("#start_time").value,
    end_time: document.querySelector("#end_time").value,
    contact_number: document.querySelector("#contact_number").value,
    id,
  };

  fetch(`https://booking-ni-shi.onrender.com/api/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(booking),
  })
  .then(() => {
    alert("Updated");
    updateBtn.disabled = true;
    location.reload();
  })
  .catch(err => console.log(err));
});
