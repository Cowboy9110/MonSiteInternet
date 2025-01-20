
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

sharp('client/public/scroll.svg')
  .resize(64, 64)
  .toFile('client/public/favicon.ico')
  .then(info => {
    console.log('Conversion réussie :', info);
  })
  .catch(err => {
    console.error('Erreur lors de la conversion :', err);
  });
