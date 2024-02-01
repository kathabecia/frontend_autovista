function setRouter() {
  switch (window.location.pathname) {
    // If you are logged in you cant access outside pages
    case "/login.html":
    case "/register.html":
      if (localStorage.getItem("token")) {
        window.location.pathname = "/vehicle.html";
      }
      break;
    // If you are not logged in you cant access dashboard pages
    // case "/":
    case "/vehicle.html":
    case "/dealer.html":
    case "/inventory.html":
    case "/my-inventory.html":
      // case "/register.html":
      if (!localStorage.getItem("token")) {
        window.location.pathname = "/login.html";
      }
      break;
    case "/my-inventory.html":
      if (localStorage.getItem("role") != "Dealer") {
        window.location.pathname = "/vehicle.html";
      }
      break;
    default:
      break;
  }
}

export { setRouter };
