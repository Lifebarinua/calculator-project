let display = document.getElementById('calcDisplay');
let currentInput = '';
let shouldReset = false;

// Tokenize the input (split into numbers and operators)
function tokenize(expression) {
  return expression.match(/(\d+\.?\d*|\+|\-|\*|\/)/g);
}

// Perform one operation
function applyOperator(a, operator, b) {
  a = parseFloat(a);
  b = parseFloat(b);

  switch (operator) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return b === 0 ? 'Infinity: Division by zero' : a / b;
    default: return 'Invalid operator';
  }
}

// Evaluate tokens with correct precedence
function evaluateExpression(expression) {
  let tokens = tokenize(expression);
  if (!tokens) return "Invalid input";

  // Handle * and /
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === '*' || tokens[i] === '/') {
      const result = applyOperator(tokens[i - 1], tokens[i], tokens[i + 1]);
      tokens.splice(i - 1, 3, result.toString());
      i -= 1;
    }
  }

  // Handle + and -
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === '+' || tokens[i] === '-') {
      const result = applyOperator(tokens[i - 1], tokens[i], tokens[i + 1]);
      tokens.splice(i - 1, 3, result.toString());
      i -= 1;
    }
  }

  return tokens[0];
}

// Handle button clicks
document.querySelectorAll('.calcu, .sign').forEach(button => {
  button.addEventListener('click', () => {
    const value = button.getAttribute('data-value');

    // Clear display after = if a digit is pressed
    if (shouldReset && /[0-9.]/.test(value)) {
      currentInput = '';
      shouldReset = false;
    }

    if (value === 'clear') {
      currentInput = '';
      display.textContent = '0';
      shouldReset = false;
    } else if (value === 'backspace') {
      currentInput = currentInput.slice(0, -1);
      display.textContent = currentInput || '0';
    } else if (value === '=') {
      const result = evaluateExpression(currentInput);
      display.textContent = result;
      currentInput = result.toString();
      shouldReset = true;
    } else {
      currentInput += value;
      display.textContent = currentInput;
      shouldReset = false;
    }
  });
});
