# Cropverse-frontend
# Cropverse frontend

## Run locally

```bash
npm install
npm run dev
```

Set `VITE_API_URL` to the FastAPI origin (for example `http://localhost:8000`). The app converts that value to `ws://` or `wss://` automatically for live price, marketplace, supply-demand, and notification updates.

The admin analytics map uses OpenStreetMap tiles. Farmer coordinate data is optional; only farmer records with latitude and longitude are shown.
