function dropdownOptions() {
    fetch('http://127.0.0.1:5000/get-all-reviews')
    .then(response => response.json())
    .then(data => {
        const select = document.getElementById('feedbackDropdown');

        data.forEach(option => {
            if (option.completed === "Completed"){
                const opt = document.createElement('option');
                opt.value = option.feedbackID;
                opt.textContent = option.moduleName; 
                select.appendChild(opt);
            }
        });
    })
    .catch(error => console.error('Error fetching options:', error));
}

function exportWord() {
    document.getElementById("exportButton").innerHTML = '<i class="fa-solid fa-gear fa-spin" id="spinner"></i>'
    const select = document.getElementById("feedbackDropdown");
    const selectedVal = Array.from(select.selectedOptions).map(option => option.value);
        
    const data = {
        feedbackID: selectedVal
    };
        
    // Send the data to the server using Fetch API
    fetch('http://127.0.0.1:5000/export-word', { 
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
        //window.location.href = 'management.html';
        console.log('Success:', data); 
    })
    .catch((error) => {
        console.error('Error:', error);
        document.getElementById("exportButton").innerHTML = 'Export Failed'; // Inform the user
    });
}

function displayIncompleteReviews() {
    fetch('http://127.0.0.1:5000/get-all-reviews')
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
document.addEventListener('DOMContentLoaded', dropdownOptions);
document.addEventListener('DOMContentLoaded', displayIncompleteReviews);
