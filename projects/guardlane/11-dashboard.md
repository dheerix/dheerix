# Dashboard & Operations

## Purpose

Deploying a machine learning model is only one part of building a production moderation system.

Operations teams require visibility into model predictions.

Product teams require visibility into marketplace behaviour.

Engineering teams require visibility into model quality and operational health.

The Guardlane Dashboard provides a centralized operational interface that enables these groups to monitor, review, and improve the moderation system.

---

# Dashboard Philosophy

The dashboard is not intended to display infrastructure metrics alone.

Its primary purpose is to support operational decision-making.

The dashboard enables teams to answer questions such as:

- What is happening in production?
- Which moderation categories are increasing?
- Are model predictions correct?
- Which decisions require human review?
- Is model quality improving over time?
- Should another model version be deployed?

The dashboard therefore becomes part of the machine learning lifecycle rather than simply a reporting tool.

---

# Primary Users

The dashboard is designed for three primary audiences.

## Operations

Operations teams require visibility into production moderation activity.

Typical operational workflows include:

- monitoring moderation volume
- reviewing flagged questions
- investigating moderation decisions
- identifying abnormal behaviour
- supporting marketplace operations

---

## Product

Product teams use moderation data to evaluate marketplace policy.

Typical questions include:

- Which moderation categories occur most frequently?
- How are users interacting with the platform?
- Which behaviours are increasing?
- Should moderation policy change?
- Should new moderation categories be introduced?

---

## Engineering

Engineering teams use the dashboard to evaluate production model behaviour.

Typical activities include:

- reviewing prediction quality
- validating new model versions
- investigating incorrect predictions
- monitoring evaluation metrics
- preparing future training datasets

---

# Phase 1 Dashboard

The initial MVP focuses on validating model quality.

Major capabilities include:

## Model Metrics

Evaluation metrics such as:

- Precision
- Recall
- F1 Score

These provide an overall assessment of classifier performance.

---

## Human-in-the-Loop Review

Moderated questions are presented for human review.

Reviewers can:

- accept the prediction
- reject the prediction
- identify incorrect categories

Human validation becomes future training data.

---

## Moderation Queue

The dashboard displays moderation decisions requiring review.

Each record may include:

- marketplace question
- predicted categories
- prediction confidence
- reviewer decision
- review timestamp

The review workflow closes the feedback loop between production and model improvement.

---

# Operational Workflow

A typical moderation lifecycle is:

Buyer submits question

↓

Guardlane predicts categories

↓

Business policy applied

↓

Moderation event persisted

↓

Dashboard displays event

↓

Human review (when required)

↓

Validated decision stored

↓

Future dataset updated

↓

Next model version trained

The dashboard therefore becomes part of the continuous learning process.

---

# Engineering Benefits

The dashboard provides operational visibility beyond infrastructure monitoring.

Examples include:

- category frequency
- reviewer agreement
- moderation trends
- model quality
- operational feedback
- production validation

These measurements help engineering teams determine whether future model versions represent genuine improvements.

---

# Product Benefits

Product teams gain insight into real marketplace behaviour.

Rather than relying on assumptions, policy decisions can be supported using production moderation data.

Examples include:

- identifying emerging behaviours
- evaluating policy effectiveness
- understanding user communication patterns
- prioritizing future moderation work

---

# Operations Benefits

Operations teams receive a centralized moderation interface.

The dashboard simplifies:

- reviewing predictions
- investigating moderation cases
- validating model behaviour
- supporting production incidents

---

# Future Enhancements

Future dashboard capabilities may include:

- model version comparison
- confidence distribution
- reviewer agreement analysis
- category trend analysis
- false-positive investigation
- false-negative investigation
- model drift detection
- replay evaluation
- threshold comparison
- release comparison
- multilingual moderation support

---

# Relationship to Observability

Observability answers:

> Is the system healthy?

The dashboard answers:

> Is the moderation system effective?

Together they provide complete visibility into both infrastructure health and model quality.

---

# Engineering Principles

## Operations are part of the product

A production model is not complete until operators can understand and manage it.

---

## Human feedback improves machine learning

Production review provides the highest-quality data for future model evolution.

---

## Dashboards should drive decisions

Operational dashboards exist to improve product quality and engineering decisions—not simply to display metrics.

---

## Every prediction is an opportunity to learn

The value of a moderation system increases over time when production feedback continuously improves future models.
