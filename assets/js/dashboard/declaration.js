import {
    backendURL,
    showNavAdminPages,
    successNotification,
    errorNotification,
    getLoggedUser,
    // getData,
  } from "../utils/utils.js";
  
  // Get Logged User Info
  getLoggedUser();
  
  // Get Admin Pages
  showNavAdminPages();
  
  // Get All Data
  // getData();
  
  // const form_declaration = document.getElementById("form_declaration");
  
  // form_declaration.onsubmit = async (e) => {
  //   e.preventDefault();
  
  //   // Disable Button
  //   const submitButton = document.querySelector("#form_declaration button[type='submit']");
  //   submitButton.disabled = true;
  //   submitButton.innerHTML = `<div class="d-flex justify-content-center align-items-center"> <div class="spinner-border me-2" role="status"></div><span>Loading...</span> </div>`;
  
  //   try {
  //     // Get Values of Form (input, textarea, select) set it as form-data
  //     const formData = new FormData(form_declaration);
  
  //     // uncomment to debug
  //     console.log([...formData.entries()]);
  
  //     // Fetch API User Item Store Endpoint for /api/classification
  //     const responseClassification = await fetch(backendURL + "/api/classification", {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         Authorization: "Bearer " + localStorage.getItem("token"),
  //         "ngrok-skip-browser-warning": "69420", // Include ngrok bypass header directly
  //       },
  //       body: formData,
  //     });
  
  //     if (!responseClassification.ok) {
  //       throw new Error(`HTTP error! Status: ${responseClassification.status}`);
  //     }
  
  //     // Fetch API User Item Store Endpoint for /api/tax
  //     const responseTax = await fetch(backendURL + "/api/tax", {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         Authorization: "Bearer " + localStorage.getItem("token"),
  //         "ngrok-skip-browser-warning": "69420", // Include ngrok bypass header directly
  //       },
  //       body: formData,
  //     });
  
  //     if (!responseTax.ok) {
  //       throw new Error(`HTTP error! Status: ${responseTax.status}`);
  //     }
  
  //     // Reset Form
  //     form_declaration.reset();
  
  //     // Handle success
  //     successNotification("Successfully saved information", 10);
  
  //     // Reload Page
  //     // getData();
  //   } 
  //   catch (error) {
  //     console.error('Error:', error);
  
  //     // Handle error
  //     errorNotification("Failed to save information", 10);
  //   } 
  //   finally {
  //     // Enable the submit button after the request is complete
  //     submitButton.disabled = false;
  //     submitButton.innerHTML = "Submit";
  //   }
  // };
  
  const form_declaration = document.getElementById("form_declaration");
  
  form_declaration.onsubmit = async (e) => {
    e.preventDefault();
  
    // Disable Button
    const submitButton = document.querySelector("#form_declaration button[type='submit']");
    submitButton.disabled = true;
    submitButton.innerHTML = `<div class="d-flex justify-content-center align-items-center"> <div class="spinner-border me-2" role="status"></div><span>Loading...</span> </div>`;
  
    try {
      // Get Values of Form (input, textarea, select) set it as form-data
      const formData = new FormData(form_declaration);
  
      // Calculate assessed value
      const fairMarketValue = parseFloat(formData.get('fair_market_value'));
      const assessmentLevel = parseFloat(formData.get('assessment_level')) / 100; // Convert to decimal
      const assessedValue = fairMarketValue * assessmentLevel;
  
      // Calculate real property tax
      const basicPropertyTax = parseFloat(formData.get('basic_property_tax')) * 1000;
      const specialEducationFund = parseFloat(formData.get('special_education_fund')) * 1000;
      const realPropertyTax = basicPropertyTax + specialEducationFund;
  
      // Display assessed value and real property tax in console
      // console.log("Assessed Value: ", assessedValue);
      // console.log("Real Property Tax: ", realPropertyTax);
  
      // Display assessed value and real property tax in HTML
      document.getElementById('assessed_value_output').innerText = `Assessed Value: ${assessedValue}`;
      document.getElementById('real_property_tax_output').innerText = `Real Property Tax: ${realPropertyTax}`;
  
      // Fetch API User Item Store Endpoint for /api/classification
      const responseClassification = await fetch(backendURL + "/api/classification", {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
          "ngrok-skip-browser-warning": "69420", // Include ngrok bypass header directly
        },
        body: formData,
      });
  
      if (!responseClassification.ok) {
        throw new Error(`HTTP error! Status: ${responseClassification.status}`);
      }
  
      // Fetch API User Item Store Endpoint for /api/tax
      const responseTax = await fetch(backendURL + "/api/tax", {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
          "ngrok-skip-browser-warning": "69420", // Include ngrok bypass header directly
        },
        body: formData,
      });
  
      if (!responseTax.ok) {
        throw new Error(`HTTP error! Status: ${responseTax.status}`);
      }
  
      // Reset Form
      form_declaration.reset();
  
      // Handle success
      successNotification("Successfully saved information", 10);
  
      // Reload Page
      // getData();
    } catch (error) {
      console.error('Error:', error);
  
      // Handle error
      errorNotification("Failed to save information", 10);
    } finally {
      // Enable the submit button after the request is complete
      submitButton.disabled = false;
      submitButton.innerHTML = "Submit";
    }
  };
  