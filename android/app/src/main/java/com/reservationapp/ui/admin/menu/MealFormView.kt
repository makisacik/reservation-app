package com.reservationapp.ui.admin.menu

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
import com.reservationapp.domain.model.Meal
import com.reservationapp.domain.model.MenuCategory
import com.reservationapp.domain.model.Restaurant
import com.reservationapp.ui.admin.AdminMenuViewModel
import java.net.URL

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MealFormView(
    isPresented: Boolean,
    viewModel: AdminMenuViewModel,
    onDismiss: () -> Unit
) {
    if (!isPresented) return

    val editingMeal by viewModel.editingMeal.collectAsState()
    val categories by viewModel.categories.collectAsState()
    val restaurants by viewModel.restaurants.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()

    val isEditMode = editingMeal != null

    var name by remember { mutableStateOf(editingMeal?.name ?: "") }
    var categoryId by remember { mutableStateOf(editingMeal?.categoryId ?: "") }
    var restaurantId by remember { mutableStateOf(editingMeal?.restaurantId ?: "") }
    var price by remember { mutableStateOf(editingMeal?.price?.toString() ?: "") }
    var kcal by remember { mutableStateOf(editingMeal?.kcal?.toString() ?: "") }
    var imageUrl by remember { mutableStateOf(editingMeal?.imageUrl ?: "") }
    var description by remember { mutableStateOf(editingMeal?.description ?: "") }

    var errors by remember { mutableStateOf<Map<String, String>>(emptyMap()) }

    LaunchedEffect(editingMeal) {
        if (editingMeal != null) {
            name = editingMeal!!.name
            categoryId = editingMeal!!.categoryId
            restaurantId = editingMeal!!.restaurantId
            price = editingMeal!!.price?.toString() ?: ""
            kcal = editingMeal!!.kcal?.toString() ?: ""
            imageUrl = editingMeal!!.imageUrl ?: ""
            description = editingMeal!!.description ?: ""
            errors = emptyMap()
        } else {
            name = ""
            categoryId = ""
            restaurantId = ""
            price = ""
            kcal = ""
            imageUrl = ""
            description = ""
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
                        text = if (isEditMode) "Menü Düzenle" else "Yeni Menü Ekle",
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
                    // Menü Bilgileri Section
                    Text(
                        text = "Menü Bilgileri",
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
                        label = { Text("Menü Adı") },
                        modifier = Modifier.fillMaxWidth(),
                        isError = errors.containsKey("name"),
                        supportingText = errors["name"]?.let { { Text(it) } }
                    )

                    // Category
                    var categoryExpanded by remember { mutableStateOf(false) }
                    Box(modifier = Modifier.fillMaxWidth()) {
                        ExposedDropdownMenuBox(
                            expanded = categoryExpanded,
                            onExpandedChange = { categoryExpanded = !categoryExpanded }
                        ) {
                            OutlinedTextField(
                                value = categories.firstOrNull { it.id == categoryId }?.name ?: "Seçin",
                                onValueChange = {},
                                readOnly = true,
                                label = { Text("Kategori") },
                                trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = categoryExpanded) },
                                modifier = Modifier
                                    .menuAnchor()
                                    .fillMaxWidth(),
                                isError = errors.containsKey("categoryId"),
                                supportingText = errors["categoryId"]?.let { { Text(it) } }
                            )
                            ExposedDropdownMenu(
                                expanded = categoryExpanded,
                                onDismissRequest = { categoryExpanded = false }
                            ) {
                                categories.forEach { category ->
                                    DropdownMenuItem(
                                        text = { Text(category.name) },
                                        onClick = {
                                            categoryId = category.id
                                            categoryExpanded = false
                                            errors = errors - "categoryId"
                                        }
                                    )
                                }
                            }
                        }
                    }

                    // Restaurant
                    var restaurantExpanded by remember { mutableStateOf(false) }
                    Box(modifier = Modifier.fillMaxWidth()) {
                        ExposedDropdownMenuBox(
                            expanded = restaurantExpanded,
                            onExpandedChange = { restaurantExpanded = !restaurantExpanded }
                        ) {
                            OutlinedTextField(
                                value = restaurants.firstOrNull { it.id == restaurantId }?.name ?: "Seçin",
                                onValueChange = {},
                                readOnly = true,
                                label = { Text("Restoran") },
                                trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = restaurantExpanded) },
                                modifier = Modifier
                                    .menuAnchor()
                                    .fillMaxWidth(),
                                enabled = !isEditMode,
                                isError = errors.containsKey("restaurantId"),
                                supportingText = errors["restaurantId"]?.let { { Text(it) } }
                            )
                            ExposedDropdownMenu(
                                expanded = restaurantExpanded,
                                onDismissRequest = { restaurantExpanded = false }
                            ) {
                                restaurants.forEach { restaurant ->
                                    DropdownMenuItem(
                                        text = { Text(restaurant.name) },
                                        onClick = {
                                            restaurantId = restaurant.id
                                            restaurantExpanded = false
                                            errors = errors - "restaurantId"
                                        }
                                    )
                                }
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(Spacing.md))

                    // Ek Bilgiler Section
                    Text(
                        text = "Ek Bilgiler",
                        style = MaterialTheme.typography.titleMedium.copy(
                            fontWeight = FontWeight.SemiBold
                        ),
                        color = TextPrimary,
                        modifier = Modifier.padding(bottom = Spacing.xs)
                    )

                    // Price
                    OutlinedTextField(
                        value = price,
                        onValueChange = { price = it; errors = errors - "price" },
                        label = { Text("Fiyat (₺)") },
                        modifier = Modifier.fillMaxWidth(),
                        keyboardOptions = KeyboardOptions(
                            keyboardType = KeyboardType.Decimal
                        ),
                        isError = errors.containsKey("price"),
                        supportingText = errors["price"]?.let { { Text(it) } }
                    )

                    // Calories
                    OutlinedTextField(
                        value = kcal,
                        onValueChange = { kcal = it; errors = errors - "kcal" },
                        label = { Text("Kalori") },
                        modifier = Modifier.fillMaxWidth(),
                        keyboardOptions = KeyboardOptions(
                            keyboardType = KeyboardType.Number
                        ),
                        isError = errors.containsKey("kcal"),
                        supportingText = errors["kcal"]?.let { { Text(it) } }
                    )

                    // Image URL
                    OutlinedTextField(
                        value = imageUrl,
                        onValueChange = { imageUrl = it; errors = errors - "imageUrl" },
                        label = { Text("Görsel URL") },
                        modifier = Modifier.fillMaxWidth(),
                        keyboardOptions = KeyboardOptions(
                            keyboardType = KeyboardType.Uri
                        ),
                        isError = errors.containsKey("imageUrl"),
                        supportingText = errors["imageUrl"]?.let { { Text(it) } }
                    )

                    // Description
                    OutlinedTextField(
                        value = description,
                        onValueChange = { description = it },
                        label = { Text("Açıklama") },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(100.dp),
                        maxLines = 4
                    )
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
                                categoryId = categoryId,
                                restaurantId = restaurantId,
                                price = price,
                                kcal = kcal,
                                imageUrl = imageUrl,
                                isEditMode = isEditMode
                            )
                            if (validationErrors.isEmpty()) {
                                if (isEditMode && editingMeal != null) {
                                    viewModel.updateMeal(
                                        id = editingMeal!!.id,
                                        request = com.reservationapp.domain.model.UpdateMealRequest(
                                            name = name.trim(),
                                            categoryId = categoryId,
                                            description = description.takeIf { it.isNotEmpty() },
                                            price = price.takeIf { it.isNotEmpty() }?.toDoubleOrNull(),
                                            kcal = kcal.takeIf { it.isNotEmpty() }?.toIntOrNull(),
                                            imageUrl = imageUrl.takeIf { it.isNotEmpty() }
                                        )
                                    )
                                } else {
                                    viewModel.createMeal(
                                        request = com.reservationapp.domain.model.CreateMealRequest(
                                            name = name.trim(),
                                            categoryId = categoryId,
                                            restaurantId = restaurantId,
                                            description = description.takeIf { it.isNotEmpty() },
                                            price = price.takeIf { it.isNotEmpty() }?.toDoubleOrNull(),
                                            kcal = kcal.takeIf { it.isNotEmpty() }?.toIntOrNull(),
                                            imageUrl = imageUrl.takeIf { it.isNotEmpty() }
                                        )
                                    )
                                }
                            } else {
                                errors = validationErrors
                            }
                        },
                        modifier = Modifier.weight(1f),
                        enabled = !isLoading && isFormValid(name, categoryId, restaurantId, isEditMode)
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
    categoryId: String,
    restaurantId: String,
    isEditMode: Boolean
): Boolean {
    return name.trim().isNotEmpty() &&
            categoryId.isNotEmpty() &&
            (isEditMode || restaurantId.isNotEmpty())
}

private fun validateForm(
    name: String,
    categoryId: String,
    restaurantId: String,
    price: String,
    kcal: String,
    imageUrl: String,
    isEditMode: Boolean
): Map<String, String> {
    val errors = mutableMapOf<String, String>()

    if (name.trim().isEmpty()) {
        errors["name"] = "Menü adı gereklidir"
    }

    if (categoryId.isEmpty()) {
        errors["categoryId"] = "Kategori seçilmelidir"
    }

    if (!isEditMode && restaurantId.isEmpty()) {
        errors["restaurantId"] = "Restoran seçilmelidir"
    }

    if (price.isNotEmpty()) {
        if (price.toDoubleOrNull() == null) {
            errors["price"] = "Geçerli bir fiyat giriniz"
        }
    }

    if (kcal.isNotEmpty()) {
        val kcalValue = kcal.toIntOrNull()
        if (kcalValue == null || kcalValue < 0) {
            errors["kcal"] = "Geçerli bir kalori değeri giriniz"
        }
    }

    if (imageUrl.isNotEmpty()) {
        if (!isValidURL(imageUrl)) {
            errors["imageUrl"] = "Geçerli bir URL giriniz"
        }
    }

    return errors
}

private fun isValidURL(urlString: String): Boolean {
    return try {
        URL(urlString)
        true
    } catch (e: Exception) {
        false
    }
}

