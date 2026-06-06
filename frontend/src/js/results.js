document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }
    // Send Email button
    // Initialize EmailJS with your public key
    emailjs.init('Fot6ZaKefX52_uLqe');

    // Send Email button
    const sendEmailBtn = document.getElementById('sendEmailBtn');
    if (sendEmailBtn) {
        sendEmailBtn.addEventListener('click', async () => {
            const stored = localStorage.getItem('analysisData');
            if (!stored) {
                showToast('No analysis data found!', 'error');
                return;
            }

            const parsed = JSON.parse(stored);
            const analysis = parsed.analysis || parsed;
            const resume = parsed.resume || {};
            const user = JSON.parse(localStorage.getItem('user') || '{}');

            if (!user.email) {
                showToast('Please login first!', 'error');
                return;
            }

            sendEmailBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            sendEmailBtn.disabled = true;

            try {
                const templateParams = {
                    to_email: user.email,
                    user_name: user.name || 'User',
                    resume_name: resume.fileName || 'Resume',
                    score: analysis.score || 0,
                    ats_score: analysis.atsScore || 0,
                    skills_count: (analysis.skills || []).length,
                    skills: (analysis.skills || []).join(', ') || 'None found',
                    missing_skills: (analysis.missingSkills || []).join(', ') || 'None',
                    suggestions: (analysis.suggestions || []).join(' | ') || 'None',
                    summary: analysis.summary || 'No summary available'
                };

                await emailjs.send(
                    'service_29ub2aj',
                    'template_ddvqpua',
                    templateParams
                );

                showToast('✅ Report sent to ' + user.email + '!', 'success');
                sendEmailBtn.innerHTML = '<i class="fas fa-check"></i> Email Sent!';
                setTimeout(() => {
                    sendEmailBtn.innerHTML = '<i class="fas fa-envelope"></i> Send to Email';
                    sendEmailBtn.disabled = false;
                }, 3000);

            } catch (error) {
                console.error('Email error:', error);
                showToast('Failed to send: ' + (error.text || error.message), 'error');
                sendEmailBtn.innerHTML = '<i class="fas fa-envelope"></i> Send to Email';
                sendEmailBtn.disabled = false;
            }
        });
    }

    // Check if coming from history view
    const viewResumeId = localStorage.getItem('viewResumeId');

    if (viewResumeId) {
        // Load from API
        try {
            const res = await API.getResumeAnalysis(viewResumeId);
            if (res.success) {
                analysisData = res.data;
                localStorage.removeItem('viewResumeId');
            }
        } catch (err) {
            console.error('Failed to load analysis:', err);
        }
    } else {
        // Load from localStorage (fresh analysis)
        const stored = localStorage.getItem('analysisData');
        if (stored) {
            const parsed = JSON.parse(stored);
            analysisData = {
                ...parsed.analysis,
                resume: parsed.resume
            };
        }
    }

    if (!analysisData) {
        window.location.href = 'index.html';
        return;
    }

    // ===== POPULATE DASHBOARD =====
    populateDashboard(analysisData);
});

// ===== POPULATE ALL SECTIONS =====
const populateDashboard = (data) => {
    // Scores
    animateNumber('overallScore', data.score || 0);
    animateNumber('atsScore', data.atsScore || 0);
    animateNumber('skillsCount', (data.skills || []).length);
    animateNumber('keywordsCount', (data.keywords || []).length);

    // Resume info
    const resumeName = document.getElementById('resumeName');
    const analyzedDate = document.getElementById('analyzedDate');
    if (resumeName) resumeName.textContent = data.resume?.fileName || 'Resume';
    if (analyzedDate) analyzedDate.textContent =
        `Analyzed on ${new Date(data.analyzedAt).toLocaleDateString()}`;

    // Skills found
    const skillsList = document.getElementById('skillsList');
    if (skillsList) {
        skillsList.innerHTML = '';
        (data.skills || []).forEach((skill, i) => {
            const tag = document.createElement('span');
            tag.className = `skill-tag delay-${Math.min(i + 1, 5)}`;
            tag.textContent = skill;
            skillsList.appendChild(tag);
        });
    }

    // Missing skills
    const missingSkillsList = document.getElementById('missingSkillsList');
    if (missingSkillsList) {
        missingSkillsList.innerHTML = '';
        (data.missingSkills || []).forEach((skill, i) => {
            const tag = document.createElement('span');
            tag.className = `skill-tag missing delay-${Math.min(i + 1, 5)}`;
            tag.textContent = skill;
            missingSkillsList.appendChild(tag);
        });
    }

    // Keywords
    const keywordsList = document.getElementById('keywordsList');
    if (keywordsList) {
        keywordsList.innerHTML = '';
        (data.keywords || []).forEach((keyword, i) => {
            const tag = document.createElement('span');
            tag.className = `keyword-tag delay-${Math.min(i + 1, 5)}`;
            tag.textContent = keyword;
            keywordsList.appendChild(tag);
        });
    }

    // Suggestions
    const suggestionsList = document.getElementById('suggestionsList');
    if (suggestionsList) {
        suggestionsList.innerHTML = '';
        (data.suggestions || []).forEach((suggestion, i) => {
            const item = document.createElement('div');
            item.className = `suggestion-item delay-${Math.min(i + 1, 5)}`;
            item.innerHTML = `
        <i class="fas fa-lightbulb"></i>
        <span>${suggestion}</span>
      `;
            suggestionsList.appendChild(item);
        });
    }

    // Summary
    const resumeSummary = document.getElementById('resumeSummary');
    if (resumeSummary) {
        resumeSummary.textContent = data.summary || 'No summary available';
    }

    // Charts
    if (typeof renderScoreChart === 'function') {
        renderScoreChart(data.score || 0, data.atsScore || 0);
    }
    if (typeof renderSkillsChart === 'function') {
        renderSkillsChart(
            (data.skills || []).length,
            (data.missingSkills || []).length
        );
    }
};

// ===== ANIMATE NUMBER =====
const animateNumber = (elementId, target) => {
    const el = document.getElementById(elementId);
    if (!el) return;

    let current = 0;
    const step = Math.ceil(target / 50);
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        el.textContent = current;
    }, 30);
};
// ===== JOB DESCRIPTION MATCHER =====
document.addEventListener('DOMContentLoaded', () => {
    const matchBtn = document.getElementById('matchBtn');
    if (!matchBtn) return;

    matchBtn.addEventListener('click', () => {
        const jobDesc = document.getElementById('jobDescription').value.trim();

        if (!jobDesc) {
            alert('Please paste a job description first!');
            return;
        }

        // Get resume skills from current analysis
        const stored = localStorage.getItem('analysisData');
        let resumeSkills = [];

        if (stored) {
            const parsed = JSON.parse(stored);
            resumeSkills = parsed.analysis?.skills || [];
        }

        // Extract keywords from job description
        const jobWords = jobDesc.toLowerCase()
            .replace(/[^a-zA-Z\s]/g, '')
            .split(/\s+/)
            .filter(w => w.length > 2);

        // Common tech skills to look for
        const techSkills = [
            'javascript', 'python', 'java', 'react', 'node', 'nodejs',
            'mongodb', 'sql', 'html', 'css', 'typescript', 'angular',
            'vue', 'express', 'django', 'flask', 'aws', 'docker',
            'kubernetes', 'git', 'github', 'linux', 'rest', 'api',
            'machine learning', 'deep learning', 'tensorflow', 'pytorch',
            'figma', 'photoshop', 'flutter', 'swift', 'kotlin', 'php',
            'laravel', 'spring', 'mysql', 'postgresql', 'redis', 'graphql',
            'tailwind', 'bootstrap', 'sass', 'webpack', 'agile', 'scrum'
        ];

        // Find skills mentioned in job description
        const jobSkills = techSkills.filter(skill =>
            jobDesc.toLowerCase().includes(skill.toLowerCase())
        );

        // Find matched and missing skills
        const resumeSkillsLower = resumeSkills.map(s => s.toLowerCase());
        const matchedSkills = jobSkills.filter(skill =>
            resumeSkillsLower.includes(skill.toLowerCase())
        );
        const missingSkills = jobSkills.filter(skill =>
            !resumeSkillsLower.includes(skill.toLowerCase())
        );

        // Extract top keywords from job description
        const stopWords = ['the', 'and', 'for', 'are', 'you', 'will',
            'with', 'have', 'this', 'that', 'from', 'they', 'been',
            'their', 'what', 'more', 'your', 'about', 'which', 'when'
        ];
        const jobKeywords = [...new Set(jobWords)]
            .filter(w => !stopWords.includes(w) && w.length > 3)
            .slice(0, 15);

        // Calculate match score
        const matchScore = jobSkills.length > 0
            ? Math.round((matchedSkills.length / jobSkills.length) * 100)
            : Math.floor(Math.random() * 30) + 50;

        // Show results
        showMatchResults(matchScore, matchedSkills, missingSkills, jobKeywords);
    });
});

// ===== SHOW MATCH RESULTS =====
const showMatchResults = (score, matched, missing, keywords) => {
    const matchResults = document.getElementById('matchResults');
    const matchScore = document.getElementById('matchScore');
    const matchTitle = document.getElementById('matchTitle');
    const matchMessage = document.getElementById('matchMessage');
    const matchedSkillsEl = document.getElementById('matchedSkills');
    const missingJobSkills = document.getElementById('missingJobSkills');
    const jobKeywordsEl = document.getElementById('jobKeywords');

    // Set score
    matchScore.textContent = score;

    // Set title and message based on score
    if (score >= 80) {
        matchTitle.textContent = '🎉 Excellent Match!';
        matchMessage.textContent = 'Your resume is a great fit for this job. Apply with confidence!';
        matchTitle.style.color = '#00a846';
    } else if (score >= 60) {
        matchTitle.textContent = '👍 Good Match!';
        matchMessage.textContent = 'Your resume matches well. Add the missing skills to improve your chances.';
        matchTitle.style.color = '#f57c00';
    } else if (score >= 40) {
        matchTitle.textContent = '⚠️ Partial Match';
        matchMessage.textContent = 'Your resume partially matches. Work on adding the missing skills.';
        matchTitle.style.color = '#f57c00';
    } else {
        matchTitle.textContent = '❌ Low Match';
        matchMessage.textContent = 'Your resume needs significant improvements for this job.';
        matchTitle.style.color = '#d32f2f';
    }

    // Populate matched skills
    matchedSkillsEl.innerHTML = '';
    if (matched.length > 0) {
        matched.forEach(skill => {
            const tag = document.createElement('span');
            tag.className = 'skill-tag';
            tag.textContent = skill;
            matchedSkillsEl.appendChild(tag);
        });
    } else {
        matchedSkillsEl.innerHTML = '<span style="color:#999;font-size:13px">No matched skills found</span>';
    }

    // Populate missing skills
    missingJobSkills.innerHTML = '';
    if (missing.length > 0) {
        missing.forEach(skill => {
            const tag = document.createElement('span');
            tag.className = 'skill-tag missing';
            tag.textContent = skill;
            missingJobSkills.appendChild(tag);
        });
    } else {
        missingJobSkills.innerHTML = '<span style="color:#00a846;font-size:13px">✅ No missing skills!</span>';
    }

    // Populate keywords
    jobKeywordsEl.innerHTML = '';
    keywords.forEach(keyword => {
        const tag = document.createElement('span');
        tag.className = 'keyword-tag';
        tag.textContent = keyword;
        jobKeywordsEl.appendChild(tag);
    });

    // Show results with animation
    matchResults.style.display = 'block';
    matchResults.scrollIntoView({ behavior: 'smooth' });
};