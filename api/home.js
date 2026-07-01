const fs = require('fs');
const path = require('path');

function readHomepage() {
  const candidates = [
    path.join(process.cwd(), 'index.html'),
    path.join(__dirname, '..', 'index.html'),
  ];

  for (const filePath of candidates) {
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, 'utf8');
    }
  }

  throw new Error('index.html was not included in the deployment bundle');
}

module.exports = function handler(_request, response) {
  try {
    const html = readHomepage()
      .replace(
        '<title>1Touch IT | Professional IT Support in Sydney</title>',
        '<title>1Touch IT</title>',
      )
      .replace(
        '<link rel="icon" type="image/png" href="assets/images/1touch-it-logo-icon.png">',
        '<link rel="icon" type="image/x-icon" href="/api/favicon">',
      );

    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    response.setHeader('Cache-Control', 'public, max-age=0, s-maxage=300');
    response.status(200).send(html);
  } catch (error) {
    response.status(500).send('Unable to load the homepage.');
  }
};
