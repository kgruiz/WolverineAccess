from pathlib import Path

from fpdf import FPDF


def images_to_pdf_grid(directory_path: str, output_pdf: str):
    """
    Creates a PDF with all images in a directory arranged in a grid of 5 columns per page.
    Each image is captioned with its relative path.
    """
    directory = Path(directory_path)

    if not directory.exists():
        print(f"Error: The directory '{directory_path}' does not exist.")
        return

    # Initialize the PDF
    pdf = FPDF("P", "mm", "A4")
    pdf.set_auto_page_break(auto=True, margin=5)

    # Image grid parameters
    cell_width = 20  # Width of each cell (image)
    cell_height = 20  # Height of each cell (image)
    caption_height = 6  # Space for caption
    margin = 5  # Margin around the page
    columns = 5  # Number of columns
    spacing = 5  # Space between images

    x_start = margin
    y_start = margin
    x_pos = x_start
    y_pos = y_start

    # Add a new page to start
    pdf.add_page()

    for file in directory.iterdir():
        if file.is_file() and file.suffix.lower() in [
            ".png",
            ".jpg",
            ".jpeg",
            ".gif",
            ".bmp",
            ".tiff",
        ]:

            if not file.stem[0].isdigit():

                continue

            try:
                # Add the image
                pdf.image(str(file), x=x_pos, y=y_pos, w=cell_width, h=cell_height)

                # Add the caption
                pdf.set_xy(x_pos, y_pos + cell_height)
                pdf.set_font("Arial", size=8)
                pdf.multi_cell(
                    cell_width,
                    caption_height,
                    str(file.relative_to(directory)),
                    align="C",
                )

                # Update x_pos for the next image
                x_pos += cell_width + spacing

                # Move to the next row if the current row is full
                if x_pos + cell_width > pdf.w - margin:
                    x_pos = x_start
                    y_pos += cell_height + caption_height + spacing

                # Add a new page if the current page is full
                if y_pos + cell_height + caption_height > pdf.h - margin:
                    pdf.add_page()
                    x_pos = x_start
                    y_pos = y_start

            except RuntimeError as e:
                print(f"Skipping file '{file}': {e}")

    # Save the PDF
    pdf.output(output_pdf)
    print(f"PDF created successfully: {output_pdf}")


# Usage
images_to_pdf_grid("../assets/Current", "output.pdf")
