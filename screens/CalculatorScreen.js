/*
 * screens/CalculatorScreen.js
 *
 * Calculator Screen - Multi-Mode Calculator
 * Displays a fully functional calculator with three modes:
 * • Basic: Simple arithmetic (add, subtract, multiply, divide)
 * • Scientific: Trigonometry, logarithms, constants
 * • Graphing: Visual equation graphing interface
 * Core of the GraphR experience. Fast, accurate, beautiful.
 */

import React, { useState } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, FlatList, ScrollView,
} from "react-native";
import { COLORS, CALCULATOR_BUTTONS, evaluateExpression, formatNumber } from "../constants/graphr";

export default function CalculatorScreen({
  mode, onModeChange, display, onDisplayChange, history, onHistoryAdd, showToast,
}) {
  const [expression, setExpression] = useState("");

  const handleButtonPress = (button) => {
    if (button === "=") {
      try {
        const result = evaluateExpression(expression);
        if (isNaN(result)) {
          showToast("Invalid expression");
          return;
        }
        const formatted = formatNumber(result);
        onDisplayChange(formatted);
        onHistoryAdd({ expression, result: formatted });
        setExpression("");
      } catch (error) {
        showToast("Calculation error");
      }
    } else if (button === "C") {
      setExpression("");
      onDisplayChange("0");
    } else if (button === ".") {
      if (!expression.includes(".")) {
        setExpression(expression + button);
      }
    } else {
      setExpression(expression + button);
      onDisplayChange(expression + button || "0");
    }
  };

  const handleModeSwitch = (newMode) => {
    setExpression("");
    onDisplayChange("0");
    onModeChange(newMode);
  };

  const getButtonsForMode = () => {
    if (mode === "scientific") return CALCULATOR_BUTTONS.scientific;
    return CALCULATOR_BUTTONS.basic;
  };

  const buttons = getButtonsForMode();

  return (
    <View style={styles.container}>
      {/* Mode Selector */}
      <View style={styles.modeSelector}>
        {["basic", "scientific", "graphing"].map((m) => (
          <TouchableOpacity
            key={m}
            style={[styles.modeButton, mode === m && styles.modeButtonActive]}
            onPress={() => handleModeSwitch(m)}
          >
            <Text style={[styles.modeText, mode === m && styles.modeTextActive]}>
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Display */}
      <View style={styles.displaySection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.expressionScroll}>
          <Text style={styles.expression}>{expression || "0"}</Text>
        </ScrollView>
        <Text style={styles.display}>{display}</Text>
      </View>

      {/* History */}
      {history.length > 0 && (
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>History</Text>
          <FlatList
            data={history}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Text style={styles.historyItem}>
                {item.expression} = {item.result}
              </Text>
            )}
            scrollEnabled={false}
            maxHeight={100}
          />
        </View>
      )}

      {/* Calculator Buttons */}
      <View style={styles.buttonsSection}>
        {buttons.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.buttonRow}>
            {row.map((button) => (
              <TouchableOpacity
                key={button}
                style={[
                  styles.button,
                  (button === "=" || button === "C") && styles.functionButton,
                  ["/", "*", "-", "+"].includes(button) && styles.operatorButton,
                ]}
                onPress={() => handleButtonPress(button)}
              >
                <Text
                  style={[
                    styles.buttonText,
                    (button === "=" || button === "C") && styles.functionButtonText,
                    ["/", "*", "-", "+"].includes(button) && styles.operatorButtonText,
                  ]}
                >
                  {button}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
    padding: 16,
    gap: 12,
  },
  modeSelector: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: COLORS.darkSecondary,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modeButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  modeText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  modeTextActive: {
    color: COLORS.text,
  },
  displaySection: {
    backgroundColor: COLORS.darkSecondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    gap: 6,
    minHeight: 100,
  },
  expressionScroll: {
    maxHeight: 30,
  },
  expression: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  display: {
    fontFamily: "Inter_700Bold",
    fontSize: 32,
    color: COLORS.primary,
  },
  historySection: {
    backgroundColor: COLORS.darkSecondary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    maxHeight: 120,
  },
  historyTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    color: COLORS.textSecondary,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  historyItem: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: COLORS.text,
    paddingVertical: 2,
  },
  buttonsSection: {
    flex: 1,
    gap: 8,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 8,
    flex: 1,
  },
  button: {
    flex: 1,
    backgroundColor: COLORS.darkSecondary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 48,
  },
  functionButton: {
    backgroundColor: "rgba(15, 157, 88, 0.2)",
    borderColor: COLORS.success,
  },
  operatorButton: {
    backgroundColor: "rgba(26, 115, 232, 0.2)",
    borderColor: COLORS.primary,
  },
  buttonText: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: COLORS.text,
  },
  functionButtonText: {
    color: COLORS.success,
  },
  operatorButtonText: {
    color: COLORS.primary,
  },
});
