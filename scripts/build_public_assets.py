from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]


def font(size: int, bold: bool = False):
    names = [
        "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf",
        "DejaVuSans-Bold.ttf" if bold else "DejaVuSans.ttf",
    ]
    for name in names:
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            pass
    return ImageFont.load_default()


image = Image.new("RGB", (1200, 630), "#FAFAF8")
draw = ImageDraw.Draw(image)
draw.rounded_rectangle((70, 65, 1130, 565), 42, fill="#FFFFFF", outline="#E2DFD7", width=3)
draw.rounded_rectangle((105, 105, 215, 215), 26, fill="#4F46E5")
draw.text((132, 122), "NA", font=font(38, True), fill="white")
draw.text((105, 270), "Naresh Adhikari", font=font(60, True), fill="#0B0B0F")
draw.text((105, 350), "Professional IT & Systems Support", font=font(38, True), fill="#4F46E5")
draw.text((105, 415), "Sydney homes and small businesses", font=font(28), fill="#3A3A44")
draw.rounded_rectangle((105, 485, 420, 530), 18, fill="#FF6B4A")
draw.text((130, 494), "No Fix, No Fee", font=font(22, True), fill="#20100C")

(ROOT / "assets/images").mkdir(parents=True, exist_ok=True)
image.save(ROOT / "assets/images/social-share.png", optimize=True)

(ROOT / "favicon.svg").write_text(
    '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x2="1" y2="1"><stop stop-color="#4F46E5"/><stop offset="1" stop-color="#7C3AED"/></linearGradient></defs><rect width="64" height="64" rx="15" fill="url(#g)"/><path d="M19 45V19l26 26V19" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="19" cy="19" r="4" fill="#FF6B4A"/></svg>''',
    encoding="utf-8",
)
