# For Kuhu 💖

A mobile-first, single-page proposal website. It's static HTML/CSS/JS, ready for GitHub Pages.

## Files

| File | What it is |
|---|---|
| `config.js` | **Edit this first.** Names, photo list, song path, and the 6 Infinity Stone reasons |
| `index.html` | All the scenes and the text on them |
| `style.css` | The look |
| `app.js` | Animations, sounds, the tap game, and so on |
| `photos/` | Put her photos here, named `1.jpg` … `12.jpg` |
| `audio/` | Put your song here as `song.mp3` |

## Where each photo appears

| Photo | Scene |
|---|---|
| 1 | X-ray heart (Diagnosis), credits |
| 2 | Dandiya night polaroid, credits |
| 3–6 | Multiverse portal (#616, #838, #1995, #14,000,605) |
| 7–12 | Infinity Stones (one per stone) |
| 8–11 | Credits photo strips |
| 12 | Center of the song record |

Tips:
- Use `.jpg` or `.png`. iPhone `.HEIC` photos won't show in most browsers, so export them as JPG first.
- Keep each photo under about 500 KB so the site loads fast on mobile data. Something like squoosh.app can shrink them.
- If a photo is missing, the site shows a "📸 Photo N" placeholder, so nothing breaks.

## Your song
Save your recording as `audio/song.mp3` (an `.m4a` also works if you change the path in `config.js`). Aim for under 5 MB.

## The scenes
1. Intro: *A Dandiya Night Production presents…*
2. ECG heartbeat: the line runs, then draws her name, and the BPM rises to 143
3. Diagnosis: patient chart, X-ray heart, Kuhu-itis, jaadu ki jhappi prescription, "All is well" button
4. Ek dandiya night thi…
5. Multiverse: 14,000,605 futures, portal photos, Doctor Strange × Om Shanti Om
6. 6 Infinity Stones: tap to collect each reason, then the *snap*
7. Interval: Filmy Menu of cringe dialogues
8. Beat My Love: the impossible tap game
9. Palat card, then the proposal
10. Yes: Mogambo khush hua, Holi colours, and the movie ticket
11. End credits
12. Post-credits: your song on a spinning record

## All the dialogues used

- **DDLJ:** "Bade bade shehron mein… aisi pyaari doctors milti hain, Senorita."
- **DDLJ (Palat):** "Agar woh mujhe pyaar karti hai… toh palat ke dekhegi. Palat."
- **Doctor Strange × Om Shanti Om:** "Doctor Strange ne 14,000,605 futures dekhe. Maine har ek mein sirf tumhe dhoondha… aur poori kaayanat ne tumhe mujhse milaane ki saazish ki."
- **Jab We Met:** "Geet ne kaha tha, 'Main apni favourite hoon.' Aur tum meri favourite ho."
- **K3G (Poo):** "Kaun tha woh jisne dandiya night pe mudke tumhe nahi dekha? Definitely main nahi."
- **Munna Bhai MBBS:** "Daily ek jaadu ki jhappi. Lifelong course. Refills: unlimited."
- **3 Idiots:** "Dil bada darpok hota hai… All is well."
- **Housefull:** "Main tumhara Aakhri Pasta hoon… matlab last option nahi, ONLY option."
- **Tees Maar Khan:** "Tumhari ek smile ke saamne Tees Maar Khan bhi Ek Maar Khan hai."
- **Happy New Year:** "Duniya mein do tarah ke log hote hain: winners aur losers. Zindagi har loser ko ek mauka deti hai… ye mera mauka hai."
- **Hera Pheri:** "25 din mein paisa double? Nahi… 25 din mein pyaar double."
- **Hera Pheri (game):** "Utha le re baba!"
- **Welcome:** "Mera pyaar Majnu Bhai ki painting jaisa hai. Samajh nahi aayega, par dil se banaya hai."
- **Ajab Prem Ki Ghazab Kahani:** the whole site is "Ajab Prem Ki Ghazab Kahani 2: Dandiya Edition"
- **Kuch Kuch Hota Hai:** "Rahul ne kaha tha, pyaar dosti hai… dosti toh ho gayi, ab next step?"
- **Krrish:** "Marvel ke paas Avengers hain, Bollywood ke paas Krrish… aur mere paas tum ho."
- **Om Shanti Om:** "Ek chutki sindoor ki keemat… arre ruko ruko, abhi sirf girlfriend 😅"
- **Kaho Naa Pyaar Hai:** Yes button: "Kaho Naa… Haan Hai 💖"
- **Mr. India:** after Yes: "Mogambo khush hua!"

## Test on your phone before going live
From this folder, run:
```bash
python3 -m http.server 8080
```
Then, with your phone on the same Wi-Fi, open `http://<your-mac's-ip>:8080`. You can find the IP under System Settings → Wi-Fi → Details.

## Put it on GitHub Pages
1. Create a new repo on GitHub, with a name that's hard to guess.
2. Upload all files and folders (`index.html`, `style.css`, `app.js`, `config.js`, `photos/`, `audio/`).
3. Go to repo **Settings → Pages → Source: Deploy from branch → `main` / root → Save**.
4. After about a minute, the site is live at `https://<your-username>.github.io/<repo-name>/`.

Note: GitHub Pages sites are public, so anyone with the link can open the site.
