---
name: design-system-hellomail-hellogrowthcrm
description: Creates implementation-ready design-system guidance with tokens, component behavior, and accessibility standards for the HelloMail email workspace.
---

# Design System Guidelines: HelloMail — HelloGrowthCRM

This skill provides implementation-ready instructions, semantic token setups, accessibility criteria, and state behaviors for HelloGrowthCRM HelloMail workspace alignments.

## 1. Design Intent
Establish a highly structured, content-first, and WCAG compliant email client interface utilizing precise layout components to display list threads and email contents.

## 2. Design Tokens & Foundations

### Typography Stack
- `font.family.primary` = `Inter`
- `font.family.stack` = `Inter, system-ui, sans-serif`
- `font.size.base` = `14px`
- `font.weight.base` = `500`
- `font.lineHeight.base` = `20px`

### Typography Scale
- `font.size.xs` = `10.5px`
- `font.size.sm` = `11px`
- `font.size.md` = `12px`
- `font.size.lg` = `12.5px`
- `font.size.xl` = `13px`
- `font.size.2xl` = `14px`
- `font.size.3xl` = `16px`
- `font.size.4xl` = `24px`

### Color Palette
- `color.text.primary` = `#b3bdcc`
- `color.text.secondary` = `#f8fafc`
- `color.text.inverse` = `#ffffff`
- `color.surface.base` = `#000000`
- `color.surface.muted` = `#151b28`
- `color.surface.raised` = `#156bf4`
- `color.surface.strong` = `#080c16`
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
- `radius.sm` = `8px`
- `radius.md` = `9px`
- `radius.lg` = `10px`
- `radius.xl` = `12px`
- `radius.2xl` = `9999px`
- `shadow.1` = `rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px`
- `shadow.2` = `rgb(8, 12, 22) 0px 0px 0px 0px, rgb(52, 61, 76) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px`
- `shadow.3` = `rgb(255, 255, 255) 0px 0px 0px 0px, rgba(21, 107, 244, 0.4) 0px 0px 0px 3px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px`
- `shadow.4` = `rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1) 0px 8px 10px -6px`
- `motion.duration.instant` = `100ms`
- `motion.duration.fast` = `150ms`
- `motion.duration.normal` = `200ms`
- `motion.duration.slow` = `300ms`

---

## 3. Component-Level Rules & Anatomy

All components must strictly adhere to the following anatomy and state specifications.

### A. Inbox Items / Mail Cards
- **Anatomy:** Sender Name + Subject + Snippet + Date/Time indicator + Status dots (Unread/Read).
- **Default Style:** Background: `color.surface.strong` (`#080c16`), Border: `1px solid color.border.default`, Color: `color.text.primary`.
- **States:**
  - **Hover:** Border color: `color.surface.raised`, Background: `color.surface.muted`.
  - **Focus-Visible:** Outline matches blue active surface (`shadow.3`).
  - **Active:** Scale down transformation (`transform: scale(0.99)`).
  - **Disabled:** Opacity: `0.5`, Cursor: `not-allowed`.
  - **Selected:** Border: `1px solid color.surface.raised`, background: `color.surface.muted`.

### B. Compose / Mail Input Fields
- **Anatomy:** To/Subject Inputs + Text Area (Rich text body editor).
- **Default Style:** Background: `color.surface.muted` (`#151b28`), Border: `1px solid color.border.default`.
- **States:**
  - **Hover:** Border color: `color.text.primary`.
  - **Focus-Visible:** Outline ring matches blue active surface.

---

## 4. Accessibility Requirements (WCAG 2.2 AA)

- **Keyboard Navigation:** Users must be able to navigate thread lists using `Up` and `Down` arrow keys, and open mail by hitting `Enter`.
- **Focus-Visible:** Focus indicators must maintain a minimum contrast ratio of `3:1` against adjacent background colors.
- **Contrast Ratios:** Text on inputs must exceed a minimum contrast ratio of `4.5:1` for regular text.

### Pass/Fail Checks
- `[ ]` Tab through mailbox inputs (Pass: Focus indicator is visible on every step).
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
- `[ ]` Ensure form fields spacing scale matches `space.5` (8px) standard margins.
