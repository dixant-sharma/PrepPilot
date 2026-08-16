import React, { useState } from 'react';
import InterviewSetupWizard from '../components/InterviewSetupWizard';
import LiveInterviewRoom from '../components/LiveInterviewRoom';
import InterviewAnalyticsReport from '../components/InterviewAnalyticsReport';

function InterviewPage() {
  const [step, setStep] = useState(1);
  const [interviewData, setInterviewData] = useState(null);

  return (
    <div className="min-h-screen bg-[#0B0F17]">
      {step === 1 && (
        <InterviewSetupWizard
          onStart={(data) => {
            setInterviewData(data);
            setStep(2);
          }}
        />
      )}

      {step === 2 && (
        <LiveInterviewRoom
          interviewData={interviewData}
          onFinish={(report) => {
            setInterviewData(report);
            setStep(3);
          }}
        />
      )}

      {step === 3 && <InterviewAnalyticsReport report={interviewData} />}
    </div>
  );
}

export default InterviewPage;
