import React, { createContext, useContext, useState } from 'react';

const ResumeContext = createContext();

export const ResumeProvider = ({ children }) => {
  // In-memory session state across navigation:
  // Fresh browser refresh starts clean with null state, enabling a new resume upload workflow.
  const [currentResume, setCurrentResume] = useState(null);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [topRecommendations, setTopRecommendations] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setResumeState = (resume, analysis, recs = []) => {
    setCurrentResume(resume);
    setCurrentAnalysis(analysis);
    setTopRecommendations(recs || []);
  };

  const clearResume = () => {
    setResumeState(null, null, []);
    setSelectedJob(null);
    addToast('Active resume cleared. Ready for new upload.', 'info');
  };

  return (
    <ResumeContext.Provider
      value={{
        currentResume,
        currentAnalysis,
        topRecommendations,
        setTopRecommendations,
        selectedJob,
        setSelectedJob,
        loading,
        setLoading,
        toasts,
        addToast,
        removeToast,
        setResumeState,
        clearResume,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => useContext(ResumeContext);
