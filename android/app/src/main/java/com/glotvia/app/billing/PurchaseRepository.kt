package com.glotvia.app.billing

import android.app.Activity
import com.android.billingclient.api.ProductDetails
import kotlinx.coroutines.flow.StateFlow

class PurchaseRepository(
    private val billingManager: BillingManager
) {
    val uiState: StateFlow<BillingUiState> = billingManager.uiState
    val productsMap: StateFlow<Map<String, ProductDetails>> = billingManager.productsMap

    fun purchase(activity: Activity, productId: String, userId: String) {
        billingManager.launchPurchaseFlow(activity, productId, userId)
    }

    fun restorePurchases() {
        billingManager.queryActivePurchases()
    }
}
