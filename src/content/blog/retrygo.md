---
cover: "../../assets/blog/retrygo/cover.png"
coverAlt: "Retry Go"
title: "Retry library for Go"
publicationDate: 2024-05-11
description: "This blog post describes the purpose of creating a retry library and my first experience developing a Go library."
layout: '../../layouts/MarkdownLayout.astro'
---

## Introduction
In this blog post, I will introduce a new library called `retrygo` that I have
developed for Go. The library provides a simple and easy-to-use API for retrying
functions in Go. I will also share my first experience developing a Go library
and the challenges I faced during the development process.

## Motivation
Recently, I was working on a project that required retrying functionality in Go.
On my previous Python projects, I used the `python-aioretry` by `kaelzhang`. It 
has a simple and very sensible approach to retrying functions.

I searched for similar libraries in Go, but I couldn't find one that met my
requirements. Most of the existing libraries were either too complex or complicated
to use. So, I decided to develop my own retry library for Go, which would be
simple, performant, easy to use, and fulfill my requirements.

## Required Features
- **Simple API**: The library should have a simple and easy-to-use API.
- **Flexible Configuration**: The library should allow configuring the retry
  behavior, such as the number of retries, backoff strategy, and retry conditions.
- **Performance**: The library should be performant and not introduce significant
    overhead.
- **Context Support**: The library should support Go's context package for
    cancellation and timeout handling.
- **Predefined Backoff Strategies**: The library should provide predefined
    backoff strategies like exponential backoff, constant backoff, etc.
- **Combining Multiple Strategies**: The library should allow combining multiple
    backoff strategies to simplify complex retry scenarios with combinations
    of different predefined strategies.

## Development
I started the development of the `retrygo` library by defining the API and the
required features.

### API Design
The API is built so that first the user defines the behavior at Retry, and 
after -- we call the functions we want to retry. (As we'll see later, this is 
a pretty nice improvement that has a positive impact on performance.)

I decided that I shouldn't be tied to a specific function return value, so 
Retry should be generic. 
Retry takes in `RetryPolicy` and `RetryConfigurer`. 
- `RetryPolicy` is a function that will be called every time an error is received. 
    This function will decide whether to continue retrying and how long to wait 
    before the next attempt. 
- `RetryConfigurer` -- there is currently only one configuration available. It's 
    a bit contrary to Golang principles, but it can be quite useful in some cases. 
    `WithRecovery` converts a panic that occurred during the function into an error. 

### Implementation
The implementation of the library was quite straightforward. I started by
defining the `Retry` struct, which holds the retry policy and the retry configurer.
Then, I implemented the `Do` method, which takes the function to retry and
executes it according to the retry policy. 

After that, I wrote the tests and benchmarks to ensure the correctness and
performance of the library. 

Finally, I implemented the predefined backoff strategies: constant, linear,
exponential, and jitter. These backoff strategies can be used to configure the
retry behavior.

Interesting feature(in my opinion) is that the library allows combining multiple
backoff strategies. For example, you can combine exponential backoff with
jitter to create a more complex retry strategy. 

## Benchmark
### Benchmark Environment
- **OS**: `Fedora 39 (Linux)`
- **CPU**: `Intel Core i5-7200U @ 4x 3.1GHz`
- **RAM**: `8GB`
- **Go Version**: `go1.22.2 linux/amd64`

### Benchmark Setup
I used the Go benchmarking tool to measure the performance of the `retrygo`
library and compare it with other existing retry libraries in Go. I created
[benchmarks package](https://github.com/ic-it/retrygo/tree/main/benchmarks)

### Benchmark Results
Results you can find in the [benchmarks-results](https://gist.github.com/ic-it/99a569a99772c38fafb447ba12baa19a) gist.

### Benchmark Analysis
#### icit-retrygo
- **BenchmarkNew**: Memory O(1), Time O(1)
- **BenchmarkDo**: Memory O(1), Time O(n)
- **BenchmarkDoSuccess**: Memory O(1), Time O(n)
- **BenchmarkNewDo**: Memory O(1), Time O(n)
- **BenchmarkDoRecovery**: Memory O(n), Time O(n)

#### avast-retry-go
- **BenchmarkDo**: Memory O(n), Time O(n)
- **BenchmarkDoWithData**: Memory O(n), Time O(n)
- **BenchmarkDoSuccess**: Memory O(1), Time O(n)
- **BenchmarkDoWithDataSuccess**: Memory O(1), Time O(n)

#### sethvargo-go-retry
- **BenchmarkDo**: Memory O(n), Time O(n)
- **BenchmarkDoSuccess**: Memory O(1), Time O(n)

## References
- [Go](https://golang.org/)
- [Retry Go](https://github.com/ic-it/retrygo)
- [Python-aioretry](https://github.com/kaelzhang/python-aioretry)
- [Sethvargo-go-retry](https://github.com/sethvargo/go-retry)
- [Avast-retry-go](https://github.com/avast/retry-go)
