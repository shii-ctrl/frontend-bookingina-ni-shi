const content = document.querySelector("#content");
const bookingForm = document.querySelector("#bookingForm");
const cancelBtn = document.querySelector("#cancelBtn");
let editingId = null;

window.addEventListener("load", () => {
  getBookings();
});

// CANCEL EDIT
cancelBtn.addEventListener("click", () => {
  editingId = null;
  document.querySelector("button[type='submit']").textContent = "Add Booking";
  bookingForm.reset();
  cancelBtn.style.display = "none";
});

// Format date to MM/DD/YYYY
function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

// GET BOOKINGS
function getBookings() {
  let html = "";

  fetch("https://booking-ni-shi.onrender.com/api/users", { mode: "cors" })
    .then((response) => response.json())
    .then((data) => {
      if (data.length === 0) {
        html = '<p>No bookings yet.</p>';
      } else {
        data.forEach((element) => {
          html += `
            <div class="booking-card">
              <div class="card-header">
                <span class="booking-id">#${element.id}</span>
              </div>

              <div class="card-content">
                <div><b>Name:</b> ${element.customer_name}</div>
                <div><b>PC Number:</b> ${element.pc_number}</div>
                <div><b>Date:</b> ${formatDate(element.booking_date)}</div>
                <div><b>Time:</b> ${element.start_time} - ${element.end_time}</div>
                <div><b>Status:</b> 
                  <select onchange="updateStatus(${element.id}, this.value)">
                    <option value="Pending" ${element.status === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="Confirmed" ${element.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
                    <option value="Completed" ${element.status === 'Completed' ? 'selected' : ''}>Completed</option>
                    <option value="Cancelled" ${element.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                  </select>
                </div>
                <div><b>Contact:</b> ${element.contact_number}</div>
              </div>

              <button onclick="editBooking(${element.id})">Edit</button>
              <button onclick="deleteBooking(${element.id})">Delete</button>
            </div>
          `;
        });
      }

      content.innerHTML = html;
    })
    .catch((error) => {
      console.log(error);
      content.innerHTML = "<p>Failed to load bookings.</p>";
    });
}

// POST/UPDATE BOOKING
bookingForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const booking = {
    customer_name: document.querySelector("#customer_name").value,
    pc_number: document.querySelector("#pc_number").value,
    booking_date: document.querySelector("#booking_date").value,
    start_time: document.querySelector("#start_time").value,
    end_time: document.querySelector("#end_time").value,
    contact_number: document.querySelector("#contact_number").value,
  };

  const method = editingId ? "PUT" : "POST";
  const url = editingId ? `https://booking-ni-shi.onrender.com/api/users/${editingId}` : "https://booking-ni-shi.onrender.com/api/users";

  fetch(url, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(booking),
  })
    .then(() => {
      alert(editingId ? "Booking updated successfully" : "Booking added successfully");
      editingId = null;
      document.querySelector("button[type='submit']").textContent = "Add Booking";
      bookingForm.reset();
      cancelBtn.style.display = "none";
      getBookings();
    })
    .catch((error) => {
      console.log(error);
    });
});

// DELETE BOOKING
function deleteBooking(id) {
  fetch(`https://booking-ni-shi.onrender.com/api/users/${id}`, {
    method: "DELETE",
  }).then(() => location.reload());
}

// EDIT BOOKING
function editBooking(id) {
  fetch(`https://booking-ni-shi.onrender.com/api/users/${id}`, { mode: "cors" })
    .then((response) => response.json())
    .then((booking) => {
      document.querySelector("#customer_name").value = booking.customer_name;
      document.querySelector("#pc_number").value = booking.pc_number;
      document.querySelector("#booking_date").value = booking.booking_date;
      document.querySelector("#start_time").value = booking.start_time;
      document.querySelector("#end_time").value = booking.end_time;
      document.querySelector("#contact_number").value = booking.contact_number;
      editingId = id;
      document.querySelector("button[type='submit']").textContent = "Update Booking";
      cancelBtn.style.display = "inline-block";
    })
    .catch((error) => console.log(error));
}

// UPDATE STATUS
function updateStatus(id, newStatus) {
  fetch(`https://booking-ni-shi.onrender.com/api/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: newStatus }),
  })
    .then(() => {
      alert("Status updated successfully");
      getBookings(); // Refresh the list
    })
    .catch((error) => console.log(error));
}
