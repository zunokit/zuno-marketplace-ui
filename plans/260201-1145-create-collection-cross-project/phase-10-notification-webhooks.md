---
title: "Phase 10: Notification Webhooks"
description: "Real-time notifications for collection events"
status: pending
priority: P2
effort: 6-8h
dependencies: ["Phase 05"]
---

# Phase 10: Notification Webhooks

## Project
zuno-marketplace-notifications

## Overview
Send WebSocket and email notifications for collection creation events.

## Event Consumer

```typescript
// app/consumers/collection-events.ts
export async function handleCollectionCreated(event: CollectionCreatedEvent) {
  // WebSocket notification
  await pusher.trigger(`user-${event.deployerAddress}`, 'collection-created', {
    collectionId: event.collectionId,
    name: event.name,
    status: 'DEPLOYED'
  });

  // Email notification (optional)
  await sendEmail({
    to: event.userEmail,
    template: 'collection-created',
    data: { collectionName: event.name }
  });
}
```

## Files

| File | Purpose |
|------|---------|
| app/consumers/collection-events.ts | Event handlers |
| lib/pusher.ts | WebSocket client |
| lib/email.ts | Email service |

## Success Criteria
- [ ] WebSocket events sent
- [ ] Email notifications working
- [ ] Event filtering correct
