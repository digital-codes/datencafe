from m5stack import *
from m5ui import *
from uiflow import *
import urequests
import time

rgb.set_screen([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])

val = None

from numbers import Number

val = 123
for count in range(10):
  try:
    req = urequests.request(method='POST', url='http://daten.cafe:42402',json={'key':val}, headers={'user':'12345678','pwd':'XXX'})
    rgb.setColorAll(0x33cc00)
  except:
    rgb.setColorAll(0xffff66)
  val = (val if isinstance(val, Number) else 0) + 1
  wait(5)

