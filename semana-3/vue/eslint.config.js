import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import pluginOxlint from 'eslint-plugin-oxlint'

// Reglas de ESLint, el revisor de código. Viene del proyecto que crea npm create vue@latest.
// eslint-plugin-vue revisa también el <template> de los archivos .vue.
export default defineConfig([
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,js,mjs,jsx}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },

  // vite.config.js corre en Node, no en el navegador (usa process.env)
  {
    name: 'app/config-de-node',
    files: ['vite.config.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],

  // Apaga en ESLint las reglas que ya revisa oxlint, para no revisar dos veces lo mismo
  ...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),
])
