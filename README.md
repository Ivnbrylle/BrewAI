# ☕ BrewAI: Cloud-Native AI Coffee Shop Platform

BrewAI is a prototype cloud-native web application featuring a transactional AI Agent capable of orchestrating coffee orders and resolving customer questions using Retrieval-Augmented Generation (RAG). 

Designed with a **local-first, containerized development approach**, the system architecture strictly isolates infrastructure configurations from application layers using a decoupled modular pattern.

---

## 🏗️ Architectural Core Design Decisions

### 🤖 1. The Intercepted Conversational State Machine
To focus purely on asynchronous AI transactional capabilities while keeping infrastructure footprints zero-cost, BrewAI bypasses a live, third-party payment gateway module. Instead, it utilizes a custom **Simulated Checkout Pattern** (`POST /orders/confirm`). 
* The AI Agent dynamically maps conversational user intents directly onto backend transactional tools (`POST /orders`, `PUT /orders/{order_id}/items`).
* Once a checkout intent is confirmed, the state machine securely shifts state flags from `PENDING` to `CONFIRMED`, immediately routing the payload to the internal admin terminal dashboard.

### 🗄️ 2. High-Integrity Relational Schema Design
The PostgreSQL relational engine leverages strict constraints to handle state transitions safely:
* **Integer Currency Pattern:** Prices are captured entirely as `price_cents` (integers) instead of floats to completely prevent floating-point inaccuracies during summation.
* **Cascading Lifecycles:** Child items use `ON DELETE CASCADE` to clean up automatically if an active draft basket is deleted, eliminating orphaned rows.
* **Purchase Snapshots:** Order details store `price_at_purchase_cents` independently of the core menu table to protect historical tracking records against future price changes.

### 🏗️ 3. Decoupled Infrastructure as Code (IaC)
Following cloud architecture best practices, the `terraform/` topology is completely independent of the application logic blocks:
* Provisions a highly available multi-AZ network matrix splitting public ingress tiers (ALB layout) from private compute spaces.
* Isolates the application runtime environment so that system variables are injected exclusively during task orchestration.

---

## 📂 System Topology Map

```text
brewai/
├── app/
│   ├── frontend/        # Next.js 14 App Router User Interface
│   │   ├── app/         # Layout specifications & home view router
│   │   ├── components/  # Floating AI Assistant overlay component
│   │   └── Dockerfile   # Multi-stage optimized Node distribution layer
│   ├── backend/         # FastAPI Microservice
│   │   ├── main.py      # Core operational endpoints & mock state engine
│   │   ├── models.py    # Pydantic data contract validation layer
│   │   ├── schema.sql   # Normalized PostgreSQL relational design script
│   │   └── Dockerfile   # Lean Python multi-stage runtime build file
│   └── ai/              # AI Orchestration Module
│       ├── agent.py     # Intent router loop & local RAG search module
│       └── knowledge_base.json # Raw context store for allergen & menu indexing
├── terraform/           # Decoupled Infrastructure Configuration
│   ├── main.tf          # Core AWS VPC topology & network routing layouts
│   ├── variables.tf     # Configurable infrastructure environment entries
│   └── outputs.tf       # Exported resource strings for pipeline tracking
└── docker-compose.yml   # Multi-container offline orchestration setup