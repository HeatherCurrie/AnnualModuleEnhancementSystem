document.addEventListener('DOMContentLoaded', function() {
    var review = {/* ... your review data ... */};
    var selectElement = document.getElementById('academicYear');
    selectElement.value = review.AcademicYear; // Assuming review.AcademicYear has the value like '22/23'
});
