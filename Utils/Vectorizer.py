from pathlib import Path

import potrace
import svgwrite
from PIL import Image


def PngToSvg(inputPng: str, outputSvg: str):

    inputPath = Path(inputPng)
    if not inputPath.exists():
        print(f"Error: The file {inputPng} does not exist.")
        return

    img = Image.open(inputPath).convert("L")

    threshold = 128
    binarizedImg = img.point(lambda pixel: pixel > threshold and 255)

    bitmap = potrace.Bitmap(binarizedImg)
    tracedPath = bitmap.trace()

    svgDrawing = svgwrite.Drawing(outputSvg)

    for curve in tracedPath:
        points = [(point.x, point.y) for point in curve]
        svgDrawing.add(svgDrawing.polyline(points, stroke="black", fill="none"))

    svgDrawing.save()
    print(f"SVG saved to {outputSvg}")


# Example usage
if __name__ == "__main__":
    inputFilePath = "input.png"
    outputFilePath = "output.svg"
    PngToSvg(inputFilePath, outputFilePath)
