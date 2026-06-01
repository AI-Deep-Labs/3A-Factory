---
name: project-overview
description: Analyze and document the entire project architecture, technology stack, coding conventions, design style, services, domains, features, communication patterns, functional flows, runtime configuration, operational concerns, security posture, tests, and risks. Use when the user wants to understand, audit, onboard, document, or generate a project knowledge base. The required output is a markdown file named docs/project_overview.md.
---

# Project Overview Knowledge Base

## Purpose

This skill guides an agent to inspect an existing repository and produce a complete `docs/project_overview.md` knowledge base.

The document must help future agents understand the project before making changes. It should answer:

- What is this project?
- How is it structured?
- What architecture style does it use?
- Which technologies, frameworks, tools, and runtime dependencies does it use?
- What are the main domains and business concepts?
- What features exist and where are they implemented?
- What services, modules, background workers, jobs, consumers, and producers exist?
- How do services/modules communicate?
- What APIs, events, contracts, database tables, and external integrations exist?
- What coding conventions and design styles should future agents follow?
- How is the project configured, tested, deployed, observed, and secured?
- What risks, unknowns, or follow-up questions should be tracked?

The final output must be a markdown file named:

```text
docs/project_overview.md
```

This file is intended to be a durable knowledge base for future agents.

---

## Core Principle

Document only what is supported by repository evidence.

Do not invent architecture, services, patterns, technologies, business rules, commands, database tables, APIs, or deployment details.

When the evidence is incomplete, mark the claim explicitly:

```text
Status: confirmed
Status: inferred
Status: unclear
Status: needs confirmation
```

Use confidence labels when describing inferred architecture or conventions:

```text
Confidence: high
Confidence: medium
Confidence: low
```

Prefer evidence from:

- Source code
- README files
- Existing docs
- Project files
- Package manifests
- Lock files
- Build scripts
- Docker files
- CI/CD files
- Infrastructure files
- API definitions
- Database migrations
- Message/event contracts
- Tests
- Configuration files
- Environment examples
- Deployment scripts

If documentation and code disagree, call that out:

```markdown
The documentation says X, but the code appears to do Y.
Status: needs confirmation.
```

---

## When To Use This Skill

Use this skill when the user asks for:

- Project overview
- Architecture overview
- Technical documentation
- Onboarding documentation
- Codebase analysis
- Project knowledge base
- `docs/project_overview.md`
- System analysis
- Service map
- Domain map
- Feature map
- API/event/database overview
- Documentation for future AI agents

Example triggers:

```text
Overview toàn bộ project này giúp tôi.
Tạo docs/project_overview.md cho repo này.
Phân tích kiến trúc project.
Document toàn bộ services/domain/features.
Tạo knowledge base để agent sau sử dụng.
Map toàn bộ API, service, domain, database, event.
```

---

## Output Contract

The required deliverable is:

```text
docs/project_overview.md
```

The agent must either:

1. Create or update `docs/project_overview.md` directly when file-write access is available.
2. Otherwise, output the full markdown content so the user can save it manually.

Do not only summarize in chat. The deliverable must be the actual markdown content or file.

After creating or updating the file, respond with a concise summary:

```markdown
Created `docs/project_overview.md`.

Summary:
- Architecture: ...
- Main technologies: ...
- Main domains: ...
- Main services/modules: ...
- Key risks/unknowns: ...

Recommended next step:
- Review sections marked `needs confirmation`.
```

---

## Required Workflow

### Phase 1: Repository Discovery

Inspect the repository before writing the overview.

Start broad. Identify top-level structure and key metadata files.

Look for:

```text
README.md
CHANGELOG.md
CONTRIBUTING.md
docs/
.agents/
.github/
.gitlab/
.vscode/
.editorconfig
package.json
pnpm-lock.yaml
yarn.lock
package-lock.json
*.csproj
*.sln
Directory.Build.props
Directory.Packages.props
global.json
NuGet.config
pom.xml
build.gradle
go.mod
Cargo.toml
pyproject.toml
requirements.txt
composer.json
Gemfile
appsettings*.json
application*.yml
application*.properties
.env.example
Dockerfile
docker-compose*.yml
helm/
k8s/
kubernetes/
terraform/
Makefile
Taskfile.yml
src/
app/
lib/
test/
tests/
spec/
integration-tests/
e2e/
migrations/
database/
schema/
proto/
openapi/
swagger/
```

Identify:

- Project type
- Runtime
- Main programming language
- Frameworks
- Application entry points
- Build system
- Test system
- Deployment system
- Main directories
- Existing documentation

Do not produce the final document until the repository shape is understood.

For large repositories, use breadth-first discovery:

1. Read top-level files.
2. Map major directories.
3. Identify entry points.
4. Inspect representative files per module/domain.
5. Inspect config, contracts, database, messaging, and tests.
6. Produce the first overview.

Do not try to read every file before creating the first useful version.

---

### Phase 2: Architecture Detection

Determine the architecture style from evidence.

Look for signs of:

- Monolith
- Modular monolith
- Microservices
- Layered architecture
- Clean Architecture
- Hexagonal Architecture / Ports and Adapters
- Vertical Slice Architecture
- CQRS
- Event-driven architecture
- Message-driven architecture
- Worker/consumer architecture
- API gateway
- Background jobs
- Plugin architecture
- Shared kernel
- Domain-driven design
- Multi-tenant architecture
- Store/branch-based architecture
- Cloud-native architecture
- Frontend/backend split
- BFF pattern
- Data pipeline architecture

For each detected style, include:

- What was detected
- Evidence
- Where it appears in code
- Confidence
- Caveats or uncertainty

Example:

```markdown
### Architecture Style

This project appears to follow a modular monolith style.

Evidence:
- Multiple business modules are located under `src/Modules`.
- Shared infrastructure is located under `src/Shared`.
- Modules appear to communicate through application services and integration events.

Confidence: medium
Status: inferred
```

---

### Phase 3: Technology Stack Discovery

Identify and document the technology stack.

Include:

- Programming languages
- Runtime versions
- Frameworks
- Package managers
- Database engines
- ORM/query tools
- Messaging systems
- Cache systems
- Search engines
- Logging libraries
- Monitoring/observability tools
- Authentication/authorization mechanisms
- API technologies
- Frontend stack, if any
- Testing frameworks
- Build tools
- Deployment tools
- Infrastructure tools

Prefer exact versions when available.

Output format:

```markdown
## 4. Technology Stack

| Area | Technology | Version | Evidence | Status |
|---|---|---|---|---|
| Backend | .NET | 8.0 | `global.json`, `*.csproj` | confirmed |
| Database | SQL Server | not found | connection strings in `appsettings.json` | inferred |
| Messaging | Kafka | not found | MassTransit Kafka references | inferred |
```

If a version cannot be found, write:

```text
Version: not found
```

---

### Phase 4: Repository and Project Structure Mapping

Map the main folders and explain their roles.

Do not describe every file. Focus on meaningful folders and architectural boundaries.

Output format:

```markdown
## 5. Project Structure

```text
src/
  Api/
  Application/
  Domain/
  Infrastructure/
tests/
docs/
```

| Path | Responsibility | Notes | Status |
|---|---|---|---|
| `src/Api` | Hosts HTTP endpoints and application startup | Contains `Program.cs` | confirmed |
| `src/Domain` | Contains domain entities and business rules | Naming suggests domain layer | inferred |
```

Mention unclear folders separately.

---

### Phase 5: Domain Discovery

Identify business domains from:

- Entity names
- Aggregate roots
- Commands
- Queries
- Controllers
- API routes
- Services
- Repositories
- Database tables
- Event names
- Feature folders
- Test names
- Existing documentation

Document each domain:

```markdown
## 6. Domain Overview

| Domain | Purpose | Key Concepts | Code Locations | Status |
|---|---|---|---|---|
| Orders | Handles order lifecycle and checkout | Order, OrderItem, Checkout | `src/Orders` | inferred |
| Inventory | Tracks stock movements and balances | Stock, InventoryMovement | `src/Inventory` | inferred |
```

For important domains, add details:

```markdown
### Domain: Orders

Purpose:
- Manages order lifecycle.

Main concepts:
- Order
- Order item
- Order status

Important rules:
- TBD / needs confirmation

Related APIs:
- TBD

Related events:
- TBD

Related data:
- TBD

Related files:
- `src/Orders/...`

Status: inferred
```

---

### Phase 6: Feature Mapping

Identify main user-facing, system-facing, and operational features.

Feature examples:

```text
Checkout
Cart
Group ordering
Discounts
Inventory sync
Store metrics
User authentication
Payment processing
Report generation
Notification
Data import/export
Background synchronization
Monitoring agent
Message consumption
Scheduled reconciliation
```

For each feature, document:

```markdown
### Feature: Checkout

Purpose:
- Allows a user to place an order.

Entry points:
- `POST /api/orders`
- `CreateOrderCommand`

Main flow:
1. Validate cart.
2. Calculate price.
3. Apply discount.
4. Persist order.
5. Publish order-created event.

Related domains:
- Orders
- Discounts
- Inventory

External dependencies:
- Payment provider
- Message broker

Status: inferred
```

Only include flows supported by code/docs. If inferred from naming, mark as inferred.

---

### Phase 7: Service and Module Inventory

Document important services/modules:

- API services
- Application services
- Domain services
- Background workers
- Hosted services
- Consumers
- Producers
- Schedulers
- CLI/console apps
- Shared libraries
- Infrastructure adapters
- Frontend apps
- Mobile apps
- Integration gateways

Output format:

```markdown
## 8. Services and Modules

| Service / Module | Type | Responsibility | Entry Point | Dependencies | Status |
|---|---|---|---|---|---|
| OrderApi | HTTP API | Handles order requests | `Program.cs` | SQL Server, Kafka | inferred |
| InventoryConsumer | Message consumer | Updates inventory from events | `InventoryConsumer.cs` | Kafka, SQL Server | inferred |
```

For critical services, include a deeper section:

```markdown
### Service: Order API

Responsibility:
- Handles order-related HTTP requests.

Inputs:
- HTTP requests

Outputs:
- HTTP responses
- Persisted order records
- Integration events

Dependencies:
- Order repository
- Discount service
- Message bus

Important files:
- `src/Orders/OrderController.cs`
- `src/Orders/CreateOrderCommand.cs`

Status: inferred
```

---

### Phase 8: Communication Patterns

Identify communication mechanisms:

- In-process method calls
- HTTP REST
- GraphQL
- gRPC
- WebSocket
- Kafka
- RabbitMQ
- MassTransit
- Azure Service Bus
- AWS SNS/SQS
- Database polling
- Shared database
- File exchange
- Cron/scheduled jobs
- Domain events
- Integration events
- Webhooks
- External API calls

Document:

```markdown
## 9. Communication Between Services

| Source | Target | Mechanism | Contract / Payload | Purpose | Status |
|---|---|---|---|---|---|
| Order Service | Inventory Service | Kafka event | `OrderCreated` | Reserve stock | inferred |
| API | Application Layer | In-process command | `CreateOrderCommand` | Execute use case | inferred |
```

Include diagrams as text when useful:

```markdown
### Synchronous Communication

```text
Client -> API -> Application Service -> Repository -> Database
```

### Asynchronous Communication

```text
Producer -> Message Broker -> Consumer -> Database / External Service
```

### Event Flow

```text
OrderCreated
  -> InventoryConsumer
  -> StockReserved
  -> NotificationConsumer
```
```

If no async mechanism is found, say so.

---

### Phase 9: Data Architecture

Inspect data storage and data access patterns.

Look for:

- Database providers
- ORM
- Repositories
- Unit of work
- Migration files
- Entity models
- Table names
- Connection strings
- Read models
- Projections
- Cache
- Search indexes
- File storage
- Object storage
- Data warehouse/reporting tables
- ETL/import/export jobs

Output:

```markdown
## 10. Data Architecture

| Data Store | Purpose | Access Method | Related Domains | Evidence | Status |
|---|---|---|---|---|---|
| SQL Server | Main transactional database | EF Core / Dapper | Orders, Inventory | connection strings, repositories | inferred |
| Redis | Cache | Redis client | Sessions/cache | appsettings | inferred |
```

Include important tables/collections when discoverable:

```markdown
### Important Tables / Collections

| Table / Collection | Domain | Purpose | Evidence | Status |
|---|---|---|---|---|
| Orders | Orders | Stores order headers | migration file | inferred |
| OrderItems | Orders | Stores order line items | entity class | inferred |
```

If schema is unavailable, state that clearly.

---

### Phase 10: API and Contract Documentation

Inspect public and internal contract surfaces.

Look for:

- Controllers
- Minimal APIs
- Route attributes
- OpenAPI/Swagger
- GraphQL schemas
- gRPC proto files
- Request/response DTOs
- Webhook contracts
- Event contracts
- Message topics
- Queue names
- CLI commands
- Public SDK/library APIs

Output:

```markdown
## 11. API and Contracts

| API / Contract | Type | Route / Topic / Method | Purpose | Handler / Consumer | Status |
|---|---|---|---|---|---|
| Create order | HTTP API | `POST /api/orders` | Creates an order | `OrdersController.Create` | inferred |
| OrderCreated | Event | `order-created` | Notifies order creation | `InventoryConsumer` | inferred |
```

If routes/contracts are inferred from code rather than generated docs, mark them as inferred.

---

### Phase 11: Functional Flow Documentation

Document important end-to-end flows.

Each flow should include:

- Trigger
- Actors
- Preconditions
- Main steps
- Outputs
- Side effects
- Failure behavior
- Related modules
- Related files
- Status/confidence

Template:

```markdown
## 12. Functional Flows

### Flow: Create Order

Trigger:
- User submits checkout request.

Actors:
- Customer
- API
- Order module

Preconditions:
- Cart exists.
- Store is active.
- Products are available.

Main steps:
1. Receive request.
2. Validate input.
3. Load cart.
4. Calculate totals.
5. Apply discounts.
6. Save order.
7. Publish event.

Outputs:
- Order created.
- Event published.

Side effects:
- Database records are created.
- Message is published.

Failure cases:
- Invalid product.
- Insufficient stock.
- Payment failed.

Related files:
- `OrdersController`
- `CreateOrderCommand`
- `OrderService`

Status: inferred
Confidence: medium
```

---

### Phase 12: Configuration and Runtime

Document how the project is configured and run.

Include:

- App settings
- Environment variables
- Secrets references
- Feature flags
- Runtime profiles
- Local development setup
- Docker setup
- Deployment setup
- CI/CD pipelines
- Health checks
- Logging config
- Monitoring config
- Startup commands

Output:

```markdown
## 13. Configuration and Runtime

### Configuration Files

| File | Purpose | Notes | Status |
|---|---|---|---|
| `appsettings.json` | Base application configuration | Contains connection strings | confirmed |
| `.env.example` | Required environment variables | Local development | confirmed |
```

Common commands must only be included when supported by repository evidence:

```markdown
### Common Commands

```bash
dotnet build
dotnet test
docker compose up
```
```

Do not invent commands.

---

### Phase 13: Coding Conventions and Design Style

Detect coding conventions from existing code.

Look for:

- Naming conventions
- Folder conventions
- Layering rules
- Interface naming
- DTO naming
- Command/query naming
- Test naming
- Error handling patterns
- Logging patterns
- Dependency injection style
- Validation style
- Mapping style
- Async style
- Null handling
- Result pattern vs exception pattern
- Controller/service/repository boundaries
- Transaction handling
- Message handler style
- Migration style

Output:

```markdown
## 14. Coding Conventions

| Area | Convention | Evidence | Status |
|---|---|---|---|
| Interfaces | Prefix with `I` | `IOrderRepository`, `IClock` | confirmed |
| Async methods | Suffix with `Async` | `CreateOrderAsync` | confirmed |
| Commands | Use `VerbNounCommand` | `CreateOrderCommand` | inferred |
```

Include design style:

```markdown
### Design Style

This project appears to prefer:
- Dependency injection
- Application service orchestration
- Repository abstraction
- DTO-based API contracts

Confidence: medium
Status: inferred
```

---

### Phase 14: Testing Overview

Document how the project tests behavior.

Look for:

- Unit tests
- Integration tests
- End-to-end tests
- Contract tests
- Snapshot tests
- Test containers
- Fixtures
- Mocks/fakes
- Test data builders
- Test naming style
- Test coverage by domain
- CI test commands

Output:

```markdown
## 15. Testing Overview

| Test Type | Framework | Location | Coverage Notes | Status |
|---|---|---|---|---|
| Unit tests | xUnit | `tests/UnitTests` | Covers domain logic | confirmed |
| Integration tests | xUnit/Testcontainers | `tests/IntegrationTests` | Covers API + database | inferred |
```

Include test gaps only when evidence supports them:

```markdown
### Test Gaps

- No tests found for inventory consumers.
- No integration tests found for checkout flow.
```

---

### Phase 15: Operational Concerns

Document runtime/production concerns.

Look for:

- Logging
- Metrics
- Tracing
- Health checks
- Retry policies
- Idempotency
- Outbox/inbox pattern
- Dead-letter queues
- Error handling
- Rate limiting
- Circuit breakers
- Timeouts
- Backoff policies
- Background job failure handling
- Multi-tenancy
- Store/branch isolation
- Data consistency risks
- Deployment risks

Output:

```markdown
## 16. Operational Concerns

| Concern | Current Approach | Evidence | Risk / Notes | Status |
|---|---|---|---|---|
| Logging | Structured logging | Serilog config | Used across services | confirmed |
| Retry | Message retry policy | MassTransit config | Needs review for poison messages | inferred |
```

---

### Phase 16: Security Overview

Document visible security mechanisms.

Look for:

- Authentication
- Authorization
- API keys
- JWT
- OAuth/OIDC
- Role/permission policies
- Input validation
- Secrets management
- CORS
- CSRF protection
- Rate limiting
- TLS config
- Sensitive logging risks
- PII handling
- Password hashing
- Token storage
- Internal service authentication

Output:

```markdown
## 17. Security Overview

| Area | Current Approach | Evidence | Status |
|---|---|---|---|
| Authentication | JWT Bearer | `AddAuthentication` config | confirmed |
| Authorization | Role policies | `AddAuthorization` config | confirmed |
```

If no evidence is found:

```markdown
No explicit authentication or authorization configuration was found in the inspected files.
Status: needs confirmation.
```

---

### Phase 17: Risks, Unknowns, and Recommendations

End with risks and recommended next steps.

Output:

```markdown
## 18. Risks and Unknowns

| Area | Risk / Unknown | Impact | Suggested Follow-up |
|---|---|---|---|
| Messaging | Retry behavior is unclear | Duplicate processing risk | Inspect consumer retry config |
```

Also include:

```markdown
## 19. Recommendations for Future Agents

- Read this file before modifying the project.
- Check the related domain section before editing a module.
- Follow existing coding conventions.
- Prefer existing public interfaces and module boundaries.
- Prefer behavior-focused tests when adding or changing functionality.
- Do not change API, event, or database contracts without checking producers and consumers.
- Update this file when architecture, major features, services, integrations, or contracts change.
```

---

## Required `docs/project_overview.md` Structure

The final file must use this exact top-level structure:

```markdown
# Project Overview

## 1. Executive Summary

## 2. Repository Map

## 3. Architecture Overview

## 4. Technology Stack

## 5. Project Structure

## 6. Domain Overview

## 7. Feature Overview

## 8. Services and Modules

## 9. Communication Between Services

## 10. Data Architecture

## 11. API and Contracts

## 12. Functional Flows

## 13. Configuration and Runtime

## 14. Coding Conventions

## 15. Testing Overview

## 16. Operational Concerns

## 17. Security Overview

## 18. Risks and Unknowns

## 19. Recommendations for Future Agents

## 20. Evidence Index
```

---

## Evidence Index Requirement

The final section must list important files inspected.

Example:

```markdown
## 20. Evidence Index

| File / Path | Why It Matters |
|---|---|
| `README.md` | Project introduction and setup |
| `src/Api/Program.cs` | Application startup and dependency injection |
| `docker-compose.yml` | Local infrastructure |
| `tests/` | Test strategy and covered behavior |
```

This is mandatory. It helps future agents know where the overview came from.

---

## Update Rules

If `docs/project_overview.md` already exists:

1. Read the existing file first.
2. Preserve useful existing knowledge.
3. Update outdated sections.
4. Add newly discovered evidence.
5. Mark changed assumptions.
6. Do not delete uncertain sections unless they are confirmed obsolete.
7. Keep the required top-level structure.

---

## Documentation Rules

### Be factual

Do not write:

```markdown
The project uses Kafka.
```

unless Kafka is actually found in code/config/docs.

Prefer:

```markdown
Kafka appears to be used based on `MassTransit.Kafka` references in project files.
Status: inferred
```

### Mark uncertainty

Use explicit status labels:

```text
Status: confirmed
Status: inferred
Status: unclear
Status: needs confirmation
```

### Use confidence for inferred architecture

```text
Confidence: high
Confidence: medium
Confidence: low
```

### Prefer tables for inventory

Use tables for:

- Technology stack
- Repository map
- Services/modules
- Domains
- Features
- APIs
- Events
- Data stores
- Configuration files
- Tests
- Operational concerns
- Security mechanisms
- Risks

### Prefer numbered steps for flows

Use numbered lists for functional flows.

### Avoid large raw code blocks

Do not paste large source code blocks.

Summarize behavior and reference file paths instead.

### Avoid over-documenting trivial files

Focus on knowledge useful for future agents.

---

## Quality Checklist

Before finishing, verify:

```text
[ ] Output is named docs/project_overview.md
[ ] The document is useful for future agents
[ ] Architecture is described with evidence
[ ] Technology stack is listed
[ ] Main folders are explained
[ ] Domains are identified
[ ] Features are mapped
[ ] Services/modules are inventoried
[ ] Communication patterns are documented
[ ] Data architecture is documented
[ ] API/contracts are documented
[ ] Functional flows are documented
[ ] Runtime/configuration is documented
[ ] Coding conventions are captured
[ ] Tests are summarized
[ ] Operational concerns are included
[ ] Security overview is included
[ ] Risks and unknowns are included
[ ] Evidence index is included
[ ] Uncertain claims are marked
[ ] No invented facts
[ ] Existing docs/project_overview.md was preserved/updated if present
```

---

## Minimal `docs/project_overview.md` Template

Use this template when creating a new overview.

```markdown
# Project Overview

## 1. Executive Summary

Status: needs inspection

This document summarizes the architecture, technology stack, domains, features, services, communication patterns, runtime configuration, coding conventions, tests, operational concerns, security posture, and risks of this project.

## 2. Repository Map

| Path | Purpose | Status |
|---|---|---|

## 3. Architecture Overview

### Architecture Style

Status: needs confirmation

### Key Architectural Decisions

| Decision | Evidence | Status |
|---|---|---|

## 4. Technology Stack

| Area | Technology | Version | Evidence | Status |
|---|---|---|---|---|

## 5. Project Structure

```text
/
```

| Path | Responsibility | Notes | Status |
|---|---|---|---|

## 6. Domain Overview

| Domain | Purpose | Key Concepts | Code Locations | Status |
|---|---|---|---|---|

## 7. Feature Overview

| Feature | Purpose | Entry Points | Related Domains | Status |
|---|---|---|---|---|

## 8. Services and Modules

| Service / Module | Type | Responsibility | Entry Point | Dependencies | Status |
|---|---|---|---|---|---|

## 9. Communication Between Services

| Source | Target | Mechanism | Contract / Payload | Purpose | Status |
|---|---|---|---|---|---|

### Synchronous Communication

Status: needs inspection

### Asynchronous Communication

Status: needs inspection

## 10. Data Architecture

| Data Store | Purpose | Access Method | Related Domains | Evidence | Status |
|---|---|---|---|---|---|

### Important Tables / Collections

| Table / Collection | Domain | Purpose | Evidence | Status |
|---|---|---|---|---|

## 11. API and Contracts

| API / Contract | Type | Route / Topic / Method | Purpose | Handler / Consumer | Status |
|---|---|---|---|---|---|

## 12. Functional Flows

### Flow: TBD

Trigger:
- TBD

Actors:
- TBD

Preconditions:
- TBD

Main steps:
1. TBD

Outputs:
- TBD

Side effects:
- TBD

Failure cases:
- TBD

Related files:
- TBD

Status: needs inspection

## 13. Configuration and Runtime

### Configuration Files

| File / Setting | Purpose | Notes | Status |
|---|---|---|---|

### Common Commands

```bash
# TBD
```

## 14. Coding Conventions

| Area | Convention | Evidence | Status |
|---|---|---|---|

### Design Style

Status: needs inspection

## 15. Testing Overview

| Test Type | Framework | Location | Coverage Notes | Status |
|---|---|---|---|---|

### Test Gaps

- TBD

## 16. Operational Concerns

| Concern | Current Approach | Evidence | Risk / Notes | Status |
|---|---|---|---|---|

## 17. Security Overview

| Area | Current Approach | Evidence | Status |
|---|---|---|---|

## 18. Risks and Unknowns

| Area | Risk / Unknown | Impact | Suggested Follow-up |
|---|---|---|---|

## 19. Recommendations for Future Agents

- Read this file before modifying the project.
- Confirm unclear sections before making architectural changes.
- Follow the existing coding conventions.
- Prefer existing public interfaces and module boundaries.
- Prefer behavior-focused tests when adding or changing functionality.
- Do not change API, event, or database contracts without checking all producers and consumers.
- Update this document when adding major features, services, integrations, or architectural decisions.

## 20. Evidence Index

| File / Path | Why It Matters |
|---|---|
```

---

## Relationship With Other Skills

This skill should cooperate with:

| Related Skill / File | Relationship |
|---|---|
| `boundary.md` | Defines safe change boundaries and ownership areas |
| `domain-glossary.md` | Provides business vocabulary for naming and documentation |
| `adr.md` | Captures architectural decisions and trade-offs |
| `tdd` | Adds behavior-focused tests when changing functionality |
| `refactoring` | Guides safe structural improvement after behavior is protected |
| `mocking` | Guides appropriate mock/fake usage in tests |
| `service-map.md` | Can provide deeper service dependency details |
| `api-contracts.md` | Can provide deeper API/event contract details |

`docs/project_overview.md` is the high-level project knowledge base. Other files may go deeper into specific areas.
