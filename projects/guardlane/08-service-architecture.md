# Service Architecture

## Purpose

This document describes how Guardlane processes moderation requests across:

- regex detection
- language routing
- the English DistilBERT classifier
- the non-English LLM fallback
- result aggregation
- asynchronous persistence

Guardlane exposes one stable moderation API while hiding the complexity of the internal engines.

---

# Architecture Overview

```text
Marketplace Q&A
      |
      v
Guardlane API
      |
      v
Request Validation
      |
      +------------------+
      |                  |
      v                  v
Regex Engine       Language Detection
                         |
              +----------+----------+
              |                     |
              v                     v
          English              Non-English
              |                     |
              v                     v
         SageMaker              LLM Fallback
         DistilBERT
              |                     |
              +----------+----------+
                         |
                         v
                Result Aggregation
                         |
                         v
              Unified Moderation Result
                         |
              +----------+----------+
              |                     |
              v                     v
      Marketplace Policy     Async Persistence
```

---

# Service Responsibilities

Guardlane owns:

- validating moderation requests
- evaluating deterministic regex rules
- detecting the supported language route
- invoking SageMaker for English content
- invoking the LLM fallback for non-English content
- normalizing engine-specific responses
- aggregating moderation evidence
- returning a stable response contract
- publishing moderation events for persistence

Guardlane does not own:

- final allow, warn, or block decisions
- buyer-facing messaging
- seller-facing behaviour
- manual-review policy

These remain with Marketplace Q&A and operational teams.

---

# Request Flow

## 1. Request Validation

Guardlane validates:

- question text
- request identifiers
- supported payload shape
- input length
- required metadata

Invalid requests are rejected before downstream engines are called.

---

## 2. Regex Evaluation

The regex engine evaluates deterministic patterns such as:

- phone numbers
- email addresses
- URLs
- configured marketplace patterns

Regex results are represented as structured matches containing:

- category
- rule identifier
- rule version

The architecture should not claim that a regex match always bypasses semantic inference unless that behaviour is implemented explicitly.

---

## 3. Language Routing

Guardlane determines whether the question is supported by the English classifier.

```text
Supported English
    -> DistilBERT through SageMaker

Non-English
    -> LLM fallback
```

Unsupported language must not be treated as low classifier confidence.

It requires a different processing route.

---

## 4. Semantic Moderation

### English Route

The SageMaker endpoint returns:

- category scores
- model version
- taxonomy version

Guardlane applies or consumes the configured category thresholds and converts the result into the internal moderation format.

### Non-English Route

The LLM fallback returns categories aligned with the same moderation taxonomy.

Guardlane validates and normalizes the response before aggregation.

Provider-specific output is not exposed directly to Marketplace Q&A.

---

# Sequential or Parallel Execution

Regex evaluation and semantic processing are conceptually independent.

They may run:

- sequentially for simpler control flow
- in parallel to reduce total latency

The implementation choice should depend on:

- current service behaviour
- expected latency improvement
- concurrency complexity
- dependency cost
- failure handling

The architectural requirement is that both applicable results can participate in aggregation.

---

# Internal Detection Result

Each engine should be normalized into a common internal structure.

Example:

```json
{
	"category": "contactSharing",
	"source": "regex",
	"evidence": {
		"ruleId": "phone-number-v2"
	}
}
```

Classifier example:

```json
{
	"category": "priceNegotiation",
	"source": "distilbert",
	"evidence": {
		"score": 0.84,
		"threshold": 0.7
	}
}
```

This allows Guardlane to aggregate different engine types consistently.

---

# Result Aggregation

The aggregation layer:

- combines applicable engine results
- removes duplicate categories
- preserves the contributing sources
- attaches model and rule metadata
- records whether processing was complete or partial

Example:

```json
{
	"category": "contactSharing",
	"sources": [
		{
			"engine": "regex",
			"ruleId": "phone-number-v2"
		},
		{
			"engine": "distilbert",
			"score": 0.96
		}
	]
}
```

Aggregation does not decide whether Marketplace Q&A should allow, warn, or block.

---

# Stable Response Contract

A conceptual Guardlane response is:

```json
{
	"requestId": "request-123",
	"status": "complete",
	"language": "en",
	"categories": [
		{
			"id": "contactSharing",
			"sources": [
				{
					"engine": "regex",
					"ruleId": "phone-number-v2"
				},
				{
					"engine": "distilbert",
					"score": 0.96
				}
			]
		}
	],
	"metadata": {
		"modelVersion": "3.0.0",
		"regexRuleVersion": "regex-v5",
		"routingVersion": "routing-v2"
	}
}
```

Marketplace Q&A should not need to know:

- SageMaker tensor formats
- LLM provider response formats
- regex implementation details

---

# Processing Status

Guardlane must distinguish among:

## Complete

All required engines completed successfully.

## Partial

Some moderation evidence is available, but one applicable engine failed.

## Failed

Guardlane could not produce a trustworthy moderation result.

A dependency failure must not be returned as:

```text
No categories detected
```

A clean result and a failed result are different states.

---

# Partial Failure Policy

Examples:

## Regex Succeeds, Semantic Engine Fails

Guardlane may return:

- available regex evidence
- partial status
- semantic failure metadata

The consuming service applies the documented policy for partial results.

## Semantic Engine Succeeds, Persistence Fails

The moderation result may still be returned successfully.

Persistence failure is recorded separately because it does not invalidate the inference result.

## Language Detection Fails

Guardlane should not guess between DistilBERT and the LLM route unless a documented fallback exists.

---

# Asynchronous Persistence

After producing the moderation result, Guardlane publishes a moderation event for storage and later review.

The event may contain:

- original question
- detected language
- regex matches
- classifier scores
- LLM categories
- aggregated categories
- engine versions
- timestamps
- trace identifiers

Persistence should not unnecessarily delay the synchronous response.

---

# Observability

The service should measure:

- request volume
- total latency
- regex latency
- language-routing latency
- SageMaker latency and failures
- LLM latency and failures
- aggregation failures
- complete, partial, and failed result counts
- route distribution
- persistence failures

Logs and traces should use shared request and correlation identifiers.

Full question text should not be logged unless explicitly approved.

---

# Extensibility

Guardlane should allow future engines to be added without changing the public API unnecessarily.

Possible future engines include:

- multilingual classifiers
- category-specific models
- additional rule engines
- alternative LLM providers

Each new engine should implement the same internal detection-result contract.

---

# Key Architecture Decisions

1. Guardlane is the moderation orchestrator, not merely a model wrapper.
2. Regex handles deterministic detection.
3. DistilBERT handles supported English semantic moderation.
4. The LLM handles non-English semantic fallback.
5. Engine outputs are normalized before aggregation.
6. Guardlane returns evidence; Marketplace Q&A applies policy.
7. Partial failures remain visible.
8. Persistence is separated from the synchronous moderation path.

---

# Engineering Principle

> Guardlane should present one stable moderation capability even as the internal rules, models, routing, and providers evolve.
