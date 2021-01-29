const express = require('express');
const Article = require('../models/article');
const router = express.Router();

router.get('/new', (req, res)=>{
    res.render('articles/new', {article: new Article()});
});

router.get('/edit/:id', async(req, res)=>{
    const article = await Article.findById(req.params.id);
    res.render('articles/edit', {article: article});
})

router.get('/:slug', async(req, res)=>{
    const article = await Article.findOne({slug: req.params.slug}); //findbyId is a async function
    if (article == null) res.redirect('/'); //cannot find the article, then it will redirect back to homepage
    res.render('articles/show', {article: article});
});

router.post('/', async(req, res, next)=>{
    /*let article = new Article({
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown
    });
    try{
        article = await article.save(); //return the saved article (with assigned id from mongodb)
        res.redirect(`/articles/${article.slug}`); //redirect to the page of the article created (router.get('/:id'))
    }catch(e){
        res.render('articles/new', {article: article}); //still remain on the new article page (the article parameter is prefilling the previous info the user keyed in)
    } */ 
    req.article = new Article(); //pass an empty article to the request
    next(); //go on to the next function, i.e. saveArticleAndRedirect
}, saveArticleAndRedirect('new'));

router.put('/:id', async(req, res, next)=>{
    req.article = await Article.findById(req.params.id);
    next();
}, saveArticleAndRedirect('edit'));

router.delete('/:id', async(req, res)=>{
    await Article.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

function saveArticleAndRedirect(path){
    return async(req, res)=>{
        let article = req.article;
        article.title=  req.body.title;
        article.description =  req.body.description;
        article.markdown = req.body.markdown;

        try{
            article = await article.save(); //return the saved article (with assigned id from mongodb)
            res.redirect(`/articles/${article.slug}`); //redirect to the page of the article created (router.get('/:id'))
        }catch(e){
            res.render(`articles/${path}`, {article: article}); //still remain on the new article page (the article parameter is prefilling the previous info the user keyed in)
        }  
    }
}


module.exports = router;