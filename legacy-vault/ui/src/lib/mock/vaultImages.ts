/** Placeholder vault header imagery (grayscale gradients until Stitch assets land). */
export const VAULT_IMAGES: Record<string, string> = {
  'Geneva, CH':
    'linear-gradient(160deg, #8a8278 0%, #4a4540 50%, #2d2926 100%)',
  'Zurich, CH':
    'linear-gradient(160deg, #6b6560 0%, #3d3a36 60%, #1a1816 100%)',
  'London, UK':
    'linear-gradient(160deg, #7a756e 0%, #4d4843 40%, #2d2926 100%)',
  'New York, US':
    'linear-gradient(160deg, #9a948c 0%, #5c5752 50%, #2d2926 100%)',
}

export function vaultImageFor(jurisdiction: string): string {
  return VAULT_IMAGES[jurisdiction] ?? 'linear-gradient(135deg, #6b6560 0%, #2d2926 100%)'
}
