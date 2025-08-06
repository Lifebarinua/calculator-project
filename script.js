let firstNumber = '';
let operator = '';
let secondNumber = '';
let result = '';

const displayElement = document.getElementById('calcDisplay');

function updateCalculator(input) {
  if (input === '') {
    clearCalculator();
    return;
  }

  if (isDigit(input)) {
    if (!operator) {
      firstNumber += input;
      result = firstNumber;
    } else {
      secondNumber += input;
      result = secondNumber;
    }
  } else if (isOperator(input)) {
    if (firstNumber && secondNumber) {
      // Evaluate previous pair
      const computed = compute(parseFloat(firstNumber), operator, parseFloat(secondNumber));
      firstNumber = computed.toString();
      secondNumber = '';
      result = firstNumber;
    }
    operator = input;
  } else if (input === '=') {
    if (firstNumber && operator && secondNumber) {
      const computed = compute(parseFloat(firstNumber), operator, parseFloat(secondNumber));
      result = computed.toString();
      firstNumber = result;
      secondNumber = '';
      operator = '';
    }
  }

  updateDisplay();
}

function compute(num1, op, num2) {
  switch (op) {
    case '+': return num1 + num2;
    case '-': return num1 - num2;
    case '*': return num1 * num2;
    case '/': return num2 !== 0 ? num1 / num2 : 'Error';
    default: return num1;
  }
}

function isDigit(char) {
  return /[0-9.]/.test(char);
}

function isOperator(char) {
  return ['+', '-', '*', '/'].includes(char);
}

function clearCalculator() {
  firstNumber = '';
  operator = '';
  secondNumber = '';
  result = '';
  updateDisplay();
}

function updateDisplay() {
  displayElement.textContent = result || '0';
  localStorage.setItem('calculation', result);
}

// Restore on load
const storedCalc = localStorage.getItem('calculation');
if (storedCalc !== null) {
  result = storedCalc;
  firstNumber = result;
  updateDisplay();
}
