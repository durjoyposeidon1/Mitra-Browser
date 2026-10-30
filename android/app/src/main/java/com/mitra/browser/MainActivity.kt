package com.mitra.browser

import android.annotation.SuppressLint
import android.graphics.Bitmap
import android.os.Bundle
import android.view.View
import android.webkit.*
import android.widget.*
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity
import com.mitra.browser.adblock.AdBlockerEngine
import com.mitra.browser.data.db.MitraDatabase
import com.mitra.browser.data.db.entities.HistoryEntity
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

/**
 * MITRA BROWSER - Native Android Implementation
 * Architecture: Kotlin + Android WebView + Room + AdBlockerEngine + Biometrics
 * Tagline: Browse Beyond Limits.
 */
class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var addressBar: AutoCompleteTextView
    private lateinit var progressBar: ProgressBar
    private lateinit var btnBack: ImageButton
    private lateinit var btnForward: ImageButton
    private lateinit var btnReload: ImageButton
    private lateinit var btnTabs: Button
    private lateinit var btnMenu: ImageButton
    private lateinit var securityBadge: ImageView

    private val adBlocker = AdBlockerEngine()
    private lateinit var db: MitraDatabase
    private val scope = CoroutineScope(Dispatchers.Main)

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        db = MitraDatabase.getInstance(applicationContext)

        initViews()
        setupWebView()
        setupNavigationControls()
        setupBackHandler()

        // Handle incoming browser intent or default homepage
        val intentUrl = intent?.dataString ?: "https://duckduckgo.com"
        loadUrl(intentUrl)
    }

    private fun initViews() {
        webView = findViewById(R.id.webView)
        addressBar = findViewById(R.id.addressBar)
        progressBar = findViewById(R.id.progressBar)
        btnBack = findViewById(R.id.btnBack)
        btnForward = findViewById(R.id.btnForward)
        btnReload = findViewById(R.id.btnReload)
        btnTabs = findViewById(R.id.btnTabs)
        btnMenu = findViewById(R.id.btnMenu)
        securityBadge = findViewById(R.id.securityBadge)
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebView() {
        val settings = webView.settings
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.databaseEnabled = true
        settings.useWideViewPort = true
        settings.loadWithOverviewMode = true
        settings.builtInZoomControls = true
        settings.displayZoomControls = false
        settings.setSupportZoom(true)
        settings.allowFileAccess = false
        settings.allowContentAccess = false
        settings.mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW
        settings.userAgentString = "${settings.userAgentString} MitraBrowser/1.2.0 Mobile"

        webView.webViewClient = object : WebViewClient() {
            override fun shouldInterceptRequest(
                view: WebView?,
                request: WebResourceRequest?
            ): WebResourceResponse? {
                val url = request?.url?.toString() ?: return null
                if (adBlocker.isBlocked(url)) {
                    // Block tracker or advertisement request
                    return WebResourceResponse("text/plain", "UTF-8", null)
                }
                return super.shouldInterceptRequest(view, request)
            }

            override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                super.onPageStarted(view, url, favicon)
                progressBar.visibility = View.VISIBLE
                addressBar.setText(url)
                updateSecurityBadge(url)
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                progressBar.visibility = View.GONE
                btnBack.isEnabled = webView.canGoBack()
                btnForward.isEnabled = webView.canGoForward()

                if (url != null) {
                    scope.launch(Dispatchers.IO) {
                        db.historyDao().insert(
                            HistoryEntity(
                                title = view?.title ?: url,
                                url = url,
                                timestamp = System.currentTimeMillis()
                            )
                        )
                    }
                }
            }
        }

        webView.webChromeClient = object : WebChromeClient() {
            override fun onProgressChanged(view: WebView?, newProgress: Int) {
                progressBar.progress = newProgress
                if (newProgress == 100) {
                    progressBar.visibility = View.GONE
                }
            }

            override fun onReceivedTitle(view: WebView?, title: String?) {
                super.onReceivedTitle(view, title)
            }
        }
    }

    private fun setupNavigationControls() {
        addressBar.setOnEditorActionListener { _, _, _ ->
            val input = addressBar.text.toString().trim()
            loadUrl(input)
            true
        }

        btnBack.setOnClickListener {
            if (webView.canGoBack()) webView.goBack()
        }

        btnForward.setOnClickListener {
            if (webView.canGoForward()) webView.goForward()
        }

        btnReload.setOnClickListener {
            webView.reload()
        }
    }

    private fun loadUrl(rawInput: String) {
        val targetUrl = when {
            rawInput.startsWith("http://") || rawInput.startsWith("https://") -> rawInput
            rawInput.contains(".") && !rawInput.contains(" ") -> "https://$rawInput"
            else -> "https://www.google.com/search?q=${java.net.URLEncoder.encode(rawInput, "UTF-8")}"
        }
        webView.loadUrl(targetUrl)
    }

    private fun updateSecurityBadge(url: String?) {
        val isHttps = url?.startsWith("https://") == true
        securityBadge.setImageResource(
            if (isHttps) R.drawable.ic_lock_closed else R.drawable.ic_lock_open
        )
    }

    private fun setupBackHandler() {
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack()
                } else {
                    finish()
                }
            }
        })
    }
}
