let firstNumber = '';
let operator = '';
let secondNumber = '';
let result = '';
let resetNextInput = false;

const displayElement = document.getElementById('calcDisplay');

function updateCalculator(input) {
  if (input === 'clear') {
    clearCalculator();
    return;
  }

  if (input === 'backspace') {
    handleBackspace();
    return;
  }

  if (isDigit(input)) {
    if (resetNextInput) {
      firstNumber = '';
      secondNumber = '';
      operator = '';
      result = '';
      resetNextInput = false;
    }

    let current = operator ? secondNumber : firstNumber;

    // Prevent multiple decimals
    if (input === '.' && current.includes('.')) return;

    current += input;

    if (!operator) {
      firstNumber = current;
      result = firstNumber;
    } else {
      secondNumber = current;
      result = secondNumber;
    }
  }

  else if (isOperator(input)) {
    if (!firstNumber) return;

    if (!secondNumber) {
      operator = input;
    } else {
      const computed = compute(parseFloat(firstNumber), operator, parseFloat(secondNumber));
      result = typeof computed === 'number' ? formatResult(computed).toString() : computed;
      firstNumber = result;
      secondNumber = '';
      operator = input;
      resetNextInput = true;
    }
  }

  else if (input === '=') {
    if (firstNumber && operator && secondNumber) {
      const computed = compute(parseFloat(firstNumber), operator, parseFloat(secondNumber));
      result = typeof computed === 'number' ? formatResult(computed).toString() : computed;
      firstNumber = result;
      secondNumber = '';
      operator = '';
      resetNextInput = true;
    }
  }

  updateDisplay();
}

function compute(num1, op, num2) {
  switch (op) {
    case '+': return num1 + num2;
    case '-': return num1 - num2;
    case '*': return num1 * num2;
    case '/': return num2 !== 0 ? num1 / num2 : "🤨 Can't divide by 0";
    default: return num1;
  }
}

function formatResult(num) {
  return parseFloat(num.toFixed(4));
}

function isDigit(char) {
  return /[0-9.]/.test(char);
}

function isOperator(char) {
  return ['+', '-', '*', '/'].includes(char);
}

function handleBackspace() {
  if (resetNextInput) return;
  if (secondNumber) {
    secondNumber = secondNumber.slice(0, -1);
    result = secondNumber || '0';
  } else if (operator) {
    operator = '';
  } else if (firstNumber) {
    firstNumber = firstNumber.slice(0, -1);
    result = firstNumber || '0';
  }
  updateDisplay();
}

function clearCalculator() {
  firstNumber = '';
  secondNumber = '';
  operator = '';
  result = '';
  resetNextInput = false;
  updateDisplay('0');
  localStorage.removeItem('calculation');
}

function updateDisplay(content = result) {
  displayElement.textContent = content || '0';
  localStorage.setItem('calculation', content);
}

// Restore last result if available
const storedCalc = localStorage.getItem('calculation');
if (storedCalc !== null) {
  result = storedCalc;
  firstNumber = result;
  updateDisplay();
}

// Attach event listeners to buttons
document.querySelectorAll('button[data-value]').forEach(button => {
  button.addEventListener('click', () => {
    const value = button.getAttribute('data-value');
    updateCalculator(value);
  });
});

// ✅ Keyboard support
document.addEventListener('keydown', (e) => {
  const key = e.key;

  if (/[0-9]/.test(key)) updateCalculator(key);
  else if (['+', '-', '*', '/'].includes(key)) updateCalculator(key);
  else if (key === 'Enter') updateCalculator('=');
  else if (key === 'Backspace') updateCalculator('backspace');
  else if (key === 'Escape') updateCalculator('clear');
  else if (key === '.') updateCalculator('.');
});
