# M.B. Overgaard Sp/f – heimasíða

Website for M.B. Overgaard Sp/f, bygningssnikkari in Argir, Faroe Islands.

Single static file: `index.html`. No build step — open it in a browser or host it anywhere (GitHub Pages, Netlify, one.com…).

## To do before launch

- **Photos** – replace the grey placeholders:
  - Hero slideshow: each `<figure class="slide" data-caption="…">` – put an `<img src="…" alt="…">` inside and update `data-caption`.
  - Tænastur: each `<div class="svc-img">` – put an `<img>` inside.
  - Verkætlanir: each `<div class="img">` – replace with an `<img>`.
- **Contact form** – currently uses `mailto:`. For direct sending, point the form `action` at a service such as Formspree.
- **Apprentice banner** – remove the `.hire` block in `index.html` when the position is filled.
- **Faroese copy** – have a native speaker read through.
