import sys
import json

# Redirect all stdout to stderr to prevent library/custom logs from polluting JSON output
original_stdout = sys.stdout
sys.stdout = sys.stderr
from analyzer.parser import extract_text
from analyzer.scorer import calculate_score
from analyzer.keyword_extractor import extract_keywords
from analyzer.ats_checker import check_ats
from analyzer.skill_matcher import match_skills
from analyzer.summarizer import summarize_resume

def analyze_resume(file_path):
    try:
        # Step 1 - Extract text from resume file
        text = extract_text(file_path)

        if not text:
            return {
                "success": False,
                "error": "Could not extract text from resume"
            }

        # Step 2 - Extract keywords
        keywords = extract_keywords(text)

        # Step 3 - Match skills
        skills, missing_skills = match_skills(text)

        # Step 4 - Check ATS score
        ats_score = check_ats(text)

        # Step 5 - Calculate overall score
        score = calculate_score(text, skills, ats_score)

        # Step 6 - Summarize resume
        summary = summarize_resume(text)

        # Step 7 - Generate suggestions
        suggestions = []
        if ats_score < 50:
            suggestions.append("Improve ATS compatibility by using standard headings")
        if len(skills) < 5:
            suggestions.append("Add more relevant skills to your resume")
        if len(text.split()) < 300:
            suggestions.append("Your resume seems too short, add more details")
        if len(text.split()) > 1000:
            suggestions.append("Your resume is too long, try to keep it concise")
        if not any(word in text.lower() for word in ['experience', 'work', 'job']):
            suggestions.append("Add a work experience section")
        if not any(word in text.lower() for word in ['education', 'degree', 'university']):
            suggestions.append("Add an education section")

        return {
            "success": True,
            "score": score,
            "skills": skills,
            "missing_skills": missing_skills,
            "keywords": keywords,
            "ats_score": ats_score,
            "suggestions": suggestions,
            "summary": summary
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({
            "success": False,
            "error": "No file path provided"
        }), file=original_stdout)
        sys.exit(1)

    file_path = sys.argv[1]
    result = analyze_resume(file_path)
    print(json.dumps(result), file=original_stdout)