# -*- coding: utf-8 -*-
"""
Generate brand favicon set for charlizi.com.

Brand palette (from logo.png):
  navy  #1a2540  -> deep navy ground
  gold  #b8865c  -> metallic gold monogram stroke
"""
import os
import sys

from PIL import Image, ImageDraw, ImageFont

NAVY = (26, 37, 64, 255)
GOLD = (184, 134, 92, 255)

OUT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC = os.path.join(OUT, "public")
ASSETS = os.path.join(OUT, "src", "assets", "favicons")

FONT_CANDIDATES = [
    r"C:\Windows\Fonts\georgiab.ttf",
    r"C:\Windows\Fonts\georgia.ttf",
    r"C:\Windows\Fonts\timesbd.ttf",
    r"C:\Windows\Fonts\times.ttf",
    r"C:\Windows\Fonts\seguisb.ttf",
    r"C:\Windows\Fonts\arialbd.ttf",
]


def pick_font():
    for path in FONT_CANDIDATES:
        if os.path.exists(path):
            return path
    return None


def make_icon(size, radius_ratio=0.22, transparent=False, font_path=None):
    """Render a square brand icon: navy rounded square + gold serif 'C'.

    Small sizes get a slightly heavier glyph + stroke so the mark survives
    the 16-32px browser-tab rendering instead of turning into a smudge.
    """
    # Supersample 8x for crisp antialiasing
    ss = 8
    canvas = size * ss
    img = Image.new("RGBA", (canvas, canvas), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    if not transparent:
        r = int(canvas * radius_ratio)
        draw.rounded_rectangle([0, 0, canvas - 1, canvas - 1], radius=r, fill=NAVY)

    letter = "C"
    if font_path:
        # Fit font size so the glyph cap-height reads well inside the tile.
        # For 'C' a font size of ~0.70 * canvas gives a nicely weighted mark.
        boost = 0.06 if size <= 32 else 0.0
        stroke = int(canvas * 0.006)
        target = int(canvas * (0.70 + boost))
        font = ImageFont.truetype(font_path, target)
        bbox = draw.textbbox((0, 0), letter, font=font, stroke_width=stroke)
        gw = bbox[2] - bbox[0]
        gh = bbox[3] - bbox[1]
        x = (canvas - gw) / 2 - bbox[0]
        # Optical centering: serif sidebearings are uneven, nudge up slightly
        y = (canvas - gh) / 2 - bbox[1] - canvas * 0.012
        draw.text(
            (x, y), letter, font=font, fill=GOLD,
            stroke_width=stroke, stroke_fill=GOLD,
        )
    else:
        # Fallback: vector-ish ring + stem, no font dependency
        ring_w = int(canvas * 0.11)
        pad = int(canvas * 0.24)
        draw.arc(
            [pad, pad, canvas - pad, canvas - pad],
            start=35,
            end=325,
            fill=GOLD,
            width=ring_w,
        )

    img = img.resize((size, size), Image.LANCZOS)
    return img


def main():
    font_path = pick_font()
    print("font:", font_path or "<fallback ring>")

    os.makedirs(PUBLIC, exist_ok=True)
    os.makedirs(ASSETS, exist_ok=True)

    # 1. favicon.ico  (multi-size, Windows / Edge / SERP crawler favourite)
    ico_sizes = [16, 32, 48, 64, 128, 256]
    frames = [make_icon(s, font_path=font_path) for s in ico_sizes]
    ico_path = os.path.join(PUBLIC, "favicon.ico")
    frames[-1].save(ico_path, format="ICO", sizes=[(s, s) for s in ico_sizes])
    print("wrote", ico_path, os.path.getsize(ico_path), "bytes")

    # 2. favicon.svg -> keep the crisp hand-authored vector (already on brand)
    #    Regenerated below as a self-contained file so no dark-mode media
    #    query tricks confuse crawlers.
    svg = (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" '
        'role="img" aria-label="Charlizi Factory">\n'
        '  <rect width="64" height="64" rx="14" fill="#1a2540"/>\n'
        '  <text x="32" y="45" font-family="Georgia, \'Times New Roman\', serif" '
        'font-size="38" font-weight="bold" text-anchor="middle" '
        'fill="#b8865c">C</text>\n'
        '</svg>\n'
    )
    for p in (os.path.join(PUBLIC, "favicon.svg"), os.path.join(ASSETS, "favicon.svg")):
        with open(p, "w", encoding="utf-8", newline="\n") as f:
            f.write(svg)
        print("wrote", p)

    # 3. apple-touch-icon.png (180x180, must be opaque - iOS composites on white)
    #    iOS applies its own corner mask, so keep this a full-bleed square.
    apple = make_icon(180, radius_ratio=0.0, font_path=font_path)
    apple_rgb = Image.new("RGB", (180, 180), (26, 37, 64))
    apple_rgb.paste(apple, (0, 0), apple)
    for p in (
        os.path.join(PUBLIC, "apple-touch-icon.png"),
        os.path.join(ASSETS, "apple-touch-icon.png"),
    ):
        apple_rgb.save(p, format="PNG", optimize=True)
        print("wrote", p, os.path.getsize(p), "bytes")

    # 4. Extra PNG sizes for PWA / Android / Safari pinned tab sanity
    for size, name in ((192, "icon-192.png"), (512, "icon-512.png")):
        img = make_icon(size, font_path=font_path)
        p = os.path.join(PUBLIC, name)
        img.save(p, format="PNG", optimize=True)
        print("wrote", p, os.path.getsize(p), "bytes")

    # 5. Sync the .ico into src/assets so any component still importing it
    #    picks up the branded version.
    asset_ico = os.path.join(ASSETS, "favicon.ico")
    frames[-1].save(asset_ico, format="ICO", sizes=[(s, s) for s in ico_sizes])
    print("wrote", asset_ico, os.path.getsize(asset_ico), "bytes")

    print("done")


if __name__ == "__main__":
    sys.exit(main())
