# Model Engineering

## Purpose

This document explains the engineering of Guardlane’s English semantic classifier.

Guardlane is a hybrid moderation platform that combines:

- regex-based deterministic detection
- an English multi-label classifier
- an LLM fallback for non-English content

This document focuses on the classifier path:

- why a supervised model was selected
- why DistilBERT was chosen
- how multi-label classification works
- how the model is trained and evaluated
- how category thresholds are applied
- where the model’s capability ends
- how its output participates in the broader Guardlane pipeline

The classifier is an important component of Guardlane, but it is not the entire moderation system.

---

# Model Responsibility

The classifier answers:

> Which product-defined moderation categories are present in this English marketplace question?

It does not decide:

- whether the buyer should be blocked
- whether the buyer should receive a warning
- whether the question should be delivered to the seller
- whether a regex match should override another result
- how non-English content should be moderated

Those responsibilities belong to other parts of the system.

---

# Model Scope

The classifier is designed for:

- English Marketplace Question & Answer content
- a fixed product-defined moderation taxonomy
- multi-label prediction
- category-level confidence scoring
- low-latency production inference

The classifier is not assumed to support:

- all languages
- arbitrary moderation policies
- unseen categories without retraining
- deterministic extraction of every structured pattern
- final product enforcement

---

# Why a Specialized Classifier

The initial moderation solution relied more heavily on an LLM.

As the problem became better defined, the primary English moderation path developed several characteristics:

- stable taxonomy
- repeated request pattern
- labeled historical data
- high request volume
- latency sensitivity
- cost sensitivity
- need for category-level metrics
- need for predictable structured output

These characteristics made a supervised classifier a strong fit.

---

# Why DistilBERT

DistilBERT was selected as the English semantic classifier.

It preserves much of the contextual language understanding of BERT while using a smaller and faster architecture.

For Guardlane, the expected advantages included:

- lower inference latency than an LLM-first path
- lower runtime cost
- deterministic output shape
- repeatable evaluation
- compatibility with multi-label classification
- Hugging Face ecosystem support
- practical deployment through Amazon SageMaker

---

## Trade-Offs

DistilBERT is more specialized than a general-purpose LLM.

This creates limitations:

- it only predicts known categories
- it requires labeled training data
- it may degrade as language changes
- it does not automatically provide multilingual coverage
- taxonomy changes may require retraining
- it may struggle with rare or highly ambiguous phrasing

These trade-offs are accepted for the primary English path because the narrower model provides greater efficiency and predictability.

---

# Why Not Use the LLM for Every Request?

An LLM remains useful within Guardlane, but not as the default English classification engine.

Using the LLM for every request would provide broader flexibility, but would also introduce:

- higher latency
- higher cost
- more output variability
- prompt sensitivity
- more complex response validation
- less stable category-level evaluation
- greater provider dependency

The final architecture gives the LLM narrower responsibilities:

- non-English moderation fallback
- synthetic training-data generation

This allows Guardlane to retain LLM flexibility without paying its full operational cost on every English request.

---

# Why Not Use Regex for Every Category?

Regex is effective for deterministic textual patterns.

Examples include:

- phone numbers
- email addresses
- URLs
- fixed identifiers

However, many moderation categories depend on meaning and intent.

Examples include:

- price negotiation
- dealer targeting
- attempts to move a conversation outside the platform
- unrelated content
- contextual policy violations

These cannot be represented reliably through a finite set of patterns.

The classifier therefore handles semantic moderation while regex handles explicit deterministic patterns.

---

# Multi-Label Classification

A marketplace question may contain multiple moderation concerns.

Example:

```text id="6g89m1"
Text me at 519-555-1234. This dealer is a fraud.
```

Possible categories:

- Contact Sharing
- Dealer Targeting

A multi-class classifier would force one category.

A multi-label classifier evaluates each category independently.

---

# Output Representation

Suppose the taxonomy contains four categories:

```text id="0pqut4"
Contact Sharing
Price Negotiation
Dealer Targeting
Unrelated Content
```

The target label vector may look like:

```text id="lv8hqs"
[1, 0, 1, 0]
```

This means:

```text id="0t6u7r"
Contact Sharing:       Present
Price Negotiation:     Not Present
Dealer Targeting:      Present
Unrelated Content:     Not Present
```

---

# Model Architecture

Conceptually, the classifier contains:

```text id="cxaa6q"
Question Text
      |
      v
Tokenizer
      |
      v
DistilBERT Encoder
      |
      v
Classification Head
      |
      v
One Logit Per Category
      |
      v
Sigmoid Activation
      |
      v
Independent Category Probabilities
```

Unlike softmax, sigmoid does not force category probabilities to compete with each other.

This is essential because several categories may be valid simultaneously.

---

# Tokenization

The tokenizer converts the question into model inputs such as:

- input identifiers
- attention mask
- token boundaries
- truncation and padding

The tokenizer version must be released with the model.

A model and tokenizer should be treated as one deployable unit.

---

## Input Length

Marketplace questions are generally short, but maximum sequence length still affects:

- inference cost
- memory use
- truncation risk
- batching behaviour

The chosen maximum length should be based on observed dataset distribution rather than an arbitrary default.

Questions exceeding the supported input length should be:

- truncated intentionally
- rejected explicitly
- or handled through a documented alternative

Silent uncontrolled truncation may remove the part of the message containing a policy violation.

---

# Classification Head

The classification head produces one output logit for each moderation category.

For `N` categories:

```text id="gtnzth"
Output Dimension = N
```

Each output is converted independently into a probability using sigmoid.

Conceptually:

```text id="v2rtsh"
Probability(category_i) = sigmoid(logit_i)
```

These probabilities are model outputs.

They are not final business decisions.

---

# Training Objective

Multi-label classification commonly uses binary cross-entropy loss.

Each category contributes independently to the total loss.

Conceptually:

```text id="mdkj40"
Total Loss =
Binary Cross-Entropy for Category 1
+
Binary Cross-Entropy for Category 2
+
...
+
Binary Cross-Entropy for Category N
```

The model is penalized for both:

- failing to identify a true category
- incorrectly predicting a category that is absent

---

# Class Imbalance

Not all moderation categories occur equally often.

Common categories may dominate training unless imbalance is addressed.

Potential techniques include:

- class-weighted loss
- positive-class weighting
- validated oversampling
- synthetic-data generation
- balanced batches
- threshold tuning
- category-specific analysis

No single technique should be assumed to solve imbalance completely.

---

## Weighted Loss

Rare positive labels may receive greater weight during training.

This can improve sensitivity to rare classes, but may also increase false positives.

Weights must therefore be evaluated using category-level precision and recall rather than accepted solely because minority recall improves.

---

# Training Pipeline

A conceptual training pipeline is:

```text id="987f4d"
Versioned English Dataset
          |
          v
Preprocessing
          |
          v
Tokenizer
          |
          v
Training Split
          |
          v
DistilBERT Fine-Tuning
          |
          v
Validation Evaluation
          |
          v
Threshold Tuning
          |
          v
Test Evaluation
          |
          v
Model Release Artifacts
```

---

# Preprocessing

Preprocessing should preserve meaningful marketplace language.

It may include:

- removal of invalid records
- consistent whitespace handling
- label-vector construction
- language-scope filtering
- maximum-length handling
- duplicate management

Preprocessing should be conservative.

Aggressive text normalization may remove useful signals such as:

- punctuation
- number formatting
- obfuscation
- abbreviations
- spelling variations

---

# Training Configuration

A training run should record configuration such as:

- base model version
- tokenizer version
- dataset version
- taxonomy version
- number of categories
- maximum sequence length
- batch size
- learning rate
- number of epochs
- optimizer
- class weights
- random seed
- checkpoint selection rule
- early-stopping configuration

This information should remain traceable to the released model.

---

# Validation

The validation set supports:

- hyperparameter selection
- training monitoring
- threshold tuning
- model comparison
- error analysis

Validation performance should be examined at both:

- overall level
- category level

A strong aggregate metric may hide poor performance on a rare but important category.

---

# Evaluation Metrics

Because Guardlane uses multi-label classification, no single metric describes the entire model.

Relevant metrics include:

- precision
- recall
- F1 score
- false-positive rate
- false-negative rate
- per-category support
- micro averages
- macro averages
- exact-match ratio
- Hamming loss

---

## Precision

Precision answers:

> Of the questions flagged for this category, how many actually belonged to the category?

High precision reduces unnecessary moderation actions.

---

## Recall

Recall answers:

> Of the questions that belonged to this category, how many did the model detect?

High recall reduces missed violations.

---

## F1 Score

F1 balances precision and recall.

It is useful when both false positives and false negatives matter.

However, F1 does not encode the business cost of each error.

Two categories with the same F1 may require different operating thresholds.

---

## Micro Average

Micro averaging combines predictions across all categories before calculating the metric.

It is influenced more strongly by common categories.

---

## Macro Average

Macro averaging calculates the metric separately for each category and then averages them.

It gives rare categories equal influence but may become unstable when some categories have very little support.

---

# Independent Category Thresholds

The classifier produces probabilities.

A probability becomes a category flag only after threshold application.

For category `i`:

```text id="96b3fl"
Flag category_i when:

probability_i >= threshold_i
```

Each category may use a different threshold.

---

## Why Not One Global Threshold?

Categories differ in:

- training-data volume
- classifier confidence
- ambiguity
- business risk
- false-positive tolerance
- false-negative tolerance

A global threshold would assume that all categories behave identically.

That assumption is rarely justified.

---

## Threshold Ownership

Thresholds sit between model evidence and application policy.

They should be:

- developed using validation data
- reviewed with category-level metrics
- versioned with the model release
- observable in production
- changeable without retraining where practical

Thresholds should not be hidden inside application code without traceability.

---

# Model Output

A conceptual classifier output may look like:

```json id="ozw0gg"
{
	"modelVersion": "guardlane-en-v3",
	"scores": {
		"contactSharing": 0.96,
		"priceNegotiation": 0.73,
		"dealerTargeting": 0.08
	},
	"thresholds": {
		"contactSharing": 0.8,
		"priceNegotiation": 0.7,
		"dealerTargeting": 0.75
	},
	"flaggedCategories": ["contactSharing", "priceNegotiation"]
}
```

This output is then normalized by Guardlane and combined with other applicable engine results.

---

# Relationship to the Regex Engine

The classifier and regex engine solve different classes of problems.

## Regex Output

May contain:

- matched rule identifier
- matched category
- match position
- rule version
- optional masked evidence

## Classifier Output

May contain:

- category probabilities
- category flags
- model version
- threshold version

The aggregation layer combines them into a unified moderation result.

---

## Overlapping Detection

A category may be detected by more than one engine.

For example, Contact Sharing might be identified by:

- a phone-number regex
- the semantic classifier

The aggregation layer should avoid returning duplicate categories while preserving useful evidence.

Conceptually:

```json id="3f7v8t"
{
	"category": "contactSharing",
	"sources": [
		{
			"engine": "regex",
			"rule": "phone-number-v2"
		},
		{
			"engine": "distilbert",
			"score": 0.96
		}
	]
}
```

The model itself should not own cross-engine aggregation.

---

# Relationship to the LLM Fallback

The DistilBERT classifier is the semantic engine for supported English requests.

The LLM is the semantic fallback for non-English or otherwise unsupported language input.

Conceptually:

```text id="dkgwl0"
Language Detection
        |
        +--> Supported English
        |        |
        |        v
        |    DistilBERT
        |
        +--> Non-English
                 |
                 v
             LLM Fallback
```

The English classifier and LLM should return results aligned to the same moderation taxonomy.

Their outputs may differ in form, but Guardlane normalizes them into the same internal representation.

---

# Capability Boundary

The classifier should only be trusted within evaluated conditions.

Known boundaries include:

- English-language scope
- current taxonomy
- observed marketplace question length
- represented linguistic patterns
- available rare-category examples
- current threshold configuration
- current training-data distribution

Inputs outside these boundaries should not automatically be interpreted as low-risk.

---

## Unsupported Language Is Not Low Confidence

A non-English question may produce arbitrary or misleading scores from an English classifier.

Therefore:

```text id="94gyqp"
Unsupported Language
is not equivalent to
Low Model Confidence
```

The correct response is capability-aware routing, not blind reliance on the classifier score.

---

# Confidence Interpretation

Classifier probabilities are useful signals, but they are not guaranteed calibrated probabilities of real-world correctness.

A score of `0.90` does not automatically mean that the prediction is correct 90% of the time.

If calibrated confidence is required, the team should evaluate techniques such as:

- temperature scaling
- isotonic regression
- reliability diagrams
- expected calibration error

Threshold tuning and calibration are related but distinct activities.

---

# Error Analysis

Model errors should be reviewed systematically.

For each false positive or false negative, determine whether the likely cause is:

- insufficient data
- incorrect label
- missing secondary label
- category overlap
- ambiguous taxonomy
- threshold choice
- synthetic-data artifact
- unsupported language
- truncation
- model limitation
- product-policy ambiguity

---

## Example False Positive

Question:

```text id="ghpmqu"
Does the car have wireless phone charging?
```

Possible incorrect result:

```text id="z9hu86"
Contact Sharing
```

Potential cause:

The model may associate “phone” too strongly with contact-sharing examples.

Potential improvement:

Add more valid questions containing words such as:

- phone
- number
- contact
- call

without actual contact-sharing intent.

---

## Example False Negative

Question:

```text id="bedvhe"
Let's talk somewhere else. I can send my details.
```

Possible missed category:

```text id="g4gwya"
Contact Sharing
```

Potential cause:

The training data may contain too many explicit phone-number examples and too few indirect attempts to move communication off-platform.

Potential improvement:

Add diverse semantic examples rather than only more explicit patterns.

---

# Model Selection

Model selection should not be based on one aggregate metric.

A candidate model should be evaluated using:

- category-level precision
- category-level recall
- category-level F1
- macro and micro metrics
- latency
- artifact size
- endpoint cost
- failure behaviour
- threshold stability
- real-only evaluation performance
- expected production traffic

---

## Offline Performance vs Production Suitability

The model with the highest offline F1 may not be the best production model.

A slightly lower-scoring model may be preferable if it provides:

- materially lower latency
- more stable category behaviour
- smaller cost
- simpler deployment
- fewer severe false positives
- better performance on high-priority categories

Production suitability is a multi-dimensional decision.

---

# Model Release Artifacts

A classifier release should include:

- model weights
- model configuration
- tokenizer files
- category mapping
- thresholds
- taxonomy version
- training configuration
- dataset version
- evaluation results
- release manifest

---

## Release Manifest

A conceptual release manifest may contain:

```json id="9x4bx7"
{
	"modelName": "guardlane-distilbert",
	"modelVersion": "3.0.0",
	"languageScope": ["en"],
	"datasetVersion": "guardlane-en-v3",
	"taxonomyVersion": "taxonomy-v2",
	"tokenizerVersion": "distilbert-base-uncased",
	"thresholdVersion": "thresholds-v3",
	"numberOfLabels": 7,
	"trainingRun": "run-2026-07-15"
}
```

The manifest ensures that deployment metadata travels with the model.

---

# Reproducibility

A released model should be traceable to:

- source code revision
- dataset version
- preprocessing version
- training configuration
- base model version
- random seed
- dependency versions
- evaluation results
- threshold configuration

Perfect numerical reproduction may not always be guaranteed, but the engineering path should remain understandable and auditable.

---

# Inference Contract Boundary

The SageMaker endpoint should expose model-specific inference.

Guardlane should expose moderation-specific inference.

This distinction matters.

## SageMaker-Level Response

May contain:

- raw logits
- probabilities
- model-specific arrays
- label indices

## Guardlane-Level Response

Should contain:

- business category identifiers
- scores
- flagged categories
- model version
- normalized metadata

The Marketplace Q&A service should not need to understand model tensor formats.

---

# Failure Behaviour

The classifier path must distinguish between:

- successful inference with no categories
- successful inference with categories
- endpoint timeout
- endpoint error
- invalid response
- parsing failure
- model-version mismatch

A failed classifier invocation must not be converted into an empty successful prediction.

---

# Model Observability

Production model observability should include:

- classifier invocation count
- classifier latency
- endpoint errors
- score distributions
- category-flag frequency
- threshold version
- model version
- input-length distribution
- language-routing errors
- reviewer agreement
- false-positive reports
- false-negative reports

Model health cannot be inferred only from endpoint availability.

---

# Drift

Potential drift may include:

- new marketplace terminology
- new obfuscation patterns
- changing user behaviour
- category-policy changes
- language-distribution changes
- changes in category prevalence
- new forms of negotiation or contact sharing

Drift may appear as:

- lower reviewer agreement
- changed score distributions
- rising false positives
- rising false negatives
- category-frequency shifts

---

# Retraining Triggers

Retraining should be evidence-driven.

Potential triggers include:

- validated production errors
- accumulated human-reviewed data
- taxonomy changes
- sustained metric degradation
- new marketplace behaviour
- poor rare-category performance
- significant distribution change

A calendar alone should not determine whether retraining is necessary.

---

# Future Model Improvements

Potential future work includes:

- multilingual supervised models
- a multilingual transformer
- category-specific specialist models
- probability calibration
- improved class weighting
- active learning
- hard-negative mining
- adversarial examples
- knowledge distillation from the LLM
- shadow deployments
- ensemble evaluation
- model-version comparison
- automated drift detection

---

# What the Classifier Proves

When evaluated correctly, the model can provide evidence about:

- English category classification
- category-level precision
- category-level recall
- category-level F1
- threshold behaviour
- latency and runtime characteristics
- improvement between classifier versions

---

# What the Classifier Does Not Prove

Classifier metrics do not prove:

- regex-rule quality
- non-English moderation quality
- LLM fallback quality
- routing correctness
- aggregation correctness
- final business-policy correctness
- end-to-end production reliability
- operational adoption

These require separate validation.

---

# Engineering Principles

## Use specialization where the problem is stable

A focused classifier can outperform a general-purpose solution operationally when the taxonomy and data are well understood.

---

## Respect model capability boundaries

A model should process only the inputs for which it has supporting data and evaluation.

---

## Multi-label problems require independent outputs

Moderation categories must not compete when several can be correct simultaneously.

---

## Scores are evidence, not decisions

Probabilities and thresholds contribute to moderation evidence. Product applications determine user-facing action.

---

## Evaluate per category

Aggregate metrics must not hide failure in rare or high-risk categories.

---

## The model is one engine in a larger system

Production moderation quality depends on routing, regex, the LLM fallback, aggregation, policy, and operations—not only classifier accuracy.

---

# Final Engineering Principle

> A production model should be trusted not because it is intelligent, but because its scope, evidence, failure modes, and role within the larger system are explicitly understood.
