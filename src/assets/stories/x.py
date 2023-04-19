import json

with open("stories.json") as f:
    stories = json.load(f)

meta = {}
for lang in list(stories.keys()):
    text = "<!-- -->\n"
    for i in stories[lang]:
        text += "### " + i["title"] + "\n\n"
        text += i["body"] + "\n\n"

        mt = {}
        for k in list(i.keys()):
            if (k == "title") or (k == "body"):
                continue
            mt[k] = i[k]
        if not lang in list(meta.keys()):
            meta[lang] = []
        meta[lang].append(mt)

    with open(lang + ".md","w") as f:
        f.write(text)
            
    with open(lang + ".json","w") as f:
        json.dump(meta[lang],f)

