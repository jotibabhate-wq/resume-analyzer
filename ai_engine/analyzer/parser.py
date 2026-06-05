import os
import pdfplumber
import docx

def extract_text(file_path):
    try:
        ext = os.path.splitext(file_path)[1].lower()

        if ext == '.pdf':
            return extract_from_pdf(file_path)
        elif ext in ['.doc', '.docx']:
            return extract_from_docx(file_path)
        else:
            return None

    except Exception as e:
        print(f"Parser Error: {str(e)}")
        return None


def extract_from_pdf(file_path):
    try:
        text = ''
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + '\n'
        return text.strip()
    except Exception as e:
        print(f"PDF Error: {str(e)}")
        return None


def extract_from_docx(file_path):
    try:
        doc = docx.Document(file_path)
        text = ''
        for paragraph in doc.paragraphs:
            if paragraph.text:
                text += paragraph.text + '\n'
        return text.strip()
    except Exception as e:
        print(f"DOCX Error: {str(e)}")
        return None