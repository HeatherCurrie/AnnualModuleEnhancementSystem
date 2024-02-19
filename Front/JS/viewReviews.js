// GET AND DISPLAY REVIEWS
function fetchAndDisplayReviews() {
    fetch('http://127.0.0.1:5000/get-user-reviews')
        .then(response => response.json())  // Parse the JSON from the response
        .then(data => {
            const container = document.getElementById('reviews-container');
            
            // Check if there are any reviews
            if (data.length === 0) {
                container.innerHTML = '<p>No reviews found.</p>';
                return;
            }

            // Iterate over each review in the data and display it
            data.forEach(review => {
                // Format Deadline
                const deadlineDate = new Date(review.deadline);
                const formattedDeadline = deadlineDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
                
                // Display it
                console.log(formattedDeadline)
                const reviewElement = document.createElement('div');
                reviewElement.innerHTML = `
                    <h3>Module: ${review.school}</h3>
                    <p>Deadline: ${formattedDeadline}</p>
                `;
                container.appendChild(reviewElement);
            });
        })
        .catch(error => {
            console.error('Error fetching reviews:', error);
            document.getElementById('reviews-container').innerHTML = '<p>Error loading reviews.</p>';
        });
}

// Call the function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', fetchAndDisplayReviews);
