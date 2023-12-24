let display = document.getElementById('display');
let currentInput = '';

function appendInput(value) {
    currentInput += value;
    display.textContent = currentInput;
}

function clearDisplay() {
    currentInput = '';
    display.textContent = '0';
}

function calculateResult() {
    try {
        currentInput = eval(currentInput).toString();
        display.textContent = currentInput;
    } catch (error) {
        display.textContent = 'Error';
    }
}



        window.addEventListener('storage', handleStorageChange);



function handleStorageChange(event) {
  localStorage.setItem('CloseFEN', 'CLOSEOPASOK');




  if (event.key === 'Boot') {
    // La valeur de Theme a changé, vous pouvez effectuer votre action ici

// Actualiser la page
location.reload();

  }
}