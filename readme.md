# Bookmarker

A beautiful, AI-powered bookmarking application inspired by MyMind. Save, organize, and discover your digital content with intelligent tagging and search capabilities.

## 🚀 Project Overview

Bookmarker is a modern web application that transforms how you save and organize digital content. Starting as a web app with plans to expand to native iOS, macOS, and Android applications.

### Core Vision

- **Beautiful UI**: Clean, intuitive interface focused on visual discovery
- **AI-Powered**: Automatic tagging and content understanding
- **Universal**: Support for websites, PDFs, videos, and social media content
- **Fast Search**: Intelligent content indexing and retrieval

## 🏗️ Architecture

### Tech Stack

- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Storage**: AWS S3 for images, PDFs, and media files
- **API Layer**: SvelteKit server-side functions
- **Frontend**: SvelteKit client with TypeScript
- **Styling**: TailwindCSS + shadcn/ui components
- **AI/ML**: OpenAI API for content analysis and tagging

### System Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   SvelteKit     │    │    Supabase      │    │      AWS S3     │
│   Frontend      │◄──►│   PostgreSQL     │    │   File Storage  │
│                 │    │   Auth           │    │                 │
│   - UI/UX       │    │   Real-time      │    │   - Images      │
│   - State Mgmt  │    │   Edge Functions │    │   - PDFs        │
│   - API calls   │    │                  │    │   - Videos      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                       │
         │                        └───────────────────────┘
         │
         ▼
┌─────────────────┐    ┌──────────────────┐
│   External      │    │    Browser       │
│   Services      │    │   Extensions     │
│                 │    │                  │
│   - OpenAI API  │    │   - Chrome       │
│   - Social APIs │    │   - Safari       │
│   - Web Scraper │    │   (Future)       │
└─────────────────┘    └──────────────────┘
```

### Database Schema

```sql
-- Users table (handled by Supabase Auth)
-- Additional user preferences
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  display_name TEXT,
  avatar_url TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Main bookmarks table
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Content
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  domain TEXT GENERATED ALWAYS AS (
    regexp_replace(url, '^https?://(www\.)?([^/]+).*', '\2')
  ) STORED,

  -- Media
  thumbnail_url TEXT,
  content_type VARCHAR(50) NOT NULL, -- 'website', 'pinterest', 'pdf', 'video'
  file_path TEXT, -- S3 path for stored files

  -- AI-generated content
  ai_summary TEXT,
  ai_tags TEXT[],
  ai_embedding VECTOR(1536), -- For semantic search

  -- Metadata
  is_public BOOLEAN DEFAULT FALSE,
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Indexes
  CONSTRAINT valid_url CHECK (url ~ '^https?://.*')
);

-- Manual tags (user-created)
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#6B7280',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id, name)
);

-- Many-to-many relationship for bookmark tags
CREATE TABLE bookmark_tags (
  bookmark_id UUID NOT NULL REFERENCES bookmarks(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (bookmark_id, tag_id)
);

-- Collections/folders
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id, name)
);

-- Bookmark collections relationship
CREATE TABLE bookmark_collections (
  bookmark_id UUID NOT NULL REFERENCES bookmarks(id) ON DELETE CASCADE,
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  PRIMARY KEY (bookmark_id, collection_id)
);

-- Indexes for performance
CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX idx_bookmarks_created_at ON bookmarks(created_at DESC);
CREATE INDEX idx_bookmarks_domain ON bookmarks(domain);
CREATE INDEX idx_bookmarks_content_type ON bookmarks(content_type);
CREATE INDEX idx_bookmarks_ai_tags ON bookmarks USING GIN(ai_tags);
CREATE INDEX idx_bookmarks_text_search ON bookmarks USING GIN(
  to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || COALESCE(ai_summary, ''))
);
```

## 🎯 MVP Feature Scope

### Core Features (MVP)

- [x] **User Authentication**: Login/logout with Supabase Auth
- [x] **Bookmark Feed**: Paginated feed (logged out) / infinite scroll (logged in)
- [x] **Single Bookmark View**: Detailed view for individual bookmarks
- [x] **Pinterest Integration**: Add Pinterest URLs with auto-image extraction
- [x] **Basic Search**: Text-based search through bookmarks

### Post-MVP Features

- [ ] **Additional Content Types**: Websites, PDFs, YouTube videos
- [ ] **AI Tagging**: Automatic content analysis and tagging
- [ ] **Advanced Search**: Semantic search with AI embeddings
- [ ] **Collections**: Organize bookmarks into folders
- [ ] **Social Features**: Public bookmarks, sharing, collaboration
- [ ] **Browser Extensions**: Chrome and Safari extensions
- [ ] **Mobile Apps**: Native iOS, macOS, and Android applications

## 🛠️ Development Plan

### Phase 1: Project Setup (Week 1)

**Goal**: Establish development environment and core infrastructure

#### Day 1-2: Environment Setup

- [ ] Initialize SvelteKit project with TypeScript
- [ ] Set up Supabase project and local development
- [ ] Configure AWS S3 bucket for file storage
- [ ] Set up environment variables and configuration
- [ ] Initialize Git repository and basic CI/CD

#### Day 3-4: Database & Auth

- [ ] Create database schema in Supabase
- [ ] Set up Row Level Security (RLS) policies
- [ ] Implement authentication pages (login/signup)
- [ ] Create user profile management
- [ ] Test authentication flow

#### Day 5-7: Basic UI Framework

- [ ] Set up TailwindCSS and design system
- [ ] Create layout components (header, sidebar, main)
- [ ] Implement routing structure
- [ ] Create basic bookmark card component
- [ ] Set up responsive design patterns

### Phase 2: Core Bookmark Features (Week 2)

**Goal**: Implement basic bookmark CRUD operations

#### Day 1-3: Bookmark Management

- [ ] Create bookmark creation API endpoint
- [ ] Implement bookmark listing with pagination
- [ ] Build bookmark detail view
- [ ] Add bookmark editing capabilities
- [ ] Implement bookmark deletion

#### Day 4-5: Feed Implementation

- [ ] Build paginated feed for anonymous users
- [ ] Implement infinite scroll for authenticated users
- [ ] Add loading states and error handling
- [ ] Optimize database queries for performance
- [ ] Add real-time updates with Supabase subscriptions

#### Day 6-7: Basic Search

- [ ] Implement text-based search functionality
- [ ] Add search UI components
- [ ] Create search result highlighting
- [ ] Add search filters (date, type, etc.)
- [ ] Optimize search performance

### Phase 3: Pinterest Integration (Week 3)

**Goal**: Implement Pinterest URL processing and image extraction

#### Day 1-2: Pinterest API Research

- [ ] Research Pinterest URL patterns and API limitations
- [ ] Set up web scraping capabilities
- [ ] Test Pinterest content extraction methods
- [ ] Handle different Pinterest URL formats

#### Day 3-4: Image Processing

- [ ] Implement image download and upload to S3
- [ ] Add image optimization and resizing
- [ ] Create thumbnail generation
- [ ] Handle image errors and fallbacks
- [ ] Add progress indicators for image processing

#### Day 5-6: Pinterest Bookmark Flow

- [ ] Create Pinterest-specific bookmark creation
- [ ] Add URL validation for Pinterest links
- [ ] Implement metadata extraction (title, description)
- [ ] Test Pinterest bookmark display
- [ ] Add error handling for failed extractions

#### Day 7: Polish & Testing

- [ ] Add loading states for Pinterest processing
- [ ] Implement retry mechanisms for failed extractions
- [ ] Add user feedback for processing status
- [ ] Test edge cases and error scenarios
- [ ] Performance optimization

### Phase 4: UI/UX Polish (Week 4)

**Goal**: Create a beautiful, intuitive user interface

#### Day 1-2: Design System

- [ ] Create comprehensive component library
- [ ] Implement consistent spacing and typography
- [ ] Add dark/light mode support
- [ ] Create loading and empty states
- [ ] Design mobile-responsive layouts

#### Day 3-4: User Experience

- [ ] Add smooth animations and transitions
- [ ] Implement keyboard navigation
- [ ] Add accessibility features (ARIA labels, etc.)
- [ ] Create intuitive bookmark management
- [ ] Add drag-and-drop functionality

#### Day 5-6: Performance & Optimization

- [ ] Implement image lazy loading
- [ ] Optimize bundle size and loading times
- [ ] Add service worker for offline functionality
- [ ] Implement caching strategies
- [ ] Performance testing and optimization

#### Day 7: Final Testing

- [ ] Comprehensive user testing
- [ ] Cross-browser compatibility testing
- [ ] Mobile responsiveness testing
- [ ] Performance benchmarking
- [ ] Bug fixes and polish

## 🚧 Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm
- Supabase account
- AWS account for S3
- OpenAI API key (for future AI features)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/bookmarker.git
cd bookmarker

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Set up Supabase
npx supabase start
npx supabase db reset

# Start development server
npm run dev
```

### Environment Variables

```env
# Supabase
PUBLIC_SUPABASE_URL=your_supabase_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name

# OpenAI (for future AI features)
OPENAI_API_KEY=your_openai_api_key

# Application
PUBLIC_APP_URL=http://localhost:5173
```

## 📁 Project Structure

```
bookmarker/
├── src/
│   ├── lib/
│   │   ├── components/          # Reusable UI components
│   │   ├── stores/              # Svelte stores for state management
│   │   ├── utils/               # Utility functions
│   │   ├── types/               # TypeScript type definitions
│   │   └── supabase.ts          # Supabase client setup
│   ├── routes/
│   │   ├── (auth)/              # Authentication routes
│   │   ├── (dashboard)/         # Protected dashboard routes
│   │   ├── api/                 # API endpoints
│   │   └── +layout.svelte       # Root layout
│   ├── app.html                 # HTML template
│   └── app.css                  # Global styles
├── static/                      # Static assets
├── supabase/
│   ├── migrations/              # Database migrations
│   └── config.toml              # Supabase configuration
├── tests/                       # Test files
└── docs/                        # Documentation
```

## 🔒 Security Considerations

- **Authentication**: Supabase Auth with secure JWT tokens
- **Authorization**: Row Level Security (RLS) for data protection
- **Input Validation**: Server-side validation for all inputs
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS**: Proper CORS configuration for API endpoints
- **Secrets Management**: Environment variables for sensitive data

## 📈 Performance Goals

- **Page Load**: < 2s for initial page load
- **Time to Interactive**: < 3s for interactive elements
- **Image Loading**: Lazy loading with smooth transitions
- **Search Response**: < 500ms for search results
- **Mobile Performance**: 90+ Lighthouse score on mobile

## 🧪 Testing Strategy

- **Unit Tests**: Jest for utility functions and components
- **Integration Tests**: Playwright for full user flows
- **API Testing**: Automated testing for all API endpoints
- **Performance Testing**: Regular Lighthouse audits
- **Accessibility Testing**: Automated a11y testing

## 🚀 Deployment

### Staging Environment

- **Platform**: Vercel or Netlify
- **Database**: Supabase staging instance
- **Storage**: AWS S3 staging bucket
- **Domain**: staging.bookmarker.app

### Production Environment

- **Platform**: Vercel Pro or dedicated server
- **Database**: Supabase production instance
- **Storage**: AWS S3 production bucket
- **CDN**: CloudFront for global distribution
- **Monitoring**: Sentry for error tracking

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🎯 Next Steps After MVP

1. **User Feedback**: Gather feedback from beta users
2. **AI Integration**: Implement automatic tagging and content analysis
3. **Browser Extensions**: Chrome and Safari extensions for easy bookmarking
4. **Mobile Apps**: Native iOS and Android applications
5. **Social Features**: Public bookmarks and collaboration
6. **Advanced Search**: Semantic search with AI embeddings
7. **Content Types**: Support for PDFs, videos, and more platforms

**Target Launch**: End of Month 1 for MVP, Month 3 for full v1.0
