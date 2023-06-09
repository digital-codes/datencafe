import os
import sys
import json
import pandas as pd
import markdown
#  pip install --user markdown

# markdown attributres
# https://python-markdown.github.io/extensions/attr_list/
# An example attribute list might look like this:
# {:  # someid .someclass somekey='some value' }
# A word which starts with a hash(  # ) will set the id of an element.
# A word which starts with a dot(.) will be added to the list of classes assigned to an element.
# A key/value pair(somekey='some value') will assign that pair to the element.
# Be aware that while the dot syntax will add to a class, using key/value pairs will always override the previously defined attribute. Consider the following:
# {:  # id1 .class1 id=id2 class="class2 class3" .class4 }
# header comments at end of headerline
# To define attributes for a block level element, the attribute list should be defined on the last line of the block by itself.
# {: #an_id .a_class }
# ### A hash style header ### {: #hash }
# To define attributes on inline elements, the attribute list should be defined immediately after the inline element with no white space.
# [link](http://example.com){: class="foo bar" title="Some title!" }



# relevant directories
dirList=[
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
    mdList={}
    files=os.listdir(x)
    for fl in files:
        if not fl.endswith(".md"):
            continue
        lang=fl.split(".")[0]
        with open(os.sep.join([x, fl])) as f:
            text=f.read()
        # split text by ### (h3)
        items=text.split("\n### ")
        md=[]
        for i in items[1:]:
            # get title
            title=i.split("\n")[0]
            content="\n".join(i.split("\n")[1:])
            html=markdown.markdown(content, extensions=['legacy_attrs','attr_list',"tables"])
            # print(html) # <p>Hello <em>World</em><p/>
            print("title", title)
            item={"title": title, "body": content, "html": html}
            md.append(item)

        mdList[lang]=md
    return mdList


for d in dirList:
    # check if we have markdown files there
    files=pd.DataFrame(os.listdir(d))
    if not files[0].apply(isMd).any():
        print(d, "no md")
        continue
    items=mdCompile(d)
    print(d, ":", len(items[list(items.keys())[0]]))

    # check if json files exist
    for lang in list(items.keys()):
        try:
            with open(os.sep.join([d, lang + "-meta.json"])) as f:
                meta=json.load(f)
            if len(meta) != len(items[lang]):
                print("length mismatch", meta[lang], items[lang])
                continue
            for i, m in enumerate(meta):
                for k in list(m.keys()):
                    items[lang][i][k]=m[k]
        except:
            print("No meta for ", d, lang)
            pass
        # append


    outfile="".join([d, "-md.json"])
    outpath=os.sep.join([d, outfile])
    with open(outpath, "w") as f:
        json.dump(items, f)
