# 01 - Business Context

## Enterprise Commerce Search

### Holland & Barrett Platform

---

# Purpose

This document captures the business problem behind the Holland & Barrett commerce platform.

It exists to answer a simple question:

what customer and business outcomes was the search platform meant to improve?

Technical details belong in the architecture and engineering documents.

---

# Business Problem

The online commerce experience needed to help customers quickly discover, compare, and purchase health and wellness products.

The core business challenge was not just showing products.

It was making the right products easy to find in a large, changing catalog with search, browse, filtering, and promotions all working together.

---

# Company Context

Holland & Barrett is a large health and wellness retailer with a broad product catalog that includes:

- Vitamins
- Supplements
- Sports nutrition
- Organic foods
- Herbal products
- Beauty
- Personal care
- Healthy living products

Customers shop through multiple channels:

- Physical stores
- Website
- Mobile devices

This repository focuses on the digital commerce experience and the systems that support online discovery and conversion.

---

# Primary Stakeholders

The platform served several groups with different goals:

- Customers who wanted fast, relevant product discovery
- Merchandising teams who needed promotions and campaign visibility
- Product and content teams who maintained catalog and browsing experiences
- Engineers who needed a stable, evolvable platform
- Business stakeholders who cared about conversion, revenue, and customer satisfaction

---

# Customer Journey

The search platform influenced the full purchase path:

```text
Customer
↓
Visits website
↓
Searches or browses
↓
Filters and compares results
↓
Reads product details
↓
Adds to basket
↓
Checks out
↓
Places order
```

Each step in this journey is a conversion opportunity.

Reducing friction at the discovery stage has a direct effect on downstream revenue.

---

# Why Search Matters

A customer searching for `Vitamin D` expects:

- Instant results
- Relevant products
- Spelling tolerance
- Filters
- Prices
- Availability
- Promotions

The customer does not care how the search engine works.

They care that the right product appears quickly and confidently.

Search is therefore a revenue-critical capability, not just a technical feature.

---

# Scale And Complexity

The commerce catalog introduces recurring challenges:

- Large product volume
- Multiple brands
- Constant inventory changes
- Product variants
- Seasonal campaigns
- Promotional pricing
- Synonyms
- Misspellings

This is why discovery becomes an engineering problem.

The hard part is not storing products.

The hard part is helping customers find the right product at the right time.

---

# Discovery Modes

Customers do not always arrive with a precise query.

Examples include:

- Exact intent: `Vitamin D3 5000 IU`
- Broad intent: `Energy`
- Problem-based intent: `Joint pain`

The platform had to translate intent into relevant products through both search and browse experiences.

Navigation and search worked together:

```text
Health
↓
Vitamins
↓
Immune Support
↓
Vitamin C
```

---

# Promotions

Commerce platforms are dynamic.

Marketing teams regularly launch offers such as:

- Buy one get one
- Percentage discounts
- Basket threshold offers
- Member discounts

Promotions affected search relevance, browsing, product detail pages, and conversion.

That made them a core part of the business context, not an isolated merchandising concern.

---

# Read Before Merge

> Use this document for the stable business context only. Keep architecture, implementation, and operating detail in the project-specific technical documents.
