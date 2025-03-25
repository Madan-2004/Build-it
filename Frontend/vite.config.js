import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'


const manifestForPlugIn = {
  registerType: 'prompt',
  workbox: {
    maximumFileSizeToCacheInBytes: 7000000,
  },
  includeAssests: ['favicon.ico', "apple-touc-icon.png", "masked-icon.svg"],
  manifest: {
    "theme_color": "#8936FF",
    "background_color": "#2EC6FE",
    "icons": [
      {
        "purpose": "maskable",
        "sizes": "512x512",
        "src": "icon512_maskable.png",
        "type": "image/png"
      },
      {
        "purpose": "any",
        "sizes": "512x512",
        "src": "icon512_rounded.png",
        "type": "image/png"
      },
      {
        "purpose": "any",
        "sizes": "192x192",
        "src": "android-chrome-192x192.png",
        "type": "image/png"
      },
      {
        "purpose": "any",
        "sizes": "512x512",
        "src": "android-chrome-512x512.png",
        "type": "image/png"
      },
      {
        "purpose": "apple touch icon",
        "sizes": "512x512",
        "src": "apple-touch-icon.png",
        "type": "image/png"
      },
    ],
    "orientation": "any",
    "display": "standalone",
    "dir": "auto",
    "lang": "en-US",
    "name": "Gymkhana",
    "short_name": "Gymkhana",
    "scope":"/",
    "start_url":"/"
  }
}


// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA(manifestForPlugIn)
  ],
})
