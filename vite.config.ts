import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration for the typing racer project.  This file
// wires up the React plugin and leaves most other settings at
// their defaults.  If you wish to customise module aliases or
// other build behaviour you can edit this file.  For the purposes
// of this project the default values are sufficient.

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Uncomment the following line if you prefer to import files using
      // the `@/` prefix rather than relative paths.  The canvas code
      // assumed such an alias, but in this repository we use relative
      // imports by default.  Should you enable this alias, adjust
      // imports in src/App.tsx accordingly.
      // '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});