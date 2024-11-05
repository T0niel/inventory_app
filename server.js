require('dotenv').config();

const express = require('express');
const path = require('path');
const indexRouter = require('./routes/indexRouter');
const inventoryRouter = require('./routes/inventoryRouter');

const app = express();

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/', indexRouter);
app.use('/inventory', inventoryRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
})