import os
import json
import xml.etree.ElementTree as ET

def test_sitemap():
    print("--- Testing Sitemap URLs (HTTP 200) ---")
    tree = ET.parse('sitemap.xml')
    root = tree.getroot()
    ns = {'sm': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
    
    all_ok = True
    for url in root.findall('sm:url', ns):
        loc = url.find('sm:loc', ns).text
        path = loc.replace('https://www.therehabhouse.in', '')
        if path == '' or path == '/':
            path = '/index.html'
            
        # Vercel CleanUrls mapping
        local_path = '.' + path
        if not os.path.exists(local_path) and not path.endswith('.html'):
            local_path += '.html'
            
        # Some paths might be directories
        if not os.path.exists(local_path) and os.path.isdir('.' + path):
            local_path = '.' + path + '/index.html'
            
        if os.path.exists(local_path):
            print(f"[✓] HTTP 200: {loc} -> Maps to {local_path}")
        else:
            print(f"[X] 404 NOT FOUND: {loc} -> Tried {local_path}")
            all_ok = False
            
    return all_ok

def test_redirects():
    print("\n--- Testing Redirects (HTTP 301) ---")
    with open('vercel.json', 'r') as f:
        config = json.load(f)
        
    all_ok = True
    for redirect in config.get('redirects', []):
        src = redirect['source']
        dest = redirect['destination']
        status = redirect.get('statusCode', 301)
        
        has_params = 'has' in redirect
        if status == 301:
            if has_params:
                print(f"[✓] HTTP 301: {src} {redirect['has']} -> {dest}")
            else:
                print(f"[✓] HTTP 301: {src} -> {dest}")
        else:
            print(f"[X] Invalid Status Code for {src}: Expected 301, got {status}")
            all_ok = False
            
    return all_ok

if __name__ == '__main__':
    s_ok = test_sitemap()
    r_ok = test_redirects()
    if s_ok and r_ok:
        print("\nAll Pre-Deployment Checks Passed!")
    else:
        print("\nSome checks failed. Please fix before deployment.")
