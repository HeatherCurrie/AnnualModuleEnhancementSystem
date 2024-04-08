// Get dropdown of users
function dropdownOptionsAdmin() {
    fetch('/get-users')
    .then(response => response.json())
    .then(data => {
        const select = document.getElementById('adminDropdown');

        data.forEach(option => {
            if (option.type == "Lecturer") {
                const opt = document.createElement('option');
                opt.value = option.userID;
                opt.textContent = option.name;
                select.appendChild(opt);
            }
        });
    })
    .catch(error => console.error('Error fetching options:', error));
}

// Get dropdown of users
function dropdownOptionsModuleLead() {
    fetch('/get-users')
    .then(response => response.json())
    .then(data => {
        const select = document.getElementById('moduleLeadDropdown');

        data.forEach(option => {
            if (option.type == "Admin") {
                const opt = document.createElement('option');
                opt.value = option.userID;
                opt.textContent = option.name;
                select.appendChild(opt);
            }
        });
    })
    .catch(error => console.error('Error fetching options:', error));
}


// Change to admin
function admin() {
    document.getElementById("adminButton").innerHTML = '<i class="fa-solid fa-gear fa-spin" id="spinner"></i>'
    const select = document.getElementById("adminDropdown");
    const selectedVal = Array.from(select.selectedOptions).map(option => option.value);
    const typeVal = "Admin";
        
    const data = {
        userID: selectedVal,
        type: typeVal,
    };
        
    // Send the data to the server using Fetch API
    fetch('/change-user-permissions', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json(); 
    })
    .then(data => {
        console.log('Success:', data); 
    })
    .catch((error) => {
        console.error('Error:', error);
        document.getElementById("adminButton").innerHTML = 'Change(s) Failed'; // Inform the user
    });
}

// Change to lecturer
function moduleLead() {
    document.getElementById("moduleLeadButton").innerHTML = '<i class="fa-solid fa-gear fa-spin" id="spinner"></i>'
    const select = document.getElementById("moduleLeadDropdown");
    const selectedVal = Array.from(select.selectedOptions).map(option => option.value);
    const typeVal = "Lecturer";
        
    const data = {
        userID: selectedVal,
        type: typeVal,
    };
        
    // Send the data to the server using Fetch API
    fetch('/change-user-permissions', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json(); 
    })
    .then(data => {
        console.log('Success:', data); 
    })
    .catch((error) => {
        console.error('Error:', error);
        document.getElementById("moduleLeadButton").innerHTML = 'Change(s) Failed'; // Inform the user
    });
}

// Call the function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', dropdownOptionsAdmin);
document.addEventListener('DOMContentLoaded', dropdownOptionsModuleLead);