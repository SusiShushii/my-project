const fs      = require('fs');
const path    = require('path');
const Pdf2Img = require('pdf2img-promises');

async function convertPdfToImages(inputPdfPath, outputFolder, fileName) {
  const converter = new Pdf2Img();

  converter.on(fileName, (msg) => {
    console.log('Received: ', msg);
  });

  converter.setOptions({
    type: 'jpg',      // png or jpg, default jpg
    size: 1024,       // default 1024
    density: 600,     // default 600
    quality: 100,     // default 100
    outputdir: outputFolder,
    outputname: fileName,
    page: null        // convert selected page, default null (if null given, then it will convert all pages)
  });
  converter.convert(inputPdfPath)
  .then(info => {
    console.log(info);
  })
  .catch(err => {
    console.error(err);
  })
  
}

module.exports = convertPdfToImages;
