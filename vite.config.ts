import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'ssl/onlycation.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'ssl/onlycation.crt')),
    },
    allowedHosts: ["onlycation.local"],
  },
})

// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import fs from 'fs'
// import path from 'path'

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: true,
//     port: 5173,
//     https: {
//       key: fs.readFileSync(path.resolve(__dirname, 'ssl/onlycation.key')),
//       cert: fs.readFileSync(path.resolve(__dirname, 'ssl/onlycation.crt')),
//     },
//     allowedHosts: ["onlycation.local"],
//   },
// })

