document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    let analysisData = null;

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