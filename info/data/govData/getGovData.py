from ckanapi import RemoteCKAN, errors
import urllib
import easygui as gui
import sys
import os
import json

# sourcs: name, download base, access url
sources = [
           (u"govdata-de","govdata.de","https://ckan.govdata.de/")
           ]

# file types we want to download
downs = (".csv",".json",".geojson",".gpx",".kmz",".xls",".xlx",".ods",".xlsx",".pdf")
downs = (".csv",".json",".geojson",".gpx",".kmz",".kmz+xml",".xls",".xlx",".ods",".xlsx",".pdf")
download = False # True # Download file or not
excludext = False # True # exclude external resources or not. 


#########
def config():
    """ Ask user which file types to download"""
    return 0

#########

def loadUrl(p,u):
    """ load file from url, print 404 error or raise"""
    f = filedir + "/" + p + "_" + u[u.rfind("/")+1:]
        
    try:
        urllib.request.urlretrieve(u,f)
    except urllib.error.HTTPError as err:
        if err.code == 404:
            print("URL not found: ",u)
        else:
            raise

#########

# prepare ...
agent = 'ckanapi/3.0 (+https://daten.cafe)'
sel = config()

if sel == None:
    sys.exit(0)

filedir = "files-" + sources[sel][0]
if not os.path.exists(filedir):
    os.makedirs(filedir)
    
downloadBase = sources[sel][1]
print("Loading from: ",sources[sel][2])
# we need to set get_only for wien at least, not sure if OK for others as well
ckanGet = RemoteCKAN(sources[sel][2],user_agent=agent,get_only=True)


# access
try:
    grps = ckanGet.action.group_list()
    #print("Groups:\n",grps)
    with open(sources[sel][0] + "-groups.json","w") as f:
        json.dump(grps,f)
    ##for g in grps:
    ##    print("Group: ",ckanGet.action.group_show(id=g))
except errors.CKANAPIError as err:
    print("Getting groups failed:",err)

    

try:
    pkgs = ckanGet.action.package_list()
    #print("Packages:\n",pkgs)
    with open(sources[sel][0] + "-packages.json","w") as f:
        json.dump(pkgs,f)
except errors.CKANAPIError as err:
    print("Getting packages failed:",err)

    
#sys.exit()

# reset our list of resource files
items = []

# iterate over packages and resources
for p in pkgs:
    try:
        pk = ckanGet.action.package_show(id=p)
    except errors.NotFound:
        print("Package not found: ",p)
        continue
    except:
        print("Package error on: ",p)
        continue
    
    print("################")
    print("\n\nPackage ",p)
    gp = pk.get("groups")
    gpname = ""

    if gp != None:
        for g in gp:
            gpname = g.get("name")
            if gpname is None:
                gpname = g.get("title")
            if gpname is None:
                gpname = "no name"
                
            print("Group: ",gpname)

    #print("\nKeys in package ",p,": ",pk.keys())
    #for k in pk.keys():
    #    print(k,": ",pk.get(k))
    #print("\nTitle: ",pk.get("title"),", Notes: ",pk.get("notes"))

    try:
        u = pk.get("url")
    except:
        print("Url error on ",url)
        u = None
    if None != u and u != "":
        print("Url:", u)

    try:
        r = pk.get("resources")
    except:
        print("Resource error on ",url)
        r = None
        
    if None != r:
        print("#########")
        for rr in r:
            #print("\nKeys in resource: ",rr.keys())
            ru = rr.get("url")
            print("\nResource: ",ru)
            # check and skip external urls
            try:
                if excludext and ru.find(downloadBase) < 0:
                    print("External url: ",ru)
                    continue

                if None != ru:
                    ri = []
                    for x in (p,gpname,pk.get("title"),pk.get("license_id"),pk.get("notes"),rr.get("name"),rr.get("description"),rr.get("last_modified"),ru):
                        if type(x) == str:
                            x = "\"" + x + "\""
                        else:
                            x = ""
                        ri.append(x.encode('utf-8').strip())
                    items.append(ri)
                    rf,re = os.path.splitext(ru)
                    #print("File: ",rf, ": ", re)
                    
                    if download and re.lower() in downs:
                        try:
                            loadUrl(p,ru)
                        except:
                            print("Error,", p,",",ru)
                            pass

                        
            except urllib.error.URLError:
                print("url error")
                pass


# write resource description to csv
itemfile = open("items-"+sources[sel][0]+".csv", 'w')
# for some reason, we need a string join here ..
fieldnames = (u"\"package\"",u"\"group\"",u"\"title\"",u"\"license_id\"",u"\"notes\"",u"\"name\"",\
              u"\"description\"",u"\"last_modified\"",u"\"url\"")
itemfile.write(u",".join(fieldnames)+u"\n")

# and a byte join here
for i in items:
    try:
        itemfile.write((b",".join(i)+b"\n").decode("utf-8"))
    except UnicodeEncodeError:
        print("Ungültige codierung")
       

itemfile.close()

    
