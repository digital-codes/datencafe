import pystache
import json
renderer = pystache.Renderer()

# read data
with open("classData.json") as f:
    dt = json.load(f)
print(dt)

mist = renderer.render_path("ClassTemplate",dt)
print(mist)

with open(".".join([dt["class"],"ts"]),"w") as f:
    f.write(mist)

