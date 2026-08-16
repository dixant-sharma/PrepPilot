import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ServerUrl } from '../App';
import InterviewAnalyticsReport from '../components/InterviewAnalyticsReport';

function InterviewReport() {
  const { id } = useParams();
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const result = await axios.get(`${ServerUrl}/api/interview/report/${id}`, {
          withCredentials: true,
        });
        setReport(result.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchReport();
  }, [id]);

  if (!report) {
    return (
      <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center text-gray-400">
        <p className="text-lg font-medium animate-pulse">Loading PrepPilot Analytics Report...</p>
      </div>
    );
  }

  return <InterviewAnalyticsReport report={report} />;
}

export default InterviewReport;
