# TicketHub System Design

## 1. Requirements

### Functional Requirements

1. Users can create accounts and log in.
2. Users can browse upcoming events.
3. Users can view available seats for an event.
4. Users can temporarily hold seats before payment.
5. Users can purchase tickets.
6. Users can view previously purchased tickets.
7. Event organizers can create and manage events.
8. The system must prevent two people from buying the same seat.

### Non-Functional Requirements

#### Speed
- Event pages should load within 2 seconds.
- Seat availability requests should respond within 500 ms.
- Payment processing should complete within 5 seconds.

#### Correctness
- A seat can be sold to only one customer.
- Payments and ticket creation must be consistent.
- Orders must not be duplicated.

#### Fairness
- Customers should be served in the order they arrive during high-demand sales.
- Queueing should prevent automated users from taking all tickets.
- No user should bypass the purchase process.

#### Availability
- The system should remain available during traffic spikes.

#### Scalability
- The system should support both normal traffic and extremely popular ticket sales.

---

## 2. Traffic Estimates

### Given Data

- 2,000,000 registered users
- 50,000 visitors per normal day
- Each visitor views 10 pages
- 5,000 tickets sold per normal day

### Normal Traffic

Page views per day:

50000 × 10 = 500000 page views/day

Requests per second:

500000 ÷ 86400 ≈ 6 requests/second

Ticket purchases:

5000 ÷ 86400 ≈ 0.06 purchases/second

### Popular Concert Sale

- 200,000 users attempt to buy tickets
- 20,000 available seats
- First 10 minutes (600 seconds)

Purchase attempts per second:

200000 ÷ 600 ≈ 333 requests/second

Seat inventory:

20000 seats

### Comparison

| Metric | Normal Day | Big Sale |
|----------|----------|----------|
| Visitors | 50,000/day | 200,000 in 10 min |
| Requests/sec | ~6 | ~333 |
| Ticket Demand | 5,000/day | 200,000 attempts |
| Seats Available | Varies | 20,000 |

Peak sale traffic is over 55 times greater than normal traffic.

---

## 3. API Design

### Get Events

```http
GET /api/events
```

Response:

```json
[
  {
    "eventId": 1,
    "name": "Summer Concert",
    "date": "2027-06-10"
  }
]
```

### Get Event Details

```http
GET /api/events/{eventId}
```

### View Seats

```http
GET /api/events/{eventId}/seats
```

### Hold Seats

```http
POST /api/seats/hold
```

Request:

```json
{
  "userId": 101,
  "seatId": 5001
}
```

### Purchase Ticket

```http
POST /api/orders
```

Request:

```json
{
  "holdId": 100,
  "paymentToken": "abc123"
}
```

### View Purchased Tickets

```http
GET /api/users/{userId}/tickets
```

---

## 4. Data Model

### Users

| Column | Type |
|----------|----------|
| user_id | BIGINT |
| name | VARCHAR |
| email | VARCHAR |
| created_at | TIMESTAMP |

### Events

| Column | Type |
|----------|----------|
| event_id | BIGINT |
| name | VARCHAR |
| venue | VARCHAR |
| event_date | DATETIME |

### Seats

| Column | Type |
|----------|----------|
| seat_id | BIGINT |
| event_id | BIGINT |
| section | VARCHAR |
| seat_number | VARCHAR |
| status | VARCHAR |

### Orders

| Column | Type |
|----------|----------|
| order_id | BIGINT |
| user_id | BIGINT |
| seat_id | BIGINT |
| total_price | DECIMAL |
| created_at | TIMESTAMP |

### Relationships

- One User can create many Orders.
- One Event contains many Seats.
- One Seat belongs to one Event.
- One Order contains one Seat purchase.
- Seat IDs are unique.

---

## 5. Preventing Double Booking

TicketHub prevents double booking using database transactions and constraints.

When a customer selects a seat:

1. The system starts a database transaction.
2. The selected seat row is locked using row-level locking.
3. The seat status changes from AVAILABLE to HELD.
4. Other transactions attempting to reserve the same seat must wait.
5. After payment succeeds, the seat status changes to SOLD.
6. The transaction commits.

Example:

```sql
BEGIN;

SELECT *
FROM seats
WHERE seat_id = 5001
FOR UPDATE;

UPDATE seats
SET status = 'HELD'
WHERE seat_id = 5001;

COMMIT;
```

A unique constraint on seat purchases ensures only one successful order can exist for a seat.

This guarantees that two users cannot buy the same seat even during peak traffic.

---

## 6. Architecture

### Architecture Diagram

```text
                 +---------------+
                 |     Users     |
                 +-------+-------+
                         |
                         v
              +----------+----------+
              |   Load Balancer      |
              +----------+----------+
                         |
          +--------------+--------------+
          |                             |
          v                             v
   +-------------+              +-------------+
   | Web Server  |              | Web Server  |
   +------+------+              +------+------+
          |                            |
          +------------+---------------+
                       |
                       v
              +--------+--------+
              | Application API |
              +--------+--------+
                       |
      +----------------+----------------+
      |                                 |
      v                                 v
+-------------+               +----------------+
| Redis Cache |               | Queue Service  |
+------+------+               +--------+-------+
       |                                |
       v                                v
+------+-------------------------------+------+
|              Database                       |
+---------------------------------------------+
```

### Component Explanations

#### Load Balancer
Distributes requests across servers.

#### Web Servers
Serve web pages and static content.

#### API Servers
Handle business logic, seat reservations and purchases.

#### Redis Cache
Stores frequently requested event and seat information.

#### Queue Service
Used during high-demand sales. Users enter a waiting line and are processed fairly.

#### Database
Stores users, events, seats and orders.

### Surviving the Big Sale

- Queue limits simultaneous purchase attempts.
- Load balancer distributes traffic.
- Multiple API servers scale horizontally.
- Redis reduces database reads.
- Database transactions protect seat inventory.

---

## 7. Trade-Offs

### Trade-Off 1: Fairness vs Speed

Adding a waiting room makes purchasing fairer but increases waiting time.

### Trade-Off 2: Strong Consistency vs Performance

Database locking prevents double-booking but slightly reduces throughput during peak demand.

### Trade-Off 3: Cache Freshness vs Database Load

Using cached seat data improves speed but risks briefly showing outdated availability information.