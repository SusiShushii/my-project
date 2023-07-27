const mongoose = require ('mongoose')
const Schema = mongoose.Schema;

const printSchema = new mongoose.Schema({
    _id: {
        type: Number,
        default: 1,
      },
    docNum : {
        type : String,
        required : true
    },
    docDate:{
        type : String,
        required : true
    },
    docType : {
        type : String,
        required : true
    },
    buyerName: {
        type : String,
        required : true
    },
    srcName: {
        type: String,
        required : true
    },
    srcIp:{
        type: String,
        requried : true
    }, 
    pages:{ 
        type : String,
        required : true
    },
    cstatus: {
        type : Number,
        required : true
    },
    pdfFile: {
        type: String,
        required: true
    },
    cDate: {
      type: String,
      required: true
  },
    
});

printSchema.pre('save', async function (next) {
    const doc = this;
    if (doc.isNew) {
      try {
        const lastPrint = await doc.constructor.findOne({}, {}, { sort: { _id: -1 } });
        if (lastPrint) {
          doc._id = lastPrint._id + 1;
        }
      } catch (error) {
        throw error;
      }
    }
    next();
  });

module.exports = mongoose.model('print_model',printSchema,'PrintQuqe');