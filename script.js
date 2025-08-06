let calculation = '';
  
function updateCalculator (number) {
if (number === '') {
  calculation = '';
  console.log('cleared');
} else if (number === '+'){
  calculation += '+';
} else if (number === '='){
calculation = eval (calculation);
} else {
calculation += number;
}
console.log(calculation);
}


const displayElement = document.getElementById('calcDisplay');

// Override console.log to also update display and localStorage
const originalLog = console.log;
console.log = function (message) {
originalLog(message); // keep original behavior
displayElement.textContent =  calculation;
localStorage.setItem('calculation', calculation);
};

// On page load, load from localStorage if it exists
const storedCalc = localStorage.getItem('calculation');
if (storedCalc !== null) {
calculation = storedCalc;
displayElement.textContent =  calculation;
}