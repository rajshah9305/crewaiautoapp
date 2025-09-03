import path from ‘path’;
import { defineConfig, loadEnv } from ‘vite’;

export default defineConfig(({ mode }) => {
const env = loadEnv(mode, ‘.’, ‘’);
const isDevelopment = mode === ‘development’;

```
return {
  define: {
    'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  },
  server: {
    // Allow all hosts in development, restrict in production
    allowedHosts: isDevelopment ? 'all' : [
      'localhost',
      '.netlify.app',
      '.vercel.app',
      'devserver-main--huxlifet.netlify.app'
    ],
    cors: true,
    host: true // Allow external connections
  }
};
```

});
