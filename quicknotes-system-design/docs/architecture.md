# Architecture

## Functional Requirements

- Create notes
- Read notes
- Update notes
- Delete notes
- Tag notes

## Non-Functional Requirements

- High availability
- Reliability
- Scalability
- Security

## Load Estimate

1,000,000 users

- Reads/sec: 1,000
- Writes/sec: 100
- Storage/year: ~200 GB

## Diagram

```text
Client
  |
 DNS
  |
 CDN
  |
Load Balancer
  |
+------------+
| App Server |
+------------+
| App Server |
+------------+
     |
   Cache
     |
Primary DB ------ Read Replica
     |
    Queue
     |
   Worker
```

## Components

- Client: User interface.
- DNS: Resolves domain names.
- CDN: Serves static assets quickly.
- Load Balancer: Distributes traffic.
- App Servers: Process requests.
- Cache: Reduces DB reads.
- Primary Database: Stores data.
- Read Replica: Handles read traffic.
- Queue: Stores background jobs.
- Worker: Processes jobs asynchronously.

## GET /notes Flow

1. Client sends request.
2. Load balancer routes traffic.
3. App checks cache.
4. Cache miss goes to DB replica.
5. Results returned to client.

## POST /notes Flow

1. Client sends note.
2. Load balancer routes request.
3. App validates input.
4. Primary DB stores note.
5. Queue receives background events.
6. Response returned.

## Trade-Offs

- Cache improves speed but adds complexity.
- Read replicas improve scalability but introduce replication lag.

## Avoiding Single Points of Failure

- Multiple app servers.
- Database replica.
- Redundant load balancer.
- Replicated cache.