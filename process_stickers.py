import os
import glob
from rembg import remove
from PIL import Image

def process_image(input_path, output_path, max_size=200):
    print(f"Processing {input_path}...")
    try:
        # Read input image
        with open(input_path, 'rb') as i:
            input_data = i.read()
        
        # Remove background
        output_data = remove(input_data)
        
        # Write output to temporary file
        temp_out = output_path + ".temp.png"
        with open(temp_out, 'wb') as o:
            o.write(output_data)
            
        # Resize image
        with Image.open(temp_out) as img:
            img.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
            img.save(output_path, "PNG")
            
        os.remove(temp_out)
        print(f"Saved {output_path}")
    except Exception as e:
        print(f"Error processing {input_path}: {e}")

stickers = [
    r"C:\Users\nicki.gan\.gemini\antigravity-ide\brain\e08bd9ff-dcf1-4c95-8b29-9f9b19ce0044\sticker_cat_1788493524275.jpg",
    r"C:\Users\nicki.gan\.gemini\antigravity-ide\brain\e08bd9ff-dcf1-4c95-8b29-9f9b19ce0044\sticker_sun_1788493999093.jpg",
    r"C:\Users\nicki.gan\.gemini\antigravity-ide\brain\e08bd9ff-dcf1-4c95-8b29-9f9b19ce0044\sticker_rainbow_1788494013031.jpg",
    r"C:\Users\nicki.gan\.gemini\antigravity-ide\brain\e08bd9ff-dcf1-4c95-8b29-9f9b19ce0044\sticker_coffee_1788494160980.jpg",
    r"C:\Users\nicki.gan\.gemini\antigravity-ide\brain\e08bd9ff-dcf1-4c95-8b29-9f9b19ce0044\sticker_dog_1788494184773.jpg",
    r"C:\Users\nicki.gan\.gemini\antigravity-ide\brain\e08bd9ff-dcf1-4c95-8b29-9f9b19ce0044\sticker_cupcake_1788494374347.jpg",
    r"C:\Users\nicki.gan\.gemini\antigravity-ide\brain\e08bd9ff-dcf1-4c95-8b29-9f9b19ce0044\sticker_cactus_1788494403179.jpg",
    r"C:\Users\nicki.gan\.gemini\antigravity-ide\brain\e08bd9ff-dcf1-4c95-8b29-9f9b19ce0044\sticker_pizza_1788494415162.jpg",
]

out_dir = r"c:\Users\nicki.gan\Documents\source-codes\mandy-journal\src\assets\stickers"
os.makedirs(out_dir, exist_ok=True)

# Process generated stickers
names = ["cat", "sun", "rainbow", "coffee", "dog", "cupcake", "cactus", "pizza"]
for img, name in zip(stickers, names):
    out_path = os.path.join(out_dir, f"{name}.png")
    process_image(img, out_path)

# Process existing stickers
existing = ["flower.jpg", "star.jpg", "heart.jpg"]
for ex in existing:
    in_path = os.path.join(out_dir, ex)
    name = ex.split('.')[0]
    out_path = os.path.join(out_dir, f"{name}.png")
    process_image(in_path, out_path)
    if os.path.exists(in_path):
        os.remove(in_path) # Delete original jpg
