import { defineConfig } from 'cypress';
import plugins from './cypress/plugins';

export default defineConfig({
  experimentalStudio: true,
  e2e: {
    baseUrl: 'http://localhost:3000',
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(
      on: Cypress.PluginEvents,
      config: Cypress.PluginConfigOptions,
    ) {
      return plugins(on);
    },
  },
});
