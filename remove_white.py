from PIL import Image
import os
import glob

def remove_white(input_path, output_path, max_size=150):
    print(f"Processing {input_path}...")
    try:
        with Image.open(input_path) as img:
            img = img.convert("RGBA")
            data = img.getdata()
            
            new_data = []
            for item in data:
                # If pixel is close to white, make it transparent
                if item[0] > 240 and item[1] > 240 and item[2] > 240:
                    new_data.append((255, 255, 255, 0))
                else:
                    new_data.append(item)
            
            img.putdata(new_data)
            img.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
            img.save(output_path, "PNG")
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

names = ["cat", "sun", "rainbow", "coffee", "dog", "cupcake", "cactus", "pizza"]
for img, name in zip(stickers, names):
    out_path = os.path.join(out_dir, f"{name}.png")
    remove_white(img, out_path)

existing = ["flower.jpg", "star.jpg", "heart.jpg"]
for ex in existing:
    in_path = os.path.join(out_dir, ex)
    name = ex.split('.')[0]
    out_path = os.path.join(out_dir, f"{name}.png")
    remove_white(in_path, out_path)
    if os.path.exists(in_path):
        try:
            os.remove(in_path)
        except:
            pass
