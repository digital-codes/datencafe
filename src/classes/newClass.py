import pystache
import json
renderer = pystache.Renderer()

# read data
with open("data.json") as f:
    dt = json.load(f)
print(dt)

mist = renderer.render_path("ClassTemplate",dt)
print(mist)

with open("mist.ts","w") as f:
    f.write(mist)

