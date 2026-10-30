package com.mitra.browser.adblock

import java.net.URI

/**
 * High-performance domain-matching content blocker for Android WebView.
 */
class AdBlockerEngine {
    private val blockedDomains = hashSetOf(
        "google-analytics.com",
        "googletagmanager.com",
        "doubleclick.net",
        "googlesyndication.com",
        "adservice.google.com",
        "criteo.com",
        "criteo.net",
        "taboola.com",
        "outbrain.com",
        "adnxs.com",
        "rubiconproject.com",
        "scorecardresearch.com",
        "quantserve.com",
        "hotjar.com",
        "connect.facebook.net",
        "ads-twitter.com",
        "amazon-adsystem.com",
        "adroll.com"
    )

    fun isBlocked(url: String): Boolean {
        return try {
            val host = URI(url).host?.lowercase() ?: return false
            blockedDomains.any { host == it || host.endsWith(".$it") }
        } catch (_: Exception) {
            false
        }
    }
}
