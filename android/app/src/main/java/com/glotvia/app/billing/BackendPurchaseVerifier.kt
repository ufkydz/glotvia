package com.glotvia.app.billing

import org.json.JSONObject
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL

data class VerificationResult(
    val isSuccess: Boolean,
    val premium: Boolean,
    val productId: String? = null,
    val expiresAt: Long? = null,
    val message: String? = null
)

class BackendPurchaseVerifier(
    private val backendBaseUrl: String,
    private val authTokenProvider: () -> String?
) {
    fun verifyPurchaseOnBackend(
        productId: String,
        purchaseToken: String,
        orderId: String
    ): VerificationResult {
        return try {
            val url = URL("$backendBaseUrl/api/purchases/verify")
            val conn = url.openConnection() as HttpURLConnection
            conn.requestMethod = "POST"
            conn.setRequestProperty("Content-Type", "application/json; charset=UTF-8")
            
            val token = authTokenProvider()
            if (!token.isNullOrEmpty()) {
                conn.setRequestProperty("Authorization", "Bearer $token")
            }
            conn.doOutput = true
            conn.connectTimeout = 10000
            conn.readTimeout = 10000

            val jsonBody = JSONObject().apply {
                put("productId", productId)
                put("purchaseToken", purchaseToken)
                put("orderId", orderId)
            }

            OutputStreamWriter(conn.outputStream).use { writer ->
                writer.write(jsonBody.toString())
                writer.flush()
            }

            val responseCode = conn.responseCode
            if (responseCode == HttpURLConnection.HTTP_OK) {
                val responseText = conn.inputStream.bufferedReader().use { it.readText() }
                val json = JSONObject(responseText)
                VerificationResult(
                    isSuccess = json.optBoolean("success", true),
                    premium = json.optBoolean("premium", true),
                    productId = json.optString("productId", productId),
                    expiresAt = if (json.has("expiresAt")) json.optLong("expiresAt") else null,
                    message = json.optString("message", "Doğrulandı")
                )
            } else {
                VerificationResult(
                    isSuccess = false,
                    premium = false,
                    message = "Sunucu yanıt vermedi: HTTP $responseCode"
                )
            }
        } catch (e: Exception) {
            VerificationResult(
                isSuccess = false,
                premium = false,
                message = "Bağlantı hatası: ${e.localizedMessage}"
            )
        }
    }
}
