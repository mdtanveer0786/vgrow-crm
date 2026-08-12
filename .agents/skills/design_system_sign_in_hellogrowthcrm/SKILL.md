---
name: design-system-sign-in-hellogrowthcrm
description: Creates implementation-ready design-system guidance with tokens, component behavior, and accessibility standards. Use when creating or updating UI rules, component specifications, or design-system documentation.
---

# Design System Guidelines: Sign In — HelloGrowthCRM

This skill provides implementation-ready instructions, semantic token setups, accessibility criteria, and state behaviors for HelloGrowthCRM Sign In / Login interface alignments.

## 1. Design Intent
Establish a high-contrast, secure, and keyboard-navigable landing interface that leverages exact semantic tokens to authenticate CRM operators and dashboard users safely.

## 2. Design Tokens & Foundations

### Typography Stack
- `font.family.primary` = `Inter`
- `font.family.stack` = `Inter, system-ui, sans-serif`
- `font.size.base` = `14px`
- `font.weight.base` = `500`
- `font.lineHeight.base` = `20px`

### Typography Scale
- `font.size.xs` = `11px`
- `font.size.sm` = `12.5px`
- `font.size.md` = `14px`
- `font.size.lg` = `14.5px`
- `font.size.xl` = `15px`
- `font.size.2xl` = `16px`
- `font.size.3xl` = `36px`

### Color Palette
- `color.text.primary` = `#f8fafc`
- `color.text.secondary` = `#e2e8f0`
- `color.text.tertiary` = `#156bf4`
- `color.text.inverse` = `#ffffff`
- `color.surface.base` = `#000000`
- `color.surface.muted` = `#080c16`
- `color.border.default` = `#343d4c`

### Spacing Scale
- `space.1` = `8px`
- `space.2` = `12px`
- `space.3` = `16px`
- `space.4` = `24px`
- `space.5` = `32px`
- `space.6` = `40px`
- `space.7` = `48px`
- `space.8` = `160.4px`

### Radius, Shadow, & Motion Tokens
- `radius.xs` = `10px`
- `motion.duration.instant` = `150ms`

---

## 3. Component-Level Rules & Anatomy

All components must strictly adhere to the following anatomy and state specifications.

### A. Input Fields (Email/Password)
- **Anatomy:** Form Label + Input Area + Optional leading/trailing icon + Error sub-label.
- **Default Style:** Background: `color.surface.muted`, Border: `1px solid color.border.default`, Color: `color.text.primary`.
- **States:**
  - **Hover:** Border color: `color.text.secondary`.
  - **Focus-Visible:** Glowing blue border outline.
  - **Active:** Background slightly raised.
  - **Disabled:** Opacity: `0.5`, Cursor: `not-allowed`.
  - **Loading:** Input area disabled, cursor shows loading spin.
  - **Error:** Border color: `#f43f5e`, error text printed in line.

### B. Action Buttons (Submit Login)
- **Anatomy:** Text Label + Optional icon.
- **Default Style:** Background: `color.text.tertiary` (Blue active surface), Text: `color.text.inverse`, Radius: `radius.xs`.
- **States:**
  - **Hover:** Brightness transition (`filter: brightness(1.15)`).
  - **Focus-Visible:** Outline matches blue active surface.
  - **Active:** Scale down transformation (`transform: scale(0.98)`).
  - **Disabled:** Opacity: `0.5`, Cursor: `not-allowed`.
  - **Loading:** Label replaced with loader spinner.

---

## 4. Accessibility Requirements (WCAG 2.2 AA)

- **Keyboard Navigation:** Forms must be navigable using `Tab` and submit handlers triggerable via `Enter`.
- **Focus-Visible:** Focus indicators must maintain a minimum contrast ratio of `3:1` against adjacent background colors.
- **Contrast Ratios:** Text on inputs must exceed a minimum contrast ratio of `4.5:1` for regular text.

### Pass/Fail Checks
- `[ ]` Tab through Sign In inputs (Pass: Focus indicator is visible on every step).
- `[ ]` Run screen reader scan on form fields (Pass: All input tags have associated `<label>` or `aria-label`).
- `[ ]` Contrast compliance check (Pass: Input values contrast against background exceeds 4.5:1).

---

## 5. Anti-Patterns & Prohibited Implementations

- 🚫 **Do Not** use hex values (like `#1a1a1a`) directly inside page styles. Always use system token pointers (like `var(--bg-primary)`).
- 🚫 **Do Not** remove the `:focus` outline without providing an explicit `:focus-visible` custom glow alternative.
- 🚫 **Do Not** hide error messages inside hovering tooltips. All errors must be printed statically in line.

---

## 6. Design System QA Checklist

- `[ ]` Verify all components import base font family `Inter`.
- `[ ]` Check input background variables adapt dynamically.
- `[ ]` Ensure form fields spacing scale matches `space.3` (16px) standard margins.
