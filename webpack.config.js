const path = require('path');

module.exports = {
    entry: {
        app: './src/app.js',
        'pdf.worker': 'pdfjs-dist/build/pdf.worker.entry.js',
    },
    output: {
        filename: '[name].bundle.js', //[name] = chaves do objeto entry
        path: path.join(__dirname, 'dist'),
        publicPath: 'dist'
    }
}