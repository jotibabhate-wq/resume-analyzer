const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Send analysis report email
const sendAnalysisReport = async (toEmail, userName, analysisData, resumeName) => {
    try {
        // Build skills HTML
        const skillsHTML = (analysisData.skills || [])
            .map(skill => `
        <span style="
          background: rgba(0,168,70,0.1);
          color: #00a846;
          border: 1px solid rgba(0,168,70,0.3);
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          margin: 3px;
          display: inline-block;
        ">${skill}</span>
      `).join('');

        // Build missing skills HTML
        const missingSkillsHTML = (analysisData.missingSkills || [])
            .map(skill => `
        <span style="
          background: rgba(211,47,47,0.1);
          color: #d32f2f;
          border: 1px solid rgba(211,47,47,0.3);
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          margin: 3px;
          display: inline-block;
        ">${skill}</span>
      `).join('');

        // Build suggestions HTML
        const suggestionsHTML = (analysisData.suggestions || [])
            .map(suggestion => `
        <div style="
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 16px;
          background: rgba(245,124,0,0.05);
          border: 1px solid rgba(245,124,0,0.15);
          border-radius: 8px;
          margin-bottom: 8px;
          font-size: 14px;
          color: #1a1a2e;
        ">
          <span style="color:#f57c00; font-size:16px;">💡</span>
          <span>${suggestion}</span>
        </div>
      `).join('');

        // Score color
        const scoreColor = analysisData.score >= 80 ? '#00a846' :
            analysisData.score >= 60 ? '#f57c00' : '#d32f2f';

        // Email HTML template
        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resume Analysis Report</title>
</head>
<body style="
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f0f0ff;
  color: #1a1a2e;
">
  <div style="max-width: 600px; margin: 0 auto; padding: 24px;">

    <!-- Header -->
    <div style="
      background: linear-gradient(135deg, #6c63ff, #f50057);
      border-radius: 16px;
      padding: 32px;
      text-align: center;
      margin-bottom: 24px;
    ">
      <div style="font-size: 40px; margin-bottom: 12px;">🧠</div>
      <h1 style="color: white; margin: 0; font-size: 26px; font-weight: 800;">
        Resume Analyzer
      </h1>
      <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 15px;">
        Your AI-Powered Resume Analysis Report
      </p>
    </div>

    <!-- Greeting -->
    <div style="
      background: white;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 16px;
      box-shadow: 0 4px 16px rgba(108,99,255,0.08);
    ">
      <h2 style="margin: 0 0 8px; font-size: 20px;">
        Hello, ${userName}! 👋
      </h2>
      <p style="color: #555570; margin: 0; font-size: 15px; line-height: 1.6;">
        Here is your complete resume analysis report for
        <strong>${resumeName}</strong>.
        Review your results and use the suggestions to improve your resume!
      </p>
    </div>

    <!-- Scores -->
    <div style="
      display: grid;
      gap: 12px;
      margin-bottom: 16px;
    ">
      <div style="
        background: white;
        border-radius: 12px;
        padding: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-shadow: 0 4px 16px rgba(108,99,255,0.08);
      ">
        <div>
          <div style="font-size: 13px; color: #555570; margin-bottom: 4px;">
            Overall Score
          </div>
          <div style="
            font-size: 42px;
            font-weight: 800;
            color: ${scoreColor};
            line-height: 1;
          ">
            ${analysisData.score || 0}
            <span style="font-size: 20px; color: #555570;">/100</span>
          </div>
        </div>
        <div style="
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #6c63ff, #f50057);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
        ">📊</div>
      </div>

      <div style="display: flex; gap: 12px;">
        <div style="
          flex: 1;
          background: white;
          border-radius: 12px;
          padding: 16px;
          text-align: center;
          box-shadow: 0 4px 16px rgba(108,99,255,0.08);
        ">
          <div style="font-size: 28px; font-weight: 800; color: #6c63ff;">
            ${analysisData.atsScore || 0}%
          </div>
          <div style="font-size: 12px; color: #555570; margin-top: 4px;">
            ATS Score
          </div>
        </div>
        <div style="
          flex: 1;
          background: white;
          border-radius: 12px;
          padding: 16px;
          text-align: center;
          box-shadow: 0 4px 16px rgba(108,99,255,0.08);
        ">
          <div style="font-size: 28px; font-weight: 800; color: #00a846;">
            ${(analysisData.skills || []).length}
          </div>
          <div style="font-size: 12px; color: #555570; margin-top: 4px;">
            Skills Found
          </div>
        </div>
        <div style="
          flex: 1;
          background: white;
          border-radius: 12px;
          padding: 16px;
          text-align: center;
          box-shadow: 0 4px 16px rgba(108,99,255,0.08);
        ">
          <div style="font-size: 28px; font-weight: 800; color: #d32f2f;">
            ${(analysisData.missingSkills || []).length}
          </div>
          <div style="font-size: 12px; color: #555570; margin-top: 4px;">
            Missing Skills
          </div>
        </div>
      </div>
    </div>

    <!-- Skills Found -->
    <div style="
      background: white;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 16px;
      box-shadow: 0 4px 16px rgba(108,99,255,0.08);
    ">
      <h3 style="
        margin: 0 0 14px;
        font-size: 15px;
        color: #1a1a2e;
        display: flex;
        align-items: center;
        gap: 8px;
      ">✅ Skills Found</h3>
      <div>${skillsHTML || '<p style="color:#999;font-size:13px">No skills detected</p>'}</div>
    </div>

    <!-- Missing Skills -->
    <div style="
      background: white;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 16px;
      box-shadow: 0 4px 16px rgba(108,99,255,0.08);
    ">
      <h3 style="
        margin: 0 0 14px;
        font-size: 15px;
        color: #1a1a2e;
      ">❌ Missing Skills</h3>
      <div>${missingSkillsHTML || '<p style="color:#00a846;font-size:13px">No missing skills!</p>'}</div>
    </div>

    <!-- Suggestions -->
    <div style="
      background: white;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 16px;
      box-shadow: 0 4px 16px rgba(108,99,255,0.08);
    ">
      <h3 style="margin: 0 0 14px; font-size: 15px; color: #1a1a2e;">
        💡 AI Suggestions
      </h3>
      ${suggestionsHTML}
    </div>

    <!-- Summary -->
    <div style="
      background: white;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 16px;
      box-shadow: 0 4px 16px rgba(108,99,255,0.08);
    ">
      <h3 style="margin: 0 0 14px; font-size: 15px; color: #1a1a2e;">
        📝 Resume Summary
      </h3>
      <p style="
        color: #555570;
        font-size: 14px;
        line-height: 1.7;
        margin: 0;
        background: #f8f8ff;
        padding: 14px;
        border-radius: 8px;
      ">
        ${analysisData.summary || 'No summary available'}
      </p>
    </div>

    <!-- CTA Button -->
    <div style="text-align: center; margin-bottom: 24px;">
      <a href="https://resume-analyzer-7y62.onrender.com"
        style="
          display: inline-block;
          background: linear-gradient(135deg, #6c63ff, #f50057);
          color: white;
          text-decoration: none;
          padding: 14px 32px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 700;
        ">
        🚀 View Full Dashboard
      </a>
    </div>

    <!-- Footer -->
    <div style="
      text-align: center;
      padding: 20px;
      font-size: 12px;
      color: #999;
      border-top: 1px solid #f0f0ff;
    ">
      <p style="margin: 0 0 4px;">
        Generated by <strong style="color: #6c63ff;">Resume Analyzer AI</strong>
      </p>
      <p style="margin: 0;">
        resume-analyzer-7y62.onrender.com
      </p>
    </div>

  </div>
</body>
</html>
    `;

        // Send email
        const mailOptions = {
            from: `"Resume Analyzer" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: `📊 Your Resume Analysis Report - Score: ${analysisData.score}/100`,
            html: htmlContent
        };

        await transporter.sendMail(mailOptions);
        return { success: true };

    } catch (error) {
        console.error('Email Error:', error);
        return { success: false, error: error.message };
    }
};

module.exports = { sendAnalysisReport };