const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const bmiRoutes = require('./routes/bmiRoutes');
app.use('/', bmiRoutes);

app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
