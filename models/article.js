const mongoose = require('mongoose');
const marked = require('marked'); //to convert markdown to text
const slugify = require('slugify'); // to slugify text
const createDomPurify = require('dompurify');
const {JSDOM} = require('jsdom');
const dompurify = createDomPurify(new JSDOM().window);

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    markdown: {
        type:String, 
        required: true
    },
    createdAt: {
        type: Date,
        default: ()=> Date.now()
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    sanitizedHtml: {
        type: String,
        required: true
    }
});

articleSchema.pre('validate', function(next){
    if (this.title){
        this.slug = slugify(this.title, {lower: true, strict: true}); 
        //lower case of title and no punctuation marks (strict)
    }

    if (this.markdown){
        this.sanitizedHtml = dompurify.sanitize(marked(this.markdown));
    }

    next(); //required or will have error
});

module.exports = mongoose.model('Article', articleSchema);