package com.glotvia.app.billing

import android.app.Activity
import android.content.Context
import com.android.billingclient.api.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

sealed class BillingUiState {
    object Idle : BillingUiState()
    object Loading : BillingUiState()
    data class Purchasing(val productId: String) : BillingUiState()
    data class Verifying(val purchaseToken: String) : BillingUiState()
    data class Success(val productId: String, val orderId: String) : BillingUiState()
    object Pending : BillingUiState()
    data class AlreadyOwned(val productId: String) : BillingUiState()
    object Canceled : BillingUiState()
    data class Error(val code: Int, val message: String) : BillingUiState()
}

class BillingManager(
    private val context: Context,
    private val scope: CoroutineScope,
    private val verifier: BackendPurchaseVerifier
) : PurchasesUpdatedListener, BillingClientStateListener {

    private val _uiState = MutableStateFlow<BillingUiState>(BillingUiState.Idle)
    val uiState: StateFlow<BillingUiState> = _uiState.asStateFlow()

    private val _productsMap = MutableStateFlow<Map<String, ProductDetails>>(emptyMap())
    val productsMap: StateFlow<Map<String, ProductDetails>> = _productsMap.asStateFlow()

    private val billingClient: BillingClient = BillingClient.newBuilder(context)
        .setListener(this)
        .enablePendingPurchases(
            PendingPurchasesParams.newBuilder()
                .enableOneTimeProducts()
                .build()
        )
        .build()

    init {
        startConnection()
    }

    fun startConnection() {
        _uiState.value = BillingUiState.Loading
        billingClient.startConnection(this)
    }

    override fun onBillingSetupFinished(billingResult: BillingResult) {
        if (billingResult.responseCode == BillingClient.BillingResponseCode.OK) {
            queryProductDetails()
            queryActivePurchases()
            _uiState.value = BillingUiState.Idle
        } else {
            _uiState.value = BillingUiState.Error(
                billingResult.responseCode,
                billingResult.debugMessage ?: "Billing Setup Error"
            )
        }
    }

    override fun onBillingServiceDisconnected() {
        // Auto-retry connection on next purchase or interval
    }

    fun queryProductDetails() {
        scope.launch(Dispatchers.IO) {
            val productList = mutableListOf<QueryProductDetailsParams.Product>()

            // 1. Subscriptions
            BillingConstants.SUBSCRIPTION_PRODUCT_IDS.forEach { id ->
                productList.add(
                    QueryProductDetailsParams.Product.newBuilder()
                        .setProductId(id)
                        .setProductType(BillingClient.ProductType.SUBS)
                        .build()
                )
            }

            // 2. In-App
            BillingConstants.IN_APP_PRODUCT_IDS.forEach { id ->
                productList.add(
                    QueryProductDetailsParams.Product.newBuilder()
                        .setProductId(id)
                        .setProductType(BillingClient.ProductType.INAPP)
                        .build()
                )
            }

            val params = QueryProductDetailsParams.newBuilder()
                .setProductList(productList)
                .build()

            billingClient.queryProductDetailsAsync(params) { billingResult, productDetailsResult ->
                if (billingResult.responseCode == BillingClient.BillingResponseCode.OK) {
                    val map = productDetailsResult.associateBy { it.productId }
                    _productsMap.value = map
                }
            }
        }
    }

    fun launchPurchaseFlow(activity: Activity, productId: String, userId: String) {
        val productDetails = _productsMap.value[productId]
        if (productDetails == null) {
            _uiState.value = BillingUiState.Error(
                BillingClient.BillingResponseCode.ITEM_UNAVAILABLE,
                "Ürün detayları yüklenemedi. Lütfen tekrar deneyin."
            )
            return
        }

        val productDetailsParamsList = mutableListOf<BillingFlowParams.ProductDetailsParams>()

        if (productDetails.productType == BillingClient.ProductType.SUBS) {
            val offerToken = productDetails.subscriptionOfferDetails?.firstOrNull()?.offerToken ?: ""
            productDetailsParamsList.add(
                BillingFlowParams.ProductDetailsParams.newBuilder()
                    .setProductDetails(productDetails)
                    .setOfferToken(offerToken)
                    .build()
            )
        } else {
            productDetailsParamsList.add(
                BillingFlowParams.ProductDetailsParams.newBuilder()
                    .setProductDetails(productDetails)
                    .build()
            )
        }

        val flowParams = BillingFlowParams.newBuilder()
            .setProductDetailsParamsList(productDetailsParamsList)
            .setObfuscatedAccountId(userId)
            .build()

        _uiState.value = BillingUiState.Purchasing(productId)
        val billingResult = billingClient.launchBillingFlow(activity, flowParams)

        if (billingResult.responseCode != BillingClient.BillingResponseCode.OK) {
            _uiState.value = BillingUiState.Error(
                billingResult.responseCode,
                billingResult.debugMessage ?: "Satın alma akışı başlatılamadı."
            )
        }
    }

    override fun onPurchasesUpdated(billingResult: BillingResult, purchases: List<Purchase>?) {
        when (billingResult.responseCode) {
            BillingClient.BillingResponseCode.OK -> {
                purchases?.forEach { handlePurchase(it) }
            }
            BillingClient.BillingResponseCode.USER_CANCELED -> {
                _uiState.value = BillingUiState.Canceled
            }
            BillingClient.BillingResponseCode.ITEM_ALREADY_OWNED -> {
                _uiState.value = BillingUiState.AlreadyOwned("purchased_item")
                queryActivePurchases()
            }
            else -> {
                _uiState.value = BillingUiState.Error(
                    billingResult.responseCode,
                    billingResult.debugMessage ?: "Satın alma tamamlanamadı."
                )
            }
        }
    }

    private fun handlePurchase(purchase: Purchase) {
        if (purchase.purchaseState == Purchase.PurchaseState.PURCHASED) {
            _uiState.value = BillingUiState.Verifying(purchase.purchaseToken)
            scope.launch(Dispatchers.IO) {
                val verified = verifier.verifyPurchaseOnBackend(
                    productId = purchase.products.firstOrNull() ?: "",
                    purchaseToken = purchase.purchaseToken,
                    orderId = purchase.orderId ?: ""
                )

                if (verified.isSuccess) {
                    // Acknowledge purchase
                    if (!purchase.isAcknowledged) {
                        val acknowledgeParams = AcknowledgePurchaseParams.newBuilder()
                            .setPurchaseToken(purchase.purchaseToken)
                            .build()
                        billingClient.acknowledgePurchase(acknowledgeParams) { ackResult ->
                            if (ackResult.responseCode == BillingClient.BillingResponseCode.OK) {
                                _uiState.value = BillingUiState.Success(
                                    purchase.products.firstOrNull() ?: "",
                                    purchase.orderId ?: ""
                                )
                            }
                        }
                    } else {
                        _uiState.value = BillingUiState.Success(
                            purchase.products.firstOrNull() ?: "",
                            purchase.orderId ?: ""
                        )
                    }
                } else {
                    _uiState.value = BillingUiState.Error(
                        -1,
                        verified.message ?: "Sunucu satın alma doğrulaması başarısız."
                    )
                }
            }
        } else if (purchase.purchaseState == Purchase.PurchaseState.PENDING) {
            _uiState.value = BillingUiState.Pending
        }
    }

    fun queryActivePurchases() {
        scope.launch(Dispatchers.IO) {
            // 1. Subscriptions
            billingClient.queryPurchasesAsync(
                QueryPurchasesParams.newBuilder()
                    .setProductType(BillingClient.ProductType.SUBS)
                    .build()
            ) { result, purchases ->
                if (result.responseCode == BillingClient.BillingResponseCode.OK) {
                    purchases.forEach { handlePurchase(it) }
                }
            }

            // 2. In-App
            billingClient.queryPurchasesAsync(
                QueryPurchasesParams.newBuilder()
                    .setProductType(BillingClient.ProductType.INAPP)
                    .build()
            ) { result, purchases ->
                if (result.responseCode == BillingClient.BillingResponseCode.OK) {
                    purchases.forEach { handlePurchase(it) }
                }
            }
        }
    }
}
