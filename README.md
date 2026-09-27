# nielsvanegmond.nl

Portfolio site of Niels van Egmond. Static, no dependencies: just Node 18+.

```bash
npm run dev     # build + serve on http://localhost:8080
npm run build   # build into dist/
```

- **Edit copy, images and videos in `content.mjs`.** Every page is generated from it.
- `build.mjs`: page templates and the build/serve script (`--artifact` also builds a single-page preview).
- `src/styles.css`, `src/main.js`: styles, video pop-up, testimonial carousel, springy block animations.
- `assets/`: self-hosted fonts, images, the teaser loop and the CV PDF.

URLs match the previous site (`/about-me/`, `/projects/…`, `/hard-skills/…`), so existing links keep working.

## Hosting (GitHub Pages)

Every push to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes `dist/`
to https://nielsvanegmond.github.io.

### Using nielsvanegmond.nl

1. At your domain registrar, set these DNS records:

   | Type  | Name  | Value                     |
   |-------|-------|---------------------------|
   | A     | @     | 185.199.108.153           |
   | A     | @     | 185.199.109.153           |
   | A     | @     | 185.199.110.153           |
   | A     | @     | 185.199.111.153           |
   | CNAME | www   | nielsvanegmond.github.io. |

   Remove the old records that point to the previous host.
2. In the repository: **Settings → Pages → Custom domain**, enter `www.nielsvanegmond.nl` and save.
   Once the DNS check passes, tick **Enforce HTTPS**.
3. Visitors then see `www.nielsvanegmond.nl` in the address bar; the bare domain forwards to it.
   DNS changes can take up to a day. Cancel the old hosting after the new site shows up.
