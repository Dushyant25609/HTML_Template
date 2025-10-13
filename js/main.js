document.getElementById("updateDate").textContent = new Date().toLocaleDateString();

// Load data from JSON file
async function loadDataFromJSON() {
  try {
    const response = await fetch('./js/equity_dashboard_data.json');
    const data = await response.json();
    
    // Set the global data
    window.headerData = data.headers;
    window.factorsData = data.factors;
    
    // Update headers in the DOM
    const headers = document.querySelectorAll('th:not(.text-xs)');
    if (headers[0]) headers[0].textContent = window.headerData.factorHeader;
    if (headers[1]) headers[1].textContent = window.headerData.implicationHeader;
    if (headers[2]) headers[2].textContent = window.headerData.cioViewHeader;
    
    // Generate table with loaded data
    const tbody = document.getElementById("factors-body");
    tbody.innerHTML = window.factorsData.map(window.createFactorRow).join("");
    
    // Initialize editable functionality
    makeEditable();
    
    console.log('Data loaded from JSON file');
  } catch (error) {
    console.error('Error loading JSON data:', error);
    // Fallback to original data if JSON file not found
    initializeWithFallbackData();
  }
}

// Fallback initialization
function initializeWithFallbackData() {
  // Initialize with default header data
  window.headerData = {
    factorHeader: "Factor",
    implicationHeader: "Implication for Equities", 
    cioViewHeader: "CIO View"
  };
  
  // Initialize with minimal fallback data if factorsData doesn't exist
  if (!window.factorsData) {
    window.factorsData = [
      {
        factor: "Sample Factor",
        implication: "Neutral",
        trend: "neutral",
        value: 50,
        cioView: "Please load data from JSON file or import your data."
      }
    ];
  }
  
  // Generate table with existing data
  const tbody = document.getElementById("factors-body");
  tbody.innerHTML = window.factorsData.map(window.createFactorRow).join("");
  
  // Initialize editable functionality
  makeEditable();
}

// Store original header values for reference
window.headerData = {
  factorHeader: "Factor",
  implicationHeader: "Implication for Equities", 
  cioViewHeader: "CIO View"
};

// Add editable functionality to all headers and data cells
function makeEditable() {
  // Make specific header cells editable (excluding the sub-header with alignment labels)
  const editableHeaders = document.querySelectorAll('th:not(.text-xs)');
  editableHeaders.forEach((cell, index) => {
    cell.addEventListener('dblclick', function() {
      if (this.querySelector('input')) return; // Already editing
      
      const originalText = this.textContent.trim();
      const input = document.createElement('input');
      input.type = 'text';
      input.value = originalText;
      input.style.width = '100%';
      input.style.border = 'none';
      input.style.background = 'transparent';
      input.style.fontSize = 'inherit';
      input.style.fontWeight = 'inherit';
      input.style.textAlign = 'inherit';
      input.style.padding = '4px';
      
      this.innerHTML = '';
      this.appendChild(input);
      input.focus();
      input.select();
      
      const saveEdit = () => {
        const newValue = input.value || originalText;
        this.textContent = newValue;
        
        // Update header data based on column position
        if (index === 0) {
          window.headerData.factorHeader = newValue;
        } else if (index === 1) {
          window.headerData.implicationHeader = newValue;
        } else if (index === 2) {
          window.headerData.cioViewHeader = newValue;
        }
        
        // Save to localStorage
        saveDataToStorage();
      };
      
      input.addEventListener('blur', saveEdit);
      input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          saveEdit();
        }
        if (e.key === 'Escape') {
          this.textContent = originalText;
        }
      });
    });
  });
  
  // Make data cells editable (excluding range slider column)
  const dataCells = document.querySelectorAll('tbody td:first-child, tbody td:last-child');
  dataCells.forEach((cell, index) => {
    cell.addEventListener('dblclick', function() {
      if (this.querySelector('input')) return; // Already editing
      
      const originalText = this.textContent.trim();
      const input = document.createElement('input');
      input.type = 'text';
      input.value = originalText;
      input.style.width = '100%';
      input.style.border = 'none';
      input.style.background = 'transparent';
      input.style.fontSize = 'inherit';
      input.style.fontWeight = 'inherit';
      input.style.textAlign = 'inherit';
      input.style.padding = '4px';
      
      this.innerHTML = '';
      this.appendChild(input);
      input.focus();
      input.select();
      
      const saveEdit = () => {
        const newValue = input.value || originalText;
        this.textContent = newValue;
        
        // Update the data array if this is a factor or CIO view cell
        const row = this.parentElement;
        const rowIndex = Array.from(row.parentElement.children).indexOf(row);
        
        if (this === row.firstElementChild) {
          // Factor column
          window.factorsData[rowIndex].factor = newValue;
        } else if (this === row.lastElementChild) {
          // CIO View column
          window.factorsData[rowIndex].cioView = newValue;
        }
        
        // Save to localStorage
        saveDataToStorage();
      };
      
      input.addEventListener('blur', saveEdit);
      input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          saveEdit();
        }
        if (e.key === 'Escape') {
          this.textContent = originalText;
        }
      });
    });
  });
}

// Initialize editable functionality
makeEditable();

// Functions to save and load data
async function saveDataToJSON() {
  const allData = {
    headers: window.headerData,
    factors: window.factorsData,
    lastModified: new Date().toISOString()
  };
  
  // Save to localStorage as backup
  localStorage.setItem('equityDashboardData', JSON.stringify(allData, null, 2));
  
  // For security reasons, browsers don't allow direct file writing
  // Instead, we'll provide export functionality and show notification
  console.log('Data updated in memory and localStorage');
  showSaveNotification();
}

function showSaveNotification() {
  // Create notification element
  const notification = document.createElement('div');
  notification.textContent = 'Data updated! Use Export to save changes to file.';
  notification.style.cssText = `
    position: fixed;
    top: 60px;
    right: 10px;
    background: #28a745;
    color: white;
    padding: 10px 15px;
    border-radius: 4px;
    z-index: 1001;
    font-size: 14px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  `;
  
  document.body.appendChild(notification);
  
  // Remove notification after 3 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 3000);
}

function saveDataToStorage() {
  saveDataToJSON();
}

function loadDataFromStorage() {
  // First try to load from localStorage (for session persistence)
  const savedData = localStorage.getItem('equityDashboardData');
  if (savedData) {
    try {
      const parsedData = JSON.parse(savedData);
      if (parsedData.headers) {
        window.headerData = parsedData.headers;
        // Update headers in the DOM
        const headers = document.querySelectorAll('th:not(.text-xs)');
        if (headers[0]) headers[0].textContent = window.headerData.factorHeader;
        if (headers[1]) headers[1].textContent = window.headerData.implicationHeader;
        if (headers[2]) headers[2].textContent = window.headerData.cioViewHeader;
      }
      if (parsedData.factors) {
        window.factorsData = parsedData.factors;
        // Regenerate table with updated data
        const tbody = document.getElementById("factors-body");
        tbody.innerHTML = window.factorsData.map(window.createFactorRow).join("");
        // Re-initialize editable functionality for new elements
        makeEditable();
      }
      console.log('Data loaded from localStorage');
      return true;
    } catch (e) {
      console.error('Error loading data from localStorage:', e);
    }
  }
  return false;
}

function exportDataAsJSON() {
  const allData = {
    headers: window.headerData,
    factors: window.factorsData,
    exportDate: new Date().toISOString()
  };
  
  const dataStr = JSON.stringify(allData, null, 2);
  const dataBlob = new Blob([dataStr], {type: 'application/json'});
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'equity_dashboard_data.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  console.log('Data exported as JSON file');
  
  // Show instructions for updating the file
  alert('Data exported! To update the application:\n1. Replace the existing equity_dashboard_data.json file\n2. Refresh the page to load the new data');
}

function importDataFromJSON(file) {
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const importedData = JSON.parse(e.target.result);
      if (importedData.headers && importedData.factors) {
        window.headerData = importedData.headers;
        window.factorsData = importedData.factors;
        
        // Update the display
        loadDataFromStorage();
        saveDataToStorage();
        
        console.log('Data imported successfully');
        alert('Data imported successfully!');
      } else {
        throw new Error('Invalid data format');
      }
    } catch (error) {
      console.error('Error importing data:', error);
      alert('Error importing data. Please check the file format.');
    }
  };
  reader.readAsText(file);
}

// Initialize the application
async function initializeApp() {
  // Try to load saved data from localStorage first
  if (!loadDataFromStorage()) {
    // If no localStorage data, load from JSON file
    await loadDataFromJSON();
  }
}

// Load data when page loads
window.addEventListener('load', initializeApp);
