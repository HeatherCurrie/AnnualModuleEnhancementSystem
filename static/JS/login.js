// SHOW PASSWORD FUNCTIONALITY
function passwordVisibility() {
  var visibility = document.getElementById("password");
  if (visibility.type === "password") {
    visibility.type = "text";
  } else {
    visibility.type = "password";
  }
}

  document.getElementById("loginForm").onsubmit = async function(event) {
    event.preventDefault();
    let formData = new FormData(event.target);
    let response = await fetch('/login', {
        method: 'POST',
        body: formData
    });

    if (response.status === 409) {
        const data = await response.json();
        alert(data.error); 
    } else if (response.ok) {
        window.location.href = '/';
    } else {
        alert('Incorrect Email or Password.');
    }
}