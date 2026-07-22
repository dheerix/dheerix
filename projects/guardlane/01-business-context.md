# Business Context

## Overview

Guardlane originated from a business need to protect the integrity of Openlane's Vehicle Question & Answer platform while preserving the speed and transparency that buyers and sellers expect during the auction process.

The Vehicle Question & Answer feature was introduced to improve auction confidence by allowing buyers to ask questions about a vehicle before placing bids. Sellers could respond directly through the marketplace, enabling informed purchasing decisions and reducing uncertainty around vehicle condition.

As adoption increased, the platform became more than a communication channel. It also became a potential source of operational, legal, financial, and reputational risk.

---

## Business Problem

Several categories of undesirable behaviour began appearing within marketplace conversations.

Examples included:

- Sharing personal contact information to move transactions outside the marketplace.
- Profanity and abusive language.
- Misleading statements regarding **As-Is** vehicles that buyers later interpreted as guarantees during arbitration.
- Negotiation attempts that bypassed the intended auction workflow.
- Unsupported accusations directed at dealers.
- Messages targeting Openlane or partner organizations.
- Irrelevant or spam-like conversations that reduced the usefulness of the feature.

Although each category represented a different type of violation, they all reduced trust in the marketplace and increased operational overhead.

The existing workflow relied primarily on manual moderation and reactive handling, making it difficult to scale as platform usage continued to grow.

---

## Business Impact

Without an automated moderation capability, the organization faced multiple risks.

### Marketplace Integrity

Conversations that violated marketplace policies reduced buyer confidence and negatively affected the overall auction experience.

### Legal and Arbitration Risk

Responses about **As-Is** vehicles occasionally appeared to buyers as contractual guarantees. Following completed auctions, these responses were sometimes referenced during arbitration cases, exposing the organization to financial loss and increased operational effort.

### Operational Cost

Manual moderation could not efficiently keep pace with increasing marketplace activity.

### Platform Trust

Profanity, dealer targeting, organization targeting, and irrelevant discussions negatively affected the professionalism and credibility of the Question & Answer platform.

---

## Project Initiation

A Product Manager approached Engineering with the objective of introducing automated moderation into the Question & Answer platform.

Rather than immediately committing to a machine learning solution, the initial objective was to determine whether modern language models could reliably classify marketplace conversations according to moderation policies.

A proof of concept using Gemini demonstrated promising classification accuracy and was presented to Product together with evaluation metrics. The successful validation established confidence that automated moderation was technically feasible and justified investment in a production-grade solution.

This proof of concept ultimately evolved into Guardlane.

---

## Success Criteria

The project aimed to achieve the following business outcomes:

- Protect marketplace integrity through automated moderation.
- Reduce arbitration and legal risk associated with misleading vehicle discussions.
- Prevent transactions from moving outside the marketplace.
- Maintain response times suitable for real-time buyer and seller interactions.
- Enable moderation policies to evolve without redesigning the overall system.
- Provide operational visibility into moderation performance and policy violations.
