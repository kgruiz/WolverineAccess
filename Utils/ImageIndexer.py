import json
import os

from PIL import Image
from PIL.ExifTags import TAGS


class ImageMetadataExtractor:
    def __init__(self, directory):
        self.directory = directory
        self.supportedFormats = (".jpeg", ".jpg", ".png", ".svg")
        self.outputFile = "ImageIndex.xml"

    def ExtractMetadata(self):
        with open(self.outputFile, "w") as file:
            file.write('<?xml version="1.0" encoding="UTF-8"?>\n<Images>\n')
            for root, _, files in os.walk(self.directory):
                for fileName in files:
                    if fileName.lower().endswith(self.supportedFormats):
                        filePath = os.path.join(root, fileName)
                        metadata = self.GetImageMetadata(filePath)
                        if (
                            fileName.lower().endswith(".svg")
                            or metadata == "No EXIF metadata found"
                        ):
                            file.write(
                                f"  <Image>\n    <Path>{filePath}</Path>\n    <Name>{fileName}</Name>\n    <Metadata>None</Metadata>\n  </Image>\n\n"
                            )
                            print(
                                f"Path: {filePath}\nName: {fileName}\nMetadata: None\n\n"
                            )
                        else:
                            metadataXml = "\n      ".join(
                                [
                                    f"<{key}>{value}</{key}>"
                                    for key, value in metadata.items()
                                ]
                            )
                            file.write(
                                f"  <Image>\n    <Path>{filePath}</Path>\n    <Name>{fileName}</Name>\n    <Metadata>\n      {metadataXml}\n    </Metadata>\n  </Image>\n\n"
                            )
                            print(
                                f"Path: {filePath}\nName: {fileName}\nMetadata: {metadataXml}\n\n"
                            )
            file.write("</Images>")

    def GetImageMetadata(self, filePath):
        try:
            image = Image.open(filePath)
            info = image._getexif()
            if info is not None:
                desiredTags = [
                    "ResolutionUnit",
                    "ImageDescription",
                    "DateTime",
                    "Orientation",
                    "Artist",
                    "XResolution",
                    "YResolution",
                ]
                return {
                    TAGS.get(tag): str(value)
                    for tag, value in info.items()
                    if TAGS.get(tag) in desiredTags
                }
            return "No EXIF metadata found"
        except Exception as e:
            return f"Error reading metadata: {e}"


if __name__ == "__main__":
    extractor = ImageMetadataExtractor("assets/")
    extractor.ExtractMetadata()
