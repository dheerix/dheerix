# 03 - Search Platform

# OneSearch

Building an Enterprise Product Discovery Platform

---

# Introduction

Search is one of the most critical services in an e-commerce platform.

Unlike traditional CRUD applications, a search platform must answer vague, incomplete, and often incorrect customer queries within milliseconds while returning the most relevant products.

The objective is not simply to retrieve data—it is to understand customer intent.

OneSearch served as the enterprise product search platform, exposing a stable API while abstracting the underlying search engine and business logic.

---

# Why OneSearch Exists

A common question is:

> Why not allow the frontend to query Elasticsearch directly?

Because search involves much more than executing a text query.

A dedicated search platform provides:

- Stable APIs
- Centralized search logic
- Business rule enforcement
- Consistent ranking
- Version independence
- Security
- Monitoring
- Observability

OneSearch became the single gateway for all product search requests.

---

# High-Level Architecture

```
                Customer
                     │
                     ▼
             React Storefront
                     │
                     ▼
              OneSearch API
                     │
     ┌───────────────┴───────────────┐
     │                               │
     ▼                               ▼
Business Rules               Query Builder
     │                               │
     └───────────────┬───────────────┘
                     ▼
              Elasticsearch
                     │
                     ▼
              Product Index
```

---

# Request Lifecycle

Every search request followed a predictable flow.

```
Customer enters

Vitamin D

↓

React

↓

OneSearch

↓

Validate request

↓

Build search query

↓

Apply filters

↓

Apply business rules

↓

Execute Elasticsearch query

↓

Receive results

↓

Transform response

↓

Return products
```

---

# Responsibilities of OneSearch

OneSearch owned the orchestration layer rather than the storage layer.

Its responsibilities included:

- Search APIs
- Query construction
- Business validation
- Result transformation
- Error handling
- Performance optimization
- Search relevance
- Logging
- Monitoring

This separation allowed frontend applications to remain independent of Elasticsearch implementation details.

---

# Search APIs

Typical API responsibilities included:

```
GET /search

Parameters

query

page

size

filters

sort

facets
```

The API exposed business-friendly contracts while hiding internal search complexity.

---

# Product Index

Elasticsearch stores data differently from relational databases.

Instead of normalized tables, products are indexed as search documents.

Example:

```
Product

Name

Vitamin D3

Brand

Holland & Barrett

Category

Vitamins

Price

£12.99

Availability

In Stock
```

Each indexed document is optimized for searching rather than updating.

---

# Query Construction

Customer queries are rarely executed directly.

Instead, OneSearch constructs richer queries by combining:

- Search text
- Filters
- Category restrictions
- Availability
- Business rules
- Sorting
- Pagination

This query-building layer keeps search behavior consistent across applications.

---

# Filters

Customers progressively narrow their search.

Examples include:

- Brand
- Category
- Price
- Rating
- Dietary Preference
- Availability

Filters reduce the search space without changing the original query.

---

# Facets

Facets summarize the result set.

Example:

```
Vitamin

Brands

H&B (42)

Solgar (18)

Nature's Bounty (15)

Categories

Vitamin D

Vitamin C

Multivitamins
```

Rather than returning only products, the search platform also returns information that helps customers continue refining their search.

---

# Search Relevance

One of the most difficult problems in search engineering is deciding which products should appear first.

Relevance depends on many factors, including:

- Text match quality
- Product popularity
- Business priorities
- Availability
- Promotions
- Category importance

Ranking is therefore both a technical and business problem.

---

# Pagination

Large result sets cannot be returned in a single response.

Typical flow:

```
Page 1

↓

Page 2

↓

Page 3
```

Efficient pagination is essential for maintaining low response times while minimizing unnecessary data transfer.

---

# Performance

Customer expectations for search are measured in milliseconds.

Performance considerations include:

- Query optimization
- Efficient indexing
- Reduced network calls
- Appropriate pagination
- Response size optimization
- API caching where appropriate

Even small increases in latency can negatively impact user experience.

---

# Error Handling

Search platforms must degrade gracefully.

Common scenarios include:

- Invalid filters
- Empty queries
- No matching products
- Backend failures
- Timeout responses

A robust search service should return predictable responses instead of exposing internal implementation details.

---

# Legacy Search Modernization

One of the major engineering challenges was modernizing the search platform while preserving existing customer behavior.

Migration required maintaining functional parity for:

- Product retrieval
- Ranking
- Filtering
- Facets
- Pagination
- Overall user experience

The goal was to improve maintainability and scalability without disrupting the customer experience.

---

# Production Engineering

Operating a search platform extends beyond feature development.

Production responsibilities include:

- Investigating slow searches
- Monitoring latency
- Diagnosing query failures
- Verifying index health
- Troubleshooting production incidents
- Supporting releases
- Monitoring search quality

Search engineering is an operational discipline as much as a development discipline.

---

# My Contributions

My primary work focused on the search platform, including:

- OneSearch backend development
- Elasticsearch integration
- Search API enhancements
- Query processing
- Promotion-related backend work
- ANTLR-based rule enhancements
- React commerce features
- Production issue investigation
- Legacy modernization efforts

My work centered on enabling a reliable, scalable product discovery experience while integrating business rules into the search workflow.

---

# Engineering Lessons

Building enterprise search systems teaches several important principles:

- Search is fundamentally different from database querying.
- APIs should abstract infrastructure details.
- Business rules belong in service layers rather than user interfaces.
- Search relevance requires continuous tuning.
- Production observability is essential for maintaining customer experience.
- Successful modernization preserves customer behavior while improving the underlying architecture.

---

# Key Takeaways

- OneSearch served as the central product discovery platform.
- Elasticsearch provided the underlying search capabilities.
- OneSearch abstracted search complexity behind stable APIs.
- Search engineering combines distributed systems, information retrieval, and business logic.
- Enterprise search platforms must balance relevance, performance, scalability, and maintainability.
