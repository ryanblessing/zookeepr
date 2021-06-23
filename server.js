const fs = require('fs');
//path- fs module that provides utilities for working w/ file and directory paths 
const path = require('path');

//set up just like inquirir :)
const express = require('express');
//parse incoming JSON data
const { animals } = require('./DATA/animal.json');

const PORT = process.env.PORT || 3001;
// assign express() to a app so we can chain on methods to the express server
const app = express();
// parse incoming string or array data- 11.2
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// this app.use is for the css,js,images in public folder
app.use(express.static('public'));



/*this function takes in req.query as a argument and filters through the animals accordingly,
 returning the new filtered array
 - this function was too only find animals by diet species and name */
/*function filterByQuery(query, animalsArray) {
    let filteredResults = animalsArray;
    if(query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    };
    if(query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    };
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    };
    return filteredResults
}*/

function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    // Note that we save the animalsArray as filteredResults here:
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
        // Save personalityTraits as a dedicated array.
        // If personalityTraits is a string, place it into a new array and save.
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }
        // Loop through each trait in the personalityTraits array:
        personalityTraitsArray.forEach(trait => {
            // Check the trait against each animal in the filteredResults array.
            // Remember, it is initially a copy of the animalsArray,
            // but here we're updating it for each trait in the .forEach() loop.
            // For each trait being targeted by the filter, the filteredResults
            // array will then contain only the entries that contain the trait,
            // so at the end we'll have an array of animals that have every one 
            // of the traits when the .forEach() loop is finished.
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );
        });
    }
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    // return the filtered results:
    return filteredResults;
}


function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}

//created second function to handle taking data from req.body
// accepts POST route in body, and adds it to the array we want (animalsArray)

function createNewAnimal(body, animalsArray) {
    //our functions main code will go here
    const animal = body;
    animalsArray.push(animal);
    fs.writeFileSync(
        path.join(__dirname, './DATA/animals.json'),
        JSON.stringify({ animals: animalsArray }, null, 2)
    );
    //return finished code to post route for response....push and return are the same
    return animal;
}

//like it sounds the if statements are validation checks  ran through
//the animal parament from req.body
function validateAnimal(animal) {
    if(!animal.name || typeof animal.name !== 'string') {
        return false;
    }
    if(!animals.species || typeof animal.species !== 'string') {
        return false;
    }
    if(!animal.diet || typeof animal.diet !== 'string') {
        return false;
    }

    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false;
    }
    return true;
}



//route type for the const animals up top
//--get requires 2 arguments 1. a string describing the route the client will fetch from
//--the 2. callback function that will execute every time that round is accessed with a Get request
app.get('/api/animals', (req, res) => {

    //send method from the res parameter(res = response) sending a string of hello
    // res.send('Hello');

    // changes to json if you want to send a lot of json information
    // res.json(animals);


    //this takes the query parameters and turns it into JSON
    // let results = animals;
    //console.log(req.query)
    //res.json(results);

    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }
});

//creation of the POST route
app.post('/api/animals', (req, res) => {
    //set id based on what the next index of the array will be
    req.body.id = animals.length.toString();

    //if statement for validation here
    //if data in req.body is incorrect send 400 error back
    if(!validateAnimal(req.body)) {
        res.status(400).send('The animal is not properly formatted.');
    } else {
        //add animal to json File and animals array in this function
    const animal = createNewAnimal(req.body, animals);
    res.json(animal);
    } 
});

//to create route for index.html
// '/'---brings us to the root route of the server
// * remember to kill server- save and then restart to ensure it is working
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

//this takes us to just /animals
app.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, './public/animals.html'));
  });

  //this get is to connect the zookepers.html page 
  app.get('./zookeepers', (req, res) => {
      res.sendFile(path.join(__dirname, './public/zookeeper.html'));
  });

  //wildcard route
  app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, './public.index.html'));
  });
//chain the listen command to make our server listen for request?-- run npm start to see it work in terminal
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});