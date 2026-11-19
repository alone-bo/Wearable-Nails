from pathlib import Path
from PIL import Image, ImageEnhance
import re

ROOT = Path('.')
RAW = ROOT / 'assets' / 'raw' / 'photos'
OUT = ROOT / 'public' / 'images'
OUT.mkdir(parents=True, exist_ok=True)

jobs = [
    ('hero-nails', 'pex-nailart.jpg', (1200, 1502), 'cover'),
    ('hero-detail', 'nails-04.jpg', (900, 900), 'cover'),
    ('olive-editorial', 'pex-nails-gold.jpg', (1100, 760), 'cover'),
    ('hand-ritual', 'pex-handcream.jpg', (1100, 760), 'cover'),
    ('studio', 'pex-interior.jpg', (1200, 840), 'cover'),
    ('manicure-service', 'nails-02.jpg', (1000, 720), 'cover'),
    ('gallery-nude', 'nails-04.jpg', (800, 800), 'cover'),
    ('gallery-gold', 'pex-nails-gold.jpg', (800, 800), 'cover'),
    ('gallery-care', 'pex-handcream.jpg', (800, 800), 'cover'),
    ('gallery-art', 'pex-nailart.jpg', (800, 800), 'cover'),
    ('journal-care', 'pex-handcream.jpg', (900, 660), 'cover'),
    ('journal-studio', 'pex-interior.jpg', (900, 660), 'cover'),
    ('journal-colour', 'nails-04.jpg', (900, 660), 'cover'),
]

for name, src, size, mode in jobs:
    im = Image.open(RAW / src).convert('RGB')
    im = ImageEnhance.Color(im).enhance(0.92)
    im = ImageEnhance.Contrast(im).enhance(1.03)
    tw, th = size
    if mode == 'cover':
        ratio = max(tw / im.width, th / im.height)
        nw, nh = round(im.width * ratio), round(im.height * ratio)
        im = im.resize((nw, nh), Image.Resampling.LANCZOS)
        left = (nw - tw) // 2
        top = max(0, round((nh - th) * 0.35))
        im = im.crop((left, top, left + tw, top + th))
    im.save(OUT / f'{name}.webp', 'WEBP', quality=84, method=6)
    print(name, im.size)

css = (ROOT / 'assets' / 'raw' / 'fonts' / 'fonts.css').read_text(encoding='utf-8')
blocks = re.findall(r'/\* latin \*/\s*@font-face\s*\{.*?\}', css, flags=re.S)
out = []
for block in blocks:
    family = re.search(r"font-family:\s*'([^']+)'", block).group(1)
    style = re.search(r'font-style:\s*(\w+)', block).group(1)
    weight = re.search(r'font-weight:\s*(\d+)', block).group(1)
    url = re.search(r'url\((https://[^)]+)\)', block).group(1)
    fname = f"{family.replace(' ', '')}-{style}-{weight}.woff2".lower()
    if not (ROOT / 'public' / 'fonts' / fname).exists():
        raise SystemExit(f'missing {fname}')
    block = block.replace(url, f'/fonts/{fname}')
    out.append(block)
(ROOT / 'src').mkdir(exist_ok=True)
(ROOT / 'src' / 'fonts.css').write_text('\n\n'.join(out), encoding='utf-8')
print('fonts faces written:', len(out))
