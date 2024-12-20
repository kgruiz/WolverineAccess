import json
import os
from pathlib import Path

from PIL import Image
from PIL.ExifTags import TAGS


class ImageMetadataExtractor:

    def __init__(
        self, directory: str, outputEmptyMetadata: bool = True, outputAsXml: bool = True
    ):
        self.currentDir: Path = Path("..").resolve()
        self.directory: Path = self.currentDir / Path(directory)
        self.supportedFormats: tuple[str, str, str, str] = (
            ".jpeg",
            ".jpg",
            ".png",
            ".svg",
        )
        self.outputFile: str = "ImageIndex." + ("xml" if outputAsXml else "json")
        self.outputEmptyMetadata: bool = outputEmptyMetadata
        self.outputAsXml: bool = outputAsXml

    def ExtractMetadata(self) -> None:
        if self.outputAsXml:
            self._extractMetadataXml()
        else:
            self._extractMetadataJson()

    def _extractMetadataXml(self) -> None:
        with open(self.outputFile, "w") as file:
            file.write('<?xml version="1.0" encoding="UTF-8"?>\n<Images>\n')
            for root, _, files in os.walk(self.directory):
                for fileName in files:
                    if fileName.lower().endswith(self.supportedFormats):
                        filePath: Path = Path(root) / fileName
                        if "MPhotos" not in filePath.as_posix():
                            continue
                        relativePath: Path = filePath.relative_to(self.currentDir)
                        metadata: dict[str, str] | str = self.GetImageMetadata(filePath)
                        if (
                            fileName.lower().endswith(".svg")
                            or metadata == "No EXIF metadata found"
                            or len(metadata) == 0
                        ):
                            if self.outputEmptyMetadata:
                                file.write(
                                    f"  <Image>\n    <Path>{relativePath}</Path>\n    <Name>{fileName}</Name>\n    <Metadata>None</Metadata>\n  </Image>\n\n"
                                )
                                print(
                                    f"Path: {relativePath}\nName: {fileName}\nMetadata: None\n\n"
                                )
                            else:
                                file.write(
                                    f"  <Image>\n    <Path>{relativePath}</Path>\n    <Name>{fileName}</Name>\n  </Image>\n\n"
                                )
                                print(f"Path: {relativePath}\nName: {fileName}\n\n")
                        else:
                            metadataXml: str = "\n      ".join(
                                [
                                    f"<{key}>{value}</{key}>"
                                    for key, value in metadata.items()
                                ]
                            )
                            file.write(
                                f"  <Image>\n    <Path>{relativePath}</Path>\n    <Name>{fileName}</Name>\n    <Metadata>\n      {metadataXml}\n    </Metadata>\n  </Image>\n\n"
                            )
                            print(
                                f"Path: {relativePath}\nName: {fileName}\nMetadata: {metadataXml}\n\n"
                            )
            file.write("</Images>")

    def _extractMetadataJson(self) -> None:
        with open(self.outputFile, "w") as file:
            images = []
            for root, _, files in os.walk(self.directory):
                for fileName in files:
                    if fileName.lower().endswith(self.supportedFormats):
                        filePath: Path = Path(root) / fileName
                        if "MPhotos" not in filePath.as_posix():
                            continue
                        relativePath: Path = filePath.relative_to(self.currentDir)
                        metadata: dict[str, str] | str = self.GetImageMetadata(filePath)
                        if (
                            fileName.lower().endswith(".svg")
                            or metadata == "No EXIF metadata found"
                            or len(metadata) == 0
                        ):
                            if self.outputEmptyMetadata:
                                images.append(
                                    {
                                        "Path": str(relativePath),
                                        "Name": fileName,
                                        "Metadata": "None",
                                    }
                                )
                                print(
                                    f"Path: {relativePath}\nName: {fileName}\nMetadata: None\n\n"
                                )
                            else:
                                images.append(
                                    {"Path": str(relativePath), "Name": fileName}
                                )
                                print(f"Path: {relativePath}\nName: {fileName}\n\n")
                        else:
                            images.append(
                                {
                                    "Path": str(relativePath),
                                    "Name": fileName,
                                    "Metadata": metadata,
                                }
                            )
                            print(
                                f"Path: {relativePath}\nName: {fileName}\nMetadata: {metadata}\n\n"
                            )
            json.dump({"Images": images}, file, indent=4)

    def GetImageMetadata(self, filePath: Path) -> dict[str, str] | str:
        try:
            image = Image.open(filePath)
            info = image._getexif()
            if info is not None:
                desiredTags = [
                    "Make",
                    "Model",
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
    extractor = ImageMetadataExtractor(
        "../Assets/Media/", outputEmptyMetadata=True, outputAsXml=True
    )
    extractor.ExtractMetadata()
