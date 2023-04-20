import os
import pandas as pd

os.system('grep "<ion-" -r src/ > ions.txt')

with open("ions.txt") as f:
    ionFile = f.read()

ionLines = ionFile.split("\n")
ionLines = [x for x in ionLines if len(x) > 0]

print("LInes ",len(ionLines))
files = [x.split(":")[0] for x in ionLines]
print("Files ",len(files))
ions = [x.split(":")[1].strip() for x in ionLines]
print("Ions ",len(ions))
ions = [x.replace(">"," ").split(" ")[0].replace("<","") for x in ions]
print("Ions ",len(ions))

comps = pd.DataFrame({"files":files})
comps["ions"] = ions

print(comps.ions.unique(),comps.ions.unique().size)

print(comps.groupby(by=ions).count())
