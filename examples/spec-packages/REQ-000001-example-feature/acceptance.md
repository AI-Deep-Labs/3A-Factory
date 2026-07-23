# Acceptance — REQ-000001-example-feature

Verification Truth (mẫu).

## Acceptance criteria

### AC-001 — Fixture có ít nhất hai danh mục hợp lệ

- Links: FR-001, FR-002, DES-FLOW-001, TASK-001
- Given fixture đã load
- When đọc danh sách trong memory
- Then có ≥ 2 phần tử, mỗi phần tử có `id` và `name` không rỗng

### AC-002 — GET trả JSON items

- Links: FR-001, FR-002, BR-001, DES-API-001, TASK-002
- Given server demo chạy
- When `GET /demo/categories`
- Then 200 + body có `items` array đúng schema
- When `POST /demo/categories`
- Then 405

## Unit tests

### UT-001 — parse/validate category item

- Links: FR-002, TASK-001
- Unit test xác nhận item thiếu `name` bị reject ở lớp model (mẫu).

## System tests

### ST-001 — GET categories happy path

- Links: FR-001, DES-API-001, TASK-002
- System test gọi GET và assert status + shape.

## UAT

### UAT-001 — Demo UI thấy danh mục

- Links: FR-001, TASK-002
- User mở trang demo và thấy danh sách danh mục từ API.
