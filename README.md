Xpay: Secure Medical Procurement via XRPL
A specialized Web3 application leveraging the Xaman (formerly Xumm) Universal SDK and Firebase to provide an identity-verified gateway for medical device procurement.

🚀 The Vision
Xpay aligns patient demographics (stored securely in Firestore) with blockchain-based transactions (executed on the XRPL). This ensures that every medical procurement is tied to a verified identity, providing a clear audit trail for healthcare providers.

🏗️ Architectural Flow
The application follows a strict logic path to ensure patient data is captured before any financial transaction is authorized:

Code snippet
graph TD
    A[Landing Page] --> B{Google Auth}
    B --> C{Profile Exists in Firestore?}
    C -- No --> D[Secure Onboarding Form]
    D --> E[Items Portal Page]
    C -- Yes --> E
    E --> F{Xaman Wallet Linked?}
    F -- No --> G[Xaman Authorize]
    G --> H[Create XRPL Payload]
    F -- Yes --> H
    H --> I[Xaman Sign Redirect]
    I --> J[Success Verification]
    J --> K[Update Firestore History]
🛠️ Tech Stack
Frontend: React (Vite) with TypeScript

Identity: Firebase Authentication (Google OAuth)

Database: Cloud Firestore (Real-time patient record syncing)

Blockchain: Xaman Universal SDK (XRPL)

🔒 Security & Routing Implementations
To operate within secure cloud environments, this project implements specific configurations:

Plural Routing Strategy: All protected portal routes use the plural path /items to ensure consistency between the ProtectedRoute and App.tsx.

Firestore Security Rules: Implements a "Production-ready" ruleset that restricts users to reading/writing only their own users profile and transactions records.

Frontend-Only Verification: Designed for the Firebase Spark (Free) Plan; uses the Xaman Payload UUID to verify transaction signatures directly on the client-side without Cloud Functions.

Composite Indexing: Requires a Firestore composite index to allow real-time orderBy queries on the Transaction History table.

📖 Setup & Development
Firebase Authorized Domains: Add your cloudworkstations.dev domain to the Firebase Console to prevent window.close blocking.

Environment Variables:

BASE_URL: Must match your current active workstation URL (e.g., https://5173-...cloudworkstations.dev).

Ensure all navigation calls (in SuccessPage, LandingPage, etc.) point to /items (plural).

Firestore Rules: Publish the consolidated ruleset to allow the transactions collection to be written to during the success redirect.

