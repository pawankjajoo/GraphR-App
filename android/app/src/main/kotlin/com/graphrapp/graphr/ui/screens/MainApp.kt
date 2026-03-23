package com.graphrapp.graphr.ui.screens

import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import com.graphrapp.graphr.models.UserRole
import com.graphrapp.graphr.viewmodels.AuthViewModel

/**
 * Main application screen with tab navigation
 */
@Composable
fun MainApp(authViewModel: AuthViewModel) {
  var selectedTab by remember { mutableStateOf(0) }

  Scaffold(
    bottomBar = {
      NavigationBar {
        NavigationBarItem(
          icon = { Text("🧮") },
          label = { Text("Calculator") },
          selected = selectedTab == 0,
          onClick = { selectedTab = 0 }
        )
        NavigationBarItem(
          icon = { Text("📝") },
          label = { Text("Exams") },
          selected = selectedTab == 1,
          onClick = { selectedTab = 1 }
        )
        NavigationBarItem(
          icon = { Text("👨") },
          label = { Text("Classroom") },
          selected = selectedTab == 2,
          onClick = { selectedTab = 2 }
        )
        NavigationBarItem(
          icon = { Text("📊") },
          label = { Text("Analytics") },
          selected = selectedTab == 3,
          onClick = { selectedTab = 3 }
        )
        NavigationBarItem(
          icon = { Text("👤") },
          label = { Text("Profile") },
          selected = selectedTab == 4,
          onClick = { selectedTab = 4 }
        )
      }
    }
  ) { padding ->
    when (selectedTab) {
      0 -> CalculatorScreen(Modifier)
      1 -> ExamListScreen(Modifier)
      2 -> ClassroomScreen(Modifier)
      3 -> AnalyticsScreen(Modifier)
      4 -> ProfileScreen(Modifier, authViewModel)
    }
  }
}

@Composable
fun LoginScreen(authViewModel: AuthViewModel) {
  // Login UI implementation
  Text("GraphR Login")
}

@Composable
fun CalculatorScreen(modifier: Modifier) {
  Text("Calculator Screen")
}

@Composable
fun ExamListScreen(modifier: Modifier) {
  Text("Exam List Screen")
}

@Composable
fun ClassroomScreen(modifier: Modifier) {
  Text("Classroom Screen")
}

@Composable
fun AnalyticsScreen(modifier: Modifier) {
  Text("Analytics Screen")
}

@Composable
fun ProfileScreen(modifier: Modifier, authViewModel: AuthViewModel) {
  Text("Profile Screen")
}
