def calculate_score(text, skills, ats_score):
    try:
        score = 0
        text_lower = text.lower()

        # Skills score (30 points)
        skill_score = min(len(skills) * 3, 30)
        score += skill_score

        # ATS score (25 points)
        ats_contribution = int(ats_score * 0.25)
        score += ats_contribution

        # Content length score (15 points)
        word_count = len(text.split())
        if word_count >= 300 and word_count <= 800:
            score += 15
        elif word_count >= 200:
            score += 10
        elif word_count >= 100:
            score += 5

        # Sections score (20 points)
        sections = {
            'experience': ['experience', 'work history', 'employment'],
            'education': ['education', 'degree', 'university', 'college'],
            'skills': ['skills', 'technologies', 'tools'],
            'contact': ['email', 'phone', 'linkedin', 'github']
        }

        for section, keywords in sections.items():
            if any(keyword in text_lower for keyword in keywords):
                score += 5

        # Summary/Objective score (10 points)
        if any(word in text_lower for word in ['summary', 'objective', 'profile']):
            score += 10

        return min(score, 100)

    except Exception as e:
        print(f"Scorer Error: {str(e)}")
        return 0