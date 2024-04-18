// Get dropdown of all reviews
function dropdownOptionsExport() {
    fetch('/get-all-reviews')
    .then(response => response.json())
    .then(data => {
        const select = document.getElementById('feedbackDropdown');

        data.forEach(option => {
            if (option.completed === "Completed"){
                const deadlineDate = new Date(option.deadline);
                const formattedDeadline = deadlineDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
                const opt = document.createElement('option');

                opt.value = option.feedbackID;
                opt.textContent = option.moduleCode + ": " + option.moduleName + " - " + formattedDeadline; 
                select.appendChild(opt);
            }
        });
    })
    .catch(error => console.error('Error fetching options:', error));
}


// When export button pressed
function exportWord() {
    document.getElementById("exportButton").innerHTML = '<i class="fa-solid fa-gear fa-spin" id="spinner"></i>'
    const select = document.getElementById("feedbackDropdown");
    const selectedVal = Array.from(select.selectedOptions).map(option => option.value);
        
    const data = {
        feedbackID: selectedVal
    };
        
    // Send the data to the server using Fetch API
    fetch('/export-word', { 
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
        window.location.href = managementURL; 
    })
    .catch((error) => {
        console.error('Error exporting document:', error);
    });
}


// Get dropdown of users
function dropdownOptionsEmail() {
    fetch('/get-users')
    .then(response => response.json())
    .then(data => {
        const select = document.getElementById('emailDropdown');

        data.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option.email;
            opt.textContent = option.name + ": " + option.email;
            select.appendChild(opt);
        });
    })
    .catch(error => console.error('Error fetching options:', error));
}


// Email staff once email button pressed
function emailStaff() {
    document.getElementById("emailButton").innerHTML = '<i class="fa-solid fa-gear fa-spin" id="spinner"></i>'
    const select = document.getElementById("emailDropdown");
    const selectedVal = Array.from(select.selectedOptions).map(option => option.value);
    const messageVal = document.getElementById("message").value;
    const subjectVal = document.getElementById("subject").value;
        
    const data = {
        subject: subjectVal,
        emails: selectedVal,
        message: messageVal
    };
        
    // Send the data to the server using Fetch API
    fetch('/email-staff', { 
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
        window.location.href = managementURL;
    })
    .catch((error) => {
        console.error('Error:', error);
        document.getElementById("emailButton").innerHTML = 'Email Failed'; // Inform the user
    });
}


// Display all incomplete reviews
function displayIncompleteReviews() {
    fetch('/get-all-reviews')
        .then(response => response.json())  // Parse the JSON from the response
        .then(data => {
            document.getElementById("incompleteSpinner").remove()
            const incompleteTable = document.getElementById('incompleteTable');

            let incompleteReviews = 0;

            // Check if there are any reviews
            data.forEach(review => {
                if (review.completed === "To-Complete" || review.completed ==="In-Progress") {
                    incompleteReviews += 1;
                }
            })

            if (data.length === 0 || incompleteReviews === 0) {
                incompleteTable.innerHTML = '<tr><td colspan="3" class="text-center">No reviews found</td></tr>';
                return;
            }

            // Iterate over each review and display it
            data.forEach(review => {

                // Format Deadline
                const deadlineDate = new Date(review.deadline);
                const formattedDeadline = deadlineDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });

                // Create a table row and cells
                let row;
                if (review.completed === "To-Complete" || review.completed ==="In-Progress") {
                    row = incompleteTable.insertRow();
                } 

                // If row created
                if (row) {
                    const moduleNameCell = row.insertCell(0);
                    const moduleLeadCell = row.insertCell(1);
                    const deadlineCell = row.insertCell(2);

                    moduleNameCell.textContent = review.moduleName;
                    moduleLeadCell.textContent = review.moduleLead;
                    deadlineCell.textContent = formattedDeadline;
                }
            });
        })
        .catch(error => {
            console.error('Error fetching reviews:', error);
        });
}
// Call the function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', dropdownOptionsExport);
document.addEventListener('DOMContentLoaded', dropdownOptionsEmail);
document.addEventListener('DOMContentLoaded', displayIncompleteReviews);
