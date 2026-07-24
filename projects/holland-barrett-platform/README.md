# Holland & Barrett Platform

## Enterprise Commerce Search Engineering

> A project-specific knowledge base for the Holland & Barrett commerce platform, focused on business context, platform architecture, engineering decisions, production operations, and interview-ready evidence.

---

# Repository Purpose

This repository documents the Holland & Barrett commerce platform as a production system and as an interview/promotion knowledge source.

The goal is to keep the business context, architecture, operating lessons, and engineering impact in distinct documents so each topic can be reused without duplication.

Use the following layers:

- [01 Business Context](./01-business-context.md) for the stable business problem, stakeholders, customer journey, and commercial constraints
- [02 Platform Overview](./02-platform-overview.md) for the system shape and major components
- [03 Search Platform](./03-search-platform.md) for search-specific implementation details
- [04 Architecture](./04-architecture.md) for end-to-end technical structure
- [05 Engineering Decisions](./05-engineering-decisions.md) for trade-offs and alternatives
- [06 Production Engineering](./06-production-engineering.md) for runtime operations and reliability
- [07 Engineering Impact](./07-engineering-impact.md) for personal contributions and outcomes
- [08 Interview Guide](./08-interview-guide.md) for story mapping and interview preparation
- [09 Platform Glossary](./09-platform-glossary.md) for terminology
- [10 Platform Timeline](./10-platform-timeline.md) for evolution over time

---

# What This Repository Is For

This repository should help answer four questions:

- What business problem did the platform solve?
- How did the platform work?
- Why were key engineering decisions made?
- What evidence supports the story for resumes, interviews, and promotion packets?

---

# Scope

This repository is intentionally centered on the online commerce experience.

The platform needed to support:

- product discovery
- search relevance
- browsing and navigation
- promotions
- production reliability
- platform evolution

Broader engineering principles live in [docs/principles.md](../docs/principles.md) and should not be restated here unless they are specific to this platform.

---

# Platform Overview

```text
Customer
│
▼
React Storefront
│
├───────────────┬───────────────┐
│               │               │
▼               ▼               ▼
Marketing Content  Product Search  Browse / Navigation
      │               │
      └───────┬───────┘
              ▼
         Elasticsearch
              │
              ▼
      Commerce Backend Services
              │
      ┌───────┼────────┬────────┐
      ▼       ▼        ▼        ▼
   Catalog  Pricing  Inventory  Promotions
```

---

# Primary Technologies

Frontend

- React

Backend

- .NET
- Node.js

Search

- Elasticsearch
- OneSearch

Business Rules

- ANTLR4
- Promotion DSL

Cloud

- AWS

Development

- Git
- CI/CD
- Production Monitoring

---

# My Engineering Contributions

Primary ownership areas included:

- OneSearch platform
- Elasticsearch integration
- Search APIs
- Promotion Engine
- ANTLR grammar enhancements
- Backend API development
- React commerce features
- Production issue investigation
- Legacy search modernization

These responsibilities are expanded in the technical sections, with outcomes and evidence captured in [07 Engineering Impact](./07-engineering-impact.md) and [08 Interview Guide](./08-interview-guide.md).

---

# Repository Structure

The numbered documents follow the same progression as the system itself:

1. Business context
1. Platform overview
1. Search platform
1. Architecture
1. Engineering decisions
1. Production engineering
1. Engineering impact
1. Interview guide
1. Glossary
1. Timeline

---

# Learning Objectives

After completing this repository, the reader should understand:

- Enterprise commerce architecture
- Search platform design
- Product discovery
- Elasticsearch fundamentals
- Search relevance
- Promotion systems
- Domain Specific Languages
- Production search engineering
- Modernization strategies
- Engineering trade-offs

---

# Intended Audience

- Software Engineers
- Senior Engineers
- Staff Engineers
- Search Engineers
- Platform Engineers
- Interview Candidates
- Engineering Leaders

---

# Guiding Philosophy

This repository should make it easy to:

- extract targeted resume bullets
- answer interview questions from evidence
- explain technical decisions without repeating yourself
- trace a story from business context to production outcome

Technology should serve business outcomes.

A successful search platform is measured not by the complexity of its implementation, but by how effectively customers can discover the products they need.
