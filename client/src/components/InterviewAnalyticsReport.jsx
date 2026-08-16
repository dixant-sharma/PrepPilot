import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { BsDownload, BsCheckCircleFill, BsLightningChargeFill, BsBarChartFill, BsSearch, BsMicFill, BsStars } from 'react-icons/bs';

function InterviewAnalyticsReport({ report }) {
  if (!report) {
    return (
      <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center text-gray-400">
        <p className="text-lg">Loading Report Data...</p>
      </div>
    );
  }

  const navigate = useNavigate();
  const {
    finalScore = 0,
    confidence = 0,
    communication = 0,
    correctness = 0,
    atsAnalysis = null,
    questionWiseScore = [],
  } = report;

  const questionScoreData = questionWiseScore.map((score, index) => ({
    name: `Q${index + 1}`,
    score: score.score || 0,
  }));

  const skills = [
    { label: 'Confidence & Delivery', value: confidence, color: '#10B981' },
    { label: 'Communication Clarity', value: communication, color: '#14B8A6' },
    { label: 'Technical Correctness', value: correctness, color: '#06B6D4' },
  ];

  let performanceText = '';
  let shortTagline = '';

  if (finalScore >= 8) {
    performanceText = 'Ready for Target Role Interviews.';
    shortTagline = 'Demonstrates structured responses, clarity, and strong technical articulation.';
  } else if (finalScore >= 5) {
    performanceText = 'Solid Foundation - Needs Targeted Polish.';
    shortTagline = 'Good core knowledge; refine explanation structure and confidence.';
  } else {
    performanceText = 'Significant Practice Required.';
    shortTagline = 'Focus on core concept clarity, concise articulation, and practice answering aloud.';
  }

  const score = finalScore;
  const percentage = (score / 10) * 100;

  const downloadPDF = () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let currentY = 25;

    // TITLE
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(16, 185, 129);
    doc.text('PrepPilot AI Performance Report', pageWidth / 2, currentY, { align: 'center' });

    currentY += 5;
    doc.setDrawColor(16, 185, 129);
    doc.line(margin, currentY + 2, pageWidth - margin, currentY + 2);
    currentY += 15;

    // FINAL SCORE BOX
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(margin, currentY, contentWidth, 20, 4, 4, 'F');
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`Final AI Readiness Score: ${finalScore}/10`, pageWidth / 2, currentY + 12, { align: 'center' });
    currentY += 30;

    // SKILLS BOX
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(margin, currentY, contentWidth, 30, 4, 4, 'F');
    doc.setFontSize(11);
    doc.text(`Confidence: ${confidence} / 10`, margin + 10, currentY + 10);
    doc.text(`Communication: ${communication} / 10`, margin + 10, currentY + 18);
    doc.text(`Correctness: ${correctness} / 10`, margin + 10, currentY + 26);
    currentY += 45;

    // ADVICE
    let advice = '';
    if (finalScore >= 8) {
      advice = 'Excellent performance. Maintain confidence and structure. Continue refining clarity with strong real-world examples.';
    } else if (finalScore >= 5) {
      advice = 'Good foundation shown. Improve clarity and answer structure. Practice delivering concise responses.';
    } else {
      advice = 'Focus on structured thinking, clarity, and confident delivery. Practice answering questions aloud regularly.';
    }

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(220);
    doc.roundedRect(margin, currentY, contentWidth, 35, 4, 4);
    doc.setFont('helvetica', 'bold');
    doc.text('PrepPilot AI Recommendations', margin + 10, currentY + 10);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const splitAdvice = doc.splitTextToSize(advice, contentWidth - 20);
    doc.text(splitAdvice, margin + 10, currentY + 20);
    currentY += 50;

    // QUESTION TABLE
    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [['#', 'Question', 'Score', 'AI Feedback']],
      body: questionWiseScore.map((q, i) => [
        `${i + 1}`,
        q.question,
        `${q.score}/10`,
        q.feedback,
      ]),
      styles: { fontSize: 8, cellPadding: 4, valign: 'top' },
      headStyles: { fillColor: [16, 185, 129], textColor: 255, halign: 'center' },
      columnStyles: {
        0: { cellWidth: 8, halign: 'center' },
        1: { cellWidth: 60 },
        2: { cellWidth: 18, halign: 'center' },
        3: { cellWidth: 'auto' },
      },
      alternateRowStyles: { fillColor: [249, 250, 251] },
    });

    doc.save('PrepPilot_AI_Interview_Report.pdf');
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-gray-100 px-4 sm:px-6 lg:px-10 py-10 selection:bg-emerald-500 selection:text-white">
      {/* PAGE HEADER */}
      <div className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/history')}
            className="p-3 rounded-2xl glass-card border border-white/10 text-gray-300 hover:text-white hover:border-emerald-500/40 transition"
          >
            <FaArrowLeft />
          </button>
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold mb-1">
              <BsBarChartFill size={12} />
              PrepPilot Executive Dashboard
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
              Interview Evaluation Report
            </h1>
          </div>
        </div>

        <button
          onClick={downloadPDF}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white px-6 py-3 rounded-2xl shadow-xl shadow-emerald-500/20 font-bold text-sm flex items-center justify-center gap-2 transition"
        >
          <BsDownload size={16} /> Download Official PDF Report
        </button>
      </div>

      {/* MAIN ANALYTICS GRID */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT SUMMARY COLUMN */}
        <div className="space-y-8">
          {/* OVERALL SCORE METER */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-3xl p-8 text-center border border-white/10 relative overflow-hidden"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />

            <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-6">Overall Readiness Rating</h3>
            <div className="w-28 h-28 mx-auto relative">
              <CircularProgressbar
                value={percentage}
                text={`${score}`}
                styles={buildStyles({
                  textSize: '24px',
                  pathColor: '#10B981',
                  textColor: '#FFFFFF',
                  trailColor: 'rgba(255,255,255,0.08)',
                })}
              />
            </div>

            <p className="text-gray-400 mt-4 text-xs font-semibold">Scale out of 10.0</p>

            <div className="mt-5 pt-4 border-t border-white/10">
              <p className="font-bold text-emerald-400 text-base font-['Outfit']">{performanceText}</p>
              <p className="text-gray-400 text-xs mt-1 leading-relaxed">{shortTagline}</p>
            </div>
          </motion.div>

          {/* ATS ALIGNMENT CARD (IF PRESENT) */}
          {atsAnalysis && atsAnalysis.atsScore > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-panel rounded-3xl p-8 border border-white/10"
            >
              <h3 className="text-base font-bold text-white mb-4 font-['Outfit'] flex items-center gap-2">
                <BsSearch size={16} className="text-emerald-400" />
                ATS Resume Match Scorecard
              </h3>

              <div className="flex items-center justify-between mb-4 bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/20">
                <span className="text-xs text-gray-300 font-semibold">ATS Compatibility</span>
                <span className="text-lg font-extrabold text-emerald-400">{atsAnalysis.atsScore}%</span>
              </div>

              {atsAnalysis.missingKeywords?.length > 0 && (
                <div className="mb-4">
                  <span className="text-[11px] text-amber-400 font-semibold uppercase">Missing Keywords:</span>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {atsAnalysis.missingKeywords.map((kw, i) => (
                      <span key={i} className="bg-amber-500/15 text-amber-300 border border-amber-500/20 text-[10px] px-2 py-0.5 rounded-md">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* SKILL BREAKDOWN METERS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-panel rounded-3xl p-8 border border-white/10"
          >
            <h3 className="text-base font-bold text-white mb-6 font-['Outfit'] flex items-center gap-2">
              <BsLightningChargeFill size={16} className="text-emerald-400" />
              Core Competency Scores
            </h3>

            <div className="space-y-6">
              {skills.map((s, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-2 text-xs font-medium">
                    <span className="text-gray-300">{s.label}</span>
                    <span className="font-bold text-emerald-400">{s.value} / 10</span>
                  </div>
                  <div className="bg-white/5 h-2.5 rounded-full overflow-hidden border border-white/5">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${(s.value / 10) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* RIGHT DETAILS COLUMN */}
        <div className="lg:col-span-2 space-y-8">
          {/* RECHARTS PERFORMANCE AREA CHART */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel rounded-3xl p-8 border border-white/10"
          >
            <h3 className="text-base font-bold text-white mb-6 font-['Outfit']">Question Score Progression</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={questionScoreData}>
                  <defs>
                    <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="#6B7280" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                  <YAxis domain={[0, 10]} stroke="#6B7280" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111827',
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: '#fff',
                    }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#10B981" fillOpacity={1} fill="url(#scoreColor)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* QUESTION BREAKDOWN CARDS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel rounded-3xl p-8 border border-white/10"
          >
            <h3 className="text-base font-bold text-white mb-6 font-['Outfit']">Detailed Question & Behavioral Feedback</h3>
            <div className="space-y-6">
              {questionWiseScore.map((q, i) => (
                <div key={i} className="glass-card p-6 rounded-2xl border border-white/5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-extrabold text-emerald-400 tracking-wider uppercase bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                        Question {i + 1}
                      </span>
                      <p className="font-bold text-white text-base leading-relaxed mt-2 font-['Outfit']">
                        {q.question || 'Question text unavailable'}
                      </p>
                    </div>
                    <div className="bg-emerald-500/20 text-emerald-400 px-3.5 py-1 rounded-xl font-bold text-sm border border-emerald-500/30 w-fit shrink-0">
                      {q.score ?? 0} / 10
                    </div>
                  </div>

                  {/* MAIN FEEDBACK */}
                  <div className="bg-emerald-950/30 border border-emerald-500/20 p-4 rounded-xl space-y-1">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <BsCheckCircleFill size={12} />
                      PrepPilot AI Evaluation Feedback
                    </span>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {q.feedback && q.feedback.trim() !== '' ? q.feedback : 'No specific feedback generated for this response.'}
                    </p>
                  </div>

                  {/* SPEECH FLUENCY METRICS (IF PRESENT) */}
                  {q.fluencyMetrics && (
                    <div className="flex flex-wrap items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5 text-xs text-gray-300">
                      <div className="flex items-center gap-1.5 text-teal-400 font-semibold">
                        <BsMicFill size={12} />
                        Pace: <span className="text-white">{q.fluencyMetrics.wpm || 0} WPM</span>
                      </div>
                      <div className="text-gray-400">
                        Filler Words: <span className="text-amber-400 font-bold">{q.fluencyMetrics.fillerWordCount || 0}</span>
                      </div>
                      {q.fluencyMetrics.fillerWordsFound?.length > 0 && (
                        <div className="flex items-center gap-1">
                          {q.fluencyMetrics.fillerWordsFound.map((fw, idx) => (
                            <span key={idx} className="bg-amber-500/10 text-amber-300 text-[10px] px-2 py-0.5 rounded border border-amber-500/20">
                              "{fw}"
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* STAR TECHNIQUE COACH (HR MODE) */}
                  {q.starAnalysis && q.starAnalysis.starScore > 0 && (
                    <div className="bg-teal-950/30 border border-teal-500/20 p-4 rounded-xl space-y-3">
                      <div className="flex items-center justify-between text-teal-400 text-xs font-bold uppercase tracking-wider">
                        <span className="flex items-center gap-1.5">
                          <BsStars size={14} />
                          STAR Behavioral Breakdown
                        </span>
                        <span>Score: {q.starAnalysis.starScore} / 10</span>
                      </div>

                      <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                        <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                          <span className="text-gray-400 block">Situation</span>
                          <span className="text-emerald-400 font-bold text-xs">{q.starAnalysis.situationScore}/10</span>
                        </div>
                        <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                          <span className="text-gray-400 block">Task</span>
                          <span className="text-teal-400 font-bold text-xs">{q.starAnalysis.taskScore}/10</span>
                        </div>
                        <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                          <span className="text-gray-400 block">Action</span>
                          <span className="text-cyan-400 font-bold text-xs">{q.starAnalysis.actionScore}/10</span>
                        </div>
                        <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                          <span className="text-gray-400 block">Result</span>
                          <span className="text-emerald-400 font-bold text-xs">{q.starAnalysis.resultScore}/10</span>
                        </div>
                      </div>

                      {q.starAnalysis.aiRewrittenAnswer && (
                        <div className="pt-2 border-t border-white/10">
                          <span className="text-[10px] font-bold text-teal-300 uppercase tracking-wider block mb-1">
                            AI STAR Model Answer Rewrite:
                          </span>
                          <p className="text-xs text-teal-100 italic leading-relaxed bg-teal-900/40 p-3 rounded-lg border border-teal-500/20">
                            "{q.starAnalysis.aiRewrittenAnswer}"
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* NESTED FOLLOW-UPS (IF PRESENT) */}
                  {q.followUps && q.followUps.length > 0 && (
                    <div className="bg-cyan-950/20 border border-cyan-500/20 p-4 rounded-xl space-y-2">
                      <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                        AI Probing Follow-Up Question & Response:
                      </span>
                      {q.followUps.map((fu, fIdx) => (
                        <div key={fIdx} className="space-y-1 text-xs">
                          <p className="font-semibold text-cyan-200">Q: {fu.question}</p>
                          <p className="text-gray-300 italic">A: "{fu.answer || 'No response recorded'}"</p>
                          {fu.feedback && <p className="text-emerald-400 text-[11px]">Feedback: {fu.feedback}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default InterviewAnalyticsReport;
