# 📱 Pseudo iOS — symulator systemu w przeglądarce

Klon interfejsu iOS zbudowany w czystym **HTML + CSS + JavaScript** — bez frameworków, bez builda, bez zależności.

## ✨ Funkcje

- 🔒 **Ekran blokady** — zegar, data, widget pogody, odblokowanie kliknięciem lub klawiszem Enter
- 🏠 **Ekran główny** — siatka ikon aplikacji, dock, wybór tapety (zapisywana w localStorage)
- 🎚 **Centrum sterowania** — Wi‑Fi, Bluetooth, tryb „Nie przeszkadzać", latarka, suwaki jasności i głośności (otwierane kliknięciem paska statusu)
- 🧮 **Kalkulator** — pełne działanie (+, −, ×, ÷, %, ±)
- 🎨 **Szkicownik** — rysowanie palcem/myszką (canvas, kolory, rozmiar pędzla)
- ⏲️ **Minutnik** — odliczanie 1/3/5/10 min z dźwiękiem
- 📝 **Notatki** — dodawanie/usuwanie, zapis w localStorage
- ⏰ **Zegar** — tarcza analogowa, godzina cyfrowa, stoper
- ☀️ **Pogoda** — bieżąca prognoza 7‑dniowa (dane demo)
- 🌸 **Zdjęcia** — siatka miniaturek z animacją
- 🎵 **Muzyka** — odtwarzacz z listą utworów
- ⚙️ **Ustawienia** — tryb ciemny, przełączniki, tapety
- 🛍️ **App Store — ponad 100 aplikacji** do pobrania (instalacja/usuwanie zapamiętywane):
  - **Gry:** 2048, Snake, Saper, Wisielec, Kółko i Krzyżyk, Memoria (10 motywów), Refleks, Kostka, Orzeł–Reszka
  - **Quizy (15 tematów):** historia, geografia, kino, muzyka, sport, informatyka, biologia, kosmos, matematyka, angielski, tradycje PL, gry wideo, motoryzacja, zwierzęta, zagadki — z rekordami
  - **Przeliczniki (10):** długość, masa, temperatura, czas, objętość, dane, energia, prędkość, kąty, waluta (demo)
  - **Fiszki (10 talii):** angielski, hiszpański, niemiecki, francuski, stolice, flagi, IT, chemia, anatomia, idiomy
  - **Listy (7):** zakupy, walizka, lektury, watchlista, lista marzeń, cele tygodnia, przepisy
  - **Liczniki (7):** woda, kawa, kroki, treningi, „nie palę”, strony, nauka — z celami dziennymi
  - **Generatory (6):** hasła, nicki, lotto, kolory HEX, „wybierz za mnie”, moneta
  - **Encyklopedie (11):** pierwiastki, ciekawostki, przepisy, ćwiczenia, pierwsza pomoc, idiomy świata, przysłowia, święta PL, jednostki SI, znaki zodiaku, wartości odżywcze
  - **Timery (4):** jajka na miękko/twardo, herbata, makaron al dente
  - **Narzędzia:** Zegar Świat (8 miast), BMI, Napiwek, VAT, Oddech 4‑7‑8, Dziennik Nastroju
  - 📅 Kalendarz · 💬 Czat z botem · 🗺️ Mapy z pinezkami · 📷 Kamera
  - 🎹 Piano (WebAudio) · ✅ Zadania · 🍅 Pomodoro

## 🚀 Uruchomienie

Po prostu otwórz `index.html` w przeglądarce, albo:

```bash
python3 -m http.server 8000
# http://localhost:8000
```

## ⌨️ Skróty klawiszowe

| Klawisz | Działanie |
|---|---|
| `Enter` | odblokuj ekran |
| `Escape` | zamknij aplikację / zablokuj telefon |
| klik w pasek statusu | centrum sterowania |
| klik w pasek na dole | powrót do ekranu blokady |

## 📄 Licencja

MIT. Projekt hobbystyczny — nie jest powiązany z Apple. iOS jest znakiem towarowym Apple Inc.
