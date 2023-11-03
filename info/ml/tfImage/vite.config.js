import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [],
  base: '/tflite/', // Specify the subdirectory here
  build: {
    target: 'esnext', // Setting target to 'esnext' to use the latest JS features, including top-level await
    outDir: 'dist',  // Output directory for the build
    assetsDir: 'assets', // Directory to nest assets under
    sourcemap: false,  // Enable sourcemaps for better debugging
  },
  esbuild: {
    target: 'esnext', // Specify ESBuild target environment, 'esnext' for the latest JS features
  },
  server: {
    host: 'localhost',
    port: 5000, // Set the port for the dev server
  },
  resolve: {
    alias: {
      // Add your aliases here
    },
  },
  css: {
    preprocessorOptions: {
      // Add preprocessor options like SCSS or Less here
    },
  },
});

