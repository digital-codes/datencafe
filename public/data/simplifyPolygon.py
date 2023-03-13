import geopandas as gp 
import pandas as pd
import matplotlib.pyplot as plt
import sys

df1 = gp.read_file("geoPoly1.geojson")
# resolution
resolution = 1000.
# simplify return series. country names missing!
df2 = df1.simplify(resolution)
fig1 = df1.plot()
fig2 = df2.plot()

plt.show()

if len(df1) != len(df2):
    print("Length not matching")
    sys.exit()
# copy original and replace geometry
# make sure length match
df3 = df1.copy()
df3.geometry = df2.geometry    

df3.to_file("simplePolys.geojson",driver='GeoJSON')

countries = pd.DataFrame(df3.gen.unique(),columns=["gen"])
countries.to_csv("simplePolyIds.csv",index=False)


