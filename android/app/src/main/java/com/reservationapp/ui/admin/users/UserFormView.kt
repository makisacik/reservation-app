package com.reservationapp.ui.admin.users

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog
import com.reservationapp.core.ui.theme.*
import com.reservationapp.domain.model.AdminCreateUserRequest
import com.reservationapp.domain.model.User
import com.reservationapp.domain.model.UserUpdateRequest
import com.reservationapp.ui.admin.AdminUsersViewModel
import com.reservationapp.ui.admin.UserRoleFilter
import com.reservationapp.ui.admin.UserStatusFilter

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun UserFormView(
    isPresented: Boolean,
    viewModel: AdminUsersViewModel,
    onDismiss: () -> Unit
) {
    if (!isPresented) return

    val editingUser by viewModel.editingUser.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()

    val isEditMode = editingUser != null

    var name by remember { mutableStateOf(editingUser?.name ?: "") }
    var email by remember { mutableStateOf(editingUser?.email ?: "") }
    var password by remember { mutableStateOf("") }
    var department by remember { mutableStateOf(editingUser?.department ?: "") }
    var role by remember { mutableStateOf(editingUser?.role ?: "User") }
    var status by remember { mutableStateOf(editingUser?.status ?: "Active") }

    var errors by remember { mutableStateOf<Map<String, String>>(emptyMap()) }

    LaunchedEffect(editingUser) {
        if (editingUser != null) {
            name = editingUser!!.name
            email = editingUser!!.email
            password = ""
            department = editingUser!!.department ?: ""
            role = editingUser!!.role
            status = editingUser!!.status ?: "Active"
            errors = emptyMap()
        } else {
            name = ""
            email = ""
            password = ""
            department = ""
            role = "User"
            status = "Active"
            errors = emptyMap()
        }
    }

    Dialog(onDismissRequest = onDismiss) {
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .fillMaxHeight(0.9f),
            shape = RoundedCornerShape(16.dp)
        ) {
            Column(
                modifier = Modifier.fillMaxSize()
            ) {
                // Header
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(Spacing.md),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = androidx.compose.ui.Alignment.CenterVertically
                ) {
                    Text(
                        text = if (isEditMode) "Kullanıcı Düzenle" else "Yeni Kullanıcı Ekle",
                        style = MaterialTheme.typography.titleLarge.copy(
                            fontWeight = FontWeight.SemiBold
                        ),
                        color = TextPrimary
                    )
                    IconButton(onClick = onDismiss) {
                        Icon(
                            imageVector = Icons.Default.Close,
                            contentDescription = "Kapat"
                        )
                    }
                }

                Divider()

                // Form Content
                Column(
                    modifier = Modifier
                        .weight(1f)
                        .verticalScroll(rememberScrollState())
                        .padding(Spacing.md),
                    verticalArrangement = Arrangement.spacedBy(Spacing.md)
                ) {
                    // Kullanıcı Bilgileri Section
                    Text(
                        text = "Kullanıcı Bilgileri",
                        style = MaterialTheme.typography.titleMedium.copy(
                            fontWeight = FontWeight.SemiBold
                        ),
                        color = TextPrimary,
                        modifier = Modifier.padding(bottom = Spacing.xs)
                    )

                    // Name
                    OutlinedTextField(
                        value = name,
                        onValueChange = { name = it; errors = errors - "name" },
                        label = { Text("Ad Soyad") },
                        modifier = Modifier.fillMaxWidth(),
                        isError = errors.containsKey("name"),
                        supportingText = errors["name"]?.let { { Text(it) } }
                    )

                    // Email
                    OutlinedTextField(
                        value = email,
                        onValueChange = { email = it; errors = errors - "email" },
                        label = { Text("Email") },
                        modifier = Modifier.fillMaxWidth(),
                        enabled = !isEditMode,
                        keyboardOptions = KeyboardOptions(
                            keyboardType = KeyboardType.Email
                        ),
                        isError = errors.containsKey("email"),
                        supportingText = errors["email"]?.let { { Text(it) } }
                    )

                    // Password (only for create)
                    if (!isEditMode) {
                        OutlinedTextField(
                            value = password,
                            onValueChange = { password = it; errors = errors - "password" },
                            label = { Text("Şifre") },
                            modifier = Modifier.fillMaxWidth(),
                            keyboardOptions = KeyboardOptions(
                                keyboardType = KeyboardType.Password
                            ),
                            isError = errors.containsKey("password"),
                            supportingText = errors["password"]?.let { { Text(it) } }
                        )
                    }

                    // Department
                    OutlinedTextField(
                        value = department,
                        onValueChange = { department = it },
                        label = { Text("Departman") },
                        modifier = Modifier.fillMaxWidth(),
                        placeholder = { Text("Opsiyonel") }
                    )

                    Spacer(modifier = Modifier.height(Spacing.md))

                    // Rol ve Durum Section
                    Text(
                        text = "Rol ve Durum",
                        style = MaterialTheme.typography.titleMedium.copy(
                            fontWeight = FontWeight.SemiBold
                        ),
                        color = TextPrimary,
                        modifier = Modifier.padding(bottom = Spacing.xs)
                    )

                    // Role
                    var roleExpanded by remember { mutableStateOf(false) }
                    Box(modifier = Modifier.fillMaxWidth()) {
                        ExposedDropdownMenuBox(
                            expanded = roleExpanded,
                            onExpandedChange = { roleExpanded = !roleExpanded }
                        ) {
                            OutlinedTextField(
                                value = if (role == "Admin") "Admin" else "Kullanıcı",
                                onValueChange = {},
                                readOnly = true,
                                label = { Text("Rol") },
                                trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = roleExpanded) },
                                modifier = Modifier
                                    .menuAnchor()
                                    .fillMaxWidth(),
                                isError = errors.containsKey("role"),
                                supportingText = errors["role"]?.let { { Text(it) } }
                            )
                            ExposedDropdownMenu(
                                expanded = roleExpanded,
                                onDismissRequest = { roleExpanded = false }
                            ) {
                                DropdownMenuItem(
                                    text = { Text("Kullanıcı") },
                                    onClick = {
                                        role = "User"
                                        roleExpanded = false
                                        errors = errors - "role"
                                    }
                                )
                                DropdownMenuItem(
                                    text = { Text("Admin") },
                                    onClick = {
                                        role = "Admin"
                                        roleExpanded = false
                                        errors = errors - "role"
                                    }
                                )
                            }
                        }
                    }

                    // Status (only for edit)
                    if (isEditMode) {
                        var statusExpanded by remember { mutableStateOf(false) }
                        Box(modifier = Modifier.fillMaxWidth()) {
                            ExposedDropdownMenuBox(
                                expanded = statusExpanded,
                                onExpandedChange = { statusExpanded = !statusExpanded }
                            ) {
                                OutlinedTextField(
                                    value = if (status == "Active") "Aktif" else "Pasif",
                                    onValueChange = {},
                                    readOnly = true,
                                    label = { Text("Durum") },
                                    trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = statusExpanded) },
                                    modifier = Modifier
                                        .menuAnchor()
                                        .fillMaxWidth(),
                                    isError = errors.containsKey("status"),
                                    supportingText = errors["status"]?.let { { Text(it) } }
                                )
                                ExposedDropdownMenu(
                                    expanded = statusExpanded,
                                    onDismissRequest = { statusExpanded = false }
                                ) {
                                    DropdownMenuItem(
                                        text = { Text("Aktif") },
                                        onClick = {
                                            status = "Active"
                                            statusExpanded = false
                                            errors = errors - "status"
                                        }
                                    )
                                    DropdownMenuItem(
                                        text = { Text("Pasif") },
                                        onClick = {
                                            status = "Passive"
                                            statusExpanded = false
                                            errors = errors - "status"
                                        }
                                    )
                                }
                            }
                        }
                    }
                }

                Divider()

                // Footer Buttons
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(Spacing.md),
                    horizontalArrangement = Arrangement.spacedBy(Spacing.md)
                ) {
                    OutlinedButton(
                        onClick = onDismiss,
                        modifier = Modifier.weight(1f)
                    ) {
                        Text("İptal")
                    }
                    Button(
                        onClick = {
                            val validationErrors = validateForm(
                                name = name,
                                email = email,
                                password = password,
                                isEditMode = isEditMode
                            )
                            if (validationErrors.isEmpty()) {
                                if (isEditMode && editingUser != null) {
                                    viewModel.updateUser(
                                        id = editingUser!!.id,
                                        request = UserUpdateRequest(
                                            name = name.trim(),
                                            department = department.takeIf { it.isNotEmpty() },
                                            role = role,
                                            status = status
                                        )
                                    )
                                } else {
                                    viewModel.createUser(
                                        request = AdminCreateUserRequest(
                                            name = name.trim(),
                                            email = email.trim(),
                                            password = password,
                                            department = department.takeIf { it.isNotEmpty() },
                                            role = role
                                        )
                                    )
                                }
                            } else {
                                errors = validationErrors
                            }
                        },
                        modifier = Modifier.weight(1f),
                        enabled = !isLoading && isFormValid(name, email, password, isEditMode)
                    ) {
                        if (isLoading) {
                            CircularProgressIndicator(
                                modifier = Modifier.size(16.dp),
                                color = androidx.compose.ui.graphics.Color.White,
                                strokeWidth = 2.dp
                            )
                        } else {
                            Text("Kaydet")
                        }
                    }
                }
            }
        }
    }
}

private fun isFormValid(
    name: String,
    email: String,
    password: String,
    isEditMode: Boolean
): Boolean {
    return name.trim().isNotEmpty() &&
            email.trim().isNotEmpty() &&
            (isEditMode || password.isNotEmpty())
}

private fun validateForm(
    name: String,
    email: String,
    password: String,
    isEditMode: Boolean
): Map<String, String> {
    val errors = mutableMapOf<String, String>()

    if (name.trim().isEmpty()) {
        errors["name"] = "Ad soyad gereklidir"
    }

    if (email.trim().isEmpty()) {
        errors["email"] = "Email gereklidir"
    } else if (!android.util.Patterns.EMAIL_ADDRESS.matcher(email.trim()).matches()) {
        errors["email"] = "Geçerli bir email adresi giriniz"
    }

    if (!isEditMode && password.isEmpty()) {
        errors["password"] = "Şifre gereklidir"
    } else if (!isEditMode && password.length < 6) {
        errors["password"] = "Şifre en az 6 karakter olmalıdır"
    }

    return errors
}

