# Fotky pro web Exelance Care

Sem si uložte vlastní fotky kategorií. Pokud soubor existuje, web ho použije; pokud ne, automaticky se zobrazí fallback z Unsplash.

## Očekávané názvy

| Soubor | Kde se zobrazí | Doporučení |
|---|---|---|
| **`logo.png`** | **Nav, footer, voucher karta, O salonu** | **Logo "EXELANCE CARE" v zlaté barvě, transparentní PNG, šířka ~800px** |
| `maderoterapie.jpg` | Přístrojová maderoterapie | Fotka s VIBROSLIMFIT / BYELMARIE — momentka procedury |
| `liposukce.jpg` | Neinvazivní liposukce | Fotka ošetření kavitací nebo radiofrekvencí |
| `pedikura.jpg` | Spa pedikúra | Fotka relaxační pedikúry / lázně chodidel |
| `depilace.jpg` | Depilace | Fotka procedury voskem / cukrovou pastou |

### Logo PNG — důležité!

- **Transparentní pozadí** (PNG s alpha kanálem) — aby logo sedělo na bílém pozadí webu bez krémového rámu
- **Šířka cca 800px** — automaticky se škáluje na 54px (nav), 96px (footer), 80px (voucher), 50px (O salonu)
- Pokud `logo.png` neexistuje, web automaticky zobrazí text "EXELANCE / CARE" v Italiana fontu jako fallback

## Doporučené parametry

- **Formát**: JPG (menší velikost) nebo PNG
- **Rozlišení**: 900×600 px (3:2) — případně větší, web si přizpůsobí
- **Velikost souboru**: do 200 KB ideálně (kvůli rychlosti načítání)
- **Optimalizace**: použijte https://tinyjpg.com nebo https://squoosh.app

## Jak to funguje

V HTML je u každé kategorie:

```html
<img src="images/maderoterapie.jpg"
     onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-...'"
     alt="..." />
```

Když soubor neexistuje, prohlížeč spadne na Unsplash fallback. Žádné chybové stránky, žádný broken image.
