import React, { useState, useEffect, Component } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ResumeProvider, useResume } from './context/ResumeContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/Toast';

import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { ResumeUpload } from './pages/ResumeUpload';
import { ResumeAnalysis } from './pages/ResumeAnalysis';
import { JobMatching } from './pages/JobMatching';
import { JobRecommendations } from './pages/JobRecommendations';
import { JobDetails } from './pages/JobDetails';
import { ResumeImprovement } from './pages/ResumeImprovement';
import { AnalysisHistory } from './pages/AnalysisHistory';
import { AboutProject } from './pages/AboutProject';
import { AlertTriangle, RotateCcw, Upload } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('UI Render Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 max-w-lg mx-auto my-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-center shadow-lg space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400 mx-auto">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Something unexpected occurred
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {this.state.error?.message || 'An error occurred while rendering this page.'}
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                if (this.props.onReset) this.props.onReset();
              }}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function MainLayout() {
  const [activePage, setActivePage] = useState('landing');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentAnalysis } = useResume();

  // Scroll to top when changing page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage]);

  const renderPage = () => {
    switch (activePage) {
      case 'landing':
        return <LandingPage setActivePage={setActivePage} />;
      case 'dashboard':
        return <Dashboard setActivePage={setActivePage} />;
      case 'upload':
        return <ResumeUpload setActivePage={setActivePage} />;
      case 'analysis':
        return <ResumeAnalysis setActivePage={setActivePage} />;
      case 'matching':
        return <JobMatching setActivePage={setActivePage} />;
      case 'recommendations':
        return <JobRecommendations setActivePage={setActivePage} />;
      case 'job-detail':
        return <JobDetails setActivePage={setActivePage} />;
      case 'improvement':
        return <ResumeImprovement setActivePage={setActivePage} />;
      case 'history':
        return <AnalysisHistory setActivePage={setActivePage} />;
      case 'about':
        return <AboutProject setActivePage={setActivePage} />;
      default:
        return <LandingPage setActivePage={setActivePage} />;
    }
  };

  const isLanding = activePage === 'landing';

  return (
    <div className="min-h-Analyze flex flex-col bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <ToastContainer />

      {/* When on landing page, show full-width layout with standard navbar */}
      {isLanding ? (
        <>
          <Navbar
            activePage={activePage}
            setActivePage={setActivePage}
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
          />
          <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8">
            <ErrorBoundary onReset={() => setActivePage('dashboard')}>
              {renderPage()}
            </ErrorBoundary>
          </main>
          <Footer setActivePage={setActivePage} />
        </>
      ) : (
        /* When on app pages, show sidebar + content layout */
        <div className="flex min-h-Analyze">
          {/* Sidebar */}
          <Sidebar
            activePage={activePage}
            setActivePage={setActivePage}
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
          />

          {/* Main content container with left padding for desktop sidebar */}
          <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
            <Navbar
              activePage={activePage}
              setActivePage={setActivePage}
              mobileMenuOpen={mobileMenuOpen}
              setMobileMenuOpen={setMobileMenuOpen}
            />

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <ErrorBoundary onReset={() => setActivePage('dashboard')}>
                {renderPage()}
              </ErrorBoundary>
            </main>

            <Footer setActivePage={setActivePage} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ResumeProvider>
        <MainLayout />
      </ResumeProvider>
    </ThemeProvider>
  );
}
