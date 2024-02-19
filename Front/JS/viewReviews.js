// GET AND DISPLAY REVIEWS
function fetchAndDisplayReviews() {
    fetch('http://127.0.0.1:5000/get-user-reviews')
        .then(response => response.json())  // Parse the JSON from the response
        .then(data => {
            const table = document.getElementById('reviewsTable');
            
            // Check if there are any reviews
            if (data.length === 0) {
                table.innerHTML += '<tr><td colspan="2">No reviews found.</td></tr>';
                return;
            }

            // Iterate over each review in the data and display it
            data.forEach(review => {
                // Format Deadline
                const deadlineDate = new Date(review.deadline);
                const formattedDeadline = deadlineDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });

                // Create a table row and cells
                const row = table.insertRow(-1); // Insert a row at the end of the table
                const moduleNameCell = row.insertCell(0); // Insert the first cell (module name)
                const deadlineCell = row.insertCell(1); // Insert the second cell (deadline)

                // Assign the text content for each cell
                moduleNameCell.textContent = review.moduleName;
                deadlineCell.textContent = formattedDeadline;
            });
        })
        .catch(error => {
            console.error('Error fetching reviews:', error);
            document.getElementById('reviewsTable').innerHTML += '<tr><td colspan="2">Error loading reviews.</td></tr>';
        });
}

// Call the function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', fetchAndDisplayReviews);
