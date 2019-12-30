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

const bodyParser = require('body-parser').json();
/*Required Dependencies end*/


app.get('/login' , (req , res) => {
  res.render('login');
});

app.get('/loggedin' , (req , res) => {
  res.send('loggedin');
});


var server = app.listen(3000, function () {
  console.log('Server running at http://localhost:' + server.address().port)
})
