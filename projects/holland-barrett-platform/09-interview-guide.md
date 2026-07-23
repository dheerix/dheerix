# 08 - Interview Guide

# Explaining Enterprise Search Engineering

> This chapter summarizes the most important interview topics from the Holland & Barrett platform and provides structured ways to discuss architecture, design decisions, and engineering contributions.

---

# Tell me about the project.

### Sample Answer

At Holland & Barrett, I worked on the enterprise commerce platform, primarily contributing to the OneSearch platform, backend commerce services, React features, and the promotion engine.

The search platform acted as the gateway between customer applications and Elasticsearch, providing stable APIs for product discovery while integrating business rules and supporting enterprise-scale commerce.

In addition to feature development, I supported production issues, backend integrations, and legacy modernization efforts.

---

# What problem did OneSearch solve?

Without OneSearch:

- Every application would implement search differently.
- Business rules would be duplicated.
- Search behavior would become inconsistent.
- Elasticsearch would be exposed directly to clients.

OneSearch centralized search functionality behind a stable API, improving consistency, maintainability, and operational visibility.

---

# Describe the architecture.

```
Customer

↓

React

↓

OneSearch

↓

Elasticsearch

↓

Product Index
```

Commerce APIs remained responsible for product, pricing, and inventory data, while OneSearch focused on product discovery.

---

# Why not call Elasticsearch directly from React?

A backend API provides:

- Stable contracts
- Authentication
- Authorization
- Business validation
- Request transformation
- Logging
- Monitoring
- Version independence

It also prevents frontend applications from depending on Elasticsearch-specific query syntax.

---

# What is Elasticsearch?

Elasticsearch is a distributed search engine optimized for full-text search and fast retrieval of indexed documents.

Compared to relational databases, it provides:

- Full-text search
- Relevance scoring
- Facets
- Aggregations
- Horizontal scalability

---

# Why not use SQL for search?

Relational databases excel at transactional consistency.

Search platforms require:

- Relevance ranking
- Tokenization
- Text analysis
- Typo tolerance
- Fast filtering

These capabilities are the primary strengths of search engines.

---

# What is product discovery?

Product discovery is the process of helping customers find products through:

- Search
- Categories
- Filters
- Facets
- Recommendations
- Merchandising

The goal is not simply returning data but guiding customers toward relevant products.

---

# Explain filters and facets.

### Filters

Filters narrow the result set.

Examples:

- Brand
- Category
- Price
- Availability

---

### Facets

Facets summarize the available results.

Example:

```
Brand

H&B (42)

Solgar (18)

Nature's Bounty (15)
```

Facets help customers refine their search without starting over.

---

# What were your contributions?

Primary areas included:

- OneSearch backend development
- Search API enhancements
- Elasticsearch integration
- Promotion engine enhancements
- ANTLR grammar work
- Backend API development
- React commerce features
- Production issue investigation

---

# Tell me about the Promotion Engine.

The promotion engine evaluated business rules for marketing campaigns such as:

- Buy One Get One
- Spend Threshold Discounts
- Category Promotions

I contributed to backend enhancements and ANTLR-based grammar work supporting these rules.

---

# What is ANTLR?

ANTLR is a parser generator used to build parsers from formally defined grammars.

Within the promotion engine, it enabled structured interpretation of complex business rules instead of relying on deeply nested conditional logic.

---

# Tell me about a production issue.

A structured approach:

1. Understand customer impact.
2. Gather logs and metrics.
3. Identify the affected component.
4. Verify recent deployments.
5. Isolate the root cause.
6. Validate the fix.
7. Monitor after deployment.

The exact issue varies, but the investigation process remains consistent.

---

# How did you collaborate across teams?

The platform involved collaboration with:

- Frontend engineers
- Backend engineers
- QA
- Product managers
- Adjacent platform teams

Clear ownership boundaries and communication were essential for delivering customer-facing features.

---

# Biggest engineering lessons

Working on enterprise commerce taught me:

- Search deserves its own platform.
- APIs should abstract infrastructure.
- Business logic belongs in backend services.
- Search quality affects business outcomes.
- Production engineering is as important as feature development.

---

# Follow-up Questions to Expect

### Search

- What is an inverted index?
- How does Elasticsearch rank results?
- What is relevance scoring?
- What is tokenization?
- What are analyzers?
- What are shards and replicas?
- How do you scale search?

---

### Backend

- Why use an API gateway?
- REST vs GraphQL?
- Error handling?
- Versioning?
- Caching?

---

### React

- State management
- API integration
- Performance optimization
- Component design

---

### Production

- Monitoring
- Logging
- Incident response
- Rollbacks
- Deployment strategy

---

### System Design

- Design an e-commerce search platform.
- Design autocomplete.
- Design product recommendations.
- Design a promotion service.
- Design a product catalog.

---

# STAR Stories to Prepare

Prepare concrete examples for:

- A challenging feature
- A production incident
- A legacy modernization task
- A cross-team collaboration
- A difficult bug
- A design discussion
- A technical disagreement
- A successful release

These examples should be based on your actual experience and should clearly explain the situation, your actions, and the outcome.

---

# Read Before Merge

> Interviewers rarely expect perfect answers. They want to understand how you think, how you make engineering decisions, and how you communicate those decisions clearly. Demonstrating sound reasoning and honest ownership is more valuable than listing technologies.
