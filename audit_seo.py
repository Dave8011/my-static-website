import os
from bs4 import BeautifulSoup
from collections import defaultdict

def audit_site():
    html_files = []
    for root, dirs, files in os.walk('.'):
        for file in files:
            if file.endswith('.html') and not 'node_modules' in root and not '.git' in root:
                html_files.append(os.path.join(root, file))

    titles = defaultdict(list)
    descriptions = defaultdict(list)
    missing_canonicals = []
    missing_og = []
    missing_alts = []
    google_verification_found = False

    for file in html_files:
        with open(file, 'r', encoding='utf-8') as f:
            soup = BeautifulSoup(f.read(), 'html.parser')
            
        # Title
        title_tag = soup.find('title')
        if title_tag and title_tag.string:
            title = title_tag.string.strip()
            titles[title].append(file)
        else:
            titles['MISSING'].append(file)

        # Description
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        if meta_desc and meta_desc.get('content'):
            desc = meta_desc['content'].strip()
            descriptions[desc].append(file)
        else:
            descriptions['MISSING'].append(file)

        # Canonical
        canonical = soup.find('link', attrs={'rel': 'canonical'})
        if not canonical or not canonical.get('href'):
            missing_canonicals.append(file)

        # OG Tags
        og_tags = ['og:title', 'og:description', 'og:image', 'og:url']
        has_all_og = True
        for og in og_tags:
            tag = soup.find('meta', attrs={'property': og})
            if not tag or not tag.get('content'):
                has_all_og = False
                break
        if not has_all_og:
            missing_og.append(file)

        # Alt Text
        images = soup.find_all('img')
        for img in images:
            if not img.get('alt') or img.get('alt').strip() == '':
                missing_alts.append((file, img.get('src')))

        # Google Site Verification
        gsc = soup.find('meta', attrs={'name': 'google-site-verification'})
        if gsc:
            google_verification_found = True

    print("\n--- SEO AUDIT RESULTS ---")
    
    duplicate_titles = {k: v for k, v in titles.items() if len(v) > 1 and k != 'MISSING'}
    if duplicate_titles:
        print("\n[!] Duplicate Titles Found:")
        for k, v in duplicate_titles.items():
            print(f"  - '{k}' in {len(v)} files: {', '.join(v)}")
    else:
        print("\n[✓] All pages have unique titles.")

    if titles['MISSING']:
        print("\n[!] Pages missing Title Tags:")
        for v in titles['MISSING']:
            print(f"  - {v}")
            
    duplicate_descs = {k: v for k, v in descriptions.items() if len(v) > 1 and k != 'MISSING'}
    if duplicate_descs:
        print("\n[!] Duplicate Meta Descriptions Found:")
        for k, v in duplicate_descs.items():
            print(f"  - '{k}' in {len(v)} files: {', '.join(v)}")
    else:
        print("\n[✓] All pages have unique meta descriptions.")

    if descriptions['MISSING']:
        print("\n[!] Pages missing Meta Descriptions:")
        for v in descriptions['MISSING']:
            print(f"  - {v}")

    if missing_canonicals:
        print(f"\n[!] {len(missing_canonicals)} pages missing Canonical tags:")
        for f in missing_canonicals:
            print(f"  - {f}")
    else:
        print("\n[✓] All pages have canonical tags.")

    if missing_og:
        print(f"\n[!] {len(missing_og)} pages missing one or more OpenGraph tags:")
        for f in missing_og:
            print(f"  - {f}")
    else:
        print("\n[✓] All pages have full OpenGraph tags.")

    if missing_alts:
        print(f"\n[!] {len(missing_alts)} images missing ALT text:")
        for f, src in missing_alts:
            print(f"  - File: {f} | Image: {src}")
    else:
        print("\n[✓] All images have descriptive alt text.")

    if google_verification_found:
        print("\n[✓] Google Search Console verification tag found.")
    else:
        print("\n[!] Google Search Console verification tag MISSING.")

if __name__ == '__main__':
    audit_site()
