import re
import nltk
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.corpus import stopwords

# Download required nltk data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt', quiet=True)

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords', quiet=True)


class NLPModel:
    def __init__(self):
        self.stop_words = set(stopwords.words('english'))

    # Clean and preprocess text
    def preprocess(self, text):
        try:
            # Lowercase
            text = text.lower()

            # Remove special characters
            text = re.sub(r'[^a-zA-Z\s]', '', text)

            # Remove extra spaces
            text = re.sub(r'\s+', ' ', text).strip()

            return text

        except Exception as e:
            print(f"Preprocess Error: {str(e)}")
            return text

    # Tokenize text into words
    def tokenize_words(self, text):
        try:
            text = self.preprocess(text)
            tokens = word_tokenize(text)
            return [
                token for token in tokens
                if token not in self.stop_words
                and len(token) > 2
            ]
        except Exception as e:
            print(f"Tokenize Error: {str(e)}")
            return []

    # Tokenize text into sentences
    def tokenize_sentences(self, text):
        try:
            sentences = sent_tokenize(text)
            return sentences
        except Exception as e:
            print(f"Sentence Tokenize Error: {str(e)}")
            return []

    # Get word frequency
    def word_frequency(self, text):
        try:
            tokens = self.tokenize_words(text)
            freq = {}
            for token in tokens:
                freq[token] = freq.get(token, 0) + 1
            return dict(
                sorted(freq.items(), key=lambda x: x[1], reverse=True)
            )
        except Exception as e:
            print(f"Word Frequency Error: {str(e)}")
            return {}

    # Extract named entities (simple rule based)
    def extract_entities(self, text):
        try:
            entities = {
                'emails': [],
                'phones': [],
                'urls': [],
                'dates': []
            }

            # Extract emails
            emails = re.findall(
                r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}',
                text
            )
            entities['emails'] = emails

            # Extract phones
            phones = re.findall(
                r'(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}',
                text
            )
            entities['phones'] = phones

            # Extract URLs
            urls = re.findall(
                r'https?://\S+|www\.\S+|linkedin\.com/\S+|github\.com/\S+',
                text
            )
            entities['urls'] = urls

            # Extract years
            years = re.findall(r'\b(19|20)\d{2}\b', text)
            entities['dates'] = years

            return entities

        except Exception as e:
            print(f"Entity Extraction Error: {str(e)}")
            return {}

    # Calculate text similarity (simple)
    def similarity_score(self, text1, text2):
        try:
            tokens1 = set(self.tokenize_words(text1))
            tokens2 = set(self.tokenize_words(text2))

            if not tokens1 or not tokens2:
                return 0.0

            # Jaccard similarity
            intersection = tokens1.intersection(tokens2)
            union = tokens1.union(tokens2)

            return round(len(intersection) / len(union), 2)

        except Exception as e:
            print(f"Similarity Error: {str(e)}")
            return 0.0