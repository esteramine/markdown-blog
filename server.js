require('dotenv-defaults').config();
const express = require('express');
const mongoose = require('mongoose');
const Article = require('./models/article');
const articleRouter = require('./routes/articles');
const methodOverride = require('method-override');
const app = express();

if (!process.env.MONGO_URL) {
    console.error('Missing MONGO_URL!!!')
    process.exit(1)
}

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

const db = mongoose.connection;

db.on('error', (error) => {
    console.error(error)
});

db.once('open', () => {
    console.log('MongoDB connected!')
});

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended:false }));
app.use(methodOverride('_method'));
app.get('/', async(req, res)=>{
    /*const articles = [{
        title: 'Test Article',
        createdAt: new Date,
        description: 'Test Description'
    },
    {
        title: 'Test Article 2',
        createdAt: new Date,
        description: 'Test Description'
    }]*/
    const articles = await Article.find().sort({createdAt: 'desc'});
    //sort the articles based on its created time
    res.render('articles/index', {articles: articles});
});
app.listen(4000);

app.use('/articles',articleRouter); 
//everything in articleRouter (article.js) is based on '/articles', so don't need to specify '/articles' again, just '/' is enough