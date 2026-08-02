# ELEMEN — projektový dokument (pre Claude Code / novú Cowork úlohu)

Tento súbor je "pamäť projektu". Ak pracuješ na hre prvýkrát, prečítaj si ho celý.

## Čo je ELEMEN
Kartová hra v štýle Pokémon TCG pre deti (~7–9 r., neveĺké čitateľské zručnosti),
v ktorej sa učia reálne pravidlá, aby potom vedeli hrať so skutočnými kartami.
Beží ako JEDEN samostatný HTML súbor (`elemen.html` / na GitHube `index.html`)
— všetko inline (CSS + JS), žiadny build, žiadne závislosti, žiadny server.

Právny rámec: mechaniky Pokémon TCG sú OK (pravidlá nie sú chránené), ale NIKDY
nepoužívať skutočných Pokémonov — mená, obrázky, názvy útokov sú chránené.
Stvorenia sa volajú **Elemeni** (vlastné: Plamienko 🦊, Kvapko 🐢, Ohnivec 🐺,
Ohňodrak 🐉, …), vizuál = emoji + farby.

## Kľúčové vlastnosti (stav k v12)
- **Úrovne (učiaci rebríček):** 1 = súboj + typy (výhoda ×2: oheň>tráva>voda>oheň,
  elektro>voda), 2 = + energia (1/kolo, útoky stoja energiu) a lavička/výmena,
  3 = + evolúcie (základ → 1. → 2. štádium, zachováva zranenie aj energiu),
  ruka + balíček 15 kariet (5 do ruky, 1 ťah/kolo) a Trainer karty
  (Lekárnička +30 HP, Profesorka +2 karty, Odvolanie = výmena zdarma,
  Super energia +1 ⚡), 4 = Turnaj „light": 3 výherné karty (KO súperovho
  Elemena = vezmi 1; kto vezme všetky, vyhráva), v 1. ťahu hry sa neútočí,
  deck-out = prehra. Stavy a slabosť/odolnosť ZATIAĽ NIE (backlog, úroveň 4+).
- **Tutoriál:** tlačidlo „🎓 Nauč ma hrať" — úroveň 1 vs počítač, hlas vedie
  dieťa krokmi (modal „Rozumiem" → zvýraznené tlačidlo `.tutorialCiel`),
  po pár ťahoch „hraj sám". Riadi `hra.tutorial.krok` (0–6).
- **Profily a pamäť (localStorage):** `elemen_nastavenia` (hlas, rýchlosť,
  posledné voľby menu), `elemen_profily` {meno:{vyhry,hry}} + okno 🏅 Rekordy,
  `elemen_rozohrana` — auto-uloženie na začiatku ťahu, tlačidlo „Pokračovať
  v hre" v menu (serializácia cez id kariet, `idKarty()`/`obnovHru()`).
- **Režimy:** 2 hráči na jednom zariadení alebo proti počítaču (AI si sama
  vyberá tím, štartového Elemena aj náhradu po KO).
- **Tablet:** voľba „Podávať si" (súkromná ruka + pass obrazovka) vs
  „Na stole" (dvojstranné rozloženie — horná polovica otočená o 180°,
  OBE ruky viditeľné, klikať smie len hráč na ťahu).
- **Hlas:** nič sa nečíta automaticky; otázniky ❓ zobrazia + prečítajú nápovedu
  (speechSynthesis, sk-SK; výber hlasu a rýchlosti cez tlačidlo 🔈).
  Dôležité: opis útoku sa musí DOČÍTAŤ pred prepnutím ťahu (callback v povedz()).
- **Mobil:** responzívne — skrolovateľné obrazovky, @media ≤520px kompaktné.

## Architektúra kódu (v jednom súbore)
- Dáta: `KARTY` (Elemeni + evolúcie), `TRAINERI`, `DECKS` (sopecny/oceansky,
  `l3` = balíček pre úroveň 3), `HELP` (texty nápovied), `SILNY` (typové výhody).
- Stav: globálny objekt `hra` {uroven, rezim, tabletNaStole, naTahu, hraci[2]},
  hráč = {meno, tim[5], aktivnyIndex, ruka[], balicek[]}.
- Tok: `spustiHru()` → `zacniSetup()` (výber tímu + štartového Elemena;
  AI cez `nastavPocitacHraca()`) → `zacniTah()` → akcie (`zautoc`,
  `pripojEnergiu`, `hrajKartu`, `zacniVymenu`) → `koniecTahu()` → `vyhra()`.
- `vyberNoveAktivne(hracIndex, cb)` — výber náhradníka po KO; pre AI vyberá sám.
- `render()` kreslí celý stôl; `spracuva` = zámok počas čítania/animácií.
- POZOR na duplicitné ID v overlayoch (už raz spôsobilo bug v10) — každé okno
  má vlastné ID/triedy, po zavretí upratať innerHTML.

## Verzovanie a distribúcia
- Zdroj pravdy je GitHub repo `buletino/elemen` (public). Hra = `index.html`
  v koreni repa; `versions/vN_DATUM_popis.html` (každá verzia = celý hrateľný
  súbor), `VERZIE.md` (changelog). VŽDY po zmene pridať novú verziu do
  versions/ a riadok do VERZIE.md.
- Hosting: GitHub Pages → https://buletino.github.io/elemen/ — nasadenie beží
  AUTOMATICKY cez GitHub Actions (`.github/workflows/pages.yml`) pri každom
  pushi do `main` (~1 min).
- PWA: `manifest.json` + `sw.js` + `icons/` — hra sa dá pridať na plochu
  a funguje offline. Pri každom vydaní ZVÝŠIŤ verziu cache v `sw.js`
  (`elemen-vN`), inak zariadenia ostanú na starej verzii.
- Pred každým vydaním OTESTOVAŤ v headless Chromium (Playwright): dohrať hru
  na každej úrovni, oba režimy; overiť KO → výber náhradníka; žiadne chyby
  v konzole. Testy simulujú speechSynthesis stubom (onend po ~30 ms).

## Backlog (nápady odsúhlasené používateľom „na neskôr", v poradí)
1. **Obrázky Elemenov namiesto emoji** — jednotný detský kreslený štýl;
   ukážky štýlu (Plamienko, Kvapko, Ohňodrak) už boli vygenerované a čaká sa
   na schválenie štýlu používateľom; potom celá sada 18 ks + integrácia.
2. **Animácie a zvuky** — trasenie karty pri útoku, lietajúce čísla zranenia,
   konfety pri výhre, jednoduché zvuky cez WebAudio (bez externých súborov).
3. **Album kariet** — výhrami sa odomykajú Elemeni do zbierky (localStorage).
4. **Úroveň 4+ (plné pravidlá):** stavy (spánok, otrava, paralýza, popálenie,
   zmätok), slabosť/odolnosť (+/−20 namiesto ×2).
5. Viac Elemenov a balíčkov; prípadne vlastný výber 5 kariet do tímu.
6. Obtiažnosť počítača (ľahký robí chyby / múdry).
7. Multiplayer cez internet (veľký krok — vyžaduje server/backend);
   vtedy zvážiť účty a históriu (napr. Supabase) + private repo.

## Štýl komunikácie s používateľom
Marian nie je programátor — hovoriť ľudsky, po slovensky, bez žargónu.
Deti nevedia dobre čítať — všetko v hre musí mať ❓ s hlasom. Texty v hre
po slovensky, skloňovanie "Elemen/Elemena/Elemenovi/Elemeni/Elemenov".
