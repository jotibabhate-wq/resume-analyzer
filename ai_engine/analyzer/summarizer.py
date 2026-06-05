import re

def summarize_resume(text):
    try:
        # Extract name (first line usually)
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        name = lines[0] if lines else 'Candidate'

        # Clean text
        text = re.sub(r'\s+', ' ', text).strip()

        # Count words
        word_count = len(text.split())

        # Extract email
        email_match = re.search(
            r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}',
            text
        )
        email = email_match.group() if email_match else 'Not found'

        # Extract phone
        phone_match = re.search(
            r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}',
            text
        )
        phone = phone_match.group() if phone_match else 'Not found'

        # Detect sections
        sections_found = []
        section_keywords = {
            'Experience': ['experience', 'work history', 'employment'],
            'Education': ['education', 'degree', 'university'],
            'Skills': ['skills', 'technologies', 'tools'],
            'Projects': ['projects', 'portfolio'],
            'Certifications': ['certifications', 'certificates'],
            'Summary': ['summary', 'objective', 'profile']
        }

        text_lower = text.lower()
        for section, keywords in section_keywords.items():
            if any(kw in text_lower for kw in keywords):
                sections_found.append(section)

        # Build summary
        summary = (
            f"Resume contains approximately {word_count} words. "
            f"Contact email: {email}. "
            f"Phone: {phone}. "
            f"Sections detected: {', '.join(sections_found) if sections_found else 'None detected'}."
        )

        return summary

    except Exception as e:
        print(f"Summarizer Error: {str(e)}")
        return "Could not generate summary"