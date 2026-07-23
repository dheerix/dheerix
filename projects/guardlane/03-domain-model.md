# Domain Model

## Purpose

This document defines the core business and technical concepts used throughout Guardlane.

The goal is to establish a shared language across Product, Engineering, Operations, and Machine Learning teams.

The domain model is implementation-independent.

It describes _what the system represents_, not _how the code is written_.

---

# Domain Overview

```text
Buyer
   │
   ▼
Moderation Request
   │
   ▼
Guardlane Moderation Orchestrator
   │
   ├── Language Detection
   ├── Regex Detection
   ├── Semantic Detection
   │      ├── DistilBERT
   │      └── LLM Fallback
   │
   ▼
Detection Results
   │
   ▼
Unified Moderation Result
   │
   ▼
Marketplace Business Policy
```

---

# Core Domain Concepts

## Buyer Question

A Buyer Question is the original marketplace message submitted by a buyer.

Example:

> "Call me at 519-555-1234. I'll pay $2,000."

The buyer question is immutable.

Every moderation decision refers back to the original text.

---

## Moderation Request

A Moderation Request represents one request submitted to Guardlane.

A request contains:

- question text
- identifiers
- marketplace metadata
- trace information

A request is the unit processed by the moderation pipeline.

---

## Language

Language represents the detected language of the request.

Current conceptual values include:

- English
- Non-English

Language is not itself a moderation category.

It determines which semantic engine is capable of processing the request.

---

## Detection Engine

A Detection Engine is any component capable of identifying moderation concerns.

The current architecture includes three engine types.

### Regex Engine

Responsible for deterministic detection.

Examples:

- phone numbers
- email addresses
- URLs
- configured patterns

---

### Semantic Classifier

The English semantic classifier hosted on Amazon SageMaker.

Responsibilities:

- understand context
- identify moderation intent
- support multiple categories

---

### LLM Fallback

Used when semantic classification falls outside the supported capability of the English classifier.

Currently used for non-English moderation.

The LLM returns categories aligned with the same moderation taxonomy.

---

## Moderation Category

A Moderation Category represents a business-defined policy concern.

Examples:

- Contact Sharing
- Dealer Targeting
- Price Negotiation

Categories belong to the business domain rather than the machine-learning domain.

---

## Detection Result

A Detection Result represents the output produced by a single engine.

Examples:

Regex:

```text
Matched Rule:
PhoneNumberRegex
```

Classifier:

```text
Contact Sharing
0.97
```

LLM:

```text
Categories:

- Contact Sharing
- Negotiation
```

Detection Results remain engine-specific until normalized.

---

## Unified Moderation Result

The Unified Moderation Result is the canonical output returned by Guardlane.

It combines evidence from all applicable engines into one response.

Possible contents include:

- flagged categories
- confidence scores
- matched regex rules
- detected language
- engine metadata
- model version
- rule version

Consumers should not need to understand which internal engine produced the result.

---

## Business Decision

The Marketplace Q&A service converts moderation evidence into product behaviour.

Possible decisions include:

- Allow
- Warn
- Block

Business decisions are intentionally outside Guardlane.

---

## Moderation Event

A Moderation Event is the persisted operational record describing a moderation request and its outcome.

Typical attributes include:

- original question
- language
- regex matches
- classifier output
- LLM output
- categories
- timestamps
- reviewer status
- model version
- rule version

Moderation events support operations and future learning.

---

## Human Review

Human Review represents manual validation of moderation results.

Reviewers may:

- accept
- reject
- correct categories

Human review improves future datasets and evaluation quality.

---

# Relationships

```text
Buyer Question
      │
      ▼
Moderation Request
      │
      ▼
Language Detection
      │
      ▼
Detection Engines
      │
      ├── Regex
      ├── DistilBERT
      └── LLM
      │
      ▼
Detection Results
      │
      ▼
Unified Moderation Result
      │
      ▼
Marketplace Business Policy
      │
      ▼
Moderation Event
      │
      ▼
Human Review
```

---

# Bounded Contexts

## Marketplace

Owns:

- buyer interaction
- seller interaction
- enforcement policy

Does not own:

- inference
- moderation models

---

## Guardlane

Owns:

- orchestration
- language routing
- regex evaluation
- semantic inference
- result normalization
- moderation contract

Does not own:

- business enforcement
- marketplace UI

---

## Machine Learning

Owns:

- datasets
- classifier training
- thresholds
- model releases
- evaluation

Does not own:

- API contracts
- routing decisions
- business policy

---

## Operations

Owns:

- moderation review
- dashboard workflows
- production investigations
- quality feedback

Does not own:

- model implementation
- marketplace behaviour

---

# Domain Invariants

The following rules should always remain true.

## One Request

One buyer question produces one moderation request.

---

## One Contract

Every request returns one unified moderation result regardless of which engines participated.

---

## Categories Are Independent

Multiple moderation categories may be returned.

Categories are never mutually exclusive by default.

---

## Detection Engines Are Replaceable

The external moderation contract should remain stable if an internal engine changes.

Examples:

- replace DistilBERT
- introduce multilingual classifiers
- replace the LLM provider
- add another rule engine

---

## Prediction Is Not Enforcement

Guardlane identifies moderation concerns.

Marketplace Q&A determines user-facing behaviour.

---

## Human Feedback Improves the System

Operational review contributes to future model evaluation and training.

---

# Ubiquitous Language

| Term                      | Meaning                                       |
| ------------------------- | --------------------------------------------- |
| Buyer Question            | Original marketplace message                  |
| Moderation Request        | Request entering Guardlane                    |
| Language                  | Detected processing language                  |
| Detection Engine          | Component that identifies moderation concerns |
| Regex Engine              | Deterministic pattern detector                |
| Semantic Classifier       | English DistilBERT model hosted on SageMaker  |
| LLM Fallback              | Semantic moderation for unsupported languages |
| Detection Result          | Output from one engine                        |
| Unified Moderation Result | Canonical Guardlane response                  |
| Moderation Category       | Business-defined policy classification        |
| Business Decision         | Allow, Warn, or Block                         |
| Moderation Event          | Persisted operational record                  |
| Human Review              | Manual validation of moderation outcomes      |

---

# Engineering Principles

## Model the business, not the implementation

The domain should remain valid even if the underlying models change.

---

## One language across teams

Product, Engineering, Operations, and Machine Learning should describe the system using the same concepts.

---

## Separate evidence from action

Detection engines provide evidence.

Marketplace services decide how users experience that evidence.

---

## Hide orchestration behind a stable contract

Internal routing, models, and rule engines may evolve, but consumers should continue to interact with one consistent Guardlane interface.
