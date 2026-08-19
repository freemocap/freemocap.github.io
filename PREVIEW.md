# Previewing this branch

This site is built with Docusaurus (a static-site generator) and runs on Node/npm. It aggregates documentation from several FreeMoCap repos, so a fetch step pulls in that external content before the dev server can render the full site.

1. Clone the repo and check out this branch:
   ```bash
   git clone --branch docs-v2 https://github.com/freemocap/freemocap.github.io.git && cd freemocap.github.io
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Pull in the external sub-repo docs:
   ```bash
   npm run fetch
   ```
4. Start the dev server:
   ```bash
   npm start
   ```
5. Open `http://localhost:3000` in a browser. It reloads automatically as files change.
