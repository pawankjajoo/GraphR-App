/**
 * GraphR Calculator Module
 * Advanced calculator supporting Basic, Scientific, and Graphing modes
 */

class CalculatorModule {
  constructor() {
    this.display = '0';
    this.previousValue = 0;
    this.operation = null;
    this.shouldResetDisplay = false;
    this.history = [];
    this.mode = 'basic';

    this.basicButtons = [
      ['7', '8', '9', '/'],
      ['4', '5', '6', '*'],
      ['1', '2', '3', '-'],
      ['0', '.', '=', '+'],
    ];

    this.scientificButtons = [
      ['sin', 'cos', 'tan', '/'],
      ['ln', 'log', '^', '*'],
      ['(', ')', 'π', '-'],
      ['√', '!', '=', '+'],
    ];
  }

  initializeBasicMode() {
    this.mode = 'basic';
    this.renderButtons(this.basicButtons);
    this.attachEventListeners();
  }

  initializeScientificMode() {
    this.mode = 'scientific';
    this.renderButtons(this.scientificButtons);
    this.attachEventListeners();
  }

  renderButtons(buttonLayout) {
    const buttonsContainer = document.getElementById('calcButtons');
    buttonsContainer.innerHTML = '';
    buttonsContainer.style.gridTemplateColumns = 'repeat(4, 1fr)';

    buttonLayout.forEach(row => {
      row.forEach(label => {
        const btn = document.createElement('button');
        btn.className = 'calc-btn';
        btn.textContent = label;

        if (['+', '-', '*', '/', '^'].includes(label)) {
          btn.classList.add('operator');
        } else if (label === '=') {
          btn.classList.add('equals');
        } else if (['C', 'AC'].includes(label)) {
          btn.classList.add('clear');
        }

        btn.addEventListener('click', () => this.handleButtonClick(label));
        buttonsContainer.appendChild(btn);
      });
    });

    // Add Clear button
    const clearBtn = document.createElement('button');
    clearBtn.className = 'calc-btn clear';
    clearBtn.textContent = 'C';
    clearBtn.addEventListener('click', () => this.clear());
    buttonsContainer.appendChild(clearBtn);
  }

  handleButtonClick(value) {
    if (['+', '-', '*', '/', '^'].includes(value)) {
      this.setOperation(value);
    } else if (value === '=') {
      this.calculate();
    } else if (value === 'C') {
      this.clear();
    } else if (value === '.') {
      this.addDecimal();
    } else if (this.mode === 'scientific' && ['sin', 'cos', 'tan', 'ln', 'log', 'π', '√', '!', '(', ')'].includes(value)) {
      this.handleScientificFunction(value);
    } else {
      this.appendNumber(value);
    }

    this.updateDisplay();
  }

  appendNumber(num) {
    if (this.shouldResetDisplay) {
      this.display = String(num);
      this.shouldResetDisplay = false;
    } else {
      if (this.display === '0') {
        this.display = String(num);
      } else {
        this.display += String(num);
      }
    }
  }

  addDecimal() {
    if (this.shouldResetDisplay) {
      this.display = '0.';
      this.shouldResetDisplay = false;
    } else if (!this.display.includes('.')) {
      this.display += '.';
    }
  }

  setOperation(op) {
    if (this.operation !== null) {
      this.calculate();
    }
    this.previousValue = parseFloat(this.display);
    this.operation = op;
    this.shouldResetDisplay = true;
  }

  calculate() {
    if (this.operation === null) return;

    const currentValue = parseFloat(this.display);
    let result = 0;

    switch (this.operation) {
      case '+':
        result = this.previousValue + currentValue;
        break;
      case '-':
        result = this.previousValue - currentValue;
        break;
      case '*':
        result = this.previousValue * currentValue;
        break;
      case '/':
        result = this.previousValue / currentValue;
        break;
      case '^':
        result = Math.pow(this.previousValue, currentValue);
        break;
      default:
        return;
    }

    // Save to history
    this.addToHistory(
      `${this.previousValue} ${this.operation} ${currentValue}`,
      result
    );

    this.display = this.formatNumber(result);
    this.operation = null;
    this.shouldResetDisplay = true;
  }

  handleScientificFunction(func) {
    const current = parseFloat(this.display);
    let result = 0;

    switch (func) {
      case 'sin':
        result = Math.sin(current * Math.PI / 180);
        this.addToHistory(`sin(${current})`, result);
        break;
      case 'cos':
        result = Math.cos(current * Math.PI / 180);
        this.addToHistory(`cos(${current})`, result);
        break;
      case 'tan':
        result = Math.tan(current * Math.PI / 180);
        this.addToHistory(`tan(${current})`, result);
        break;
      case 'ln':
        result = Math.log(current);
        this.addToHistory(`ln(${current})`, result);
        break;
      case 'log':
        result = Math.log10(current);
        this.addToHistory(`log(${current})`, result);
        break;
      case '√':
        result = Math.sqrt(current);
        this.addToHistory(`√(${current})`, result);
        break;
      case '!':
        result = this.factorial(Math.floor(current));
        this.addToHistory(`${current}!`, result);
        break;
      case 'π':
        result = Math.PI;
        this.display = String(result);
        return;
      case '(':
        if (this.display === '0') {
          this.display = '(';
        } else {
          this.display += '(';
        }
        return;
      case ')':
        this.display += ')';
        return;
    }

    this.display = this.formatNumber(result);
    this.shouldResetDisplay = true;
  }

  factorial(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  }

  clear() {
    this.display = '0';
    this.previousValue = 0;
    this.operation = null;
    this.shouldResetDisplay = false;
  }

  formatNumber(num) {
    if (isNaN(num) || !isFinite(num)) return 'Error';
    if (num === Math.floor(num)) return String(Math.floor(num));
    return num.toFixed(8).replace(/\.?0+$/, '');
  }

  updateDisplay() {
    const displayEl = document.getElementById('calcDisplay');
    if (displayEl) {
      displayEl.textContent = this.display;
    }
  }

  addToHistory(expression, result) {
    this.history.unshift({ expression, result });
    this.history = this.history.slice(0, 20); // Keep last 20
    this.updateHistory();
  }

  updateHistory() {
    const historyEl = document.getElementById('calcHistory');
    if (historyEl) {
      historyEl.innerHTML = this.history.map(item => `
        <div class="history-item" onclick="Calculator.restoreFromHistory('${item.result}')">
          <div class="history-expression">${item.expression}</div>
          <div class="history-result">${this.formatNumber(item.result)}</div>
        </div>
      `).join('');
    }
  }

  attachEventListeners() {
    // Mode switching
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

        const mode = e.target.dataset.mode;
        if (mode === 'basic') {
          this.initializeBasicMode();
        } else if (mode === 'scientific') {
          this.initializeScientificMode();
        }
      });
    });
  }

  restoreFromHistory(value) {
    this.display = String(value);
    this.updateDisplay();
    this.shouldResetDisplay = true;
  }
}

// Graphing Calculator
class GraphingCalculator {
  constructor() {
    this.equation = 'y=x';
    this.xMin = -10;
    this.xMax = 10;
    this.yMin = -10;
    this.yMax = 10;
  }

  initialize() {
    document.getElementById('graphBtn')?.addEventListener('click', () => this.graph());
    document.getElementById('graphEquation').addEventListener('change', (e) => {
      this.equation = e.target.value;
      this.graph();
    });
    this.graph(); // Initial graph
  }

  graph() {
    const canvas = document.getElementById('graphCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#323232';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    this.drawGrid(ctx, width, height);

    // Draw axes
    this.drawAxes(ctx, width, height);

    // Parse and draw equation
    this.drawEquation(ctx, width, height);

    // Update info
    this.updateInfo();
  }

  drawGrid(ctx, width, height) {
    ctx.strokeStyle = '#373737';
    ctx.lineWidth = 0.5;

    const xStep = width / (this.xMax - this.xMin) * 1;
    const yStep = height / (this.yMax - this.yMin) * 1;

    for (let x = this.xMin; x <= this.xMax; x++) {
      const px = ((x - this.xMin) / (this.xMax - this.xMin)) * width;
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, height);
      ctx.stroke();
    }

    for (let y = this.yMin; y <= this.yMax; y++) {
      const py = ((this.yMax - y) / (this.yMax - this.yMin)) * height;
      ctx.beginPath();
      ctx.moveTo(0, py);
      ctx.lineTo(width, py);
      ctx.stroke();
    }
  }

  drawAxes(ctx, width, height) {
    ctx.strokeStyle = '#b3b3b3';
    ctx.lineWidth = 2;

    // X-axis
    const xPos = ((0 - this.xMin) / (this.xMax - this.xMin)) * width;
    ctx.beginPath();
    ctx.moveTo(xPos, 0);
    ctx.lineTo(xPos, height);
    ctx.stroke();

    // Y-axis
    const yPos = ((this.yMax - 0) / (this.yMax - this.yMin)) * height;
    ctx.beginPath();
    ctx.moveTo(0, yPos);
    ctx.lineTo(width, yPos);
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#b3b3b3';
    ctx.font = '12px sans-serif';
    ctx.fillText('0', xPos + 5, yPos - 5);
  }

  drawEquation(ctx, width, height) {
    ctx.strokeStyle = '#1a73e8';
    ctx.lineWidth = 2;

    try {
      ctx.beginPath();
      let firstPoint = true;

      const step = (this.xMax - this.xMin) / width;
      for (let x = this.xMin; x <= this.xMax; x += step) {
        const y = this.evaluateEquation(x);

        if (!isNaN(y) && isFinite(y) && y >= this.yMin && y <= this.yMax) {
          const px = ((x - this.xMin) / (this.xMax - this.xMin)) * width;
          const py = ((this.yMax - y) / (this.yMax - this.yMin)) * height;

          if (firstPoint) {
            ctx.moveTo(px, py);
            firstPoint = false;
          } else {
            ctx.lineTo(px, py);
          }
        } else {
          ctx.stroke();
          ctx.beginPath();
          firstPoint = true;
        }
      }
      ctx.stroke();
    } catch (e) {
      console.error('Error graphing equation:', e);
    }
  }

  evaluateEquation(x) {
    const eq = this.equation.toLowerCase().replace('y=', '').trim();
    try {
      return Function('x', 'return ' + eq.replace(/sin/g, 'Math.sin')
        .replace(/cos/g, 'Math.cos')
        .replace(/tan/g, 'Math.tan')
        .replace(/sqrt/g, 'Math.sqrt')
        .replace(/abs/g, 'Math.abs')
        .replace(/ln/g, 'Math.log')
        .replace(/log/g, 'Math.log10')
        .replace(/\^/g, '**')
        .replace(/π/g, 'Math.PI'))(x);
    } catch (e) {
      return NaN;
    }
  }

  updateInfo() {
    const info = document.getElementById('graphInfo');
    if (info) {
      info.innerHTML = `
        <div class="graph-info-item">
          <span class="graph-info-label">Equation:</span>
          <span class="graph-info-value">${this.equation}</span>
        </div>
        <div class="graph-info-item">
          <span class="graph-info-label">X Range:</span>
          <span class="graph-info-value">[${this.xMin}, ${this.xMax}]</span>
        </div>
        <div class="graph-info-item">
          <span class="graph-info-label">Y Range:</span>
          <span class="graph-info-value">[${this.yMin}, ${this.yMax}]</span>
        </div>
      `;
    }
  }
}

// Global instances
const Calculator = new CalculatorModule();
const Graphing = new GraphingCalculator();
