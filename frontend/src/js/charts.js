// ===== SCORE CHART =====
const renderScoreChart = (overallScore, atsScore) => {
    const ctx = document.getElementById('scoreChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Overall Score', 'ATS Score', 'Remaining'],
            datasets: [{
                data: [
                    overallScore,
                    atsScore,
                    Math.max(0, 100 - overallScore)
                ],
                backgroundColor: [
                    'rgba(108, 99, 255, 0.8)',
                    'rgba(0, 200, 83, 0.8)',
                    'rgba(255, 255, 255, 0.05)'
                ],
                borderColor: [
                    'rgba(108, 99, 255, 1)',
                    'rgba(0, 200, 83, 1)',
                    'rgba(255, 255, 255, 0.1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            cutout: '70%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#a0a0b0',
                        padding: 16,
                        font: { size: 13 }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: (ctx) => ` ${ctx.label}: ${ctx.parsed}%`
                    }
                }
            }
        }
    });
};

// ===== SKILLS CHART =====
const renderSkillsChart = (foundCount, missingCount) => {
    const ctx = document.getElementById('skillsChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Skills Found', 'Missing Skills'],
            datasets: [{
                label: 'Skills',
                data: [foundCount, missingCount],
                backgroundColor: [
                    'rgba(0, 200, 83, 0.7)',
                    'rgba(255, 23, 68, 0.7)'
                ],
                borderColor: [
                    'rgba(0, 200, 83, 1)',
                    'rgba(255, 23, 68, 1)'
                ],
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (ctx) => ` ${ctx.parsed.y} skills`
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#a0a0b0' },
                    grid: { color: 'rgba(255,255,255,0.05)' }
                },
                y: {
                    ticks: { color: '#a0a0b0' },
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    beginAtZero: true
                }
            }
        }
    });
};