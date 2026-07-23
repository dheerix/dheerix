# 01 - Business Context

# Enterprise Commerce Search

Understanding the Business Before the Technology

---

# Why This Matters

Software exists to solve business problems.

Before understanding Elasticsearch, APIs, or React, an engineer must first understand what problem the business is trying to solve.

Every architecture decision in a commerce platform ultimately exists to help a customer discover, evaluate, and purchase products.

Technology is the implementation.

Business is the reason.

---

# About Holland & Barrett

Holland & Barrett is one of Europe's largest health and wellness retailers.

The company offers thousands of products across categories including:

- Vitamins
- Supplements
- Sports Nutrition
- Organic Foods
- Herbal Products
- Beauty
- Personal Care
- Healthy Living

Customers can purchase products through:

- Physical Stores
- Website
- Mobile Devices

This repository focuses on the digital commerce platform powering the online customer experience.

---

# The Customer Journey

Every online purchase follows a journey.

```
Customer

↓

Visits Website

↓

Looks for Product

↓

Searches or Browses

↓

Filters Results

↓

Reads Product Details

↓

Adds to Basket

↓

Checkout

↓

Order
```

Every second saved during this journey increases the likelihood of conversion.

---

# Why Search Is So Important

Imagine a customer searching for

```
Vitamin D
```

The customer expects:

- Instant results
- Relevant products
- Correct spelling handling
- Filters
- Prices
- Availability
- Promotions

The customer does **not** care how Elasticsearch works.

They care that the correct product appears immediately.

Search is therefore one of the highest-value systems in any commerce platform.

---

# Search Is Revenue

Unlike many backend systems, search directly impacts business revenue.

Better search leads to:

- Higher conversion rates
- Better product discovery
- Increased basket size
- Lower customer frustration
- Higher repeat purchases

Poor search has the opposite effect.

Customers rarely complain.

They simply leave.

---

# The Scale Problem

Enterprise retailers manage enormous catalogs.

Typical challenges include:

- Thousands of products
- Multiple brands
- Constant inventory changes
- Product variants
- Seasonal campaigns
- Promotional pricing
- Synonyms
- Misspellings

Finding the correct product becomes an engineering problem.

---

# Product Discovery

Customers do not always know exactly what they want.

Some searches are precise.

```
Vitamin D3 5000 IU
```

Others are vague.

```
Energy
```

Others describe a problem.

```
Joint pain
```

The search platform must translate customer intent into relevant products.

This is called **product discovery**.

---

# Beyond Search

Customers also discover products by browsing.

```
Health

↓

Vitamins

↓

Immune Support

↓

Vitamin C
```

Navigation and search work together to help customers explore the catalog.

---

# Promotions

Commerce platforms are not static catalogs.

Marketing teams constantly launch campaigns.

Examples include:

- Buy One Get One
- 20% Off
- Spend £50 Save £10
- Member Discounts
- Seasonal Promotions

These promotions involve complex business rules that must be evaluated consistently across the platform.

---

# Merchandising

Not every product is ranked solely by text relevance.

Business teams may choose to:

- Promote new products
- Boost seasonal items
- Hide discontinued products
- Prioritize higher-margin products
- Highlight exclusive brands

Search therefore balances customer relevance with business objectives.

---

# Search Quality

A successful search engine should answer three questions.

## Can the customer find it?

Product discoverability.

---

## Can the customer trust it?

Relevant ranking.

Correct pricing.

Correct availability.

---

## Can the customer buy it?

Reliable commerce workflows.

Fast checkout.

---

# Modern Commerce Architecture

Large commerce platforms separate responsibilities.

```
Presentation

↓

Search

↓

Commerce

↓

Catalog

↓

Inventory

↓

Pricing
```

Each layer evolves independently while working together to create a seamless shopping experience.

---

# Engineering Challenges

Building enterprise commerce platforms requires solving problems such as:

- Fast product search
- Search relevance
- Large catalog indexing
- High traffic
- Promotions
- Business rules
- Low latency
- Scalability
- Reliability
- Continuous deployment

The following chapters explore how these challenges are addressed through modern search architecture.

---

# Key Takeaways

- Commerce platforms exist to help customers discover and purchase products.
- Search is one of the most business-critical systems in e-commerce.
- Product discovery combines search, navigation, merchandising, and promotions.
- Engineering decisions should always be driven by customer and business outcomes.
- Understanding the business problem is the foundation for designing effective technical solutions.
