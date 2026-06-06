document.addEventListener('DOMContentLoaded', () => {
    const downloadBtn = document.getElementById('downloadPdfBtn');
    if (!downloadBtn) return;

    downloadBtn.addEventListener('click', generatePDF);
});

const generatePDF = async () => {
    const btn = document.getElementById('downloadPdfBtn');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating PDF...';
    btn.disabled = true;

    try {
        // Get analysis data
        const stored = localStorage.getItem('analysisData');
        if (!stored) {
            alert('No analysis data found!');
            return;
        }

        const parsed = JSON.parse(stored);
        const analysis = parsed.analysis || parsed;
        const resume = parsed.resume || {};

        // Populate PDF template
        document.getElementById('pdfDate').textContent =
            new Date().toLocaleDateString('en-IN', {
                year: 'numeric', month: 'long', day: 'numeric'
            });

        document.getElementById('pdfFileName').textContent =
            resume.fileName || 'Resume';

        document.getElementById('pdfAnalyzedDate').textContent =
            new Date(analysis.analyzedAt || Date.now()).toLocaleDateString();

        document.getElementById('pdfOverallScore').textContent =
            analysis.score || 0;

        document.getElementById('pdfAtsScore').textContent =
            analysis.atsScore || 0;

        document.getElementById('pdfSkillsCount').textContent =
            (analysis.skills || []).length;

        // Skills
        const pdfSkills = document.getElementById('pdfSkills');
        pdfSkills.innerHTML = '';
        (analysis.skills || []).forEach(skill => {
            const tag = document.createElement('span');
            tag.className = 'pdf-tag green';
            tag.textContent = skill;
            pdfSkills.appendChild(tag);
        });

        // Missing Skills
        const pdfMissing = document.getElementById('pdfMissingSkills');
        pdfMissing.innerHTML = '';
        (analysis.missingSkills || []).forEach(skill => {
            const tag = document.createElement('span');
            tag.className = 'pdf-tag red';
            tag.textContent = skill;
            pdfMissing.appendChild(tag);
        });

        // Keywords
        const pdfKeywords = document.getElementById('pdfKeywords');
        pdfKeywords.innerHTML = '';
        (analysis.keywords || []).forEach(keyword => {
            const tag = document.createElement('span');
            tag.className = 'pdf-tag purple';
            tag.textContent = keyword;
            pdfKeywords.appendChild(tag);
        });

        // Suggestions
        const pdfSuggestions = document.getElementById('pdfSuggestions');
        pdfSuggestions.innerHTML = '';
        (analysis.suggestions || []).forEach(suggestion => {
            const item = document.createElement('div');
            item.className = 'pdf-suggestion-item';
            item.innerHTML = `<div class="dot"></div><span>${suggestion}</span>`;
            pdfSuggestions.appendChild(item);
        });

        // Summary
        document.getElementById('pdfSummary').textContent =
            analysis.summary || 'No summary available';

        // Generate PDF
        const report = document.getElementById('pdfReport');
        report.style.top = '0';
        report.style.left = '0';
        report.style.position = 'absolute';
        report.style.zIndex = '-999';

        const canvas = await html2canvas(report, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff'
        });

        report.style.top = '-9999px';
        report.style.left = '-9999px';
        report.style.position = 'fixed';

        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * pageWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        // Download
        const fileName = `Resume-Analysis-Report-${Date.now()}.pdf`;
        pdf.save(fileName);

        btn.innerHTML = '<i class="fas fa-check"></i> Downloaded!';
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-file-pdf"></i> Download PDF Report';
            btn.disabled = false;
        }, 3000);

    } catch (error) {
        console.error('PDF Error:', error);
        btn.innerHTML = '<i class="fas fa-file-pdf"></i> Download PDF Report';
        btn.disabled = false;
        alert('PDF generation failed. Please try again.');
    }
};