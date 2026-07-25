# Verily Technical Depth

This is a review map, not a claim that every technology has been used at the same depth.

For every topic, distinguish:

```text
Used directly
Understood through adjacent experience
Learning for the target role
```

## Priority 1 — Must Be Defensible

### Java

- collections and complexity
- immutability
- equality and hashing
- exceptions
- concurrency fundamentals
- thread pools and futures
- JVM memory and garbage collection concepts
- testing and dependency injection
- API and service design

### Node.js and TypeScript

- event loop
- promises and async/await
- CPU-bound versus I/O-bound work
- error propagation
- streams and backpressure
- module and package boundaries
- runtime validation versus static types
- API testing

### React

- render cycle
- state and derived state
- hooks and dependency arrays
- context
- component boundaries
- memoization
- list keys
- error boundaries
- data fetching
- accessibility
- performance diagnosis

### APIs and Distributed Systems

- REST semantics
- idempotency
- pagination
- versioning
- retries and timeouts
- circuit breakers
- eventual consistency
- duplicate and out-of-order events
- schema evolution
- caching
- rate limiting

### SQL and Data

- indexes
- query plans
- transactions
- isolation levels
- normalization and denormalization
- optimistic and pessimistic concurrency
- pagination
- migrations

## Priority 2 — Platform Roles

### Kubernetes

- pod, deployment, service, ingress
- requests and limits
- readiness and liveness
- config maps and secrets
- rolling deployment
- autoscaling
- service discovery
- namespaces and RBAC
- debugging an unhealthy workload

### Terraform

- providers and resources
- state
- remote backends and locking
- modules
- plan and apply
- drift
- lifecycle behavior
- imports
- secrets
- environment strategy
- safe changes and review

Be ready with one real example:

```text
Problem
Terraform boundary
State and environment model
Review and deployment path
Failure or rollback strategy
```

### ArgoCD and GitOps

- desired state
- reconciliation
- application health
- sync and rollback
- drift
- promotion between environments
- relationship with CI

### GCP

Map known AWS concepts to GCP without claiming they are identical:

| Capability | AWS Example | GCP Example |
| --- | --- | --- |
| Object storage | S3 | Cloud Storage |
| Serverless compute | Lambda | Cloud Functions / Cloud Run |
| Containers | EKS / ECS | GKE / Cloud Run |
| Messaging | SNS / SQS / Kinesis | Pub/Sub |
| Analytics warehouse | Redshift | BigQuery |
| Identity | IAM | Cloud IAM |
| Monitoring | CloudWatch | Cloud Monitoring and Logging |

Prepare a direct GCP project example covering architecture, deployment, access, and operations.

### Developer Platform

- platform as a product
- internal developers as customers
- golden paths
- service templates
- developer portals
- ownership catalogs
- self-service infrastructure
- guardrails
- adoption metrics
- platform SLOs

## Priority 3 — Healthcare and Security

### HIPAA-Aware Engineering

Be able to discuss:

- minimum necessary access
- least privilege
- encryption in transit and at rest
- auditability
- access review and revocation
- data retention
- secrets
- non-production data
- incident handling
- third-party dependencies

Do not claim organizational compliance ownership unless that was the actual responsibility.

### Identity and Access Management

- authentication versus authorization
- OAuth 2.0
- OpenID Connect
- SAML concepts
- RBAC and ABAC
- organization and tenant boundaries
- token expiry and revocation
- service identities
- policy decision and enforcement points
- immutable audit events

### FHIR

Discussion-level preparation:

- resource-oriented healthcare data standard
- common resources such as Patient, Observation, Encounter, and Practitioner
- references between resources
- validation
- profiles and implementation guides
- search and version history
- why interoperability does not eliminate source-data ambiguity

### Data Pipelines

- ETL versus ELT
- batch versus streaming
- event time versus processing time
- late data
- replay
- idempotent processing
- dead-letter handling
- schema evolution
- lineage
- data-quality monitoring

### Apache Beam and BigQuery

Know:

- Beam as a unified batch and streaming programming model
- pipeline, transform, PCollection, window, and trigger concepts
- BigQuery as an analytical warehouse
- partitioning and clustering concepts
- separation of operational and analytical workloads

## Priority 4 — Full-Stack Tooling

### Go Orientation

Do not switch interview-coding languages solely for the job description. Use Java for algorithm interviews unless Go is already equally fluent.

Build enough Go literacy to discuss and read team code:

- packages and exported names
- structs and methods
- interfaces and implicit implementation
- slices and maps
- pointers
- explicit error handling
- goroutines and channels
- context cancellation and deadlines
- testing
- HTTP services

State the experience level accurately. Java, C#, Node.js, Python, distributed systems, and API design are transferable evidence; they are not evidence of production Go experience.

### Microfrontends

- ownership boundaries
- shell responsibilities
- runtime and build-time integration
- shared dependencies
- independent deployment
- contract testing
- observability
- design-system governance

### NX

Know its purpose:

- monorepo organization
- project graph
- task orchestration
- affected builds and tests
- shared tooling

### single-spa

Know its purpose:

- registering independent frontend applications
- activation by route or condition
- lifecycle methods
- runtime composition

### Webpack and Package Management

- entry, output, loader, plugin, chunk
- code splitting
- tree shaking
- source maps
- dependency locking
- npm versus pnpm workspace concepts

### Cypress and Testing

- unit versus integration versus end-to-end
- test pyramid and practical trade-offs
- stable selectors
- avoiding timing-dependent tests
- contract tests
- BDD as communication, not only syntax

## Priority 5 — Production AI

- training, validation, and test separation
- precision, recall, and class imbalance
- model and dataset versioning
- deployment strategies
- shadow and canary evaluation
- drift
- human review
- fallbacks
- auditability
- cost and latency
- model output versus business policy

Use Guardlane as the primary evidence.

## Technical Answer Structure

For “How does X work?”:

```text
Definition
Core mechanism
When it is useful
Trade-off
Production example
```

For “Have you used X?”:

```text
Direct level of experience
Specific task
Decision or problem
Operational outcome
Remaining limitation
```

For an unfamiliar technology:

> I have not operated that technology directly at the same depth. I understand that it solves X through Y. The closest system I have used is Z, where the comparable concern was A. I would validate B before making the design decision.

That is stronger than bluffing and stronger than stopping at “I don’t know.”

## Rapid-Fire Question Bank

1. What makes an operation idempotent?
2. How do you prevent retry storms?
3. What is the difference between readiness and liveness?
4. How does Terraform state locking help?
5. What happens when ArgoCD detects drift?
6. RBAC versus ABAC?
7. How would you revoke access quickly across distributed services?
8. How do React keys affect reconciliation?
9. When does memoization make React slower?
10. Why can Node.js still suffer from blocked execution?
11. When would you use a queue instead of a stream?
12. How do database isolation levels affect correctness?
13. What is eventual consistency acceptable for?
14. How do you evolve an event schema?
15. What belongs in an audit event?
16. How do you keep PHI out of application logs?
17. What problem does FHIR address?
18. Batch versus streaming ingestion?
19. How would you measure an internal developer platform?
20. How do you roll back an infrastructure change?
