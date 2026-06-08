// ===== GOOGLE LOGIN CALLBACK =====
const handleGoogleLogin = async (response) => {
    try {
        showLoading();
        const res = await API.googleLogin(response.credential);
        hideLoading();

        if (res.success) {
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data));
            closeModal('loginModal');
            closeModal('registerModal');
            checkAuth();
            showToast('✅ Google login successful!', 'success');
        } else {
            showToast(res.message || 'Google login failed', 'error');
        }
    } catch (err) {
        hideLoading();
        showToast('Google login failed', 'error');
    }
};
// ===== CHECK AUTH =====
const checkAuth = () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    if (token && user) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'block';
    } else {
        if (loginBtn) loginBtn.style.display = 'block';
        if (logoutBtn) logoutBtn.style.display = 'none';
    }
};

// How it works button
document.getElementById('learnBtn')
    ?.addEventListener('click', () => {
        openModal('howItWorksModal');
    });

// How it works close
document.getElementById('howItWorksClose')
    ?.addEventListener('click', () => {
        closeModal('howItWorksModal');
    });

// ===== SHOW TOAST =====
const showToast = (message, type = 'success') => {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => {
        toast.className = 'toast';
    }, 3000);
};

// ===== SHOW LOADING =====
const showLoading = () => {
    const loading = document.getElementById('loading');
    if (loading) loading.classList.add('active');
};

// ===== HIDE LOADING =====
const hideLoading = () => {
    const loading = document.getElementById('loading');
    if (loading) loading.classList.remove('active');
};

// ===== OPEN MODAL =====
const openModal = (id) => {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('active');
};

// ===== CLOSE MODAL =====
const closeModal = (id) => {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('active');
};

// ===== LOGIN =====
const handleLogin = async () => {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (!email || !password) {
        showToast('Please fill all fields', 'error');
        return;
    }

    try {
        showLoading();
        const res = await API.login(email, password);
        hideLoading();

        if (res.success) {
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data));
            closeModal('loginModal');
            checkAuth();
            showToast('Login successful!', 'success');
        } else {
            showToast(res.message || 'Login failed', 'error');
        }
    } catch (err) {
        hideLoading();
        showToast('Something went wrong', 'error');
    }
};

// ===== REGISTER =====
const handleRegister = async () => {
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value.trim();

    if (!name || !email || !password) {
        showToast('Please fill all fields', 'error');
        return;
    }

    try {
        showLoading();
        const res = await API.register(name, email, password);
        hideLoading();

        if (res.success) {
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data));
            closeModal('registerModal');
            checkAuth();
            showToast('Registered successfully!', 'success');
        } else {
            showToast(res.message || 'Registration failed', 'error');
        }
    } catch (err) {
        hideLoading();
        showToast('Something went wrong', 'error');
    }
};

// ===== LOGOUT =====
const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    checkAuth();
    showToast('Logged out successfully', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
};

// ===== LOAD HISTORY PAGE =====
const loadHistoryPage = async () => {
    const historyGrid = document.getElementById('historyGrid');
    const emptyState = document.getElementById('emptyState');
    const loadingState = document.getElementById('loadingState');

    if (!historyGrid) return;

    try {
        const res = await API.getHistory();

        if (loadingState) loadingState.style.display = 'none';

        if (!res.success || res.data.length === 0) {
            if (emptyState) emptyState.style.display = 'block';
            return;
        }

        res.data.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = `history-card delay-${Math.min(index + 1, 5)}`;
            card.innerHTML = `
        <div class="history-card-header">
          <div class="history-card-title">
            <i class="fas fa-file-pdf"></i>
            <h3>${item.resume?.fileName || 'Resume'}</h3>
          </div>
          <span class="history-score">${item.score}</span>
        </div>
        <div class="history-meta">
          <span><i class="fas fa-robot"></i> ATS: ${item.atsScore}%</span>
          <span><i class="fas fa-code"></i> Skills: ${item.skills.length}</span>
          <span><i class="fas fa-calendar"></i>
            ${new Date(item.analyzedAt).toLocaleDateString()}
          </span>
        </div>
        <div class="history-actions">
          <button class="btn-view" onclick="viewAnalysis('${item.resume?._id}')">
            <i class="fas fa-eye"></i> View
          </button>
          <button class="btn-delete" onclick="deleteHistoryItem('${item._id}')">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;
            historyGrid.appendChild(card);
        });

    } catch (err) {
        if (loadingState) loadingState.style.display = 'none';
        showToast('Failed to load history', 'error');
    }
};

// ===== VIEW ANALYSIS =====
const viewAnalysis = (resumeId) => {
    localStorage.setItem('viewResumeId', resumeId);
    window.location.href = 'dashboard.html';
};

// ===== DELETE HISTORY ITEM =====
const deleteHistoryItem = async (id) => {
    try {
        const res = await API.deleteHistory(id);
        if (res.success) {
            showToast('Deleted successfully', 'success');
            setTimeout(() => location.reload(), 1000);
        } else {
            showToast('Delete failed', 'error');
        }
    } catch (err) {
        showToast('Something went wrong', 'error');
    }
};

// ===== CLEAR ALL HISTORY =====
const clearAllHistory = async () => {
    if (!confirm('Are you sure you want to clear all history?')) return;
    try {
        const res = await API.clearHistory();
        if (res.success) {
            showToast('History cleared', 'success');
            setTimeout(() => location.reload(), 1000);
        }
    } catch (err) {
        showToast('Something went wrong', 'error');
    }
};

// ===== EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();

    // Login
    document.getElementById('loginBtn')
        ?.addEventListener('click', () => openModal('loginModal'));
    document.getElementById('loginSubmit')
        ?.addEventListener('click', handleLogin);
    document.getElementById('loginModalClose')
        ?.addEventListener('click', () => closeModal('loginModal'));

    // Register
    document.getElementById('registerSubmit')
        ?.addEventListener('click', handleRegister);
    document.getElementById('registerModalClose')
        ?.addEventListener('click', () => closeModal('registerModal'));

    // Switch forms
    document.getElementById('switchToRegister')
        ?.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal('loginModal');
            openModal('registerModal');
        });
    document.getElementById('switchToLogin')
        ?.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal('registerModal');
            openModal('loginModal');
        });

    // Logout
    document.getElementById('logoutBtn')
        ?.addEventListener('click', handleLogout);

    // Upload button on hero
    document.getElementById('uploadBtn')
        ?.addEventListener('click', () => {
            if (!localStorage.getItem('token')) {
                openModal('loginModal');
            } else {
                openModal('uploadModal');
            }
        });

    // Clear all history
    document.getElementById('clearAllBtn')
        ?.addEventListener('click', clearAllHistory);

    // Load history page
    if (document.getElementById('historyGrid')) {
        loadHistoryPage();
    }
});

// ===== STATS COUNTER ANIMATION =====
const animateStats = () => {
    const statNumbers = document.querySelectorAll('.stat-number');

    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            stat.textContent = Math.floor(current).toLocaleString();
        }, 16);
    });
};

// Trigger stats animation when visible
const statsSection = document.querySelector('.stats-section');
if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    observer.observe(statsSection);
}

// CTA button
document.getElementById('ctaUploadBtn')?.addEventListener('click', () => {
    if (!localStorage.getItem('token')) {
        openModal('loginModal');
    } else {
        openModal('uploadModal');
    }
});

// Footer login/register links
document.getElementById('footerLogin')?.addEventListener('click', (e) => {
    e.preventDefault();
    openModal('loginModal');
});

document.getElementById('footerRegister')?.addEventListener('click', (e) => {
    e.preventDefault();
    openModal('registerModal');
});

// CTA button
document.getElementById('ctaUploadBtn')?.addEventListener('click', () => {
    if (!localStorage.getItem('token')) {
        openModal('loginModal');
    } else {
        openModal('uploadModal');
    }
});

// Footer links
document.getElementById('footerLogin')?.addEventListener('click', (e) => {
    e.preventDefault();
    openModal('loginModal');
});

document.getElementById('footerRegister')?.addEventListener('click', (e) => {
    e.preventDefault();
    openModal('registerModal');
});