import json
import os
from models.nlp_model import NLPModel

class JobMatcher:
    def __init__(self):
        self.nlp = NLPModel()
        self.job_roles = self.load_job_roles()

    # Load job roles from data file
    def load_job_roles(self):
        try:
            db_path = os.path.join(
                os.path.dirname(__file__),
                '../data/job_roles.json'
            )
            with open(db_path, 'r') as f:
                return json.load(f)
        except Exception as e:
            print(f"Job Roles Load Error: {str(e)}")
            return {}

    # Match resume to best job role
    def match_job_role(self, resume_text):
        try:
            best_match = None
            best_score = 0.0

            for role, details in self.job_roles.items():
                # Get required skills for this role
                required_skills = ' '.join(details.get('skills', []))

                # Calculate similarity
                score = self.nlp.similarity_score(
                    resume_text,
                    required_skills
                )

                if score > best_score:
                    best_score = score
                    best_match = {
                        'role': role,
                        'score': score,
                        'required_skills': details.get('skills', []),
                        'description': details.get('description', '')
                    }

            return best_match

        except Exception as e:
            print(f"Job Match Error: {str(e)}")
            return None

    # Get top 3 matching job roles
    def get_top_matches(self, resume_text):
        try:
            matches = []

            for role, details in self.job_roles.items():
                required_skills = ' '.join(details.get('skills', []))
                score = self.nlp.similarity_score(
                    resume_text,
                    required_skills
                )
                matches.append({
                    'role': role,
                    'score': score,
                    'required_skills': details.get('skills', []),
                    'description': details.get('description', '')
                })

            # Sort by score
            matches.sort(key=lambda x: x['score'], reverse=True)

            # Return top 3
            return matches[:3]

        except Exception as e:
            print(f"Top Matches Error: {str(e)}")
            return []