import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

# Download required nltk data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt', quiet=True)

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords', quiet=True)


def extract_keywords(text):
    try:
        # Clean text
        text_clean = re.sub(r'[^a-zA-Z\s]', '', text.lower())

        # Tokenize
        tokens = word_tokenize(text_clean)

        # Remove stopwords
        stop_words = set(stopwords.words('english'))
        keywords = [
            word for word in tokens
            if word not in stop_words
            and len(word) > 2
        ]

        # Get unique keywords
        unique_keywords = list(set(keywords))

        # Sort by frequency
        keyword_freq = {}
        for word in keywords:
            keyword_freq[word] = keyword_freq.get(word, 0) + 1

        sorted_keywords = sorted(
            keyword_freq,
            key=keyword_freq.get,
            reverse=True
        )

        # Return top 20 keywords
        return sorted_keywords[:20]

    except Exception as e:
        print(f"Keyword Extractor Error: {str(e)}")
        return []