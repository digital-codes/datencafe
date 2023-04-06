import json
import os

search = 'import {DcNode} from "./DcNode"'
folder = "./"

files = os.listdir(folder)

classTypes = []

with open ("../assets/nodes/nodeTypes.json") as f:
    nodeList = json.load(f)
print(nodeList)


for fl in files:
    if fl.endswith(".ts"):
        with open(fl) as f:
            cl = f.read()
        if search in cl:
            tp = fl.split(".ts")[0].lower()
            classTypes.append(tp)
            print("Class:",fl,",",tp)
            
        
for tp in classTypes:
    if tp in nodeList.keys():
        nodeList[tp]["implemented"] = True
        print("Implemented:",nodeList[tp])
        
