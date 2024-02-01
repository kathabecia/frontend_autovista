import {
  backendURL,
  showNavDealerPages,
  showNavAdminPages,
  successNotification,
  errorNotification,
  getLoggedUser,
} from "../utils/utils.js";

// calling function - important to execute the code inside the function
getLoggedUser();

// Get All Data
getData();

showNavDealerPages();

showNavAdminPages();

// Page Functionality
const pageAction = async (e) => {
  // Get url from data-url attribute within the btn_pagination anchor tag
  const url = e.target.getAttribute("data-url");

  // Get search keyword from the form
  const formData = new FormData(form_search);
  const brandKeyword = formData.get("brand");

  // Refresh card list with the correct parameters
  getData(url, brandKeyword);
};

async function getData(url = "", keyword = "") {
  // Add Loading if pagination or search is used; Remove if its not needed
  if (url !== "" || keyword !== "") {
    document.getElementById(
      "get_data"
    ).innerHTML = `<div class="col-sm-12 d-flex justify-content-center align-items-center">
        <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
        <b class="ms-2">Loading Data...</b>
    </div>`;
  }

  // Clear existing content before loading new data
  document.getElementById("get_data").innerHTML = "";

  // To cater pagination and search feature
  let queryParams =
    "?" +
    (url != "" ? new URL(url).searchParams + "&" : "") + //Remove this line if not using pagination
    (keyword != "" ? "keyword=" + keyword : "");

  // Get Property Owner API Endpoint; Caters search
  const response = await fetch(backendURL + "/api/user/all" + queryParams, {
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
      "ngrok-skip-browser-warning": "69420", // Include ngrok bypass header directly
    },
  });

  // async function getData() {
  //   // Get Owner API Endpoint
  //   const response = await fetch(
  //     backendURL + "/api/owner",
  //     {
  //       headers: {
  //         Accept: "application/json",
  //         Authorization: "Bearer " + localStorage.getItem("token"),
  //       },
  //     }
  //   );

  // Get response if 200-299 status code
  if (response.ok) {
    const json = await response.json();

    console.log(json);

    // Get Each Json Elements and merge with HTML element and put it into a container
    let container = "";
    // Now caters pagination; You can use "json.data" if using pagination or "json" only if no pagination
    json.data.forEach((element) => {
      const date = new Date(element.created_at).toLocaleString();

      container += `<div class="col-sm-12">
                    <div class="card w-100 mt-3" data-id="${element.id}">
                    
                    <div class="row">
                        <div class="col-sm-4 d-flex align-items-center">
                            <img class="rounded" src="${backendURL}/storage/${element.image}" width="200px" >
                        </div>

                        <div class="col-sm-8">
                        <div class="card-body">
                                <div class="dropdown float-end">
                                <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button>
                                <ul class="dropdown-menu">
                                    <li>
                                        <a class="dropdown-item" href="#" id="btn_edit" data-id="${element.id}">Edit</a>
                                    </li>
                                    <li>
                                        <a class="dropdown-item" href="#" id="btn_delete" data-id="${element.id}">Delete</a>
                                    </li>
                                </ul>
                            </div>

                            <div>
                            <h6 class="card-title"><b>Last Name:</b>     ${element.lastname}</h5>
                            <h6 class="card-text"><b>First Name:</b>     ${element.firstname}</h6>
                            <h6 class="card-text"><b>Role:</b>     ${element.role}</h6>
                            <h6 class="card-title"><b>Email:</b>     ${element.email}</h5>
                            
                            </div>
                            <h6 class="card-subtitle text-body-secondary mt-4">
                            <small><b>Date created:</b>     ${date}</small>
                            </h6>
                        </div>
                        </div>
                        

                    </div>
                  </div>`;
    });

    // Use the container to display the fetch data
    document.getElementById("get_data").innerHTML = container;

    // Assign click event on Edit Btns
    document.querySelectorAll("#btn_edit").forEach((element) => {
      element.addEventListener("click", editAction);
    });

    // Assign click event on Delete Btns
    document.querySelectorAll("#btn_delete").forEach((element) => {
      element.addEventListener("click", deleteAction);
    });

    // Get Each Json Elements and merge with Html elements and put it into a container
    let pagination = "";
    // Now caters pagination; Remove below if no pagination
    json.links.forEach((element) => {
      pagination += `<li class="mt-5 page-item">
                    <a class="page-link
                    ${element.url == null ? " disabled" : ""}
                    ${element.active ? " active" : ""}
                    " href="#" id="btn_paginate" data-url="${element.url}">
                      ${element.label}
                    </a>
                    </li>`;
    });

    // Use the container to display the fetch data
    document.getElementById("get_pagination").innerHTML = pagination;

    // Assign  click event on Page Btns
    document.querySelectorAll("#btn_paginate").forEach((element) => {
      element.addEventListener("click", pageAction);
    });
  }
  // Get response if 400+ or 500+ status code
  else {
    errorNotification("HTTP-Error: " + response.status);
  }
}

// Search Form
const form_search = document.getElementById("form_search");
form_search.onsubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData(form_search);
  const brandKeyword = formData.get("brand");

  // Use the brandKeyword as the search parameter
  getData("", brandKeyword);
};

//Store and Update Functionality Combined
// Submit Form Functionality; This is for create and update
const form_users = document.getElementById("form_users");

form_users.onsubmit = async (e) => {
  console.log("Form submitted"); // Add this line
  e.preventDefault();

  // Disable button
  console.log("Disabling button"); // Add this line
  document.querySelector("#form_users button[type = 'submit']").disabled = true;
  document.querySelector(
    "#form_users button[type = 'submit']"
  ).innerHTML = `<div class="col-sm-12 d-flex justify-content-center align-items-center">
      <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
      </div>
      <b class="ms-2">Loading...</b>
  </div>`;

  //   Get values of form (input, textarea, select) put it as form-data
  const formData = new FormData(form_users);

  console.log("Form data:", formData); // Add this line

  // Check Key/value pairs of form data; Uncomment to debug
  // for (let [name, value] of formData) {
  //   //key1 = value1, then key2 = value2
  //   // Use for checking if the store property owner is working
  //   console.log(`${name} = ${value}`);
  // }

  let response;
  // Check if for_update_id is empty; If it is empty then it's create, else it's update
  if (for_update_id == "") {
    // const id = document.querySelector('#form_users input[type="hidden"]').value;
    // const forUpdate = id.length > 0 ? true : false;

    //   fetch API property owner store endpoint
    response = await fetch(backendURL + "/api/user", {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
        "ngrok-skip-browser-warning": "69420", // Include ngrok bypass header directly
      },
      body: formData,
    });
  }

  // For Update
  else {
    // Add Method Spoofing to cater Image Upload; Cause you are using FormData; Uncomment if necessary
    formData.append("_method", "PUT");

    //   fetch API property owner update endpoint
    response = await fetch(backendURL + "/api/user/" + for_update_id, {
      method: "POST", //Change to POST if with Image Upload
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
        "ngrok-skip-browser-warning": "69420", // Include ngrok bypass header directly
      },
      // Uncomment body below; If with Image Upload
      body: formData,
      // Comment body below; if with Image Upload
      // body: new URLSearchParams(formData),
    });
  }

  // Check Key/value pairs of form data, un comment to debug
  // for (let [name, value] of formData) {
  //   //key1 = value1, then key2 = value2
  //   // Use for checking if the store property owner is working
  //   console.log(`${name} = ${value}`);
  // }

  // const id = document.querySelector('#form_users input[type="hidden"]').value;
  // const forUpdate = id.length > 0 ? true : false;

  // Get response if 200-299 status code
  if (response.ok) {
    // uncomment the two code lines below for debugging purpose
    // const json = await response.json();
    // console.log(json);

    // Reset Form
    form_users.reset();

    // // Refresh the page
    // location.reload();

    successNotification(
      "Successfully" +
        (for_update_id == "" ? " created" : " updated") +
        " user.",
      10
    );

    // Close Modal
    document.getElementById("modal_close").click();

    // reset to null the for_update_id
    for_update_id = "";

    // Reload Page
    getData();

    // // Refresh the page
    // location.reload(10);
  }
  // Get response if 422 status code
  else if (response.status == 422) {
    const json = await response.json();

    // Close Modal
    document.getElementById("modal_close").click();

    errorNotification(json.message, 10);
  }
  // Always reset for_update_id to empty string
  for_update_id = "";

  document.querySelector("#form_users button[type='submit']").disabled = false;
  document.querySelector("#form_users button[type='submit']").innerHTML =
    "Submit";
};

// Delete Functionality
const deleteAction = async (e) => {
  // Get Id from data Id attribute within the btn_delete anchor tag
  const id = e.target.getAttribute("data-id");

  // Open the delete confirmation modal
  const deleteConfirmationModal = new bootstrap.Modal(
    document.getElementById("deleteConfirmationModal")
  );
  deleteConfirmationModal.show();

  // Set up the event listener for the confirm delete button in the modal
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
  confirmDeleteBtn.addEventListener("click", async () => {
    // Background red the card that you want to delete
    document.querySelector(`.card[data-id="${id}"]`).style.backgroundColor =
      "red";

    // Fetch API property owner delete endpoint
    const response = await fetch(backendURL + "/api/user/" + id, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
        "ngrok-skip-browser-warning": "69420", // Include ngrok bypass header directly
      },
    });

    // Get response if 200-299 status code
    if (response.ok) {
      // Uncomment for debugging purpose
      // const json = await response.json();
      // console.log(json);

      successNotification("Successfully deleted user", 10);

      // Remove the card from the list
      document.querySelector(`.card[data-id="${id}"]`).remove();
    }
    // Get response if 400+ or 500+
    else {
      errorNotification("Unable to delete!", 10);

      // Background white the card if unable to delete
      document.querySelector(`.card[data-id="${id}"]`).style.backgroundColor =
        "white";
    }

    // Close the delete confirmation modal
    deleteConfirmationModal.hide();
  });
};

// Update Functionality
const editAction = async (e) => {
  // Get Id from data Id attribute within the btn_delete anchor tag
  const id = e.target.getAttribute("data-id");

  // Reset the for_update_id variable
  for_update_id = "";

  // Show Functionality Function Call
  await showData(id);

  // Set the for_update_id variable with the correct ID
  for_update_id = id;

  // Show Modal Form
  document.getElementById("modal_show").click();
};

// Storage of Id of chosen data to update
let for_update_id = "";

// Show Functionality
const showData = async (id) => {
  // Background Yellow the card you want to delete
  document.querySelector(`.card[data-id="${id}"]`).style.borderColor = "blue";

  // Fetch API Dealer show endpoint
  const response = await fetch(backendURL + "/api/user/" + id, {
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

    // Store id to a variable; id will be utilized for update
    for_update_id = json.id;

    // Display json response to Form tags; make sure to set id attribute on tags (input, textarea, select)
    document.getElementById("lastname").value = json.lastname;
    document.getElementById("firstname").value = json.firstname;
    document.getElementById("role").value = json.role;
    document.getElementById("email").value = json.email;
    document.getElementById("dealer_id").value = json.dealer_id;
    document.getElementById("password").value = json.password;
    document.getElementById("password_confirmation").value =
      json.password_confirmation;

    // Change Button Description; You can also use textContent instead of innerHTML
    document.querySelector("#form_users button[type='submit']").innerHTML =
      "Update Info";

    // Handle file input separately if it's a file input
    const imageInput = document.getElementById("image");

    if (imageInput) {
      // Check if the imagePreview element exists
      const imagePreview = document.getElementById("imagePreview");
      if (imagePreview) {
        // You might want to display the image or handle it in a different way
        // This is just an example, you might need to adapt this to your use case
        imagePreview.src = backendURL + "/storage/" + json.image;
      }
    } else {
      // Otherwise, set the value as usual
      document.getElementById("image").value = json.image;
    }
  }

  // Get response if 400+ or 500+
  else {
    errorNotification("Unable to show!", 10);

    // Background white the card if unable to show
    document.querySelector(`.card[data-id="${id}"]`).style.backgroundColor =
      "white";
  }
};

export { getData };
