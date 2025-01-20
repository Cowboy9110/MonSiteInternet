
const sharp = require('sharp');
const fs = require('fs');

sharp('client/public/scroll.svg')
  .resize(64, 64) // Taille adaptée pour un favicon
  .toFile('client/public/favicon.ico', (err, info) => {
    if (err) {
      console.error('Erreur lors de la conversion :', err);
    } else {
      console.log('Conversion réussie :', info);
    }
  });
