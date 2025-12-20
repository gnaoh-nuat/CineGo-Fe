import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
  alias: {
    "@": "/src", // dùng cái này thì đỡ phải ../, cứ @/path/to/file là được
  },
},
})
