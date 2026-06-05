import json
import os
import re

def load_skills_db():
    try:
        db_path = os.path.join(
            os.path.dirname(__file__),
            '../data/skills_db.json'
        )
        with open(db_path, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"Skills DB Error: {str(e)}")
        return {}


def match_skills(text):
    try:
        text_lower = text.lower()
        skills_db = load_skills_db()

        found_skills = []
        missing_skills = []

        all_skills = []
        for category, skills in skills_db.items():
            all_skills.extend(skills)

        # Deduplicate skills while preserving order
        unique_skills = []
        seen = set()
        for skill in all_skills:
            if skill.lower() not in seen:
                seen.add(skill.lower())
                unique_skills.append(skill)

        for skill in unique_skills:
            skill_lower = skill.lower()
            # If the skill is alphanumeric, use word boundaries to prevent partial matches (e.g. 'R', 'Go', 'Java')
            if skill_lower.isalnum():
                pattern = r'\b' + re.escape(skill_lower) + r'\b'
                matched = re.search(pattern, text_lower) is not None
            else:
                matched = skill_lower in text_lower

            if matched:
                found_skills.append(skill)
            else:
                missing_skills.append(skill)

        # Return top 10 missing skills only
        return found_skills, missing_skills[:10]

    except Exception as e:
        print(f"Skill Matcher Error: {str(e)}")
        return [], []