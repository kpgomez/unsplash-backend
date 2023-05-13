'use strict'

//barebones server step 1: allows us to dotenv variables within our application
require('dotenv').config();

//barebones server step 2: these are also import statements but assigned to a variable so the variable can be used
const express = require('express');
const cors = require('cors');
const axios = require('axios');

//barebones server step 3: initializes express
const app = express();

//barebones server step 4: this passes an empty cors to allow any and all requests, .use is an express method
app.use(cors());

//barebones server step 5: allows access to sensitive variables in the .env file, adding || 3002 sets 3002 as a backup port
const PORT = process.env.PORT;

//barebones server step 6: .get is an express method (are other methods like PUT, POST, DELETE, etc)
app.get('/', (request, response) => {
    response.status(200).send('message confirming route is working')
});

//per API documentation
app.get('/photos', getPhotos);

async function getPhotos(req, res, next) {
    try {
        const { searchQuery } = req.query; //searchQuery needs to match the front-end
        const url = `https://api.unsplash.com/search/photos?client_id=${process.env.UNSPLASH_ACCESS_KEY}&query=${searchQuery}` //makes API request to Unsplash API

        const photoResponse = await axios.get(url); //
        // res.status(200).send(photoResponse.data); //.data is specific to axios

        const formattedData = photoResponse.data.results.map(photo => new Photo(photo));
        res.status(200).send(formattedData);
    }
    catch (error) {
        next(error);
    }

}

//helps format our data from the API
class Photo {
    constructor(photoObj) {
        this.portfolio = photoObj.links.self;
        this.imgURL = photoObj.urls.regular;
        this.author = photoObj.user.name;
    }
}

//error handling 
app.use((error, req, res, next) => {
    res.status(500).send('Hey server is not working')
})

//barebones server step 7: proof of life-ish
app.listen((PORT), () => console.log(`listening on ${PORT}`));



