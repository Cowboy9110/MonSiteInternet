import sharp from 'sharp';

sharp('client/public/logosite.svg')
  .resize(64, 64) // Taille adaptée pour un favicon
  .toFile('client/public/favicon.ico', (err, info) => {
    if (err) {
      console.error('Erreur lors de la conversion en ICO :', err);
    } else {
      console.log('Conversion réussie en ICO :', info);
    }
  });
