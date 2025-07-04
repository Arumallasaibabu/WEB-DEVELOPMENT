document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('.button');
    const clearButton = document.getElementById('clear');
    const equalsButton = document.getElementById('equals');

    let currentInput = '0';
    let firstOperand = null;
    let operator = null;
    let waitingForSecondOperand = false;

    function updateDisplay() {
        display.textContent = currentInput;
    }

    function resetCalculator() {
        currentInput = '0';
        firstOperand = null;
        operator = null;
        waitingForSecondOperand = false;
        updateDisplay();
    }

    function handleNumberClick(number) {
        if (waitingForSecondOperand === true) {
            currentInput = number;
            waitingForSecondOperand = false;
        } else {
            currentInput = currentInput === '0' ? number : currentInput + number;
        }
        updateDisplay();
    }

    function handleDecimalClick(dot) {
        if (waitingForSecondOperand === true) {
            currentInput = '0.';
            waitingForSecondOperand = false;
            return;
        }
        if (!currentInput.includes(dot)) {
            currentInput += dot;
        }
        updateDisplay();
    }

    function handleOperatorClick(nextOperator) {
        const inputValue = parseFloat(currentInput);

        if (operator && waitingForSecondOperand) {
            operator = nextOperator;
            return;
        }

        if (firstOperand === null && !isNaN(inputValue)) {
            firstOperand = inputValue;
        } else if (operator) {
            const result = performCalculation[operator](firstOperand, inputValue);
            currentInput = String(result);
            firstOperand = result;
        }

        waitingForSecondOperand = true;
        operator = nextOperator;
        updateDisplay(); // To show the current firstOperand if needed, or clear for next input
    }

    const performCalculation = {
        '/': (first, second) => first / second,
        '*': (first, second) => first * second,
        '+': (first, second) => first + second,
        '-': (first, second) => first - second,
    };

    function handleEqualsClick() {
        if (firstOperand === null || operator === null) return;

        const inputValue = parseFloat(currentInput);
        if (isNaN(inputValue)) return; // Avoid calculation if currentInput is not a number

        const result = performCalculation[operator](firstOperand, inputValue);

        currentInput = String(result);
        firstOperand = null;
        operator = null;
        waitingForSecondOperand = false;
        updateDisplay();
    }

    // Event Listeners
    buttons.forEach(button => {
        button.addEventListener('click', (event) => {
            const target = event.target;

            if (target.classList.contains('number')) {
                handleNumberClick(target.dataset.number);
            } else if (target.classList.contains('operator')) {
                handleOperatorClick(target.dataset.operator);
            }
        });
    });

    clearButton.addEventListener('click', resetCalculator);
    equalsButton.addEventListener('click', handleEqualsClick);

    // Initialize display
    updateDisplay();
});