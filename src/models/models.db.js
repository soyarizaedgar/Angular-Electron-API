const mongoose = require("mongoose")

const uri = 'mongodb://mongo/biyuyodb';
// const uri = 'mongodb+srv://biyuyo:rpGL9bdcdIQIgfmH@clusterbiyuyo.s8bul.mongodb.net/biyuyodb?retryWrites=true&w=majority'

mongoose.connect(uri, { useNewUrlParser: true,});

mongoose.connection.on('open', err => {
    console.log("db conected");
})
