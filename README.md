Thirvo (Expo demo)

Quick start:

1. Install dependencies: npm install
2. Start Expo: npm start
3. Run on device or emulator via Expo dev tools or: npm run android | npm run ios | npm run web

Notes:
- This project includes a minimal shim for `platform-hooks` at ./platform-hooks.js to let the UI run as a demo. Replace with your real data layer when ready.
- To publish: install the Expo CLI and run `expo publish` (or use `eas` for managed builds).
- Default bundle identifiers added: iOS = com.thirvo.app, Android = com.thirvo.app. Change these in app.json before publishing if you prefer a different package namespace.
