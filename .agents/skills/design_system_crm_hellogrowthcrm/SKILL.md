---
name: design-system-crm-hellogrowthcrm
description: Creates implementation-ready design-system guidance with tokens, component behavior, and accessibility standards. Use when creating or updating UI rules, component specifications, or design-system documentation.
---

# Design System Customization Element: CRM — HelloGrowthCRM

This skill provides implementation-ready instructions, semantic token setups, accessibility criteria, and state behaviors for HelloGrowthCRM design alignments.

## 1. Design Intent
The goal of HelloGrowthCRM design system is to build structured, WCAG 2.2 AA compliant, accessible, token-driven interface guidelines across the CRM dashboard web app ecosystem.

## 2. Style Foundations & Tokens

### Typography Stack
- `font.family.primary` = `Inter`
- `font.family.stack` = `Inter, system-ui, sans-serif`
- `font.size.base` = `16px`
- `font.weight.base` = `400`
- `font.lineHeight.base` = `24px`

### Typography Scale
- `font.size.xs` = `10.5px`
- `font.size.sm` = `11px`
- `font.size.md` = `12px`
- `font.size.lg` = `12.5px`
- `font.size.xl` = `13px`
- `font.size.2xl` = `14px`
- `font.size.3xl` = `16px`

### Color Palette (Adaptive Profiles)
- `color.text.primary` = `#0f1729`
- `color.text.secondary` = `#65758b`
- `color.text.inverse` = `#ffffff`
- `color.surface.base` = `#000000`
- `color.surface.muted` = `#f9fafb`
- `color.surface.raised` = `#f1f5f9`
- `color.surface.strong` = `#156bf4`
- `color.border.default` = `#e1e7ef`

### Spacing Scale
- `space.1` = `1px`
- `space.2` = `4px`
- `space.3` = `6px`
- `space.4` = `8px`
- `space.5` = `10px`
- `space.6` = `12px`
- `space.7` = `14px`
- `space.8` = `16px`

### Radius, Shadow, & Motion Tokens
- `radius.xs` = `7px`
- `radius.sm` = `8px`
- `radius.md` = `9px`
- `radius.lg` = `10px`
- `radius.xl` = `16px`
- `radius.2xl` = `9999px`
- `shadow.1` = `rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px`
- `shadow.2` = `rgba(21, 107, 244, 0.28) 0px 2px 8px 0px, rgba(255, 255, 255, 0.15) 0px 1px 0px 0px inset`
- `shadow.3` = `rgb(249, 250, 251) 0px 0px 0px 0px, rgb(225, 231, 239) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px`
- `shadow.4` = `rgb(255, 255, 255) 0px 0px 0px 0px, rgba(21, 107, 244, 0.4) 0px 0px 0px 3px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px`
- `motion.duration.instant` = `100ms`
- `motion.duration.fast` = `150ms`
- `motion.duration.normal` = `200ms`
- `motion.duration.slow` = `300ms`

---

## 3. Rules & Workflow Guidelines

### Do:
- Every component must use semantic variables.
- Interactive elements must support `:focus-visible` focus rings (3:1 contrast ratio minimum).
- Components must implement all states: *default, hover, active, focus-visible, loading, error, and disabled*.

### Don't:
- Do not introduce local styling overrides.
- Do not allow text contrast ratios below WCAG 2.2 AA standards (4.5:1 for regular text).
