# Wikimedia

https://www.wikidata.org/wiki/Wikidata:REST_API
https://www.wikidata.org/wiki/Wikidata:REST_API/Authentication

https://www.wikidata.org/wiki/Wikidata:REST_API/Authentication


``` 
import requests

# Wikibase REST API endpoint
endpoint_url = 'https://wikidata.org/w/api.php'

# parameters for the search query
search_term = 'cat'
search_language = 'en'
search_limit = 10

# construct the query URL
query_url = f'{endpoint_url}?action=wbsearchentities&search={search_term}&language={search_language}&limit={search_limit}&format=json'

# send the query and get the response
response = requests.get(query_url)

# extract the search results from the response
search_results = response.json()['search']

# print the search results
for result in search_results:
    print(f'{result["id"]}: {result["label"]}')

```

# Destatis

https://www.destatis.de/DE/Service/OpenData/genesis-api-webservice-oberflaeche.html

https://www.destatis.de/DE/Service/OpenData/_inhalt.html

https://www.destatis.de/DE/Service/OpenData/karten-geodaten.html


# ESA

https://climate.esa.int/de/odp/#/dashboard

https://earth.esa.int/eogateway/catalog/saocom-data-products

https://cci-tools.github.io/


# Bahn

https://gobeta.de/projekte_tag/open-data/

# Via Bundes API

https://github.com/bundesAPI

## Tagesschau
https://www.tagesschau.de/api2/homepage/


# OSM
https://nominatim.openstreetmap.org/search


# Worldbank

Here are three examples of how to use the World Bank API:

    Retrieve a list of countries:

bash

https://api.worldbank.org/v2/country?format=json

This will return a list of all countries in the World Bank's database, in JSON format.

    Retrieve data for a specific indicator:

bash

https://api.worldbank.org/v2/country/all/indicator/NY.GDP.MKTP.CD?format=json

This will retrieve data for the indicator "Gross Domestic Product (GDP) in current US dollars" for all countries in the World Bank's database, in JSON format.

    Retrieve data for a specific country and indicator:

bash

https://api.worldbank.org/v2/country/GBR/indicator/SP.POP.TOTL?format=json

This will retrieve data for the indicator "Population, total" for the United Kingdom, in JSON format.
User
list of indicators or link to list

ChatGPT

You can find a list of all the indicators available in the World Bank's API by visiting their website at https://data.worldbank.org/indicator.

Alternatively, you can also access the list of indicators through their API by using this endpoint:

bash

http://api.worldbank.org/v2/indicator?format=json

This will return a list of all available indicators in the World Bank's database, in JSON format.


# EU data portal

https://data.europa.eu/en/academy
https://data.europa.eu/en/publications/datastories

https://data.europa.eu/en/academy/incorporating-open-data-your-application



Sure! Here are five examples of API calls you can use to retrieve climate, financial, and health information from data.europa.eu:
 ... links are wrong

 # Eurostat
 https://ec.europa.eu/eurostat/de/

https://ec.europa.eu/eurostat/web/education-corner/overview


https://ec.europa.eu/eurostat/web/nuts/background

The current NUTS 2021 classification is valid from 1 January 2021 and lists 92 regions at NUTS 1, 242 regions at NUTS 2 and 1166 regions at NUTS 3 level.

The NUTS classification (Nomenclature of territorial units for statistics) is a hierarchical system for dividing up the economic territory of the EU and the UK for the purpose of:

     The collection, development and harmonisation of European regional statistics
     Socio-economic analyses of the regions
         NUTS 1: major socio-economic regions
         NUTS 2: basic regions for the application of regional policies
         NUTS 3: small regions for specific diagnoses 




 # Govdata
 https://www.govdata.de/

# europeana
https://www.europeana.eu/de/rights/terms-of-use


# dbpedia
https://www.dbpedia.org/
