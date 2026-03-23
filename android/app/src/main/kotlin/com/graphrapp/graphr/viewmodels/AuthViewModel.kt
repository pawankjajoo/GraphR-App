package com.graphrapp.graphr.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import com.graphrapp.graphr.models.User
import com.graphrapp.graphr.models.UserRole
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.tasks.await

class AuthViewModel : ViewModel() {
  private val auth = FirebaseAuth.getInstance()
  private val firestore = FirebaseFirestore.getInstance()

  private val _isAuthenticated = MutableStateFlow(false)
  val isAuthenticated: StateFlow<Boolean> = _isAuthenticated

  private val _currentUser = MutableStateFlow<User?>(null)
  val currentUser: StateFlow<User?> = _currentUser

  private val _userRole = MutableStateFlow(UserRole.STUDENT)
  val userRole: StateFlow<UserRole> = _userRole

  private val _isLoading = MutableStateFlow(false)
  val isLoading: StateFlow<Boolean> = _isLoading

  private val _errorMessage = MutableStateFlow<String?>(null)
  val errorMessage: StateFlow<String?> = _errorMessage

  init {
    checkAuthStatus()
  }

  private fun checkAuthStatus() {
    val user = auth.currentUser
    if (user != null) {
      _isAuthenticated.value = true
      fetchUserProfile(user.uid)
    }
  }

  fun login(email: String, password: String, role: UserRole) {
    viewModelScope.launch {
      _isLoading.value = true
      _errorMessage.value = null

      try {
        auth.signInWithEmailAndPassword(email, password).await()
        _userRole.value = role
        _isAuthenticated.value = true
      } catch (e: Exception) {
        _errorMessage.value = e.message ?: "Login failed"
      } finally {
        _isLoading.value = false
      }
    }
  }

  fun signup(
    email: String,
    password: String,
    firstName: String,
    lastName: String,
    role: UserRole
  ) {
    viewModelScope.launch {
      _isLoading.value = true
      _errorMessage.value = null

      try {
        val result = auth.createUserWithEmailAndPassword(email, password).await()
        val uid = result.user?.uid ?: throw Exception("User creation failed")

        val user = User(
          uid = uid,
          email = email,
          firstName = firstName,
          lastName = lastName,
          role = role,
          bio = "",
          profileImageUrl = ""
        )

        firestore.collection("users").document(uid).set(user).await()

        _userRole.value = role
        _currentUser.value = user
        _isAuthenticated.value = true
      } catch (e: Exception) {
        _errorMessage.value = e.message ?: "Signup failed"
      } finally {
        _isLoading.value = false
      }
    }
  }

  fun logout() {
    auth.signOut()
    _isAuthenticated.value = false
    _currentUser.value = null
  }

  fun fetchUserProfile(uid: String) {
    viewModelScope.launch {
      try {
        val document = firestore.collection("users").document(uid).get().await()
        val user = document.toObject(User::class.java)
        _currentUser.value = user
        if (user != null) {
          _userRole.value = user.role
        }
      } catch (e: Exception) {
        _errorMessage.value = e.message
      }
    }
  }

  fun updateProfile(firstName: String, lastName: String, bio: String) {
    val uid = auth.currentUser?.uid ?: return

    viewModelScope.launch {
      try {
        val updates = mapOf(
          "firstName" to firstName,
          "lastName" to lastName,
          "bio" to bio
        )
        firestore.collection("users").document(uid).update(updates).await()
        _currentUser.value = _currentUser.value?.copy(
          firstName = firstName,
          lastName = lastName,
          bio = bio
        )
      } catch (e: Exception) {
        _errorMessage.value = e.message
      }
    }
  }
}
