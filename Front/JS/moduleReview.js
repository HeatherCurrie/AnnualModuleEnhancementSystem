function submitReview() {
    document.getElementById("reviewButton").innerHTML = '<i class="fa-solid fa-gear fa-spin" id="spinner"></i>'
    const urlParams = new URLSearchParams(window.location.search);
    const feedbackID = urlParams.get('FeedbackID');

    // Setting all form values
    let academicYearVal = document.getElementById("academicYear").value;
    let schoolVal = document.getElementById("school").value;
    let moduleLeadVal = document.getElementById("moduleLead").value;
    let studentInfoVal = document.getElementById("studentInfo").value;
    let moduleEvalVal = document.getElementById("moduleEval").value;
    let teachingEvalVal = document.getElementById("teachingEval").value;
    let inclusiveNatureVal = document.getElementById("inclusiveNature").value;
    let pastChangesVal = document.getElementById("pastChanges").value;
    let futureChangesVal = document.getElementById("futureChanges").value;
    let otherVal = document.getElementById("other").value;
    let authorVal = document.getElementById("author").value;
    let dateVal = document.getElementById("date").value;

    const data = {
        FeedbackID: feedbackID,
        academicYear: academicYearVal,
        school: schoolVal,
        moduleLead: moduleLeadVal,
        studentInfo: studentInfoVal,
        moduleEval: moduleEvalVal,
        teachingEval: teachingEvalVal,
        inclusiveNature: inclusiveNatureVal,
        pastChanges: pastChangesVal,
        futureChanges: futureChangesVal,
        other: otherVal,
        author: authorVal,
        date: dateVal
    };

    // ADD VALIDATION IN FUTURE

    // Send the data to the server using Fetch API
    fetch('http://127.0.0.1:5000/submit-review-endpoint', { 
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
        document.getElementById("reviewButton").innerHTML = 'Submit';
        window.location.href = 'lecturerDashboard.html';
        console.log('Success:', data); 
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}