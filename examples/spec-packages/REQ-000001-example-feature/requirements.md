# Requirements — REQ-000001-example-feature

Business Truth (mẫu).

## Functional

### FR-001 — Liệt kê danh mục mẫu

Hệ thống cung cấp danh sách danh mục mẫu dưới dạng JSON khi client gọi API đọc.

### FR-002 — Mỗi danh mục có id và name

Mỗi phần tử trong danh sách phải có `id` (string) và `name` (string không rỗng).

## Business rules

### BR-001 — Chỉ đọc

API này không chấp nhận thao tác tạo/sửa/xóa danh mục.

## Non-functional

### NFR-001 — Thời gian phản hồi demo

Trong môi trường local demo, phản hồi danh sách phải hoàn thành trong 200ms (fixture in-memory).

## Trace summary

| ID | Type |
|---|---|
| FR-001 | FR |
| FR-002 | FR |
| BR-001 | BR |
| NFR-001 | NFR |
