# Dataset Engineering

## Purpose

This document explains how the dataset for Guardlane’s English multi-label classifier was created, refined, validated, and prepared for model training.

Guardlane is a hybrid moderation platform.

Its detection paths include:

- regex-based deterministic detection
- an English DistilBERT classifier
- an LLM fallback for non-English content

This document focuses specifically on the dataset used to train and evaluate the English classifier.

It does not define the quality process for:

- regex rules
- language detection
- non-English LLM moderation
- final marketplace enforcement policy

Those components require separate validation mechanisms.

---

# Dataset Scope

The classifier dataset represents English Marketplace Question & Answer content.

Its purpose is to train a model that predicts one or more product-defined moderation categories.

The dataset does not claim to provide:

- multilingual coverage
- complete marketplace-policy coverage
- exhaustive support for every future category
- validation of regex patterns
- validation of LLM moderation quality

The classifier should only be trusted within the scope supported by its training and evaluation data.

---

# Dataset Objective

The dataset should enable the classifier to answer:

> Which moderation categories apply to this English marketplace question?

A single question may belong to:

- no moderation category
- one category
- multiple categories

This makes the dataset multi-label rather than multi-class.

---

# Dataset Record

A conceptual training record contains:

```text id="t7xkm4"
Question Text

Labels:
- Category A
- Category B
```

A structured representation may look like:

```json id="rpf61a"
{
	"text": "Call me at this number and I will make an offer.",
	"labels": ["Contact Sharing", "Price Negotiation"]
}
```

For training, labels may be transformed into a binary vector.

Example:

```text id="cz3qdc"
Contact Sharing:       1
Price Negotiation:     1
Dealer Targeting:      0
Unrelated Content:     0
```

Each category remains independent.

---

# Dataset Sources

The English classifier dataset was created using multiple sources.

These may include:

- historical marketplace questions
- existing production moderation examples
- LLM-assisted labels
- manually reviewed examples
- synthetic examples
- normal non-violating questions

Each source serves a different purpose and carries different quality risks.

---

# Historical Marketplace Data

Historical data provides real examples of how buyers communicate.

It captures:

- informal language
- spelling mistakes
- abbreviations
- incomplete sentences
- marketplace terminology
- mixed intents
- realistic ambiguity

Historical data is valuable because it reflects actual product usage rather than invented examples.

---

## Historical Data Challenges

Historical production data may contain:

- incomplete context
- noisy labels
- outdated user behaviour
- duplicate questions
- near-duplicate questions
- rare categories
- privacy-sensitive content
- unclear moderation intent

Historical data must therefore be cleaned and validated before being treated as training truth.

---

# Moderation Taxonomy

The dataset was organized around a product-defined moderation taxonomy.

The taxonomy was developed collaboratively by Product and Engineering.

Product contributed:

- marketplace policy
- buyer and seller expectations
- intended product behaviour
- operational concerns

Engineering contributed:

- historical-data analysis
- category overlap analysis
- training feasibility
- label consistency
- model capability considerations

---

## Historical Validation

The proposed categories were validated against historical marketplace questions.

The analysis considered:

- whether each category occurred in real data
- whether the category was distinct
- whether examples could be labeled consistently
- whether categories overlapped
- whether the category had enough training examples
- whether the definition required revision

This prevented the model taxonomy from becoming disconnected from actual marketplace behaviour.

---

# Multi-Label Annotation

A question may contain more than one moderation concern.

Example:

```text id="2rx6zo"
Text me at 519-555-1234. This dealer is dishonest.
```

Possible labels:

- Contact Sharing
- Dealer Targeting

The annotation process therefore preserves every applicable category rather than forcing one primary label.

---

## Annotation Principle

Labels should describe the content present in the question.

They should not encode the final Marketplace Q&A action.

For example:

```text id="57cp3c"
Prediction:
Contact Sharing

Business Decision:
Block
```

The dataset trains the model to identify the category.

It does not train the model to decide whether the product should allow, warn, or block.

---

# Initial LLM-Assisted Labeling

An LLM was used to help classify portions of historical data.

This enabled the team to create an initial labeled dataset faster than a completely manual process.

The LLM-assisted labels provided:

- category candidates
- scalable initial classification
- support for taxonomy exploration
- early visibility into class distribution

---

## Quality Boundary

LLM-generated labels were not assumed to be perfect ground truth.

Potential risks included:

- incorrect category interpretation
- missed secondary labels
- inconsistent classification
- hallucinated reasoning
- prompt sensitivity
- bias toward obvious examples

The generated labels therefore required validation through:

- sampling
- manual review
- distribution analysis
- error analysis
- product and engineering feedback

---

# Normal Questions

The dataset must contain questions that do not violate moderation policies.

Normal examples are essential because a classifier trained mainly on violations may over-flag production traffic.

Normal questions may include:

- valid product questions
- shipping questions
- condition questions
- availability questions
- feature questions
- ordinary buyer inquiries

---

## Importance of Negative Examples

Negative examples teach the model when not to flag content.

They help reduce false positives, particularly for questions containing words that resemble moderation concerns without actually violating policy.

Example:

```text id="2jb80g"
Does the vehicle support wireless phone charging?
```

The word “phone” appears, but the question is not sharing contact information.

---

# Class Imbalance

Historical datasets rarely contain equal numbers of examples for every category.

Common categories may have thousands of examples.

Rare categories may contain only a small number.

This creates several risks:

- the model may ignore rare categories
- high overall accuracy may hide poor minority-class recall
- threshold behaviour may differ substantially by category
- evaluation metrics may be dominated by common classes

---

## Class Distribution Analysis

Before training, category counts should be reviewed.

For each category, the team should examine:

- positive example count
- negative example count
- percentage of dataset
- co-occurring labels
- duplicate rate
- synthetic-to-real ratio
- label confidence
- linguistic diversity

---

# Traditional Text Augmentation

Traditional augmentation approaches were evaluated to increase the number of examples for rare categories.

These approaches may include:

- word replacement
- synonym substitution
- minor paraphrasing
- phrase reordering
- template-based generation

---

## Limitation Observed

Traditional augmentation often created additional records without creating enough meaningful diversity.

Observed issues included:

- near-duplicate sentences
- repeated sentence structures
- small vocabulary changes
- unrealistic phrasing
- preservation of the same narrow patterns

This increased dataset size but did not proportionally improve the model’s ability to generalize.

---

## Engineering Lesson

> More rows do not automatically mean more information.

The objective of augmentation is not merely to increase sample count.

It is to increase the range of realistic ways a category may appear.

---

# LLM-Assisted Synthetic Data

LLM-assisted synthetic generation was introduced to create more diverse examples for underrepresented categories.

The LLM was used to generate examples with variation in:

- sentence structure
- wording
- tone
- intent expression
- length
- spelling quality
- directness
- marketplace context
- category combinations

---

## Example Generation Goals

For a category such as Contact Sharing, generation should not produce only obvious examples such as:

```text id="rwn6wf"
Call me at 519-555-1234.
```

It should also include realistic variation such as:

```text id="lq2gkt"
Can I send you my number?

Reach me outside the platform.

My phone is five one nine...

Message me directly and we can discuss it.
```

These examples represent different linguistic expressions of the same moderation intent.

---

# Synthetic Data Validation

Synthetic data must be treated as proposed training material rather than automatic ground truth.

Validation should include:

- category correctness
- language quality
- realism
- duplicate detection
- near-duplicate detection
- category leakage
- label completeness
- balanced variation
- avoidance of impossible marketplace scenarios

---

## Human Review

Human review is especially important for:

- rare categories
- ambiguous examples
- multi-label examples
- examples close to category boundaries
- examples generated with unusual wording

Reviewers should be able to:

- accept the example
- reject the example
- correct labels
- rewrite unrealistic text
- identify taxonomy ambiguity

---

# Real and Synthetic Data Balance

Synthetic data should strengthen the dataset without replacing real production behaviour.

An excessively synthetic dataset may teach the model:

- artificial language patterns
- prompt-generated style
- overly clear policy violations
- unrealistic sentence structure
- insufficient ambiguity

The dataset should preserve a meaningful base of real historical examples.

---

## Recommended Analysis

For each category, track:

- number of real examples
- number of synthetic examples
- synthetic percentage
- test-set composition
- evaluation performance on real-only examples
- performance on synthetic examples
- production review outcomes after release

---

# Duplicate Management

Duplicate and near-duplicate examples can distort evaluation.

If similar examples appear in both training and test sets, the model may appear to generalize when it is actually memorizing.

Duplicate management should include:

- exact duplicate removal
- normalized-text comparison
- near-duplicate similarity checks
- template-family identification
- synthetic-generation batch review

---

## Split Before Augmentation

Where practical, the source data should be divided into training, validation, and test sets before synthetic augmentation.

Synthetic variants derived from a source example should remain in the same logical split as that source.

This prevents leakage between training and evaluation data.

---

# Dataset Splitting

The dataset should be divided into:

- training set
- validation set
- test set

---

## Training Set

Used to update model parameters.

May contain:

- real historical examples
- validated LLM-labeled examples
- approved synthetic data
- class-balancing additions

---

## Validation Set

Used during model development for:

- threshold tuning
- model comparison
- hyperparameter decisions
- early stopping
- error analysis

The validation set should not be repeatedly modified to make results look better.

---

## Test Set

Used for final evaluation of a model version.

The test set should represent realistic English production questions.

It should remain isolated from:

- training
- augmentation
- prompt refinement
- threshold experimentation where possible

---

# Multi-Label Split Considerations

Simple random splitting may create poor category representation.

The split process should consider:

- rare labels
- label combinations
- category co-occurrence
- normal-question distribution
- synthetic and real example balance
- duplicate families

The goal is not necessarily identical percentages in every split.

The goal is to ensure that evaluation includes meaningful representation of each category.

---

# Dataset Quality Dimensions

Dataset quality should be evaluated across several dimensions.

## Label Accuracy

Does each example have the correct categories?

---

## Label Completeness

Are all applicable categories included?

---

## Linguistic Diversity

Do examples represent multiple ways users express the same behaviour?

---

## Production Realism

Do questions resemble real marketplace communication?

---

## Category Separation

Are categories defined clearly enough for consistent annotation?

---

## Class Coverage

Are rare categories represented sufficiently for training and evaluation?

---

## Negative Coverage

Does the dataset include realistic non-violating examples close to category boundaries?

---

## Language Scope

Is the dataset consistently English, or are unsupported languages entering the classifier dataset unintentionally?

---

# Language Filtering

Because the classifier is intended for English semantic moderation, the dataset should be reviewed for language consistency.

Possible actions include:

- detect likely language
- remove unsupported-language records
- flag mixed-language records for review
- preserve approved English-language marketplace terminology
- document code-switching decisions

---

## Mixed-Language Questions

Some production questions may contain:

- English plus another language
- transliterated words
- names or phrases from another language
- numeric or symbolic content

These cases require an explicit policy.

They should not be silently assigned to the English classifier dataset without evaluation.

---

# Relationship to Regex

Regex rules do not require classifier training data.

They require a separate rule-validation dataset.

A regex validation set should contain:

- true-positive patterns
- legitimate text resembling the pattern
- formatting variations
- spacing variations
- punctuation variations
- obfuscated patterns
- false-positive boundary cases

Example:

```text id="1n4zcd"
Possible Match:
519-555-1234

Possible False Positive:
Vehicle part number 519-555-1234
```

The regex engine should be evaluated using:

- precision
- recall where measurable
- false-positive cases
- rule-level test coverage
- rule-version comparison

Regex quality must not be inferred from DistilBERT metrics.

---

# Relationship to the LLM Fallback

The non-English LLM fallback does not use the English classifier training dataset as its primary quality basis.

Its evaluation requires separate multilingual test cases.

These should include:

- representative supported languages
- translated category examples
- native-language examples
- ambiguous cases
- multi-label cases
- non-violating questions
- structured-output validation
- prompt-version comparison

---

## LLM Fallback Quality Risks

Risks include:

- inconsistent category naming
- response-format failure
- translation ambiguity
- cultural context differences
- prompt sensitivity
- category omission
- provider-model changes
- unsupported-language variation

These risks should be evaluated separately from the classifier.

---

# One Taxonomy, Multiple Quality Systems

All detection engines should align to one product-defined moderation taxonomy.

However, they do not share one evaluation mechanism.

| Component          | Primary Quality Method                              |
| ------------------ | --------------------------------------------------- |
| Regex engine       | Rule tests and boundary cases                       |
| English classifier | Labeled train, validation, and test datasets        |
| LLM fallback       | Multilingual evaluation suite and output validation |
| Aggregation layer  | Contract and integration tests                      |
| Business policy    | Product and application tests                       |
| Dashboard review   | Human validation and production feedback            |

This distinction prevents classifier metrics from being incorrectly treated as proof of total Guardlane quality.

---

# Data Privacy

Marketplace questions may contain personal information.

Dataset handling should account for:

- access controls
- retention requirements
- secure storage
- approved use of external LLM providers
- masking or redaction where required
- limiting unnecessary copies
- reviewer access
- deletion workflows

Synthetic generation prompts should not expose unapproved production data to external providers.

---

# Dataset Versioning

Every classifier model release should reference a dataset version.

A dataset version should identify:

- source-data version
- taxonomy version
- labeling version
- synthetic-generation version
- preprocessing version
- split version
- excluded data
- quality-review status

---

## Example Metadata

```json id="c74kdm"
{
	"datasetVersion": "guardlane-en-v3",
	"taxonomyVersion": "taxonomy-v2",
	"preprocessingVersion": "prep-v4",
	"syntheticGenerationVersion": "synthetic-v2",
	"trainingSplitVersion": "split-v3",
	"languageScope": "en"
}
```

---

# Reproducibility

The dataset pipeline should make it possible to understand how a model release was produced.

Reproducibility may include:

- source references
- preprocessing scripts
- label mappings
- filtering rules
- split logic
- augmentation settings
- generation prompts
- random seeds
- review status
- dataset statistics

Perfect reproduction may not always be possible when external LLMs change, but the process should remain traceable.

---

# Dataset Metrics

Useful dataset metrics include:

- total examples
- examples per category
- percentage of normal questions
- multi-label example count
- label co-occurrence
- average labels per question
- real versus synthetic ratio
- duplicate rate
- near-duplicate rate
- rejected synthetic rate
- manually reviewed percentage
- language-filter rejection count

---

# Error Analysis

Model evaluation should feed back into dataset improvement.

For each error, investigate whether the cause is:

- insufficient training examples
- incorrect label
- missing secondary label
- unclear taxonomy
- synthetic-data artifact
- weak category separation
- unsupported language
- threshold configuration
- model limitation
- legitimate ambiguity

Not every model error should lead directly to more training data.

Some errors indicate a domain or policy problem rather than a data-volume problem.

---

# Production Feedback

After release, human-reviewed production records may become candidates for future dataset versions.

Potential sources include:

- accepted predictions
- rejected predictions
- corrected categories
- false positives
- false negatives
- new language patterns
- newly observed category combinations
- changing marketplace behaviour

---

## Production Data Admission

Production feedback should not automatically enter the training set.

It should pass through:

- review
- deduplication
- privacy checks
- taxonomy validation
- quality approval
- split assignment
- dataset versioning

---

# Dataset Lifecycle

```text id="sndmqz"
Historical English Questions
          |
          v
Cleaning and Filtering
          |
          v
Initial Labeling
          |
          v
Human Validation
          |
          v
Taxonomy Refinement
          |
          v
Class Distribution Analysis
          |
          v
Synthetic Data Generation
          |
          v
Synthetic Data Review
          |
          v
Deduplication
          |
          v
Train / Validation / Test Split
          |
          v
Model Training and Evaluation
          |
          v
Production Review Feedback
          |
          v
Future Dataset Version
```

---

# What This Dataset Proves

The English classifier dataset can support claims about:

- English moderation-category performance
- classifier precision
- classifier recall
- classifier F1
- category-specific behaviour
- threshold tuning
- model-version comparison

---

# What This Dataset Does Not Prove

It does not by itself prove:

- regex accuracy
- multilingual moderation quality
- LLM fallback quality
- end-to-end Guardlane reliability
- final business-policy correctness
- production effectiveness
- model-drift resistance
- human-review consistency

Those require separate evidence.

---

# Future Improvements

Potential future improvements include:

- larger manually verified datasets
- multilingual classifier datasets
- active learning
- disagreement-based sampling
- reviewer-consensus measurement
- automated duplicate detection
- category-boundary datasets
- production replay datasets
- adversarial examples
- obfuscated contact-sharing examples
- language-specific evaluation sets
- data-drift analysis

---

# Engineering Principles

## Data scope defines model scope

A model trained on English data should be presented as an English classifier.

---

## Dataset size is not dataset quality

Diversity, correctness, realism, and coverage matter more than raw row count.

---

## Synthetic data supplements reality

Generated examples should improve coverage without replacing real marketplace behaviour.

---

## Every detection engine requires its own evidence

Classifier metrics cannot validate regex rules or an LLM fallback.

---

## Labels represent evidence, not enforcement

The dataset teaches moderation categories, not final product decisions.

---

## Production feedback should be curated

Human-reviewed production data is valuable, but it must pass through quality controls before retraining.

---

# Final Engineering Principle

> A hybrid AI system may share one business taxonomy, but each detection engine must earn trust through evidence appropriate to how that engine works.
