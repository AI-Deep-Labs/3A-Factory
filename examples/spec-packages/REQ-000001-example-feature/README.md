# Example Spec Package — REQ-000001-example-feature

Đây là **sample completed lifecycle** (minh họa), không phải feature thật của ứng dụng.

- Mục đích: onboarding + kiểm thử validator / tài liệu.
- Không chứa application source code thật.
- Không dùng dữ liệu nhạy cảm.
- Trạng thái mẫu: `done` sau `APPROVED_USER_REVIEW` (deploy approval vẫn `pending` — deploy tách biệt).

## Cấu trúc

Xem các file trong thư mục này. Manifest: `manifest.yaml`.

## Validation

Chạy từ root repo:

```bash
node -e "const v=require('./scripts/validation'); const p='examples/spec-packages/REQ-000001-example-feature'; console.log(v.validatePackageLayout('examples/spec-packages')); console.log(v.validateTraceability(p)); console.log(require('./scripts/validation/validate-manifest').validateManifestFile(p+'/manifest.yaml','REQ-000001-example-feature'));"
```
