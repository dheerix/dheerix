# Model Deployment

## Purpose

This document explains how Guardlane’s English DistilBERT classifier is packaged, released, deployed, invoked, observed, and rolled back.

Guardlane is a hybrid moderation platform.

Its runtime behaviour also depends on:

- regex rules
- language detection
- semantic routing
- LLM fallback configuration
- aggregation logic
- business taxonomy
- category thresholds

This document focuses primarily on deploying the English classifier to Amazon SageMaker while defining the boundaries between model deployment and the broader Guardlane service release.

A successful model deployment does not, by itself, prove that the complete moderation platform is production-ready.

---

# Deployment Scope

The deployment lifecycle includes two related but distinct concerns.

## Classifier Deployment

Classifier deployment covers:

- model artifacts
- tokenizer artifacts
- inference code
- category mapping
- thresholds
- runtime dependencies
- SageMaker endpoint configuration
- model-version traceability

---

## Guardlane Service Deployment

Guardlane deployment covers:

- API changes
- request validation
- language routing
- regex execution
- SageMaker invocation
- LLM fallback invocation
- result normalization
- result aggregation
- persistence dispatch
- telemetry
- failure policy

The classifier may be deployed independently of Guardlane, but the two releases must remain compatible.

---

# Deployment Architecture

```text
Training Pipeline
      |
      v
Versioned Model Package
      |
      v
Artifact Storage
      |
      v
SageMaker Model
      |
      v
SageMaker Endpoint Configuration
      |
      v
SageMaker Endpoint
      |
      v
Guardlane
      |
      v
Unified Moderation Result
```

The full runtime architecture is:

```text
Marketplace Q&A
      |
      v
Guardlane
      |
      +--> Regex Engine
      |
      +--> Language Detection
      |
      +--> English Route
      |       |
      |       v
      |   SageMaker Endpoint
      |
      +--> Non-English Route
              |
              v
          LLM Fallback
```

---

# Deployment Units

Guardlane should treat the following as separate deployment or configuration units.

| Unit                           | Responsibility                                 |
| ------------------------------ | ---------------------------------------------- |
| Model package                  | DistilBERT weights, tokenizer, inference code  |
| SageMaker endpoint             | Managed English classifier hosting             |
| Threshold configuration        | Converts classifier scores into category flags |
| Regex rules                    | Deterministic pattern definitions              |
| Language-routing configuration | Selects supported semantic path                |
| LLM configuration              | Provider, prompt, model, parsing rules         |
| Guardlane service              | Orchestration and unified API                  |
| Taxonomy mapping               | Stable business category identifiers           |
| Release manifest               | Connects compatible versions                   |

These units may be released together or independently, but compatibility must remain explicit.

---

# Model Package

The model package should contain everything required for inference.

A conceptual package may include:

```text
model.tar.gz

├── model/
│   ├── config.json
│   ├── model.safetensors
│   ├── tokenizer.json
│   ├── tokenizer_config.json
│   ├── special_tokens_map.json
│   └── vocab.txt
│
├── code/
│   ├── inference.py
│   ├── requirements.txt
│   └── validation.py
│
├── metadata/
│   ├── release-manifest.json
│   ├── label-mapping.json
│   ├── thresholds.json
│   └── evaluation-summary.json
```

The exact structure depends on the selected SageMaker container and framework integration.

The important requirement is that inference behaviour remains versioned and traceable.

---

# Release Manifest

The release manifest describes the identity and compatibility of the model release.

Example:

```json
{
	"modelName": "guardlane-distilbert",
	"modelVersion": "3.0.0",
	"languageScope": ["en"],
	"datasetVersion": "guardlane-en-v3",
	"taxonomyVersion": "taxonomy-v2",
	"labelMappingVersion": "labels-v2",
	"thresholdVersion": "thresholds-v3",
	"tokenizerVersion": "distilbert-base-uncased",
	"inferenceCodeVersion": "inference-v4",
	"runtimeVersion": "pytorch-2.x",
	"trainingRun": "run-2026-07-15",
	"sourceRevision": "git-commit-placeholder"
}
```

The manifest should answer:

- Which model is deployed?
- Which dataset produced it?
- Which taxonomy does it use?
- Which thresholds are expected?
- Which tokenizer is required?
- Which inference implementation is compatible?
- Which language does it support?

---

# Artifact Storage

Model packages should be stored in a versioned artifact location.

Possible requirements include:

- immutable model versions
- encryption at rest
- restricted write access
- deployment-role read access
- retention policy
- checksum validation
- traceable upload history

An existing model version should not be silently overwritten.

A new artifact should produce a new version.

---

# SageMaker Model Resource

A SageMaker Model resource associates:

- model artifact
- inference container
- execution role
- environment variables
- runtime configuration

The resource should be named or tagged with the model release identity.

Useful tags may include:

- application
- environment
- model version
- taxonomy version
- owner
- cost centre
- source revision

---

# Endpoint Configuration

The SageMaker Endpoint Configuration defines how the model is hosted.

It may include:

- instance type
- initial instance count
- production variant
- model resource
- traffic weighting
- data capture configuration
- autoscaling compatibility

Endpoint configuration should be versioned separately from the endpoint name.

This enables controlled transitions between model releases.

---

# Stable Endpoint Identity

Guardlane should invoke a stable logical endpoint name where practical.

Example:

```text
guardlane-english-moderation-prod
```

The endpoint configuration behind that name may change between releases.

This avoids requiring Guardlane application changes for every model update.

---

## Stable Name, Versioned Behaviour

Although the endpoint name may remain stable, Guardlane must still record the actual model version serving a request.

A stable endpoint without version traceability makes incident investigation difficult.

---

# Environment Separation

Classifier deployments should be separated by environment.

For example:

```text
guardlane-english-moderation-dev

guardlane-english-moderation-qa

guardlane-english-moderation-prod
```

Each environment may have different:

- model versions
- instance sizes
- scaling policies
- test data
- access controls
- logging configuration

Production traffic must not accidentally invoke a development endpoint.

---

# Inference Contract

Guardlane and the SageMaker endpoint require a defined internal contract.

## Conceptual Request

```json
{
	"text": "Can you call me to discuss the price?",
	"requestId": "request-123"
}
```

The endpoint should validate:

- request body exists
- text exists
- text type is valid
- text length is supported
- encoding is valid

---

## Conceptual Response

```json
{
	"modelVersion": "3.0.0",
	"taxonomyVersion": "taxonomy-v2",
	"scores": {
		"contactSharing": 0.87,
		"priceNegotiation": 0.78,
		"dealerTargeting": 0.04
	}
}
```

The endpoint may return raw scores only.

Thresholding may occur:

- inside the endpoint
- inside Guardlane
- in a dedicated normalization component

The chosen ownership must remain explicit.

---

# Threshold Deployment

Thresholds are part of runtime model behaviour.

Changing thresholds may change moderation outcomes even when model weights remain unchanged.

Therefore, thresholds must be treated as a versioned release artifact.

---

## Threshold Ownership Options

### Thresholds Inside the Model Package

Advantages:

- model and thresholds remain tightly coupled
- easy reproduction
- one deployment unit

Disadvantages:

- threshold changes may require endpoint redeployment
- operational tuning becomes slower

---

### Thresholds Inside Guardlane Configuration

Advantages:

- thresholds may change without model redeployment
- easier operational tuning
- policy and model release can evolve separately

Disadvantages:

- risk of incompatible model and threshold versions
- requires stronger configuration traceability

---

## Recommended Principle

Regardless of physical location:

> Every prediction must be traceable to both a model version and a threshold version.

---

# Category Mapping

The model produces outputs in a fixed order.

Example:

```text
Index 0 -> Contact Sharing
Index 1 -> Price Negotiation
Index 2 -> Dealer Targeting
Index 3 -> Unrelated Content
```

The category mapping must be versioned.

A mismatch between model output order and Guardlane category mapping can silently corrupt moderation results.

This is one of the highest-risk compatibility failures in classifier deployment.

---

## Compatibility Validation

Before deployment, validate that:

- number of model outputs equals number of configured categories
- category identifiers are known
- category order matches the release manifest
- threshold count matches category count
- threshold identifiers match category identifiers
- Guardlane supports the taxonomy version

The deployment should fail rather than silently proceed with incompatible metadata.

---

# Inference Code

The inference implementation is responsible for:

- loading the model
- loading the tokenizer
- validating input
- tokenizing text
- running inference
- applying sigmoid
- serializing output
- returning model metadata
- handling errors

Inference code should not own:

- marketplace business policy
- buyer-facing actions
- non-English routing
- regex aggregation
- dashboard persistence

---

# Model Loading

Model loading should occur during container initialization rather than on every request.

Cold-start behaviour should be measured.

Initialization failures should include enough structured information to identify:

- missing artifact
- incompatible dependency
- invalid configuration
- tokenizer mismatch
- corrupted model package
- memory failure

---

# Request Processing

A conceptual inference path is:

```text
Request
   |
   v
Validate Input
   |
   v
Tokenize
   |
   v
Run DistilBERT
   |
   v
Apply Sigmoid
   |
   v
Create Category Scores
   |
   v
Attach Release Metadata
   |
   v
Return Response
```

---

# Input Validation

The endpoint should reject malformed requests rather than attempting ambiguous inference.

Validation should cover:

- missing text
- null text
- empty text
- unsupported data type
- excessively long input
- malformed JSON
- unexpected batch shape

The endpoint response should distinguish validation failure from inference failure.

---

# Batch Support

If the endpoint supports batches, batch behaviour should be intentional.

Batching can improve throughput but may affect:

- latency
- memory use
- timeout risk
- error isolation
- response ordering

Interactive moderation requests may prioritize predictable single-request latency over maximum batch throughput.

---

# Instance Selection

SageMaker instance selection should consider:

- model size
- request volume
- latency target
- concurrency
- memory requirement
- CPU versus GPU performance
- cost
- scaling delay

A GPU is not automatically required for a model such as DistilBERT.

The appropriate instance should be selected through measurement.

---

# Latency Measurement

Classifier latency should be separated into:

- Guardlane-to-SageMaker network latency
- endpoint queue time
- tokenization time
- model inference time
- response serialization time
- total endpoint duration

End-to-end Guardlane latency should additionally include:

- request validation
- language detection
- regex processing
- routing
- aggregation
- persistence dispatch

This prevents all latency from being incorrectly attributed to the model.

---

# Autoscaling

Autoscaling may be configured using indicators such as:

- invocations per instance
- CPU utilization
- model latency
- concurrent requests
- custom load metrics

Scaling policy should consider both:

- average traffic
- sudden marketplace spikes

Autoscaling does not eliminate cold-start or scale-out delay.

Minimum capacity may still be required to protect interactive latency.

---

# Availability

The endpoint is a production dependency of the English moderation route.

Availability planning may include:

- multiple instances
- health checks
- endpoint alarms
- controlled deployment
- rollback procedures
- timeout configuration
- Guardlane failure policy

A healthy Guardlane service with an unavailable endpoint is not a healthy moderation system.

---

# Timeout Policy

Guardlane must define an explicit SageMaker timeout.

The timeout should balance:

- user-facing latency
- expected endpoint performance
- transient variance
- retry risk
- duplicate inference
- fallback behaviour

Unbounded waiting is not acceptable in an interactive request path.

---

# Retry Policy

Retries may help with transient failures but may also:

- increase latency
- increase endpoint load
- duplicate cost
- amplify incidents
- exceed user-facing time budgets

Retry behaviour should therefore be limited and measured.

A retry should not be added automatically without understanding the failure mode.

---

# Failure Responses

The classifier path should distinguish:

- validation error
- endpoint timeout
- endpoint unavailable
- model-loading failure
- inference exception
- invalid model output
- response parsing failure
- incompatible model version

Guardlane must not convert these failures into:

```text
No moderation categories detected
```

A failed inference is not a clean moderation result.

---

# Model Deployment Strategies

## Direct Replacement

The endpoint configuration is updated to the new model version.

Advantages:

- simple
- low operational complexity

Risks:

- immediate full exposure
- limited comparison
- harder rollback if detection is delayed

---

## Blue-Green Deployment

A new endpoint or endpoint configuration is deployed alongside the current version.

Traffic switches after validation.

Advantages:

- safer rollback
- pre-release health validation
- clean version separation

Risks:

- temporary duplicate infrastructure cost
- more deployment complexity

---

## Canary Deployment

A small portion of traffic is routed to the new model.

Advantages:

- production validation with limited exposure
- model-version comparison
- gradual rollout

Risks:

- traffic-routing complexity
- requires version-aware telemetry
- low-volume categories may need significant time for evidence

---

## Shadow Deployment

The new model receives copied traffic but does not affect the production moderation response.

Advantages:

- behavioural comparison
- no direct user-facing risk
- useful for threshold and score analysis

Risks:

- additional inference cost
- privacy and data-flow review
- duplicated operational volume
- requires comparison tooling

---

# Pre-Deployment Validation

Before model release, validate:

- package integrity
- model loading
- tokenizer compatibility
- category mapping
- threshold compatibility
- taxonomy version
- inference request schema
- inference response schema
- known-example predictions
- latency
- memory usage
- failure behaviour
- model metadata
- Guardlane compatibility

---

## Smoke Test Examples

The test set should include:

- normal English question
- obvious category violation
- multi-label question
- long supported question
- empty input
- malformed request
- near-boundary example
- deterministic pattern with semantic context
- input that should be routed away before classifier invocation

The last case confirms that Guardlane respects the model’s language capability boundary.

---

# Deployment Gates

A production deployment may require gates such as:

- offline metric approval
- category-level metric review
- artifact validation
- security scan
- integration-test success
- endpoint smoke-test success
- latency acceptance
- Guardlane compatibility
- rollback readiness
- stakeholder approval

The exact gate owners should be documented.

---

# Post-Deployment Validation

After deployment, verify:

- endpoint health
- expected model version
- successful Guardlane invocation
- response parsing
- score shape
- threshold application
- category mapping
- latency
- error rate
- telemetry
- persistence records
- dashboard visibility

A deployment is not complete merely because the infrastructure reports success.

---

# Rollback

Rollback should restore a previously approved compatible release.

Rollback may involve:

- previous endpoint configuration
- previous model artifact
- previous thresholds
- previous taxonomy mapping
- previous Guardlane configuration

---

## Rollback Compatibility

Rolling back only the model while retaining incompatible thresholds or category mappings may not restore previous behaviour.

The rollback unit should therefore be defined by the release manifest.

---

# Configuration Compatibility

A model release may depend on:

- taxonomy version
- label mapping
- threshold version
- tokenizer version
- Guardlane contract version

A compatibility matrix can prevent invalid deployments.

Example:

| Model    | Taxonomy    | Thresholds    | Guardlane      |
| -------- | ----------- | ------------- | -------------- |
| Model v3 | Taxonomy v2 | Thresholds v3 | Guardlane 2.4+ |
| Model v2 | Taxonomy v2 | Thresholds v2 | Guardlane 2.1+ |
| Model v1 | Taxonomy v1 | Thresholds v1 | Guardlane 1.x  |

---

# Relationship to Regex Deployment

Regex rules are not deployed through the SageMaker model endpoint.

They belong to a separate rule lifecycle.

A regex-rule release should include:

- rule identifier
- rule pattern
- associated category
- rule version
- activation status
- test cases
- owner
- release notes

---

## Regex Deployment Risks

Potential risks include:

- catastrophic backtracking
- excessive CPU usage
- broad false positives
- invalid syntax
- conflicting rules
- accidental exposure of matched sensitive content

Regex releases require their own test and rollback process.

Classifier deployment success does not validate regex behaviour.

---

# Relationship to Language Routing

Language-routing configuration determines whether DistilBERT is invoked.

A routing release may change:

- supported language list
- confidence boundary
- mixed-language treatment
- unknown-language behaviour
- fallback behaviour

Changing routing can materially affect:

- classifier volume
- LLM volume
- latency
- cost
- moderation quality

Routing changes should therefore be versioned and observable.

---

# Relationship to the LLM Fallback

The LLM fallback has a separate deployment and configuration lifecycle.

Its runtime behaviour may depend on:

- provider
- model name
- model version or alias
- prompt version
- taxonomy instructions
- response schema
- parsing logic
- timeout
- retry policy
- safety configuration

---

## Provider Version Risk

An external LLM provider may update model behaviour even when Guardlane code does not change.

Where possible, the integration should use:

- versioned model identifiers
- prompt versioning
- structured output validation
- release evaluation
- provider-change monitoring

---

## LLM Release Metadata

A normalized result should retain metadata such as:

- provider
- configured model
- prompt version
- parser version
- routing version

This allows production behaviour to be investigated later.

---

# Guardlane Release Manifest

Because Guardlane is hybrid, the platform may benefit from a higher-level release manifest.

Example:

```json
{
	"guardlaneVersion": "2.4.0",
	"taxonomyVersion": "taxonomy-v2",
	"regexRuleVersion": "regex-v5",
	"languageRoutingVersion": "routing-v2",
	"englishModelVersion": "3.0.0",
	"thresholdVersion": "thresholds-v3",
	"llmConfigurationVersion": "llm-config-v4",
	"aggregationVersion": "aggregation-v2",
	"responseContractVersion": "moderation-v2"
}
```

This gives Operations one place to understand the complete runtime combination.

---

# Infrastructure as Code

Where practical, deployment resources should be managed through infrastructure as code.

This may include:

- SageMaker model resource
- endpoint configuration
- endpoint
- IAM roles
- alarms
- autoscaling
- artifact permissions
- environment variables
- logging configuration

Benefits include:

- repeatability
- code review
- environment consistency
- traceability
- rollback support

Manual production changes should be minimized and recorded when unavoidable.

---

# Security

The deployment must account for:

- encrypted artifacts
- encrypted network communication
- least-privilege execution roles
- restricted endpoint access
- secret management
- approved external LLM use
- protected logs
- sensitive-content handling
- auditability

Guardlane should not expose SageMaker credentials or provider secrets through application responses or logs.

---

# Logging

The endpoint should log operational information without unnecessarily logging full question content.

Useful fields include:

- request identifier
- trace identifier
- model version
- inference duration
- input token length
- response category count
- success or failure
- error type

Sensitive question text should be masked, omitted, or handled according to organizational policy.

---

# Metrics

SageMaker and Guardlane should expose metrics such as:

- invocation count
- model latency
- overhead latency
- error count
- timeout count
- CPU or GPU utilization
- memory pressure
- invocation concurrency
- instance count
- scale-out events

Guardlane should additionally measure:

- English-route volume
- LLM-route volume
- regex participation
- total moderation latency
- partial-result rate
- complete-failure rate

---

# Alarms

Potential alarms include:

- endpoint error-rate increase
- timeout-rate increase
- high model latency
- capacity saturation
- no successful invocations
- invalid-response increase
- model-version mismatch
- Guardlane dependency failures
- unexpected routing-volume shift

An alarm should indicate a meaningful operational condition rather than merely reflect normal variance.

---

# Cost Management

SageMaker cost depends on:

- instance type
- instance count
- runtime duration
- scaling floor
- scaling ceiling
- traffic
- deployment overlap

Cost analysis should compare:

- provisioned capacity
- measured utilization
- latency target
- LLM fallback cost
- expected English traffic volume

The cheapest instance is not necessarily the lowest-cost system if it creates latency, scaling, or reliability issues.

---

# Production Readiness

The English classifier path is production-ready when:

- artifacts are versioned
- deployment is reproducible
- endpoint health is observable
- request and response contracts are validated
- language routing protects the capability boundary
- category mapping is verified
- thresholds are traceable
- failure behaviour is explicit
- rollback is tested
- Guardlane integration is validated
- security requirements are met

The complete Guardlane platform additionally requires validated:

- regex configuration
- LLM fallback
- aggregation logic
- persistence
- dashboard flow
- operational ownership

---

# Common Deployment Failure Modes

## Model and Tokenizer Mismatch

The endpoint loads incompatible tokenizer artifacts.

Result:

- degraded predictions
- startup failure
- inconsistent tokenization

---

## Category-Order Mismatch

Model output indices are mapped to the wrong business categories.

Result:

- technically valid response
- semantically incorrect moderation

This is especially dangerous because infrastructure health checks may still pass.

---

## Threshold-Version Mismatch

A new model uses thresholds tuned for an older score distribution.

Result:

- sudden false-positive or false-negative changes

---

## Unsupported Input Reaches the Classifier

Language routing sends non-English content to the English model.

Result:

- misleading scores
- false confidence
- inconsistent moderation

---

## Silent Empty Result on Failure

An endpoint error is converted into no flagged categories.

Result:

- failed moderation appears to be approved content

---

## Incomplete Rollback

Model weights are rolled back but thresholds, taxonomy, or mappings remain new.

Result:

- behaviour does not return to the previous release

---

## Healthy Endpoint, Broken Platform

SageMaker is healthy, but:

- Guardlane parsing is broken
- routing is incorrect
- aggregation fails
- persistence fails
- business policy consumes the result incorrectly

Result:

- model deployment appears healthy while end-to-end moderation is not

---

# Deployment Checklist

## Model Artifacts

- Model weights included
- Tokenizer included
- Configuration included
- Label mapping included
- Threshold metadata included
- Evaluation summary included
- Release manifest included
- Artifact checksum validated

---

## SageMaker

- Model resource created
- Endpoint configuration created
- Endpoint deployed
- Execution role verified
- Network access verified
- Scaling configured
- Metrics available
- Alarms configured

---

## Guardlane Compatibility

- Taxonomy version supported
- Label order verified
- Threshold version verified
- Request schema verified
- Response schema verified
- Timeout configured
- Failure path tested
- Model metadata captured

---

## Hybrid Platform

- Regex version verified
- Routing version verified
- LLM configuration verified
- Aggregation tests passed
- Partial-result policy verified
- Persistence tested
- Dashboard visibility checked

---

## Operations

- Release notes published
- Rollback version identified
- Monitoring reviewed
- On-call documentation updated
- Ownership confirmed
- Production verification completed

---

# Future Improvements

Potential deployment improvements include:

- blue-green endpoint deployment
- canary model rollout
- shadow inference
- automated compatibility gates
- automated model-card generation
- model registry integration
- endpoint autoscaling refinement
- multi-region resilience
- serverless inference evaluation
- asynchronous inference for non-interactive flows
- automated rollback signals
- model and configuration diff tooling
- platform-level release manifests
- provider-independent LLM fallback

---

# Engineering Principles

## Deploy behaviour, not only weights

Model behaviour depends on the tokenizer, taxonomy, mappings, thresholds, inference code, and runtime configuration.

---

## Compatibility must be verified

A technically healthy model can still return semantically corrupted results when metadata versions do not align.

---

## Stable endpoints still require version traceability

A stable endpoint name should simplify integration, not hide which model served the request.

---

## Failure must remain visible

An inference failure must never be represented as a successful clean moderation result.

---

## Model deployment is not platform deployment

Guardlane production readiness also depends on regex, routing, LLM fallback, aggregation, persistence, and operations.

---

## Roll back the compatible release unit

Restoring model weights alone may not restore previous moderation behaviour.

---

# Final Engineering Principle

> A production model is not deployed when an endpoint becomes available. It is deployed when the complete, versioned inference behaviour is compatible, observable, reversible, and safely integrated into the surrounding system.
