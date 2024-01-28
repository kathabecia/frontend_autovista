// import router
import { setRouter } from "../router/router.js";
// Set Router
setRouter();

//Backend URL
const backendURL = "http://backend-autovista.test";

// Get Logged User Profile Name
async function getLoggedUser() {
  // const ngrokBypassHeader = new Headers({
  //   "ngrok-skip-browser-warning": "69420",
  // });
  // Ngrok bypass code
  // const ngrokBypassHeader = new Headers({
  // "ngrok-skip-browser-warning": "69420",
  // });
  // Access User Profile API Endpoint
  const response = await fetch(backendURL + "/api/profile/show", {
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
      "ngrok-skip-browser-warning": "69420", // Include ngrok bypass header directly
    },
  });

  // Get response if 200-299 status code
  if (response.ok) {
    const json = await response.json();

    console.log(json);

    document.getElementById("user_logged_name").innerHTML =
      json.firstname + " " + json.lastname;

    // Display user's image
    const imagePath = backendURL + "/storage/" + json.image;
    document.getElementById("user_logged_image").src = imagePath;

    // Sets value to the input field with id "user_id"
    if (document.getElementById("user_id")) {
      document.getElementById("user_id").value = json.id;
    }
  }

  // Get response if 400 or 500 status code
  else {
    const json = await response.json();

    errorNotification(json.message, 10);
  }
}

// Show Admin Pages
function showNavAdminPages() {
  if (
    localStorage.getItem("role") == "Dealer" ||
    localStorage.getItem("role") == "Admin"
  ) {
    document.getElementById(
      "nav_admin_pages"
    ).innerHTML = `<div class="sb-sidenav-menu-heading">Dealer Pages</div>
    <a class="nav-link" href="users.html">
        <div class="sb-nav-link-icon"><i class="fa-solid fa-user"></i></div>
        Users
    </a>`;
  }
}

// Notifications
function successNotification(message, seconds = 0) {
  document.querySelector(".alert-success").classList.remove("d-none");
  document.querySelector(".alert-success").classList.add("d-block");
  document.querySelector(".alert-success").innerHTML = message;

  if (seconds != 0) {
    setTimeout(function () {
      document.querySelector(".alert-success").classList.remove("d-block");
      document.querySelector(".alert-success").classList.add("d-none");
    }, seconds * 1000);
  }
}

function errorNotification(message, seconds = 0) {
  document.querySelector(".alert-danger").classList.remove("d-none");
  document.querySelector(".alert-danger").classList.add("d-block");
  document.querySelector(".alert-danger").innerHTML = message;

  if (seconds != 0) {
    setTimeout(function () {
      document.querySelector(".alert-danger").classList.remove("d-block");
      document.querySelector(".alert-danger").classList.add("d-none");
    }, seconds * 1000);
  }
}

export {
  backendURL,
  successNotification,
  errorNotification,
  getLoggedUser,
  showNavAdminPages,
};
