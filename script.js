// Step 1: Tokenize the input (turn string into array of numbers and operators)
function tokenize(expression) {
  return expression.match(/(\d+\.?\d*|\+|\-|\*|\/)/g);
}

// Step 2: Perform one operation
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

// Step 3: Evaluate tokens with correct precedence
function evaluateExpression(expression) {
  let tokens = tokenize(expression);

  if (!tokens) return "Invalid input";

  // First pass: handle * and /
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === '*' || tokens[i] === '/') {
      const result = applyOperator(tokens[i - 1], tokens[i], tokens[i + 1]);
      tokens.splice(i - 1, 3, result.toString()); // Replace 3 tokens with result
      i -= 1; // Step back to check again
    }
  }

  // Second pass: handle + and -
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === '+' || tokens[i] === '-') {
      const result = applyOperator(tokens[i - 1], tokens[i], tokens[i + 1]);
      tokens.splice(i - 1, 3, result.toString());
      i -= 1;
    }
  }

  return tokens[0]; // Final result
}

// Example usage:
const input = "3 + 5 - 2 * 4";      // Should give: 3 + 5 - 8 = 0
console.log("Expression:", input);
console.log("Result:", evaluateExpression(input));


// ---- NEW: Add event listeners to buttons ----

const display = document.getElementById("calcDisplay");
let currentInput = ""; // Stores the expression string

// Handle button clicks
document.querySelectorAll("button").forEach(button => {
  button.addEventListener("click", () => {
    const value = button.getAttribute("data-value");

    if (value === "clear") {
      currentInput = "";
      display.textContent = "0";
    } else if (value === "backspace") {
      currentInput = currentInput.slice(0, -1);
      display.textContent = currentInput || "0";
    } else if (value === "=") {
      const result = evaluateExpression(currentInput);
      display.textContent = result;
      currentInput = result.toString(); // so user can continue calculating
    } else {
      currentInput += value;
      display.textContent = currentInput;
    }
  });
});