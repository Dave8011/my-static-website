import os
import json

def generate_gallery_data():
    base_dir = "images/gallery"
    output_file = "js/gallery_data.js"
    
    categories = ["facilities", "therapies", "patients", "videos"]
    gallery_data = []

    # Map of CSS span classes to make the masonry grid look good dynamically
    # We will just assign them cyclically or randomly. Let's use a fixed cycle for stability.
    span_classes = ["", "", "large", "", "tall", "", "wide", ""]
    
    item_count = 0
    
    for category in categories:
        cat_path = os.path.join(base_dir, category)
        if not os.path.exists(cat_path):
            os.makedirs(cat_path, exist_ok=True)
            continue
            
        for filename in sorted(os.listdir(cat_path)):
            # Skip hidden files
            if filename.startswith('.'):
                continue
                
            filepath = os.path.join(cat_path, filename)
            # Ensure it's a file
            if not os.path.isfile(filepath):
                continue
                
            file_ext = os.path.splitext(filename)[1].lower()
            
            # Determine type
            if file_ext in ['.mp4', '.webm', '.mov']:
                item_type = 'video'
            elif file_ext in ['.jpg', '.jpeg', '.png', '.webp', '.gif']:
                item_type = 'image'
            else:
                continue # Skip unknown files
                
            span_class = span_classes[item_count % len(span_classes)]
            item_count += 1
            
            # The URL path to the file
            url_path = filepath.replace('\\', '/')
            
            item = {
                "type": item_type,
                "category": category,
                "src": url_path,
                "span": span_class
            }
            gallery_data.append(item)
            
    # Write to js file
    js_content = f"// AUTO-GENERATED FILE. DO NOT EDIT MANUALLY.\n"
    js_content += f"// Run python scripts/update_gallery.py to update this file after adding images.\n\n"
    js_content += f"const galleryData = {json.dumps(gallery_data, indent=4)};\n"
    
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(js_content)
        
    print(f"Generated {output_file} with {len(gallery_data)} items.")

if __name__ == "__main__":
    generate_gallery_data()
