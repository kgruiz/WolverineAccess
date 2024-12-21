import re
from pathlib import *

from tqdm import tqdm

directory = Path("./Scripts")

jsFiles = [
    file for file in directory.iterdir() if file.is_file() and file.suffix == ".js"
]

exportPattern = r"^export (function|let|const) ([^\s\()]+)"

exportMatches = dict()

for file in jsFiles:

    fileExports = []

    with open(file, "r") as f:
        for line in f:
            match = re.match(exportPattern, line, flags=re.MULTILINE)

            if match:
                fileExports.append(match.group(2))

    exportMatches[file.relative_to(directory).as_posix()] = fileExports

print(exportMatches)
