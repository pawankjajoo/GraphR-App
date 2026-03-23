import SwiftUI

struct CalculatorView: View {
  @State private var display = "0"
  @State private var previousValue: Double = 0
  @State private var operation: String?
  @State private var shouldResetDisplay = false
  @State private var mode: CalculatorMode = .basic
  @State private var history: [(expression: String, result: String)] = []

  enum CalculatorMode {
    case basic
    case scientific
    case graphing
  }

  var body: some View {
    NavigationStack {
      VStack(spacing: 0) {
        // Header
        VStack(alignment: .leading, spacing: 4) {
          Text("Calculator")
            .font(.title2)
            .fontWeight(.bold)
          Text("#CalculatingTheFuture")
            .font(.caption)
            .foregroundColor(.blue)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding()

        // Mode Selector
        HStack(spacing: 8) {
          ForEach([CalculatorMode.basic, .scientific, .graphing], id: \.self) { m in
            Button(action: { mode = m }) {
              Text(modeName(m))
                .font(.caption)
                .fontWeight(.semibold)
                .frame(maxWidth: .infinity)
                .padding(8)
                .background(mode == m ? Color.blue : Color.gray.opacity(0.2))
                .foregroundColor(mode == m ? .white : .primary)
                .cornerRadius(6)
            }
          }
        }
        .padding(.horizontal)

        // Display
        VStack(alignment: .trailing) {
          Text(display)
            .font(.system(size: 36, weight: .bold, design: .default))
            .lineLimit(1)
            .minimumScaleFactor(0.5)
        }
        .frame(maxWidth: .infinity, alignment: .trailing)
        .frame(height: 80)
        .padding()
        .background(Color.gray.opacity(0.1))
        .cornerRadius(12)
        .padding()

        // Calculator Buttons
        if mode == .basic || mode == .scientific {
          ScrollView {
            VStack(spacing: 8) {
              ForEach(getButtonRows(), id: \.self) { row in
                HStack(spacing: 8) {
                  ForEach(row, id: \.self) { label in
                    CalculatorButton(
                      label: label,
                      action: { handleButtonPress(label) }
                    )
                  }
                }
              }
            }
            .padding()
          }
        } else {
          GraphingView()
        }

        // History
        if !history.isEmpty {
          Divider()
          VStack(alignment: .leading) {
            Text("History")
              .font(.caption)
              .fontWeight(.semibold)
              .foregroundColor(.secondary)

            ScrollView {
              VStack(alignment: .leading, spacing: 8) {
                ForEach(history.indices.reversed(), id: \.self) { index in
                  let item = history[index]
                  HStack {
                    VStack(alignment: .leading, spacing: 2) {
                      Text(item.expression)
                        .font(.caption2)
                        .foregroundColor(.secondary)
                      Text(item.result)
                        .font(.caption)
                        .fontWeight(.semibold)
                    }
                    Spacer()
                  }
                  .padding(8)
                  .background(Color.gray.opacity(0.1))
                  .cornerRadius(6)
                }
              }
            }
          }
          .frame(height: 100)
          .padding()
        }
      }
      .navigationBarTitleDisplayMode(.inline)
    }
  }

  // MARK: - Helpers

  private func modeName(_ mode: CalculatorMode) -> String {
    switch mode {
    case .basic:
      return "Basic"
    case .scientific:
      return "Scientific"
    case .graphing:
      return "Graphing"
    }
  }

  private func getButtonRows() -> [[String]] {
    if mode == .basic {
      return [
        ["7", "8", "9", "÷"],
        ["4", "5", "6", "×"],
        ["1", "2", "3", "-"],
        ["0", ".", "=", "+"],
        ["C"],
      ]
    } else {
      return [
        ["sin", "cos", "tan", "÷"],
        ["ln", "log", "√", "×"],
        ["(", ")", "π", "-"],
        ["!", "^", "=", "+"],
        ["C"],
      ]
    }
  }

  private func handleButtonPress(_ label: String) {
    switch label {
    case "=":
      calculate()
    case "C":
      clear()
    case "+", "-", "×", "÷", "^":
      setOperation(label)
    case ".":
      addDecimal()
    default:
      appendNumber(label)
    }
  }

  private func appendNumber(_ num: String) {
    if shouldResetDisplay {
      display = num
      shouldResetDisplay = false
    } else {
      if display == "0" {
        display = num
      } else {
        display += num
      }
    }
  }

  private func addDecimal() {
    if !display.contains(".") {
      display += "."
    }
  }

  private func setOperation(_ op: String) {
    previousValue = Double(display) ?? 0
    operation = op
    shouldResetDisplay = true
  }

  private func calculate() {
    guard let op = operation, let currentValue = Double(display) else { return

    }
    var result = 0.0

    switch op {
    case "+":
      result = previousValue + currentValue
    case "-":
      result = previousValue - currentValue
    case "×":
      result = previousValue * currentValue
    case "÷":
      result = previousValue / currentValue
    case "^":
      result = pow(previousValue, currentValue)
    case "sin":
      result = sin(currentValue * .pi / 180)
    case "cos":
      result = cos(currentValue * .pi / 180)
    case "tan":
      result = tan(currentValue * .pi / 180)
    case "√":
      result = sqrt(currentValue)
    default:
      return
    }

    let resultStr = formatNumber(result)
    history.append((
      expression: "\(previousValue) \(op) \(currentValue)",
      result: resultStr
    ))

    display = resultStr
    operation = nil
    shouldResetDisplay = true
  }

  private func clear() {
    display = "0"
    previousValue = 0
    operation = nil
    shouldResetDisplay = false
  }

  private func formatNumber(_ num: Double) -> String {
    if num.truncatingRemainder(dividingBy: 1) == 0 {
      return String(format: "%.0f", num)
    }
    return String(format: "%.6f", num).trimmingCharacters(in: CharacterSet(charactersIn: "0")).trimmingCharacters(in: CharacterSet(charactersIn: "."))
  }
}

// MARK: - Calculator Button

struct CalculatorButton: View {
  let label: String
  let action: () -> Void

  var body: some View {
    Button(action: action) {
      Text(label)
        .font(.title3)
        .fontWeight(.semibold)
        .frame(maxWidth: .infinity)
        .frame(height: 50)
        .background(buttonColor)
        .foregroundColor(buttonForeground)
        .cornerRadius(8)
    }
  }

  private var buttonColor: Color {
    if ["+", "-", "×", "÷", "^", "sin", "cos", "tan", "ln", "log"].contains(label) {
      return .blue
    } else if label == "=" || label == "C" {
      return .green
    } else {
      return Color.gray.opacity(0.2)
    }
  }

  private var buttonForeground: Color {
    if ["+", "-", "×", "÷", "^", "sin", "cos", "tan", "ln", "log"].contains(label) {
      return .white
    } else if label == "C" {
      return .white
    } else {
      return .primary
    }
  }
}

// MARK: - Graphing View

struct GraphingView: View {
  @State private var equation = "y=x"

  var body: some View {
    VStack(spacing: 12) {
      HStack {
        TextField("Equation", text: $equation)
          .textFieldStyle(.roundedBorder)
        Button("Graph") {
          // Graph the equation
        }
        .buttonStyle(.borderedProminent)
      }
      .padding()

      Canvas { context, size in
        // Draw grid and equation
        drawGraph(context: &context, size: size)
      }
      .frame(height: 300)
      .border(Color.gray.opacity(0.3))
      .padding()
    }
  }

  private func drawGraph(context: inout GraphicsContext, size: CGSize) {
    // Basic graphing implementation
    let xMin = -10.0
    let xMax = 10.0
    let yMin = -10.0
    let yMax = 10.0

    let xStep = size.width / CGFloat(xMax - xMin)
    let yStep = size.height / CGFloat(yMax - yMin)

    // Draw grid lines
    var path = Path()
    for x in stride(from: xMin, to: xMax, by: 1) {
      let px = (x - xMin) * Double(xStep)
      path.move(to: CGPoint(x: px, y: 0))
      path.addLine(to: CGPoint(x: px, y: size.height))
    }

    context.stroke(
      path,
      with: .color(.gray.opacity(0.3)),
      lineWidth: 0.5
    )
  }
}

#Preview {
  CalculatorView()
}
