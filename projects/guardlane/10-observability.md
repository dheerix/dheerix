# Observability

## Purpose

Deploying a machine learning model into production is only the beginning of its lifecycle.

Unlike traditional software, model quality can change over time as user behaviour, marketplace language, and data distributions evolve.

Guardlane therefore treats observability as two complementary concerns:

- **Platform Observability** — Is the service healthy?
- **Model Observability** — Is the model making good decisions?

Together, these provide visibility into both system reliability and moderation quality.

---

# Observability Philosophy

The objective is not simply to detect service failures.

The objective is to answer four operational questions.

1. Is Guardlane available?

2. Is Guardlane performing within acceptable latency?

3. Is the model behaving as expected?

4. Is moderation quality improving over time?

Traditional service monitoring answers the first two.

Model observability answers the remaining questions.

---

# Layers of Observability

```text
Buyer
    │
Marketplace Q&A
    │
Guardlane (.NET)
    │
Honeycomb
    │
SageMaker
    │
Prediction
    │
Dashboard
    │
Human Review
```

Each layer contributes different operational signals.

---

# Application Observability

The Guardlane service is instrumented using **Honeycomb** to provide visibility into request execution and production behaviour.

Application telemetry includes:

- request execution
- service latency
- inference duration
- failures
- production diagnostics
- operational troubleshooting

This enables engineers to investigate production issues without relying solely on infrastructure logs.

---

# Infrastructure Observability

Amazon SageMaker provides operational metrics for the deployed inference endpoint.

Infrastructure monitoring focuses on:

- endpoint availability
- invocation health
- inference latency
- endpoint failures
- deployment status

Infrastructure telemetry answers whether the model endpoint is functioning correctly.

It does not determine whether the predictions themselves are correct.

---

# Model Observability

Model observability measures prediction quality rather than infrastructure health.

Guardlane captures moderation outcomes to evaluate:

- category distribution
- prediction confidence
- model behaviour over time
- human validation
- future retraining opportunities

Unlike CPU utilization or memory usage, these metrics indicate whether the moderation system continues to satisfy business objectives.

---

# Human-in-the-Loop Validation

A central part of Guardlane's operational design is the Human-in-the-Loop (HITL) workflow.

Rather than assuming every prediction is correct, selected moderation decisions are surfaced for review.

Reviewers can:

- accept predictions
- reject predictions
- identify incorrect categories
- improve future datasets

These validated examples become valuable inputs for future model iterations.

The operational feedback loop therefore continues after deployment.

---

# Phase 1 Dashboard

The first production dashboard was designed for three primary audiences.

## Operations

Operations teams require visibility into production moderation activity.

Typical operational views include:

- moderation volume
- processing status
- review queues
- operational trends

---

## Product

Product teams require visibility into marketplace behaviour.

Examples include:

- moderation category distribution
- changing user behaviour
- policy impact
- review outcomes

These insights help determine whether moderation policies continue to align with marketplace goals.

---

## Engineering

Engineering requires visibility into model performance.

Phase 1 includes evaluation metrics such as:

- F1 Score
- validation metrics
- prediction review
- human-labelled corrections

These measurements help determine whether future model versions improve or regress.

---

# Quality Metrics

Unlike traditional services, model quality cannot be measured using uptime alone.

Representative quality metrics include:

- Precision
- Recall
- F1 Score
- confusion analysis
- category-specific performance
- reviewer agreement

These metrics are evaluated alongside operational behaviour rather than replacing it.

---

# Operational Feedback Loop

The moderation lifecycle continues beyond prediction.

```text
Historical Data
        │
Training
        │
Deployment
        │
Production Predictions
        │
Human Review
        │
Validated Labels
        │
Future Training Dataset
```

This creates a continuous improvement cycle where production usage contributes to future model evolution.

---

# Correlation and Traceability

The long-term architecture supports end-to-end traceability of a moderation request.

Conceptually:

```text
Buyer Question
        │
Marketplace Request
        │
Guardlane Request
        │
Honeycomb Trace
        │
SageMaker Inference
        │
Persisted Moderation Record
        │
Dashboard Review
```

This allows engineers to investigate:

- how a prediction was produced
- which model generated it
- how the application responded
- whether reviewers agreed with the prediction

Complete request traceability significantly reduces production debugging effort.

---

# Production Investigations

Observability enables investigation of questions such as:

- Why did moderation latency increase?
- Did a deployment affect prediction quality?
- Which categories are becoming more common?
- Which categories generate the most corrections?
- Which model version produced this prediction?
- Are reviewers consistently disagreeing with certain categories?

Answering these questions requires both operational telemetry and model evaluation data.

---

# Future Evolution

Future observability enhancements may include:

- distributed tracing across services
- automated drift detection
- threshold monitoring
- model version comparisons
- confidence distribution analysis
- production replay evaluation
- alerting on quality regressions
- real-time operational dashboards

These capabilities extend observability beyond service health toward continuous model governance.

---

# Engineering Principles

### Observe both systems and models

Infrastructure metrics reveal whether the service is running.

Model metrics reveal whether it is making good decisions.

Both are required in production.

---

### Production is the beginning of learning

Deployment is not the end of the machine learning lifecycle.

Production feedback continuously improves future model versions.

---

### Human expertise remains part of the system

Machine learning accelerates moderation.

Human reviewers provide the ground truth needed to validate, correct, and evolve the model over time.

---

### Trace every decision

Every moderation decision should be explainable from user request to model prediction, business outcome, and human validation.

Strong traceability enables reliable operations, easier debugging, and confident model evolution.
