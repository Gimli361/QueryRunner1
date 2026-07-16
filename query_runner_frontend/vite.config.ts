import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Projenizin çalışmasını istediğiniz yeni port numarası (Örn: 3000)
    strictPort: true, // Eğer 3000 portu doluysa başka porta geçmesin, hata versin istiyorsanız true yapın
  }
})
