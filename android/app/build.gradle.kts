plugins {
    id("com.android.application")
    id("kotlin-android")
}

android {
    namespace = "com.glotvia.app"
    compileSdk = 36 // Google Play 2026 Android 16 target requirement

    defaultConfig {
        applicationId = "com.glotvia.app"
        minSdk = 24 // Android 7.0+ (95%+ global device coverage)
        targetSdk = 36 // Google Play Target SDK 36 requirement
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    signingConfigs {
        create("release") {
            // Environment variables or key.properties for safe, non-hardcoded credential signing
            val keystoreFile = System.getenv("KEYSTORE_FILE") ?: "glotvia-release.jks"
            val keystorePassword = System.getenv("KEYSTORE_PASSWORD")
            val keyAliasStr = System.getenv("KEY_ALIAS") ?: "glotvia"
            val keyPasswordStr = System.getenv("KEY_PASSWORD")

            if (keystorePassword != null && keyPasswordStr != null && file(keystoreFile).exists()) {
                storeFile = file(keystoreFile)
                storePassword = keystorePassword
                keyAlias = keyAliasStr
                keyPassword = keyPasswordStr
            }
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            signingConfig = signingConfigs.getByName("release")
        }
        debug {
            applicationIdSuffix = ".debug"
            isDebuggable = true
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.13.1")
    implementation("androidx.appcompat:appcompat:1.7.0")
    implementation("com.google.android.material:material:1.12.0")
    
    // Trusted Web Activity (TWA) & Google Play In-App Billing Support
    implementation("com.google.androidbrowserhelper:androidbrowserhelper:2.5.0")
    implementation("com.google.androidbrowserhelper:billing:1.0.0-alpha11")
}
