require('dotenv').config();

const express = require('express');
const path = require('path');
const indexRouter = require('./routes/indexRouter');
const inventoryRouter = require('./routes/inventoryRouter');
const categoriesRouter = require('./routes/categoriesRouter');
const httpError = require('./errors/httpError');

const app = express();

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/', indexRouter);
app.use('/inventory', inventoryRouter);
app.use('/category', categoriesRouter);

// app.use('/', (req, res) => {
//     throw new httpError('page not found', 404);
// })

// app.use((err, req, res, next) => {
//     let {status, message} = err;
//     if(!status){
//         status = 500;
//         message = 'Internal server error';
//     }
//     res.render('error', {status, error: message})
// })

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
})