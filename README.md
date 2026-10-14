# AI Resume Analyzer and Job Recommendation System
### A Classical Machine Learning & Natural Language Processing Approach

[![Python 3.10+](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![Flask 3.0](https://img.shields.io/badge/Backend-Flask%203.0-green.svg)](https://flask.palletsprojects.com/)
[![React 19](https://img.shields.io/badge/Frontend-React%2019%20%7C%20Vite-61dafb.svg)](https://react.dev/)
[![Scikit-Learn](https://img.shields.io/badge/ML-scikit--learn-orange.svg)](https://scikit-learn.org/)
[![License: Academic](https://img.shields.io/badge/License-Academic%20Submission-purple.svg)]()

> **Academic Project Submission**  
> **Authors:** Om Shelke, Shams Tabrez Ahmed  
> **Domain:** Artificial Intelligence, Machine Learning, Information Retrieval, Natural Language Processing  
> **Paper:** `AI Resume Analyzer and Job Recommendation System A Machine Learning Approach.docx`

---

## 1. Abstract & Motivation

Applicant Tracking Systems (ATS) reject over 75% of qualified resumes before human review, often due to rigid surface-form keyword mismatches or non-standard formatting. Simultaneously, recruitment teams drown in high-volume applications and lack consistent, explainable ranking tools.

This project implements an end-to-end, **100% locally hosted, offline AI Resume Analyzer & Job Recommendation System**. Designed specifically for transparent academic evaluation, it uses no paid third-party APIs (e.g. OpenAI), protecting candidate data privacy while ensuring full mathematical reproducibility.

### Core Capabilities
- **Document Ingestion:** Multi-engine parsing (`pdfplumber`, `PyMuPDF`, `pypdf`, `python-docx`) with automated **Tesseract OCR fallback** for scanned PDFs.
- **NLP Information Extraction:** Regex taxonomy mapping across 7 technical categories with boundary-aware token matching.
- **Interpretable Scoring:** Multi-factor Resume Quality Score (0–100) and 6-factor ATS Simulation audit.
- **Hybrid Job Recommendation:** 
  $$\text{Match}(R, j) = w_1 \cdot \cos(R, j) + w_2 \cdot \text{Coverage}(R, j) \quad (w_1 = 0.55, \, w_2 = 0.45)$$
- **Dense Semantic LSA Alternative:** 60-dimensional Latent Semantic Analysis (TruncatedSVD) dense semantic embeddings for vocabulary-invariant similarity.
- **Academic Benchmark Suite:** Automated evaluation measuring **Precision@k**, **NDCG@5**, and **MRR** with statistical ablation studies.

---

## 2. System Architecture

```
[ Candidate Resume (PDF / DOCX) ]
             │
             ▼
[ Document Ingestion: pdfplumber / fitz / python-docx ]
             │ (If text < 40 chars) ──► [ Tesseract OCR Fallback ]
             ▼
[ Text Preprocessor: Stopwords, Normalization & Tech Token Preservation ]
             │
             ├───► [ Section Segmenter & Heuristic Parser ] ──► Contact, Education & Experience
             ├───► [ Taxonomy Matcher: skills_taxonomy.json ] ──► Categorized Skills
             └───► [ Resume Scorer: Weighted Rubric & ATS Sim ] ──► Quality & ATS Scores
                                 │
                                 ▼
                     [ Hybrid Recommendation Engine ]
         (55% TF-IDF Cosine Similarity + 45% Skill Overlap Jaccard)
                  [ Optional: 60-dim Dense LSA Semantic Mode ]
                                 │
                     ┌───────────┴───────────┐
                     ▼                       ▼
            [ SQLite / jobs.csv ]   [ Match Rationale & Skill Gaps ]
                     │                       │
                     └───────────┬───────────┘
                                 ▼
         [ React 19 Frontend: Recharts, Gauges, Filters & History ]
```

---

## 3. Mathematical Formulations

### 3.1 TF-IDF Representation
For term $t$ in document $d$ of corpus $D$:
$$\text{TF}(t, d) = 1 + \ln(f(t, d)) \quad \text{(Sublinear TF scaling)}$$
$$\text{IDF}(t, D) = \ln\left(\frac{1 + |D|}{1 + \text{df}(t)}\right) + 1$$
$$\text{TF-IDF}(t, d) = \text{TF}(t, d) \times \text{IDF}(t, D) \quad \text{with } L_2 \text{ normalization: } \frac{v}{\|v\|_2}$$

### 3.2 Cosine Similarity
$$\cos(A, B) = \frac{A \cdot B}{\|A\|_2 \times \|B\|_2}$$

### 3.3 Skill Coverage Ratio
$$\text{Coverage}(R, j) = \frac{|S(R) \cap S(j)|}{|S(j)|}$$

### 3.4 Hybrid Match Score
$$\text{Match}(R, j) = 0.55 \cdot \cos(R, j) + 0.45 \cdot \text{Coverage}(R, j)$$

### 3.5 Resume Quality Score (0–100)
$$\text{Quality} = 0.35 \cdot \text{Skills} + 0.20 \cdot \text{Experience} + 0.15 \cdot \text{Projects} + 0.10 \cdot \text{Education} + 0.10 \cdot \text{Completeness} + 0.10 \cdot \text{Keywords}$$

---

## 4. Empirical Evaluation Results

The system was benchmarked against 10 standardized technical test profiles across the 52 curated job openings in `jobs.csv`. Ground truth relevance was annotated on a 3-point graded scale ($0 = \text{irrelevant}, 1 = \text{partially relevant}, 2 = \text{highly relevant}$).

### Table 1: Ranking Performance Comparison

| Method | P@3 | P@5 | NDCG@5 | MRR | Notes |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Exact Keyword Matching** | 0.600 | 0.560 | 0.520 | 1.000 | Baseline surface-form overlap |
| **TF-IDF Cosine Only** ($w_1=1.0$) | 0.667 | 0.640 | 0.560 | 1.000 | Lexical vector space model |
| **Skill Coverage Only** ($w_2=1.0$) | 0.733 | 0.640 | 0.577 | 1.000 | Discrete skill matching |
| **Proposed Hybrid Model** ($w_1=0.55, w_2=0.45$) | **0.800** | **0.600** | **0.579** | **1.000** | **Best balanced precision and gain** |
| **Dense LSA Semantic (Local Alternative)** | 0.733 | 0.600 | 0.571 | 1.000 | Latent concept space retrieval |

### Table 2: Skill Extraction Accuracy

| Category | Precision | Recall | F1-Score |
| :--- | :---: | :---: | :---: |
| **Programming Languages** | 1.000 | 0.455 | 0.625 |
| **Frameworks & Libraries** | 0.842 | 0.800 | 0.821 |
| **Databases** | 0.667 | 0.500 | 0.571 |
| **Cloud & DevOps** | 0.700 | 0.500 | 0.583 |
| **Overall Micro-Average** | **0.811** | **0.612** | **0.698** |

### Table 3: Ablation Study ($w_1 \in [0.0, 1.0]$)

```
w1 = 0.0 (Coverage only) -> NDCG@5: 0.577 | █████████████████
w1 = 0.2 (w2 = 0.8)     -> NDCG@5: 0.587 | █████████████████
w1 = 0.5 (w2 = 0.5)     -> NDCG@5: 0.579 | █████████████████
w1 = 0.8 (w2 = 0.2)     -> NDCG@5: 0.616 | ██████████████████
w1 = 1.0 (Cosine only)   -> NDCG@5: 0.574 | █████████████████
```

---

## 5. Architectural Comparison: Current vs Alternatives

| Component | Current Implementation | Better Local Alternative (Integrated) | High-End Enterprise Alternative |
| :--- | :--- | :--- | :--- |
| **PDF Extraction** | `pdfplumber` + `pypdf` | **Tesseract OCR Fallback** via `pdf2image` | Multimodal Vision Model (`Marker` / `Unstructured`) |
| **Skill Extraction** | Longest-match Regex + Alias Map | **Canonical Taxonomy + Pre-compiled Regex** | Fine-tuned `GLiNER` / `spaCy` NER |
| **Semantic Matching** | Global Corpus TF-IDF Cosine | **60-dim Latent Semantic Analysis (LSA TruncatedSVD)** | `Sentence-BERT` (`all-MiniLM-L6-v2`) + Vector Index |
| **API Dependencies** | **Zero External APIs** (100% Offline) | **Zero External APIs** (100% Offline) | Paid Cloud APIs (OpenAI / Gemini) |
| **Data Persistence** | SQLite (`resume_system.db`) | SQLite with relational foreign keys | PostgreSQL + `pgvector` |

---

## 6. Installation & Execution Guide

### Prerequisites
- Python 3.10 or higher
- Node.js 18+ and npm
- Tesseract OCR (`sudo apt install tesseract-ocr` on Linux, `brew install tesseract` on macOS)

### Quickstart (Single Command)

```bash
# 1. Clone repository
git clone https://github.com/OMShelke16/Ai-resume-analyzer.git
cd Ai-resume-analyzer

# 2. Make startup script executable and run
chmod +x start.sh
./start.sh
```

### Manual Setup

#### Backend Setup
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Run the evaluation benchmark
python3 -m backend.ml.evaluate

# Start Flask API server (Port 5000)
python3 -m backend.app
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
# Open http://localhost:5173 in browser
```

---

## 7. Project Structure

```
Ai-resume-analyzer/
├── AI Resume Analyzer and Job Recommendation System A Machine Learning Approach.docx
├── README.md
├── start.sh
├── backend/
│   ├── app.py                     # Flask application factory & routes
│   ├── config.py                  # System weights & paths
│   ├── database.py                # SQLAlchemy DB setup
│   ├── requirements.txt           # Python dependencies
│   ├── resume_system.db           # SQLite database
│   ├── data/
│   │   ├── jobs.csv               # 52 curated technology job postings
│   │   └── skills_taxonomy.json   # Comprehensive 7-category taxonomy
│   ├── ml/
│   │   ├── evaluate.py            # Academic benchmark & metric suite
│   │   ├── similarity.py          # TF-IDF & LSA cosine similarity
│   │   └── tfidf_model.py         # Global corpus TF-IDF & TruncatedSVD
│   ├── models/
│   │   └── schema.py              # Resume, Job, Analysis SQLAlchemy schemas
│   ├── routes/
│   │   ├── history_routes.py      # History logging & snapshot endpoints
│   │   ├── job_routes.py          # Job listing & individual matching
│   │   ├── recommendation_routes.py # Ranked job recommendations
│   │   └── resume_routes.py       # Upload, parse, and ATS score endpoints
│   ├── services/
│   │   ├── job_matcher.py         # Single-job matching logic
│   │   ├── recommendation_engine.py # Vectorized candidate recommendation
│   │   ├── resume_parser.py       # Entity extraction with OCR fallback
│   │   ├── resume_scorer.py       # Quality score & ATS audit calculations
│   │   ├── skill_extractor.py     # Skill taxonomy matching & comparison
│   │   └── text_preprocessor.py   # Stopwords & technical token cleaner
│   └── uploads/                   # Stored candidate resume files
└── frontend/
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx                # Root layout & routing
        ├── components/            # Reusable gauges, badges, navbars
        ├── context/               # Resume & theme state providers
        ├── pages/
        │   ├── Dashboard.jsx      # Overview dashboard
        │   ├── ResumeUpload.jsx   # Drag-and-drop file uploader
        │   ├── ResumeAnalysis.jsx # Detailed entity breakdown & ATS score
        │   ├── JobRecommendations.jsx # Filterable job matches
        │   ├── JobMatching.jsx    # Target job description matcher
        │   ├── ResumeImprovement.jsx # Interactive ATS checklist
        │   └── AnalysisHistory.jsx # Historical audit logs
        └── services/
            └── api.js             # Client HTTP API connector
```

---

## 8. Authors & Acknowledgments

- **Om Shelke**
- **Shams Tabrez Ahmed**

*Developed as an academic research project in Artificial Intelligence, Information Retrieval, and Natural Language Processing.*
