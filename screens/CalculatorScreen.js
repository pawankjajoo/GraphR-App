/**
 * Calculator Screen Component
 *
 * Provides a full-featured interactive calculator with multiple modes:
 * - Basic Calculator: Standard arithmetic operations
 * - Scientific Calculator: Advanced math functions (trig, logs, etc)
 * - Graphing Mode: Visualize mathematical functions
 * - Statistics Mode: Data analysis and probability
 *
 * Features derived from GraphR patents:
 * - Interactive calculator interface responsive to touch
 * - Display of multi-step calculations
 * - Real-time graphing with adjustable parameters
 * - Context-aware calculator selection (exam mode restrictions)
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useExamMode } from '../context/ExamModeContext';

const { width } = Dimensions.get('window');
const BUTTON_WIDTH = (width - 40) / 4;

const CalculatorScreen = () => {
  const { examMode } = useExamMode();

  // Calculator state management
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  const [calculatorMode, setCalculatorMode] = useState('basic');
  const [history, setHistory] = useState([]);

  /**
   * Handles numeric input to the calculator display
   * Updates display value and manages calculation state
   */
  const handleNumberPress = useCallback((num) => {
    if (waitingForNewValue) {
      setDisplay(String(num));
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? String(num) : display + num);
    }
  }, [display, waitingForNewValue]);

  /**
   * Handles decimal point input
   * Ensures only one decimal point per number
   */
  const handleDecimal = useCallback(() => {
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  }, [display]);

  /**
   * Processes arithmetic operations
   * Stores current value and operation for later calculation
   */
  const handleOperation = useCallback((op) => {
    const currentValue = parseFloat(display);

    // If we already have a previous value and operation, calculate first
    if (previousValue !== null && operation && !waitingForNewValue) {
      const result = performCalculation(previousValue, currentValue, operation);
      setDisplay(String(result));
      setPreviousValue(result);
    } else {
      setPreviousValue(currentValue);
    }

    setOperation(op);
    setWaitingForNewValue(true);
  }, [display, previousValue, operation, waitingForNewValue]);

  /**
   * Performs basic arithmetic calculation
   * Supports: addition, subtraction, multiplication, division
   */
  const performCalculation = (prev, current, op) => {
    switch (op) {
      case '+':
        return prev + current;
      case '-':
        return prev - current;
      case '*':
        return prev * current;
      case '/':
        return prev !== 0 ? prev / current : 0;
      default:
        return current;
    }
  };

  /**
   * Equals button handler
   * Completes the current calculation and displays result
   */
  const handleEquals = useCallback(() => {
    if (previousValue !== null && operation) {
      const currentValue = parseFloat(display);
      const result = performCalculation(previousValue, currentValue, operation);

      // Add to history for learning tracking
      setHistory([
        ...history,
        {
          expression: `${previousValue} ${operation} ${currentValue}`,
          result: result,
          timestamp: new Date().toISOString(),
        },
      ]);

      setDisplay(String(result));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForNewValue(true);
    }
  }, [display, previousValue, operation, history]);

  /**
   * Clear all values and reset calculator state
   */
  const handleClear = useCallback(() => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  }, []);

  /**
   * Remove last digit from display
   */
  const handleBackspace = useCallback(() => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  }, [display]);

  /**
   * Advanced math functions for scientific mode
   * Trigonometric, logarithmic, and power operations
   */
  const handleScientificFunction = useCallback((func) => {
    const value = parseFloat(display);
    let result = 0;

    switch (func) {
      case 'sin':
        result = Math.sin((value * Math.PI) / 180);
        break;
      case 'cos':
        result = Math.cos((value * Math.PI) / 180);
        break;
      case 'tan':
        result = Math.tan((value * Math.PI) / 180);
        break;
      case 'log':
        result = Math.log10(value);
        break;
      case 'ln':
        result = Math.log(value);
        break;
      case 'sqrt':
        result = Math.sqrt(value);
        break;
      case '^2':
        result = value * value;
        break;
      case 'pi':
        result = Math.PI;
        break;
      default:
        return;
    }

    setDisplay(String(result.toFixed(6)));
    setWaitingForNewValue(true);
  }, [display]);

  /**
   * Switch between calculator modes
   * Different modes available based on exam restrictions
   */
  const CalculatorModes = {
    basic: [
      ['7', '8', '9', '/'],
      ['4', '5', '6', '*'],
      ['1', '2', '3', '-'],
      ['0', '.', '=', '+'],
    ],
    scientific: [
      ['sin', 'cos', 'tan', 'C'],
      ['log', 'ln', 'sqrt', 'DEL'],
      ['(', ')', '^2', 'pi'],
      ['7', '8', '9', '/'],
      ['4', '5', '6', '*'],
      ['1', '2', '3', '-'],
      ['0', '.', '=', '+'],
    ],
  };

  const currentLayout = calculatorMode === 'basic'
    ? CalculatorModes.basic
    : CalculatorModes.scientific;

  // If in exam mode, may have restricted calculator modes
  const isCalculatorRestricted = examMode?.restrictedCalculatorMode;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.modeSelector}>
        <TouchableOpacity
          style={[
            styles.modeButton,
            calculatorMode === 'basic' && styles.activeModeButton,
          ]}
          onPress={() => setCalculatorMode('basic')}
          disabled={isCalculatorRestricted && isCalculatorRestricted !== 'basic'}
        >
          <Text style={styles.modeButtonText}>Basic</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.modeButton,
            calculatorMode === 'scientific' && styles.activeModeButton,
          ]}
          onPress={() => setCalculatorMode('scientific')}
          disabled={isCalculatorRestricted && isCalculatorRestricted !== 'scientific'}
        >
          <Text style={styles.modeButtonText}>Scientific</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.displayContainer}>
        <Text style={styles.displayText}>{display}</Text>
      </View>

      <View style={styles.calculatorGrid}>
        {currentLayout.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((btn) => {
              let buttonStyle = styles.button;
              let textStyle = styles.buttonText;
              let onPress = null;

              if (!isNaN(btn)) {
                onPress = () => handleNumberPress(btn);
                buttonStyle = [buttonStyle, styles.numberButton];
              } else if (btn === '.') {
                onPress = handleDecimal;
                buttonStyle = [buttonStyle, styles.numberButton];
              } else if (btn === 'C') {
                onPress = handleClear;
                buttonStyle = [buttonStyle, styles.operationButton];
                textStyle = [textStyle, styles.operationText];
              } else if (btn === 'DEL') {
                onPress = handleBackspace;
                buttonStyle = [buttonStyle, styles.operationButton];
                textStyle = [textStyle, styles.operationText];
              } else if (btn === '=') {
                onPress = handleEquals;
                buttonStyle = [buttonStyle, styles.equalsButton];
                textStyle = [textStyle, styles.equalsText];
              } else if (['+', '-', '*', '/'].includes(btn)) {
                onPress = () => handleOperation(btn);
                buttonStyle = [buttonStyle, styles.operationButton];
                textStyle = [textStyle, styles.operationText];
              } else if (
                ['sin', 'cos', 'tan', 'log', 'ln', 'sqrt', '^2', 'pi', '(', ')'].includes(btn)
              ) {
                onPress = () => handleScientificFunction(btn);
                buttonStyle = [buttonStyle, styles.scientificButton];
                textStyle = [textStyle, styles.scientificText];
              }

              return (
                <TouchableOpacity
                  key={btn}
                  style={buttonStyle}
                  onPress={onPress}
                  disabled={!onPress}
                >
                  <Text style={textStyle}>{btn}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      {/* History section showing recent calculations */}
      {history.length > 0 && (
        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>Calculation History</Text>
          {history.slice(-5).reverse().map((item, index) => (
            <Text key={index} style={styles.historyItem}>
              {item.expression} = {item.result}
            </Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 10,
  },
  modeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    gap: 10,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#ECF0F1',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BDC3C7',
  },
  activeModeButton: {
    backgroundColor: '#3498DB',
    borderColor: '#2980B9',
  },
  modeButtonText: {
    textAlign: 'center',
    fontWeight: '600',
    color: '#2C3E50',
  },
  displayContainer: {
    backgroundColor: '#2C3E50',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    minHeight: 80,
    justifyContent: 'center',
  },
  displayText: {
    color: '#ECF0F1',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  calculatorGrid: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 10,
  },
  button: {
    flex: 1,
    height: BUTTON_WIDTH,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ECF0F1',
  },
  numberButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#BDC3C7',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },
  operationButton: {
    backgroundColor: '#E74C3C',
  },
  operationText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  equalsButton: {
    backgroundColor: '#27AE60',
  },
  equalsText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  scientificButton: {
    backgroundColor: '#9B59B6',
  },
  scientificText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  historyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  historyTitle: {
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 10,
  },
  historyItem: {
    color: '#34495E',
    fontSize: 14,
    marginVertical: 4,
    fontFamily: 'monospace',
  },
});

export default CalculatorScreen;
