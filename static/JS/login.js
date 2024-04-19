// SHOW PASSWORD FUNCTIONALITY
function passwordVisibility() {
  var visibility = document.getElementById("password");
  if (visibility.type === "password") {
    visibility.type = "text";
  } else {
    visibility.type = "password";
  }
}

// Function to parse URL query parameters
function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

// Check if there's an error message in the URL
const errorMessage = getQueryParam('error');
if (errorMessage) {
  // Display the error message to the user
  alert(errorMessage);
}