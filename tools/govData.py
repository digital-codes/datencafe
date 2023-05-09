import requests
import json
import pandas as pd
import io


url = "https://www.govdata.de/sparql?query=PREFIX%20rdf%3A%20%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3E%0APREFIX%20rdfs%3A%20%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E%0ASELECT%20*%20WHERE%20%7B%0A%20%20%3Fsub%20%3Fpred%20%3Fobj%20.%0A%7D%20LIMIT%2010%0A"
fmts = ["json","csv"]

# Define the origin from which the request is being sent
origin = "https://daten.cafe"

corsHdrs = {
    "Origin": origin,
    "Access-Control-Request-Method": "GET",
    "Access-Control-Request-Headers": "X-Requested-With"
}

govHdrs = {
        "csv":{"Accept":"text/csv,*/*;q=0.9"},
        "json":{"Accept":"application/sparql-results+json,*/*;q=0.9"}
        }


for fmt in fmts:
    hdrs = corsHdrs
    hdrs.update(govHdrs[fmt])
    print("Hdrs:",hdrs)
    r = requests.get(url,headers=hdrs)
    if r.status_code == 200:
        content = io.StringIO(r.text)
        if fmt == "csv":
            df = pd.read_csv(content)
        elif fmt == "json":
            df = pd.read_json(content)
        else:
            print("Undefined fmt:",fmt)
            
    print(fmt,"\n",df)
    
    


