import os
import zipfile
import shutil

DATA_DIR = "Data"
OUTPUT_DIR = os.path.join("Output", "images", "extracted")

if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

def extract_from_zip(filepath):
    """Extract images from DOCX/PPTX files (which are ZIP archives)."""
    filename = os.path.basename(filepath)
    prefix = os.path.splitext(filename)[0]

    try:
        with zipfile.ZipFile(filepath, 'r') as archive:
            for item in archive.namelist():
                if item.startswith('word/media/') or item.startswith('ppt/media/'):
                    ext = os.path.splitext(item)[1]
                    if ext.lower() in ['.png', '.jpg', '.jpeg', '.emf', '.wmf', '.gif']:
                        source = archive.open(item)
                        safe_name = f"{prefix[:10]}_{os.path.basename(item)}"
                        safe_name = "".join([c if c.isalnum() or c in "._-" else "_" for c in safe_name])
                        out_path = os.path.join(OUTPUT_DIR, safe_name)
                        with open(out_path, "wb") as f:
                            shutil.copyfileobj(source, f)
    except zipfile.BadZipFile:
        pass
    except Exception:
        pass

def main():
    for root, dirs, files in os.walk(DATA_DIR):
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in ['.pptx', '.docx']:
                filepath = os.path.join(root, file)
                try:
                    print(f"Processing: {filepath.encode('utf-8', 'ignore').decode('utf-8')}")
                except Exception:
                    pass
                extract_from_zip(filepath)

if __name__ == "__main__":
    main()
