import os
import json

md = {}

files = os.listdir(".")
for fl in files:
    if not fl.endswith(".md"):
        continue
    lang = fl.split(".")[0]
    with open(fl) as f:
        text = f.read()
    md[lang] = text
    
with open("tutorials-md.json","w") as f:
    json.dump(md,f)
    
