from pathlib import Path

# Define the file extensions to include
includedExtensions = {".py", ".js", ".html", ".css"}


def isHidden(path):
    """Check if the path or any of its parents is hidden."""
    return any(part.startswith(".") for part in path.parts)


def countLinesInFile(filePath):
    """Count the number of lines in a given file."""
    try:
        with filePath.open("r", encoding="utf-8") as file:
            return sum(1 for _ in file)
    except Exception as e:
        print(f"Error reading file {filePath}: {e}")
        return 0


def main():
    currentScript = Path(__file__).resolve()
    totalLines = 0

    print("Counting lines in files...")

    for path in currentScript.parent.parent.rglob("*"):
        # Skip hidden files and directories
        if isHidden(path):
            continue

        # Check the file extension
        if path.suffix in includedExtensions:
            # Skip counting the current script file
            if path == currentScript:
                continue

            # Count lines in the file
            lineCount = countLinesInFile(path)
            totalLines += lineCount

            print(f"{path}: {lineCount} lines")

    print("\nTotal lines across all files:", totalLines)


if __name__ == "__main__":
    main()
