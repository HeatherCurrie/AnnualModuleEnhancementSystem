function fetchAndDisplayReviews() {
    fetch('http://127.0.0.1:5000/get-user-reviews')
        .then(response => response.json())  // Parse the JSON from the response
        .then(data => {
            const toCompleteTable = document.getElementById('toCompleteTable').getElementsByTagName('tbody')[0];
            const inProgressTable = document.getElementById('inProgressTable').getElementsByTagName('tbody')[0];
            const completedTable = document.getElementById('completedTable').getElementsByTagName('tbody')[0];

            // Check if there are any reviews
            if (data.length === 0) {
                return;
            }

            // Iterate over each review and display it
            data.forEach(review => {
                // Format Deadline
                const deadlineDate = new Date(review.deadline);
                const formattedDeadline = deadlineDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });

                // Create a table row and cells
                let row;
                if (review.completed === 'To-Complete') {
                    row = toCompleteTable.insertRow();

                    // Allow row to be clicked + take to specific Feedback review by ID form                   
                    row.dataset.feedbackID = review.feedbackID; 
                    row.addEventListener('click', function() {
                    window.location.href = `reviewModule.html?FeedbackID=${this.dataset.feedbackID}`;
                    });
                } else if (review.completed === 'In-Progress') {
                    row = inProgressTable.insertRow();
                } else if (review.completed === 'Completed') {
                    row = completedTable.insertRow();
                }

                // If row created
                if (row) {
                    const moduleNameCell = row.insertCell(0);
                    const deadlineCell = row.insertCell(1);

                    moduleNameCell.textContent = review.moduleName;
                    deadlineCell.textContent = formattedDeadline;
                }
            });
        })
        .catch(error => {
            console.error('Error fetching reviews:', error);
            const toCompleteTable = document.getElementById('toCompleteTable').getElementsByTagName('tbody')[0];
            const inProgressTable = document.getElementById('inProgressTable').getElementsByTagName('tbody')[0];
            const completedTable = document.getElementById('completedTable').getElementsByTagName('tbody')[0];

            toCompleteTable.innerHTML = '<tr><td colspan="2">Error loading reviews.</td></tr>';
            inProgressTable.innerHTML = '<tr><td colspan="2">Error loading reviews.</td></tr>';
            completedTable.innerHTML = '<tr><td colspan="2">Error loading reviews.</td></tr>';
        });
}

// Call the function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', fetchAndDisplayReviews);