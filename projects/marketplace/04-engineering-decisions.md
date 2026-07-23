# Engineering Decisions

## Overview

Architecture is shaped as much by constraints and trade-offs as by technology choices.

Marketplace Platform Evolution required decisions that balanced modernization with business continuity, team autonomy, delivery speed, production reliability, and long-term maintainability.

The platform could not be redesigned from a blank slate. Every architectural decision had to account for existing systems, active marketplace operations, dependent teams, and multiple generations of technology operating simultaneously.

This document records the major engineering decisions that enabled the platform to evolve safely.

---

# Decision 1 — Modernize Incrementally Instead of Rewriting the Platform

## Context

The marketplace relied on mature Oracle and Java systems responsible for critical business workflows including vehicle inventory, auctions, bidding, sales, identity, and dealer operations.

These systems were deeply integrated with downstream services and continued to support daily production traffic.

## Decision

Introduce modern capabilities incrementally while preserving the existing platform.

New services would gradually assume responsibilities rather than replacing the legacy system through a single migration.

## Why This Decision Was Made

A large-scale rewrite would have created several risks:

- Extended delivery timelines
- High migration complexity
- Loss of embedded business knowledge
- Difficult production validation
- Disruption to active marketplace operations
- Significant coordination across teams
- Delayed business feature delivery

Incremental modernization allowed the organization to deliver improvements continuously while reducing migration risk.

## Trade-offs

### Benefits

- Lower production risk
- Continuous business delivery
- Easier validation
- Gradual transfer of ownership
- Ability to learn from each migration phase

### Costs

- Multiple architectures coexisting
- Temporary duplication of capabilities
- Additional integration complexity
- Longer overall modernization timeline
- Continued maintenance of legacy systems

## Outcome

The marketplace evolved through NewWave, FutureStack, modern experience services, Dealer Operating System capabilities, and AI-assisted workflows without requiring business operations to stop.

---

# Decision 2 — Keep Oracle as the System of Record During Modernization

## Context

Oracle contained years of operational data and business logic.

Many marketplace processes and downstream integrations depended on its consistency and event generation.

## Decision

Continue using Oracle as the authoritative source for core business data while modern services consumed and extended that data.

## Why This Decision Was Made

Replacing the system of record early would have combined two difficult problems:

1. Changing the application architecture
2. Migrating the authoritative data platform

Separating those concerns reduced risk.

Modern services could be introduced first while the organization retained confidence in existing data integrity and operational workflows.

## Trade-offs

### Benefits

- Preserved trusted business data
- Reduced migration scope
- Maintained compatibility
- Allowed modern services to launch earlier

### Costs

- Continued dependency on a legacy platform
- More complex data synchronization
- Potential event delay
- Need to understand legacy contracts
- Difficulty establishing new domain ownership immediately

## Outcome

Oracle continued supporting critical operations while cloud-native services gradually expanded around it.

---

# Decision 3 — Use an Integration Layer Between Oracle and Cloud Services

## Context

Oracle GoldenGate generated a large number of marketplace events representing vehicles, auctions, bidding, sales, launches, and other business processes.

NewWave services required these events in formats and streams suitable for cloud-native processing.

Directly coupling every downstream service to Oracle events would have exposed legacy details throughout the platform.

## Decision

Create and maintain Classic Integration as a centralized boundary between Oracle-generated events and cloud-native services.

## Responsibilities

Classic Integration would:

- Consume Oracle-originated events
- Interpret legacy schemas
- Transform event payloads
- Route events by business purpose
- Publish to Kinesis streams
- Shield consumers from legacy implementation details

## Why This Decision Was Made

The integration layer acted as an anti-corruption boundary.

It prevented every modern service from needing to understand:

- Oracle schemas
- GoldenGate-specific contracts
- Legacy naming
- Event irregularities
- Historical implementation decisions

## Trade-offs

### Benefits

- Simplified downstream services
- Centralized transformation logic
- Preserved backward compatibility
- Reduced direct coupling
- Created a controlled modernization boundary

### Costs

- Central component with broad responsibility
- Potential operational bottleneck
- Complex routing logic
- High testing burden
- Large blast radius for incorrect transformations

## Outcome

Hundreds of legacy event types could feed domain-oriented cloud services through a more stable and manageable interface.

---

# Decision 4 — Use Event-Driven Communication for Marketplace Changes

## Context

Marketplace activity generates frequent state changes across multiple domains.

Vehicle updates, bids, auctions, sales, launches, user changes, and dealer activity often need to be consumed by several downstream systems.

Synchronous point-to-point communication would have created tight coupling between producers and consumers.

## Decision

Use asynchronous event streams to distribute marketplace changes.

NewWave used Amazon Kinesis, while FutureStack later introduced Apache Pulsar.

## Why This Decision Was Made

Event-driven communication provided:

- Producer and consumer independence
- Scalable event distribution
- Support for multiple downstream consumers
- Reduced synchronous dependencies
- More resilient processing
- Easier introduction of new capabilities

## Trade-offs

### Benefits

- Loose coupling
- Independent scaling
- Event replay possibilities
- Multiple consumers per event
- Better support for distributed ownership

### Costs

- Eventual consistency
- More difficult debugging
- Duplicate delivery considerations
- Ordering challenges
- Schema evolution complexity
- Need for stronger observability

## Outcome

The platform could distribute business changes across independent services without requiring direct service-to-service coordination for every workflow.

---

# Decision 5 — Route Events into Domain-Oriented Streams

## Context

A single stream containing every Oracle event would be difficult to consume, scale, secure, and own.

Different services required different subsets of marketplace activity.

## Decision

Transform and route legacy events into domain-relevant Kinesis streams.

## Why This Decision Was Made

Domain-oriented streams allowed consumers to process only the events relevant to their responsibility.

This improved:

- Service ownership
- Consumer simplicity
- Scaling decisions
- Access control
- Failure isolation
- Operational understanding

## Trade-offs

### Benefits

- Clearer domain boundaries
- Reduced consumer filtering
- Independent scaling
- Better ownership

### Costs

- More routing rules
- More streams to operate
- Risk of inconsistent classification
- Possible event duplication across domains

## Outcome

Lambda services could subscribe to business-relevant event streams without understanding the complete Oracle event ecosystem.

---

# Decision 6 — Use Serverless Services for the First Modernization Wave

## Context

The organization needed to increase development and deployment speed while reducing dependence on large shared applications.

## Decision

Build NewWave services using:

- Node.js
- AWS Lambda
- Amazon Kinesis

## Why This Decision Was Made

Serverless architecture enabled teams to create narrowly scoped, independently deployable services.

It reduced the initial infrastructure burden and supported event-driven workloads naturally.

## Trade-offs

### Benefits

- Rapid service creation
- Independent deployment
- Automatic scaling
- Strong AWS integration
- Lower operational overhead for small services

### Costs

- Cold-start considerations
- Runtime and execution constraints
- Distributed deployment complexity
- Increased number of repositories and functions
- Harder end-to-end debugging
- Potential dependency fragmentation

## Outcome

NewWave increased the organization's ability to deliver domain-specific cloud services without modifying the entire legacy platform.

---

# Decision 7 — Migrate from AWS SDK v2 to v3

## Context

Several foundational Node.js and Lambda services used AWS SDK v2.

The platform needed to remain supported, secure, maintainable, and aligned with the modern AWS JavaScript ecosystem.

## Decision

Migrate critical services from AWS SDK v2 to the modular AWS SDK v3.

## Why This Decision Was Made

SDK v3 provided:

- Modular service clients
- Improved dependency control
- Modern middleware patterns
- Continued ecosystem support
- Better alignment with current AWS development practices

## Engineering Considerations

The migration affected more than import statements.

It required validation of:

- Client initialization
- Credentials and IAM behavior
- Command-based APIs
- Response handling
- Mocking and tests
- Lambda packaging
- Runtime behavior
- Deployment compatibility

## Trade-offs

### Benefits

- Supported SDK version
- Smaller service-specific dependencies
- Improved maintainability
- Modern API conventions

### Costs

- Large migration surface
- Testing effort
- Potential behavioral differences
- Production risk in foundational services

## Outcome

Critical services were modernized while preserving existing platform behavior and production compatibility.

---

# Decision 8 — Introduce FutureStack Rather Than Extending NewWave Indefinitely

## Context

NewWave enabled rapid cloud adoption, but the organization later required a more standardized long-term enterprise platform.

## Decision

Introduce FutureStack using:

- .NET
- Apache Pulsar
- Modern service boundaries
- Standardized APIs

## Why This Decision Was Made

FutureStack represented the next stage of organizational architecture.

It provided a platform aligned with long-term enterprise development, service ownership, messaging standards, and team capabilities.

## Trade-offs

### Benefits

- Stronger standardization
- Modern service conventions
- Long-term platform direction
- Improved domain architecture

### Costs

- Another technology generation
- NewWave and FutureStack coexistence
- Additional developer learning
- More integration boundaries
- Complex service ownership transitions

## Outcome

The organization gained a newer foundation without requiring immediate removal of NewWave services.

---

# Decision 9 — Use a Backend-for-Frontend for the Vehicle Detail Page

## Context

The Vehicle Detail Page required information from numerous independently owned services.

Potential dependencies included:

- Vehicle information
- Auction data
- Pricing
- Media
- Seller information
- Permissions
- Dealer context
- Marketplace state

Allowing the frontend to call every backend directly would have exposed distributed-system complexity to the browser.

## Decision

Create a Vehicle Detail Platform Backend-for-Frontend to aggregate data and provide a frontend-optimized response.

## Responsibilities

The BFF would:

- Call multiple backend services
- Coordinate requests
- Aggregate responses
- Translate backend contracts
- Apply experience-specific logic
- Return a unified frontend model

## Why This Decision Was Made

The BFF simplified the frontend and provided a stable experience-oriented boundary over independently evolving backend services.

## Trade-offs

### Benefits

- Fewer frontend network calls
- Simplified UI logic
- Centralized orchestration
- Backend contract isolation
- Experience-specific optimization

### Costs

- Additional service to operate
- Risk of becoming an aggregation bottleneck
- Dependency on many downstream services
- Partial-failure complexity
- Potential duplication across experiences

## Outcome

The frontend could consume a unified response while backend teams retained independent ownership of their services.

---

# Decision 10 — Execute Independent BFF Calls in Parallel Where Possible

## Context

The BFF depended on multiple services.

Calling independent services sequentially would increase total page latency.

## Decision

Execute independent downstream requests concurrently, while respecting dependencies between calls.

## Why This Decision Was Made

For independent calls, total response time should be closer to the slowest dependency rather than the sum of all dependency times.

```text id="gjk4nr"
Sequential

Vehicle API → Pricing API → Media API → Permissions API

Total latency ≈ sum of all calls


Parallel

          ┌→ Vehicle API
VDP BFF ──┼→ Pricing API
          ├→ Media API
          └→ Permissions API

Total latency ≈ slowest required call
```

## Trade-offs

### Benefits

- Lower response latency
- Better page performance
- Efficient use of asynchronous I/O

### Costs

- More complex error handling
- Increased concurrent load
- Need for downstream timeouts
- Harder trace interpretation
- Potential resource exhaustion if uncontrolled

## Outcome

The BFF could provide richer experiences without making response time proportional to the number of dependencies.

---

# Decision 11 — Support Partial Failure in Aggregated Experiences

## Context

A BFF depending on many services will eventually encounter a slow or unavailable downstream dependency.

Failing the entire page because one non-critical component is unavailable can create a poor customer experience.

## Decision

Differentiate critical and non-critical dependencies where the product contract permits it.

Return partial data for optional sections while failing clearly when essential data is unavailable.

## Why This Decision Was Made

Not every dependency has equal importance.

For example, core vehicle information may be essential, while a secondary recommendation or enrichment may be optional.

## Trade-offs

### Benefits

- Improved availability
- Better user experience
- Reduced impact of isolated service failures

### Costs

- More complex response contracts
- Need to communicate missing data
- Risk of hiding backend degradation
- Additional product decisions about criticality

## Outcome

The experience layer could remain useful during some downstream failures while still exposing operational degradation through monitoring.

---

# Decision 12 — Adopt Micro Frontends for Independent Experience Delivery

## Context

Multiple teams contributed to customer-facing marketplace applications.

A single large frontend could create coordination bottlenecks and tightly coupled release cycles.

## Decision

Use Micro Frontends built with technologies including:

- React
- Svelte
- Stencil

## Why This Decision Was Made

Micro Frontends allowed teams to develop and deploy portions of the experience with greater independence.

## Trade-offs

### Benefits

- Independent team delivery
- Domain-focused ownership
- Smaller application surfaces
- Incremental frontend modernization

### Costs

- Runtime integration complexity
- Dependency duplication
- Inconsistent user experiences
- More complicated local development
- Cross-application state challenges
- Performance overhead if poorly governed

## Outcome

Teams could modernize customer experiences incrementally without replacing the entire frontend simultaneously.

---

# Decision 13 — Build a Shared Pattern Library

## Context

Independent frontend teams and multiple frameworks created a risk of visual and behavioral inconsistency.

Without shared components, every team could implement buttons, forms, typography, spacing, and interaction patterns differently.

## Decision

Use and contribute to a shared Pattern Library built with reusable web components and common design conventions.

## Why This Decision Was Made

A shared library provided consistency while still allowing teams to own their individual applications.

Stencil supported reusable components that could operate across frontend frameworks.

## Trade-offs

### Benefits

- Consistent user experience
- Reduced duplicate implementation
- Shared accessibility patterns
- Faster frontend delivery
- Cross-framework reuse

### Costs

- Version management
- Backward compatibility requirements
- Central governance needs
- Risk of slow adoption
- Shared-library changes can affect many consumers

## Outcome

Modern marketplace applications could share a common design language while remaining independently developed.

---

# Decision 14 — Treat Identity as a Platform Capability

## Context

Authentication, authorization, user profiles, roles, and permissions were needed across many marketplace experiences.

Implementing identity independently within every service would create security and consistency risks.

## Decision

Maintain dedicated IAM, Login Hub, User Information, and Profile capabilities as shared platform services.

## Why This Decision Was Made

Identity is a cross-cutting concern that requires consistent implementation and careful operational management.

## Trade-offs

### Benefits

- Centralized authentication
- Consistent authorization
- Reusable user context
- Better security governance

### Costs

- Shared dependency across services
- High impact of identity incidents
- Complex permission modeling
- Need for backward-compatible contracts

## Outcome

Services and applications could rely on common identity capabilities rather than implementing their own authentication models.

---

# Decision 15 — Transfer Dealer Operating System Ownership to a Small Domain Team

## Context

Once the platform foundation matured, a focused team assumed responsibility for Dealer Operating System capabilities.

The team included a technical lead and two SDE2 engineers.

## Decision

Give the small team end-to-end ownership of dealer-facing capabilities rather than dividing work strictly by frontend or backend layer.

## Why This Decision Was Made

Business-domain ownership reduces handoffs and enables a team to understand complete workflows.

It also allows faster prioritization and delivery within one coherent capability area.

## Trade-offs

### Benefits

- Strong domain knowledge
- Faster decision-making
- End-to-end ownership
- Reduced cross-team handoffs
- Clear accountability

### Costs

- Broad skill requirements
- High responsibility per engineer
- Risk of knowledge concentration
- Competing operational and feature demands

## Outcome

The team delivered six to seven initiatives within approximately three months while assuming responsibility for the domain.

---

# Decision 16 — Integrate AI into Existing Workflows

## Context

AI capabilities such as Upload Anything and Guardlane needed to produce real business value.

A standalone AI demonstration would not be sufficient if it required users to leave their normal workflows or if it bypassed established production controls.

## Decision

Embed AI services into existing dealer and marketplace workflows.

## Why This Decision Was Made

AI is most useful when it improves an existing task rather than becoming an isolated destination.

Integration also allowed the system to reuse:

- Existing authentication
- Business data
- Operational workflows
- Review processes
- Observability
- Deployment infrastructure

## Trade-offs

### Benefits

- Direct business value
- Higher user adoption
- Reuse of existing platform capabilities
- Better workflow continuity

### Costs

- Production reliability expectations
- More complex integration
- AI latency within user workflows
- Need for fallbacks
- Model uncertainty becomes a product concern

## Outcome

AI became an operational capability within the platform instead of remaining an experimental feature.

---

# Decision 17 — Use Guardrails and Human Review for AI Outcomes

## Context

AI systems may generate uncertain, incorrect, or policy-sensitive outputs.

Allowing every model result to proceed automatically would create business and operational risk.

## Decision

Combine model outputs with deterministic checks, confidence-aware handling, observability, and human review where required.

## Why This Decision Was Made

Production AI requires controls beyond model invocation.

The system must account for:

- False positives
- False negatives
- Ambiguous inputs
- Model failures
- Policy changes
- Business exceptions

## Trade-offs

### Benefits

- Safer production behavior
- Better handling of uncertainty
- Reviewable decisions
- Easier model improvement
- Stronger operational trust

### Costs

- Additional workflow complexity
- Human-review effort
- Slower processing for uncertain cases
- More state and audit requirements

## Outcome

AI decisions could be integrated into production while retaining mechanisms for review, correction, and operational accountability.

---

# Decision 18 — Preserve Independent Deployment Across Services

## Context

Large coordinated releases reduce delivery speed and increase deployment risk.

The platform consisted of services owned by several teams and implemented across different technology generations.

## Decision

Maintain independent build and deployment pipelines wherever service boundaries allowed it.

## Why This Decision Was Made

Independent deployment lets teams release changes without waiting for unrelated parts of the platform.

## Trade-offs

### Benefits

- Faster delivery
- Smaller deployment scope
- Easier rollback
- Team autonomy

### Costs

- Contract compatibility requirements
- Pipeline maintenance
- Version coordination
- Environment drift risk
- More operational tooling

## Outcome

Teams could release cloud services, FutureStack APIs, Micro Frontends, and business capabilities independently.

---

# Decision 19 — Preserve Backward Compatibility During Contract Evolution

## Context

Multiple generations of consumers depended on APIs, events, and shared services.

Changing a contract without coordination could break production workflows across team boundaries.

## Decision

Evolve contracts carefully using additive changes, compatibility layers, migration windows, and consumer validation.

## Why This Decision Was Made

The cost of breaking a shared contract is much larger in a distributed platform than in a single application.

## Trade-offs

### Benefits

- Safer releases
- Reduced cross-team disruption
- Gradual consumer migration
- Greater platform stability

### Costs

- Older contract versions remain longer
- Additional implementation complexity
- Temporary duplication
- More extensive testing

## Outcome

New architecture could be introduced without requiring every dependent system to migrate simultaneously.

---

# Decision 20 — Invest in Distributed Observability

## Context

Requests and events crossed multiple systems, including Oracle, integration services, streams, Lambda functions, .NET services, APIs, BFFs, and frontend applications.

Local logs from one service were insufficient to understand end-to-end failures.

## Decision

Use centralized logs, metrics, traces, correlation identifiers, alerts, and service-level monitoring across the distributed platform.

## Why This Decision Was Made

Distributed systems require visibility across boundaries.

Without correlation and tracing, engineers may know that a service failed without knowing:

- Which upstream event initiated the workflow
- Which downstream dependency caused the delay
- Whether the failure affected all users or one request
- Where time was spent
- Whether retries occurred
- Which architecture generation introduced the issue

## Trade-offs

### Benefits

- Faster production diagnosis
- Better dependency visibility
- Measurable latency
- Improved incident response
- Evidence for performance improvements

### Costs

- Instrumentation effort
- Telemetry cost
- Data-volume management
- Need for consistent conventions
- Potential noise without thoughtful dashboards

## Outcome

Engineers could investigate production behavior across service and team boundaries rather than debugging each component in isolation.

---

# Decision-Making Principles

The individual decisions above reflect a consistent engineering approach.

## Preserve Business Continuity

Modernization is successful only when the marketplace continues operating safely.

## Reduce Risk Incrementally

Prefer small, observable changes over large irreversible transitions.

## Separate Systems Through Stable Boundaries

APIs, events, integration layers, and BFFs should isolate different architecture generations and ownership domains.

## Optimize for Team Ownership

Architecture should allow teams to deliver, deploy, and operate capabilities independently.

## Accept Distributed-System Trade-offs Explicitly

Cloud-native architecture improves scalability and autonomy, but introduces eventual consistency, operational complexity, and harder debugging.

## Treat Production Operations as Part of Design

Failure handling, monitoring, compatibility, security, and deployment are architectural concerns rather than post-development tasks.

## Integrate Innovation with Existing Capabilities

New technologies—including AI—produce the most value when they strengthen established workflows and platform foundations.

---

# Closing Reflection

The Marketplace Platform was not shaped by one perfect architecture.

It evolved through a sequence of practical decisions made under real production constraints.

Some decisions introduced temporary complexity so that the organization could reduce operational risk. Others created stable boundaries between legacy and modern systems. Later decisions improved team autonomy, user experience, domain ownership, and AI capability.

The central engineering lesson is that strong architecture is not the pursuit of technical purity.

It is the disciplined management of trade-offs over time.
