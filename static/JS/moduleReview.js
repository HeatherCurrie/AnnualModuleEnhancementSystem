// WHEN SUBMIT BUTTON CLICKED 
function submitReview() {
    document.getElementById("reviewButton").innerHTML = '<i class="fa-solid fa-gear fa-spin" id="spinner"></i>'
    const urlParams = new URLSearchParams(window.location.search);
    const feedbackID = urlParams.get('FeedbackID');

    // Setting all form values
    let academicYearVal = document.getElementById("academicYear").value;
    let schoolVal = document.getElementById("school").value;
    let studentInfoVal = document.getElementById("studentInfo").value;
    let moduleEvalVal = document.getElementById("moduleEval").value;
    let teachingEvalVal = document.getElementById("teachingEval").value;
    let inclusiveNatureVal = document.getElementById("inclusiveNature").value;
    let pastChangesVal = document.getElementById("pastChanges").value;
    let futureChangesVal = document.getElementById("futureChanges").value;
    let otherVal = document.getElementById("other").value;
    let authorVal = document.getElementById("firstName").value + " " + document.getElementById("lastName").value;
    let dateVal = document.getElementById("date").value;

    const data = {
        FeedbackID: feedbackID,
        academicYear: academicYearVal,
        school: schoolVal,
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

    // Ensure all values have been filled out
    let hasNull = false;
    for (let key in data) {
        // Exception for other as that is an optional field
        if (key === "other") continue;

        if (!data[key]) {
            hasNull = true;
            break; // Stop once found a null
        }
    }   

    if (hasNull) {
        document.getElementById("reviewButton").innerHTML = 'Submit';
        alert("Please fill in all required fields.");

    } else {
        // Send the data to the server using Fetch API
        fetch('/submit-review-endpoint', { 
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
            window.location.href = lecturerDashURL;
            console.log('Success:', data); 
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
}


// WHEN SAVE BUTTON CLICKED
function saveReview() {
    document.getElementById("saveButton").innerHTML = '<i class="fa-solid fa-gear fa-spin" id="spinner"></i>'
    const urlParams = new URLSearchParams(window.location.search);
    const feedbackID = urlParams.get('FeedbackID');

    // Setting all form values
    let academicYearVal = document.getElementById("academicYear").value;
    let schoolVal = document.getElementById("school").value;
    let studentInfoVal = document.getElementById("studentInfo").value;
    let moduleEvalVal = document.getElementById("moduleEval").value;
    let teachingEvalVal = document.getElementById("teachingEval").value;
    let inclusiveNatureVal = document.getElementById("inclusiveNature").value;
    let pastChangesVal = document.getElementById("pastChanges").value;
    let futureChangesVal = document.getElementById("futureChanges").value;
    let otherVal = document.getElementById("other").value;
    let authorVal = document.getElementById("firstName").value + " " + document.getElementById("lastName").value;
    let dateVal = document.getElementById("date").value;

    const data = {
        FeedbackID: feedbackID,
        academicYear: academicYearVal,
        school: schoolVal,
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

    console.log(data);

    // Send the data to the server using Fetch API
    fetch('/save-review-endpoint', { 
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
        document.getElementById("saveButton").innerHTML = 'Saved';
        window.location.href = lecturerDashURL;
        console.log('Success:', data); 
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}