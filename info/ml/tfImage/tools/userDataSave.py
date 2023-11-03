import pandas as pd
import numpy as np
from PIL import Image, ImageDraw
import os

df = pd.read_json("/home/kugel/Downloads/datencafe-userdata.json")
shape = df.tensor.iloc[0]["shape"]

outPath = "userImg"
try:
    os.mkdir(outPath)
except:
    pass


def extract(idx):
    data = df.iloc[idx]["imgdata"]
    lbl = df.iloc[idx]["names"]
    lst = [data[x] for x in data]
    if shape[2] > 1:
        ar = np.reshape(lst,shape)
    else:
        ar = np.reshape(lst,shape[:2])

    img = Image.fromarray(ar*255)
    img_inv = Image.fromarray((1-ar)*255)

    fn = os.sep.join([outPath,f"{lbl}_{idx:04}.png"])
    # print(fn)
    img.show()
    # can only save RGB as PNG
    img.convert("RGB").save(fn)


for idx in list(df.index):
    extract(idx)

#img0.show()
