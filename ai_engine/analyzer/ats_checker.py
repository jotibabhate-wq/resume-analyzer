def check_ats(text):
    try:
        score = 0
        text_lower = text.lower()

        # Check 1 - Standard section headings (25 points)
        standard_sections = [
            'experience',
            'education',
            'skills',
            'summary',
            'objective',
            'certifications',
            'projects',
            'achievements'
        ]
        for section in standard_sections:
            if section in text_lower:
                score += 3

        # Check 2 - Contact information (20 points)
        import re
        contact_checks = {
            'email': r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}',
            'phone': r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}',
            'linkedin': r'linkedin\.com',
            'github': r'github\.com'
        }
        for key, pattern in contact_checks.items():
            if re.search(pattern, text_lower):
                score += 5

        # Check 3 - Date formats (10 points)
        date_patterns = [
            r'\d{4}',
            r'(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)',
            r'(january|february|march|april|june|july|august|september|october|november|december)'
        ]
        for pattern in date_patterns:
            if re.search(pattern, text_lower):
                score += 3

        # Check 4 - Action verbs (15 points)
        action_verbs = [
            'developed', 'managed', 'created', 'designed',
            'implemented', 'led', 'built', 'improved',
            'achieved', 'increased', 'reduced', 'delivered'
        ]
        verb_count = sum(1 for verb in action_verbs if verb in text_lower)
        score += min(verb_count * 2, 15)

        # Check 5 - No special characters issues (10 points)
        special_char_count = len(re.findall(r'[^\w\s.,;:()\-@]', text))
        if special_char_count < 10:
            score += 10
        elif special_char_count < 20:
            score += 5

        # Check 6 - Word count (10 points)
        word_count = len(text.split())
        if 300 <= word_count <= 800:
            score += 10
        elif 200 <= word_count < 300:
            score += 5

        # Check 7 - Quantifiable achievements (10 points)
        number_pattern = r'\d+%|\$\d+|\d+ (years|months|projects|teams|users)'
        if re.search(number_pattern, text_lower):
            score += 10

        return min(score, 100)

    except Exception as e:
        print(f"ATS Checker Error: {str(e)}")
        return 0