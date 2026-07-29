# Approval confirmation prompts

Use when an approval gate is active. Ask **one** question; accept natural language or exact `APPROVED_*` tokens. See contract § 5.4.1.

## APPROVED_SPEC_PACKAGE

**When:** `manifest.status == awaiting_approval`, spec-review PASSED, no blockers.

**Question (VN):**

> Spec Package đã pass review. Bạn **phê duyệt spec** để bắt đầu develop không?

**On affirm:** `approval.spec_package.status: approved`, `manifest.status: approved`.

---

## APPROVED_DEVELOP

**When:** high-risk policy requires develop approval; `approval.develop.status != approved` before first develop.

**Question (VN):**

> Feature **high-risk**. Bạn **đồng ý bắt đầu implement** không?

**On affirm:** `approval.develop.status: approved`.

---

## APPROVED_USER_REVIEW

**When:** `manifest.status == awaiting_user_review`, `qa.converge == passed`.

**Question (VN):**

> Converge đã PASS. Bạn **nghiệm thu** feature này không?

**On affirm:** `approval.user_review.status: approved`, `manifest.status: done`.

---

## APPROVED_DEPLOY

**When:** user explicitly requests deploy; `manifest.status == done`.

**Question (VN):**

> Bạn **xác nhận deploy** lên `{env}` không? (Rollback: {brief rollback note})

**On affirm:** `approval.deploy.status: approved` — then execute deploy steps.
