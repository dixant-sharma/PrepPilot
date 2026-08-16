import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaUserTie,
  FaBriefcase,
  FaFileUpload,
  FaMicrophoneAlt,
} from 'react-icons/fa';
import { BsLightningChargeFill, BsPlayFill, BsFileEarmarkCheckFill, BsSearch } from 'react-icons/bs';
import axios from 'axios';
import { ServerUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../redux/userSlice';

function InterviewSetupWizard({ onStart }) {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [role, setRole] = useState('');
  const [experience, setExperience] = useState('');
  const [mode, setMode] = useState('Technical');
  const [jobDescription, setJobDescription] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [resumeText, setResumeText] = useState('');
  const [atsAnalysis, setAtsAnalysis] = useState(null);
  const [analysisDone, setAnalysisDone] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleUploadResume = async () => {
    if (!resumeFile || analyzing) return;
    setAnalyzing(true);

    const formdata = new FormData();
    formdata.append('resume', resumeFile);
    if (jobDescription.trim()) {
      formdata.append('jobDescription', jobDescription.trim());
    }

    try {
      const result = await axios.post(`${ServerUrl}/api/interview/resume`, formdata, {
        withCredentials: true,
      });

      setRole(result.data.role || '');
      setExperience(result.data.experience || '');
      setProjects(result.data.projects || []);
      setSkills(result.data.skills || []);
      setResumeText(result.data.resumeText || '');
      setAtsAnalysis({
        atsScore: result.data.atsScore || 75,
        missingKeywords: result.data.missingKeywords || [],
        matchedSkills: result.data.matchedSkills || [],
        improvementSuggestions: result.data.improvementSuggestions || [],
      });
      setAnalysisDone(true);
      setAnalyzing(false);
    } catch (error) {
      console.log(error);
      setAnalyzing(false);
    }
  };

  const handleStart = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        `${ServerUrl}/api/interview/generate-questions`,
        { role, experience, mode, resumeText, projects, skills, jobDescription, atsAnalysis },
        { withCredentials: true }
      );
      if (userData) {
        dispatch(setUserData({ ...userData, credits: result.data.creditsLeft }));
      }
      setLoading(false);
      onStart(result.data);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex items-center justify-center bg-[#0B0F17] px-4 py-12 text-gray-100 selection:bg-emerald-500 selection:text-white"
    >
      <div className="w-full max-w-6xl glass-panel rounded-3xl shadow-2xl grid md:grid-cols-2 overflow-hidden border border-white/10 relative">
        {/* LEFT BRAND SIDEBAR */}
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-br from-emerald-950/60 via-gray-900 to-teal-950/40 p-10 md:p-12 flex flex-col justify-center border-b md:border-b-0 md:border-r border-white/10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6 w-fit">
            <BsLightningChargeFill size={12} />
            ATS Resume Matcher & Studio Configurator
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight font-['Outfit']">
            Configure Your <span className="text-emerald-400">PrepPilot</span> Session
          </h2>

          <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8">
            Simulate realistic job interviews powered by AI. Evaluate ATS keywords, technical depth, communication clarity, and role readiness.
          </p>

          <div className="space-y-4">
            {[
              {
                icon: <BsSearch className="text-emerald-400 text-lg" />,
                title: 'ATS Resume Matcher & JD Alignment',
                desc: 'Scans for missing keywords & skills',
              },
              {
                icon: <FaUserTie className="text-teal-400 text-lg" />,
                title: 'Role & Experience Target',
                desc: 'Tailor AI questions to your exact domain',
              },
              {
                icon: <FaMicrophoneAlt className="text-cyan-400 text-lg" />,
                title: 'Live Voice & Text Simulation',
                desc: 'Interactive timer & speech synthesis',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="flex items-center gap-4 glass-card p-4 rounded-2xl border border-white/5"
              >
                <div className="p-3 bg-white/5 rounded-xl">{item.icon}</div>
                <div>
                  <h4 className="text-sm font-bold text-white">{item.title}</h4>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT FORM SETUP */}
        <motion.div
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="p-10 md:p-12 bg-gray-900/70 flex flex-col justify-center"
        >
          <h3 className="text-2xl font-bold text-white mb-6 font-['Outfit']">Session Parameters</h3>

          <div className="space-y-5">
            {/* ROLE INPUT */}
            <div>
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 block">Target Job Role</label>
              <div className="relative">
                <FaUserTie className="absolute top-3.5 left-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="e.g. Senior Full Stack Engineer"
                  className="w-full pl-12 pr-4 py-3 glass-input rounded-xl text-sm focus:outline-none transition"
                  onChange={(e) => setRole(e.target.value)}
                  value={role}
                />
              </div>
            </div>

            {/* EXPERIENCE INPUT */}
            <div>
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 block">Years of Experience</label>
              <div className="relative">
                <FaBriefcase className="absolute top-3.5 left-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="e.g. 3 years"
                  className="w-full pl-12 pr-4 py-3 glass-input rounded-xl text-sm focus:outline-none transition"
                  onChange={(e) => setExperience(e.target.value)}
                  value={experience}
                />
              </div>
            </div>

            {/* MODE SELECTION */}
            <div>
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 block">Interview Track</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full py-3 px-4 glass-input rounded-xl text-sm focus:outline-none transition text-white bg-gray-900 cursor-pointer"
              >
                <option value="Technical" className="bg-gray-900 text-white">Technical Deep-Dive Mode</option>
                <option value="HR" className="bg-gray-900 text-white">HR & Behavioral Mode (STAR Coach)</option>
              </select>
            </div>

            {/* JOB DESCRIPTION OPTIONAL INPUT */}
            <div>
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 block">
                Target Job Description (Optional for ATS Matching)
              </label>
              <textarea
                placeholder="Paste target Job Description here to get ATS keyword match score & tailored questions..."
                rows={3}
                className="w-full p-3.5 glass-input rounded-xl text-xs outline-none transition text-gray-100"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>

            {/* RESUME UPLOAD AREA */}
            {!analysisDone && (
              <div
                onClick={() => document.getElementById('resumeUpload').click()}
                className="border-2 border-dashed border-white/15 rounded-2xl p-5 text-center cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group"
              >
                <FaFileUpload className="text-3xl mx-auto text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                <input
                  type="file"
                  accept="application/pdf"
                  id="resumeUpload"
                  className="hidden"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                />
                <p className="text-xs font-medium text-gray-300">
                  {resumeFile ? resumeFile.name : 'Upload Resume PDF for Tailored Questions & ATS Analysis'}
                </p>

                {resumeFile && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUploadResume();
                    }}
                    className="mt-3 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-lg shadow-emerald-500/20"
                  >
                    {analyzing ? 'Extracting Resume & ATS Analysis...' : 'Analyze Resume & Match ATS'}
                  </button>
                )}
              </div>
            )}

            {/* ATS ANALYSIS PREVIEW */}
            {analysisDone && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-4 rounded-xl border border-emerald-500/30 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                    <BsFileEarmarkCheckFill size={14} />
                    <span>Resume & ATS Analysis Complete</span>
                  </div>
                  {atsAnalysis && (
                    <div className="bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full text-xs font-extrabold border border-emerald-500/30">
                      ATS Score: {atsAnalysis.atsScore}%
                    </div>
                  )}
                </div>

                {atsAnalysis?.missingKeywords?.length > 0 && (
                  <div>
                    <span className="text-[11px] text-amber-400 font-semibold uppercase">Missing Keywords:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {atsAnalysis.missingKeywords.map((kw, i) => (
                        <span key={i} className="bg-amber-500/15 text-amber-300 border border-amber-500/20 text-[10px] px-2 py-0.5 rounded-md">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {skills.length > 0 && (
                  <div>
                    <span className="text-[11px] text-gray-400 font-semibold uppercase">Matched Skills:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {skills.map((s, i) => (
                        <span key={i} className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 text-[10px] px-2 py-0.5 rounded-full font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* START BUTTON */}
            <motion.button
              onClick={handleStart}
              disabled={!role || !experience || loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold py-3.5 rounded-2xl text-sm shadow-xl shadow-emerald-500/20 transition flex items-center justify-center gap-2"
            >
              <BsPlayFill size={20} />
              {loading ? 'Generating AI Question Set...' : 'Launch Interview Session (50 Credits)'}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default InterviewSetupWizard;
