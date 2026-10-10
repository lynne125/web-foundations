1. Assumptions

Given:

Registered users = 10,000,000
Active users per day = 10%
Each active user uploads 1 photo/day
Each active user views 50 feed pages/day
Average photo size = 2 MB
Thumbnail size = 50 KB
Daily Active Users (DAU)
10,000,000 × 10% = 1,000,000 active users/day


So:

DAU = 1,000,000 users

2. Traffic Estimates
Uploads Per Day
1,000,000 users × 1 photo/day
= 1,000,000 uploads/day

Average Uploads Per Second
1,000,000 ÷ 86,400
≈ 11.57 uploads/sec


Average uploads/sec ≈ 12

Peak Uploads Per Second (5× Average)
12 × 5 = 60 uploads/sec


Peak uploads/sec ≈ 60

Feed Views Per Day
1,000,000 users × 50 views/day
= 50,000,000 feed views/day

Average Feed Views Per Second
50,000,000 ÷ 86,400
≈ 578.7 views/sec


Average feed views/sec ≈ 579

Peak Feed Views Per Second (5×)
579 × 5
≈ 2,895 views/sec


Peak feed views/sec ≈ 2,895

3. Storage Per Year
Photos
1,000,000 photos/day × 2 MB
= 2,000,000 MB/day
= 2,000 GB/day
= 2 TB/day


Per year:

2 TB × 365
= 730 TB/year

Thumbnails
1,000,000 × 50 KB
= 50,000,000 KB/day
≈ 50 GB/day


Per year:

50 GB × 365
= 18.25 TB/year

Total Storage Per Year
730 TB + 18.25 TB
= 748.25 TB/year


Total storage needed ≈ 748 TB/year

4. Read-Heavy or Write-Heavy?

The system is read-heavy because users view 50 feed pages per day but upload only 1 photo per day.

This means the architecture should focus on serving reads efficiently using caching, read replicas, and a CDN.

5. Why Photos Should Not Be Stored in the Database

Photos are large files and would make the database slow, expensive, and difficult to scale.

Instead, photos should be stored in object storage (such as Amazon S3, Azure Blob Storage, or Google Cloud Storage), while the database stores only metadata such as photo ID, owner, upload time, and storage URL.

6. Architecture Diagram
Plain Text
Users
|
v
+---------+
| CDN |
+---------+
|
v
+--------------+
| Load Balancer|
+--------------+
|
v
+-------------+
| App Servers |
+-------------+
| | |
---------- | ----------
| | |
v v v
 
+----------+ +----------+ +------------+
| Cache | | Database | | Queue |
| (Redis) | | Primary | | |
+----------+ +----------+ +------------+
|
v
+---------------+
| Read Replica |
+---------------+
 
Queue
|
v
+---------------+
| Thumbnail |
| Worker |
+---------------+
|
v
+---------------+
| Object Storage|
| Photos & |
| Thumbnails |
+---------------+
7. Component Explanations
CDN

Caches photos close to users to reduce latency and bandwidth usage.

Load Balancer

Distributes incoming traffic across multiple application servers.

App Servers

Handle user requests, uploads, authentication, and feed generation.

Cache (Redis)

Stores frequently accessed feed data to reduce database reads.

Primary Database

Stores user accounts, follows, photo metadata, and application data.

Read Replica

Handles read queries to reduce load on the primary database.

Queue

Stores thumbnail jobs for asynchronous processing.

Thumbnail Worker

Generates thumbnails after photos are uploaded.

Object Storage

Stores original photos and thumbnail images reliably and cheaply.

8. Photo Upload Flow
User uploads a photo.
Request reaches the CDN and load balancer.
Load balancer forwards the request to an app server.
App server stores the original photo in object storage.
App server writes photo metadata to the primary database.
App server creates a thumbnail-generation job in the queue.
Thumbnail worker reads the job from the queue.
Worker generates a 50 KB thumbnail.
Thumbnail is stored in object storage.
Thumbnail location is saved in the database.
CDN caches the image when users request it.
Followers can view the photo through their feed.
9. Trade-Offs
Trade-Off 1: Cache vs Freshness

Using a cache improves performance and reduces database load, but users may see slightly stale feed data.

Trade-Off 2: Asynchronous Thumbnail Generation

Using a queue improves upload speed because users do not wait for thumbnail creation, but thumbnails may not appear immediately after upload.