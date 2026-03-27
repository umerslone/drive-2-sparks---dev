# NovusSparks AI — Enterprise AI Platform

Welcome to **NovusSparks AI** — your intelligent marketing strategy and business insights platform built with cutting-edge AI technology.

## About NovusSparks

**NovusSparks AI** is an enterprise AI platform for AI-powered strategy generation, document review, and business insights. This assistant helps you create powerful marketing strategies and business solutions.

**Visit us:** [novussparks.com](https://novussparks.com)

## What This App Does

- **Generate Marketing Strategies** - AI-powered marketing copy, visual strategies, and target audience analysis
- **Save & Compare** - Store your strategies and compare up to 3 versions side-by-side
- **Visual Strategy Recommendations** - Get detailed guidance on colors, imagery, and design aesthetics
- **Audience Analysis** - Understand your target demographic with demographic and psychographic insights

## Quick Start

```bash
# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
# Edit .env.local and add your API keys

# Start development server
npm run dev

# Build for production
npm run build
```

### Environment Configuration

The application requires environment variables for full functionality. See [ENV_CONFIG.md](ENV_CONFIG.md) for detailed setup instructions.

**Required for core features:**
- `VITE_NEON_DATABASE_URL` - PostgreSQL database connection
- `VITE_GEMINI_API_KEY` - Google Gemini API key

**Optional enhancements:**
- `VITE_GITHUB_COPILOT_TOKEN` - GitHub Copilot integration
- Feature flags for enabling/disabling modules
- Rate limit configuration

Run with debug mode to see configuration status:
```bash
VITE_SPARK_DEBUG=true npm run dev
```

## Features

- Built with React + TypeScript
- AI-powered strategy generation
- Responsive design with Tailwind CSS
- Local storage for saved strategies
- Side-by-side comparison view
- NovusSparks brand colors & typography

## Branding

This app ships with named NovusSparks presets and a menu-based selector in the user profile.

Default theme: **novussparks_brand**
- **Electric Cyan:** #38bdf8
- **Spark Gold:** #e5a932
- **Deep Navy:** #1c1414
- **Neural Sage:** #6ee7a0

Secondary theme: **novussparks_classic**
- **Primary Navy:** #0b1d3a
- **Secondary Cyan:** #38bdf8
- **Accent Gold:** #e5a932
- **Typography:** Aleo (headings), Inter (body)

## License

MIT License - Copyright GitHub, Inc.

## Fast-Track Review Roadmap

This project is moving with a compressed timeline (days, not weeks).

### Phase A (Core in Days)
- Day 1: Thesis/article file ingestion + section parsing + structured summary
- Day 2: Plagiarism detection v1 (exact overlap + source matches)
- Day 3: AI detection v1 (stylometry + perplexity signals)
- Day 4: Turnitin-style controls (exclude references/quotes/short matches) + final scoring panel

### Phase B (Hardening)
- Threshold calibration against benchmark documents
- False-positive reduction for properly cited text
- Report export improvements and evidence explainability

## Development Log

Track implementation progress in [CHANGELOG.md](CHANGELOG.md).

---

**Powered by NovusSparks AI** | Enterprise AI Platform
