# PHOTON — 4-Sprint Folder-Wise Development & File Responsibility Plan

**Project:** EPAM PHOTON  
**Purpose:** One clear repository plan showing what belongs to each sprint, which folders/files are introduced, what every important file does, and what the team should implement now in Sprint 1.

---

## 1. Architecture decisions

This plan follows the uploaded `PHOTON_Repository_Structure.md` and the previously agreed implementation direction:

- Keep **one modular Python backend**. Do not split it into microservices for these sprints.
- Keep the browser demo inside `backend/app/static/` and serve it with the backend.
- Use **NetworkX `DiGraph`** for the Sprint 1 dependency graph unless the project formally changes this decision.
- Keep one approved, canonical scenario dataset at `data/raw/scenario_dataset.json`.
- Keep graph construction, disruption simulation, recovery optimization, and audit functionality in separate modules.
- Build only the files required for the current sprint. The later-sprint folders below are planned additions, not a reason to create empty files now.
- Preserve the backend framework and working entry point already present in the repository. Do not migrate Flask/FastAPI or replace a working application without team approval and tests.

### Important distinction: target structure vs current implementation

The folder tree in this document is the **target development structure**. The uploaded repository structure describes the intended architecture; it does not prove that every listed file has already been created or implemented. Before creating a file, check the repository and reuse or extend an existing equivalent. Do not create duplicate modules just because a suggested path differs from the current implementation.

---

## 2. Four-sprint roadmap at a glance

| Sprint | Name | Main outcome | Main folders |
|---|---|---|---|
| **Sprint 1** | Supply Chain Graph & Scenario Generator | Load the scenario, build and validate the directed graph, trace downstream dependencies, expose APIs and a basic browser demo. | `data/`, `models/`, `schemas/`, `graph/`, `validation/`, `services/`, `api/`, `benchmarks/`, `static/`, `tests/` |
| **Sprint 2** | Ripple Simulation & Intervention Window | Apply disruptions, propagate their effects through the existing graph, identify affected orders and calculate intervention windows. | `models/`, `schemas/`, `simulation/`, `services/`, `api/`, `tests/` |
| **Sprint 3** | OR-Tools Recovery Action Engine | Generate feasible recovery actions and rank/optimize them under cost, time and capacity constraints. | `models/`, `schemas/`, `optimization/`, `services/`, `api/`, `tests/` |
| **Sprint 4** | Operational Control Tower & Audit Dossier | Present operational status and recommendations, support human approval, and maintain a persistent audit trail. | `models/`, `schemas/`, `audit/`, `services/`, `api/`, `static/`, `tests/` |

### Dependency between sprints

```text
SPRINT 1                         SPRINT 2
Canonical data                   Existing validated graph
      ↓                                  ↓
Graph + BFS + validation  ───→  Disruption simulation
      ↓                                  ↓
Graph / traversal APIs              Ripple impact + intervention window
      │                                  │
      └──────────────────┬───────────────┘
                         ↓
                    SPRINT 3
              OR-Tools recovery engine
                         ↓
                    SPRINT 4
           Control tower + approvals + audit
```

Sprint 2 reuses the graph and traversal foundations from Sprint 1. Sprint 3 consumes disruption/impact information from Sprint 2. Sprint 4 integrates the outputs of the earlier sprints into an operational workflow.

---

# 3. Sprint 1 — Supply Chain Graph & Scenario Generator

<sub>Current development focus</sub>

## 3.1 Sprint 1 objective

Build the foundation of PHOTON's supply-chain dependency engine:

1. Read the approved scenario dataset.
2. Normalize and validate the input data.
3. Represent suppliers, BOM parts, finished products and customer orders.
4. Build a directed NetworkX graph.
5. Trace downstream dependencies from a selected node/supplier using the agreed traversal algorithm (BFS where specified).
6. Expose graph, traversal and validation through backend APIs.
7. Show the graph/scenario and traversal result in the static browser demo.
8. Test correctness and measure performance.

### Sprint 1 baseline scenario

The repository plan specifies this baseline:

- 2 suppliers
- 5 BOM parts
- 2 finished products
- 10 customer orders
- **19 nodes and 21 directed edges**

Required relationship directions:

| Relationship | Direction | Meaning |
|---|---|---|
| `SUPPLIES` | Supplier → BOM Part | A supplier provides a component/part. |
| `USED_IN` | BOM Part → Finished Product | A part is used to manufacture a product. |
| `FULFILLS` | Finished Product → Customer Order | A finished product fulfils an order. |

Use the approved dataset for exact IDs, relationships, quantities, attributes and deadlines. Do not invent missing links or values.

## 3.2 Sprint 1 folder tree — create/use now

```text
PHOTON/
│
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── constants.py
│   │   │   └── exceptions.py
│   │   │
│   │   ├── api/
│   │   │   ├── router.py
│   │   │   └── routes/
│   │   │       ├── health.py
│   │   │       ├── graph.py
│   │   │       ├── traversal.py
│   │   │       ├── validation.py
│   │   │       └── benchmarks.py
│   │   │
│   │   ├── models/
│   │   │   ├── nodes.py
│   │   │   ├── edges.py
│   │   │   └── graph.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── graph.py
│   │   │   ├── traversal.py
│   │   │   └── validation.py
│   │   │
│   │   ├── data/
│   │   │   ├── loader.py
│   │   │   ├── normalizer.py
│   │   │   └── repository.py
│   │   │
│   │   ├── graph/
│   │   │   ├── schema.py
│   │   │   ├── builder.py
│   │   │   ├── traversal.py
│   │   │   └── operations.py
│   │   │
│   │   ├── validation/
│   │   │   ├── graph_validator.py
│   │   │   ├── schema_validator.py
│   │   │   └── edge_validator.py
│   │   │
│   │   ├── services/
│   │   │   ├── graph_service.py
│   │   │   ├── traversal_service.py
│   │   │   ├── validation_service.py
│   │   │   └── benchmark_service.py
│   │   │
│   │   ├── benchmarks/
│   │   │   ├── benchmark_graph.py
│   │   │   ├── benchmark_traversal.py
│   │   │   └── benchmark_results.py
│   │   │
│   │   ├── static/
│   │   │   ├── sprint-1-demo.html
│   │   │   ├── css/
│   │   │   │   └── sprint-1-demo.css
│   │   │   └── js/
│   │   │       └── sprint-1-demo.js
│   │   │
│   │   └── main.py
│   │
│   └── tests/
│       ├── conftest.py
│       ├── unit/
│       │   ├── test_graph.py
│       │   ├── test_traversal.py
│       │   └── test_validation.py
│       ├── integration/
│       │   └── test_api.py
│       └── fixtures/
│           └── sample_scenario.json
│
├── data/
│   ├── raw/
│   │   └── scenario_dataset.json
│   ├── processed/
│   │   └── .gitkeep
│   └── schemas/
│       └── graph_schema.json
│
├── docs/
│   ├── architecture/
│   │   ├── system_architecture.md
│   │   ├── graph_schema.md
│   │   └── data_flow.md
│   ├── api/
│   │   └── api_documentation.md
│   ├── sprint/
│   │   ├── sprint_1.md
│   │   └── sprint_1_demo_guide.md
│   └── reports/
│       ├── mapping_verification.md
│       ├── validation_report.md
│       ├── performance_report.md
│       └── complexity_analysis.md
│
├── scripts/
│   ├── validate_graph.py
│   └── run_benchmarks.py
│
├── README.md
├── pyproject.toml
├── .env.example
├── .gitignore
└── render.yaml
```

> This is a sprint-scoped view of the target tree, not a command to recreate the whole repository. If `main.py`, `app.py`, `api/index.py`, or equivalent entry points already exist, preserve the working entry point and adapt imports/mounting to it.

## 3.3 Sprint 1 — what each folder and file does

### A. `data/` — scenario source and data preparation

| File | Responsibility | Expected output / handoff |
|---|---|---|
| `data/raw/scenario_dataset.json` | Single approved source of truth for the scenario's nodes, edges and attributes. | Input for loader and validation. |
| `data/schemas/graph_schema.json` | Defines required JSON fields, data types and structural rules. | Contract used by schema validation. |
| `backend/app/data/loader.py` | Reads the canonical scenario file and handles file/read errors. | Raw scenario data. |
| `backend/app/data/normalizer.py` | Converts accepted input variations into one consistent internal representation. | Normalized nodes and edges. |
| `backend/app/data/repository.py` | Gives services a consistent way to retrieve the scenario/graph input. Avoid multiple editable copies. | Data access interface. |

### B. `models/` — domain concepts

| File | Responsibility | Example |
|---|---|---|
| `models/nodes.py` | Represents the domain node types and their core attributes. | Supplier, BOM Part, Finished Product, Customer Order. |
| `models/edges.py` | Represents relationships between nodes and their attributes. | `SUPPLIES`, `USED_IN`, `FULFILLS`, source, target. |
| `models/graph.py` | Represents the graph as a domain-level collection/structure of nodes and edges. | A complete scenario graph definition. |

**Keep in mind:** These are domain models. They should not become a second copy of the NetworkX graph algorithm or the API request/response definitions.

### C. `schemas/` — API input/output contracts

| File | Responsibility | Example |
|---|---|---|
| `schemas/graph.py` | Defines the expected graph API request/response structure. | Graph response containing nodes and edges. |
| `schemas/traversal.py` | Defines traversal request/response fields and types. | Request with `node_id` and direction; response with reachable downstream nodes. |
| `schemas/validation.py` | Defines validation request/response structure. | Valid/invalid result, errors and warnings. |

**Difference:** `models/nodes.py` defines what a Supplier node means inside the domain. `schemas/graph.py` defines how graph data is shaped when it enters or leaves an API. Depending on the framework, schemas may use Pydantic or another validation library. Do not duplicate a schema if the current code already has an equivalent contract.

### D. `graph/` — graph engine

| File | Responsibility | Expected handoff |
|---|---|---|
| `graph/schema.py` | Defines graph-specific rules: allowed node/edge types, attributes and relationship expectations. | Rules for builder and validators. |
| `graph/builder.py` | Converts normalized data into a NetworkX directed graph (`DiGraph`). | Built graph for services. |
| `graph/traversal.py` | Implements downstream traversal, using the agreed BFS approach. | Ordered/reachable downstream node results. |
| `graph/operations.py` | Holds reusable graph queries/operations that do not belong to API routes. | Shared graph utilities. |

### E. `validation/` — correctness checks

| File | Responsibility |
|---|---|
| `validation/schema_validator.py` | Checks required fields, types and input structure against the approved schema. |
| `validation/edge_validator.py` | Checks valid edge types, direction rules, and whether source/target node references exist. |
| `validation/graph_validator.py` | Checks graph-level invariants, such as valid node references and expected graph properties. |

Validation rules must come from the agreed schema and acceptance criteria. Avoid hardcoding assumptions that are not present in the approved scenario.

### F. `services/` — use-case coordination

| File | Responsibility |
|---|---|
| `services/graph_service.py` | Coordinates loading, building and retrieving the graph for application use cases. |
| `services/traversal_service.py` | Coordinates a traversal request, calls graph traversal, and prepares the result. |
| `services/validation_service.py` | Runs the relevant validators and combines validation results. |
| `services/benchmark_service.py` | Coordinates benchmark execution/results if the app exposes this capability. |

Services orchestrate modules. Keep the actual graph algorithms in `graph/`, validation rules in `validation/`, and HTTP handling in `api/routes/`.

### G. `api/` — HTTP interface

| File | Responsibility |
|---|---|
| `api/router.py` | Registers/combines the application's route modules. |
| `api/routes/health.py` | Basic health/status endpoint. |
| `api/routes/graph.py` | Exposes graph retrieval or graph-related endpoints. |
| `api/routes/traversal.py` | Exposes downstream dependency traversal. |
| `api/routes/validation.py` | Exposes scenario/graph validation. |
| `api/routes/benchmarks.py` | Exposes benchmark results or controlled benchmark execution, if required. |

Routes should parse/validate the request, call a service, and return a response. They should not contain BFS, graph construction or validation algorithms themselves.

### H. `benchmarks/` and reports

| File | Responsibility |
|---|---|
| `benchmarks/benchmark_graph.py` | Measures graph build and selected graph operations. |
| `benchmarks/benchmark_traversal.py` | Measures downstream traversal performance. |
| `benchmarks/benchmark_results.py` | Structures or exports benchmark results. |
| `docs/reports/mapping_verification.md` | Records whether dataset relationships match the approved mapping. |
| `docs/reports/validation_report.md` | Records validation checks, outcomes and known issues. |
| `docs/reports/performance_report.md` | Records benchmark setup and measured performance. |
| `docs/reports/complexity_analysis.md` | Explains algorithmic time/space complexity. |

The repository plan lists a downstream supplier-tracing target of **under 10 ms**. Treat this as an acceptance target, not a measured result, until the team benchmarks it on a documented environment.

### I. `static/` — Sprint 1 browser demo

| File | Responsibility |
|---|---|
| `static/sprint-1-demo.html` | Page structure and UI elements. |
| `static/css/sprint-1-demo.css` | Layout, typography, colors and responsive styling. |
| `static/js/sprint-1-demo.js` | Calls backend APIs, handles user interactions, and renders graph/traversal/validation results. |

The browser should call the backend APIs. Do not implement a second independent graph engine in JavaScript or maintain a conflicting hardcoded dataset in the UI.

### J. `tests/` — automated verification

| File/folder | Responsibility |
|---|---|
| `tests/conftest.py` | Shared pytest setup and fixtures. |
| `tests/fixtures/sample_scenario.json` | Small controlled input for tests; not a competing production scenario source. |
| `tests/unit/test_graph.py` | Tests graph construction and graph properties. |
| `tests/unit/test_traversal.py` | Tests downstream traversal, including reachable and unreachable cases. |
| `tests/unit/test_validation.py` | Tests schema, edge and graph validation rules. |
| `tests/integration/test_api.py` | Tests API request-to-response flows. |

### K. Root and documentation files

| File | Responsibility |
|---|---|
| `README.md` | Project overview, setup, run instructions and sprint status. |
| `pyproject.toml` | Canonical Python dependencies and project/tool configuration. |
| `.env.example` | Names of required environment variables with safe placeholder values; never commit secrets. |
| `.gitignore` | Excludes virtual environments, caches, secrets and generated artifacts. |
| `render.yaml` | Render deployment configuration, after verifying the actual framework and startup command. |
| `docs/architecture/system_architecture.md` | High-level component architecture. |
| `docs/architecture/graph_schema.md` | Node/edge definitions and graph rules. |
| `docs/architecture/data_flow.md` | Flow from dataset through loader, validation, graph engine and API. |
| `docs/api/api_documentation.md` | API endpoints, payloads, response examples and errors. |
| `docs/sprint/sprint_1.md` | Sprint 1 scope and acceptance criteria. |
| `docs/sprint/sprint_1_demo_guide.md` | Steps to demonstrate Sprint 1. |
| `scripts/validate_graph.py` | Developer command to run scenario/graph validation using application modules. |
| `scripts/run_benchmarks.py` | Developer command to run the agreed benchmark suite. |

## 3.4 Sprint 1 development sequence

Implement and integrate in this order to reduce blocked work:

1. **Agree the contract:** finalize node types, edge types, IDs, required attributes and dataset format.
2. **Prepare canonical data:** complete and review `scenario_dataset.json` and `graph_schema.json`.
3. **Build models and schemas:** agree domain entities and API payload contracts.
4. **Load and normalize data:** implement loader, normalizer and repository.
5. **Build the graph:** construct the NetworkX `DiGraph` and verify node/edge counts.
6. **Implement traversal:** implement and test downstream BFS.
7. **Implement validation:** validate schema, edge direction/references and graph invariants.
8. **Expose services and APIs:** route handlers call services; services call the relevant modules.
9. **Build static demo:** HTML/CSS/JS calls the real backend endpoints.
10. **Test, benchmark and document:** run unit/integration tests, record actual timings and prepare the demo guide.

## 3.5 Sprint 1 team ownership proposal (12 members)

The following mapping preserves the team's previously discussed responsibility split. It is a proposed ownership map; confirm it with the team before treating it as final. Each file should have one primary owner, while others can review or contribute through pull requests.

| Member | Primary ownership | Main deliverable |
|---|---|---|
| **Mishti** | `docs/sprint/sprint_1.md`, acceptance criteria and integration coordination | Scope, task tracking and acceptance sign-off coordination. |
| **Deep** | `backend/app/models/`, `backend/app/schemas/`, `data/schemas/graph_schema.json`, graph contract docs | Node/edge/graph domain definitions and API data contracts. |
| **Anushka** | `data/raw/scenario_dataset.json` | Approved scenario dataset and source-data consistency. |
| **Ansh** | `backend/app/graph/schema.py`, `backend/app/graph/builder.py` | Graph rules and NetworkX graph builder. |
| **Aadee** | `backend/app/data/` | Loader, normalizer and repository/data access. |
| **Preetam** | `backend/app/graph/traversal.py`, `backend/app/services/traversal_service.py` | Downstream BFS and traversal use case. |
| **Sonal** | `docs/reports/mapping_verification.md` | Verify supplier-to-part-to-product-to-order mappings against the dataset. |
| **Soumya** | `backend/app/validation/`, `backend/app/services/validation_service.py` | Schema, edge and graph validation. |
| **Divyanshu** | `tests/unit/test_edge_cases.py` (or equivalent existing test file), `docs/reports/complexity_analysis.md` | Edge-case coverage and complexity analysis. |
| **Shanu** | `backend/tests/` | Unit/integration test coordination and regression checks. |
| **Kanak** | `backend/app/benchmarks/`, `docs/reports/performance_report.md` | Graph/traversal benchmarks and measured performance report. |
| **Sumit** | `README.md`, `docs/api/api_documentation.md`, `docs/sprint/sprint_1_demo_guide.md` | Setup/API documentation and demo instructions. |

**Shared integration work:** API route wiring, service integration, static demo integration and final end-to-end verification must be coordinated across the relevant owners. This plan does not create a separate React/frontend role; the demo is static HTML/CSS/vanilla JavaScript served by the backend.

## 3.6 Sprint 1 definition of done

Sprint 1 should be considered complete only when:

- [ ] The approved dataset loads without manual edits or hidden duplicate copies.
- [ ] The baseline scenario has the expected 19 nodes and 21 directed edges, subject to confirmation against the approved dataset.
- [ ] Relationship types and directions are validated.
- [ ] NetworkX graph construction is repeatable and covered by tests.
- [ ] Downstream traversal works for valid suppliers/nodes and handles missing/isolated nodes correctly.
- [ ] Graph, traversal and validation API contracts are documented and tested.
- [ ] Static HTML demo calls the backend APIs and displays actual responses.
- [ ] Unit and integration tests pass.
- [ ] Performance report records hardware/runtime, dataset, method and measured results; the under-10-ms target is reported as achieved only if measured.
- [ ] README and Sprint 1 demo guide allow another team member to run and demonstrate the project.

---

# 4. Sprint 2 — Ripple Simulation & Intervention Window

## 4.1 Objective

Use the validated Sprint 1 graph to model a disruption (for example, a supplier delay or unavailable supplier), propagate the effect through dependent parts/products/orders, and calculate the intervention window using approved business rules and scenario attributes.

## 4.2 Sprint 2 folder additions

```text
backend/app/
├── models/
│   └── disruption.py
├── schemas/
│   └── disruption.py
├── simulation/
│   ├── __init__.py
│   ├── disruption_simulator.py
│   ├── stockout_propagation.py
│   └── intervention_window.py
├── services/
│   └── disruption_service.py
└── api/routes/
    └── disruptions.py

backend/tests/
├── unit/
│   └── test_simulation.py
└── integration/
    └── test_disruption_workflow.py

docs/
├── sprint/sprint_2.md
└── reports/
    └── simulation_report.md
```

## 4.3 Sprint 2 file responsibilities

| File | Responsibility |
|---|---|
| `models/disruption.py` | Domain representation of a disruption event: affected entity, event type and approved event attributes. |
| `schemas/disruption.py` | API request/response contract for creating a disruption and receiving its impact. |
| `simulation/disruption_simulator.py` | Applies a disruption scenario to the existing graph/data context. |
| `simulation/stockout_propagation.py` | Calculates downstream impact on parts, products and customer orders using approved inventory/lead-time rules. |
| `simulation/intervention_window.py` | Calculates the time remaining to intervene using agreed business rules. |
| `services/disruption_service.py` | Coordinates event validation, simulation, propagation and result preparation. |
| `api/routes/disruptions.py` | Exposes disruption simulation endpoints. |
| `tests/unit/test_simulation.py` | Tests disruption application, propagation and intervention calculations. |
| `tests/integration/test_disruption_workflow.py` | Tests the complete API-to-simulation workflow. |
| `docs/sprint/sprint_2.md` | Scope, rules and acceptance criteria. |
| `docs/reports/simulation_report.md` | Scenario assumptions, test cases and observed simulation results. |

### Sprint 2 output

For a selected disruption, the system should report affected nodes/orders, the propagation path, relevant impact metrics and the calculated intervention window. Do not invent inventory, lead-time or business-rule values; obtain them from the approved scenario/specification.

---

# 5. Sprint 3 — OR-Tools Recovery Action Engine

## 5.1 Objective

Generate candidate recovery actions and use OR-Tools to identify feasible options and rank/optimize them according to approved objectives and constraints.

## 5.2 Sprint 3 folder additions

```text
backend/app/
├── models/
│   └── recovery.py
├── schemas/
│   └── recovery.py
├── optimization/
│   ├── __init__.py
│   ├── recovery_solver.py
│   ├── recovery_actions.py
│   ├── constraints.py
│   └── objective.py
├── services/
│   └── recovery_service.py
└── api/routes/
    └── recovery.py

backend/tests/
└── unit/
    └── test_optimization.py

docs/
├── sprint/sprint_3.md
└── reports/
    └── recovery_optimization_report.md
```

## 5.3 Sprint 3 file responsibilities

| File | Responsibility |
|---|---|
| `models/recovery.py` | Domain representation of a recovery action and its relevant attributes. |
| `schemas/recovery.py` | API request/response structure for recovery planning and recommendations. |
| `optimization/recovery_actions.py` | Defines candidate actions such as alternate sourcing, express freight and order prioritization, where supported by data. |
| `optimization/constraints.py` | Encodes capacity, availability, timing and other approved feasibility constraints. |
| `optimization/objective.py` | Defines the objective/scoring criteria, such as cost and delay, as approved by the project. |
| `optimization/recovery_solver.py` | Builds/runs the OR-Tools model and returns feasible/infeasible outcomes. |
| `services/recovery_service.py` | Connects disruption impact, candidate actions, solver and API response. |
| `api/routes/recovery.py` | Exposes recovery planning/recommendation endpoints. |
| `tests/unit/test_optimization.py` | Tests feasibility, constraints, objective behavior and solver outcomes. |
| `docs/sprint/sprint_3.md` | Sprint scope, assumptions and acceptance criteria. |
| `docs/reports/recovery_optimization_report.md` | Documents model formulation, constraints, objective and measured results. |

### Sprint 3 output

The system should return feasible recovery options, their calculated metrics and a clear explanation of infeasible options. The solver must not present an infeasible action as a recommendation. Cost weights, priorities and capacity values must be approved inputs, not arbitrary assumptions.

---

# 6. Sprint 4 — Operational Control Tower & Audit Dossier

## 6.1 Objective

Integrate graph visibility, disruption impact and recovery recommendations into an operational interface. Add human approval/rejection and a persistent audit history so important decisions can be traced later.

## 6.2 Sprint 4 folder additions

```text
backend/app/
├── models/
│   └── audit.py
├── schemas/
│   └── approval.py
├── services/
│   ├── approval_service.py
│   └── audit_service.py
├── audit/
│   ├── __init__.py
│   ├── audit_logger.py
│   └── audit_repository.py
└── api/routes/
    ├── approvals.py
    └── audit.py

backend/tests/
└── integration/
    └── test_approval_workflow.py

docs/
├── sprint/sprint_4.md
└── reports/
    └── audit_and_control_tower_report.md
```

The existing `backend/app/static/` demo can be expanded into the control-tower interface. Keep its assets in the same backend-served static location unless the architecture is formally changed.

## 6.3 Sprint 4 file responsibilities

| File | Responsibility |
|---|---|
| `models/audit.py` | Domain representation of an audit event/record. |
| `schemas/approval.py` | Approval/rejection request and response contract. |
| `services/approval_service.py` | Coordinates authorization/approval rules and decision handling. |
| `services/audit_service.py` | Coordinates creation and retrieval of audit records. |
| `audit/audit_logger.py` | Records important events such as recommendations, approvals and rejections. |
| `audit/audit_repository.py` | Persists and retrieves audit records using the approved storage mechanism. |
| `api/routes/approvals.py` | Exposes human approval/rejection endpoints. |
| `api/routes/audit.py` | Exposes audit history retrieval. |
| `tests/integration/test_approval_workflow.py` | Tests recommendation-to-decision-to-audit workflow. |
| `docs/sprint/sprint_4.md` | Sprint scope and acceptance criteria. |
| `docs/reports/audit_and_control_tower_report.md` | Documents dashboard, approval flow, persistence and audit verification. |

### Sprint 4 output

The control tower should show relevant graph/disruption/recovery information, allow an authorized human to approve or reject a recommendation, and retain a persistent record of the decision. In-memory-only logs are not sufficient for a durable audit dossier if records must survive restarts.

---

# 7. Complete target repository tree after all four sprints

This is the consolidated target tree. It shows where the project can end up after all four sprints; it is not a requirement to create all files on day one.

```text
PHOTON/
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── constants.py
│   │   │   └── exceptions.py
│   │   ├── api/
│   │   │   ├── router.py
│   │   │   └── routes/
│   │   │       ├── health.py
│   │   │       ├── graph.py
│   │   │       ├── traversal.py
│   │   │       ├── validation.py
│   │   │       ├── benchmarks.py
│   │   │       ├── disruptions.py       # Sprint 2
│   │   │       ├── recovery.py          # Sprint 3
│   │   │       ├── approvals.py         # Sprint 4
│   │   │       └── audit.py             # Sprint 4
│   │   ├── models/
│   │   │   ├── nodes.py                 # Sprint 1
│   │   │   ├── edges.py                 # Sprint 1
│   │   │   ├── graph.py                 # Sprint 1
│   │   │   ├── disruption.py            # Sprint 2
│   │   │   ├── recovery.py              # Sprint 3
│   │   │   └── audit.py                 # Sprint 4
│   │   ├── schemas/
│   │   │   ├── graph.py                 # Sprint 1
│   │   │   ├── traversal.py             # Sprint 1
│   │   │   ├── validation.py            # Sprint 1
│   │   │   ├── disruption.py            # Sprint 2
│   │   │   ├── recovery.py              # Sprint 3
│   │   │   └── approval.py              # Sprint 4
│   │   ├── data/
│   │   │   ├── loader.py                # Sprint 1
│   │   │   ├── normalizer.py            # Sprint 1
│   │   │   └── repository.py            # Sprint 1
│   │   ├── graph/
│   │   │   ├── schema.py                # Sprint 1
│   │   │   ├── builder.py               # Sprint 1
│   │   │   ├── traversal.py             # Sprint 1
│   │   │   └── operations.py            # Sprint 1
│   │   ├── simulation/                  # Sprint 2
│   │   │   ├── disruption_simulator.py
│   │   │   ├── stockout_propagation.py
│   │   │   └── intervention_window.py
│   │   ├── optimization/                # Sprint 3
│   │   │   ├── recovery_solver.py
│   │   │   ├── recovery_actions.py
│   │   │   ├── constraints.py
│   │   │   └── objective.py
│   │   ├── validation/                  # Sprint 1 foundation
│   │   │   ├── graph_validator.py
│   │   │   ├── schema_validator.py
│   │   │   └── edge_validator.py
│   │   ├── services/
│   │   │   ├── graph_service.py         # Sprint 1
│   │   │   ├── traversal_service.py     # Sprint 1
│   │   │   ├── validation_service.py    # Sprint 1
│   │   │   ├── benchmark_service.py     # Sprint 1
│   │   │   ├── disruption_service.py   # Sprint 2
│   │   │   ├── recovery_service.py     # Sprint 3
│   │   │   ├── approval_service.py     # Sprint 4
│   │   │   └── audit_service.py        # Sprint 4
│   │   ├── benchmarks/                  # Sprint 1
│   │   │   ├── benchmark_graph.py
│   │   │   ├── benchmark_traversal.py
│   │   │   └── benchmark_results.py
│   │   ├── audit/                       # Sprint 4
│   │   │   ├── audit_logger.py
│   │   │   └── audit_repository.py
│   │   ├── static/
│   │   │   ├── sprint-1-demo.html       # Sprint 1; evolve in Sprint 4
│   │   │   ├── css/sprint-1-demo.css
│   │   │   └── js/sprint-1-demo.js
│   │   ├── utils/
│   │   │   ├── logging.py
│   │   │   └── helpers.py
│   │   └── main.py
│   └── tests/
│       ├── conftest.py
│       ├── unit/
│       │   ├── test_graph.py
│       │   ├── test_traversal.py
│       │   ├── test_validation.py
│       │   ├── test_simulation.py          # Sprint 2
│       │   └── test_optimization.py        # Sprint 3
│       ├── integration/
│       │   ├── test_api.py
│       │   ├── test_disruption_workflow.py # Sprint 2
│       │   └── test_approval_workflow.py   # Sprint 4
│       └── fixtures/
│           └── sample_scenario.json
├── data/
│   ├── raw/scenario_dataset.json
│   ├── processed/.gitkeep
│   └── schemas/graph_schema.json
├── docs/
│   ├── architecture/
│   │   ├── system_architecture.md
│   │   ├── graph_schema.md
│   │   └── data_flow.md
│   ├── api/api_documentation.md
│   ├── sprint/
│   │   ├── sprint_1.md
│   │   ├── sprint_2.md
│   │   ├── sprint_3.md
│   │   └── sprint_4.md
│   └── reports/
│       ├── mapping_verification.md
│       ├── validation_report.md
│       ├── performance_report.md
│       ├── complexity_analysis.md
│       ├── simulation_report.md
│       ├── recovery_optimization_report.md
│       └── audit_and_control_tower_report.md
├── scripts/
│   ├── validate_graph.py
│   └── run_benchmarks.py
├── .env.example
├── .gitignore
├── README.md
├── pyproject.toml
└── render.yaml
```

---

# 8. Cross-sprint rules and handoffs

| From | Handoff to | Required handoff artifact |
|---|---|---|
| Sprint 1 data owners | Graph builder and validators | Approved canonical JSON + graph schema + mapping verification. |
| Sprint 1 graph/traversal | Sprint 2 simulation | Reusable graph access and tested downstream dependency queries. |
| Sprint 2 simulation | Sprint 3 optimization | Structured disruption impact, affected entities and intervention-window results. |
| Sprint 3 optimization | Sprint 4 control tower | Ranked feasible recovery recommendations with objective metrics and feasibility status. |
| Sprint 4 approval workflow | Audit module | Decision record with actor, timestamp, recommendation reference and decision outcome, subject to approved data policy. |

## Engineering rules for all sprints

1. **One source of truth:** do not keep multiple independently editable copies of the scenario dataset.
2. **One responsibility per layer:** routes handle HTTP; services coordinate use cases; domain modules implement their logic.
3. **Stable contracts:** agree request/response schemas before parallel implementation.
4. **No speculative business rules:** inventory, lead times, capacity, cost and priority rules must come from approved requirements/data.
5. **Backward compatibility:** later sprints should extend Sprint 1 interfaces rather than casually breaking them.
6. **Tests with each feature:** add unit tests with the module and integration tests when connecting layers.
7. **Measured claims only:** distinguish acceptance targets from benchmarked results.
8. **No premature infrastructure:** use NetworkX first; introduce Neo4j or a database only if formally required. Persistent storage should be decided before Sprint 4 audit implementation.
9. **Deployment consistency:** keep backend and static demo in one Render Web Service if that remains the approved deployment design. Confirm the actual framework, entry point, static mount and start command before editing `render.yaml`.
10. **No separate React/Vercel frontend in this plan:** the current agreed demo is HTML/CSS/vanilla JS under `backend/app/static/`, served by the Python backend.

---

# 9. What the team should do right now

For the current Sprint 1, follow this immediate checklist:

- [ ] Inspect the current repository before adding files; mark each suggested file as existing, missing or implemented.
- [ ] Confirm the actual backend framework and current application entry point.
- [ ] Lock the canonical dataset and graph schema.
- [ ] Lock the node/edge/domain model and API request/response contracts.
- [ ] Assign one primary owner to every Sprint 1 file in the ownership table.
- [ ] Implement loader → normalizer → validators → graph builder → traversal.
- [ ] Wire graph/traversal/validation services to the existing API routes.
- [ ] Connect the static demo to real backend endpoints.
- [ ] Run tests and benchmarks; record actual results and environment.
- [ ] Review the Sprint 1 definition of done before calling the sprint complete.

## 9.1 Current implementation status tracker

The supplied repository structure is a target plan, not a live file-system scan. Use this table during the team's repository review; update the status based on actual code and tests.

| Area | Planned Sprint 1 status | What to verify in the repository |
|---|---|---|
| Backend entry point / app setup | Reuse existing | Identify actual `main.py`, `app.py` or serverless entry point; do not create a competing app. |
| Models and schemas | Implement or adapt | Confirm node/edge/graph models and graph/traversal/validation contracts exist and are used. |
| Dataset and data layer | Implement or adapt | Confirm one canonical JSON file and working loader/normalizer/repository. |
| Graph builder | Implement or adapt | Confirm NetworkX `DiGraph` is built from canonical data, not hardcoded duplicate data. |
| Traversal | Implement or adapt | Confirm downstream traversal works and has edge-case tests. |
| Validation | Implement or adapt | Confirm schema, edge direction/reference and graph checks are tested. |
| API routes and services | Implement or adapt | Confirm routes delegate to services and return documented response shapes. |
| Static demo | Implement or adapt | Confirm HTML/CSS/JS is served by backend and calls real APIs. |
| Benchmarks and reports | Measure and document | Confirm reproducible benchmark scripts and actual measurements exist. |
| Tests and documentation | Complete with sprint | Confirm tests pass and README/demo guide match the current implementation. |

**Do not mark a file as completed merely because it exists.** Mark it complete only when its responsibility is implemented, integrated, and tested.

---

# 10. Final recommendation

Use this document as PHOTON's shared four-sprint development map. For day-to-day work, the team should focus only on the current sprint's scope while keeping the planned boundaries stable. Sprint 1 is the foundation: get the dataset, graph contracts, graph builder, traversal, validation, APIs, demo and tests correct before moving into simulation. Sprint 2 should consume that graph; Sprint 3 should consume simulation outputs; Sprint 4 should integrate recommendations, approvals and durable audit history.

**Architecture source:** `PHOTON_Repository_Structure.md` supplied in this conversation. Member-wise ownership is based on the previously discussed team allocation and should be confirmed by the team.
