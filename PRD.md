# AI-Powered Techpigeon Assistant

An intelligent marketing companion that transforms product descriptions into comprehensive marketing strategies complete with persuasive copy, visual direction, and audience insights.

**Experience Qualities**:
1. **Empowering** - Users feel like they have a professional marketing team at their fingertips, transforming simple ideas into polished strategies.
2. **Fluid** - The experience flows seamlessly from input to insight, with smooth transitions and clear visual hierarchy that guides attention naturally.
3. **Inspiring** - The generated content and presentation spark creativity and confidence, making users excited about their marketing possibilities.

**Complexity Level**: Light Application (multiple features with basic state)
This is a focused tool with a clear input-output flow, basic state management for the form and results, and straightforward user interactions without requiring multiple views or complex workflows.

## Essential Features

### AI Marketing Generation
- **Functionality**: Accepts a product/service description and generates three marketing components: persuasive copy, visual strategy, and target audience recommendation
- **Purpose**: Provides instant, professional marketing insights to help users effectively promote their offerings
- **Trigger**: User enters description in textarea and clicks "Generate Marketing Strategy" button
- **Progression**: User types description → Clicks generate button → Loading state displays → AI processes request → Results appear in three distinct sections with smooth animation → User can read/copy results → User can generate new strategy (form clears)
- **Success criteria**: All three components (copy, visual strategy, audience) are clearly generated, well-formatted, and immediately actionable

### Copy to Clipboard
- **Functionality**: Users can copy individual sections (marketing copy, visual strategy, or audience) to clipboard
- **Purpose**: Enables quick transfer of generated content to other tools and workflows
- **Trigger**: User clicks copy icon button next to any section header
- **Progression**: User clicks copy button → Button shows success state → Toast notification confirms → Content is in clipboard
- **Success criteria**: Content copies successfully and user receives clear feedback

### Result History (Persistent)
- **Functionality**: Stores the last generated result so users can return to it after closing the app
- **Purpose**: Prevents losing valuable AI-generated insights and allows users to reference previous work
- **Trigger**: Automatically saves when generation completes; loads on app mount
- **Progression**: Generation completes → Result auto-saves to KV store → User closes app → User returns → Previous result displays automatically
- **Success criteria**: Last result persists across sessions and displays immediately on return

## Edge Case Handling

- **Empty Input**: Disable generate button until user enters at least 10 characters; show subtle helper text
- **API Failures**: Display friendly error message with retry option; preserve user's input so they don't have to retype
- **Very Long Descriptions**: Accept up to 1000 characters; show character counter near limit (900+)
- **Loading Interruption**: Disable all interactions during generation; provide cancel option for very long waits
- **No Previous Results**: Show compelling empty state with example prompts to guide first-time users

## Design Direction

The design should evoke a sense of **creative professionalism** - the intersection of artistic inspiration and business acumen. It should feel like a premium creative agency tool: sophisticated yet approachable, modern yet timeless, energetic yet focused. The interface should inspire confidence while maintaining visual excitement through bold color choices and dynamic layouts.

## Color Selection

A vibrant, confident palette that balances creative energy with professional trust.

- **Primary Color**: Deep indigo `oklch(0.35 0.15 275)` - conveys intelligence, creativity, and trustworthiness; used for primary actions and key UI elements
- **Secondary Colors**: 
  - Soft lavender `oklch(0.92 0.04 285)` - for subtle backgrounds and secondary UI elements
  - Rich purple `oklch(0.45 0.18 290)` - for secondary actions and hover states
- **Accent Color**: Electric cyan `oklch(0.75 0.15 195)` - captures attention for CTAs, success states, and important highlights; adds energetic spark
- **Foreground/Background Pairings**:
  - Background (Soft cream `oklch(0.98 0.01 85)`): Dark charcoal `oklch(0.25 0.02 275)` - Ratio 12.8:1 ✓
  - Primary (Deep indigo): White `oklch(1 0 0)` - Ratio 8.5:1 ✓
  - Accent (Electric cyan): Dark charcoal `oklch(0.25 0.02 275)` - Ratio 5.2:1 ✓
  - Cards (White `oklch(1 0 0)`): Dark charcoal `oklch(0.25 0.02 275)` - Ratio 15.1:1 ✓

## Font Selection

Typography should feel contemporary and confident - a blend of geometric precision for headlines and humanist warmth for body text.

- **Primary Font**: Space Grotesk - Modern geometric sans with distinctive personality; perfect for the tech-forward, creative positioning
- **Typographic Hierarchy**:
  - H1 (App Title): Space Grotesk Bold / 32px / -0.02em letter spacing / Leading tight
  - H2 (Section Headers): Space Grotesk SemiBold / 20px / -0.01em letter spacing / Leading snug
  - Body (Input, Results): Space Grotesk Regular / 16px / 0em letter spacing / Leading relaxed (1.6)
  - Small (Helpers, Labels): Space Grotesk Medium / 14px / 0em letter spacing / Leading normal

## Animations

Animations should feel intentional and premium - smooth, confident, and never distracting. Use motion to guide attention and celebrate success: results fade in with a gentle upward slide (300ms ease-out), the generate button pulses subtly on hover, copy confirmation appears with a satisfying scale-pop (150ms spring), and section cards stagger their entrance (100ms delay between each) for a polished reveal. Loading states use a sophisticated gradient shimmer rather than spinners.

## Component Selection

- **Components**:
  - `Textarea` - Main input for product description with auto-resize behavior
  - `Button` - Primary CTA for generation, secondary for copy actions with Phosphor icons
  - `Card` - Contains each result section (copy, visual, audience) with subtle shadow and border
  - `Badge` - Labels for section types (e.g., "Marketing Copy", "Visual Strategy")
  - `Separator` - Divides sections within result cards
  - `ScrollArea` - Ensures long generated content is readable without breaking layout
  - Sonner toasts - Success feedback for copy actions

- **Customizations**:
  - Custom gradient background using mesh gradients (multiple radial gradients)
  - Custom result cards with animated entrance and hover lift effect
  - Custom shimmer loading state for AI generation
  - Custom empty state illustration using CSS shapes and gradients

- **States**:
  - Button: Idle (gradient primary) → Hover (gradient shift + lift) → Active (scale down) → Loading (shimmer animation) → Disabled (muted + reduced opacity)
  - Textarea: Idle (subtle border) → Focus (accent border + glow) → Filled (border strengthens)
  - Cards: Hidden → Fade-in with slide-up → Idle → Hover (gentle lift with shadow)

- **Icon Selection**:
  - `Sparkle` - Next to app title to reinforce AI magic
  - `Lightbulb` - For generate button, symbolizing ideas
  - `Copy` - For clipboard actions
  - `Target` - For target audience section
  - `Palette` - For visual strategy section  
  - `ChatsCircle` - For marketing copy section
  - `ArrowClockwise` - For retry/new generation

- **Spacing**:
  - Container max-width: 1000px with px-6 (mobile) / px-8 (desktop)
  - Section gaps: gap-8 (32px) for major sections
  - Card padding: p-6 (24px) for comfortable reading
  - Input-to-button: gap-4 (16px) for clear relationship
  - Result cards: gap-6 (24px) between each card

- **Mobile**:
  - Stack all cards vertically with full width
  - Reduce font sizes slightly (H1: 28px, H2: 18px)
  - Input and button become full-width
  - Reduce container padding to px-4
  - Maintain card padding at p-4 for breathing room
  - Results appear below fold, smooth scroll to them after generation
