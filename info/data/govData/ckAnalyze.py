import pandas as pd
import csv
import sys
import numpy as np
import requests
from urllib.parse import urlparse

class CustomDialect(csv.Dialect):
    """Custom dialect to handle unescaped double quotes inside strings."""
    quotechar = '"'
    delimiter = ','
    doublequote = False
    skipinitialspace = False
    lineterminator = '\n'
    quoting = csv.QUOTE_NONE

def read_csv_with_unescaped_quotes(path):
    data = []
    with open(path, newline='\n') as csvfile:
        reader = csv.reader(csvfile, dialect=CustomDialect)
        for row in reader:
            data.append(row)
    return pd.DataFrame(data)


# Example usage
file_path = "items-govdata-de.csv"

w1 = open("good.csv","w")
w2 = open("bad.csv","w")
w3 = open("err.csv","w")


quotechar = '"'
delimiter = ','
skipinitialspace = True
lineterminator = '\n'

df = pd.DataFrame()
goodLines = []

with open(file_path,"rt") as f:
    lines = f.readlines()  # Read all lines into a list
    print("Lines read:",len(lines))
    hdr = lines[0].strip().replace('"',"").split(',')

    for line in lines[1:]:
        #fields = line.strip().split(',')
        # try csv parser
        try:
            fields = csv.reader([line], delimiter=delimiter, quotechar=quotechar).__next__()
        except csv.Error:
            print("Error")
            w3.write(line)
            continue
        if len(fields) != 9:
            w2.write(line)
        else:
            w1.write(line)
            goodLines.append(fields)

w1.close()
w2.close()
w3.close()

df = pd.DataFrame(goodLines,columns=hdr)

# Define the substring categories and corresponding values
substrings = ['csv', 'json',"xls"]
categories = ['CSV', 'JSON',"EXCEL"]

# Set new column based on substring categories
df['type'] = np.select([df['url'].str.lower().str.contains(sub) for sub in substrings],
                           categories,
                           default='Other')

df.to_json("good.json",orient="records")

print(df.groupby(by="type").count())

## #########################################

# Define the origin from which the request is being sent
origin = "https://daten.cafe"

# Define the headers for the CORS request
headers = {
    "Origin": origin,
    "Access-Control-Request-Method": "GET",
    "Access-Control-Request-Headers": "X-Requested-With"
}

def checkCors(url):
    #print(url)
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

    
#fc = open("good-cors.csv","w")
#urls = 

def urlBase(x):
    u = urlparse(x)
    return u.scheme + "://" + u.netloc

def setCors(x):
    return dfb[dfb.base == x].values[0][1]

df["base"] = df.url.apply(urlBase)

dfb = pd.DataFrame(df.base.unique(),columns=["base"])
dfb["cors"] = dfb.base.apply(checkCors)

df["cors"] = df.base.map(setCors)

df[df.cors == 1].to_csv("good-cors.csv")

print(df[df.cors == 1].groupby(by="base").count())


for t in categories:
    print("Checking catgegory ",t)
    df1 = df.groupby(by="type").get_group(t)
    # df1["cors"] = df1.url.apply(checkCors)    
    df1.to_csv("good-" + t + ".csv")



sys.exit()


