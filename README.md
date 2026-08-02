# ⚔️ ELEMEN 🐉

Kartová hra o súboji živlov pre deti — v štýle zberateľských kartových hier.
Celá hra je jeden HTML súbor, po slovensky, s hlasovými nápovedami.

## 🎮 Hraj tu

**https://buletino.github.io/elemen/**

Funguje na mobile, tablete aj počítači — stačí otvoriť adresu v prehliadači.

### 📲 Ako si hru pridať na plochu (ako appku)

- **iPhone / iPad (Safari):** otvor hru → tlačidlo Zdieľať (štvorec so šípkou) → **Pridať na plochu**.
- **Android (Chrome):** otvor hru → menu ⋮ → **Pridať na plochu** (alebo „Inštalovať aplikáciu").

Po pridaní na plochu hra funguje **aj bez internetu**.

## ✏️ Ako robiť zmeny (aj z mobilu)

Hra sa nasadzuje automaticky: čokoľvek sa dostane do vetvy `main`, o ~1 minútu je naživo.

- **Claude Code** (odporúčané): otvor [claude.ai/code](https://claude.ai/code) (funguje aj v mobilnom prehliadači alebo v appke Claude), vyber tento repozitár a napíš po slovensky, čo chceš zmeniť. Claude si prečíta `PROJEKT.md`, urobí zmenu, otestuje ju a pripraví pull request.
- **GitHub mobilná appka:** na drobné úpravy textov a schvaľovanie pull requestov.
- **github.dev:** na stránke repozitára stlač klávesu `.` — otvorí sa editor priamo v prehliadači.

> Prvé nasadenie: ak by sa stránka nezobrazila, skontroluj **Settings → Pages → Source: GitHub Actions** (stačí nastaviť raz).

## 📁 Čo je v repozitári

| Súbor / priečinok | Načo je |
|---|---|
| `index.html` | Celá hra (HTML + CSS + JS v jednom súbore) |
| `PROJEKT.md` | „Pamäť projektu" — pravidlá, architektúra, plány. **Čítaj ako prvé.** |
| `VERZIE.md` | Changelog verzií |
| `versions/` | Staršie hrateľné verzie hry (každá = celý súbor) |
| `manifest.json`, `sw.js`, `icons/` | PWA — inštalácia na plochu a offline režim |
| `.github/workflows/pages.yml` | Automatické nasadenie na GitHub Pages |

## 🔄 Vydanie novej verzie

1. Uprav `index.html`.
2. Skopíruj ju aj do `versions/vN_DATUM_popis.html` a doplň riadok do `VERZIE.md`.
3. V `sw.js` zvýš číslo cache (`elemen-vN`), aby si zariadenia stiahli novú verziu.
4. Zlúč do `main` — o chvíľu je hra naživo.
