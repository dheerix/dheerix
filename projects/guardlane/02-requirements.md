# Requirements

## Purpose

This document defines the functional and non-functional requirements for Guardlane.

Guardlane is a hybrid moderation service for Marketplace Question & Answer content.

It coordinates multiple detection strategies:

- deterministic regex rules
- an English multi-label classifier hosted on Amazon SageMaker
- an LLM fallback for non-English content

Guardlane returns moderation evidence.

It does not decide the final user-facing action.

The consuming Marketplace Q&A service remains responsible for applying business policy such as:

- allow
- warn
- block

---

# 1. Business Requirements

## BR-001: Moderate Marketplace Questions

The system must analyze buyer-submitted marketplace questions before they are delivered to sellers.

The moderation process should identify content that may violate marketplace policies.

---

## BR-002: Support Multiple Moderation Categories

A question may violate more than one moderation policy.

The system must therefore support multiple flagged categories for a single request.

Example:

```text
Call me at 519-555-1234. This dealer is a scam.
```

Possible results:

- Contact Sharing
- Dealer Targeting

---

## BR-003: Support Product-Defined Moderation Categories

Moderation categories must represent business and product policy.

The taxonomy should be defined collaboratively by Product and Engineering and validated against historical marketplace data.

---

## BR-004: Preserve Business-Policy Ownership in Marketplace Q&A

Guardlane must not directly determine whether a question is:

- allowed
- warned
- blocked

Guardlane should return moderation evidence.

The Marketplace Q&A service must remain responsible for applying business policy.

---

## BR-005: Support Multilingual Marketplace Content

The moderation system must provide a supported path for non-English questions.

The English classifier must not be treated as reliable for languages outside its training scope.

Non-English content should be routed to an LLM-based moderation fallback.

---

## BR-006: Support Operational Review

Moderation outcomes must be available for operational and human review.

Reviewers should be able to:

- inspect the original question
- inspect predicted categories
- inspect confidence or match information
- accept or reject moderation predictions
- provide future training feedback

---

# 2. Functional Requirements

## FR-001: Accept Moderation Requests

Guardlane must accept a moderation request containing the marketplace question and relevant request metadata.

Possible metadata may include:

- request identifier
- question identifier
- marketplace context
- caller information
- trace identifier

The exact API contract should remain versioned and documented.

---

## FR-002: Validate Incoming Requests

Guardlane must validate required request fields before invoking downstream detection engines.

Invalid requests should return a structured error response.

Validation should prevent unnecessary calls to:

- regex processing
- SageMaker
- the LLM fallback

---

## FR-003: Determine Input Language

Guardlane must determine whether the input is supported by the English classifier.

The routing decision should distinguish at minimum between:

- supported English input
- unsupported or non-English input

The language result should be available as moderation metadata where appropriate.

---

## FR-004: Evaluate Deterministic Patterns

Guardlane must evaluate configured deterministic patterns using a regex-based engine.

The regex engine should be used for content that can be detected reliably through explicit textual patterns.

Examples may include:

- phone numbers
- email addresses
- URLs
- configured identifiers
- other known marketplace patterns

Regex rules must be:

- configurable
- testable
- version-controlled
- observable

---

## FR-005: Perform English Semantic Classification

Supported English content must be evaluated using the trained multi-label classifier hosted on Amazon SageMaker.

The classifier must return independent category scores.

The classifier must not assume that only one moderation category can apply.

---

## FR-006: Use an LLM Fallback for Non-English Content

When the input is outside the supported language capability of the English classifier, Guardlane must use an LLM-based fallback.

The fallback should return moderation results aligned with the same product-defined taxonomy used by the classifier.

The LLM response must be normalized into the Guardlane moderation response contract.

---

## FR-007: Aggregate Detection Results

Guardlane must combine the outputs produced by the applicable detection engines.

Possible inputs to aggregation include:

- regex matches
- classifier category scores
- classifier threshold results
- LLM moderation categories
- language metadata
- model or engine metadata

The result should be returned through a unified moderation contract.

The aggregation logic must define how duplicate or overlapping categories are handled.

---

## FR-008: Return Flagged Categories

The response must include all categories identified by the active moderation engines.

A single request may return:

- no categories
- one category
- multiple categories

---

## FR-009: Return Confidence and Match Evidence

Where available, the response should expose sufficient evidence for the consuming system and operational tooling.

Possible evidence includes:

- classifier confidence scores
- matched regex rule identifiers
- LLM-selected categories
- language
- engine used
- model version
- threshold version

The response should not expose provider-specific formats directly to the consuming service.

---

## FR-010: Preserve a Stable Moderation Contract

The Marketplace Q&A service should consume one stable Guardlane contract regardless of whether a result was produced by:

- regex
- DistilBERT
- the LLM fallback
- a combination of engines

Internal engine changes should not require unnecessary changes to the consuming application.

---

## FR-011: Support Independent Category Thresholds

Each classifier category must support its own decision threshold.

A single global threshold must not be assumed to be optimal for every moderation category.

Thresholds should be:

- versioned
- configurable through the deployment process
- included in release metadata
- traceable during investigation

---

## FR-012: Persist Moderation Events Asynchronously

Moderation requests and results should be persisted outside the synchronous user-facing path where possible.

Persistence must not unnecessarily delay the response to Marketplace Q&A.

Persisted records may include:

- original question
- detected language
- regex matches
- classifier scores
- LLM output
- flagged categories
- model version
- rule version
- thresholds
- review status
- timestamps
- trace identifiers

---

## FR-013: Support Human-in-the-Loop Review

Persisted moderation records must support review through the operational dashboard.

Reviewers should be able to:

- accept the predicted result
- reject the predicted result
- correct the assigned categories
- record reviewer metadata
- record review timestamps

---

## FR-014: Preserve Feedback for Future Training

Validated human-review decisions should be retainable for future:

- dataset construction
- classifier evaluation
- retraining
- threshold tuning
- taxonomy analysis

Human-reviewed data must not automatically become training data without appropriate quality controls.

---

## FR-015: Support Model and Rule Version Traceability

Every moderation result should be traceable to the relevant deployed components.

This may include:

- classifier model version
- tokenizer version
- category mapping version
- threshold version
- regex-rule version
- LLM prompt or configuration version
- release manifest version

---

# 3. Routing Requirements

## RR-001: Route Based on Capability

Guardlane must route semantic moderation requests according to the capability of the available engine.

At minimum:

```text
English
    -> DistilBERT through SageMaker

Non-English
    -> LLM fallback
```

The routing decision must reflect model capability rather than convenience.

---

## RR-002: Keep Regex Independent of Semantic Understanding

Regex evaluation should remain conceptually separate from language-model or classifier inference.

A deterministic pattern may be detectable even when the surrounding text is non-English.

The architecture should therefore allow regex results to participate in the final moderation response independently of the semantic engine selected.

---

## RR-003: Avoid Unsupported Classifier Usage

The English classifier must not be invoked as though it has validated multilingual capability.

Any future multilingual classifier support should require:

- representative data
- evaluation
- documented release criteria
- explicit routing changes

---

## RR-004: Normalize Engine Outputs

All detection engines must return or be converted into a common internal representation before the final response is produced.

The normalization layer should handle differences such as:

- regex matches
- probability scores
- LLM category responses
- provider-specific metadata
- missing confidence values

---

# 4. Integration Requirements

## IR-001: Integrate with Marketplace Q&A

Guardlane must expose an API consumable by the Marketplace Q&A service.

The integration should remain independent of the internal detection-engine implementation.

---

## IR-002: Integrate with Amazon SageMaker

Guardlane must invoke the deployed classifier through a managed SageMaker endpoint.

The integration must support:

- request serialization
- response parsing
- timeouts
- failures
- endpoint authentication
- model-version traceability

---

## IR-003: Integrate with the LLM Provider

Guardlane must support invoking the configured LLM fallback for non-English moderation.

The integration must support:

- structured prompts or instructions
- taxonomy alignment
- response validation
- timeout handling
- malformed-response handling
- provider failures
- configuration versioning

---

## IR-004: Integrate with Asynchronous Persistence

Guardlane must publish or pass moderation data to the persistence workflow without blocking the user-facing response longer than necessary.

Persistence failures should be observable independently of inference success.

---

## IR-005: Integrate with the Operations Dashboard

Persisted moderation records must be available to the dashboard.

The dashboard should not require direct access to SageMaker or the LLM provider.

---

# 5. Non-Functional Requirements

## NFR-001: Low User-Facing Latency

Guardlane participates in an interactive marketplace workflow.

The moderation path must minimize additional user-facing latency.

Latency should be measured separately for:

- total Guardlane request
- regex evaluation
- language detection
- SageMaker inference
- LLM fallback
- aggregation
- persistence dispatch

---

## NFR-002: Reliability

Guardlane must handle dependency failures without returning unstructured or ambiguous responses.

Dependencies include:

- SageMaker
- the LLM provider
- persistence infrastructure
- configuration sources

Failure handling must be documented for each path.

---

## NFR-003: Deterministic Rule Behaviour

Regex rules must produce predictable and repeatable outcomes for the same input and configuration version.

Changes to rules must be reviewable and testable.

---

## NFR-004: Model Traceability

Every model-generated prediction must be attributable to a specific model release.

The release should include the artifacts and configuration required to reproduce the inference behaviour as closely as practical.

---

## NFR-005: Extensibility

The architecture should support adding or replacing detection engines without changing the external Guardlane API unnecessarily.

Potential future engines may include:

- multilingual classifiers
- specialized category models
- additional rule engines
- alternative LLM providers
- ensemble models

---

## NFR-006: Observability

Guardlane must emit enough telemetry to investigate both service health and moderation behaviour.

Observability must include:

### Platform Observability

- request volume
- latency
- error rate
- dependency failures
- timeouts
- route selection
- service health

### Moderation Observability

- categories flagged
- regex-match frequency
- classifier invocation frequency
- LLM fallback frequency
- confidence distributions
- model versions
- rule versions
- review outcomes

---

## NFR-007: Security and Privacy

Moderation content may contain personal or sensitive information.

The system must:

- restrict access to moderation records
- avoid unnecessary logging of full question content
- protect data in transit
- protect stored moderation records
- follow organizational retention requirements
- ensure external providers receive only approved data

---

## NFR-008: Cost Awareness

The architecture should prefer the most appropriate engine without unnecessarily using a more expensive inference path.

Cost should be observable by route, especially for:

- SageMaker inference
- LLM fallback
- dashboard and persistence infrastructure

Cost optimization must not override moderation correctness without an explicit product decision.

---

## NFR-009: Configurability

The following should be configurable or versioned without requiring unrelated code changes:

- category thresholds
- regex rules
- supported language routing
- model release
- endpoint configuration
- LLM configuration
- taxonomy mapping

---

## NFR-010: Testability

The system must support tests for:

- request validation
- language routing
- regex rules
- classifier-response parsing
- LLM-response parsing
- output normalization
- result aggregation
- threshold application
- dependency failures
- asynchronous persistence dispatch

---

# 6. Failure Requirements

## FLR-001: Handle SageMaker Failure

If SageMaker fails, times out, or returns an invalid response, Guardlane must apply the documented failure policy.

The response must not falsely represent failed inference as a successful clean moderation result.

---

## FLR-002: Handle LLM Fallback Failure

If the LLM fallback fails or returns an invalid response, Guardlane must apply the documented failure policy for unsupported-language moderation.

The failure should be:

- observable
- traceable
- distinguishable from a successful non-flagged result

---

## FLR-003: Handle Regex Configuration Errors

Invalid regex configuration must be detected before or during deployment where possible.

A malformed rule should not cause the entire moderation service to fail.

---

## FLR-004: Handle Partial Engine Results

If one detection engine succeeds and another fails, the response behaviour must follow an explicit aggregation and failure policy.

The service must distinguish between:

- complete result
- partial result
- failed moderation request

---

## FLR-005: Handle Persistence Failure Separately

A failure to persist a moderation event must not automatically be treated as an inference failure.

Persistence failures must be observable and recoverable according to the asynchronous-processing design.

---

# 7. Operational Requirements

## OR-001: Expose Route Usage

Operations and Engineering should be able to determine which processing route handled a request.

Examples:

- regex plus English classifier
- regex plus non-English LLM
- English classifier without regex match
- LLM fallback without regex match

This does not require exposing internal complexity directly to the end user.

---

## OR-002: Support Production Investigation

A production request should be traceable across:

- Marketplace Q&A
- Guardlane
- regex evaluation
- SageMaker or LLM invocation
- result aggregation
- asynchronous persistence
- dashboard record

Correlation support may be implemented incrementally, but the architecture must preserve appropriate identifiers.

---

## OR-003: Support Release Comparison

The system should support comparing moderation behaviour across:

- classifier versions
- threshold versions
- regex-rule versions
- LLM configurations
- taxonomy revisions

---

## OR-004: Support Controlled Rollout

Detection-engine or configuration changes should support controlled deployment and rollback where feasible.

Examples include:

- model rollback
- threshold rollback
- regex-rule rollback
- LLM configuration rollback

---

# 8. Out of Scope

Guardlane does not own:

- final buyer-facing enforcement policy
- seller-notification behaviour
- marketplace UI decisions
- manual reviewer staffing
- final legal or policy interpretation
- automatic production retraining without review
- unsupported claims of multilingual classifier quality

These responsibilities remain with the appropriate product, application, operations, policy, or machine-learning owners.

---

# 9. Acceptance Criteria

Guardlane is functionally ready when:

- valid moderation requests are accepted
- invalid requests are rejected clearly
- deterministic patterns are evaluated through regex
- English semantic content is processed through SageMaker
- non-English content is processed through the LLM fallback
- engine outputs are normalized
- multiple categories can be returned
- model, rule, and routing metadata are traceable
- the Q&A service can apply business policy independently
- moderation events are dispatched for asynchronous persistence
- operational telemetry is emitted
- failure paths are testable and observable

Production success criteria should be added after release using real evidence such as:

- latency
- error rates
- route distribution
- regex-match rates
- LLM fallback rates
- moderation quality
- reviewer agreement
- business impact

---

# Engineering Principles

## Use the simplest reliable detector

Deterministic patterns should not require semantic inference.

---

## Respect model capability boundaries

An English classifier should not be treated as multilingual without supporting data and evaluation.

---

## Normalize complexity behind a stable contract

Consumers should receive one moderation response even when multiple internal engines are involved.

---

## Models provide evidence; applications apply policy

Prediction and user-facing enforcement should evolve independently.

---

## A clean result is not the same as a failed result

Dependency failures must never be silently interpreted as approved content.

---

## Production feedback completes the system

Moderation quality must be validated through operational review and real production evidence.
