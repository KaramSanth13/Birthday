from rembg import remove
from PIL import Image

input_path = r"Images\Bodysodaa_traditonal.jpg"
output_path = r"Images\Landing_Photo_NoBg.png"

with open(input_path, 'rb') as i:
    with open(output_path, 'wb') as o:
        input = i.read()
        output = remove(input)
        o.write(output)
print("Background removed successfully!")
