import os
import sys
import json
import pandas as pd
import markdown

# relevant directories
dirList = [
    "advanced",
    "info",
    "open",
    "stories",
    "tutor"
    ]

# for legacy attribute like class and id see
# https://python-markdown.github.io/extensions/legacy_attrs/

def isMd(x):
    """ check for markdown type """
    return x.endswith(".md")

def mdCompile(x):
    """ compile files in dir """
    mdList = {}
    files = os.listdir(x)
    for fl in files:
        if not fl.endswith(".md"):
            continue
        lang = fl.split(".")[0]
        with open(os.sep.join([x,fl])) as f:
            text = f.read()
        # split text by ### (h3)
        items = text.split("\n### ")
        md = []
        for i in items[1:]:
            # get title
            title = i.split("\n")[0]
            content = "\n".join(i.split("\n")[1:])
            html = markdown.markdown(content, extensions=['legacy_attrs'])
            #print(html) # <p>Hello <em>World</em><p/>
            print("title",title)
            item = {"title":title,"body":content,"html":html}
            md.append(item)
                
        mdList[lang] = md
    return mdList


for d in dirList:
    # check if we have markdown files there
    files = pd.DataFrame(os.listdir(d))
    if not files[0].apply(isMd).any():
        print(d,"no md")
        continue
    items = mdCompile(d)
    print(d,":",len(items[list(items.keys())[0]]))

    # check if json files exist
    for lang in list(items.keys()):
        try:
            with open(os.sep.join([d,lang + "-meta.json"])) as f:
                meta = json.load(f)
            if len(meta) != len(items[lang]):
                print("length mismatch",meta[lang],items[lang])
                continue
            for i,m in enumerate(meta):
                for k in list(m.keys()):
                    items[lang][i][k] = m[k]
        except:
            print("No meta for ",d,lang)
            pass
        # append

    
    outfile = "".join([d,"-md.json"])
    outpath = os.sep.join([d,outfile])
    with open(outpath,"w") as f:
        json.dump(items,f)

