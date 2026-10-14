const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
  // Health check
  checkHealth: async () => {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) throw new Error('Backend server is not responding');
    return res.json();
  },

  // Upload and parse resume (PDF / DOCX)
  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE_URL}/resume/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to upload and analyze resume');
    }
    return data;
  },

  // Direct raw text analysis
  analyzeRawText: async (text) => {
    const res = await fetch(`${API_BASE_URL}/resume/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to analyze text');
    }
    return data;
  },

  // Get single resume
  getResume: async (id) => {
    const res = await fetch(`${API_BASE_URL}/resume/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Resume not found');
    return data;
  },

  // Dynamic filter options from active jobs dataset
  getJobFilters: async () => {
    const res = await fetch(`${API_BASE_URL}/jobs/filters`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch job filter options');
    return data;
  },

  // Jobs listing with multi-criteria filters
  getJobs: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.job_type && params.job_type !== 'all') query.append('job_type', params.job_type);
    if (params.location && params.location !== 'all') query.append('location', params.location);
    if (params.experience && params.experience !== 'all') query.append('experience', params.experience);
    if (params.category && params.category !== 'all') query.append('category', params.category);
    if (params.skill && params.skill !== 'all') query.append('skill', params.skill);

    const res = await fetch(`${API_BASE_URL}/jobs?${query.toString()}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch jobs');
    return data;
  },

  // Get job detail
  getJobDetail: async (id) => {
    const res = await fetch(`${API_BASE_URL}/jobs/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Job not found');
    return data;
  },

  // Match resume to job
  matchJob: async (matchPayload) => {
    const res = await fetch(`${API_BASE_URL}/jobs/match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(matchPayload),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to calculate job match');
    }
    return data;
  },

  // Get personalized recommendations with multi-filter support
  getRecommendations: async (recPayload) => {
    const res = await fetch(`${API_BASE_URL}/recommendations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recPayload),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to generate recommendations');
    }
    return data;
  },

  // History endpoints
  getHistory: async () => {
    const res = await fetch(`${API_BASE_URL}/history`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to load analysis history');
    return data;
  },

  getHistoryDetail: async (id) => {
    const res = await fetch(`${API_BASE_URL}/history/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'History record not found');
    return data;
  },

  deleteHistoryItem: async (id) => {
    const res = await fetch(`${API_BASE_URL}/history/${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete history entry');
    return data;
  },

  clearHistory: async () => {
    const res = await fetch(`${API_BASE_URL}/history/clear`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to clear history');
    return data;
  }
};
