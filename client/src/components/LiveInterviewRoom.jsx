import React, { useState, useRef, useEffect } from 'react';
import maleVideo from '../assets/videos/male-ai.mp4';
import femaleVideo from '../assets/videos/female-ai.mp4';
import Timer from './Timer';
import AudioVisualizer from './ui/AudioVisualizer';
import { motion } from 'framer-motion';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import { BsArrowRight, BsBroadcast, BsCheckCircleFill } from 'react-icons/bs';
import axios from 'axios';
import { ServerUrl } from '../App';

function LiveInterviewRoom({ interviewData, onFinish }) {
  const { interviewId, questions, userName } = interviewData;
  const [isIntroPhase, setIsIntroPhase] = useState(true);

  const [isMicOn, setIsMicOn] = useState(true);
  const recognitionRef = useRef(null);
  const [isAIPlaying, setIsAIPlaying] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [timeLeft, setTimeLeft] = useState(questions[0]?.timeLimit || 60);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voiceGender, setVoiceGender] = useState('female');
  const [subtitle, setSubtitle] = useState('');

  const videoRef = useRef(null);
  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;

      const femaleVoice = voices.find(
        (v) =>
          v.name.toLowerCase().includes('zira') ||
          v.name.toLowerCase().includes('samantha') ||
          v.name.toLowerCase().includes('female')
      );

      if (femaleVoice) {
        setSelectedVoice(femaleVoice);
        setVoiceGender('female');
        return;
      }

      const maleVoice = voices.find(
        (v) =>
          v.name.toLowerCase().includes('david') ||
          v.name.toLowerCase().includes('mark') ||
          v.name.toLowerCase().includes('male')
      );

      if (maleVoice) {
        setSelectedVoice(maleVoice);
        setVoiceGender('male');
        return;
      }

      setSelectedVoice(voices[0]);
      setVoiceGender('female');
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const videoSource = voiceGender === 'male' ? maleVideo : femaleVideo;

  /* ---------------- SPEAK FUNCTION ---------------- */
  const speakText = (text) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis || !selectedVoice) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();

      const humanText = text.replace(/,/g, ', ... ').replace(/\./g, '. ... ');
      const utterance = new SpeechSynthesisUtterance(humanText);
      utterance.voice = selectedVoice;
      utterance.rate = 0.92;
      utterance.pitch = 1.05;
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsAIPlaying(true);
        stopMic();
        videoRef.current?.play();
      };

      utterance.onend = () => {
        videoRef.current?.pause();
        if (videoRef.current) videoRef.current.currentTime = 0;
        setIsAIPlaying(false);

        if (isMicOn) {
          startMic();
        }
        setTimeout(() => {
          setSubtitle('');
          resolve();
        }, 300);
      };

      setSubtitle(text);
      window.speechSynthesis.speak(utterance);
    });
  };

  useEffect(() => {
    if (!selectedVoice) return;
    const runIntro = async () => {
      if (isIntroPhase) {
        await speakText(
          `Hi ${userName}, welcome to your PrepPilot AI interview session today. I hope you're ready.`
        );
        await speakText(
          "I will ask you a series of questions. Please state your answers clearly and take your time. Let's begin."
        );
        setIsIntroPhase(false);
      } else if (currentQuestion) {
        await new Promise((r) => setTimeout(r, 800));

        if (currentIndex === questions.length - 1) {
          await speakText('Alright, this final question will evaluate your deep technical capabilities.');
        }

        await speakText(currentQuestion.question);

        if (isMicOn) {
          startMic();
        }
      }
    };

    runIntro();
  }, [selectedVoice, isIntroPhase, currentIndex]);

  useEffect(() => {
    if (isIntroPhase) return;
    if (!currentQuestion) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isIntroPhase, currentIndex]);

  useEffect(() => {
    if (!isIntroPhase && currentQuestion) {
      setTimeLeft(currentQuestion.timeLimit || 60);
    }
  }, [currentIndex]);

  const [isSpeechSupported, setIsSpeechSupported] = useState(true);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
      setIsMicOn(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      setAnswer((prev) => (prev ? prev + ' ' + transcript : transcript));
    };

    recognition.onerror = (event) => {
      console.warn('Speech recognition error:', event.error);
    };

    recognitionRef.current = recognition;
  }, []);

  const startMic = () => {
    if (recognitionRef.current && !isAIPlaying) {
      try {
        recognitionRef.current.start();
      } catch {}
    }
  };

  const stopMic = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const toggleMic = () => {
    if (isMicOn) {
      stopMic();
    } else {
      startMic();
    }
    setIsMicOn(!isMicOn);
  };

  const submitAnswer = async () => {
    if (isSubmitting) return;
    stopMic();
    setIsSubmitting(true);

    try {
      const result = await axios.post(
        `${ServerUrl}/api/interview/submit-answer`,
        {
          interviewId,
          questionIndex: currentIndex,
          answer,
          timeTaken: currentQuestion.timeLimit - timeLeft,
        },
        { withCredentials: true }
      );

      setFeedback(result.data.feedback);
      speakText(result.data.feedback);
      setIsSubmitting(false);
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    setAnswer('');
    setFeedback('');

    if (currentIndex + 1 >= questions.length) {
      finishInterview();
      return;
    }

    await speakText("Alright, let's move to the next question.");

    setCurrentIndex(currentIndex + 1);
    setTimeout(() => {
      if (isMicOn) startMic();
    }, 500);
  };

  const finishInterview = async () => {
    stopMic();
    setIsMicOn(false);
    try {
      const result = await axios.post(
        `${ServerUrl}/api/interview/finish`,
        { interviewId },
        { withCredentials: true }
      );

      console.log(result.data);
      onFinish(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isIntroPhase) return;
    if (!currentQuestion) return;

    if (timeLeft === 0 && !isSubmitting && !feedback) {
      submitAnswer();
    }
  }, [timeLeft]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current.abort();
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0F17] text-gray-100 flex items-center justify-center p-4 sm:p-6 selection:bg-emerald-500 selection:text-white">
      <div className="w-full max-w-7xl min-h-[85vh] glass-panel rounded-3xl shadow-2xl border border-white/10 flex flex-col lg:flex-row overflow-hidden relative">
        {/* LEFT STUDIO & AVATAR COLUMN */}
        <div className="w-full lg:w-[38%] bg-gray-900/80 p-6 flex flex-col items-center border-b lg:border-b-0 lg:border-r border-white/10 space-y-6">
          <div className="w-full flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
              <BsBroadcast size={14} className="animate-pulse text-emerald-400" />
              Live AI Studio Session
            </span>
            <AudioVisualizer isPlaying={isAIPlaying} barCount={10} />
          </div>

          {/* AVATAR VIDEO */}
          <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-white/15 relative bg-black">
            <video
              src={videoSource}
              key={videoSource}
              ref={videoRef}
              muted
              playsInline
              preload="auto"
              className="w-full h-auto object-cover opacity-90"
            />
            {isAIPlaying && (
              <div className="absolute top-3 left-3 bg-emerald-500 text-black text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                AI Speaking
              </div>
            )}
          </div>

          {/* SUBTITLE BOX */}
          <div
            className={`w-full max-w-md glass-card border border-emerald-500/30 rounded-xl p-3.5 shadow-lg min-h-[60px] flex items-center justify-center transition-all duration-300 ${
              subtitle ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
            }`}
          >
            <p className="text-emerald-300 text-xs sm:text-sm font-medium text-center leading-relaxed">
              "{subtitle || ''}"
            </p>
          </div>

          {/* TIMER & PROGRESS CARD */}
          <div className="w-full max-w-md glass-card rounded-2xl p-6 border border-white/10 space-y-5 shrink-0">
            <div className="flex justify-between items-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
              <span>Question Timer</span>
              <span className="text-emerald-400">{currentQuestion?.difficulty || 'Medium'} Level</span>
            </div>

            <div className="flex justify-center py-2">
              <Timer timeLeft={timeLeft} totalTime={currentQuestion?.timeLimit} />
            </div>

            <div className="grid grid-cols-2 gap-4 text-center pt-3 border-t border-white/10">
              <div>
                <span className="text-2xl font-extrabold text-emerald-400 font-['Outfit']">{currentIndex + 1}</span>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Current Q</p>
              </div>
              <div>
                <span className="text-2xl font-extrabold text-white font-['Outfit']">{questions.length}</span>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Total Questions</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT CANDIDATE RESPONSE COLUMN */}
        <div className="flex-1 flex flex-col p-6 sm:p-8 bg-gray-900/50 justify-between">
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-6 shrink-0">
              <h2 className="text-2xl font-extrabold text-white font-['Outfit']">PrepPilot Session Studio</h2>
              <span className="text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                Mode: <strong className="text-emerald-400">{interviewData.mode || 'Technical'}</strong>
              </span>
            </div>

            {/* QUESTION DISPLAY CONTAINER */}
            <div className="glass-card p-5 sm:p-6 rounded-2xl border border-white/10 mb-5 shadow-xl min-h-[110px] flex flex-col justify-center transition-all duration-300 relative overflow-hidden shrink-0">
              {!isIntroPhase && currentQuestion ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold mb-2">
                    <span>Question {currentIndex + 1} of {questions.length}</span>
                    <span className="bg-emerald-500/10 px-2.5 py-0.5 rounded text-[10px] border border-emerald-500/20">
                      {currentQuestion?.timeLimit}s Time Limit
                    </span>
                  </div>
                  <p className="text-base sm:text-lg md:text-xl font-bold text-white leading-relaxed font-['Outfit']">
                    {currentQuestion?.question}
                  </p>
                </motion.div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
                  <div>
                    <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider block">Candidate Orientation</span>
                    <p className="text-xs sm:text-sm font-medium text-gray-300 font-['Outfit']">
                      AI Interviewer is providing instructions. Questions will begin shortly...
                    </p>
                  </div>
                </div>
              )}
            </div>

            {!isSpeechSupported && (
              <p className="text-xs text-amber-400 mb-3 font-medium bg-amber-500/10 p-3 rounded-xl border border-amber-500/20 shrink-0">
                Note: Speech Recognition is unavailable in this browser. Manual typing mode is active.
              </p>
            )}

            {/* TEXTAREA ANSWER ENTRY */}
            <div className="flex-1 flex flex-col min-h-[140px]">
              <textarea
                placeholder="State or type your detailed response here..."
                onChange={(e) => setAnswer(e.target.value)}
                value={answer}
                rows={5}
                className="w-full h-full glass-input p-5 rounded-2xl resize-none outline-none border border-white/10 focus:border-emerald-500/50 transition text-gray-100 text-sm leading-relaxed"
              />
            </div>
          </div>

          {/* CONTROLS & FEEDBACK AREA */}
          <div className="mt-5 min-h-[130px] flex flex-col justify-end shrink-0">
            {!feedback ? (
              <div className="flex items-center gap-4 transition-all duration-300">
                <motion.button
                  onClick={toggleMic}
                  whileTap={{ scale: 0.9 }}
                  className={`w-14 h-14 shrink-0 flex items-center justify-center rounded-2xl text-white shadow-xl transition-all cursor-pointer ${
                    isMicOn
                      ? 'bg-emerald-500 hover:bg-emerald-400 shadow-emerald-500/20'
                      : 'bg-gray-800 hover:bg-gray-700 text-gray-400 border border-white/10'
                  }`}
                >
                  {isMicOn ? <FaMicrophone size={22} /> : <FaMicrophoneSlash size={22} />}
                </motion.button>

                <motion.button
                  onClick={submitAnswer}
                  disabled={isSubmitting}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-emerald-500/20 transition-all text-sm uppercase tracking-wider disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Evaluating Answer with AI...' : 'Submit Answer for Evaluation'}
                </motion.button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="glass-card border border-emerald-500/40 p-5 rounded-2xl shadow-2xl space-y-3"
              >
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <BsCheckCircleFill size={14} />
                  <span>Real-Time AI Feedback</span>
                </div>
                <p className="text-white font-medium text-xs sm:text-sm leading-relaxed">"{feedback}"</p>

                <button
                  onClick={handleNext}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold py-3 rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
                >
                  Proceed to Next Question <BsArrowRight size={16} />
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LiveInterviewRoom;
