from pathlib import Path
from PIL import Image, ImageEnhance

ROOT = Path('.')
RAW = ROOT / 'assets' / 'raw' / 'photos'
OUT = ROOT / 'public' / 'images'


def crop_cover(im, ratio, focus_y=0.5, focus_x=0.5):
    target_ratio = ratio
    width, height = im.size
    current = width / height
    if current > target_ratio:
        new_width = round(height * target_ratio)
        left = round((width - new_width) * focus_x)
        im = im.crop((left, 0, left + new_width, height))
    else:
        new_height = round(width / target_ratio)
        top = round((height - new_height) * focus_y)
        im = im.crop((0, top, width, top + new_height))
    return im


# Warm treatment-room image replaces the cooler salon photo.
spa = Image.open(RAW / 'pex-spa-green.jpg').convert('RGB')
studio = spa.crop((0, 260, 990, 1900))
studio = crop_cover(studio, 4 / 4.7, focus_y=0.62, focus_x=0.55)
studio = studio.resize((1000, 1175), Image.Resampling.LANCZOS)
studio = ImageEnhance.Color(studio).enhance(0.9)
studio = ImageEnhance.Brightness(studio).enhance(1.04)
studio = ImageEnhance.Contrast(studio).enhance(1.03)
studio.save(OUT / 'studio.webp', 'WEBP', quality=86, method=6)
print('studio', studio.size)

journal_studio = spa.crop((0, 620, 990, 1345))
journal_studio = crop_cover(journal_studio, 900 / 660, focus_y=0.5, focus_x=0.4)
journal_studio = journal_studio.resize((900, 660), Image.Resampling.LANCZOS)
journal_studio = ImageEnhance.Color(journal_studio).enhance(0.9)
journal_studio = ImageEnhance.Brightness(journal_studio).enhance(1.03)
journal_studio.save(OUT / 'journal-studio.webp', 'WEBP', quality=86, method=6)
print('journal-studio', journal_studio.size)
