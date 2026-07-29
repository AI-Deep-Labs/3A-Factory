# Approval Reference

Version **3.1.0-rc.4**. Gate IDs tiếng Anh (nội bộ); giải thích tiếng Việt.

Agent **không** tự ghi approval. Chỉ user (hoặc quy trình được ủy quyền) mới được coi là approve.

## Xác nhận tự nhiên (mặc định)

User **không cần** gõ token `APPROVED_*`. Tại mỗi gate, agent hỏi **một câu xác nhận**; user trả lời:

- **Đồng ý:** yes, có, đồng ý, ok, phê duyệt, nghiệm thu, …
- **Từ chối:** no, không, từ chối, chưa, …
- Hoặc câu tự nhiên tương đương

Agent map câu trả lời vào **gate đang active** (theo `manifest.status`). Token literal vẫn hợp lệ cho power users.

Contract: `.agents/contracts/spec-package.md` § **5.4.1**  
Câu hỏi mẫu: `.agents/templates/APPROVAL-CONFIRMATION-template.md`

| Gate (internal) | Câu hỏi mẫu (VN) |
|---|---|
| `APPROVED_SPEC_PACKAGE` | Spec Package đã pass review. Bạn **phê duyệt spec** để bắt đầu develop không? |
| `APPROVED_DEVELOP` | Feature **high-risk**. Bạn **đồng ý bắt đầu implement** không? |
| `APPROVED_USER_REVIEW` | Converge đã PASS. Bạn **nghiệm thu** feature này không? |
| `APPROVED_DEPLOY` | Bạn **xác nhận deploy** lên `{env}` không? |

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
- Mở quyền develop / execution.

### Ai approve

User / product owner của request.

### Invalidation

Thay đổi material: requirements, design, tasks, acceptance, traceability → **invalidate** → phải spec-review lại + approve lại.

### Duplicate

Approve trùng khi đã approved: no-op an toàn / ghi nhận đã có; không bypass gate khác.

### Rejection

User từ chối → `APPROVAL_REJECTED`; không set approved; hỏi có re-analyze từ đầu không nếu cần.

---

## APPROVED_DEVELOP

### Khi nào

Áp dụng khi **policy/risk** (thường High) yêu cầu thêm gate trước khi code.

### Điều kiện

- Spec Package đã approved.
- Risk/policy đánh dấu cần develop approval.

### Hiệu lực

- Manifest: `approval.develop`.
- Cho phép develop tiếp tục.

### Không thay thế

Không thay spec package approval hay deploy approval.

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

**Không** dùng gate này thay deploy approval.

### Rejection

User từ chối → không `done`; ghi lý do; có thể quay QA/repair hoặc cập nhật package.

---

## APPROVED_DEPLOY

### Điều kiện

- User **chủ động** gọi deploy.
- Deploy confirmation (tự nhiên hoặc token) cho lần deploy đó.

### Hiệu lực

- Cho phép thao tác deploy.
- Luôn tách biệt khỏi user review.

### Ai approve

User / release owner.

### Invalidation / duplicate

Theo skill deploy: thiếu confirmation → BLOCKED. Không suy diễn từ user review approval.

---

## Quy tắc chung

| Rule | Behavior |
|---|---|
| Không auto-approve | Agent không tự set approved |
| Gate IDs nội bộ | `APPROVED_*` trong manifest; user trả lời tự nhiên |
| Manifest là truth | Field approval trên `manifest.yaml` |
| Re-approval | Material change → invalidate Spec Package approval |
| Deploy | Luôn cần deploy confirmation riêng |
