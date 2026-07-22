# Architecture Decisions

# ADR-001: Replace Gemini with DistilBERT for Production Moderation

**Status:** Accepted

## Context

The initial implementation of Guardlane focused on validating whether AI could reliably moderate marketplace conversations.

A proof of concept using Google's Gemini demonstrated that Large Language Models could successfully classify vehicle discussions into moderation categories. The MVP was presented to Product together with evaluation metrics and validated the business concept.

However, once the project transitioned from proof of concept to production design, it became clear that invoking an external LLM for every user interaction would not satisfy the operational requirements of the Question & Answer platform.

The moderation workflow executes synchronously while buyers and sellers interact with the marketplace, making inference latency a critical product requirement.

In addition, LLM inference introduced significantly higher operating costs and external API rate limits, both of which would become increasingly important as platform usage grew.

The challenge therefore shifted from **"Can AI solve this problem?"** to **"How can AI solve this problem reliably at production scale?"**

---

## Decision

Replace the Gemini-based moderation pipeline with a fine-tuned transformer model hosted internally on Amazon SageMaker.

After experimentation, DistilBERT was selected as the production model.

---

## Engineering Journey

### Phase 1 — Gemini MVP

The project intentionally began with Gemini rather than immediately building a machine learning model.

The objective was to validate the moderation concept with Product as quickly as possible while measuring classification quality.

This reduced delivery risk and allowed moderation categories to evolve before investing in a production ML pipeline.

---

### Phase 2 — TensorFlow Prototype

The next experiment involved training a TensorFlow model from scratch.

This decision was partly educational and partly technical.

Drawing on previous university experience in image classification, the hypothesis was that a custom model could learn the marketplace-specific moderation patterns.

However, experimentation quickly exposed two major limitations:

- the available labelled dataset was too small and highly imbalanced
- a model trained from scratch lacked the language understanding required for robust text classification

The TensorFlow approach was abandoned on the first day of experimentation.

---

### Phase 3 — Transfer Learning

Rather than training language understanding from scratch, the project adopted transfer learning.

This approach reused language representations learned from large public corpora while fine-tuning only for Openlane's moderation policies.

This significantly reduced the amount of labelled data required while improving generalization.

---

## Why DistilBERT?

DistilBERT was selected because it provided the best balance between production performance and operational efficiency.

Reasons included:

- lightweight transformer architecture
- strong English language understanding
- well-supported within the Hugging Face ecosystem
- suitable for relatively short marketplace messages (typically fewer than 250 characters)
- substantially lower inference latency than hosted LLMs
- predictable operating cost
- straightforward deployment to Amazon SageMaker

---

## Alternatives Considered

### Continue using Gemini

**Pros**

- Excellent classification capability
- Minimal ML engineering effort
- Ideal for rapid prototyping

**Cons**

- Higher latency
- Higher inference cost
- External API rate limits
- Less predictable operational characteristics

---

### Train TensorFlow Model from Scratch

**Pros**

- Complete architectural control
- Educational value
- No dependency on pretrained models

**Cons**

- Poor language understanding
- Limited training data
- Inferior generalization
- Longer experimentation cycle

---

### DistilBERT

**Pros**

- Fast inference
- Lower operational cost
- Strong pretrained language representations
- Production-ready deployment
- Good balance of accuracy and efficiency

**Cons**

- English-focused model
- Future multilingual support would require model replacement or extension

---

## Trade-offs

The project accepted increased ML engineering complexity in exchange for significantly lower production latency and operating cost.

Additional work became necessary in:

- dataset engineering
- transfer learning
- SageMaker deployment
- model versioning
- MLOps

These investments enabled Guardlane to operate as a real-time moderation platform rather than a proof of concept.

---

## Consequences

This decision fundamentally changed the direction of the project.

Instead of becoming an LLM integration project, Guardlane evolved into a complete production ML platform including:

- dataset engineering
- synthetic data generation
- model training
- MLOps
- inference services
- operational dashboards
- production observability

---

## Looking Back

Given today's technology landscape, DistilBERT would likely not be selected again.

The primary reason is multilingual expansion.

The next generation of Guardlane is expected to support both English and French, requiring evaluation of newer multilingual transformer models while maintaining the same production latency objectives.

However, given the constraints, tooling, and project goals at the time, DistilBERT represented an appropriate engineering decision.

## Engineering Principle

Validate business value before optimizing implementation.

Prototype quickly to reduce uncertainty.

Invest in production-grade architecture only after the business problem has been proven.

# ADR-002: Adopt Multi-label Classification Instead of Multi-class Classification

**Status:** Accepted

## Context

During the design of Guardlane, it became clear that marketplace conversations frequently expressed more than one moderation concern within the same message.

The moderation categories represented independent business policies rather than mutually exclusive classes.

Forcing each message into a single category would oversimplify the moderation outcome and reduce the quality of user feedback.

## Decision

Guardlane uses a multi-label classification model, allowing a single message to belong to multiple moderation categories simultaneously.

Each moderation category is evaluated independently, and the final prediction may contain one or more policy violations.

## Context from Real Marketplace Conversations

Example:

> "Hey, 42000 for this is greedy."

This message simultaneously represents:

- **Negative Semantic** — the seller is described using negative language.
- **Negotiation** — the buyer is attempting to negotiate or criticize the asking price.

Both moderation policies are relevant.

Another example:

> "Call me at 519-xxx-xxxx. This dealer is a scam."

Possible labels:

- Contact Sharing
- Dealer Targeting

These are independent moderation concerns and should both be surfaced.

## Alternatives Considered

### Multi-class Classification

Each message receives exactly one label.

**Pros**

- Simpler training
- Simpler evaluation
- Simpler inference

**Cons**

- Loses important moderation context
- Cannot represent multiple simultaneous policy violations
- Reduced explainability to users

---

### Multi-label Classification

Each moderation category is predicted independently.

**Pros**

- Matches real marketplace behaviour
- Supports overlapping policy violations
- Produces richer moderation insights
- Easier to extend with future categories

**Cons**

- More complex training and evaluation
- Threshold tuning required for each category

## Trade-offs

The project accepted additional model complexity because the moderation rules themselves were independent business policies rather than mutually exclusive outcomes.

This design more accurately represented real user behaviour and allowed moderation feedback to explain all detected issues instead of selecting only one.

## Consequences

This decision influenced several downstream components:

- Dataset labeling strategy
- Model architecture
- Evaluation metrics
- API response format
- Dashboard visualizations
- Future category expansion

The moderation service now returns a collection of detected policy violations rather than a single classification result.

## Future Considerations

As moderation policies evolve, new categories can be introduced without fundamentally changing the prediction model or API contract, making the system more adaptable to future business requirements.

## Production Examples

### Example 1

**Message**

> "Hey, $42,000 for this is greedy."

**Detected Categories**

- Negotiation

**Reasoning**

The message attempts to negotiate or criticize the listed price rather than requesting information about the vehicle. Guardlane identifies this as a negotiation attempt and discourages price discussions within the Q&A platform.

---

### Example 2

**Message**

> "Call me at 519-555-1234. $42,000 is greedy."

**Detected Categories**

- Contact Sharing
- Negotiation

**Reasoning**

The message contains two independent moderation concerns:

- It attempts to move the conversation off-platform by sharing contact information.
- It introduces price negotiation, which falls outside the intended purpose of the Q&A feature.

Both policies apply simultaneously, making this a multi-label prediction.

---

### Example 3

**Message**

> "This dealer is a scam. Call me at 519-555-1234."

**Detected Categories**

- Dealer Targeting
- Contact Sharing

**Reasoning**

The message attacks the seller while also encouraging communication outside the marketplace. Since these represent separate business policies, both labels are returned.

## Engineering Principle

Business policies are not always mutually exclusive.

System design should model real-world behaviour rather than simplifying it for implementation convenience.

---

# Future ADR Template

## ADR-XXX: Title

**Status:** Proposed | Accepted | Superseded | Rejected

## Context

Describe the business or engineering problem that required a decision.

---

## Decision

Describe the selected approach.

---

## Engineering Journey _(Optional)_

If the decision evolved through multiple experiments, capture the progression here.

---

## Alternatives Considered

Explain the realistic alternatives and why they were not selected.

---

## Trade-offs

Describe the advantages and disadvantages accepted with this decision.

---

## Consequences

Explain how this decision influenced the remainder of the project.

---

## Production Examples _(Optional)_

Provide representative examples that demonstrate why this decision was necessary.

---

## Future Considerations

Would this decision still be made today?

If not, what would likely replace it?

---

## Engineering Principle

Capture the reusable lesson that applies beyond this specific project.
