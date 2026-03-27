# AI Marketing Assistant - Powered by NovusSparks AI

A versatile AI-powered marketing assistant with user authentication and profile management that transforms any topic, product, or service description into comprehensive marketing strategies complete with persuasive copy, visual direction, and audience insights.

**Experience Qualities**:
1. **Empowering** - Users feel like they have a professional marketing team at their fingertips, with their own personalized workspace and saved history.
2. **Fluid** - The experience flows seamlessly from login to insight, with smooth transitions and clear visual hierarchy that guides attention naturally.
3. **Versatile** - The assistant adapts to any topic or industry, with user-specific data storage making it a universal tool for marketing strategy generation.

**Complexity Level**: Light Application (multiple features with basic state)
This is a focused tool with clear input-output flow, user authentication, profile management, persistent state management for saved strategies, and straightforward user interactions including comparison and export capabilities.

## Essential Features

### User Registration & Login
- **Functionality**: Allows users to create accounts with email/password and log in to access their personalized workspace
- **Purpose**: Provides secure access control and enables user-specific data storage for strategies and preferences
- **Trigger**: User visits the platform without being logged in
- **Progression**: User sees login screen → Chooses to sign in or create account → Enters credentials (email, password, full name for signup) → System authenticates → User gains access to dashboard
- **Success criteria**: Users can successfully create accounts, log in, and their sessions persist across page refreshes

### User Profile Management
- **Functionality**: Users can view and edit their profile information including name, company, role, industry, and bio
- **Purpose**: Enables users to maintain up-to-date professional information and personalize their experience
- **Trigger**: User clicks on their avatar/profile menu in the header
- **Progression**: User clicks avatar → Dropdown menu appears → User selects "Edit Profile" → Profile dialog opens with editable fields → User updates information → Clicks save → Profile updates and dialog closes
- **Success criteria**: Profile changes persist and are reflected throughout the application

### User-Specific Data Storage
- **Functionality**: All saved strategies and user preferences are stored per-user, ensuring data privacy and organization
- **Purpose**: Keeps each user's work separate and organized, building a personal library of marketing strategies
- **Trigger**: Automatically activated when user logs in
- **Progression**: User logs in → System loads user-specific strategies and preferences → User creates/saves strategies → Data is associated with their account → User can access only their own data
- **Success criteria**: Users see only their own saved strategies, and data persists across sessions

### AI Marketing Generation (Universal)
- **Functionality**: Accepts any topic, product, or service description and generates comprehensive marketing strategies with eight components: persuasive copy, visual strategy, target audience recommendation, application workflow, UI workflow, database workflow, mobile workflow, and implementation checklist
- **Purpose**: Provides instant, professional marketing insights and technical implementation guidance for any subject matter across 30+ industry verticals
- **Trigger**: User enters description in textarea, selects concept mode, and clicks "Generate Strategy" button
- **Progression**: User types description → Selects industry vertical from concept mode dropdown → Clicks generate button → Loading state displays → AI processes request with industry-specific archetypes → Results appear in eight distinct sections with smooth animation → User can save with custom name or generate new strategy
- **Success criteria**: All eight components are clearly generated, well-formatted, and immediately actionable for any topic with industry-specific insights

### Industry-Specific Concept Modes
- **Functionality**: 30+ industry vertical modes that tailor AI strategy generation with domain-specific archetypes and best practices
- **Purpose**: Provides specialized, contextually-relevant strategies that align with industry standards and common workflows
- **Categories**:
  - **Technology & Digital**: SaaS, E-commerce, Telecom, Media
  - **Business Services**: Sales, Ops, Consulting, Legal
  - **Finance & Banking**: Fintech, Insurance
  - **Healthcare & Wellness**: Healthcare, Wellness
  - **Education & Training**: Education
  - **Retail & Commerce**: Retail, Fashion, Beauty
  - **Hospitality & Travel**: Hospitality, Travel, Food Service
  - **Real Estate & Construction**: Real Estate, Construction
  - **Industry & Manufacturing**: Manufacturing, Logistics, Energy, Agriculture
  - **Transportation & Automotive**: Automotive
  - **Entertainment & Sports**: Entertainment, Sports
  - **Non-Profit & Social**: Non-Profit Organizations
- **Trigger**: User selects from organized dropdown menu before generation
- **Progression**: User selects concept mode → Mode instructions load → AI generation uses mode-specific archetypes → Results reflect industry best practices
- **Success criteria**: Strategies include industry-appropriate terminology, workflows, and recommendations specific to the selected vertical

### Named Strategy Saving
- **Functionality**: Users can save generated strategies with custom names for easy identification
- **Purpose**: Enables users to organize and quickly identify different marketing strategies
- **Trigger**: User clicks "Save Strategy" button after generating results
- **Progression**: User clicks save → Dialog appears → User enters strategy name → Clicks save → Strategy saves with name and timestamp → Toast confirms success
- **Success criteria**: Strategy saves with user-provided name and is easily identifiable in the saved list

### PDF Export
- **Functionality**: Users can export any saved strategy as a formatted PDF document
- **Purpose**: Enables sharing, printing, and offline access to marketing strategies
- **Trigger**: User clicks "Export PDF" button on a saved strategy
- **Progression**: User clicks export → Print dialog opens with formatted content → User can save as PDF or print
- **Success criteria**: PDF includes strategy name, description, timestamp, all three sections, and NovusSparks branding

### Strategy Comparison
- **Functionality**: Users can select up to 3 saved strategies and view them side-by-side
- **Purpose**: Helps users compare different marketing approaches and choose the best strategy
- **Trigger**: User selects strategies using "Compare" button, then clicks "Compare Now"
- **Progression**: User selects strategies → Banner shows selection count → User clicks compare → Full-screen comparison view opens → All sections displayed side-by-side → User closes to return
- **Success criteria**: Strategies display side-by-side with clear section headers and strategy names

### Persistent Strategy Library
- **Functionality**: Stores all saved strategies with names, descriptions, results, and timestamps
- **Purpose**: Prevents losing valuable AI-generated insights and allows users to build a strategy library
- **Trigger**: Automatically persists when strategies are saved; loads on app mount
- **Progression**: User saves strategy → Strategy auto-saves to KV store → User closes app → User returns → All strategies display in saved tab
- **Success criteria**: All strategies persist across sessions with full data integrity

## Edge Case Handling

- **Empty Input**: Disable generate button until user enters at least 10 characters; show subtle helper text
- **API Failures**: Display friendly error message with retry option; preserve user's input so they don't have to retype
- **Very Long Descriptions**: Accept up to 1000 characters; show character counter near limit (900+)
- **No Saved Strategies**: Show compelling empty state with icon and helpful message
- **Strategy Name Required**: Disable save button in dialog until user enters a name
- **Maximum Comparison**: Limit comparison selection to 3 strategies; show error toast if user tries to select more

## Design Direction

The design should evoke **professional trust with modern sophistication** - inspired by NovusSparks' cyan-sage-gold branding. It should feel like a premium business tool: clean yet engaging, professional yet approachable, intelligent yet accessible. The interface should inspire confidence through its polished color palette and clear typography.

## Color Selection

A professional, trustworthy palette inspired by NovusSparks' branding (Electric Cyan #38bdf8, Neural Sage #6ee7a0, Spark Gold #e5a932).

- **Primary Color**: Professional blue `oklch(0.48 0.18 240)` - conveys trust, intelligence, and professionalism; used for primary actions and key UI elements
- **Secondary Colors**: 
  - Soft blue-gray `oklch(0.96 0.01 240)` - for subtle backgrounds and secondary UI elements
  - Vibrant blue `oklch(0.65 0.22 240)` - for accents and interactive states
- **Accent Color**: Bright blue `oklch(0.65 0.22 240)` - captures attention for CTAs, success states, and important highlights
- **Foreground/Background Pairings**:
  - Background (Near white `oklch(0.99 0.005 240)`): Dark blue-gray `oklch(0.18 0.02 240)` - Ratio 14.2:1 ✓
  - Primary (Professional blue): White `oklch(1 0 0)` - Ratio 7.5:1 ✓
  - Accent (Bright blue): White `oklch(1 0 0)` - Ratio 5.1:1 ✓
  - Cards (White `oklch(1 0 0)`): Dark blue-gray `oklch(0.18 0.02 240)` - Ratio 15.8:1 ✓

## Font Selection

Typography should feel modern and professional - clean sans-serif fonts that convey clarity and trustworthiness.

- **Primary Font**: Inter - Clean, highly readable sans-serif for body text and UI elements
- **Display Font**: Plus Jakarta Sans - Modern, bold sans-serif for headings and titles
- **Typographic Hierarchy**:
  - H1 (App Title): Plus Jakarta Sans Bold / 32px / -0.02em letter spacing / Leading tight
  - H2 (Section Headers): Plus Jakarta Sans SemiBold / 24px / -0.01em letter spacing / Leading snug
  - H3 (Card Titles): Plus Jakarta Sans SemiBold / 20px / -0.01em letter spacing / Leading snug
  - Body (Input, Results): Inter Regular / 16px / 0em letter spacing / Leading relaxed (1.6)
  - Small (Helpers, Labels): Inter Medium / 14px / 0em letter spacing / Leading normal

## Animations

Animations should feel professional and polished - smooth, confident, and purposeful. Use motion to guide attention: results fade in with gentle upward slide (300ms ease-out), buttons have subtle hover states, dialog animations scale smoothly (200ms), strategy cards stagger their entrance (50ms delay between each) for a polished reveal. Loading states use a sophisticated shimmer effect.

## Component Selection

- **Components**:
  - `Textarea` - Main input for topic/product description with auto-resize behavior
  - `Button` - Primary CTA for generation, secondary for actions with Phosphor icons
  - `Card` - Contains strategy cards and result sections with subtle shadow and border
  - `Dialog` - For naming strategies before saving
  - `Input` - For strategy name entry in save dialog
  - `Badge` - Labels for dates and selection status
  - `Tabs` - Switches between Generate and Saved views
  - Sonner toasts - Success/error feedback for actions

- **Customizations**:
  - Custom gradient background using radial gradients in blue tones
  - Custom result cards with animated entrance and hover effects
  - Custom shimmer loading state for AI generation
  - Custom empty states with icons and helpful messaging
  - Custom PDF export with branded formatting
  - Custom comparison view with side-by-side layout

- **States**:
  - Button: Idle (blue gradient) → Hover (gradient shift + lift) → Active (scale down) → Loading (disabled) → Disabled (muted + reduced opacity)
  - Textarea: Idle (subtle border) → Focus (blue border + glow) → Filled (border strengthens)
  - Cards: Hidden → Fade-in with slide-up → Idle → Hover (gentle lift with shadow)
  - Dialog: Hidden → Scale + fade in → Visible → Scale + fade out

- **Icon Selection**:
  - `Sparkle` - Next to app title to reinforce AI capabilities
  - `Lightbulb` - For generate button, symbolizing ideas
  - `FloppyDisk` - For save actions
  - `FolderOpen` - For saved strategies tab
  - `FilePdf` - For PDF export
  - `Target` - For target audience section
  - `Palette` - For visual strategy section  
  - `ChatsCircle` - For marketing copy section
  - `ArrowClockwise` - For new generation
  - `Eye` - For view action
  - `Scales` - For comparison
  - `Trash` - For delete action

- **Spacing**:
  - Container max-width: 1152px (6xl) with px-6 (mobile) / px-8 (desktop)
  - Section gaps: gap-8 (32px) for major sections
  - Card padding: p-6 (24px) for comfortable reading
  - Input-to-button: gap-4 (16px) for clear relationship
  - Strategy cards: gap-4 (16px) between cards

- **Mobile**:
  - Stack all elements vertically with full width
  - Reduce font sizes slightly (H1: 28px, H2: 20px)
  - Input and button become full-width on mobile
  - Reduce container padding to px-4
  - Strategy cards maintain single column layout
  - Comparison view adapts to single column on mobile
  - PDF export works via system print dialog

## Review Section - Fast Track Feature Conversion

### Product Goal
- Enable thesis/article upload and produce a complete integrity report with:
- Structured summary (abstract + section summaries)
- Plagiarism similarity score with matched sources
- AI-writing detection score with explainable evidence
- Actionable recommendations for revision and citation quality

### Scope for Fast Delivery (Days, not Weeks)

#### Day 1
- File ingestion pipeline for `pdf`, `docx`, `txt`
- Text extraction and section splitting (abstract, intro, method, results, discussion, conclusion, references)
- Basic summary output (overall + section-level)

#### Day 2
- Plagiarism engine v1 with exact overlap matching
- Sentence and n-gram fingerprinting (`5-8` word shingles)
- Source checks against free/open resources
- Highlighted matched spans in document view

#### Day 3
- AI detection engine v1 (ensemble)
- Stylometric features (burstiness, sentence length variance, punctuation rhythm)
- Perplexity-based signal (model-likelihood anomaly)
- Section-level risk scoring and confidence band

#### Day 4
- Turnitin-like controls:
- Exclude bibliography
- Exclude quoted text
- Ignore short matches below threshold
- Count each matched word once across sources
- Final scoring panel and downloadable report

#### Day 5 (optional hardening day)
- Calibration against known samples
- Threshold tuning to reduce false positives
- UI polish and edge-case fixes

### Turnitin-Style Matching Logic (Closest Practical Approximation)
- Exact Turnitin parity is not possible due to proprietary corpus and scoring internals.
- Implement the closest transparent equivalent:
- Similarity index based on merged overlap spans
- Source-level contribution percentages
- Exclusion toggles (quotes/references/small matches)
- One-pass de-duplication so repeated evidence does not inflate score

### Deep Algorithm Design

#### Plagiarism Detection
- Preprocessing: normalize, tokenize, sentence segment, citation parse
- Candidate retrieval: MinHash + Locality Sensitive Hashing for speed
- Exact matching: n-gram overlap and longest common subsequence windows
- Paraphrase matching: embedding similarity with thresholded semantic nearest neighbors
- Evidence aggregation: merge adjacent spans and compute net unique overlap

#### AI Detection
- Stylometry classifier over lexical/syntactic features
- Perplexity + rank consistency analysis
- Section-level anomaly detector for abrupt style shifts
- Weighted ensemble output with confidence calibration

### Recommended Free/Open Resources
- Crossref API for scholarly metadata and references
- OpenAlex API for paper graph and source enrichment
- Semantic Scholar API for related publications
- arXiv metadata/full text where available
- Open web search APIs with free tier (for additional source discovery)

### Scoring Model
- Similarity Score (0-100): exact + semantic overlap after exclusions
- AI Risk Score (0-100): calibrated ensemble confidence
- Citation Quality Score (0-100): reference consistency and in-text citation checks
- Integrity Score (0-100): composite score exposed with transparent formula and reason codes

### Delivery Artifacts
- Review dashboard with section navigator and highlighted evidence
- Source panel showing matched references and overlap percent
- Exportable report with executive summary, detailed findings, and recommendations
- Admin-adjustable thresholds for institutions with stricter policies

### Non-Goals for Fast Track
- Full closed-corpus parity with commercial plagiarism databases
- Language coverage beyond primary supported language on first release
- Human adjudication workflow in v1
