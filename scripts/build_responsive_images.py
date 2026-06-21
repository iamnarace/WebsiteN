from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets/images/optimized"
OUT.mkdir(parents=True, exist_ok=True)

for name in ("naresh-profile", "aboutme"):
    with Image.open(ROOT / f"assets/images/{name}.png") as source:
        rgb = ImageOps.exif_transpose(source).convert("RGB")
        for width in (320, 640, 960):
            height = round(rgb.height * width / rgb.width)
            resized = rgb.resize((width, height), Image.Resampling.LANCZOS)
            resized.save(OUT / f"{name}-{width}.webp", "WEBP", quality=78, method=6)
            resized.save(OUT / f"{name}-{width}.avif", "AVIF", quality=55, speed=6)
