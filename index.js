const content = document.querySelector("#content");
const bookingForm = document.querySelector("#bookingForm");

window.addEventListener("load", () => {
  getBookings();
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
                <div><b>Status:</b> ${element.status}</div>
                <div><b>Contact:</b> ${element.contact_number}</div>
              </div>

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

// POST BOOKING
submit.addEventListener("click", () => {
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
  }).catch((error) => {
    console.log(error);
  });

  alert("Booking added successfully");
  location.reload();
});

// DELETE BOOKING
function deleteBooking(id) {
  fetch(`https://booking-ni-shi.onrender.com/api/users/${id}`, {
    method: "DELETE",
  }).then(() => location.reload());
}
