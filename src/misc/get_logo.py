import json
import os
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

a, b = 800, 800
#a,b = 110, 60

new = Image.new(mode="RGBA", size=(a,b), color=(0,0,0,0))#color='#1D1F20')
imgsize = new.size

fill = '#7E78D2'
stroke_fill = '#F8F9FA'

font = ImageFont.truetype('./Inter-SemiBoldItalic.ttf', 650)
draw = ImageDraw.Draw(new)


# Defining base parameters
text = 'bq'
coordinates = np.array((a/2, b/2-75))
size = np.array(draw.textsize(text, font=font,  stroke_width=0))


# Finally, drawing on the sharp text
draw.text(coordinates - size / 2, text, fill=fill, stroke_width=0,
          stroke_fill=stroke_fill, font=font, )


"""temp = draw
# Opening gold texture and laying this image over it

logo = Image.open('./assets/Special/Gold texture.png')
logo.paste(new, (int(logo.size[0]/2) - int(imgsize[0]/2), int(logo.size[1]/2)- int(imgsize[1]/2)), new)"""
path = './logo.png'
new.save(path, 'PNG')
new.save('logo.ico',format = 'ICO', sizes=[(64,64)])

"""temp = self.card
# Opening gold texture and laying this image over it
self.card = Image.open('./assets/Special/Gold texture.png')
self.card.paste(temp, (0, 0), temp)"""






