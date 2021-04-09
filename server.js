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


const indexRouter = require('./routes/index');

app.use('/', indexRouter);

server.listen(process.env.PORT || 3000);