import os
from PIL import Image
from pillow_heif import register_heif_opener

register_heif_opener()

folder = "Images"
for filename in os.listdir(folder):
    if filename.lower().endswith(".heic"):
        filepath = os.path.join(folder, filename)
        img = Image.open(filepath)
        # Handle alpha channel if any
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
        new_filepath = os.path.splitext(filepath)[0] + ".jpg"
        img.save(new_filepath, format="JPEG", quality=90)
        print(f"Converted {filename} to {new_filepath}")
