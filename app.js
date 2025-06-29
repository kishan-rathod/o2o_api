import path from 'node:path';
import { fileURLToPath } from 'node:url';
import AutoLoad from '@fastify/autoload';

// Convert __dirname equivalent for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Pass --options via CLI arguments in command to enable these options.
const options = {};

// global variables for manage company db connections
global.companies = {};

export default async function (fastify, opts) {
  // Place here your custom code!

  // This loads all plugins defined in plugins
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: { ...opts }
  });

  // This loads all plugins defined in routes
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: { ...opts }
  });
}

export { options };
