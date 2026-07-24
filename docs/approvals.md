# Approval Reference

Version **3.0.0-rc.4**. Token tiếng Anh; giải thích tiếng Việt.

Agent **không** tự ghi approval. Chỉ user (hoặc quy trình người được ủy quyền) mới được coi là approve.

---

## APPROVED_SPEC_PACKAGE

### Điều kiện

```text
validation passed
spec-review passed
no blockers
status == awaiting_approval (hoặc tương đương đã sẵn sàng approve)
```

### Hiệu lực

- Manifest: `approval.spec_package` + status → `approved`.
- Mở quyền `/develop` / execution.

### Ai approve

User / product owner của request.

### Invalidation

Thay đổi material: requirements, design, tasks, acceptance, traceability → **invalidate** → phải spec-review lại + approve lại.

### Duplicate

Approve trùng khi đã approved: no-op an toàn / ghi nhận đã có; không bypass gate khác.

### Rejection

`REJECTED` → dừng; hỏi có re-analyze từ đầu không.

---

## APPROVED_DEVELOP

### Khi nào

Áp dụng khi **policy/risk** (thường High) yêu cầu thêm gate trước khi code.

### Điều kiện

- Spec Package đã `APPROVED_SPEC_PACKAGE`.
- Risk/policy đánh dấu cần develop approval.

### Hiệu lực

- Manifest: `approval.develop`.
- Cho phép develop tiếp tục.

### Không thay thế

Không thay `APPROVED_SPEC_PACKAGE` hay `APPROVED_DEPLOY`.

---

## APPROVED_USER_REVIEW

### Điều kiện

```text
converge passed
status == awaiting_user_review
```

### Hiệu lực

- Manifest: `approval.user_review`.
- Status → `done`.

### Ai approve

User nghiệm thu feature.

### Không thay thế

**Không** dùng token này thay `APPROVED_DEPLOY`.

### Rejection

User reject → không `done`; ghi lý do; có thể quay QA/repair hoặc cập nhật package.

---

## APPROVED_DEPLOY

### Điều kiện

- User **chủ động** gọi deploy.
- Token `APPROVED_DEPLOY` riêng cho lần deploy đó (theo skill/deploy policy).

### Hiệu lực

- Cho phép thao tác deploy.
- Luôn tách biệt khỏi user review.

### Ai approve

User / release owner.

### Invalidation / duplicate

Theo skill deploy: thiếu token → BLOCKED. Không suy diễn từ `APPROVED_USER_REVIEW`.

---

## Quy tắc chung

| Rule | Behavior |
|---|---|
| Không auto-approve | Agent không tự set approved |
| Không đổi token | Mỗi gate một token |
| Manifest là truth | Field approval trên `manifest.yaml` |
| Re-approval | Material change → invalidate Spec Package approval |
| Deploy | Luôn cần `APPROVED_DEPLOY` |
