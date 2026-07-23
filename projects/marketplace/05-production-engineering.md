# Production Engineering

## Overview

A distributed architecture is successful only when engineers can operate it reliably in production.

Marketplace Platform Evolution spans Oracle, Java, Oracle GoldenGate, integration services, Amazon Kinesis, AWS Lambda, Node.js, .NET services, Apache Pulsar, Backend-for-Frontend APIs, Micro Frontends, identity services, and AI-assisted workflows.

A failure may originate in one architectural generation and surface in another.

For example:

```text
Oracle event
    ↓
GoldenGate
    ↓
Classic Integration
    ↓
Kinesis
    ↓
Lambda service
    ↓
FutureStack API
    ↓
VDP BFF
    ↓
Frontend symptom
```

The user-visible error may appear in the final application even when the actual failure occurred several systems earlier.

Production engineering in this environment therefore requires more than reading the logs of one service. It requires understanding:

- End-to-end request and event flows
- Service dependencies
- Deployment history
- Authentication and permission boundaries
- Network behavior
- Message processing
- Downstream latency
- Contract compatibility
- Business impact
- Partial-failure behavior

Observability, failure handling, deployment safety, and incident response are treated as engineering responsibilities rather than operational afterthoughts.

---

# Operating a Multi-Generation Platform

The marketplace contains multiple generations of architecture operating together.

```text
Legacy Enterprise
Oracle + Java
        │
        ▼
Integration
GoldenGate + Classic Integration
        │
        ▼
NewWave
Kinesis + Lambda + Node.js
        │
        ▼
FutureStack
.NET + Pulsar
        │
        ▼
Experience Layer
BFF + Micro Frontends
        │
        ▼
Dealer and AI Workflows
```

Each generation introduces different operational characteristics.

Legacy systems may fail through database or integration behavior.

Serverless systems may fail through event-delivery issues, permissions, runtime configuration, or downstream dependencies.

FutureStack services may fail through API, messaging, deployment, or service-to-service communication issues.

Experience services may remain healthy themselves while returning incomplete or slow responses because one of their dependencies is degraded.

Production investigation must therefore begin with the complete workflow rather than the most visible component.

---

# Production Observability

Observability should answer three different questions.

## What happened?

Logs provide detailed records of application behavior.

## How much and how often?

Metrics show rates, counts, latency, errors, retries, saturation, and trends.

## Where did the failure occur?

Distributed traces reveal how requests move across services and where time or errors accumulate.

No single telemetry source is sufficient in a distributed system.

A service log may show that a request failed but not identify the downstream service responsible.

A metric may show an elevated error rate but not explain which request path is affected.

A trace may show the failing dependency but still require logs to understand the underlying exception.

Effective investigation combines all three.

---

# Logs, Metrics, and Traces

## Logs

Logs are most useful for detailed local context, including:

- Exceptions
- Input validation failures
- Event identifiers
- Downstream response codes
- Retry attempts
- Authentication failures
- Deployment and configuration information

Logs should include enough context to connect the failure to a larger workflow.

Useful fields include:

- Correlation ID
- Trace ID
- Event ID
- Vehicle ID
- User or dealer context where appropriate
- Service name
- Environment
- Deployment version
- Downstream dependency
- Error category

Sensitive data should not be logged unnecessarily.

---

## Metrics

Metrics help determine whether an error is isolated or systemic.

Important production metrics include:

- Request count
- Error rate
- Response latency
- Timeout count
- Retry count
- Event-consumer failures
- Message backlog
- Dependency latency
- Authentication failures
- Network errors
- Resource saturation

A single exception may not represent an incident.

A sudden increase in error rate or latency across production traffic may indicate a broader service degradation.

---

## Distributed Traces

Distributed tracing is particularly valuable for services such as the VDP BFF because one incoming request may trigger many downstream calls.

```text
Frontend request
        ↓
VDP BFF
        ├── Vehicle API
        ├── Auction API
        ├── Pricing API
        ├── Media API
        ├── Permissions API
        └── Seller API
```

A trace can reveal:

- Which dependency failed
- Which dependency was slow
- Whether calls were sequential or parallel
- Where retries occurred
- Which service contributed most to total latency
- Whether one request path differs from another
- Whether the service failed before or after calling a dependency

Honeycomb and OpenTelemetry-style tracing are valuable because they allow engineers to reason about the complete request rather than isolated log entries.

---

# Correlation Across Services

A distributed workflow becomes difficult to debug when each service generates unrelated identifiers.

Correlation identifiers should propagate through:

- HTTP requests
- Event messages
- Lambda invocations
- Pulsar messages
- Integration services
- BFF calls
- AI workflows

A useful debugging chain may look like:

```text
User request
Trace ID: abc-123
        ↓
VDP BFF
Trace ID: abc-123
        ↓
Vehicle service
Trace ID: abc-123
        ↓
Event publication
Correlation ID: abc-123
```

Perfect propagation is not always possible across older systems, but consistent identifiers should be preserved wherever the architecture supports them.

Without correlation, engineers spend time manually reconstructing events using timestamps and business identifiers.

With correlation, the workflow becomes directly traceable.

---

# Alerting and Incident Detection

Alerts should indicate meaningful user or system impact rather than every individual error.

Representative alerts include:

- Elevated HTTP 5xx rate
- Increased service-to-service network errors
- Sustained latency above an operational threshold
- Consumer backlog growth
- Repeated message-processing failures
- Authentication failure spikes
- Missing expected events
- Health-check failures
- Increased timeout or retry rates

An AlertManager notification such as:

```text
Istio too many network errors
for marketguide-service-prod
```

suggests that the service mesh observed an elevated rate of failed network communication involving that production service.

This does not automatically prove that the service's application code is defective.

Possible causes include:

- The service is unavailable
- A downstream dependency is unavailable
- Requests are timing out
- Containers are restarting
- Readiness checks are failing
- A deployment introduced incompatibility
- DNS or routing problems exist
- Service-mesh configuration is incorrect
- Connections are being reset
- Traffic volume increased unexpectedly

The alert is a starting point for investigation, not a root-cause conclusion.

---

# Common Failure Modes

## Event Processing Failures

Event-driven systems introduce several failure categories.

### Invalid Payloads

A producer may send an event that does not match consumer expectations.

Possible causes:

- Schema changes
- Missing fields
- Unexpected null values
- Legacy format variations
- Incorrect transformation logic

### Duplicate Events

Messaging systems may deliver events more than once.

Consumers should avoid assuming exactly-once delivery unless the platform explicitly guarantees it.

Idempotent processing is often required.

### Out-of-Order Events

Related events may arrive in an unexpected sequence.

The consumer may need:

- Version checks
- Timestamps
- State validation
- Ordering keys
- Reconciliation logic

### Processing Exceptions

A consumer may receive a valid event but fail while applying business logic or calling another dependency.

### Backlog Growth

If consumers process messages more slowly than producers publish them, the backlog increases.

A growing backlog may indicate:

- Consumer failures
- Downstream latency
- Insufficient processing capacity
- Deployment problems
- Poison messages
- Increased event volume

---

# Debugging the Oracle-to-Kinesis Flow

The Oracle event path requires investigation across several boundaries.

```text
Oracle
    ↓
GoldenGate
    ↓
Classic Integration
    ↓
Kinesis stream
    ↓
Lambda consumer
```

When a downstream service does not receive an expected update, investigation should proceed in sequence.

## Step 1 — Confirm the Source Event

Determine whether Oracle actually generated the expected change.

## Step 2 — Verify GoldenGate Publication

Confirm that the event entered the replication or streaming path.

## Step 3 — Inspect Classic Integration

Check whether the integration layer:

- Consumed the event
- Parsed it successfully
- Applied the correct transformation
- Selected the correct routing rule
- Published it to the expected stream

## Step 4 — Inspect Kinesis

Check:

- Stream health
- Consumer lag
- Partition behavior
- Publication failures
- Throttling

## Step 5 — Inspect the Consumer

Determine whether the downstream Lambda:

- Received the event
- Failed during deserialization
- Failed during business processing
- Retried
- Sent the event to a failure path
- Updated the destination successfully

This sequence prevents engineers from immediately assuming that the visible consumer is the cause.

---

# Pulsar Consumer Failures

FutureStack introduced Apache Pulsar for messaging.

Common investigation areas include:

- Subscription health
- Consumer connectivity
- Message acknowledgement
- Redelivery
- Processing exceptions
- Schema compatibility
- Topic configuration
- Consumer backlog

A service may appear healthy from an HTTP perspective while its message consumer is degraded.

Health checks should therefore reflect the responsibilities of the service rather than only confirming that the process is running.

---

# Downstream API Failures

Services such as the VDP BFF depend on many downstream APIs.

Failure categories include:

- Connection failure
- Timeout
- HTTP 4xx response
- HTTP 5xx response
- Invalid response payload
- Authentication failure
- Authorization failure
- Rate limiting
- Unexpected latency
- Partial response

The correct response depends on the importance of the dependency.

A failure in a core vehicle-information service may prevent the page from functioning.

A failure in an optional enrichment service may allow the page to render with reduced information.

The architecture must define this distinction explicitly.

---

# Partial Failure in the BFF

Aggregated services should not treat every downstream dependency identically.

```text
VDP BFF
    ├── Core vehicle information     Required
    ├── Permissions                  Required
    ├── Auction status               Context dependent
    ├── Pricing                      Important
    ├── Media                        Important
    └── Recommendations              Optional
```

Possible strategies include:

- Fail the entire request when a required dependency fails
- Return partial content when an optional dependency fails
- Apply a timeout to slow dependencies
- Use cached data where appropriate
- Expose a degraded-state indicator
- Record the failure even when the page remains available

Partial-failure handling improves availability, but it must not silently hide serious backend degradation.

The user experience and operational monitoring must both reflect what occurred.

---

# Authentication and Permission Failures

Identity systems are shared dependencies with a wide blast radius.

Failures may result from:

- Invalid tokens
- Expired tokens
- Missing claims
- Incorrect roles
- Permission mapping errors
- Service-to-service authentication problems
- IAM policy changes
- Environment configuration
- Contract mismatches between identity providers and consumers

Identity-related incidents should be investigated carefully because an authorization failure can look like missing business data or a frontend defect.

For example, a user may be unable to view vehicle information because the underlying API rejected the request based on permissions.

The visible symptom may appear in the experience layer even though the root cause is identity configuration.

---

# Schema and Contract Failures

A distributed platform depends on contracts across:

- Events
- APIs
- Shared libraries
- Authentication tokens
- Frontend models
- BFF responses
- AI service requests

Contract failures commonly occur when:

- A required field is removed
- A field changes type
- A consumer assumes a new field is always present
- Producers and consumers deploy at different times
- A shared package is upgraded inconsistently
- Legacy events contain undocumented variations

Safer contract evolution uses:

- Additive changes
- Optional fields
- Versioning where necessary
- Consumer compatibility testing
- Staged rollout
- Monitoring after deployment

Backward compatibility is not merely a design preference. It is a production reliability mechanism.

---

# Deployment Risks

Independent deployment improves delivery speed but introduces version compatibility risks.

A deployment may fail because of:

- Incorrect environment configuration
- Missing secrets
- IAM permission changes
- Incompatible event contracts
- Incompatible API contracts
- Container startup failures
- Failed readiness checks
- Database or infrastructure dependencies
- Incorrect routing
- Dependency version changes
- Runtime differences

Deployment investigation should begin by asking:

> What changed immediately before the incident?

This includes more than application code.

Relevant changes include:

- Configuration
- Infrastructure
- Secrets
- Service-mesh rules
- Shared packages
- Environment variables
- IAM policies
- Deployment manifests
- Traffic routing

---

# Safe Rollout Strategies

## Small Changes

Smaller changes reduce the number of possible failure causes.

## Independent Validation

Validate the service in the deployed environment rather than relying only on local or test behavior.

## Health and Readiness Checks

Traffic should not reach instances that are not ready to serve requests.

## Progressive Delivery

Where supported, expose the new version to limited traffic before a full rollout.

## Backward-Compatible Contracts

Producers and consumers should tolerate temporary version differences.

## Clear Rollback Path

Every production release should have an understood recovery strategy.

## Post-Deployment Monitoring

The engineer should monitor:

- Error rates
- Latency
- Logs
- Traces
- Alerts
- Business behavior

A successful pipeline does not necessarily mean a successful production deployment.

---

# Partial Releases

Large projects do not always need to wait for every feature path to be complete.

A partial release may be appropriate when:

- The completed path provides independent value
- The unreleased path can remain safely disabled
- Contracts remain compatible
- Operational risk is lower
- Product and QA understand the boundaries
- Monitoring can distinguish the released functionality

Partial releases reduce the blast radius and provide production evidence earlier.

They require clear communication so that stakeholders understand exactly what is and is not live.

---

# AWS SDK v2 to v3 Migration

Migrating from AWS SDK v2 to v3 affected foundational Node.js and Lambda services.

The migration was not limited to replacing package imports.

It changed:

- Client construction
- Command invocation
- Response handling
- Credential behavior
- Mocking
- Tests
- Packaging
- Dependency structure
- Runtime expectations

Because these services participated in identity, user information, and integration workflows, the production risk was larger than the apparent code change.

## Production Risks

- Incorrect IAM assumptions
- Different exception behavior
- Changed response shapes
- Mock tests passing while runtime behavior differs
- Missing packages in deployment artifacts
- Region or credential misconfiguration
- Subtle differences in pagination or streaming APIs

## Validation Approach

A safe migration requires:

- Identifying every SDK interaction
- Updating tests
- Validating IAM behavior
- Verifying deployment packaging
- Testing in a realistic environment
- Monitoring after release
- Keeping rollback available

The key lesson was that dependency modernization in foundational services must be treated as production engineering rather than routine maintenance.

---

# Service-to-Service Network Errors

Service-mesh alerts may identify elevated network errors between services.

When investigating an Istio-related network alert, useful questions include:

1. Did a deployment occur recently?
2. Is the service running and ready?
3. Are pods or containers restarting?
4. Which upstream or downstream service is involved?
5. Are failures timeouts, resets, DNS errors, or connection refusals?
6. Is the error rate affecting all traffic or one route?
7. Is latency increasing before requests fail?
8. Are retries amplifying load?
9. Are service-mesh policies or routes correct?
10. Has a dependency changed its port, protocol, certificate, or contract?

The investigation should combine:

- Istio or proxy metrics
- Kubernetes workload health
- Application logs
- Distributed traces
- Deployment history
- Dependency health

A service-mesh alert should not lead to debugging only the proxy. The mesh often reveals an application or dependency failure occurring through the network.

---

# Debugging Distributed Workflows

A reliable debugging approach should move from symptom to evidence.

## 1. Define the User-Visible Symptom

Examples:

- Page not loading
- Missing vehicle data
- Incorrect dealer permissions
- Event not processed
- Request timing out
- AI workflow not completing

## 2. Determine Scope

Ask:

- One user or all users?
- One vehicle or all vehicles?
- One region or all regions?
- One request path or every endpoint?
- Started after a deployment?
- Intermittent or continuous?

## 3. Identify the Request or Event Path

Draw the path before investigating deeply.

```text
Frontend
    ↓
BFF
    ↓
API
    ↓
Event or database dependency
```

## 4. Use Metrics to Find the Failing Boundary

Metrics reveal where errors or latency increased.

## 5. Use Traces to Find the Exact Dependency

Traces show which span failed or slowed.

## 6. Use Logs to Understand Why

Logs provide the exception and local context.

## 7. Check Recent Changes

Review code, configuration, infrastructure, deployment, and dependency changes.

## 8. Restore Service First

When customer impact is active, stabilization may take priority over the complete root-cause investigation.

Recovery options may include:

- Rollback
- Disable a feature path
- Restart a failed workload
- Restore configuration
- Reduce traffic
- Bypass a non-critical dependency

## 9. Complete Root-Cause Analysis

After recovery, determine why the failure occurred and how recurrence can be prevented.

---

# Incident Response Approach

A production incident should be handled with structure.

## Detect

Confirm the alert or customer symptom.

## Assess

Determine severity, scope, and business impact.

## Communicate

State:

- What is known
- What is not known
- Which systems are affected
- What is being investigated
- Whether mitigation is underway

## Investigate

Follow evidence across the complete workflow.

## Mitigate

Restore customer functionality using the safest available option.

## Validate

Confirm that:

- Error rates returned to normal
- Latency recovered
- Backlogs are processing
- User workflows function
- No hidden degradation remains

## Learn

Document:

- Root cause
- Contributing factors
- Detection quality
- Response gaps
- Preventive action

Strong incident communication avoids unsupported conclusions.

Instead of:

> The service is broken.

Use:

> We are seeing elevated network errors involving the service. The current investigation is checking workload health, recent deployments, and downstream dependencies.

---

# Performance Investigation

Performance should be measured before optimization.

For a request that suddenly becomes slow, the first question is:

> Where is time actually being spent?

Useful evidence includes:

- End-to-end latency
- Per-service trace duration
- Database duration
- Downstream API duration
- Sequential versus parallel execution
- Retry count
- Payload size
- CPU or memory pressure
- Network delay
- Queue backlog

For an aggregated request:

```text
Total latency
    =
BFF processing
    +
Critical-path downstream latency
    +
Retries
    +
Network overhead
```

The optimization target should be selected from evidence rather than assumption.

Possible improvements include:

- Parallelizing independent calls
- Removing unnecessary calls
- Adding timeouts
- Caching stable data
- Reducing payload size
- Avoiding repeated transformations
- Fixing a slow dependency
- Limiting retries
- Improving query behavior

Performance engineering is strongest when the engineer first makes the bottleneck observable.

---

# Root Cause Versus Symptom

A recurring production mistake is fixing the nearest visible symptom.

Examples include:

- Restarting a consumer without identifying the poison event
- Increasing a timeout without understanding downstream latency
- Retrying failed calls without checking whether retries increase load
- Patching frontend behavior when the API contract is incorrect
- Handling a missing field without understanding why the producer stopped sending it

A good production engineer asks:

> What condition made this failure possible?

The immediate fix restores service.

The root-cause fix reduces the chance of recurrence.

Both are necessary.

---

# Reliability Improvements

Production incidents should lead to concrete system improvements.

Possible actions include:

- Add missing metrics
- Improve trace propagation
- Add structured logs
- Create alerts for backlog growth
- Add timeout handling
- Add circuit-breaking behavior
- Improve retry policies
- Validate schemas earlier
- Add contract tests
- Improve readiness checks
- Reduce deployment blast radius
- Add fallback behavior
- Document service dependencies
- Improve runbooks
- Add dashboards for critical workflows

The best preventive action is often improved visibility rather than more defensive code.

An unknown failure becomes easier to handle when the system clearly reveals where and why it is failing.

---

# Production Communication

Production communication should be factual, calm, and progressive.

## Initial Update

> We are investigating elevated network errors affecting the production service. Current checks are focused on workload health, recent deployments, and downstream dependencies.

## Evidence Update

> The service is running, but traces show increased failures on calls to a downstream dependency. We are validating whether this began after the latest deployment.

## Mitigation Update

> We have rolled back the recent change and error rates are returning to normal. We are continuing to monitor traffic and validate the affected workflow.

## Resolution Update

> The incident was caused by an incompatible configuration introduced during deployment. Service has been restored, production metrics are stable, and a follow-up action will add validation for this configuration.

This style separates evidence from assumptions and helps teams coordinate effectively.

---

# Production Lessons Learned

## A Healthy Process Is Not Necessarily a Healthy Service

A container can be running while requests, consumers, or dependencies are failing.

## Alerts Indicate Symptoms

An alert identifies abnormal behavior, not necessarily the root cause.

## Distributed Failures Cross Ownership Boundaries

The service displaying the symptom may not own the failing dependency.

## Observability Must Be Designed

Logs, metrics, traces, and correlation do not become useful automatically.

## Retries Are Not Always Recovery

Uncontrolled retries can amplify an outage.

## Timeouts Are Product Decisions

Timeout behavior affects both system reliability and user experience.

## Partial Failure Requires Explicit Design

A degraded experience is better than a complete failure only when missing information is safe and understandable.

## Dependency Upgrades Can Be Production Changes

Foundational package migrations deserve the same care as feature releases.

## Rollback Is an Engineering Capability

A rollback path should be prepared before it is needed.

## Root Cause Matters

Restoring production ends the impact, not the engineering investigation.

## Communication Is Part of Incident Response

Accurate, evidence-based updates improve technical coordination and stakeholder confidence.

---

# My Production Engineering Approach

My approach can be summarized as:

```text
Understand the workflow
        ↓
Measure the impact
        ↓
Locate the failing boundary
        ↓
Use traces and logs for evidence
        ↓
Restore service safely
        ↓
Identify the root cause
        ↓
Improve the system
```

I do not treat production support as separate from software engineering.

Observability, failure handling, safe deployment, backward compatibility, and incident response are part of the architecture itself.

---

# Closing Reflection

The most valuable understanding of a platform often comes from operating it under real production conditions.

Marketplace Platform Evolution exposed the practical realities of distributed systems: failures cross service boundaries, event pipelines create asynchronous complexity, identity services have wide impact, aggregated APIs inherit downstream risk, and modernization increases the need for strong observability.

The goal of production engineering is not to prevent every possible failure.

The goal is to build systems that reveal problems clearly, degrade intentionally, recover safely, and improve after every incident.
