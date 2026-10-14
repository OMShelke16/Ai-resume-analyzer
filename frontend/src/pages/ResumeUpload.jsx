import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Loader2
} from 'lucide-react';
import { api } from '../services/api';
import { useResume } from '../context/ResumeContext';
import { LoadingAnalysis } from '../components/LoadingSkeleton';

export const ResumeUpload = ({ setActivePage }) => {
  const { setResumeState, addToast } = useResume();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [rawText, setRawText] = useState('');
  const [activeTab, setActiveTab] = useState('file'); // 'file' | 'text'
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (file) => {
    if (!file) return;

    const ext = file.name.split('.').pop().toLowerCase();
    if (!['pdf', 'docx'].includes(ext)) {
      addToast('Invalid file format. Only PDF and DOCX files are supported.', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      addToast('File exceeds maximum size limit of 10 MB.', 'error');
      return;
    }

    setSelectedFile(file);
    addToast(`File selected: ${file.name}`, 'info');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUploadAndAnalyze = async () => {
    if (!selectedFile) {
      addToast('Please choose a PDF or DOCX file to upload.', 'error');
      return;
    }

    setIsProcessing(true);
    setProgress(20);

    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + 15 : prev));
    }, 250);

    try {
      const response = await api.uploadResume(selectedFile);
      clearInterval(progressInterval);
      setProgress(100);

      if (response.success) {
        setResumeState(
          response.resume,
          response.analysis,
          response.top_recommendations || []
        );
        addToast('Resume uploaded and analyzed successfully!', 'success');
        setTimeout(() => {
          setActivePage('analysis');
        }, 500);
      }
    } catch (err) {
      clearInterval(progressInterval);
      addToast(err.message || 'Error occurred while analyzing resume', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAnalyzeRawText = async () => {
    if (!rawText || rawText.trim().length < 40) {
      addToast('Please enter at least 40 characters of resume text.', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await api.analyzeRawText(rawText);
      if (response.success) {
        const manualResume = {
          id: Date.now(),
          filename: 'Pasted_Resume_Text.txt',
          original_name: 'Pasted Resume Text',
          file_type: 'manual',
          file_size: rawText.length,
          raw_text: rawText,
          created_at: new Date().toISOString()
        };

        const analysisObj = {
          ...response.parsed_data,
          ...response.scoring,
          id: Date.now(),
          raw_text: rawText
        };

        setResumeState(manualResume, analysisObj, response.top_recommendations || []);
        addToast('Resume text analyzed successfully!', 'success');
        setActivePage('analysis');
      }
    } catch (err) {
      addToast(err.message || 'Failed to analyze text', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Upload Your Resume
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Upload your resume in PDF or DOCX format to initiate AI Analyzer, ATS optimization, and personalized job matching.
        </p>
      </div>

      {/* Upload Methods Tab */}
      <div className="flex justify-center">
        <div className="inline-flex p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('file')}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'file'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Upload File (PDF / DOCX)
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'text'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Paste Text Directly
          </button>
        </div>
      </div>

      {isProcessing ? (
        <LoadingAnalysis message="AI NLP Engine is extracting entities, tokenizing text, and computing similarity..." />
      ) : activeTab === 'file' ? (
        /* File Upload Box */
        <div className="space-y-6">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative p-10 sm:p-14 rounded-3xl border-2 border-dashed transition-all duration-200 cursor-pointer flex flex-col items-center justify-center text-center group ${
              dragActive
                ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 scale-[1.01]'
                : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-blue-400 dark:hover:border-blue-600 shadow-sm'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-8 h-8 stroke-[1.8]" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              Drag & Drop your resume here, or <span className="text-blue-600 dark:text-blue-400 underline underline-offset-4">browse</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
              Supported file formats: <strong className="text-slate-700 dark:text-slate-300">PDF</strong> and <strong className="text-slate-700 dark:text-slate-300">DOCX</strong> (Max file size: 10 MB)
            </p>

            <div className="flex items-center gap-4 mt-6 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                100% Local Processing
              </span>
              <span>•</span>
              <span>No Cloud API Key Needed</span>
            </div>
          </div>

          {/* Selected File Card */}
          {selectedFile && (
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 flex items-center justify-between animate-in fade-in duration-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs uppercase">
                  {selectedFile.name.split('.').pop()}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
                    {selectedFile.name}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {(selectedFile.size / 1024).toFixed(1)} KB • Ready to Analyze
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRemoveFile}
                  className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors"
                  title="Remove selected file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          {progress > 0 && progress < 100 && (
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* Action Button */}
          <div className="flex items-center justify-center pt-2">
            <button
              onClick={handleUploadAndAnalyze}
              disabled={!selectedFile || isProcessing}
              className={`w-full sm:w-auto px-10 py-3.5 rounded-2xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all ${
                selectedFile && !isProcessing
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98]'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>Analyze Resume</span>
            </button>
          </div>
        </div>
      ) : (
        /* Raw Text Input Box */
        <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <label className="block text-sm font-bold text-slate-900 dark:text-white">
            Paste Candidate Resume Content:
          </label>
          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            rows={12}
            placeholder="Paste raw text here... e.g. Contact info, Education, Technical Skills (Python, SQL, Machine Learning), Work Experience, and Academic Projects."
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono leading-relaxed resize-y"
          />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <span className="text-xs text-slate-400 font-mono">
              {rawText.length} characters entered
            </span>

            <button
              onClick={handleAnalyzeRawText}
              disabled={!rawText.trim() || isProcessing}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
            >
              <Cpu className="w-4 h-4" />
              <span>Analyze Text</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
