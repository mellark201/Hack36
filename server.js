const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
var server = require('http').createServer(app);


app.set('view engine', 'ejs');
app.set('views', __dirname+'/views');
app.set('layout', 'layouts/layout');
app.use(express.static('public'));
app.use(expressLayouts);
app.use(bodyParser.urlencoded({limit: '10mb', extended:false}));

const mongourl = "mongodb+srv://mellark201:mellark201@codecollab.zucli.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

const mongoose = require('mongoose');
mongoose.connect(mongourl, {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true});
const db = mongoose.connection
db.on('error', error => console.log(error));
db.once('open', () => {
    console.log('Connected to Mongoose');
})


const indexRouter = require('./routes/index');

app.use('/', indexRouter);

server.listen(process.env.PORT || 3000);


// mongodb+srv://shubham:shubham@123@probono-vqmwn.mongodb.net/Probono?retryWrites=true&w=majority