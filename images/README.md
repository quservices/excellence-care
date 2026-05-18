# Fotky pro web Exelance Care

Sem si uložte vlastní fotky kategorií. Pokud soubor existuje, web ho použije; pokud ne, automaticky se zobrazí fallback z Unsplash.

## Očekávané názvy

| Soubor | Kategorie | Co tam dát |
|---|---|---|
| `maderoterapie.jpg` | Přístrojová maderoterapie | Fotka s VIBROSLIMFIT / BYELMARIE — momentka procedury |
| `liposukce.jpg` | Neinvazivní liposukce | Fotka ošetření kavitací nebo radiofrekvencí |
| `pedikura.jpg` | Spa pedikúra | Fotka relaxační pedikúry / lázně chodidel |
| `depilace.jpg` | Depilace | Fotka procedury voskem / cukrovou pastou |

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
