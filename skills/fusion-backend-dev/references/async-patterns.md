# Async & Event Patterns

## Event Publishing

Fusion services publish events to Service Bus when important things happen:

### Event Types

| Event | Service | Scenario |
| --- | --- | --- |
| `PersonUpdated` | People | Person name, email, or roles change |
| `PersonDeleted` | People | Person account archived |
| `ContextCreated` | Context | New project/initiative context |
| `ContextModified` | Context | Context properties changed |
| `PositionAssigned` | Context | New position holder assigned |
| `PositionUnassigned` | Context | Position holder removed |
| `ApprovalRequested` | Approvals | New approval needed |
| `ApprovalCompleted` | Approvals | Approval given/rejected |

### Event Format

```json
{
  "eventType": "PositionAssigned",
  "eventId": "uuid",
  "timestamp": "2026-04-17T10:30:00Z",
  "source": "fusion-context-service",
  "data": {
    "contextId": "ctx-uuid",
    "positionId": "pos-uuid",
    "personId": "person-uuid",
    "title": "Project Manager",
    "startDate": "2026-04-17",
    "endDate": "2027-04-17"
  },
  "version": "1.0"
}
```

---

## Event Subscription

### Azure Service Bus Subscription

To receive events:

1. **Get Service Bus endpoint**: Provided in project setup
2. **Create subscription**: Subscribe to the event topic (e.g., `fusion.context-events`)
3. **Implement receiver**: Handle incoming messages

**Example subscriptions**:
- `fusion.context-events` → all context events
- `fusion.people-events` → all person events

### Filtering Events

Most subscriptions support filters:

```
eventType = 'PositionAssigned'
source = 'fusion-context-service'
```

### Message Format on Bus

```
{
  "body": { /* event JSON */ },
  "properties": {
    "eventType": "PositionAssigned",
    "timestamp": "2026-04-17T10:30:00Z",
    "contentType": "application/json"
  }
}
```

---

## Common Event Patterns

### Pattern: Real-Time Sync

When another system needs to stay in sync:

```
1. User does action in Fusion
2. Fusion publishes event
3. External system receives event
4. External system updates its local copy
```

**Use case**: Dashboard showing current org chart, active positions

**Challenge**: Initial state. Solution: Fetch full snapshot on startup, then subscribe to incremental updates.

### Pattern: Eventual Consistency

When operations span multiple services:

```
1. User creates context → Context service publishes ContextCreated
2. Approvals service receives → Creates default approvals
3. Reporting service receives → Adds to reporting index
4. Notifications service receives → Sends "New project" message
```

**Key**: All listeners are independent; failure in one doesn't block the others.

### Pattern: Webhook Delivery

When external system needs webhooks (not pub/sub):

```
1. External system registers webhook URL with Fusion
2. Event occurs in Fusion
3. Fusion makes HTTP POST to webhook URL
4. External system processes the request
```

**Contract**: 
```
POST {webhook_url}
Content-Type: application/json
X-Fusion-Event-Type: PositionAssigned
X-Fusion-Signature: hmac-sha256

{ /* event body */ }
```

---

## Handling Events

### Idempotent Processing

Events can be delivered multiple times. Your handler must be idempotent:

```csharp
// ❌ NOT idempotent:
public void Handle(PositionAssigned @event)
{
  DbPosition position = _db.Positions.Add(@event.Data);
  _db.SaveChanges();
}

// ✅ Idempotent:
public void Handle(PositionAssigned @event)
{
  DbPosition? existing = _db.Positions.Find(@event.Data.PositionId);
  if (existing == null)
  {
    _db.Positions.Add(@event.Data);
    _db.SaveChanges();
  }
  // If already processed, no-op
}
```

### Error Handling

What if processing fails?

```csharp
try
{
  ProcessEvent(@event);
  AcknowledgeMessage(message);  // Tell bus we succeeded
}
catch (RecoverableException ex)
{
  // Retry later (service bus will redeliver)
  // Don't acknowledge; message stays on queue
}
catch (PoisonMessage ex)
{
  // This event is bad; move to dead-letter queue
  MoveToDlq(message);
}
```

### Ordering Guarantees

Don't assume messages arrive in order.

- Events for the same context may still be delivered out of order
- Events for different contexts may be interleaved or out of order
- Don't assume global ordering

**If you need strict ordering**: Use an explicit ordering strategy such as Service Bus Sessions (for example, `sessionId = contextId`) so related events are processed FIFO within that session.

**Tradeoffs**: Sessions require session-aware consumers and can reduce parallelism for events that share the same session.
---

## Async APIs (Polling)

Some long-running operations use polling:

```
1. Start operation → Returns operation ID
2. Poll status endpoint with operation ID
3. Operation completes → Returns result
```

**Example**:
```
POST /api/v1/contexts → 202 Accepted
{ "operationId": "op-uuid" }

GET /api/v1/contexts/op-uuid → 
{ "status": "InProgress", "progress": 45 }

// Later...
GET /api/v1/contexts/op-uuid →
{ "status": "Completed", "contextId": "ctx-uuid" }
```

---

## When to Use Each Pattern

| Pattern | Use Case | Pro | Con |
| --- | --- | --- | --- |
| **Event Subscription** | Real-time sync, multi-system orchestration | Decoupled, fire-and-forget, scales | Complex setup, eventual consistency |
| **Webhook** | External system notification | Simple for external partners, HTTP standard | Requires public endpoint, delivery challenges |
| **Polling** | Frontend UX (show progress), long operations | Simple client code, user control | Chatty, can be slow |
| **Direct API Call** | Immediate result needed, tight coupling acceptable | Simple, immediate feedback | Tightly coupled, not resilient to changes |
