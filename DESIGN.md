---
name: Warm Logic
colors:
  surface: '#fff8f6'
  surface-dim: '#e7d7d1'
  surface-bright: '#fff8f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff1ec'
  surface-container: '#fceae4'
  surface-container-high: '#f6e5df'
  surface-container-highest: '#f0dfd9'
  on-surface: '#221a16'
  on-surface-variant: '#55433c'
  inverse-surface: '#382e2b'
  inverse-on-surface: '#ffede7'
  outline: '#88726b'
  outline-variant: '#dbc1b8'
  surface-tint: '#974723'
  primary: '#944521'
  on-primary: '#ffffff'
  primary-container: '#b35c37'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb598'
  secondary: '#52634d'
  on-secondary: '#ffffff'
  secondary-container: '#d2e5ca'
  on-secondary-container: '#566751'
  tertiary: '#5c5c5c'
  on-tertiary: '#ffffff'
  tertiary-container: '#757474'
  on-tertiary-container: '#fefcfb'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbce'
  primary-fixed-dim: '#ffb598'
  on-primary-fixed: '#370e00'
  on-primary-fixed-variant: '#79300e'
  secondary-fixed: '#d5e8cc'
  secondary-fixed-dim: '#b9ccb1'
  on-secondary-fixed: '#101f0e'
  on-secondary-fixed-variant: '#3b4b37'
  tertiary-fixed: '#e4e2e1'
  tertiary-fixed-dim: '#c8c6c6'
  on-tertiary-fixed: '#1b1c1c'
  on-tertiary-fixed-variant: '#474747'
  background: '#fff8f6'
  on-background: '#221a16'
  surface-variant: '#f0dfd9'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  code-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  container-max: 1024px
  gutter: 24px
---

## Brand & Style
The design system focuses on creating a calm, supportive environment for technical mastery. By pivoting away from the typical "hacker" aesthetic of dark mode and high-contrast neon, it adopts a **Minimalist-Tactile** style. The goal is to make complex data structures feel approachable and less intimidating.

**Personality:**
- **Encouraging:** Uses soft tones and ample whitespace to reduce cognitive load.
- **Organized:** Emphasizes structural clarity and logical grouping.
- **Non-Intimidating:** Replaces harsh edges with soft curves and organic color palettes.

The UI should feel like a premium physical notebook—clean, intentional, and quiet, allowing the user's focus to remain entirely on the logic of the algorithms.

## Colors
The palette is grounded in warm, earthy tones to foster a sense of growth and steady progress.

- **Primary (Deep Terracotta):** Used for main action buttons and active states. It provides warmth without the urgency of a bright red.
- **Secondary (Earthy Sage):** Reserved for progress indicators, success states, and completion markers.
- **Neutral (Charcoal & Cream):** The background uses a soft off-white (`#FDFBF7`) to prevent eye strain. Text is rendered in a soft charcoal (`#434343`) rather than pure black to maintain the warm aesthetic.
- **Surface:** A slightly darker cream (`#F7F2EB`) is used for cards and grouped content to create subtle containment.

## Typography
This design system utilizes **Inter** for all roles to maintain a systematic and professional feel while benefiting from its exceptional legibility. 

- **Headlines:** Use a slightly tighter letter-spacing to appear more cohesive.
- **Labels:** Use uppercase with increased tracking for clear categorization of problem difficulty (e.g., EASY, MEDIUM, HARD).
- **Readability:** High line-heights in body text ensure that technical explanations are easy to digest.
- **Hierarchy:** Weight is used more than size to distinguish between different levels of information.

## Layout & Spacing
The layout follows a **Fixed Grid** approach for desktop to keep content centered and focused, reflecting the nature of deep work.

- **Grid:** A 12-column grid with a maximum container width of 1024px.
- **Mobile:** Transition to a single-column fluid layout with 20px side margins.
- **Rhythm:** An 8px base unit drives all spacing. 
- **Whitespace:** Emphasize large vertical gaps (`48px` to `80px`) between major sections (e.g., between the progress dashboard and the problem list) to provide visual breathing room.

## Elevation & Depth
Depth is achieved through **Tonal Layers** and extremely soft, ambient shadows. 

- **Surface Tiers:** The base background is the lightest. Cards and interactive containers sit on a slightly darker "Surface" tone to create distinction without needing heavy borders.
- **Shadows:** Use a single, very soft shadow for "floating" elements like modals or active cards: `0px 4px 20px rgba(67, 67, 67, 0.05)`. 
- **Focus:** Interactive elements use a 2px solid border in the primary color only when focused or active, maintaining a flat but tactile appearance.

## Shapes
The shape language is consistently **Rounded**, avoiding sharp technical edges to maintain the "non-intimidating" brand promise.

- **Components:** Buttons and input fields use a `0.5rem` radius.
- **Containers:** Large cards and section wrappers use `1rem` or `1.5rem` to feel friendly and modern.
- **Data Points:** Progress bars and tags utilize pill-shapes (`rounded-full`) to denote fluidity and movement.

## Components
- **Buttons:** Primary buttons are solid Terracotta with white text. Secondary buttons use the Sage color with 10% opacity for the background and 100% for the text.
- **Progress Bars:** Use a thick, 12px pill-shaped track. The background is a very light version of the Sage color, with the progress indicator in solid Sage.
- **Cards:** Cards should have no border, using a subtle `surface_hex` background fill and a soft shadow on hover.
- **Difficulty Chips:** 
    - *Easy:* Sage background, dark text.
    - *Medium:* Soft Amber background, dark text.
    - *Hard:* Terracotta background (low opacity), Terracotta text.
- **Input Fields:** Use the `surface_hex` for the fill, with a subtle bottom border that thickens when focused.
- **Lists:** Algorithm lists should have generous vertical padding (16px-24px) between items, separated by light 1px dividers in a warm-grey tint.