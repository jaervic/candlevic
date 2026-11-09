from PIL import Image, ImageDraw

BG = (11, 14, 18, 255)
AMBER = (240, 180, 41, 255)
GREEN = (47, 212, 124, 255)
S = 1024


def base(maskable: bool) -> Image.Image:
    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    if maskable:
        d.rectangle([0, 0, S, S], fill=BG)
    else:
        d.rounded_rectangle([28, 28, S - 28, S - 28], radius=230, fill=BG)

    # vela ámbar
    d.rounded_rectangle([268, 300, 292, 760], radius=12, fill=(240, 180, 41, 150))
    d.rounded_rectangle([212, 408, 348, 664], radius=34, fill=AMBER)

    # vela verde
    d.rounded_rectangle([720, 232, 744, 700], radius=12, fill=(47, 212, 124, 150))
    d.rounded_rectangle([664, 330, 800, 610], radius=34, fill=GREEN)

    # línea de tendencia
    d.line([(330, 610), (540, 470), (700, 520)], fill=(233, 238, 245, 210), width=26, joint="curve")
    return img


def save(img: Image.Image, size: int, path: str) -> None:
    img.resize((size, size), Image.LANCZOS).save(path, "PNG")


import os

os.makedirs("public/icons", exist_ok=True)
normal = base(False)
maskable = base(True)

save(normal, 512, "app/icon.png")
save(normal, 180, "app/apple-icon.png")
save(normal, 192, "public/icons/icon-192.png")
save(normal, 512, "public/icons/icon-512.png")
save(maskable, 512, "public/icons/maskable-512.png")
save(maskable, 192, "public/icons/maskable-192.png")
print("iconos generados")
