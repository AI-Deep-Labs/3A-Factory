# Example Spec Package — REQ-000001-example-feature

Đây là **sample completed lifecycle** (minh họa), không phải feature thật của ứng dụng.

Trong repo đích, package sống tại:

```text
docs/tasks/REQ-000001-example-feature/
```

Thư mục `examples/spec-packages/` chỉ là fixture minh họa trong repo 3a-factory.

## Validation

```bash
node -e "const v=require('./scripts/validation'); const p='examples/spec-packages/REQ-000001-example-feature'; console.log(v.validatePackageLayout('examples/spec-packages')); console.log(v.validateTraceability(p)); console.log(require('./scripts/validation/validate-manifest').validateManifestFile(p+'/manifest.yaml','REQ-000001-example-feature'));"
```
