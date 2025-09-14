/**
 * Tailwind configuration for the typing racer project.
 *
 * The `content` array tells Tailwind where to find your HTML and
 * component files so that unused styles can be purged from the
 * production build.  You can extend the default theme or add
 * plugins here if you choose.  See the Tailwind documentation for
 * details: https://tailwindcss.com/docs/configuration
 */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};