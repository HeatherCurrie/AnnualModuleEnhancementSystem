function displayModules() {
    fetch('http://127.0.0.1:5000/get-modules')
    .then(response => response.json())
    .then(data => {
        document.getElementById("moduleSpinner").remove()
        const moduleTable = document.getElementById('moduleTable');

        data.forEach(module => {

            // Create a table row and cells
            let row;
            row = moduleTable.insertRow();

            // If row created
            if (row) {
                const moduleNameCell = row.insertCell(0);
                const moduleLeadCell = row.insertCell(1);

                moduleNameCell.textContent = module.moduleName;
                moduleLeadCell.textContent = module.moduleLead;
            }
        });
    })
    .catch(error => console.error('Error fetching options:', error));
}

function dropdownOptions() {
    fetch('http://127.0.0.1:5000/get-modules')
    .then(response => response.json())
    .then(data => {
        const select = document.getElementById('delegationDropdown');

        data.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option.moduleID;
            opt.textContent = option.moduleName; 
            select.appendChild(opt);
        });
    })
    .catch(error => console.error('Error fetching options:', error));
}

function delegate() {
    document.getElementById("delegateButton").innerHTML = '<i class="fa-solid fa-gear fa-spin" id="spinner"></i>'
    const select = document.getElementById("delegationDropdown");
    const selectedVal = Array.from(select.selectedOptions).map(option => option.value);
    let deadlineVal = document.getElementById("deadline").value;
        
    const data = {
        moduleID: selectedVal,
        deadline: deadlineVal
    };
    console.log(data)
        
    // Send the data to the server using Fetch API
    
    fetch('http://127.0.0.1:5000/delegate-reviews', { 
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
        //window.location.href = 'adminDashboard.html';
        console.log('Success:', data); 
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function addModule() {
    document.getElementById("addModuleButton").innerHTML = '<i class="fa-solid fa-gear fa-spin" id="spinner"></i>'
}


// Call the function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', displayModules);
document.addEventListener('DOMContentLoaded', dropdownOptions);