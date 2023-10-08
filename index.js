const express = require('express');
const app = express();
const port = 4000;
const fs = require('fs');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// read file from data/products.json
const products = JSON.parse(fs.readFileSync('data/products.json', 'utf8'));
const image_path = '/images/products/';

app.get('/', (req, res) => {
    res.render('index');
})

app.get('/products/', (req, res) => {
    // sort products by id, name, price, and order by asc or desc
    let sort = req.query.sort || 'name';
    let order = req.query.order || 'asc';
    products.sort((a, b) => {
        if (sort === 'name') {
            if (order === 'asc') {
                return a[sort].localeCompare(b[sort]);
            } else {
                return b[sort].localeCompare(a[sort]);
            }
        } else {
            if (order === 'asc') {
                return a[sort] - b[sort];
            } else {
                return b[sort] - a[sort];
            }
        }
    });
    res.render('products', { 
        products: products, 
        image_path: image_path
    });
})

app.get('/product/:id', (req, res) => {
    const id = req.params.id;
    const product = products.find(product => product.id == id);
    if (!product) {
        res.status(404).render('error', { error: 'Product not found' });
    }
    res.render('product', { 
        product: product, 
        image_path: image_path 
    });
})

app.post('/add-review', (req, res) => {
    const { id, author, rating, review } = req.body;
    const product = products.find(product => product.id == id);
    if (!product) {
        res.status(404).render('error', { error: 'Product not found' });
    }
    product.reviews.push({
        author: author,
        stars: rating,
        body: review
    });
    // fs.writeFileSync('data/products.json', JSON.stringify(products));
    res.redirect(`/product/${id}`);
})

// listen port
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

module.exports = app;