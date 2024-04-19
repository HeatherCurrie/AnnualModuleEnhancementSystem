document.getElementById("registrationForm").onsubmit = async function(event) {
    event.preventDefault();
    let formData = new FormData(event.target);
    let response = await fetch('/register-user', {
        method: 'POST',
        body: formData
    });

    if (response.status === 409) {
        const data = await response.json();
        alert(data.error); 
    } else if (response.ok) {
        window.location.href = '/';
    } else {
        alert('Email already exists.');
    }
}