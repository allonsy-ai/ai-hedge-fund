---
name: Olutayo Solana
description: Personal site for a fintech and data Product Manager, built as a transit network map with a 3D fare card.
colors:
  enamel: "#f3f4f1"
  enamel-deep: "#e9ebe7"
  signal-ink: "#121518"
  ink-secondary: "#454b52"
  ink-muted: "#8a9097"
  rule: "#d3d7d2"
  signage-panel: "#15191d"
  signage-panel-raised: "#20262c"
  panel-ink: "#f3f4f1"
  panel-ink-secondary: "#b7bdc3"
  line-payments: "#00875a"
  line-data: "#1f5fd1"
  line-build: "#e0590f"
  line-payments-text: "#007a51"
  line-data-text: "#1b56bd"
  line-build-text: "#b4450a"
  go: "#00875a"
typography:
  display:
    fontFamily: "Overpass, system-ui, sans-serif"
    fontSize: "clamp(3rem, 7.2vw, 6rem)"
    fontWeight: 850
    lineHeight: 0.95
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Overpass, system-ui, sans-serif"
    fontSize: "clamp(2rem, 4.2vw, 3.25rem)"
    fontWeight: 800
    lineHeight: 1.08
    letterSpacing: "-0.03em"
  figure:
    fontFamily: "Overpass, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 5vw, 3.5rem)"
    fontWeight: 850
    lineHeight: 1
    letterSpacing: "-0.04em"
    fontFeature: "tnum"
  title:
    fontFamily: "Overpass, system-ui, sans-serif"
    fontSize: "clamp(1.35rem, 2.4vw, 1.75rem)"
    fontWeight: 800
    lineHeight: 1.08
  body:
    fontFamily: "Overpass, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.55
    fontFeature: "tnum"
  label:
    fontFamily: "Overpass, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1.35
rounded:
  panel: "4px"
  pill: "999px"
spacing:
  gutter: "clamp(16px, 4vw, 40px)"
  section: "clamp(72px, 10vw, 128px)"
  line-weight: "6px"
  container: "1240px"
components:
  button-primary:
    backgroundColor: "{colors.signal-ink}"
    textColor: "{colors.enamel}"
    rounded: "{rounded.panel}"
    padding: "14px 20px 12px"
  button-primary-hover:
    backgroundColor: "{colors.go}"
    textColor: "#ffffff"
  button-ghost:
    textColor: "{colors.signal-ink}"
    rounded: "{rounded.panel}"
    padding: "14px 20px 12px"
  route-badge:
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    height: "28px"
    padding: "3px 12px 0"
  signage-bar:
    backgroundColor: "{colors.signage-panel}"
    textColor: "{colors.panel-ink}"
    height: "64px"
  terminus-panel:
    backgroundColor: "{colors.signage-panel}"
    textColor: "{colors.panel-ink}"
    rounded: "{rounded.panel}"
---

# Design System: Olutayo Solana

## Overview

**Creative North Star: "The Route Map"**

A career read as a transit network. Pages are wayfinding signage: an enamel ground, near-black signage panels, and three coloured lines that stand for fixed strengths. Content sits on the lines as stations, so experience becomes a route and projects become branch lines. The hero pairs that map with a 3D fare card, the payment product everyone has tapped, rendered in Three.js.

The density is recruiter-scannable: large display type, few words per block, real numbers set big in the line colour. Confidence comes from structure and scale, not ornament.

**Key Characteristics:**
- Three line colours with permanent meanings, never decorative.
- Near-black signage panels for navigation, contact and the lead project.
- Round-capped 6px lines with white station dots.
- Tabular numerals everywhere, since figures are the proof.

## Colors

A cool enamel neutral field with three saturated transit-line colours, each owning one meaning.

### Primary
- **Payments Line Green** (#00875a): the Payments line, Interswitch stop, hover state of primary actions (`go`), selection colour. Use #007a51 for text-sized figures.

### Secondary
- **Data Line Blue** (#1f5fd1): the Data & AI line, the MSc stop, the Satya branch, focus rings. Use #1b56bd for text.

### Tertiary
- **Build Line Orange** (#e0590f): the Build line, Omnibiz stop, recommendation engine branch. Never used for body text; use #b4450a when a figure must be orange.

### Neutral
- **Enamel** (#f3f4f1): page ground. Cool and slightly green, never cream.
- **Enamel Deep** (#e9ebe7): the journey section's tonal band.
- **Signal Ink** (#121518): text and primary buttons.
- **Ink Secondary** (#454b52) and **Ink Muted** (#8a9097): supporting copy and quiet hints; muted is for non-essential hints only.
- **Signage Panel** (#15191d) and **Raised** (#20262c): header bar, terminus panel, contact tiles, lead branch.
- **Rule** (#d3d7d2): the only hairline, used between sections and in the toolkit.

Dark mode (system preference or `data-theme="dark"`) swaps the ground to #101316 and lifts the three lines to #1fa874, #4b83ea and #f0712b, with hover actions on #0b7a53.

### Named Rules
**The Line Meaning Rule.** Green is Payments, blue is Data & AI, orange is Build, everywhere. A new element may use a line colour only if it belongs to that line.

**The Neutral Ground Rule.** The ground stays enamel; colour arrives as lines, dots, badges and figures, not as tinted section fills.

## Typography

**Display Font:** Overpass (self-hosted variable, with system-ui fallback)
**Body Font:** Overpass

**Character:** A highway-signage grotesque. One family carries the whole page, from 6rem display to 13px legend labels, so the page reads like a single signage system.

### Hierarchy
- **Display** (850, clamp(3rem, 7.2vw, 6rem), 0.95): the name in the hero only.
- **Headline** (800, clamp(2rem, 4.2vw, 3.25rem), 1.08): section headings; the terminus heading scales up to 5.25rem.
- **Figure** (850, clamp(2.5rem, 5vw, 3.5rem), 1): CV metrics in the stop's line colour.
- **Title** (800, clamp(1.35rem, 2.4vw, 1.75rem)): station headings; major stops go to 2.5rem.
- **Body** (400, 17px, 1.55): prose held to 52 to 66ch.
- **Label** (600 to 700, 13 to 15px): station names, dates, legend, badges. Sentence case, no tracking.

### Named Rules
**The No Kicker Rule.** No small label sits above a heading. Route badges follow the company line or the paragraph they tag.

## Layout

A 1240px container with fluid gutters (16 to 40px). Sections breathe at 72 to 128px vertical padding. The hero is a 5/7 split at desktop. The strengths map is a 250px head column plus a horizontal track; the journey is a 180px date column, a 56px rail and content. Projects use a 7/5 asymmetric pair and About a 5/7 portrait split. Below 768px everything is a single column: tracks and rails turn vertical at the left edge, the nav collapses to the name plus the Get in touch button.

## Elevation & Depth

Flat. Depth comes from tonal layering (enamel, enamel deep, signage panel, raised panel) and from the real 3D hero scene. The only shadow is the soft contact shadow rendered under the card in WebGL.

## Shapes

Panels, buttons and tiles use a 4px radius. Route badges are full pills. Lines are 6px with round caps; stations are 20px circles with a 5px coloured ring and an enamel centre; major stops are 28px. The interchange station is a black-ringed dot. The end of the route is a dashed ring.

## Components

- **Signage bar:** 64px sticky near-black bar with the three-bar mark, section links and a light Get in touch button.
- **Buttons:** primary is ink with enamel text, turning Payments green on hover with an arrow nudge; ghost is a 2px ink outline that fills on hover. All buttons press down 1px on active.
- **Route badge:** pill in the line colour with white text.
- **Line track:** a coloured line with evenly spaced stations; it draws in from the left when it enters the viewport.
- **Route stop:** date, rail and body. The rail draws downward on entry. Major stops carry figures and short bullet dashes in the line colour.
- **Branch panel:** a project tile with its line dropping in from the top edge to a station at the corner.
- **Terminus:** a near-black contact panel topped by the three-colour band, with three contact tiles each capped by a line colour and an email copy button with Copied feedback.
- **Fare card (3D):** Three.js card with a clearcoat finish, the route lines printed on the face, and a portrait printed ID-style once `assets/portrait.jpg` exists. It tilts to the pointer, flips on click to show contact details, and pauses when off screen or under reduced motion.

## Do's and Don'ts

- Do tie every figure to the CV; the numbers are the proof.
- Do keep line colours semantic and the ground neutral.
- Do end lines at a station, never at a hard cut edge.
- Don't add kickers, eyebrows or section numbers above headings.
- Don't introduce a fourth accent colour or a second typeface.
- Don't use em dashes in copy; use hyphens for ranges.
