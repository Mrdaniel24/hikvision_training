# Fonts

Files in this folder are **brand-supplied** font files self-hosted by the design system.

| File | Family / weight | Status |
| --- | --- | --- |
| `Poppins-Medium.ttf` | Poppins · 500 | ✅ Brand-supplied, self-hosted via `@font-face` in `../colors_and_type.css` |

## Fonts still loading from Google Fonts (substitution)

These are placeholders awaiting brand-supplied files. When the official files arrive, drop them here and add an `@font-face` rule for each in `colors_and_type.css`, then remove the corresponding family from the `@import` line at the top of that file.

| Token | Family | Weights needed | Why it's still on CDN |
| --- | --- | --- | --- |
| `--font-display` | **Space Grotesk** | 400 / 500 / 600 / 700 | No display face has been supplied. Used at large hero sizes — needs at minimum a 600 weight. |
| `--font-body` | **Poppins** | 400 / 600 / 700 | Only Medium (500) was supplied. Regular (400) is essential for body, 600/700 for emphasis. |
| `--font-mono` | **JetBrains Mono** | 400 / 500 / 600 | No mono face has been supplied. Used for IDs, timestamps, status pills. |

## Production hardening checklist

1. Receive remaining Poppins weights (or confirm Poppins is the final body face).
2. Confirm display family — keep Space Grotesk, or swap for a licensed paid face (Söhne Breit, GT America, etc.).
3. Confirm mono family — keep JetBrains Mono, or swap for Berkeley Mono / GT America Mono.
4. Self-host all weights, delete the `@import` from `colors_and_type.css`.
5. Add `font-display: swap` everywhere (already set on the supplied face).
