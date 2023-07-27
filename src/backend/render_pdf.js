const fetch = require('cross-fetch');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path')
require('dotenv').config({path: '.../.env'})
const cors = require('cors');
const filePath = '001.json';
const apiUrl = process.env.PDF_KEY;

module.exports = async function (pdfFile,outputPath)
{ 
  try {
    const jsonData = fs.readFileSync(filePath, 'utf8');

    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));
    formData.append('data', jsonData);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData,
    });

    const buffer = await response.buffer();
    const pdfPath  = outputPath
    console.log(pdfPath);
    await fs.promises.writeFile(pdfPath, buffer);  

    console.log('PDF file saved successfully!');
    return pdfFile;
  } catch (error) {
    console.error(error);
    throw error;
  }

}
