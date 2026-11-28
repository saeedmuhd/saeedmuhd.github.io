# saeedmuhd.github.io
Personal academic website of Saeed Muhammad — https://saeedmuhd.github.io

## Editing content
All text, talks, news, research cards and publications live in `data.json`.
Easiest way: open https://saeedmuhd.github.io/admin.html and sign in with the admin password.
First time: set up with a fine-grained GitHub token (Contents: read and write, this repository only)
and choose a password. The token is stored encrypted (PBKDF2 + AES-GCM) in `admin-key.json`.

## Files
- `index.html`, `research.html`, `talks.html`, `publications.html`, `contact.html` — pages
- `site.js` — loads data.json and draws the pages, animations and demos
- `style.css` — design
- `cv.html` — online CV built from data.json; PDF in `assets/Saeed_Muhammad_CV.pdf`
- `admin.html` — content editor (not indexed by search engines)
- `assets/` — uploaded photo, CV and other files
