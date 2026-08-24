package com.glotvia.app.billing

/**
 * Centralized Google Play Billing Product Configuration
 */
object BillingConstants {
    // 1. Subscription Products (Abonelikler)
    const val PRODUCT_BRONZE = "premium_bronze"
    const val PRODUCT_GOLD = "premium_gold"

    // 2. In-App One-Time Product (Tek Seferlik Ömür Boyu VIP)
    const val PRODUCT_PLATINUM = "premium_platinum"

    // Product ID Lists
    val SUBSCRIPTION_PRODUCT_IDS = listOf(
        PRODUCT_BRONZE,
        PRODUCT_GOLD
    )

    val IN_APP_PRODUCT_IDS = listOf(
        PRODUCT_PLATINUM
    )

    val ALL_PRODUCT_IDS = SUBSCRIPTION_PRODUCT_IDS + IN_APP_PRODUCT_IDS

    // Subscription Base Plan IDs
    const val BASE_PLAN_BRONZE_MONTHLY = "monthly-standard"
    const val BASE_PLAN_GOLD_YEARLY = "yearly-standard"

    // Management URL
    const val PLAY_STORE_SUBSCRIPTION_DEEPLINK = 
        "https://play.google.com/store/account/subscriptions?sku=%s&package=com.glotvia.app"
}
