import json
import os
import markdown


with open("infoItems.json") as f:
    infos = json.load(f)

langs = ["en","de"] # list(infos.keys())

   
fields = ["title","image","alt","attribution","body","date","link"]

def extract(x):
    md = ""
    meta = {}
    for f in fields:
        if x[f] == None:
            print("Skipping: ",f)
            continue

        if f == "title":
            md += "\n### " + x[f] + "\n\n"

        elif f == "body":
            md += x[f] + "\n\n"

        else:
            meta[f] = x[f]

    return md, meta

metaEn = []

for l in langs:
    try:
        os.mkdir(l)
    except:
        pass

    metaList = []
    mdContent = "<!-- -->\n\n" 
    for i, item in enumerate(infos[l]):
        print(l,"-",i,item["title"])
        md,meta = extract(item)
        mdContent += md + "\n\n"
        file = l + os.sep + "item_" + str(i) + ".md"
        with open(file,"w") as f:
            f.write(md)

        if l != "en":
            for k in list (meta.keys()):
                if meta[k] == "":
                    meta[k] = metaEn[i][k]

        metaList.append(meta)

        if l == "en":
            metaEn = metaList

    with open(l + ".md","w") as f:
        f.write(mdContent)

    with open(l + "-meta.json","w") as f:
        json.dump(metaList,f)
