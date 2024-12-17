import xml.etree.ElementTree as ET

import PyPDF2


class PdfToXmlConverter:
    def __init__(self, pdfPath, xmlPath):
        self.pdfPath = pdfPath
        self.xmlPath = xmlPath

    def ReadPdf(self):
        with open(self.pdfPath, "rb") as file:
            reader = PyPDF2.PdfReader(file)
            text = ""
            for pageNum in range(len(reader.pages)):
                page = reader.pages[pageNum]
                text += page.extract_text()
        return text

    def WriteToXml(self, text):
        root = ET.Element("Document")
        content = ET.SubElement(root, "Content")
        content.text = text
        tree = ET.ElementTree(root)
        tree.write(self.xmlPath)

    def Convert(self):
        text = self.ReadPdf()
        self.WriteToXml(text)


if __name__ == "__main__":
    converter = PdfToXmlConverter("BrandingGuidelines.pdf", "BrandingGuidelines.xml")
    converter.Convert()
