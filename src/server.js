const express =  require('express');
const cors =  require('cors');

const bodyParser = require('body-parser');

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cors());
const port = 3001;

require("./routes/routes.users")(app);
require("./routes/routes.wallets")(app);
require("./routes/routes.events")(app);

require('./models/models.db');

app.listen(port, ()=>{
    console.log("It's working");
});

// ***************************************************************

const axios = require('axios').default;

const interval = 86400000
// 24h * 60min * 60seg * 1000

setInterval(function() {
    console.log("I am doing my daily check", new Date());
    axios({
      method: 'post',
      url: 'http://localhost:3001/events_f',
    })
    .then((response) => {
      console.log(response.data);
    }, (error) => {
      console.log(error);
    });

    axios({
      method: 'delete',
      url: 'http://localhost:3001/clean_events',
    })
    .then((response) => {
      console.log(response.data);
    }, (error) => {
      console.log(error);
    });

}, interval);
