# Local Image Server

This is a simple Node.js/Express server to host and fetch images.

---

## Quick Summary

* Place images in the `images/` folder.
* Start the server with `npm start`.
* Access an image at:

  ```
  http://localhost:8000/image/<your-file-name>
  ```
* If using a VPN, replace `localhost` with your VPN client address.

  ```
  http://<your-vpn-ip>:8000/image/<your-file-name>
  ```

---

## Setup & Run

1. Clone/download this project.
2. Install dependencies:

   ```bash
   npm install
   ```
3. Start the server:

   ```bash
   npm start
   ```
4. The server will create an `images/` folder if it doesn’t exist. Place your image files inside it.

---

## Fetching Images

* From browser:

  ```
  http://localhost:8000/image/sample.png
  ```
* From VPN or LAN:

  ```
  http://<your-vpn-ip>:8000/image/sample.png
  ```

That’s it 🎉
