const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;

var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

//helpers are for the variables within registered partials
hbs.registerHelper('currentYear', ()=> new Date().getFullYear());
hbs.registerHelper('screamIt', (string) => {
    return string.toUpperCase();
})

app.use((request, response, next) => {
    var now = new Date().toString(); 
    var log = `${now}: ${request.method} ${request.url}`;

    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if(err){
            console.log('unable to append to server.log');
            
        }
    });
    next(); //must be called for app to move on
    //good to call for asynchronous like gettin gchapters 
    //sometimes not good to call next so u never move on to next middleware
});

//this middleware doesn't have next on it and prevents app from going on
//middleware is executed in teh order that you run app.use
// app.use((request, response, next) =>{
//     response.render('maintenance');
// })

app.use(express.static(__dirname + '/public')); //should be after response.render maintenance. File structure only matters if we don't render the maintenance

app.get('/', (request, response) => {
    response.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: 'Welcome to my website!'
    });
   // response.send('<h1>hello express!</h1>');

    // response.send({
    //     name: 'Andrew',
    //     likes: [
    //         'biking',
    //         'cities'
    //     ]
    // }
})

//**NEW ROUTE */
app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Us Page',
    });
})

app.get('/bad', (req, res) => {
    res.send({
        error: 'unable to fulfill request'
    });
})

app.get('/projects', (req, res) => {
    res.render('projects.hbs', {
        pageTitle: 'My Special Projects',
        desc: 'We love doing projects and want to show them off to you.',
    });
})

app.listen(port, () => {
    console.log(`server is up on port ${port}`)
});  //go to localhost:3000 and it shows 'hello express