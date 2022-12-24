const mongoose = require('mongoose');
const mongooseURI = 'mongodb://localhost:27017/avi';

const connectToMongodb = ()=>{
    mongoose.connect(mongooseURI,()=>{
        console.log('connected to mongodb')
    })
}

module.exports = connectToMongodb();