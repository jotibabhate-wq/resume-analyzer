import os
import pdfplumber


def read_pdf(file_path):
    try:
        if not os.path.exists(file_path):
            print(f"File not found: {file_path}")
            return None

        text = ''
        metadata = {}

        with pdfplumber.open(file_path) as pdf:
            # Extract metadata
            metadata = {
                'total_pages': len(pdf.pages),
                'file_name': os.path.basename(file_path),
                'file_size': os.path.getsize(file_path)
            }

            # Extract text from each page
            for page_num, page in enumerate(pdf.pages):
                page_text = page.extract_text()
                if page_text:
                    text += f"\n--- Page {page_num + 1} ---\n"
                    text += page_text

        return {
            'text': text.strip(),
            'metadata': metadata
        }

    except Exception as e:
        print(f"PDF Reader Error: {str(e)}")
        return None


def read_pdf_pages(file_path):
    try:
        pages = []

        with pdfplumber.open(file_path) as pdf:
            for page_num, page in enumerate(pdf.pages):
                page_text = page.extract_text()
                pages.append({
                    'page_number': page_num + 1,
                    'text': page_text if page_text else '',
                    'width': page.width,
                    'height': page.height
                })

        return pages

    except Exception as e:
        print(f"PDF Pages Error: {str(e)}")
        return []


def extract_tables_from_pdf(file_path):
    try:
        all_tables = []

        with pdfplumber.open(file_path) as pdf:
            for page_num, page in enumerate(pdf.pages):
                tables = page.extract_tables()
                if tables:
                    for table in tables:
                        all_tables.append({
                            'page': page_num + 1,
                            'data': table
                        })

        return all_tables

    except Exception as e:
        print(f"PDF Table Error: {str(e)}")
        return []


def get_pdf_metadata(file_path):
    try:
        with pdfplumber.open(file_path) as pdf:
            metadata = {
                'total_pages': len(pdf.pages),
                'file_name': os.path.basename(file_path),
                'file_size': f"{os.path.getsize(file_path) / 1024:.2f} KB"
            }
        return metadata

    except Exception as e:
        print(f"PDF Metadata Error: {str(e)}")
        return {}