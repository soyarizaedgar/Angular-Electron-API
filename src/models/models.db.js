const mongoose = require("mongoose")

const uri = 'mongodb://mongo/biyuyodb';

mongoose.connect(uri, { useNewUrlParser: true,});

mongoose.connection.on('open', err => {
    console.log("db conected");
})
