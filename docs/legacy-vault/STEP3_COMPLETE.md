# Step 3 complete — Design system + shadcn

## Checklist

- [x] Tailwind CSS v4 + `@tailwindcss/vite`
- [x] shadcn/ui initialized (`components.json`)
- [x] Core shadcn components in `src/components/ui/`
- [x] Stitch tokens mapped to CSS variables (`#C49B6C` primary, cream background)
- [x] Fonts: Space Mono (headlines) + Inter (body) via `index.html`
- [x] Shared Legacy Vault components:
  - `StatusBadge` — ACTIVE, VERIFIED, ARCHIVED, DRAFT, REVOKED, etc.
  - `StatCard` — dashboard KPI cards
  - `VaultCard` — jurisdiction vault grid cards
  - `DataTable` — ledger/security table shell
- [x] Design system preview page

## Preview components

With dev server running:

**http://localhost:5173/dev/design**

Or from login: **View design system (Step 3)** link in the footer.

## File locations

```text
legacy-vault/ui/
├── components.json
├── src/
│   ├── components/
│   │   ├── ui/          # shadcn primitives
│   │   └── legacy/      # StatCard, VaultCard, StatusBadge, DataTable
│   ├── pages/DesignSystemPage.tsx
│   └── index.css        # Tailwind + Legacy Vault theme
```

## What's next — Step 4

- `AuthContext` + `RoleGuard`
- `ClientShell` vs `AdminShell`
- Mock fixtures + `useVaultScope` / redaction
- Wire login → role-appropriate home
