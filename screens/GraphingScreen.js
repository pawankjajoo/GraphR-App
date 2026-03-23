/*
 * screens/GraphingScreen.js
 *
 * Graphing Screen - Visual Equation Graphing
 * Interactive graphing interface:
 * • Input mathematical equations
 * • Visualize graphs in real-time
 * • Zoom and pan controls
 * • Multiple equations overlay
 * Visualize math. See the patterns. Understand the relationships.
 */

import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView,
} from "react-native";
import { COLORS } from "../constants/graphr";

export default function GraphingScreen({ showToast }) {
  const [equations, setEquations] = useState([]);
  const [currentEquation, setCurrentEquation] = useState("");
  const [graphScale, setGraphScale] = useState(1);

  const handleAddEquation = () => {
    if (currentEquation.trim()) {
      setEquations([...equations, { id: Date.now(), expr: currentEquation }]);
      setCurrentEquation("");
      showToast("Equation added");
    }
  };

  const handleRemoveEquation = (id) => {
    setEquations(equations.filter((eq) => eq.id !== id));
  };

  const handleZoom = (direction) => {
    setGraphScale((prev) => direction === "in" ? prev * 1.2 : prev / 1.2);
  };

  return (
    <View style={styles.container}>
      {/* Graph Area (Placeholder) */}
      <View style={styles.graphArea}>
        <View style={styles.gridContainer}>
          <Text style={styles.gridText}>Graph visualization area</Text>
          <Text style={styles.gridSubtext}>{equations.length} equation(s) loaded</Text>
          {equations.length > 0 && (
            <View style={styles.equationPreview}>
              {equations.map((eq) => (
                <Text key={eq.id} style={styles.equationText}>{eq.expr}</Text>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controlsSection}>
        {/* Zoom Controls */}
        <View style={styles.zoomControls}>
          <TouchableOpacity style={styles.zoomButton} onPress={() => handleZoom("out")}>
            <Text style={styles.zoomButtonText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.zoomLabel}>Scale: {graphScale.toFixed(2)}x</Text>
          <TouchableOpacity style={styles.zoomButton} onPress={() => handleZoom("in")}>
            <Text style={styles.zoomButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Equation Input */}
        <View style={styles.equationInput}>
          <TextInput
            style={styles.input}
            placeholder="Enter equation (e.g., x^2, sin(x))"
            placeholderTextColor={COLORS.textMuted}
            value={currentEquation}
            onChangeText={setCurrentEquation}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddEquation}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        {/* Equations List */}
        {equations.length > 0 && (
          <View style={styles.equationsList}>
            <Text style={styles.listTitle}>Active Equations</Text>
            <ScrollView>
              {equations.map((eq) => (
                <View key={eq.id} style={styles.equationItem}>
                  <Text style={styles.equationItemText}>{eq.expr}</Text>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveEquation(eq.id)}
                  >
                    <Text style={styles.removeButtonText}>X</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
    flexDirection: "column",
  },
  graphArea: {
    flex: 1,
    backgroundColor: COLORS.darkSecondary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    margin: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
  },
  gridContainer: {
    alignItems: "center",
    gap: 8,
  },
  gridText: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  gridSubtext: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: COLORS.textMuted,
  },
  equationPreview: {
    marginTop: 12,
    alignItems: "center",
    gap: 4,
  },
  equationText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: COLORS.primary,
  },
  controlsSection: {
    backgroundColor: COLORS.darkSecondary,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    padding: 12,
    gap: 12,
    maxHeight: 260,
  },
  zoomControls: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.dark,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  zoomButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  zoomButtonText: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    color: COLORS.text,
  },
  zoomLabel: {
    flex: 1,
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: COLORS.text,
    textAlign: "center",
  },
  equationInput: {
    flexDirection: "row",
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.input,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  addButtonText: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    color: COLORS.text,
  },
  equationsList: {
    maxHeight: 150,
    backgroundColor: COLORS.dark,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 8,
  },
  listTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    color: COLORS.textSecondary,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  equationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: COLORS.darkSecondary,
    borderRadius: 6,
    marginBottom: 4,
  },
  equationItemText: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: COLORS.text,
  },
  removeButton: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: COLORS.error,
    justifyContent: "center",
    alignItems: "center",
  },
  removeButtonText: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    color: COLORS.text,
  },
});
