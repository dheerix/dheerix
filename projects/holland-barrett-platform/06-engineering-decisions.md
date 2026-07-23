# 04 - Engineering Decisions

# Architecture Decisions & Trade-offs

> Every architecture is a series of trade-offs. Good engineering is choosing the right trade-offs for the business.

---

# Introduction

Enterprise systems rarely become successful because they use the newest technology.

They become successful because they make consistent engineering decisions that balance:

- Scalability
- Reliability
- Maintainability
- Cost
- Performance
- Team Productivity
- Business Requirements

This chapter discusses the major architectural decisions behind the commerce search platform.

---

# Decision 1

## Why Build OneSearch?

### Problem

Every application needed product search.

Without a shared platform:

- Multiple teams would implement search differently.
- Business rules would be duplicated.
- Relevance would become inconsistent.
- Upgrading the search engine would require every application to change.

---

### Decision

Create a dedicated search platform.

```
Applications

↓

OneSearch

↓

Elasticsearch
```

---

### Benefits

- Single search API
- Consistent behavior
- Easier maintenance
- Better monitoring
- Independent evolution
- Reduced duplication

---

### Trade-offs

Pros

- Centralized logic
- Reusable platform
- Easier governance

Cons

- Additional service hop
- More infrastructure
- Dedicated ownership required

---

# Decision 2

## Why Elasticsearch Instead of SQL?

### Problem

Relational databases are optimized for transactions.

Search requires:

- Full-text matching
- Ranking
- Facets
- Fast filtering
- Typo tolerance
- Relevance scoring

These are not strengths of traditional databases.

---

### Decision

Use Elasticsearch as a specialized search engine.

```
Commerce Database

↓

Index

↓

Elasticsearch

↓

Search
```

---

### Benefits

- Millisecond queries
- Full-text search
- Flexible ranking
- Aggregations
- Faceting
- Horizontal scalability

---

### Trade-offs

Pros

- Excellent search performance
- Rich search capabilities

Cons

- Data duplication
- Eventual consistency
- Index maintenance
- Operational complexity

---

# Decision 3

## Why Separate Search from Commerce?

### Problem

Commerce systems own business transactions.

Search systems optimize discovery.

Trying to combine both creates unnecessary coupling.

---

### Decision

Separate responsibilities.

```
Commerce

↓

Product Data

↓

Search Index

↓

Customer Search
```

---

### Benefits

- Independent scaling
- Clear ownership
- Faster search
- Simpler deployments

---

### Trade-offs

Pros

- Better architecture
- Service independence

Cons

- Synchronization challenges
- Additional infrastructure

---

# Decision 4

## Why Hide Elasticsearch Behind APIs?

### Problem

Direct frontend access tightly couples the UI to search implementation.

Changing search technology would require client changes.

---

### Decision

Introduce an API layer.

```
React

↓

OneSearch

↓

Elasticsearch
```

---

### Benefits

- Stable contracts
- Security
- Versioning
- Business validation
- Easier migrations

---

### Trade-offs

Pros

- Cleaner architecture
- Easier evolution

Cons

- Additional network hop

---

# Decision 5

## Why Use a Promotion Engine?

### Problem

Promotions constantly change.

Hardcoding rules leads to:

- Frequent deployments
- Difficult testing
- Poor maintainability

---

### Decision

Centralize promotion logic.

```
Promotion Rules

↓

Promotion Engine

↓

Commerce
```

---

### Benefits

- Reusable logic
- Easier maintenance
- Consistent pricing
- Flexible campaigns

---

### Trade-offs

Pros

- Cleaner business logic
- Reusable engine

Cons

- More complex implementation

---

# Decision 6

## Why Use ANTLR?

### Problem

Promotion rules became increasingly complex.

Simple if-else statements do not scale.

Examples include:

- Category combinations
- Customer eligibility
- Basket thresholds
- Date windows
- Product exclusions

---

### Decision

Represent rules using a Domain Specific Language (DSL) parsed with ANTLR.

---

### Benefits

- Structured rule definitions
- Easier parsing
- Validation
- Extensibility

---

### Trade-offs

Pros

- Highly maintainable
- Business rule flexibility

Cons

- Learning curve
- Grammar maintenance

---

# Decision 7

## Why Keep React Thin?

### Problem

Business logic implemented in the frontend creates:

- Duplication
- Security risks
- Inconsistent behavior
- Difficult maintenance

---

### Decision

Keep React focused on presentation.

Move business logic into backend services.

---

### Benefits

- Consistent behavior
- Easier testing
- Better security
- Smaller frontend

---

# Decision 8

## Why Invest in Search Relevance?

Finding products is not enough.

Customers expect:

- Correct ordering
- Relevant products
- Helpful filters
- Fast responses

Search quality directly influences revenue.

---

# Engineering Principles

Several principles influenced the platform.

## Separation of Concerns

Each component owns a single responsibility.

---

## API First

Applications communicate through contracts.

---

## Business Driven Design

Business requirements guide technology choices.

---

## Independent Deployability

Services evolve independently.

---

## Platform Thinking

Shared capabilities become reusable platforms.

---

## Operational Excellence

Production readiness is a feature.

Monitoring, logging, alerting, and debugging are part of the design—not afterthoughts.

---

# Lessons Learned

Building enterprise commerce systems reinforced several ideas:

- Search deserves its own platform.
- Architecture should minimize coupling.
- Business rules change faster than infrastructure.
- Stable APIs protect applications from implementation changes.
- Simplicity in architecture often results from thoughtful abstraction, not fewer components.

---

# Read Before Merge

> Good architecture isn't about choosing the most powerful technology.
>
> It's about creating boundaries that allow the business to change without forcing the entire system to change with it.
