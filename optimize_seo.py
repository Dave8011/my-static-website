import os
import glob
from bs4 import BeautifulSoup
from PIL import Image
import re
import datetime

base_dir = "/home/dave/dev/my-static-website"

# 1. Update sitemap.xml
sitemap_path = os.path.join(base_dir, "sitemap.xml")
if os.path.exists(sitemap_path):
    with open(sitemap_path, "r", encoding="utf-8") as f:
        sitemap_content = f.read()
    
    # We want to add <lastmod>YYYY-MM-DD</lastmod> to each <url> if not present
    today = datetime.datetime.now().strftime("%Y-%m-%d")
    
    # Simple regex substitution to add <lastmod> after <loc>
    def add_lastmod(match):
        loc_tag = match.group(0)
        return f"{loc_tag}\n    <lastmod>{today}</lastmod>"
    
    if "<lastmod>" not in sitemap_content:
        new_sitemap = re.sub(r'<loc>.*?</loc>', add_lastmod, sitemap_content)
        with open(sitemap_path, "w", encoding="utf-8") as f:
            f.write(new_sitemap)
        print("Updated sitemap.xml with <lastmod>.")

# 2. Image Optimization (width/height attributes and optionally converting to webp)
html_files = glob.glob(os.path.join(base_dir, '**', '*.html'), recursive=True)

for file_path in html_files:
    if "node_modules" in file_path or ".git" in file_path or "venv" in file_path:
        continue
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    soup = BeautifulSoup(content, 'html.parser')
    images = soup.find_all('img')
    
    changed = False
    for img in images:
        src = img.get('src')
        if not src or src.startswith('http') or src.startswith('//') or src.startswith('data:'):
            continue
            
        img_path = os.path.join(os.path.dirname(file_path), src)
        if not os.path.exists(img_path):
            # Try from base_dir if absolute path logic was intended (though src is usually relative in these static sites)
            img_path = os.path.join(base_dir, src.lstrip('/'))
            
        if os.path.exists(img_path):
            try:
                with Image.open(img_path) as im:
                    width, height = im.size
                    
                    if not img.get('width'):
                        img['width'] = str(width)
                        changed = True
                    if not img.get('height'):
                        img['height'] = str(height)
                        changed = True
                        
                    # Consider WebP conversion (let's do it!)
                    if img_path.lower().endswith(('.png', '.jpg', '.jpeg')):
                        webp_path = os.path.splitext(img_path)[0] + '.webp'
                        if not os.path.exists(webp_path):
                            im.save(webp_path, 'WEBP')
                        
                        webp_src = os.path.splitext(src)[0] + '.webp'
                        if img.get('src') != webp_src:
                            img['src'] = webp_src
                            changed = True
            except Exception as e:
                print(f"Error processing image {img_path}: {e}")

    if changed:
        # BS4 can sometimes alter formatting. Since the prompt asks to modify html, BS4 is okay, but we use formatter
        new_html = str(soup)
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_html)
        print(f"Updated images in {file_path}")

print("Done optimizing.")
