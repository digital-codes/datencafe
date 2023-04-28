# test cars response
import sys
import requests
import pandas as pd

portals = pd.read_csv("../public/data/opendataportals-de.csv")
    
##
### Define the URL of the target resource that we want to access
##target_urls = [
##  "https://transparenz.karlsruhe.de/dataset/cc50eb96-6c3d-4d6f-9dcd-c56c4969ff59/resource/565c1c6e-a50c-46d2-8638-22896d21096f/download/altersstruktur-der-bevolkerung-unter-3-jahrige-nach-geschlecht.csv",
##    "https://raw.githubusercontent.com/digital-codes/datencafe/main/public/data/alter-15-18.csv"
##]



# Define the origin from which the request is being sent
origin = "https://daten.cafe"

# Define the headers for the CORS request
headers = {
    "Origin": origin,
    "Access-Control-Request-Method": "GET",
    "Access-Control-Request-Headers": "X-Requested-With"
}

def checkCors(url):
    print(url)
    if "moenchengladbach" in url:
        return -1
    try:
        # Send a preflight request to determine if the CORS request is allowed
        preflight_response = requests.options(url, headers=headers)

        # Check the response headers to determine if the CORS request is allowed
        if "Access-Control-Allow-Origin" in preflight_response.headers:
            # The CORS request is allowed, so send the actual request
            actual_response = requests.get(url, headers={"Origin": origin})
            return 1
        else:
            # The CORS request is not allowed, so print an error message
            #print("CORS request not allowed.")
            return 0
    except:
        print("Error")
        return -1

if len(sys.argv) > 1:
    urls = [x for x in sys.argv[1:]]
    for u in urls:
        print(u,": cors = ",checkCors(u))
else:
    portals["cors"] = portals.url.apply(checkCors)
    print(portals.cors.value_counts())
    portals[["url","cors","api","type"]].to_json("../public/data/portals.json")

