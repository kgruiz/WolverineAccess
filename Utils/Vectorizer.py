#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import logging
import operator
import sys
from collections import deque
from io import StringIO

from PIL import Image
from tqdm import tqdm

logging.basicConfig()
log = logging.getLogger("png2svg")


def AddTuple(a, b):
    return tuple(map(operator.add, a, b))


def SubTuple(a, b):
    return tuple(map(operator.sub, a, b))


def NegTuple(a):
    return tuple(map(operator.neg, a))


def Direction(edge):
    return SubTuple(edge[1], edge[0])


def Magnitude(a):
    return int(pow(pow(a[0], 2) + pow(a[1], 2), 0.5))


def Normalize(a):
    mag = Magnitude(a)
    if mag <= 0:
        raise ValueError("Cannot normalize a zero-length vector")
    return tuple(map(operator.truediv, a, [mag] * len(a)))


def SvgHeader(width, height):
    return f"""<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
  "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg width="{width}" height="{height}"
     xmlns="http://www.w3.org/2000/svg" version="1.1">
"""


def RgbaImageToSvgPixels(im, opaque=None):
    s = StringIO()
    s.write(SvgHeader(*im.size))

    width, height = im.size
    for x in tqdm(range(width), desc="Processing width"):
        for y in tqdm(range(height), desc="Processing height", leave=False):
            here = (x, y)
            rgba = im.getpixel(here)
            if opaque and not rgba[3]:
                continue
            s.write(
                f"""  <rect x="{x}" y="{y}" width="1" height="1" style="fill:rgb{rgba[0:3]}; fill-opacity:{float(rgba[3]) / 255:.3f}; stroke:none;" />\n"""
            )
    s.write("</svg>\n")
    return s.getvalue()


def JoinedEdges(assortedEdges, keepEveryPoint=False):
    pieces = []
    piece = []
    directions = deque(
        [
            (0, 1),
            (1, 0),
            (0, -1),
            (-1, 0),
        ]
    )
    while assortedEdges:
        if not piece:
            piece.append(assortedEdges.pop())
        currentDirection = Normalize(Direction(piece[-1]))
        while currentDirection != directions[2]:
            directions.rotate()
        for i in tqdm(range(1, 4), desc="Finding next edge", leave=False):
            nextEnd = AddTuple(piece[-1][1], directions[i])
            nextEdge = (piece[-1][1], nextEnd)
            if nextEdge in assortedEdges:
                assortedEdges.remove(nextEdge)
                if i == 2 and not keepEveryPoint:
                    piece[-1] = (piece[-1][0], nextEdge[1])
                else:
                    piece.append(nextEdge)
                if piece[0][0] == piece[-1][1]:
                    if not keepEveryPoint and Normalize(
                        Direction(piece[0])
                    ) == Normalize(Direction(piece[-1])):
                        piece[-1] = (piece[-1][0], piece.pop(0)[1])
                    pieces.append(piece)
                    piece = []
                break
        else:
            raise Exception("Failed to find connecting edge")
    return pieces


def RgbaImageToSvgContiguous(im, opaque=None, keepEveryPoint=False):
    """
    Convert an RGBA image to SVG by grouping contiguous pixels of the same color into paths.
    """
    # Define adjacent pixel offsets (right, down, left, up)
    adjacent = ((1, 0), (0, 1), (-1, 0), (0, -1))
    visited = Image.new("1", im.size, 0)

    colorPixelLists = {}

    width, height = im.size
    for x in tqdm(range(width), desc="Processing width"):
        for y in tqdm(range(height), desc="Processing height", leave=False):
            here = (x, y)
            if visited.getpixel(here):
                continue
            rgba = im.getpixel(here)
            if opaque and not rgba[3]:
                continue
            piece = []
            queue = [here]
            visited.putpixel(here, 1)
            while queue:
                current = queue.pop()
                for offset in adjacent:
                    neighbour = AddTuple(current, offset)
                    if not (0 <= neighbour[0] < width) or not (
                        0 <= neighbour[1] < height
                    ):
                        continue
                    if visited.getpixel(neighbour):
                        continue
                    neighbourRgba = im.getpixel(neighbour)
                    if neighbourRgba != rgba:
                        continue
                    queue.append(neighbour)
                    visited.putpixel(neighbour, 1)
                piece.append(current)

            if rgba not in colorPixelLists:
                colorPixelLists[rgba] = []
            colorPixelLists[rgba].append(piece)

    del adjacent
    del visited

    # Define edge positions relative to a pixel
    edges = {
        (-1, 0): ((0, 0), (0, 1)),
        (0, 1): ((0, 1), (1, 1)),
        (1, 0): ((1, 1), (1, 0)),
        (0, -1): ((1, 0), (0, 0)),
    }

    colorEdgeLists = {}

    for rgba, pieces in tqdm(colorPixelLists.items(), desc="Processing colors"):
        for piecePixelList in tqdm(pieces, desc="Processing pieces", leave=False):
            edgeSet = set()
            for coord in tqdm(
                piecePixelList, desc="Processing coordinates", leave=False
            ):
                for offset, (startOffset, endOffset) in edges.items():
                    neighbour = AddTuple(coord, offset)
                    start = AddTuple(coord, startOffset)
                    end = AddTuple(coord, endOffset)
                    edge = (start, end)
                    if neighbour in piecePixelList:
                        continue
                    edgeSet.add(edge)
            if rgba not in colorEdgeLists:
                colorEdgeLists[rgba] = []
            colorEdgeLists[rgba].append(edgeSet)

    del colorPixelLists
    del edges

    # Join edges of pixel groups to form continuous paths
    colorJoinedPieces = {}

    for color, pieces in tqdm(colorEdgeLists.items(), desc="Joining edges"):
        colorJoinedPieces[color] = []
        for assortedEdges in tqdm(
            pieces, desc="Processing assorted edges", leave=False
        ):
            colorJoinedPieces[color].append(JoinedEdges(assortedEdges, keepEveryPoint))

    s = StringIO()
    s.write(SvgHeader(*im.size))

    for color, shapes in tqdm(colorJoinedPieces.items(), desc="Writing SVG"):
        for shape in tqdm(shapes, desc="Processing shapes", leave=False):
            s.write(' <path d=" ')
            for subShape in tqdm(shape, desc="Processing sub-shapes", leave=False):
                here = subShape.pop(0)[0]
                s.write(f" M {here[0]},{here[1]} ")
                for edge in subShape:
                    here = edge[0]
                    s.write(f" L {here[0]},{here[1]} ")
                s.write(" Z ")
            s.write(
                f'" style="fill:rgb{color[0:3]}; fill-opacity:{float(color[3]) / 255:.3f}; stroke:none;" />\n'
            )

    s.write("</svg>\n")
    return s.getvalue()


def PngToSvg(filename, contiguous=None, opaque=None, keepEveryPoint=None):
    """
    Convert a PNG file to SVG format.

    Parameters:
    - filename: Path to the input PNG file.
    - contiguous: If True, group contiguous pixels of the same color into paths.
    - opaque: If True, ignore fully transparent pixels.
    - keepEveryPoint: If True, retain every point in the path edges.

    Returns:
    - A string containing the SVG representation of the image.
    """
    try:
        im = Image.open(filename)
    except IOError:
        sys.stderr.write(f"{filename}: Could not open as image file\n")
        sys.exit(1)
    imRgba = im.convert("RGBA")

    if contiguous:
        return RgbaImageToSvgContiguous(imRgba, opaque, keepEveryPoint)
    else:
        return RgbaImageToSvgPixels(imRgba, opaque)


def Main():
    """
    Main function to execute the PNG to SVG conversion.
    """
    # Define the input and output file paths
    inputFilePath = "/Users/kadengruizenga/Development/Projects/WolverineAccess/Assets/Media/WolverineAccessBanner.png"
    outputFilePath = "/Users/kadengruizenga/Development/Projects/WolverineAccess/Assets/Media/WolverineAccessBanner.svg"

    # Define conversion options
    contiguous = True  # Set to True to group contiguous pixels into paths
    opaque = True  # Set to True to ignore fully transparent pixels
    keepEveryPoint = False  # Set to True to retain every point in the path edges

    log.setLevel(
        logging.DEBUG
    )  # Set logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)

    # Perform the conversion
    svgOutput = PngToSvg(
        inputFilePath,
        contiguous=contiguous,
        opaque=opaque,
        keepEveryPoint=keepEveryPoint,
    )

    # Write the SVG output to the specified file
    try:
        with open(outputFilePath, "w", encoding="utf-8") as svgFile:
            svgFile.write(svgOutput)
        print(f"SVG file successfully created at: {outputFilePath}")
    except IOError as e:
        sys.stderr.write(f"Failed to write SVG file: {e}\n")
        sys.exit(1)


if __name__ == "__main__":
    Main()
