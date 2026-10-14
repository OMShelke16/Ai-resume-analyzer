#!/usr/bin/env bash
# AI Resume Analyzer & Job Recommendation System
# Automated Launch Script for College Submission / Local Demo

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="${PROJECT_DIR}/backend"
FRONTEND_DIR="${PROJECT_DIR}/frontend"

echo "=========================================================="
echo " Starting AI Resume Analyzer & Recommendation System"
echo " (100% Local & Offline - Zero External Paid APIs)"
echo "=========================================================="

# 1. Setup Backend Virtualenv if missing
if [ ! -d "${BACKEND_DIR}/.venv" ]; then
    echo "[1/4] Creating Python virtual environment in backend/.venv..."
    python3 -m venv "${BACKEND_DIR}/.venv"
    "${BACKEND_DIR}/.venv/bin/pip" install --upgrade pip
    "${BACKEND_DIR}/.venv/bin/pip" install -r "${BACKEND_DIR}/requirements.txt"
fi

# 2. Check and install frontend packages if node_modules missing
if [ ! -d "${FRONTEND_DIR}/node_modules" ]; then
    echo "[2/4] Installing frontend npm dependencies..."
    cd "${FRONTEND_DIR}"
    npm install
    cd "${PROJECT_DIR}"
fi

# 3. Trap exit signals to kill background servers on Ctrl+C
cleanup() {
    echo ""
    echo "Shutting down AI Resume Analyzer services..."
    kill $(jobs -p) 2>/dev/null || true
    exit 0
}
trap cleanup SIGINT SIGTERM EXIT

# 4. Start Flask Backend
echo "[3/4] Launching Flask REST Backend on http://localhost:5000..."
cd "${PROJECT_DIR}"
PYTHONPATH="${PROJECT_DIR}" "${BACKEND_DIR}/.venv/bin/python3" -m backend.app &
BACKEND_PID=$!

sleep 2

# 5. Start Vite Frontend
echo "[4/4] Launching Vite Frontend on http://localhost:5173..."
cd "${FRONTEND_DIR}"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "=========================================================="
echo " System is active and running!"
echo " - Frontend Web UI : http://localhost:5173"
echo " - Backend API     : http://localhost:5000/api/health"
echo " Press Ctrl+C at any time to stop both servers."
echo "=========================================================="

wait
