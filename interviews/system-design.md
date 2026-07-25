# Senior System Design

A senior system-design interview evaluates how the candidate manages ambiguity, makes trade-offs, and takes responsibility for production behavior.

The diagram is evidence of the reasoning. It is not the objective by itself.

## Forty-Five-Minute Structure

### 0–5 Minutes — Clarify Scope

Identify:

- primary users
- core use cases
- explicit exclusions
- sensitive operations
- expected scale
- availability and latency expectations
- consistency requirements
- compliance constraints

Do not begin drawing until the system boundary is clear.

### 5–10 Minutes — Define Contracts and Data

Describe:

- major APIs or events
- primary entities
- ownership of each entity
- identifiers
- important state transitions
- data-retention requirements

### 10–20 Minutes — Draw the High-Level System

Start with the critical flow:

```text
Client
    ↓
Edge and identity
    ↓
Application service
    ↓
Primary data path
    ↓
Asynchronous work
    ↓
Operations and audit
```

Only add a component when it has a clear responsibility.

### 20–32 Minutes — Deep Dive

Choose the area with the greatest technical or business risk.

Examples:

- authorization evaluation
- data ingestion and validation
- deployment orchestration
- event processing
- tenant isolation
- search indexing
- model evaluation

### 32–40 Minutes — Production Reality

Cover:

- failure modes
- timeouts and retries
- idempotency
- backpressure
- observability
- deployment and rollback
- regional failure
- security and abuse
- data recovery

### 40–45 Minutes — Trade-offs and Evolution

Close with:

- the most important compromise
- what would fail first
- how the system would evolve at 10× scale
- what would be measured
- what remains uncertain

## Requirements Checklist

### Functional

- What must the system do?
- Which workflows change data?
- Which workflows are read-heavy?
- Which operations require approval or review?

### Non-Functional

- availability
- latency
- throughput
- durability
- consistency
- privacy and security
- auditability
- recovery objectives
- cost

## Back-of-the-Envelope Estimation

Estimate only what influences a decision.

Useful calculations:

```text
Requests per second =
daily requests ÷ 86,400 × peak factor

Storage per day =
records per day × average record size

Concurrent users =
active sessions × requests per session window

Consumer capacity =
partitions × processing rate per partition
```

State assumptions explicitly. Approximate reasoning is more useful than false precision.

## Cross-Cutting Senior Topics

### APIs

- stable contracts
- pagination
- idempotency keys
- versioning
- rate limits
- error semantics

### Data

- system of record
- indexing and derived views
- schema evolution
- retention
- backup and restore
- lineage

### Distributed Systems

- duplicate delivery
- ordering
- eventual consistency
- retries and retry storms
- split-brain or regional failure
- reconciliation

### Security

- authentication
- authorization
- least privilege
- tenant isolation
- encryption
- secrets
- audit logs
- privileged operations

### Operations

- SLOs
- logs, metrics, and traces
- alert quality
- deployment strategy
- rollback
- incident ownership
- capacity and cost

## Verily Design 1 — Workbench Identity and Accounts

### Prompt

Design the user and account-management platform for a collaborative research environment that handles sensitive health data.

### Core Entities

- user
- organization
- workspace
- group
- role
- permission
- membership
- access request
- audit event

### Questions to Resolve

- Can one user belong to multiple organizations?
- Are permissions workspace-specific?
- Is access inherited through groups?
- Which operations require approval?
- How quickly must revoked access disappear?
- Are external identity providers supported?
- Which audit records are immutable?

### Expected Design Topics

- OIDC or SAML identity federation
- session and token lifecycle
- RBAC plus selected ABAC conditions
- policy decision and enforcement points
- tenant-aware data access
- asynchronous provisioning
- immutable audit trail
- break-glass access
- access reviews and expiry
- HIPAA-sensitive logging

### Critical Failure Modes

- revoked user retains cached authorization
- group change is applied inconsistently
- audit event is lost
- identity provider is unavailable
- cross-tenant identifier leaks data
- retry duplicates a provisioning operation

## Verily Design 2 — Precision-Health Data Platform

### Prompt

Design a platform that ingests clinical, device, and research data and makes governed datasets available for analysis.

### Expected Design Topics

- batch and streaming ingestion
- source adapters
- schema validation
- normalization
- FHIR-aware representation
- raw, validated, and curated data zones
- lineage and provenance
- de-identification
- data-quality rules
- research workspace access
- orchestration and replay

### Critical Trade-offs

- canonical model versus source fidelity
- immediate availability versus validation depth
- mutable corrections versus immutable history
- centralized governance versus researcher flexibility

### Critical Failure Modes

- malformed source data
- duplicate ingestion
- late-arriving data
- partial pipeline completion
- incorrect patient or subject linkage
- transformation-version drift
- unauthorized dataset access

## Verily Design 3 — Developer Platform

### Prompt

Design a cloud-native developer platform that supports the end-to-end software lifecycle for more than 600 engineers.

### Main Capabilities

- developer portal
- service templates
- repository creation
- CI pipelines
- environment provisioning
- deployment
- secrets and identity
- observability defaults
- ownership catalog
- policy enforcement

### Expected Design Topics

- Backstage as portal and catalog
- GitHub Actions for CI
- Terraform for infrastructure
- Kubernetes runtime
- ArgoCD and GitOps for deployment
- golden paths with escape hatches
- reusable platform APIs
- tenant and environment isolation
- platform telemetry
- versioned templates

### Success Measures

- time to create a deployable service
- deployment frequency
- change-failure rate
- time to restore
- platform adoption
- support burden
- policy compliance

### Critical Failure Modes

- faulty template affects many teams
- platform outage blocks delivery
- drift develops between Git and runtime
- excessive standardization blocks valid use cases
- credentials leak through pipelines
- shared cluster failure creates broad impact

## Verily Design 4 — Microfrontend Platform

### Prompt

Design an application platform that allows multiple teams to deliver React experiences independently while maintaining a coherent product.

### Expected Design Topics

- shell and microfrontend ownership
- routing
- shared authentication
- shared design system
- dependency strategy
- runtime versus build-time integration
- contract testing
- asset hosting and caching
- independent release and rollback
- frontend observability

### Critical Trade-offs

- repository autonomy versus consistency
- shared dependencies versus version independence
- runtime composition versus operational complexity
- local team speed versus global user experience

### Critical Failure Modes

- incompatible shared dependency
- one microfrontend breaks the shell
- stale cached asset
- authentication state diverges
- independent releases create UI inconsistency

## Existing Designs to Rehearse

- Marketplace modernization
- Vehicle Detail BFF
- Guardlane
- AI Upload
- Enterprise search
- Promotion engine

Use the linked project guides for factual evidence, but apply the general interview structure in this document.

## Communication Prompts

Use these phrases naturally:

- “Before choosing the storage model, I want to clarify the consistency requirement.”
- “I’m treating this component as the system of record because…”
- “The benefit is X; the operational cost is Y.”
- “At the current scale I would start with…, and introduce… when this metric crosses…”
- “The highest-risk failure path is…”
- “I have used an analogous approach in…, although this part is a proposed design.”

## System-Design Readiness Rubric

Score each category from 0 to 3:

| Category | 0 | 1 | 2 | 3 |
| --- | --- | --- | --- | --- |
| Requirements | skipped | shallow | core scope clear | priorities and exclusions explicit |
| Architecture | incoherent | components listed | critical flow works | boundaries and ownership are clear |
| Data and APIs | absent | named only | reasonable contracts | lifecycle and evolution addressed |
| Scale | absent | generic | useful estimates | estimates drive decisions |
| Reliability | absent | retries only | major failures covered | degradation and recovery designed |
| Security | absent | authentication only | authorization and isolation | audit, abuse, and privileged paths |
| Operations | absent | monitoring named | SLOs and telemetry | rollout, rollback, capacity, and cost |
| Trade-offs | none | superficial | alternatives compared | evolution path and decision triggers |
| Communication | hard to follow | reactive | structured | concise, collaborative, and adaptive |

A strong senior performance averages at least 2, with no zero in security, reliability, trade-offs, or communication.
