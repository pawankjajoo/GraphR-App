package com.graphrapp.graphr

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.getValue
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.google.firebase.Firebase
import com.google.firebase.app.Firebase
import com.graphrapp.graphr.ui.theme.GraphRTheme
import com.graphrapp.graphr.ui.screens.MainApp
import com.graphrapp.graphr.ui.screens.LoginScreen
import com.graphrapp.graphr.viewmodels.AuthViewModel

/**
 * GraphR Android Application
 * Main entry point for the app
 * #CalculatingTheFuture
 */

class MainActivity : ComponentActivity() {
  private val authViewModel = AuthViewModel()

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    setContent {
      GraphRTheme {
        Surface(color = MaterialTheme.colorScheme.background) {
          val isAuthenticated by authViewModel.isAuthenticated.collectAsStateWithLifecycle()

          if (isAuthenticated) {
            MainApp(authViewModel = authViewModel)
          } else {
            LoginScreen(authViewModel = authViewModel)
          }
        }
      }
    }
  }
}
