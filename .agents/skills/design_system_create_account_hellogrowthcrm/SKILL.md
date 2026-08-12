---
name: design-system-create-account-hellogrowthcrm
description: Creates implementation-ready design-system guidance with tokens, component behavior, and accessibility standards for the Create Account / Sign Up workspace.
---

# Design System Guidelines: Create Account — HelloGrowthCRM

This skill provides implementation-ready instructions, semantic token setups, accessibility criteria, and state behaviors for HelloGrowthCRM Create Account / Sign Up interface alignments.

## 1. Design Intent
Establish a highly structured, accessible, and responsive user registration interface using exact spacing and typography scales to onboard new CRM tenants.

## 2. Design Tokens & Foundations

### Typography Stack
- `font.family.primary` = `Inter`
- `font.family.stack` = `Inter, system-ui, sans-serif`
- `font.size.base` = `16px`
- `font.weight.base` = `400`
- `font.lineHeight.base` = `24px`

### Typography Scale
- `font.size.xs` = `11px`
- `font.size.sm` = `12px`
- `font.size.md` = `12.5px`
- `font.size.lg` = `13px`
- `font.size.xl` = `14px`
- `font.size.2xl` = `14.5px`
- `font.size.3xl` = `16px`
- `font.size.4xl` = `26px`

### Color Palette
- `color.text.primary` = `#e2e8f0`
- `color.text.secondary` = `#f8fafc`
- `color.text.tertiary` = `#cbd5e1`
- `color.text.inverse` = `#156bf4`
- `color.surface.base` = `#000000`
- `color.surface.muted` = `#080c16`
- `color.surface.strong` = `#ffffff`
- `color.border.default` = `#343d4c`

### Spacing Scale
- `space.1` = `1px`
- `space.2` = `2px`
- `space.3` = `4px`
- `space.4` = `6px`
- `space.5` = `8px`
- `space.6` = `12px`
- `space.7` = `16px`
- `space.8` = `24px`

### Radius, Shadow, & Motion Tokens
- `radius.xs` = `4px`
- `radius.sm` = `10px`
- `shadow.1` = `rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px`
- `motion.duration.instant` = `150ms`

---

## 3. Component-Level Rules & Anatomy

All components must strictly adhere to the following anatomy and state specifications.

### A. Input Fields (Company Name/First Name/Last Name/Email/Password)
- **Anatomy:** Form Label + Input Area + Optional leading/trailing icon + Error sub-label.
- **Default Style:** Background: `color.surface.muted`, Border: `1px solid color.border.default`, Color: `color.text.primary`, Radius: `radius.xs`.
- **States:**
  - **Hover:** Border color: `color.text.secondary`.
  - **Focus-Visible:** Glowing blue border outline.
  - **Active:** Background slightly raised.
  - **Disabled:** Opacity: `0.5`, Cursor: `not-allowed`.
  - **Loading:** Input area disabled, cursor shows loading spin.
  - **Error:** Border color: `#f43f5e`, error text printed in line.

### B. Action Buttons (Submit Registration)
- **Anatomy:** Text Label + Optional icon.
- **Default Style:** Background: `color.surface.strong` (White active surface), Text: `color.surface.base` (Black), Radius: `radius.sm`.
- **States:**
  - **Hover:** Brightness transition (`filter: brightness(0.9)`).
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
- `[ ]` Tab through Sign Up inputs (Pass: Focus indicator is visible on every step).
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
- `[ ]` Ensure form fields spacing scale matches `space.6` (12px) standard margins.
