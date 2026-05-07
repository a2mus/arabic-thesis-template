"""Read style information from template DOCX files in Styles/ directory.

Useful for extracting font families, sizes, and heading styles
from the formatting template before generating the output document.
"""
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

from docx import Document
import os

# Update this path to point to your style template directory
styles_dir = r"Styles"

# Add the template files you want to inspect
files_to_read = [
    # Example: "cover.docx", "chapter.docx", "conclusion.docx"
]

for fname in files_to_read:
    fpath = os.path.join(styles_dir, fname)
    if os.path.exists(fpath):
        print(f"\n{'='*60}")
        print(f"FILE: {fname}")
        print(f"{'='*60}")
        doc = Document(fpath)
        for i, p in enumerate(doc.paragraphs):
            if p.text.strip():
                style_name = p.style.name if p.style else "None"
                print(f"[{style_name}] {p.text.strip()}")
    else:
        print(f"NOT FOUND: {fname}")
