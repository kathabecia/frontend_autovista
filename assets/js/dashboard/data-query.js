import {
  backendURL,
  showNavDealerPages,
  showNavAdminPages,
  errorNotification,
  getLoggedUser,
} from "../utils/utils.js";

// calling function - important to execute the code inside the function
getLoggedUser();

// Get All Data
getData();

showNavDealerPages();

showNavAdminPages();

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
    (url !== "" ? new URL(url).searchParams + "&" : "") +
    (keyword !== "" ? "keyword=" + keyword : "");

  // Get Property Owner API Endpoint; Caters search
  const response = await fetch(backendURL + "/api/sales/trends", {
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

    // Display each query in a table
    json.forEach((queryData, index) => {
      let tableContainer = `<h3>${getTableTitle(index)}</h3>`;
      tableContainer += `<table class="table table-bordered table-hover">
                            <thead>
                              ${getTableHeader(index)}
                            </thead>
                            <tbody>
                              ${getTableBody(queryData)}
                            </tbody>
                          </table>`;

      document.getElementById("get_data").innerHTML += tableContainer;
    });
  } else {
    errorNotification("HTTP-Error: " + response.status);
  }
}

// Helper function to get the title of each table
function getTableTitle(index) {
  const titles = [
    "Sales Trends",
    "VIN and Customer Containing Transmission form Supplier Getrag",
    "Brand and Total Income",
    "Brand and Total Sales",
    "Month and Convertible Sales",
    "Dealer and Average Days in Inventory",
  ];

  return titles[index];
}

// Helper function to get the header of each table
function getTableHeader(index) {
  const headers = [
    "<tr><th>Year</th><th>Month</th><th>Week</th><th>Brand Name</th><th>Gender</th><th>Income Range</th><th>Sales Count</th></tr>",
    "<tr><th>VIN</th><th>Customer</th></tr>",
    "<tr><th>Brand Name</th><th>Total Income</th></tr>",
    "<tr><th>Brand Name</th><th>Total Sales</th></tr>",
    "<tr><th>Month</th><th>Convertible Sales</th></tr>",
    "<tr><th>Dealer</th><th>Average Days in Inventory</th></tr>",
  ];

  return headers[index];
}

// Helper function to get the body of each table
function getTableBody(queryData) {
  return queryData
    .map(
      (item) =>
        "<tr>" +
        Object.values(item)
          .map((value) => `<td>${value}</td>`)
          .join("") +
        "</tr>"
    )
    .join("");
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

export { getData };
