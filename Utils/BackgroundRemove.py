from pathlib import Path

from PIL import Image
from tqdm import tqdm


def DeleteOldImages(imageDir: Path):
    oldImagePaths = list(imageDir.glob("Old*.png"))
    for oldImagePath in oldImagePaths:
        oldImagePath.unlink()


def RemoveWhiteBackground(imageDir: Path):
    imagePaths = list(imageDir.glob("*.png"))
    totalImages = len(imagePaths)

    oldDir = imageDir.parent / ("Old" + imageDir.name)
    oldDir.mkdir(exist_ok=True)

    for imagePath in tqdm(imagePaths, desc="Processing images", total=totalImages):
        image = Image.open(imagePath).convert("RGBA")
        datas = image.getdata()

        newData = []
        for item in datas:
            if item[0] > 200 and item[1] > 200 and item[2] > 200:
                newData.append((255, 255, 255, 0))
            else:
                newData.append(item)

        image.putdata(newData)
        newImagePath = imageDir / imagePath.name
        image.save(newImagePath)

        oldImagePath = oldDir / imagePath.name
        image.save(oldImagePath)


RemoveWhiteBackground(Path("../../../Assets/Media/Current"))
