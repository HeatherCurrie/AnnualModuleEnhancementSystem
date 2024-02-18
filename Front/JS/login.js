// SHOW PASSWORD FUNCTIONALITY
function passwordVisibility() {
    var visibility = document.getElementById("password");
    if (visibility.type === "password") {
      visibility.type = "text";
    } else {
      visibility.type = "password";
    }
  }