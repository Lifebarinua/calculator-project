let calculation = '';
  
function updateCalculator (number) {
if (number === '') {
  calculation = '';
  console.log('cleared');
} else if (number === '+'){
  calculation += '+';
} else if (number === '='){
  calculation = evaluateExpression(calculation).toString();   //this is used to replave calculation = eval(calculation);
} else {
calculation += number;
}
console.log(calculation);
}

function evaluateExpression(expr) {
  try {
    // Only allow digits, operators, and decimal points
    if (/^[\d+\-*/.() ]+$/.test(expr)) {
      // Create a new function that returns the evaluated result
      return new Function('return ' + expr)();
    } else {
      throw new Error('Invalid characters in expression.');
    }
  } catch (err) {
    console.error('Evaluation error:', err.message);
    return 'Error';
  }
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