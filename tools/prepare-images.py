# -*- coding: utf-8 -*-
"""
STEP UP - preparation des visuels produits.

Source : les 3 photos studio fournies (MC 1/2/3.jpg).
Sortie : public/products/*.webp

Pour chaque modele on produit :
  <slug>-main.webp      vue principale 4:5, fond studio conserve (galerie)
  <slug>-cut.webp       silhouette fondue en alpha (hero + cartes produits)
  <slug>-detail-1.webp  macro talon / col
  <slug>-detail-2.webp  macro lacage / semelle
  <slug>-og.webp        1200x630 pour Open Graph
Chaque visuel est exporte en 2 largeurs (1x / 2x) sauf l'OG.
"""
import os
from PIL import Image, ImageFilter, ImageChops

SRC = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(SRC, "public", "products")
os.makedirs(OUT, exist_ok=True)

# y de depart du bandeau texte incruste, detecte via l'etoile bleue
MODELS = [
    {"file": "MC 1.jpg", "slug": "step-one-navy",  "caption_y": 806},
    {"file": "MC 2.jpg", "slug": "step-one-white", "caption_y": 768},
    {"file": "MC 3.jpg", "slug": "step-one-black", "caption_y": 792},
]

BG = (2, 4, 10)  # #02040A : fond du site


def silhouette_bbox(im):
    """Boite englobante de la chaussure : luminance + contours (marche aussi
    sur le modele noir sur fond noir)."""
    g = im.convert("L")
    bright = g.point(lambda v: 255 if v > 42 else 0)
    edges = g.filter(ImageFilter.GaussianBlur(1)).filter(ImageFilter.FIND_EDGES)
    edges = edges.point(lambda v: 255 if v > 16 else 0)
    edges = edges.filter(ImageFilter.MaxFilter(5))
    mask = ImageChops.lighter(bright, edges)
    # on ronge les bords pour ignorer le vignettage du studio
    w, h = mask.size
    inner = Image.new("L", (w, h), 0)
    inner.paste(mask.crop((4, 4, w - 4, h - 4)), (4, 4))
    return inner.getbbox()


def feather_alpha(size, fx=0.14, fy=0.14):
    """Masque alpha : opaque au centre, fondu doux vers les bords, pour que le
    visuel se fonde dans le fond du site sans decoupe visible."""
    w, h = size
    mx, my = max(1, int(w * fx)), max(1, int(h * fy))
    m = Image.new("L", (w, h), 0)
    m.paste(Image.new("L", (w - 2 * mx, h - 2 * my), 255), (mx, my))
    return m.filter(ImageFilter.GaussianBlur(radius=min(mx, my) * 0.55))


def cover(im, ratio, anchor=0.5):
    """Recadre en conservant tout le sujet, au ratio demande (l/h)."""
    w, h = im.size
    if w / h > ratio:
        nw = int(h * ratio)
        x = int((w - nw) * anchor)
        return im.crop((x, 0, x + nw, h))
    nh = int(w / ratio)
    y = int((h - nh) * anchor)
    return im.crop((0, y, w, y + nh))


def save(im, name, widths, alpha=False, quality=86):
    for i, wpx in enumerate(widths):
        r = im.resize((wpx, round(im.height * wpx / im.width)), Image.LANCZOS)
        suffix = "" if i == 0 else "@2x"
        path = os.path.join(OUT, f"{name}{suffix}.webp")
        if alpha:
            r.save(path, "WEBP", quality=quality, method=6, exact=True)
        else:
            r.convert("RGB").save(path, "WEBP", quality=quality, method=6)
        print(f"  -> {os.path.basename(path)}  {r.width}x{r.height}  "
              f"{os.path.getsize(path)//1024} Ko")


for m in MODELS:
    print(m["file"])
    im = Image.open(os.path.join(SRC, m["file"])).convert("RGB")
    im = im.crop((0, 0, im.width, m["caption_y"]))   # bandeau texte retire

    bbox = silhouette_bbox(im)
    print("   silhouette", bbox, "sur", im.size)
    bx0, by0, bx1, by1 = bbox

    # --- vue principale 4:5, sujet centre ---
    cx = (bx0 + bx1) / 2 / im.width
    main = cover(im, 4 / 5, anchor=min(max(cx - 0.5 + 0.5, 0), 1))
    save(main, m["slug"] + "-main", [800, 1400])

    # --- silhouette fondue (hero / cartes) ---
    pad_x = int((bx1 - bx0) * 0.10)
    pad_y = int((by1 - by0) * 0.12)
    cut = im.crop((max(0, bx0 - pad_x), max(0, by0 - pad_y),
                   min(im.width, bx1 + pad_x), min(im.height, by1 + pad_y)))
    cut = cut.convert("RGBA")
    cut.putalpha(feather_alpha(cut.size))
    save(cut, m["slug"] + "-cut", [900, 1600], alpha=True, quality=90)

    # --- macros : haut/arriere (col, talon) et bas/avant (semelle, lacage) ---
    bw, bh = bx1 - bx0, by1 - by0
    d1 = im.crop((bx0, by0, bx0 + int(bw * 0.55), by0 + int(bh * 0.72)))
    save(cover(d1, 4 / 5), m["slug"] + "-detail-1", [700, 1200])
    d2 = im.crop((bx0 + int(bw * 0.38), by0 + int(bh * 0.28), bx1, by1))
    save(cover(d2, 4 / 5), m["slug"] + "-detail-2", [700, 1200])

    # --- Open Graph 1200x630 ---
    og = Image.new("RGB", (1200, 630), BG)
    s = cut.resize((int(cut.width * 560 / cut.height), 560), Image.LANCZOS)
    og.paste(s, (600 - s.width // 2, 35), s)
    og.save(os.path.join(OUT, f"{m['slug']}-og.webp"), "WEBP", quality=88, method=6)
    print(f"  -> {m['slug']}-og.webp  1200x630")

print("\nTermine.")
