# Local Image Server

This project is a tiny Node.js/Express image server that serves static files from a local `images/` folder at the `/image/<filename>` endpoint.

> The server you provided listens on `PORT` (default `8000`) and uses `express.static` with some options (extensions, cache header, CORS). This README explains how to set it up, run it, and safely expose it on your LAN/VPN.

---

## Quick summary

* Default endpoint to fetch an image:

  ```
  http://localhost:8000/image/<your-file-name.ext>
  ```
* Example given in your HTML: `http://191.177.214.217:8000/image/fasting.svg` (Use the VPN client address instead of `localhost` else it image won't load on app).
* Images are served from the `images` directory (created automatically by the server if missing).

---

## Prerequisites

* Node.js (v14+ recommended)
* npm (bundled with Node.js)
* Basic terminal / command prompt knowledge

Check versions:

```bash
node -v
npm -v
```

---

## File layout (recommended)

```
image-server/
├─ server.js        # your provided server file
├─ images/          # place images here (created automatically)
├─ package.json
└─ README.md        # this file
```

---

## Installation & setup

1. Create project folder (or use your existing folder containing `server.js`):

```bash
mkdir image-server
cd image-server
```

2. Initialize `package.json` (if you don't already have one):

```bash
npm init -y
```

3. Install production dependencies:

```bash
npm install express cors
```

4. (Optional) Install development helper `nodemon` to auto-restart during development:

```bash
npm install -D nodemon
```

5. Put your `server.js` in this folder (the file you pasted). The server will create the `images/` directory automatically on startup if it doesn't exist.

6. Add convenient NPM scripts to `package.json`:

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

---

## Environment variables

The server reads two environment variables:

* `PORT` — port to listen on (default `8000` in your `server.js`).
* `IMAGE_DIR` — absolute or relative path to the folder that contains images (defaults to `./images`).

Examples:

macOS / Linux:

```bash
PORT=8000 IMAGE_DIR=./my-assets npm start
```

Windows PowerShell:

```powershell
$env:PORT=8000; $env:IMAGE_DIR='./my-assets'; npm start
```

Note: If you don't set `IMAGE_DIR`, the server will create and use `./images` next to `server.js`.

---

## Running the server

Start normally:

```bash
npm start
# or
node server.js
```

Start in dev mode (auto restart when files change):

```bash
npm run dev
```

If you need to override the port only:

```bash
PORT=8000 node server.js
```

### Listening on LAN / VPN

By default `app.listen(PORT, ...)` often binds to all interfaces or at least localhost depending on your environment. If you need the server to be reachable from other devices (LAN / VPN address), make sure the server binds to `0.0.0.0` or your machine's IP. Modify the `app.listen` line in `server.js` like this:

```js
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running: http://localhost:${PORT}`);
});
```

Also make sure:

* Your machine firewall allows inbound connections on the port.
* Your VPN/LAN routing allows connections to that IP and port.

Example access from another machine or from the VPN client:

```
http://191.177.214.217:8000/image/fasting.svg
```

---

## Using the endpoint

* Browser: open `http://localhost:8000/image/your-file.png`.
* HTML:

```html
<img src="http://localhost:8000/image/hello.png" alt="hello" />
```

* Download via curl:

```bash
curl -I http://localhost:8000/image/hello.png   # headers
curl http://localhost:8000/image/hello.png --output hello.png
```

---

## Important configuration details from `server.js`

* `IMAGE_DIR` is resolved with `path.resolve(...)` and created if missing.
* CORS middleware is enabled (`app.use(cors())`) so requests from other origins will be allowed by default.
* `express.static` serves `/image` using this `extensions` list:

  ```
  ['png','jpg','jpeg','gif','webp','svg','json']
  ```

  **Note:** including `json` will allow serving `.json` files from the images folder — remove it if you don't want to serve JSON files.
* The server sets `Cache-Control: public, max-age=86400` (1 day) for served files. Adjust as needed.

---

## Security & best practices

1. **Do not expose sensitive folders**: Make sure `IMAGE_DIR` points only to a folder containing safe assets (for example `./images`) and not something like your home directory.

2. **Be careful with `json` in `extensions`**: Serving JSON or other non-image files might leak information. Remove `json` unless intentional.

3. **Path traversal**: `express.static` is generally safe against path traversal when used with a directory root. If you plan to expose this server publicly, consider the "safer custom route" approach that validates paths and file extensions.

4. **Authentication**: If this server is publicly accessible (over the internet or a large VPN), protect it with basic auth, API keys, or a reverse proxy that requires authentication.

5. **Rate limiting**: Add `express-rate-limit` to protect against abuse.

6. **HTTPS in production**: Use a reverse proxy (NGINX, Caddy) or put the server behind a secure load balancer. Do not expose plain HTTP on the open internet.

7. **Logging & monitoring**: Use `morgan` for request logs and consider storing logs for diagnostics.

---

## Troubleshooting

* **404 Not Found**: Confirm the filename (case sensitive on Linux/macOS), the file extension, and that the file is inside the `images` directory. The server prints the `IMAGE_DIR` path on startup.

* **CORS errors in browser**: You have `cors()` enabled. If you still get CORS errors, inspect the browser console and the network request to see what header is missing.

* **Permission denied / EACCES**: Make sure the Node process has read permission on the files. Run `ls -l images` and `chmod` as needed.

* **Port already in use**: Pick a different port or stop the process using the port (macOS/Linux: `lsof -i :8000`).

* **Can't access from other device**: Ensure the server listens on `0.0.0.0`, firewall allows the port, and the VPN/LAN routing is correct.

---

## Optional improvements / next steps

* Add an authenticated file upload endpoint so clients can `POST` images to the server (use `multer`).
* Replace `express.static` with a custom safe route if you want to strictly whitelist extensions and perform logging.
* Add `helmet` for common HTTP header protections: `npm install helmet` and `app.use(require('helmet')());`.
* Add `express-rate-limit` to limit requests.
* Use `pm2` for production process management: `pm2 start server.js --name image-server`.

---

## Example: simple `upload` endpoint (concept)

> This is an optional snippet to accept uploads. Use only after you add authentication and rate-limiting if exposed externally.

```js
// Requires: npm i multer
const multer = require('multer');
const upload = multer({ dest: IMAGE_DIR });
app.post('/upload', upload.single('file'), (req, res) => {
  // req.file.path contains the saved file path
  res.json({ ok: true, filename: req.file.filename });
});
```

---

## License

This README and the example server are released as-is. No warranty provided. Use at your own risk.

---

If you'd like, I can also:

* generate a ready-made `package.json` to drop into the folder,
* add the optional upload endpoint into your `server.js`,
* or produce a `server-safe.js` variant that strictly whitelists extensions and prevents path traversal.

Tell me which of those you want next and I'll create it for you.
