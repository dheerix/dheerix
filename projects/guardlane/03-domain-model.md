# Domain Model

## Purpose

This document defines the core business entities and their relationships within the Guardlane moderation platform.

The domain model establishes a shared vocabulary between Product, Engineering, and Data Science, ensuring that business concepts remain consistent across implementation, documentation, APIs, and machine learning models.

---

## Domain Overview

Guardlane moderates conversations exchanged between buyers and sellers on the Vehicle Detail Page before they become visible on the marketplace.

The platform evaluates each submitted message against marketplace moderation policies and determines whether the message should be published.

---

## Core Entities

### Buyer

A marketplace user who submits questions about a vehicle.

Responsibilities

- Submit questions
- Receive moderation feedback
- Edit and resubmit messages

---

### Seller

Responds to buyer questions.

Seller responses may also be moderated using the same policy framework.

---

### Vehicle Listing

Represents the auction listing to which conversations belong.

A listing may contain multiple moderated conversations.

---

### Conversation

A logical thread between buyer and seller.

Contains one or more moderated messages.

---

### Message

A single piece of text submitted by either participant.

Every message is independently evaluated before publication.

Attributes

- Message ID
- Conversation ID
- Author
- Timestamp
- Text
- Status

---

### Moderation Request

Represents a moderation evaluation.

Created whenever a message is submitted.

Contains

- Message
- Model Version
- Request Time

---

### Moderation Category

Represents a business moderation policy.

Examples

- Contact Sharing
- Negotiation
- Dealer Targeting
- Organization Targeting
- Profanity
- As-Is
- Irrelevant

---

### Prediction

Represents the model's inference.

Contains

- Categories
- Confidence Scores
- Processing Time
- Model Version

---

### Moderation Decision

Final decision returned to the marketplace.

Examples

Published

Blocked

Requires User Revision

---

### Dashboard Metric

Aggregated operational statistics used by Product and Engineering.

Examples

- Moderation volume
- Category distribution
- Precision
- False positives
- False negatives

---

## Entity Relationships

Buyer
↓
Conversation
↓
Message
↓
Moderation Request
↓
Prediction
↓
Moderation Decision

↓

Dashboard Metrics

---

## Ubiquitous Language

Throughout the project, the following terminology is used consistently.

Message

Prediction

Moderation Category

Moderation Decision

Conversation

Dashboard Metric

Model Version

Policy
