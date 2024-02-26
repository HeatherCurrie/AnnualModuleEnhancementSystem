function displayIncompleteReviews() {
    fetch('http://127.0.0.1:5000/get-all-reviews')
        .then(response => response.json())  // Parse the JSON from the response
        .then(data => {
            document.getElementById("incompleteSpinner").remove()
            const incompleteTable = document.getElementById('incompleteTable');

            // Check if there are any reviews
            if (data.length === 0) {
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
                if (review.completed === 'To-Complete' || review.completed ==='In-Progress') {
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
document.addEventListener('DOMContentLoaded', displayIncompleteReviews);
