var express = require('express');
var app = express();
var port = process.env.port || 3000;
var bodypaser= require('body-parser');
var mongoose = require('mongoose');
var morgan = require('morgan');

mongoose.Promise = global.Promise;
var urldb ='mongodb+srv://youngboy:test123@cluster0.tiz60.mongodb.net/authen2?retryWrites=true&w=majority'
mongoose.connect(urldb,{useNewUrlParser: true, useUnifiedTopology:true})
.then(() => console.log('connected to db'))
.catch((err) => console.log(err));


app.use(bodypaser.urlencoded({extended: true }));
app.use(bodypaser.json());
app.use(morgan('dev'));


app.use('/users', require('./routers/users'));



app.listen(port,() => {
    console.log('server running on port ' + port);
});