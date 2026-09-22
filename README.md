# M.B. Overgaard Sp/f – heimasíða

Website for M.B. Overgaard Sp/f, bygningssnikkari in Argir, Faroe Islands.
All text and photos live in `content/site.json` and are edited through
[Sveltia CMS](https://github.com/sveltia/sveltia-cms) at `/admin`.

## How it fits together

```
content/site.json   all text + which photos are used   ← the CMS edits this
img/                the photos                          ← the CMS uploads here
src/render.mjs      turns the content into index.html
src/styles.css      all the CSS
admin/              Sveltia CMS (config.yml = the edit form)
build.mjs           writes dist/
```

Editing in the CMS commits to this repo, and Cloudflare Pages rebuilds the
site automatically. Nobody needs to touch HTML.

## Local development

```bash
npm run build      # writes dist/
npx serve dist     # or: cd dist && python3 -m http.server 8765
```

To try the CMS locally (edits your working copy, no login needed), run the
proxy in one terminal and serve `dist` in another, then open `/admin`:

```bash
npm run cms
```

## Setting it up on Cloudflare Pages — one-time

**1. Create the Pages project**

Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git →
pick this repo, then:

- Framework preset: **None**
- Build command: `npm run build`
- Build output directory: `dist`

**2. Make CMS login work**

Sveltia authenticates with GitHub and needs a small auth worker (it never sees
the password — GitHub does the login).

- Deploy [sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth) to the
  same Cloudflare account (one click from that repo's README).
- On GitHub: Settings → Developer settings → OAuth Apps → New OAuth App.
  Homepage = the site URL, Authorization callback URL = the worker's
  `/callback` URL. Copy the Client ID and generate a Client Secret.
- Put both into the worker as `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`
  (as encrypted variables), and set `ALLOWED_DOMAINS` to the site's domain.
- Then in `admin/config.yml` replace `base_url` with the worker's URL.

**3. Give him access**

Anyone who can edit the site needs write access to this repo (GitHub → repo
Settings → Collaborators). They then log in at `<site>/admin` with GitHub.

## Editing without the CMS

`content/site.json` is plain JSON — changing it and pushing does the same
thing the CMS does.

## Things worth knowing

- Photo paths start with `/img/...`. The CMS handles this on upload.
- `topbar.show: false` hides the apprentice bar when the position is filled.
- In Tænastur, `wide: true` makes a box span half a row. Two wide boxes fill
  one row; three normal boxes fill one row.
- `v2.html` is an alternative design kept for reference. It is not deployed.
