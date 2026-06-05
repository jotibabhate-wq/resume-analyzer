document.addEventListener('DOMContentLoaded', () => {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const browseBtn = document.getElementById('browseBtn');
    const uploadPreview = document.getElementById('uploadPreview');
    const fileName = document.getElementById('fileName');
    const removeFile = document.getElementById('removeFile');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const modalClose = document.getElementById('modalClose');

    if (!uploadArea) return;

    let selectedFile = null;

    // ===== BROWSE =====
    browseBtn?.addEventListener('click', () => fileInput.click());
    uploadArea?.addEventListener('click', (e) => {
        if (e.target !== browseBtn) fileInput.click();
    });

    // ===== FILE SELECTED =====
    fileInput?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) handleFile(file);
    });

    // ===== DRAG AND DROP =====
    uploadArea?.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea?.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea?.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    });

    // ===== HANDLE FILE =====
    const handleFile = (file) => {
        const allowed = ['application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        const allowedExts = ['pdf', 'doc', 'docx'];
        const fileExt = file.name ? file.name.split('.').pop().toLowerCase() : '';

        if (!allowed.includes(file.type) && !allowedExts.includes(fileExt)) {
            showToast('Only PDF, DOC, DOCX files allowed!', 'error');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showToast('File size must be less than 5MB!', 'error');
            return;
        }

        selectedFile = file;
        uploadArea.style.display = 'none';
        uploadPreview.style.display = 'flex';
        fileName.textContent = file.name;
        analyzeBtn.disabled = false;
    };

    // ===== REMOVE FILE =====
    removeFile?.addEventListener('click', () => {
        selectedFile = null;
        fileInput.value = '';
        uploadArea.style.display = 'block';
        uploadPreview.style.display = 'none';
        analyzeBtn.disabled = true;
    });

    // ===== ANALYZE =====
    analyzeBtn?.addEventListener('click', async () => {
        if (!selectedFile) return;

        const token = localStorage.getItem('token');
        if (!token) {
            showToast('Please login first!', 'error');
            openModal('loginModal');
            return;
        }

        const formData = new FormData();
        formData.append('resume', selectedFile);

        try {
            showLoading();
            const res = await API.uploadResume(formData);
            hideLoading();

            if (res.success) {
                // Save analysis to localStorage
                localStorage.setItem('analysisData', JSON.stringify(res.data));
                localStorage.setItem('resumeId', res.data.resume._id);
                showToast('Resume analyzed successfully!', 'success');
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } else {
                showToast(res.message || 'Analysis failed', 'error');
            }
        } catch (err) {
            hideLoading();
            showToast('Something went wrong', 'error');
        }
    });

    // ===== CLOSE MODAL =====
    modalClose?.addEventListener('click', () => closeModal('uploadModal'));
});