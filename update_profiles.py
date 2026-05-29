import os
import re
from bs4 import BeautifulSoup

profiles_dir = 'profiles'
base_url = 'https://www.therehabhouse.in'

def wrap_profile(filepath, filename):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # If already wrapped, skip or extract body
    if '<html' in content.lower():
        soup = BeautifulSoup(content, 'html.parser')
        body = soup.find('body')
        if body:
            content = "".join([str(c) for c in body.children])

    # Try to extract name from <h3>
    soup = BeautifulSoup(content, 'html.parser')
    h3 = soup.find('h3')
    name = "Doctor Profile"
    title_text = ""
    if h3:
        # e.g. "Meet Dr. Chetan Rambhia: Yoga Instructor and Homeopath"
        text = h3.get_text()
        if "Meet " in text:
            name = text.split("Meet ")[1].split(":")[0]
            title_text = text.split("Meet ")[1]
        else:
            name = text.split(":")[0]
            title_text = text

    canonical_url = f"{base_url}/profiles/{filename}"
    img_tag = soup.find('img')
    img_src = img_tag.get('src') if img_tag else "../images/logo.webp"
    if img_src.startswith('../'):
        img_src = img_src.replace('../', '')
    og_img = f"{base_url}/{img_src}"

    meta_desc = f"Learn more about {name}, a specialist at The Rehab House in Mumbai. View their full profile, expertise, and experience."

    schema = {
        "@context": "https://schema.org",
        "@type": ["Physician", "Person"],
        "name": name,
        "url": canonical_url,
        "image": og_img,
        "worksFor": {
            "@type": "MedicalClinic",
            "name": "The Rehab House"
        }
    }
    
    import json
    schema_json = json.dumps(schema, indent=2)

    html_template = f"""<!doctype html>
<html lang="en">
  <head>
    <title>{title_text} | The Rehab House</title>
    <meta name="description" content="{meta_desc}" />
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <link rel="canonical" href="{canonical_url}" />
    
    <!-- OpenGraph Tags -->
    <meta property="og:title" content="{title_text} | The Rehab House" />
    <meta property="og:description" content="{meta_desc}" />
    <meta property="og:image" content="{og_img}" />
    <meta property="og:url" content="{canonical_url}" />
    <meta property="og:type" content="profile" />
    
    <!-- Use main site fonts -->
    <link href="https://fonts.googleapis.com" rel="preconnect" />
    <link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect" />
    <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />
    
    <style>
      body {{
        font-family: 'Libre Baskerville', serif;
        line-height: 1.6;
        color: #333;
        padding: 20px;
        margin: 0;
        background-color: #fff;
      }}
      h3 {{ color: #2c3e50; }}
      p {{ margin-bottom: 15px; }}
    </style>
    
    <script type="application/ld+json">
{schema_json}
    </script>
  </head>
  <body>
    {content}
  </body>
</html>"""

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html_template)

for filename in os.listdir(profiles_dir):
    if filename.endswith('.html') and filename != 'appointment.html':
        wrap_profile(os.path.join(profiles_dir, filename), filename)

print("Profiles updated.")
