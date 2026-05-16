# Excelence Care — Prémiový salon krásy

Jednostránkový web pro salon **Excelence Care** v Kopřivnici (depilace, péče o tělo).
Postaven na čistém HTML + Tailwind (CDN), bez build kroku — stačí otevřít v prohlížeči.

## Soubory

| Soubor | Popis |
|---|---|
| `index.html` | Hlavní stránka |
| `maison-luxe-light (1).html` | Stará záloha (lze smazat) |

## Lokální spuštění

Otevřete `index.html` v prohlížeči. Žádné `npm install` ani build.

## Live URLs

| Prostředí | URL |
|---|---|
| Vercel produkce (clean alias) | https://excellence-care.vercel.app |
| Vercel (česká varianta) | https://excelence-care.vercel.app |
| Vercel (legacy alias) | https://maison-luxe-three.vercel.app |
| GitHub Pages | https://quservices.github.io/excellence-care/ |
| GitHub repo | https://github.com/quservices/excellence-care |

Každý `git push` na `main` automaticky nasadí novou verzi na Vercel během ~10 s.

## Nasazení na GitHub Pages

1. Pushněte tento repozitář na GitHub.
2. V repu jděte na **Settings → Pages**.
3. **Source**: `Deploy from a branch`, **Branch**: `main` / `(root)`.
4. Web bude dostupný na `https://<vase-jmeno>.github.io/<repo>/`.

## Vlastní doména

V **Settings → Pages → Custom domain** zadejte doménu a v DNS poskytovatele
nastavte `CNAME` na `<vase-jmeno>.github.io.`.

## Co web obsahuje

- Hero sekce s parallax obrázky a animacemi
- O salonu — kvalifikace, hygiena, prémiové značky
- Statistiky (Google rating, klientky, roky)
- Služby & ceník (6 služeb)
- Galerie s lightboxem (klávesy ←/→/Esc)
- Recenze (3 karty)
- Kontakt + interaktivní mapa s vlastním pin markerem
- Akční tlačítka mapy: navigovat / kopírovat adresu / sdílet
- Doprava (parkování, MHD, vlak)
- Footer s CTA na rezervaci

## Editace obsahu

- **Adresa, telefon, e-mail**: hledejte sekci `<!-- KONTAKT + MAPA -->`
- **Ceník**: sekce `<!-- SLUŽBY & CENÍK -->`, karty `.srv-card`
- **Mapa**: GPS souřadnice v `iframe src` (parametr `bbox` a `marker`)
- **Rezervační URL**: hledejte `https://www.notino.cz` a nahraďte vlastní URL
- **Social odkazy**: footer, `<a href="https://instagram.com">…`

## Licence

© Excelence Care — všechna práva vyhrazena.
