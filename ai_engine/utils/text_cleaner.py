import re


def clean_text(text):
    try:
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)

        # Remove special characters but keep important ones
        text = re.sub(r'[^\w\s.,;:()\-@+#]', '', text)

        # Remove multiple dots
        text = re.sub(r'\.{2,}', '.', text)

        # Remove leading/trailing whitespace
        text = text.strip()

        return text

    except Exception as e:
        print(f"Clean Text Error: {str(e)}")
        return text


def remove_stopwords(text, stop_words):
    try:
        words = text.split()
        filtered = [
            word for word in words
            if word.lower() not in stop_words
        ]
        return ' '.join(filtered)

    except Exception as e:
        print(f"Remove Stopwords Error: {str(e)}")
        return text


def normalize_text(text):
    try:
        # Lowercase
        text = text.lower()

        # Remove numbers
        text = re.sub(r'\d+', '', text)

        # Remove punctuation
        text = re.sub(r'[^\w\s]', '', text)

        # Remove extra spaces
        text = re.sub(r'\s+', ' ', text).strip()

        return text

    except Exception as e:
        print(f"Normalize Error: {str(e)}")
        return text


def extract_emails(text):
    try:
        pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
        return re.findall(pattern, text)
    except Exception as e:
        print(f"Extract Email Error: {str(e)}")
        return []


def extract_phones(text):
    try:
        pattern = r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
        return re.findall(pattern, text)
    except Exception as e:
        print(f"Extract Phone Error: {str(e)}")
        return []


def extract_urls(text):
    try:
        pattern = r'https?://\S+|www\.\S+|linkedin\.com/\S+|github\.com/\S+'
        return re.findall(pattern, text)
    except Exception as e:
        print(f"Extract URL Error: {str(e)}")
        return []


def remove_html_tags(text):
    try:
        clean = re.sub(r'<.*?>', '', text)
        return clean.strip()
    except Exception as e:
        print(f"Remove HTML Error: {str(e)}")
        return text


def fix_encoding(text):
    try:
        text = text.encode('utf-8', errors='ignore').decode('utf-8')
        return text
    except Exception as e:
        print(f"Fix Encoding Error: {str(e)}")
        return text