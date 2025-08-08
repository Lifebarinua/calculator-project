document.addEventListener('DOMContentLoaded', () => {
  const display = document.getElementById('calcDisplay');
  if (!display) {
    console.error('No element with id="calcDisplay" found.');
    return;
  }

  let currentInput = '';
  let shouldReset = false;

  // Tokenizer: supports decimals and parentheses, converts leading unary - into 0-
  function tokenize(expression) {
    if (typeof expression !== 'string') return null;
    expression = expression.replace(/\s+/g, '');
    expression = expression.replace(/^\-/, '0-').replace(/\(\-/g, '(0-');
    return expression.match(/(\d+(\.\d+)?|[+\-*/()])/g);
  }

  function applyOperator(a, operator, b) {
    const na = parseFloat(a);
    const nb = parseFloat(b);
    if (Number.isNaN(na) || Number.isNaN(nb)) return 'Invalid operands';
    switch (operator) {
      case '+': return na + nb;
      case '-': return na - nb;
      case '*': return na * nb;
      case '/': return nb === 0 ? 'Division by zero' : na / nb;
      default: return 'Invalid operator';
    }
  }

  // Evaluate an array of tokens (no parentheses). Handles precedence.
  function evaluateTokens(tokens) {
    if (!Array.isArray(tokens) || tokens.length === 0) return 'Invalid input';

    const precedence = [['*', '/'], ['+', '-']];

    for (const level of precedence) {
      let i = 0;
      while (i < tokens.length) {
        if (level.includes(tokens[i])) {
          const res = applyOperator(tokens[i - 1], tokens[i], tokens[i + 1]);
          if (typeof res === 'string' && isNaN(parseFloat(res))) return res; // propagate error
          tokens.splice(i - 1, 3, String(res));
          i = Math.max(0, i - 1);
        } else {
          i++;
        }
      }
    }

    return tokens.length === 1 ? tokens[0] : 'Invalid expression';
  }

  // Full evaluator: handles parentheses recursively
  function evaluateExpression(expression) {
    let tokens = tokenize(expression);
    if (!tokens) return 'Invalid input';

    // Resolve parentheses innermost-first
    while (tokens.includes('(')) {
      let openIndex = -1;
      for (let i = 0; i < tokens.length; i++) {
        if (tokens[i] === '(') openIndex = i;
        else if (tokens[i] === ')') {
          if (openIndex === -1) return 'Mismatched parentheses';
          const innerTokens = tokens.slice(openIndex + 1, i);
          const innerVal = evaluateTokens(innerTokens);
          if (typeof innerVal === 'string' && isNaN(parseFloat(innerVal))) return innerVal;
          tokens.splice(openIndex, i - openIndex + 1, String(innerVal));
          break;
        }
      }
      // safety: if we scanned and didn't find a closing ), it's mismatched
      if (!tokens.includes(')') && tokens.includes('(') && !tokens.includes(')')) return 'Mismatched parentheses';
    }

    return evaluateTokens(tokens);
  }

  // avoid form submits: force all buttons to be type="button"
  document.querySelectorAll('button').forEach(btn => {
    if (!btn.hasAttribute('type')) btn.type = 'button';
  });

  const buttons = document.querySelectorAll('.calcu, .sign');
  if (!buttons.length) {
    console.warn('No buttons matched selectors ".calcu, .sign". Check your HTML classes/data-value attributes.');
  }

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      // prefer data-value, fallback to dataset or button text
      const value = button.getAttribute('data-value') ?? button.dataset.value ?? button.value ?? button.textContent.trim();
      console.log('Calculator button clicked:', value);

      // if last action was = and user starts typing a number, reset
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
        display.textContent = String(result);
        currentInput = String(result);
        shouldReset = true;
      } else {
        currentInput += value;
        display.textContent = currentInput || '0';
        shouldReset = false;
      }
    });
  });
});
