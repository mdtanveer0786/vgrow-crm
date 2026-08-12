---
name: design-system-set-up-your-workspace-hellogrowthcrm
description: Creates implementation-ready design-system guidance with tokens, component behavior, and accessibility standards. Use when creating or updating UI rules, component specifications, or design-system documentation.
---

# Design System Guidelines: Set Up Your Workspace — HelloGrowthCRM

This skill provides implementation-ready instructions, semantic token setups, accessibility criteria, and state behaviors for HelloGrowthCRM Onboarding / Workspace Setup alignments.

## 1. Design Intent
Establish an interactive, screen-reader accessible onboarding portal using precise steps to configure initial organization parameters like employee directories and active modules.

## 2. Design Tokens & Foundations

### Typography Stack
- `font.family.primary` = `Inter`
- `font.family.stack` = `Inter, system-ui, sans-serif`
- `font.size.base` = `12px`
- `font.weight.base` = `500`
- `font.lineHeight.base` = `16px`

### Typography Scale
- `font.size.xs` = `12px`
- `font.size.sm` = `12.5px`
- `font.size.md` = `14px`
- `font.size.lg` = `14.5px`
- `font.size.xl` = `16px`
- `font.size.2xl` = `22px`

### Color Palette
- `color.text.primary` = `#cbd5e1`
- `color.text.secondary` = `#f8fafc`
- `color.text.tertiary` = `#e2e8f0`
- `color.text.inverse` = `#ffffff`
- `color.surface.base` = `#000000`
- `color.surface.muted` = `#080c16`
- `color.surface.raised` = `#156bf4`
- `color.surface.strong` = `#151b28`
- `color.border.default` = `#343d4c`

### Spacing Scale
- `space.1` = `2px`
- `space.2` = `4px`
- `space.3` = `6px`
- `space.4` = `8px`
- `space.5` = `12px`
- `space.6` = `16px`
- `space.7` = `20px`
- `space.8` = `24px`

### Radius, Shadow, & Motion Tokens
- `radius.xs` = `10px`
- `radius.sm` = `12px`
- `radius.md` = `9999px`
- `shadow.1` = `rgb(255, 255, 255) 0px 0px 0px 0px, rgba(21, 107, 244, 0.4) 0px 0px 0px 3px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px`
- `shadow.2` = `rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px`
- `motion.duration.instant` = `150ms`
- `motion.duration.fast` = `200ms`

---

## 3. Component-Level Rules & Anatomy

All components must strictly adhere to the following anatomy and state specifications.

### A. Input Fields (Configuration Parameters)
- **Anatomy:** Form Label + Input Area + Optional leading/trailing icon + Error sub-label.
- **Default Style:** Background: `color.surface.muted`, Border: `1px solid color.border.default`, Color: `color.text.primary`, Radius: `radius.xs`.
- **States:**
  - **Hover:** Border color: `color.text.secondary`.
  - **Focus-Visible:** Glowing blue border outline.
  - **Active:** Background slightly raised.
  - **Disabled:** Opacity: `0.5`, Cursor: `not-allowed`.
  - **Loading:** Input area disabled, cursor shows loading spin.
  - **Error:** Border color: `#f43f5e`, error text printed in line.

### B. Setup Action Buttons (Save Configuration)
- **Anatomy:** Text Label + Optional icon.
- **Default Style:** Background: `color.surface.raised` (Active blue), Text: `color.text.inverse`, Radius: `radius.sm` (Pill border).
- **States:**
  - **Hover:** Brightness transition (`filter: brightness(1.15)`).
  - **Focus-Visible:** Outline matches blue active surface.
  - **Active:** Scale down transformation (`transform: scale(0.98)`).
  - **Disabled:** Opacity: `0.5`, Cursor: `not-allowed`.
  - **Loading:** Label replaced with loader spinner.

---

## 4. Accessibility Requirements (WCAG 2.2 AA)

- **Keyboard Navigation:** Onboarding steps must support `Tab` navigation and action triggers executing with `Enter`.
- **Focus-Visible:** Focus indicators must maintain a minimum contrast ratio of `3:1` against adjacent background colors.
- **Contrast Ratios:** Text on inputs must exceed a minimum contrast ratio of `4.5:1` for regular text.

### Pass/Fail Checks
- `[ ]` Tab through Onboarding inputs (Pass: Focus indicator is visible on every step).
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
- `[ ]` Ensure form fields spacing scale matches `space.6` (16px) standard margins.
