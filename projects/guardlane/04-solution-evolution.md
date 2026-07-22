# Solution Evolution

## Purpose

This document captures how Guardlane evolved from an initial proof of concept into a production-ready moderation platform.

Rather than presenting only the final architecture, this document explains the engineering journey, including experiments, discarded approaches, major architectural decisions, and lessons learned along the way.

---

# Phase 1 — Understanding the Business Problem

The project began with understanding the operational challenges faced by the Vehicle Question & Answer platform.

Product identified several categories of undesirable conversations that negatively affected marketplace trust and increased operational overhead.

At this stage, no machine learning or technical solution had been selected.

The objective was to validate whether automated moderation was feasible.

---

# Phase 2 — Gemini Proof of Concept

The first implementation used Google's Gemini.

Goals:

- Validate moderation accuracy
- Demonstrate business value
- Identify moderation categories
- Build stakeholder confidence

Results

- Successful proof of concept
- Positive Product feedback
- Dashboard prototype created
- Moderation workflow validated

Engineering Lesson

Before optimizing implementation, first validate that the business problem can actually be solved.

Related ADR

- ADR-001

---

# Phase 3 — Production Reality

Following MVP approval, the engineering focus shifted from experimentation to production readiness.

New constraints emerged:

- Latency
- Cost
- Rate limits
- Scalability

The question changed from:

"Can AI moderate conversations?"

to

"Can AI moderate every conversation in real time?"

This transition fundamentally changed the technical direction of the project.

Related ADR

- ADR-001

---

# Phase 4 — TensorFlow Experiment

The first production experiment involved building a custom TensorFlow classifier.

Motivation

- Learn the training pipeline
- Evaluate custom model performance
- Apply prior machine learning experience

Observations

- Limited labelled data
- Poor language understanding
- Generalization challenges

Outcome

Experiment discontinued.

Engineering Lesson

Not every prototype deserves further investment. Early experiments are valuable when they reduce uncertainty quickly.

Related ADR

- ADR-001

---

# Phase 5 — Transfer Learning

The project adopted transfer learning using DistilBERT.

Reasons

- Strong pretrained language understanding
- Lower data requirements
- Better production performance

This decision shifted the project toward modern NLP practices.

Related ADR

- ADR-001

---

# Phase 6 — Dataset Engineering

Model quality became increasingly dependent on data quality rather than model architecture.

Work included:

- Historical data collection
- LLM-assisted labeling
- Dataset balancing
- Synthetic example generation
- Train/validation/test split

This became one of the largest engineering efforts in the project.

Related ADRs

- ADR-004
- ADR-005

---

# Phase 7 — Production Platform

Once the model matured, attention shifted toward production engineering.

Major additions:

- SageMaker deployment
- Guardlane service
- Dashboard
- Metrics
- Logging
- Observability

The project evolved beyond machine learning into a complete production platform.

---

# Evolution Timeline

Business Problem

↓

Gemini MVP

↓

ADR-001

↓

TensorFlow Prototype

↓

Transfer Learning

↓

Dataset Engineering

↓

Production Deployment

↓

Observability

↓

Continuous Improvement

---

# Key Lessons

- Validate business value before optimizing architecture.
- Let production constraints guide technology choices.
- Data quality can have a greater impact than model complexity.
- Record engineering decisions as the system evolves.
- Production success depends on more than model accuracy.

---

# Related Documents

- 01-business-context.md
- 02-requirements.md
- 03-domain-model.md
- 05-dataset-engineering.md

---

# Related ADRs

- ADR-001
- ADR-002
