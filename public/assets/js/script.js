const { response } = require("express");

const $animalForm = document.querySelector('#animal-form');

const handleAnimalFormSubmit = event => {
  event.preventDefault();

  // get animal data and organize it
  const name = $animalForm.querySelector('[name="animal-name"]').value;
  const species = $animalForm.querySelector('[name="species"]').value;
  const dietRadioHTML = $animalForm.querySelectorAll('[name="diet"]');
  let diet;

  for (let i = 0; i < dietRadioHTML.length; i += 1) {
    if (dietRadioHTML[i].checked) {
      diet = dietRadioHTML[i].value;
    }
  }

  if (diet === undefined) {
    diet = '';
  }

  const selectedTraits = $animalForm.querySelector('[name="personality"').selectedOptions;
  const personalityTraits = [];
  for (let i = 0; i < selectedTraits.length; i += 1) {
    personalityTraits.push(selectedTraits[i].value);
  }
  const animalObject = { name, species, diet, personalityTraits };

  //fetch function added as a POST instead of a GET fetch
  //
  fetch('/api/animals', {
    method: 'POST',
    //set headers to inform the request that it will be JSON data
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    //because of the headers we can add stringify for our animalobject to the body,
    //so the req.body will receive it
    body: JSON.stringify(animalObject)
  })
  .then(response => {
    if(response.ok) {
      return response.json();
    }
    alert('Error: ' + response.statusText);
  })
  .then(postResponse => {
    console.log(postResponse);
    alert('Thank you for adding an animal!');
  });
};

$animalForm.addEventListener('submit', handleAnimalFormSubmit);
