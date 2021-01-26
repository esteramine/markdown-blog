const express = require('express');
const articleRouter = require('./routes/articles');
const app = express();

app.set('view engine', 'ejs');

app.use('/articles',articleRouter); 
//everything in articleRouter (article.js) is based on '/articles', so don't need to specify '/articles' again, just '/' is enough

app.get('/', (req, res)=>{
    res.render('index');
});
app.listen(4000);