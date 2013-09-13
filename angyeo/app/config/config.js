var path = require('path'),
  rootPath = path.join(__dirname, '..');

module.exports = {
  development: {
  db: 'mongodb://localhost/crunchtest',
  root: rootPath,
  app: {
    port: 8000
  }
  // clientUrl: 'http://localhost:3001' SHOULD WE HAVE THIS??
  }
}