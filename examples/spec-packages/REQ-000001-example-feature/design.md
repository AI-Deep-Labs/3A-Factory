# Design — REQ-000001-example-feature

Technical Truth (mẫu). `ADR_NOT_REQUIRED`.

## Linked requirements

- FR-001, FR-002, BR-001, NFR-001

## Design items

### DES-API-001 — GET /demo/categories

Endpoint đọc trả `{ "items": [ { "id", "name" } ] }`. Method khác → 405.

### DES-FLOW-001 — In-memory fixture load

Khi process start (hoặc lazy init), load fixture tĩnh vào memory; request chỉ đọc memory.

## Trace matrix

| Requirement | Design |
|---|---|
| FR-001 | DES-API-001, DES-FLOW-001 |
| FR-002 | DES-API-001 |
| BR-001 | DES-API-001 |
| NFR-001 | DES-FLOW-001 |
