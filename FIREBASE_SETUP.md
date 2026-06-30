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

Přihlašování běží přes **přihlašovací jméno** (ne přes e-mail). Jméno `admin.exelance`
si kód v `admin.html` automaticky doplní na `admin.exelance@exelance.cz`
(Firebase technicky vyžaduje formát e-mailu).

- Záložka **Users → Add user**
- Email: `admin.exelance@exelance.cz`
- Password: `661800` (klidně silnější — min. 6 znaků)
- Add user

> Na přihlašovací obrazovce `admin.html` pak zadáváš jen:
> **Přihlašovací jméno:** `admin.exelance`  ·  **Heslo:** `661800`
> (Přihlásí se kterýkoliv účet vytvořený zde v Console — kód se nemění.)

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

## Účty: majitelka, správci, zaměstnanci

Přihlašovací obrazovka se ptá na **e-mail i heslo**, takže se přihlásí kterýkoliv
účet vytvořený ve Firebase Console — kód už není potřeba měnit.

**Správa účtů (zakládání, hesla, přehled) = Firebase Console → Authentication → Users.**
Sem má přístup jen majitel Firebase/Google projektu (vy, správci) — ne majitelka salonu.
Tady děláš úplně všechno:

| Akce | Kde |
|------|-----|
| 📋 Přehled, kolik účtů existuje + poslední přihlášení | seznam v **Users** |
| ➕ Založit účet (majitelce / zaměstnanci) | **Add user** (e-mail + heslo) |
| 🔑 Změnit / resetovat heslo cizímu účtu | u účtu **⋮ → Reset password** (reset link), nebo smaž + vytvoř znovu |
| 🗑️ Zrušit přístup | u účtu **⋮ → Delete account** |

> ⚠️ Všechny přihlášené účty mají v panelu zatím **stejná práva** (správa rezervací).
> „Super-admin" úroveň máš automaticky tím, že vlastníš Firebase projekt (Console).
> Pokud bys někdy chtěl rozlišovat práva i uvnitř panelu, je potřeba doplnit role
> (Cloud Functions + custom claims).

## Lokální testování

Firebase Auth a Firestore fungují i z lokálního souboru přes live-server (port 5500), POKUD je v Firebase Console v **Authentication → Settings → Authorized domains** přidáno `localhost` (defaultně tam je).

```bash
npx live-server --port=5500 .
```

Pak otevři <http://localhost:5500/admin.html>.
