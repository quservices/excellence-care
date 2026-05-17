# Firebase setup — Excelence Care

Admin login + rezervace běží na Firebase (Auth + Firestore + Hosting).
Tenhle návod tě provede nastavením od nuly za ~5 minut.

---

## 1. Založ Firebase projekt

1. Jdi na <https://console.firebase.google.com>
2. **Add project** → name: `excellence-care` → bez Google Analytics → Create
3. V projektu klikni na `</>` (Web app) → name: `excellence-care-web` → Register app
4. Zobrazí se konfigurace ve tvaru `const firebaseConfig = { apiKey: "...", ... }`. **Zkopíruj ji.**

## 2. Vlož config do `admin.html`

V [admin.html](admin.html) najdi blok `const firebaseConfig = { ... }` a nahraď `VLOZ_API_KEY`, `VLOZ_PROJECT_ID` skutečnými hodnotami z kroku 1.

## 3. Zapni Email/Password Auth

V Firebase Console:
- **Build → Authentication → Get started**
- Záložka **Sign-in method** → klik na **Email/Password** → enable → Save

### Vytvoř admin uživatele

- Záložka **Users → Add user**
- Email: `admin@excellencecare.cz`
- Password: `661800` (nebo jiné 6+ znakové)
- Add user

> Email i heslo musí přesně sedět s konstantou `ADMIN_EMAIL` v `admin.html`.

## 4. Zapni Firestore

- **Build → Firestore Database → Create database**
- Location: `eur3 (europe-west)` (nebo cokoli blízko ČR)
- Start in **production mode** → Next → Enable
- Po vytvoření jdi na záložku **Rules** a vlož obsah souboru [firestore.rules](firestore.rules) → Publish

## 5. Nasazení (Firebase Hosting)

```bash
npm i -g firebase-tools
firebase login                     # otevře browser
firebase use --add                 # vyber svůj projekt
firebase deploy --only hosting,firestore:rules
```

Po deployi dostaneš URL ve tvaru `https://excellence-care.web.app` — admin je na `/admin.html`.

---

## Změna hesla později

Firebase Console → Authentication → Users → … (kebab menu) → Reset password
(přijde reset link na email — nebo smaž uživatele a vytvoř nového).

## Přidání dalšího admina

Stačí v Firebase Console vytvořit dalšího uživatele s libovolným emailem.
Aby se uměl přihlásit přes login screen, musíš v `admin.html` rozšířit logiku — aktuálně je hardcoded jeden email `admin@excellencecare.cz`.

## Lokální testování

Firebase Auth a Firestore fungují i z lokálního souboru přes live-server (port 5500), POKUD je v Firebase Console v **Authentication → Settings → Authorized domains** přidáno `localhost` (defaultně tam je).

```bash
npx live-server --port=5500 .
```

Pak otevři <http://localhost:5500/admin.html>.
