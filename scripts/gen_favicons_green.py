# -*- coding: utf-8 -*-
"""
Build the charlizi.com favicon set from the watermark-free green/gold logo
(source: D:/LOGO设计创意图生成 (1).jpeg  ->  tmp_logo_src/green_nw.jpeg).

Design source: rounded-square "C" tile, forest-green #053C32 ground with a
metallic gold gradient letterform.

Sizes <= 32px cannot resolve the gradient and it bands badly when written to
ICO, so those are re-rendered as flat gold instead of resampled.
"""
import os
import sys

import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC = os.path.join(ROOT, "public")
ASSETS = os.path.join(ROOT, "src", "assets", "favicons")

SRC = os.path.join(ROOT, "tmp_logo_src", "green_nw.jpeg")

# tile geometry measured from the source
LEFT, TOP, SIZE = 134, 129, 1781

BG = (5, 60, 50)                 # #053C32 forest green
GOLD_FLAT = (216, 165, 81)       # #D8A551 mid metallic gold
GOLD_LIGHT = (255, 237, 169)     # #FFEDA9
GOLD_DARK = (196, 143, 63)       # #C48F3F

# The letterform occupies this fraction of the tile in the source, measured:
GOLD_BOX = (486, 416, 811, 953)  # x, y, w, h inside the 1781px tile


def load_tile():
    im = Image.open(SRC).convert("RGB")
    tile = im.crop((LEFT, TOP, LEFT + SIZE, TOP + SIZE))
    # The source corners are near-square with a tiny radius; corners were white
    # in the JPEG so any leftover fringe shows as light pixels. Round them off
    # cleanly with a mask instead of inheriting JPEG artefacts.
    W, H = tile.size
    mask = Image.new("L", (W, H), 0)
    from PIL import ImageDraw
    d = ImageDraw.Draw(mask)
    d.rounded_rectangle([0, 0, W - 1, H - 1], radius=int(W * 0.22), fill=255)
    out = Image.new("RGB", (W, H), BG)
    out.paste(tile, (0, 0), mask)
    return out


def gold_mask(tile):
    """Boolean mask of the gold letterform."""
    a = np.array(tile).astype(int)
    r, g, b = a[:, :, 0], a[:, :, 1], a[:, :, 2]
    return (r > 120) & (g > 100) & (r > b + 40)


def flat_icon(size, radius_ratio=0.22, ss=8, bbox_ratio=None, dy_ratio=0.0):
    """Flat-gold icon for small sizes: solid rounded tile + solid gold C glyph.

    Uses the real glyph silhouette (from the source alpha), recoloured to a
    single gold tone so nothing bands at 16-32px.
    """
    from PIL import ImageDraw

    tile = load_tile()
    mask = gold_mask(tile)
    ys, xs = np.where(mask)
    x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()

    # cut the glyph out on a transparent canvas
    glyph = Image.new("L", (x1 - x0 + 1, y1 - y0 + 1), 0)
    gm = Image.fromarray((mask[y0:y1 + 1, x0:x1 + 1] * 255).astype(np.uint8), "L")
    glyph.paste(gm, (0, 0))

    canvas = size * ss
    img = Image.new("RGBA", (canvas, canvas), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([0, 0, canvas - 1, canvas - 1],
                        radius=int(canvas * radius_ratio), fill=BG + (255,))

    # scale glyph so it keeps a sane share of the tile
    share = bbox_ratio if bbox_ratio else 0.545
    target_h = int(canvas * share)
    gw = int(glyph.width * (target_h / glyph.height))
    g = glyph.resize((gw, target_h), Image.LANCZOS)

    gx = (canvas - gw) // 2
    gy = int((canvas - target_h) / 2 + canvas * dy_ratio)

    layer = Image.new("RGBA", (canvas, canvas), (0, 0, 0, 0))
    solid = Image.new("RGBA", g.size, GOLD_FLAT + (255,))
    layer.paste(solid, (gx, gy), g)
    img = Image.alpha_composite(img, layer)
    return img.resize((size, size), Image.LANCZOS)


def gradient_icon(size):
    """Full-fidelity icon for large sizes: keep the source gradient."""
    tile = load_tile()
    return tile.resize((size, size), Image.LANCZOS)


def main():
    os.makedirs(PUBLIC, exist_ok=True)
    os.makedirs(ASSETS, exist_ok=True)

    # ---- favicon.ico : multi-resolution, small frames flat, big frames gradient
    frames = {}
    for s in (16, 24, 32):
        frames[s] = flat_icon(s, dy_ratio=-0.006)
    for s in (48, 64, 128, 256):
        frames[s] = gradient_icon(s).convert("RGBA")

    ico_path = os.path.join(PUBLIC, "favicon.ico")
    biggest = frames[256]
    biggest.save(ico_path, format="ICO",
                 sizes=[(s, s) for s in (16, 24, 32, 48, 64, 128, 256)],
                 append_images=[frames[s] for s in (32, 64, 128, 256) if s != 256])
    print("favicon.ico        ", os.path.getsize(ico_path), "bytes")

    # ---- PNG icons
    for name, size in (("favicon-32.png", 32), ("favicon-48.png", 48),
                       ("icon-192.png", 192), ("icon-512.png", 512)):
        img = flat_icon(size) if size <= 48 else gradient_icon(size)
        p = os.path.join(PUBLIC, name)
        img.convert("RGBA").save(p, format="PNG", optimize=True)
        print(f"{name:20s}", os.path.getsize(p), "bytes")

    # ---- apple-touch-icon : 180x180, opaque, iOS applies its own mask
    apple = gradient_icon(180).convert("RGB")
    for p in (os.path.join(PUBLIC, "apple-touch-icon.png"),
              os.path.join(ASSETS, "apple-touch-icon.png")):
        apple.save(p, format="PNG", optimize=True)
        print("apple-touch-icon.png", os.path.getsize(p), "bytes")

    # ---- favicon.svg : vector recreation of the flat mark
    svg = (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" '
        'role="img" aria-label="Charlizi">\n'
        '  <rect width="64" height="64" rx="14" fill="#053C32"/>\n'
        '  <text x="32" y="45" font-family="Inter, Helvetica, Arial, sans-serif" '
        'font-size="39" font-weight="800" text-anchor="middle" '
        'fill="#D8A551">C</text>\n'
        '</svg>\n'
    )
    for p in (os.path.join(PUBLIC, "favicon.svg"),
              os.path.join(ASSETS, "favicon.svg")):
        with open(p, "w", encoding="utf-8", newline="\n") as f:
            f.write(svg)
        print("favicon.svg         ", os.path.getsize(p), "bytes")

    # ---- sync a branded .ico + 512 into src/assets for any component import
    for p in (os.path.join(ASSETS, "favicon.ico"),):
        frames[256].save(p, format="ICO",
                         sizes=[(s, s) for s in (16, 24, 32, 48, 64, 128, 256)],
                         append_images=[frames[s] for s in (32, 64, 128) ])
        print("assets/favicon.ico  ", os.path.getsize(p), "bytes")

    print("done")


if __name__ == "__main__":
    sys.exit(main())
