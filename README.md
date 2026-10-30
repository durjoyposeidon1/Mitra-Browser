# MITRA BROWSER

> **Official Tagline:** Browse Beyond Limits.  
> **Brand Identity:** Modern, Premium, Fast, Secure, Intelligent, Privacy-focused  
> **Primary Colors:** Deep Navy (`#080D24`), Dark (`#0B1025`), Cyan (`#00D9FF`), Blue (`#2864FF`), Purple (`#8B35FF`), Magenta (`#C735E8`), White (`#FFFFFF`).

---

## 1. Project Overview & Multi-Platform Architecture

MITRA BROWSER is an advanced, production-oriented cross-platform web browser delivering real web browsing with built-in ad/tracker blocking, hardware-grade cryptographic password protection, and server-side Gemini 3.8 Flash AI copilot capabilities.

```
mitra-browser/
├── android/                             # 100% Native Android Kotlin Implementation
│   ├── app/
│   │   ├── build.gradle.kts             # AndroidX, Material 3, Room, Biometrics
│   │   └── src/main/
│   │       ├── AndroidManifest.xml      # Browser default intent filters & permissions
│   │       └── java/com/mitra/browser/
│   │           ├── MainActivity.kt      # Native Activity, WebView & Navigation
│   │           ├── adblock/
│   │           │   └── AdBlockerEngine.kt # Request interceptor filter
│   │           ├── data/db/
│   │           │   ├── MitraDatabase.kt # Room database definition
│   │           │   └── entities/        # History & Bookmark entities
│   │           └── security/
│   │               └── KeystoreHelper.kt # AndroidKeyStore biometric hardware security
│   ├── build.gradle.kts
│   └── settings.gradle.kts
│
├── electron/                            # Standalone Desktop Production Process
│   ├── main.ts                          # Chromium process, safeStorage, IPC
│   └── preload.ts                       # Secure ContextBridge API (nodeIntegration: false)
│
├── src/                                 # Shared Frontend & Browser Engine
│   ├── components/
│   │   ├── AddressBar.tsx               # Smart Omnibox, TLS security popover, shield
│   │   ├── HeaderTabBar.tsx             # Tab strip, groups, pin, mute, mode switcher
│   │   ├── BrowserViewport.tsx          # Real web rendering, progress, zoom, find
│   │   ├── MitraHomepage.tsx            # Official branding, search, shortcuts, clock
│   │   ├── MitraAIPanel.tsx             # Gemini 3.8 Flash copilot side-panel
│   │   ├── AndroidEmulatorView.tsx      # Interactive Android Pixel 9 / Tablet view
│   │   ├── ArchitectureDocsModal.tsx    # Technical specifications & build guides
│   │   └── drawers/                     # Bookmarks, History, Downloads, Vault, Privacy
│   ├── shared/
│   │   ├── types.ts                     # Core TypeScript models
│   │   ├── defaults.ts                  # Brand colors, tracker blocklist, shortcuts
│   │   └── vault.ts                     # AES-GCM 256-bit PBKDF2 WebCrypto engine
│   ├── App.tsx                          # Core Browser Controller
│   └── main.tsx
│
└── server.ts                            # Full-Stack Web Engine, Proxy & Gemini Gateway
```

---

## 2. Features Implemented

### Desktop MVP & Advanced Capabilities
1. **Real Chromium Web Browsing Engine:** Navigates live HTTP & HTTPS websites with full DOM rendering, framing bypass, and script execution.
2. **Advanced Tab Management:** Multi-tabbing, duplicate, close, pinned tabs, tab groups with custom color indicators, tab audio mute indicators, and session restoration.
3. **Smart Omnibox:** Real-time URL resolution, search engine query formatting (Google, DuckDuckGo, Bing, Brave), copy to clipboard, and bookmark toggling.
4. **Site Security Inspector:** TLS 1.3 handshake verification, cipher suite details, verified CA badges, and per-site permission controls (Camera, Mic, Location, Notifications).
5. **Ad & Tracker Blocker:** Active network filtering against EasyList and EasyPrivacy domain rules with live counter telemetry and saved bandwidth calculation.
6. **MITRA AI Copilot (Gemini 3.8 Flash):** Instant webpage summarization, difficult article explanation, in-context Q&A, translation, and structured research extraction.
7. **AES-GCM 256-Bit Password Vault:** Zero-knowledge cryptographic password vault derived with PBKDF2 (100,000 iterations); passwords never stored in plain text.
8. **Reader Mode:** Distraction-free article extraction with customizable typography (Sans, Serif, Mono), themes (Dark, Sepia, Light), and reading time estimation.

### Android Native Features
1. **Kotlin Native Project:** Complete Android Studio project with `AndroidManifest.xml` registering default web browser intent filters.
2. **Android WebView & WebChromeClient:** Handles mixed content security, hardware acceleration, gesture zooming, and back button dispatcher.
3. **Room SQLite Database:** `MitraDatabase` with DAO models for offline bookmarking and browsing history.
4. **Android AdBlockerEngine:** Overrides `shouldInterceptRequest` to neutralize telemetry domains before requests leave the mobile device.
5. **Interactive Android Preview:** Switch between Pixel 9 Pro and Pixel Tablet viewports with mobile tab switcher cards and bottom navigation bar.

---

## 3. Build & Packaging Instructions

### Windows 10 & 11 Desktop Executable
```bash
# 1. Install dependencies
npm install

# 2. Compile frontend assets
npm run build

# 3. Package Windows 64-bit installer (.exe)
npx electron-builder --win --x64
```
Output: `dist/MITRA-Browser-Setup-1.2.0.exe`

### Android APK (Direct Sideloading)
```bash
cd android
./gradlew assembleRelease
```
Output: `android/app/build/outputs/apk/release/mitra-browser-1.2.0.apk`

### Android AAB (Google Play Store Bundle)
```bash
cd android
./gradlew bundleRelease
```
Output: `android/app/build/outputs/bundle/release/mitra-browser-1.2.0.aab`

---

## 4. Security Verification
- **Untrusted Content Sanitization:** Webpage data passed to MITRA AI is marked untrusted to prevent prompt injection.
- **Context Isolation:** Electron renderer processes run sandboxed with `nodeIntegration: false`.
- **Zero Plaintext Storage:** Passwords require master passphrase decryption in memory.
