/**
* @author Kinjal Ray
* Web App for Invoice Management System
*/

/*Required Dependencies start*/
const express = require('express');
const app = express();

// const cors = require('cors');
// app.use(cors());

const engines = require('consolidate');
app.engine('hbs' , engines.handlebars);
app.set('views', './views');
app.set('view engine', 'hbs');
app.use('/images' , express.static('views/images'));
app.use('/scripts' , express.static('views/scripts'));
app.use('/stylesheets' , express.static('views/stylesheets'));

const bodyParser = require('body-parser').json();
/*Required Dependencies end*/


app.get('/login' , (req , res) => {
  res.render('login');
});

app.get('/invoices' , (req , res) => {
  res.render('invoices');
});

app.get('/customers' , (req , res) => {
  res.render('customers');
});

app.get('/products' , (req , res) => {
  res.render('products');
});

app.get('/invoiceadd' , (req , res) => {
  res.render('invoiceadd');
});

app.get('/customeradd' , (req , res) => {
  res.render('customeradd');
});

app.get('/productadd' , (req , res) => {
  res.render('productadd');
});


var server = app.listen(3000, function () {
  console.log('Server running at http://localhost:' + server.address().port)
})
