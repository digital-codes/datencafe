import fetch from 'node-fetch'; // Import the 'node-fetch' module

const searchTerm =  'OpenAI'; // The term you want to search for
const excludeTerm = 'openair'; // Term to exclude
const fallbackLanguage = 'en'; // Fallback language code
const desiredLanguage = 'de'; // Desired language code

// don't exclude here, at least not with overlapping words (openai <=> openair)
// const apiUrl = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(searchTerm)}+-${encodeURIComponent(excludeTerm)}&format=json&language=${encodeURIComponent(searchLang)}`;

// Construct the API URL
//let apiUrl = `https://www.wikidata.org/w/api.php?action=wbsearchentities&language=${encodeURIComponent(desiredLanguage)}&search=${encodeURIComponent(searchTerm)}&format=json`;

let apiUrl = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(searchTerm)}&format=json&language=${desiredLanguage}&uselang=${fallbackLanguage}`;


// console.log(apiUrl)

// Make the API request
fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    // Handle the response data
    const searchResults = data.search;
	//console.log(data,searchResults)

	if (searchResults === undefined) {
		throw (new Error("no results"))
	}

	// Filter out results containing the term "openair"
	const filteredResults = searchResults.filter(result => !result.label.toLowerCase().includes(excludeTerm));
   
    filteredResults.forEach(result => {
      console.log(`Label: ${result.label}`);
      console.log(`Description: ${result.description}`);
      console.log(`ID: ${result.id}`);
      console.log('---');
    });
  })
  .catch(error => {
    // Handle any errors
    console.error('Error:', error);
  });


// --------------
const entityId = "Q96237091"
//apiUrl = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${entityId}&format=json`;
apiUrl = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${entityId}&format=json&language=${desiredLanguage}&uselang=${fallbackLanguage}`;

fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    const entityData = data.entities[entityId];
    console.log(entityData);
  })
  .catch(error => {
    console.error('Error:', error);
  });

// -------------------
apiUrl = `https://www.wikidata.org/w/api.php?action=wbgetclaims&entity=${entityId}&format=json&language=${desiredLanguage}&uselang=${fallbackLanguage}`;

fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    const claims = data.claims;
    console.log(claims);
  })
  .catch(error => {
    console.error('Error:', error);
  });

