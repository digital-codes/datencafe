import json
from tabulate import tabulate
import requests
import sys
import pandas as pd


url = "https://transparenz.karlsruhe.de/api/3/action/"
action = "package_search?q=burgerdienste"
#action = "package_list"


# Example CKAN API response
response = requests.get(url + action)

print(response.status_code)

if response.status_code != 200:
    print("failed")
    sys.exit()


# Parse the JSON response
data = response.json() #json.loads(response)

# Extract the result field
result = data["result"]

# Check if the result is a list
if isinstance(result, list) and len(result) > 0:
    print("List items: ",len(result))
    # Get the table headers from the keys of the first item
    if isinstance(result[0], dict):
        headers = result[0].keys()
        # Create a list of lists for the table data
        table_data = [list(item.values()) for item in result]
    elif isinstance(result[0], str):
        headers = ["Item"]
        table_data = [[item] for item in result]
    else:
        raise("Error item type: ",type(result[0]))

    # Generate the table using tabulate
    table = tabulate(table_data, headers, tablefmt="grid")

    # Print the table
    # print(table)
    df = pd.DataFrame(result,columns=["item"])    
    
elif isinstance(result, dict) and result["count"] > 0:
    # should be a list ...
    print("Dict items: ",result["count"])
    # Get the table headers from the keys of the dictionary
    headers = result["results"][0].keys()

    # Create a list of a single row for the table data
    #table_data = [list(result.values())]
    table_data = [list(item.values()) for item in result["results"]]

    # Generate the table using tabulate
    table = tabulate(table_data, headers, tablefmt="grid")

    # Print the table
    #print(table)
    df = pd.DataFrame(result["results"],columns=headers)    

else:
    print("No data available.")
    table = None


if table != None:
    # Export to Markdown
    markdown_output = f"Table in Markdown:\n\n{table}"
    with open("table.md", "w") as file:
        file.write(markdown_output)

    # Export to HTML
    html_output = f"<h1>Table in HTML</h1>\n\n{table}"
    with open("table.html", "w") as file:
        file.write(html_output)

    df.to_csv("table.csv")
