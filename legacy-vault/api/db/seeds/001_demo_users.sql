insert into organizations (id, name, organization_type)
values
  ('00000000-0000-4000-8000-000000000001', 'Legacy Vault Trust Administration', 'trust_company'),
  ('00000000-0000-4000-8000-000000000002', 'Sterling & Co.', 'law_firm')
on conflict (id) do update set
  name = excluded.name,
  organization_type = excluded.organization_type,
  updated_at = now();

insert into users (id, organization_id, display_name, role, ledger_party_display_name)
values
  ('sarah.m', '00000000-0000-4000-8000-000000000001', 'Sarah Mitchell', 'hnwi', 'Testator_Sarah'),
  ('alex.h', '00000000-0000-4000-8000-000000000001', 'Alex Henderson', 'heir', 'Heir_Alex'),
  ('oracle@lawfirm', '00000000-0000-4000-8000-000000000002', 'Sterling & Co.', 'oracle', 'Oracle_Sterling'),
  ('admin@legacyvault', '00000000-0000-4000-8000-000000000001', 'Trust Admin', 'admin', 'Admin_Trust')
on conflict (id) do update set
  organization_id = excluded.organization_id,
  display_name = excluded.display_name,
  role = excluded.role,
  ledger_party_display_name = excluded.ledger_party_display_name,
  updated_at = now();
