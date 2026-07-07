# ==============================================================================
# BrewAI Portfolio Prototype - Backend Microservice Multi-Stage Build
# ==============================================================================

# Stage 1: Build & Dependency Isolation
FROM python:3.11-slim AS builder

WORKDIR /workspace

# Install system build dependencies required for compiling certain Python packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# Compile dependencies into a local user space directory to optimize layer caching
RUN pip install --no-cache-dir --user -r requirements.txt

# Stage 2: Minimalist Lightweight Runtime Ingress
FROM python:3.11-slim AS runtime

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Pull the pre-compiled dependencies from the builder layer
COPY --from=builder /root/.local /root/.local
COPY . .

ENV PATH=/root/.local/bin:$PATH
ENV PYTHONUNBUFFERED=1

EXPOSE 8000

# Fire up the asynchronous Uvicorn cluster server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]