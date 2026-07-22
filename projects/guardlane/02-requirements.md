# Requirements

## Vision

Guardlane provides real-time moderation for buyer and seller discussions on the Vehicle Question & Answer platform.

Its purpose is to prevent policy-violating content from entering marketplace conversations while helping users immediately revise their message and continue the bidding workflow.

The moderation experience should feel like an integrated product capability rather than a delayed or separate review process.

---

## Actors

### Buyer

Submits questions about a vehicle before bidding.

### Seller

Responds to buyer questions and provides information about the vehicle.

### Buyer Service

Owns the Question & Answer discussion workflow and coordinates moderation before accepting a message.

### Guardlane Service

Provides the moderation interface used by the buyer service.

It sends text for classification, interprets the model response, records moderation information, and returns the applicable decision.

### SageMaker Endpoint

Hosts the trained moderation model and returns the categories detected in the submitted text.

### Product and Operations Users

Use moderation metrics and decision data to understand platform behaviour, review policy trends, and evaluate the effectiveness of the moderation system.

### Engineering

Operates the service, investigates failures, monitors latency, and improves the moderation system.

---

## Real-Time Moderation Flow

When a buyer submits a question:

1. The Question & Answer workflow sends the message through the buyer service.
2. The buyer service calls the Guardlane service before completing the submission.
3. Guardlane sends the text to the model hosted on SageMaker.
4. The model evaluates the text against all supported moderation categories.
5. Guardlane determines whether one or more categories have been flagged.
6. If no category is flagged, the submission is allowed to continue.
7. If one or more categories are flagged, the question is not accepted.
8. The user remains in the question text box and receives guidance asking them to rephrase the message.
9. The guidance should be relevant to the detected policy violation where possible.
10. The user may revise the text and submit it again.

All moderation occurs synchronously within the user interaction.

---

## Core Business Rules

### BR-01: Moderate Before Publication

Questions and answers must be evaluated before they become visible within the marketplace discussion.

### BR-02: Block Flagged Content

A message must not be accepted when the system identifies one or more supported policy violations.

### BR-03: Allow Valid Content Immediately

Messages that do not trigger a moderation category should proceed without requiring manual review.

### BR-04: Support Multiple Violations

A single message may belong to multiple moderation categories.

The moderation response must preserve all applicable categories rather than selecting only one.

### BR-05: Provide Corrective Guidance

When a message is blocked, the user should receive a clear and relevant instruction to rephrase it.

The experience should help the user complete the intended task rather than only displaying a generic rejection.

### BR-06: Preserve the Real-Time Bidding Experience

Moderation must not introduce a delay that materially disrupts the Question & Answer or bidding workflow.

### BR-07: Record Moderation Decisions

Moderation requests, outcomes, flagged categories, and operational metrics should be recorded for observability, reporting, and future model evaluation.

### BR-08: Policies Must Remain Extensible

New moderation categories should be introduced without requiring a redesign of the complete Question & Answer workflow.

---

## Moderation Categories

Guardlane supports multi-label classification across seven policy categories.

### Contact Sharing

Detects attempts to exchange phone numbers, email addresses, or other contact details that could move communication or transactions outside the marketplace.

### Profanity

Detects abusive, offensive, or profane language that violates marketplace communication standards.

### As-Is Statements

Detects statements that may create guarantees or misleading expectations about vehicles sold under As-Is conditions.

This category is particularly important because seller responses may later be referenced during arbitration.

### Negative Negotiation

Detects statements that improperly influence, discourage, or interfere with the intended auction and negotiation process without necessarily containing profanity.

### Dealer Targeting

Detects unsupported accusations or harmful claims directed at a dealer, such as allegations of fraud without substantiation.

### Irrelevant or Spam Content

Detects discussions that are unrelated to the vehicle or bidding process, including spam-like messages and general commentary resembling open social discussions.

### Organization Targeting

Detects messages directed against Openlane, partner organizations, or related marketplace entities in a manner that could undermine trust or create reputational risk.

---

## Functional Requirements

### FR-01: Accept Moderation Requests

Guardlane must accept message text from the buyer service for classification.

### FR-02: Evaluate All Categories

Each request must be evaluated against all supported moderation categories.

### FR-03: Return Multi-Label Results

The response must indicate every category that has been flagged.

### FR-04: Return a Moderation Decision

The response must clearly indicate whether the message may proceed or must be revised.

### FR-05: Support Category-Relevant Messaging

The caller must receive enough information to display an appropriate rephrasing message to the user.

### FR-06: Integrate Synchronously

The buyer service must receive the moderation result before completing the Question & Answer submission.

### FR-07: Persist Operational Data

The system must retain sufficient information to support dashboards, model evaluation, operational troubleshooting, and policy analysis.

### FR-08: Support Questions and Answers

The moderation architecture should support both buyer questions and seller responses, even when rollout occurs in stages.

---

## Non-Functional Requirements

### Latency

The moderation response must be fast enough to preserve an interactive Question & Answer experience.

The user should not perceive moderation as a separate asynchronous process.

### Availability

Moderation is part of the message submission path and therefore requires an explicit strategy for service or model unavailability.

The precise fallback behaviour must be documented as an architectural decision.

### Scalability

The system must support increasing Question & Answer traffic without requiring one-to-one operational scaling.

### Extensibility

Moderation categories, thresholds, user messages, and policy behaviour should be capable of evolving as Product identifies new risks.

### Observability

The system must expose:

- request volume
- response latency
- detected categories
- allowed and blocked decisions
- model or endpoint failures
- category distribution
- operational errors

### Auditability

Engineering and Product should be able to understand why a message was blocked and which categories contributed to the decision.

### Maintainability

The buyer service should not contain model-specific logic.

Model interaction and moderation interpretation should remain encapsulated within Guardlane.

### Security and Privacy

Stored moderation data should be limited to what is required for operation, evaluation, and policy analysis, and should follow the organization's data-handling requirements.

---

## Constraints

- Moderation is executed within a live marketplace interaction.
- Real-time LLM inference was not suitable as the primary production solution because of latency and cost.
- The dataset was highly imbalanced across the seven moderation categories.
- A single message may trigger multiple labels.
- The project introduced the organization's first model deployment workflow using SageMaker.
- Moderation policies evolved during repeated Product and Engineering review sessions.

---

## Out of Scope

Unless added in a later phase, the initial Guardlane scope does not include:

- open-ended conversational rewriting of the user's message
- automatic publication followed by retrospective moderation
- replacing Product ownership of moderation policy
- fully autonomous handling of arbitration cases
- using moderation classifications as proof of user intent
- guaranteeing that every harmful statement can be detected

---

## Acceptance Criteria

A moderation request is considered successfully processed when:

- the message is evaluated against all seven categories
- every applicable category is returned
- valid content is allowed to continue
- flagged content is blocked before publication
- the user receives relevant rephrasing guidance
- the moderation result is returned within the interactive submission flow
- the decision and required operational information are available for monitoring
- model or service failures can be identified through observability
