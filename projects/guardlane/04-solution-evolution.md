# Solution Evolution

## Purpose

This document explains how Guardlane evolved from an initial LLM-based moderation approach into a hybrid moderation platform.

The goal is not merely to list technologies used over time.

It is to capture:

- what the team knew at each stage
- why each approach was reasonable
- what limitations appeared
- which engineering decisions followed
- how the final architecture emerged

Guardlane did not begin with a complete production architecture.

The design evolved as the moderation problem, data, model capability, operational constraints, and product needs became clearer.

---

# Evolution Summary

```text
Stage 1
LLM-First Moderation
        |
        v
Stage 2
Business Taxonomy and Historical Analysis
        |
        v
Stage 3
English Multi-Label Classifier
        |
        v
Stage 4
Managed SageMaker Deployment
        |
        v
Stage 5
Regex-Based Deterministic Detection
        |
        v
Stage 6
Language-Aware LLM Fallback
        |
        v
Stage 7
Hybrid Moderation Orchestrator
        |
        v
Stage 8
Dashboard, Human Review, and Continuous Learning
```

---

# Stage 1: LLM-First Moderation

## Context

The original problem was open-ended.

Marketplace questions could violate policies in many different ways, and the moderation taxonomy was not yet fully established.

At this stage, an LLM was a practical starting point because it could:

- interpret natural language
- handle broad moderation instructions
- support rapid experimentation
- work without a fully labeled training dataset
- help reveal recurring policy patterns

The initial LLM-based implementation allowed the team to validate whether automated moderation was feasible before investing in a specialized classifier.

---

## Why This Approach Was Reasonable

At the beginning, the main uncertainty was not model optimization.

The more important questions were:

- Which behaviours should be moderated?
- How should categories be defined?
- Can historical questions be classified consistently?
- How should ambiguous questions be interpreted?
- What information should Guardlane return?

An LLM allowed Product and Engineering to explore these questions quickly.

---

## Limitations Observed

As the use case became clearer, the limitations of using an LLM as the primary path became more important.

These included:

- higher latency
- higher inference cost
- less predictable output structure
- prompt sensitivity
- greater response variability
- more difficult category-level evaluation
- unnecessary generality for a stable English taxonomy

The issue was not that the LLM could not perform moderation.

The issue was that it was more capable—and more expensive—than the primary English classification path required.

---

# Stage 2: Business Taxonomy and Historical Analysis

## Context

Before training a supervised classifier, the moderation problem needed to be converted into a stable domain model.

Product and Engineering collaborated to define categories representing marketplace policy concerns.

Historical marketplace questions were analyzed to determine:

- whether the categories appeared in real data
- whether categories overlapped
- whether examples could belong to multiple categories
- which classes were rare
- whether labels could be applied consistently
- whether the categories were technically learnable

---

## Key Realization

A question could violate multiple policies simultaneously.

Example:

```text
Call me at 519-555-1234. This dealer is a scam.
```

This may contain:

- Contact Sharing
- Dealer Targeting

This ruled out a conventional single-label, multi-class design.

The problem required multi-label classification.

---

## Outcome

The moderation taxonomy became a shared contract between:

- Product
- Engineering
- Machine Learning
- Operations

The model was no longer solving a vague concept such as “unsafe question.”

It was predicting explicit product-defined moderation categories.

---

# Stage 3: English Multi-Label Classifier

## Context

Once the English taxonomy and dataset became sufficiently stable, a specialized classifier became viable.

DistilBERT was selected as the primary English semantic moderation model.

The model produces independent scores for each category.

---

## Why DistilBERT

The English moderation problem had become:

- well-defined
- repetitive
- taxonomy-driven
- suitable for supervised learning
- sensitive to latency and cost

DistilBERT provided:

- lower inference latency than the primary LLM path
- lower cost
- predictable output structure
- repeatable evaluation
- category-level scores
- support for multi-label classification
- a clear deployment artifact

---

## Important Scope Boundary

The classifier was trained and evaluated for English moderation.

It was not treated as a universal multilingual model.

This limitation later influenced the language-aware routing design.

---

## Trade-Off

The classifier was more specialized and efficient than the LLM.

However, it had narrower capability.

This was acceptable for the main English path because the moderation taxonomy was relatively stable and the model could be evaluated directly against labeled examples.

---

# Stage 4: Dataset Engineering and Synthetic Data

## Context

Historical production data did not contain enough balanced examples for every moderation category.

Some categories had many examples.

Others had relatively few.

This created class-imbalance and generalization risks.

---

## Initial Augmentation Approach

Traditional text augmentation techniques were explored to increase the number of examples.

These approaches could create:

- paraphrases
- word substitutions
- minor textual variations

However, the resulting data often contained:

- near-duplicates
- limited linguistic diversity
- repeated sentence structures
- superficial variation

The dataset became larger without becoming proportionally richer.

---

## LLM-Assisted Synthetic Data

The LLM was then used for a different purpose: generating diverse synthetic training examples for rare categories.

This demonstrates an important evolution.

The LLM was reduced as the primary English runtime engine, but retained where its generative capability provided meaningful value.

The synthetic-data workflow included:

- category-specific generation
- diverse wording
- different sentence structures
- edge-case creation
- manual validation
- duplicate removal
- quality review

---

## Outcome

The project adopted a pragmatic division of responsibility:

- DistilBERT for efficient English production inference
- LLM generation for improving rare-category datasets

This was not an LLM-versus-classifier decision.

It was a decision about where each technology delivered the most value.

---

# Stage 5: Managed SageMaker Deployment

## Context

A trained model alone was not sufficient.

The classifier required a production inference platform with:

- reliable endpoint hosting
- model artifact management
- authentication
- scaling
- monitoring
- deployment traceability

Amazon SageMaker managed endpoints were selected.

---

## Deployment Evolution

The deployment process included more than uploading model weights.

A production release needed to preserve:

- model artifacts
- tokenizer artifacts
- category mapping
- category thresholds
- release version
- runtime configuration
- deployment metadata

This led to the use of a versioned release manifest.

---

## Outcome

The model became a deployable, traceable production component rather than a notebook artifact.

Guardlane could invoke the model through a managed SageMaker endpoint while remaining insulated from the underlying model packaging details.

---

# Stage 6: Regex-Based Deterministic Detection

## Context

As the production moderation pipeline was refined, it became clear that not every moderation concern required semantic inference.

Some patterns were explicit and deterministic.

Examples may include:

- phone numbers
- email addresses
- URLs
- known textual formats
- configured marketplace identifiers

Using only a semantic classifier for such patterns would introduce unnecessary uncertainty.

---

## Decision

A regex engine was added as part of the moderation pipeline.

The regex engine detects patterns that are:

- explicit
- testable
- inexpensive
- deterministic
- well understood

---

## Why Regex Remained Valuable

Machine learning can generalize across language, but it does not guarantee exact recognition of every deterministic pattern.

Regex provides:

- predictable matching
- low computational cost
- straightforward testing
- clear rule ownership
- immediate rule-level traceability

The classifier remains responsible for contextual concerns such as:

- negotiation intent
- dealer targeting
- unrelated requests
- other semantic policy violations

---

## Architectural Consequence

Guardlane became a hybrid detection system.

The architecture no longer assumed that one inference method should solve every moderation problem.

---

## Important Implementation Boundary

The regex engine participates in moderation detection and contributes to the final result.

The documentation should not claim that every regex match automatically bypasses semantic inference unless the implemented routing explicitly does so.

The safe architectural description is:

> Regex results and semantic results are normalized and combined into a unified moderation result.

---

# Stage 7: Language-Aware LLM Fallback

## Context

The DistilBERT classifier was trained for English data.

Marketplace questions, however, may be submitted in other languages.

Sending non-English text to the English classifier would create an unsupported inference path.

A low-confidence result would not necessarily communicate that the model lacked language capability.

---

## Decision

Guardlane introduced language-aware semantic routing.

```text
Supported English
        |
        v
DistilBERT through SageMaker

Non-English or unsupported language
        |
        v
LLM moderation fallback
```

---

## Why Retain the LLM

The LLM remained useful because it provided broader multilingual capability without immediately requiring:

- a multilingual labeled dataset
- a separate classifier for every language
- full multilingual training and evaluation
- multiple production endpoints

This enabled multilingual moderation while the specialized classifier remained focused on the language for which it had been trained.

---

## Trade-Off

The LLM fallback may have:

- higher latency
- higher cost
- more variable responses
- provider dependency
- prompt and output-validation requirements

However, these trade-offs apply to a narrower fallback route rather than every moderation request.

---

## Architectural Consequence

Guardlane became capability-aware.

It routes requests to the engine best suited to the input instead of assuming that every model can reliably process every request.

---

# Stage 8: Unified Moderation Orchestration

## Final Conceptual Architecture

```text
Buyer
  |
  v
Marketplace Q&A Service
  |
  v
Guardlane Moderation Orchestrator
  |
  +--> Request Validation
  |
  +--> Language Detection
  |
  +--> Regex Engine
  |       |
  |       v
  |   Deterministic Matches
  |
  +--> Semantic Routing
          |
          +--> English
          |       |
          |       v
          |   DistilBERT
          |   Amazon SageMaker
          |
          +--> Non-English
                  |
                  v
              LLM Fallback
  |
  v
Result Normalization and Aggregation
  |
  v
Unified Moderation Result
  |
  v
Marketplace Q&A Business Policy
  |
  +--> Allow
  +--> Warn
  +--> Block
```

---

## Guardlane’s Final Responsibility

Guardlane owns:

- request validation
- language detection
- detection-engine orchestration
- regex evaluation
- classifier invocation
- LLM fallback invocation
- output normalization
- result aggregation
- moderation evidence
- engine metadata

Guardlane does not own:

- final product enforcement
- buyer-facing messaging
- seller-facing behaviour
- final marketplace policy decisions

---

## Unified Contract

The consuming Marketplace Q&A service receives one moderation result regardless of which internal engines participated.

The result may contain:

- flagged categories
- classifier scores
- matched regex rules
- language
- model version
- rule version
- engine metadata
- processing status

This isolates the consumer from internal architecture changes.

---

# Stage 9: Prediction and Policy Separation

## Context

A model prediction is not automatically a user-facing decision.

The same moderation evidence may produce different behaviour depending on:

- marketplace context
- product policy
- risk tolerance
- rollout stage
- category
- operational requirements

---

## Decision

Guardlane returns moderation evidence.

Marketplace Q&A applies policy.

```text
Guardlane
    |
    v
Flagged Categories + Scores + Matches
    |
    v
Marketplace Q&A
    |
    +--> Allow
    +--> Warn
    +--> Block
```

---

## Benefits

This separation allows:

- policy changes without retraining
- threshold changes without changing UI logic
- model replacement without changing product ownership
- reuse by other consumers
- independent testing
- clearer service boundaries

---

# Stage 10: Asynchronous Persistence

## Context

Moderation results are valuable for:

- operational review
- dashboard analysis
- quality measurement
- incident investigation
- future training

However, persistence should not unnecessarily increase user-facing latency.

---

## Decision

Moderation events are stored asynchronously where possible.

The synchronous path returns the moderation result to Marketplace Q&A.

The persistence path records the request and results for later use.

---

## Event Data

A moderation event may include:

- original question
- detected language
- regex matches
- classifier scores
- LLM categories
- final flagged categories
- model version
- rule version
- configuration version
- timestamps
- trace identifiers
- later review decisions

---

## Benefit

Operational analytics and future learning remain available without coupling database or event-processing latency to the interactive buyer experience.

---

# Stage 11: Dashboard and Human Review

## Context

Offline model metrics cannot fully prove production effectiveness.

The system requires visibility into:

- real questions
- prediction quality
- category distribution
- false positives
- false negatives
- reviewer disagreement
- language-routing behaviour

---

## Decision

A dashboard and human-in-the-loop workflow were introduced.

The initial dashboard includes:

- F1-related model metrics
- moderated-question lists
- prediction review
- accept and reject actions
- category validation

---

## Continuous Learning Loop

```text
Production Request
        |
        v
Moderation Result
        |
        v
Persisted Moderation Event
        |
        v
Dashboard Review
        |
        v
Human Validation
        |
        v
Future Dataset
        |
        v
Model Evaluation and Retraining
```

---

## Outcome

Deployment is not treated as the end of the project.

Production usage becomes the source of future improvement.

---

# Current Architecture

The current Guardlane design combines specialized technologies according to their strengths.

| Component         | Primary Responsibility                |
| ----------------- | ------------------------------------- |
| Regex engine      | Deterministic pattern detection       |
| DistilBERT        | English semantic classification       |
| SageMaker         | Managed classifier hosting            |
| LLM fallback      | Non-English semantic moderation       |
| Guardlane         | Routing, orchestration, normalization |
| Marketplace Q&A   | Business-policy enforcement           |
| Async persistence | Operational record storage            |
| Dashboard         | Review and model-quality visibility   |
| Human reviewers   | Validation and future feedback        |

---

# Why the Architecture Is Hybrid

A single moderation technology would create avoidable weaknesses.

## Regex Only

Would be fast and deterministic, but unable to interpret broader intent.

## Classifier Only

Would provide semantic classification, but would be unnecessarily probabilistic for explicit patterns and unsupported for non-English inputs.

## LLM Only

Would provide broad semantic and multilingual capability, but with greater latency, cost, and output variability.

## Hybrid Architecture

The chosen design combines:

- rules for deterministic problems
- a classifier for high-volume supported semantic classification
- an LLM fallback for inputs outside the classifier’s language capability

This creates a more balanced production system.

---

# Evolution of the LLM’s Role

The LLM was not simply removed.

Its role became more focused.

## Initial Role

Primary moderation engine.

## Later Roles

- synthetic training-data generation
- non-English semantic fallback

This reflects a broader engineering principle:

> A technology may remain valuable even when it is no longer the default path.

---

# Key Engineering Decisions Produced by the Evolution

The solution evolution resulted in the following architecture decisions:

1. Replace the LLM as the primary English engine with DistilBERT.
2. Use multi-label classification.
3. Define a product-driven moderation taxonomy.
4. Use LLM-assisted synthetic-data generation.
5. Use a versioned model release manifest.
6. Separate prediction from business policy.
7. Persist moderation events asynchronously.
8. Use SageMaker managed endpoints.
9. Use independent category thresholds.
10. Combine regex and semantic moderation.
11. Route non-English content to an LLM fallback.

---

# Future Evolution

Potential future directions include:

- multilingual supervised classifiers
- additional regex-rule families
- provider-independent LLM routing
- language-specific thresholds
- shadow model deployment
- model-version comparison
- automatic drift detection
- reviewer-agreement measurement
- partial or full fallback reduction
- additional Guardlane consumers

Future changes should preserve the external moderation contract where practical.

---

# Lessons from the Evolution

## Begin with uncertainty reduction

The first solution should help clarify the problem, not prematurely optimize it.

---

## Specialize after the domain stabilizes

A dedicated classifier became valuable only after the taxonomy and data were sufficiently understood.

---

## Do not discard useful technologies completely

The LLM moved from the default runtime path to narrower roles where its flexibility remained beneficial.

---

## Match the tool to the problem

- regex for explicit patterns
- DistilBERT for supported semantic classification
- an LLM for unsupported-language fallback

---

## Model capability must influence routing

A model should not receive requests merely because it is already deployed.

---

## Production architecture is broader than model architecture

The final system includes:

- data
- models
- rules
- routing
- service boundaries
- deployment
- observability
- persistence
- operations
- human review

---

# Final Engineering Principle

> Mature systems do not force every problem through one technology. They evolve by assigning each responsibility to the simplest reliable component capable of handling it.
