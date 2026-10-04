# Distributed API Gateway with Rate Limiting

## Concept: ##
 A reverse proxy that sits in front of backend services and restricts the number of requests that a user can make (e.g. 100 requests per minute)

## Algorithm: [Token Bucket Algo](https://medium.com/@surajshende247/token-bucket-algorithm-rate-limiting-db4c69502283) ##
Imagine a bucket that holds a maximum of 10 tokens at a time. Every time a user wants to make a request, they must remove a token from the bucket. If the bucket is empty, the request is rejected with a *429 Too Many Requests* status. Meanwhile, a background process adds tokens back to the bucket at a constant rate (e.g. 2 tokens per second) until it hits the capacity of 10.

## Stack: ##
Node and Express for server logic, Redis for state management