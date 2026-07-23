# Architecture

## Overview

Marketplace Platform Evolution consists of several architectural generations operating together rather than replacing one another. Legacy enterprise systems continue to provide core business capabilities while modern cloud-native services, distributed APIs, and AI-enabled workflows extend the platform incrementally.

The architecture is organized into six logical layers:

1. Legacy Enterprise Systems
2. Integration Layer
3. Event Platform
4. Cloud Services
5. Experience Layer
6. Business & AI Platform

---

# High-Level Architecture

```text
                                      Marketplace Platform
══════════════════════════════════════════════════════════════════════════════

                              CUSTOMER EXPERIENCE

 ┌─────────────────────────────────────────────────────────────────────────┐
 │ Micro Frontends                                                        │
 │ React • Svelte • Stencil • Pattern Library                             │
 └─────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
 ┌─────────────────────────────────────────────────────────────────────────┐
 │ Vehicle Detail Page                                                    │
 │ Dealer Operating System                                                │
 │ Authentication UI                                                      │
 └─────────────────────────────────────────────────────────────────────────┘

══════════════════════════════════════════════════════════════════════════════

                              EXPERIENCE LAYER

 ┌─────────────────────────────────────────────────────────────────────────┐
 │ Vehicle Detail Platform (BFF)                                          │
 │                                                                         │
 │ • API Aggregation                                                      │
 │ • Request Orchestration                                                 │
 │ • Frontend Optimized Responses                                          │
 │ • Distributed Service Composition                                       │
 └─────────────────────────────────────────────────────────────────────────┘
                                   │
      ┌──────────────┬───────────────┬───────────────┬──────────────┐
      ▼              ▼               ▼               ▼

 FutureStack      IAM Service     User Platform     Dealer Services
 (.NET APIs)

══════════════════════════════════════════════════════════════════════════════

                             CLOUD PLATFORM

 ┌─────────────────────────────────────────────────────────────────────────┐
 │ FutureStack (.NET)                                                     │
 │                                                                         │
 │ • Modern APIs                                                          │
 │ • Business Services                                                    │
 │ • Pulsar Producers / Consumers                                         │
 └─────────────────────────────────────────────────────────────────────────┘

                ▲                               ▲

                │                               │

 ┌─────────────────────────────┐     ┌────────────────────────────────────┐
 │ Lambda Microservices         │     │ Shared Platform Services           │
 │                             │     │ IAM                               │
 │ Node.js                     │     │ Login Hub                         │
 │ AWS Lambda                  │     │ User Profiles                     │
 │ Domain Services             │     │ Shared APIs                       │
 └─────────────────────────────┘     └────────────────────────────────────┘

══════════════════════════════════════════════════════════════════════════════

                            EVENT PLATFORM

                  ┌──────────────────────────────┐
                  │ Apache Pulsar                │
                  │ FutureStack Messaging        │
                  └──────────────────────────────┘

                              ▲

                  ┌──────────────────────────────┐
                  │ Amazon Kinesis               │
                  │ NewWave Event Streams        │
                  └──────────────────────────────┘

══════════════════════════════════════════════════════════════════════════════

                           INTEGRATION LAYER

 ┌─────────────────────────────────────────────────────────────────────────┐
 │ Classic Integration                                                    │
 │                                                                         │
 │ • Consume Oracle Events                                                │
 │ • Transform Messages                                                   │
 │ • Route Events                                                         │
 │ • Fan-out to Kinesis                                                   │
 │ • Preserve Legacy Compatibility                                        │
 └─────────────────────────────────────────────────────────────────────────┘
                                   ▲
                                   │
                         Oracle GoldenGate

══════════════════════════════════════════════════════════════════════════════

                           LEGACY ENTERPRISE

 ┌─────────────────────────────────────────────────────────────────────────┐
 │ Oracle Database                                                        │
 │                                                                         │
 │ Vehicle Data                                                           │
 │ Auctions                                                               │
 │ Bidding                                                                │
 │ Sales                                                                  │
 │ Dealer Operations                                                      │
 │ Authentication                                                         │
 └─────────────────────────────────────────────────────────────────────────┘

                    Java Enterprise Applications

══════════════════════════════════════════════════════════════════════════════

                          AI PLATFORM (Latest)

                 Upload Anything
                        │
                        ▼
                 LLM Processing
                        │
                        ▼
                 Guardlane
                        │
                        ▼
            Production AI Moderation
```

---

# Architectural Layers

## 1. Legacy Enterprise

The legacy layer remains the system of record for marketplace operations.

Responsibilities include:

- Vehicle lifecycle
- Auctions
- Bidding
- Sales
- Dealer management
- Business events

Oracle GoldenGate continuously publishes changes from this environment.

---

## 2. Integration Layer

Classic Integration acts as the architectural bridge between legacy Oracle systems and modern cloud-native services.

Responsibilities:

- Consume hundreds of event types
- Transform legacy payloads
- Route events
- Publish to Kinesis
- Preserve backward compatibility

This layer isolates downstream services from Oracle implementation details.

---

## 3. Event Platform

The platform evolved across two messaging generations.

### NewWave

- Amazon Kinesis
- Lambda consumers
- Event fan-out
- Domain streams

### FutureStack

- Apache Pulsar
- Modern event processing
- .NET ecosystem

Asynchronous messaging allows services to evolve independently while reducing coupling.

---

## 4. Cloud Platform

Cloud services provide independently deployable business capabilities.

Major domains include:

- Identity
- User management
- Dealer services
- Marketplace APIs
- Authentication
- Shared platform services

These services communicate primarily through APIs and asynchronous events.

---

## 5. Experience Layer

The experience layer shields frontend applications from backend complexity.

Vehicle Detail Platform (BFF) aggregates data from multiple services and exposes a simplified contract to the UI.

Responsibilities include:

- API orchestration
- Parallel service calls
- Response aggregation
- Error handling
- Frontend optimization

Micro Frontends built with React, Svelte, and Stencil consume these APIs while sharing a common Pattern Library.

---

## 6. AI Platform

AI capabilities extend existing business workflows rather than replacing them.

Representative systems include:

- Upload Anything
- Guardlane
- LLM-assisted processing
- Production AI moderation

AI services integrate into existing dealer workflows through APIs and event-driven communication.

---

# Cross-Cutting Concerns

Every architectural layer shares common engineering responsibilities.

## Authentication

Identity services centralize authentication and authorization.

## Event-Driven Communication

Business events propagate asynchronously between services.

## Observability

Distributed services expose logs, metrics, and traces for production monitoring.

## Continuous Delivery

Independent deployment pipelines enable rapid delivery without requiring platform-wide releases.

## Backward Compatibility

Legacy and modern systems coexist through stable contracts and integration boundaries.

---

# Architectural Principles

### Evolution over replacement

Enterprise platforms should evolve incrementally instead of relying on large-scale rewrites.

### Loose coupling

Services communicate through APIs and events, minimizing direct dependencies.

### Independent ownership

Clear service boundaries allow engineering teams to deliver independently.

### Experience-first APIs

Backend-for-Frontend services optimize distributed systems for frontend consumers.

### Integration as architecture

Integration services are first-class architectural components rather than temporary migration code.

### Production-first engineering

Every modernization decision must preserve business continuity and operational reliability.

---

# Closing Reflection

The Marketplace Platform architecture represents multiple generations of engineering working together.

Legacy Oracle systems continue to power critical business operations, while cloud-native services, distributed APIs, modern user experiences, and AI capabilities progressively extend the platform.

The defining architectural achievement is not that legacy technology disappeared, but that successive generations were introduced safely, allowing the business to continue operating while the platform evolved.
