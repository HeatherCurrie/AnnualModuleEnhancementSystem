// Get dropdown options for delegation
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


// When user clicks delegate button
function delegate() {
    document.getElementById("delegateButton").innerHTML = '<i class="fa-solid fa-gear fa-spin" id="spinner"></i>'
    const select = document.getElementById("delegationDropdown");
    const selectedVal = Array.from(select.selectedOptions).map(option => option.value);
    let deadlineVal = document.getElementById("deadline").value;
        
    const data = {
        moduleID: selectedVal,
        deadline: deadlineVal
    };
        
    // Send the data to the server using Fetch API
    
    fetch('/delegate-reviews', { 
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
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}


// Display all modules in database in table
function displayModules() {
    fetch('/get-modules')
    .then(response => response.json())
    .then(data => {
        document.getElementById("moduleSpinner").remove()
        const moduleTable = document.getElementById('moduleTable');

        data.forEach((module, i) => {

            // Create a table row and cells
            let row;
            row = moduleTable.insertRow();

            // If row created
            if (row) {
                // Creating edit button
                var editButton = document.createElement("button");
                editButton.setAttribute("id", "editButton");
                editButton.setAttribute("type", "button");
                editButton.classList.add("btn", "dundeeBlue", "text-white"); 
                editButton.textContent = "Edit Row";
                editButton.dataset.rowIndex = i;
                editButton.dataset.moduleID = module.moduleID;
                editButton.addEventListener('click', editRow); 

                // Creating delete button
                var deleteButton = document.createElement("button");
                deleteButton.setAttribute("id", "deleteButton");
                deleteButton.setAttribute("type", "button");
                deleteButton.classList.add("btn", "dundeeBlue", "text-white", "ms-3"); 
                deleteButton.textContent = "Delete Row";
                deleteButton.dataset.rowIndex = i;
                deleteButton.dataset.moduleID = module.moduleID;
                deleteButton.addEventListener('click', deleteRow); 

                const moduleCodeCell = row.insertCell(0);
                const moduleNameCell = row.insertCell(1);
                const moduleLeadCell = row.insertCell(2);
                const creditsCell = row.insertCell(3);
                const actionCell = row.insertCell(4);

                moduleCodeCell.textContent = module.moduleCode;
                moduleNameCell.textContent = module.moduleName;
                moduleLeadCell.textContent = module.moduleLead;
                creditsCell.textContent = module.credits;
                actionCell.appendChild(editButton);
                actionCell.appendChild(deleteButton);
            }
        });
    })
    .catch(error => console.error('Error fetching options:', error));
}


// When add button clicked
function addModule() {
    document.getElementById("addModuleButton").innerHTML = '<i class="fa-solid fa-gear fa-spin" id="spinner"></i>'
    
    let moduleCodeVal = document.getElementById("moduleCode").value;
    let moduleNameVal = document.getElementById("moduleName").value;
    let moduleLeadVal = document.getElementById("moduleLead").value;
    let creditsVal = parseInt(document.getElementById('credits').value);
        
    const data = {
        moduleCode: moduleCodeVal,
        moduleName: moduleNameVal,
        moduleLead: moduleLeadVal,
        credits: creditsVal
    };
        
    // Send the data to the server using Fetch API
    fetch('/add-module', { 
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
        window.location.href = administrationURL;
        console.log('Success:', data); 
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}


// CALLED WHEN EDIT ROW IS CLICKED
function editRow(event) {
    const editButton = event.target;
    let rowIndex = editButton.dataset.rowIndex;
    const row = editButton.closest("tr");
  
    // Go through column except 1 with button
    const cells = row.querySelectorAll('td:not(:last-child)');
    cells.forEach((cell, index) => {
        // Store the current text
        const currentText = cell.innerText;
  
        // Add input element
        cell.innerHTML = '';
        const input = document.createElement("input");
        input.classList.add("form-control");
  
        // Set name for each field
        switch (index) {
            case 0: 
                input.name = 'moduleCode'; break;
            case 1: 
                input.name = 'moduleName'; break;
            case 2: 
                input.name = 'moduleLead'; break;
            case 3: 
                input.name = 'credits'; break;
        }

        // Set the input's value to the text and add it to the cell
        input.value = currentText;
        cell.appendChild(input);
    });
  
    editButton.textContent = "Save Row";
    editButton.removeEventListener('click', editRow);
    editButton.addEventListener('click', saveRow);
}


// Save row in table once edited
function saveRow(event) {
    const button = event.target;
    const row = button.closest('tr');
    const moduleIDVal = button.dataset.moduleID;
    const inputs = row.querySelectorAll('input');
    let data = {moduleID: moduleIDVal};

    // Set data
    inputs.forEach((input, index) => {
        data[input.name] = input.value;
    });

    fetch('/update-module-row', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        window.location.href = administrationURL;
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}


// Function to delete a row from the table
function deleteRow(event) {
    const button = event.target;
    const moduleIDVal = button.dataset.moduleID;
  
    const data = {
        moduleID: moduleIDVal,
    };

    fetch('/delete-module-row', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        window.location.href = administrationURL;
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}


// Call the function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', displayModules);
document.addEventListener('DOMContentLoaded', dropdownOptions);