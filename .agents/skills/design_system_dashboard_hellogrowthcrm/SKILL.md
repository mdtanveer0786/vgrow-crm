---
name: design-system-dashboard-hellogrowthcrm
description: Creates implementation-ready design-system guidance with tokens, component behavior, and accessibility standards. Use when creating or updating UI rules, component specifications, or design-system documentation.
---

# Design System Guidelines: Dashboard — HelloGrowthCRM

This skill provides implementation-ready instructions, semantic token setups, accessibility criteria, and state behaviors for HelloGrowthCRM Dashboard alignments.

## 1. Design Intent
Establish a highly structured, Manrope-driven, content-first dashboard viewport to coordinate and visualize CRM leads funnel activity indicators cleanly.

## 2. Design Tokens & Foundations

### Typography Stack
- `font.family.primary` = `Manrope`
- `font.family.stack` = `Manrope, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif`
- `font.size.base` = `16px`
- `font.weight.base` = `400`
- `font.lineHeight.base` = `24px`

### Typography Scale
- `font.size.xs` = `10px`
- `font.size.sm` = `10.5px`
- `font.size.md` = `11px`
- `font.size.lg` = `12px`
- `font.size.xl` = `12.5px`
- `font.size.2xl` = `13px`
- `font.size.3xl` = `14px`
- `font.size.4xl` = `15px`

### Color Palette
- `color.text.primary` = `#f8fafc`
- `color.text.secondary` = `#b3bdcc`
- `color.text.tertiary` = `#e7ecf3`
- `color.text.inverse` = `#ffffff`
- `color.surface.base` = `#000000`
- `color.surface.muted` = `#151b28`
- `color.surface.raised` = `#080c16`
- `color.surface.strong` = `#1d283a`
- `color.border.default` = `#343d4c`

### Spacing Scale
- `space.1` = `1px`
- `space.2` = `2px`
- `space.3` = `4px`
- `space.4` = `6px`
- `space.5` = `8px`
- `space.6` = `10px`
- `space.7` = `12px`
- `space.8` = `14px`

### Radius, Shadow, & Motion Tokens
- `radius.xs` = `7px`
- `radius.sm` = `9px`
- `radius.md` = `10px`
- `radius.lg` = `11px`
- `radius.xl` = `12px`
- `radius.2xl` = `16px`
- `radius.step7` = `24px`
- `radius.step8` = `9999px`
- `shadow.1` = `rgba(15, 23, 42, 0.06) 0px 1px 2px 0px, rgba(15, 23, 42, 0.14) 0px 8px 24px -6px`
- `shadow.2` = `rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px`
- `shadow.3` = `rgba(21, 107, 244, 0.28) 0px 2px 8px 0px, rgba(255, 255, 255, 0.15) 0px 1px 0px 0px inset`
- `shadow.4` = `rgba(37, 99, 235, 0.28) 0px 8px 18px 0px`
- `motion.duration.instant` = `100ms`
- `motion.duration.fast` = `150ms`
- `motion.duration.normal` = `180ms`
- `motion.duration.slow` = `200ms`
- `motion.duration.slower` = `300ms`

---

## 3. Component-Level Rules & Anatomy

All components must strictly adhere to the following anatomy and state specifications.

### A. Dashboard Metrics Cards
- **Anatomy:** Category Header + Main Stat Value + Trend indicator percentage.
- **Default Style:** Background: `color.surface.raised` (`#080c16`), Border: `1px solid color.border.default`, Color: `color.text.primary`.
- **States:**
  - **Hover:** Border color: `color.surface.strong`, Background: `color.surface.muted`.

---

## 4. Accessibility Requirements (WCAG 2.2 AA)

- **Keyboard Navigation:** Widget charts and stats must support Tab keys focus transitions.
- **Focus-Visible:** Focus indicators must maintain a minimum contrast ratio of `3:1` against adjacent background colors.
- **Contrast Ratios:** Text on inputs must exceed a minimum contrast ratio of `4.5:1` for regular text.

---

## 5. Anti-Patterns & Prohibited Implementations

- 🚫 **Do Not** use hex values directly inside page styles. Always use system token pointers.
- 🚫 **Do Not** remove the `:focus` outline.

---

## 6. Design System QA Checklist

- `[ ]` Verify all components import base font family `Manrope`.
- `[ ]` Confirm modal transitions execute within `motion.duration.normal`.
