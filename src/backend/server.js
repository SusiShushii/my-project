const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const {buildSchema} = require('graphql');
const app = express();
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const render_pdf = require('./render_pdf')
const imageConverter = require('./imageConverter')
const bodyParser = require('body-parser')
const cors = require('cors');

const mongoose = require('mongoose')
const mongodb = require('mongodb') 
const Print = require('./print_model')
const c_date = getCurrentDate();
const imagesDirectory = path.join(__dirname, '..', '..', 'public', 'image',`${getCurrentDate()}`);

app.use(bodyParser.json());
app.use(cors())
const url =process.env.URL_DB;
const port = process.env.PORT;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

async function connectDB() {
  mongoose.connect(url,options)
  .then( ()=>{
    app.listen(port)
    console.log(`listening at port ${port}`);
  }) 
  .catch(err=>{
    console.log(err);
  })
} 
connectDB();
var schema = buildSchema(`
type Print { 
  _id : ID!
  docNum: String!
  docDate: String!
  docType: String!
  buyerName: String!
  srcName: String!
  srcIp: String!
  pages: String!
  cstatus: Int!
  pdfFile: String!
  cDate: String!
}
input PrintInput {
  docNum: String!
  docDate: String!
  docType: String!
  buyerName : String!
  srcName: String!
  srcIp: String!
  pages: String!
  cstatus: Int!
}
  type Query {
    prints : [Print!]!
  }  
  type Mutation {
    createPrint(printInput : PrintInput): Print
    deletePrint(docNum : String!): Print
    editPrint(docNum: String!, printInput: PrintInput): Print
    stopPrint(docNum: String!): Print
  }
`)


const root = {
  prints: () => {
    return Print.find()
    .then(prints=>{
      return prints.map(print =>{
        return {...print._doc,_id: print.id};
      });
    })
    .catch(err=>{
      throw err;
    });
  },
  createPrint: async(args) => {
  try {
    const existingPrint = await Print.findOne({ docNum: args.printInput.docNum });
    if (existingPrint){
      console.log("Error: Document number already exists.");
      return null;
    }
  
  const date = getCurrentDate();
  const doc__Type = Gen_doc_Type(args.printInput.docType)
  const docNum = args.printInput.docNum.toString();
  const pdfFile = `${date}-${docNum}`;

  const print = new Print ({
      docNum: args.printInput.docNum,
      docDate: args.printInput.docDate,
      docType: doc__Type,
      buyerName: args.printInput.buyerName,
      srcName : args.printInput.srcName,
      srcIp : args.printInput.srcIp,
      pages : args.printInput.pages,
      cstatus : args.printInput.cstatus,
      pdfFile : pdfFile, 
      cDate : date,
    });
    const inputPath    = path.join(__dirname, '..', '..', 'public', 'pdf',`${date}`);
    const inputPdfPath = path.join(__dirname, '..', '..', 'public', 'pdf',`${date}`,`${pdfFile}.pdf`);
    const outputFolder = path.join(__dirname, '..', '..', 'public', 'image',`${date}`);

   await check_existfolder(inputPath,outputFolder);

    await renderpdf(pdfFile,inputPdfPath, outputFolder,imageConverter);
    console.log(inputPdfPath);
        return print.save()
          .then((result)=>{
            console.log(result);
            return {...result._doc};
          })
          .catch((err)=>{
            console.log(err)
            throw err;
          });
    
  }
  catch (err){console.log(err);throw err;}    
    
  },
  deletePrint: args => {
    return Print.findOneAndDelete({docNum : args.docNum})
    .then((result)=>{
      console.log(result);
      return {...result._doc};
    })
    .catch((err) => {
      console.log(err);
      throw err;
    })
  },
  editPrint: ({ docNum, printInput }) => {
    return Print.findOneAndUpdate({ docNum }, printInput, { new: true })
      .then(result => {
        console.log(result);
        return { ...result._doc };
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  },
  stopPrint: ({ docNum }) => {
    return Print.findOneAndUpdate({ docNum },{ cstatus: 0 }, { new: true })
      .then(result => {
        console.log(result);
        return { ...result._doc };
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  },
  
  graphiql: true

}

app.use( 
   '/graphql',
   graphqlHTTP({
   schema: schema,
   rootValue: root,
   graphiql: true,
})
)

app.get('/pdf/:doc_num', async (req, res) => {
  const docNum = req.params.doc_num;

  try {
    const print = await Print.findOne({ docNum });

    if (!print) {
      return res.status(404).send('PDF not found');
    }

    const pdfPath = `./pdfs/${print.docNum}.pdf`; 

    fs.readFile(pdfPath, (error, data) => {
      if (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error');
      }

      res.contentType('application/pdf');
      res.send(data);
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send('Internal Server Error');
  }
});

app.get('/api/images', (req, res) => {
  if (!fs.existsSync(imagesDirectory)) {

    return null;
  }
  fs.readdir(imagesDirectory, (err, files) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read image directory' });
    }

    const imageFiles = files.filter((file) => {
      return /\.(png|jpe?g|gif)$/i.test(file); // Filter only image files (png, jpeg, jpg, gif)
    });

    res.json(imageFiles);
  });
});

 async function renderpdf (pdfFile,inputPdfPath, outputFolder,imageConverter){
   try {
     await render_pdf(pdfFile,inputPdfPath);
   }
   catch(err){
     console.log(err);
      throw err; 
   }
   try {
    imageConverter(inputPdfPath, outputFolder, pdfFile);
   }
   catch(err){
     console.log(err);
   }
} 

async function check_existfolder(inputPath,outputFolder){
  if (!fs.existsSync(inputPath)) {
    fs.mkdirSync(inputPath);
    console.log('Folder created successfully.');
  } else {
    console.log('Folder already exists.');
  }
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
    console.log('Folder created successfully.');
  } else {
    console.log('Folder already exists.');
  }
}

function Gen_doc_Type(doc_Type){
  
    if(doc_Type=="80") {
      return  "Debit Note"}
    else if(doc_Type=="81") {
        return "Credit Note"
      }
    else if(doc_Type=="380") {
        return  "Invoice"
        }
    else if(doc_Type=="388") {
        return  "Tax Invoice"}
    else if(doc_Type=="T01") {
        return "Receipt"}
    else if(doc_Type=="T02") {
        return "Invoice/Tax Invoice"}
    else if(doc_Type=="T03") {
        return "Receipt/Tax Invoice"}
    else if(doc_Type=="T04") {
        return "Delivery order/Tax Invoice"}
    else if(doc_Type=="T05") {
        return "Abbreviated Tax Invoice"}
        else if(doc_Type=="T06") {
        return "Receipt/Abbreviated Tax Invoice"}
    else if(doc_Type=="T07") {
        return "Cancellation Note"}
    else if(doc_Type=="81") {
        return "Credit note"}
    else return doc_Type;      
}

function getCurrentDate(){
  const currentDate = new Date();
  const day = currentDate.getDate().toString().padStart(2, '0');
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const year = currentDate.getFullYear().toString();
  const date =  `${day}-${month}-${year}`;
  return date;
}