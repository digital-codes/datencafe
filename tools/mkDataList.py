""" create json of data files """
import os
import json

dataDir = "../public/data"
prefix = "/data" # where the file will be accessible
files = os.listdir(dataDir)

fileList = []

dataFile = "dataFiles.json"

for f in files:
    if f.endswith(".csv"):
        fileList.append({"type":"csv","url":"/".join([prefix,f])})
    elif f.endswith(".json"):
        if f == dataFile:
            continue # skip generated file
        fileList.append({"type":"json","url":"/".join([prefix,f])})
    elif f.endswith(".geojson"):
        fileList.append({"type":"json","url":"/".join([prefix,f])})

with open("/".join([dataDir,dataFile]),"w") as fl:
    json.dump(fileList,fl)
