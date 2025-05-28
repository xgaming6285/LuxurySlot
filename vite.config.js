import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        hmr: {
            protocol: 'ws',
            host: 'localhost',
        },
        host: true, // This will listen on all addresses, including localhost and network IP
        strictPort: true,
        port: 5173, // ensure this port is used
        allowedHosts: ['7333-94-155-135-139.ngrok-free.app'],
    },
}); 