# 02 - Platform Overview

# Enterprise Commerce Platform Architecture

Understanding How Modern Commerce Systems Work

---

# Introduction

Modern e-commerce platforms are distributed systems.

Instead of a single monolithic application, responsibilities are divided across multiple services, each optimized for a specific business capability.

This separation improves:

- Scalability
- Reliability
- Maintainability
- Independent deployments
- Team ownership

At Holland & Barrett, the commerce ecosystem consisted of multiple interconnected systems responsible for delivering a seamless shopping experience.

---

# High-Level Architecture

```

Customer
│
▼
React Storefront
│
├─────────────────────────────┐
│ │
▼ ▼
Magnolia CMS OneSearch
(Content Team) ⭐ Product Search
│
▼
Elasticsearch
│
▼
Commerce APIs
│
├──────────────┬──────────────┬──────────────┐
▼ ▼ ▼
Catalog Pricing Inventory
```
