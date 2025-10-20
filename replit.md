# VetConnect - Veteran Resource Navigator

## Overview

VetConnect is a web application designed to help veterans find and access essential services including healthcare, housing, employment, mental health support, and crisis assistance. The application streamlines the process of navigating veteran benefits through a questionnaire-based intake system that matches veterans with relevant local and national resources.

The platform serves as a centralized resource navigator, addressing the common challenge veterans face when trying to find information spread across different websites and agencies. It features a simple, accessible interface with one-tap crisis support and location-based resource matching.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React with TypeScript for the UI layer
- Vite as the build tool and development server
- Wouter for client-side routing (lightweight alternative to React Router)
- TanStack Query (React Query) for server state management
- Tailwind CSS for styling with shadcn/ui component library

**Design System:**
- Accessibility-first hybrid approach combining USWDS (U.S. Web Design System) and Material Design principles
- Custom color palette with trust-focused navy blue primary color
- Inter font family for professional readability
- Mobile-first responsive design
- Light and dark mode support via theme provider

**Component Architecture:**
- Functional components using React hooks
- Radix UI primitives for accessible base components
- Custom components built on top of shadcn/ui system
- Class Variance Authority (CVA) for component variants
- Form handling via React Hook Form with Zod validation

**Key Pages:**
- Home: Category-based navigation to different resource types
- Questionnaire: Multi-step intake form collecting veteran information
- Resources: Searchable/filterable resource listing with category and location filters
- Resource Detail: Individual resource information with contact details

### Backend Architecture

**Technology Stack:**
- Express.js server with TypeScript
- Node.js runtime (ES modules)
- In-development: Vite middleware for HMR
- In-production: Static file serving

**Data Layer:**
- Drizzle ORM for database abstraction
- PostgreSQL database (via Neon serverless driver)
- Schema-first approach with Drizzle-Zod integration for validation

**Storage Strategy:**
- Current: In-memory storage implementation (`MemStorage`) for development
- Future: Database-backed storage via Drizzle ORM
- Seeded sample resources for immediate functionality

**API Design:**
- RESTful endpoints under `/api` prefix
- JSON request/response format
- Schema validation using Zod
- Error handling middleware

**Key Endpoints:**
- `POST /api/questionnaire` - Submit questionnaire responses
- `GET /api/questionnaire/:id` - Retrieve questionnaire response
- `GET /api/resources` - List/search resources (supports category, search, responseId filters)
- `GET /api/resources/:id` - Get individual resource details

### Data Models

**Core Entities:**

1. **Users** (authentication ready, not currently implemented)
   - Basic username/password structure
   - UUID primary keys

2. **Questionnaire Responses**
   - Demographic information (age, service years, branch)
   - Location data (location, zip code)
   - Needs array (healthcare, housing, employment, mental-health, education, etc.)
   - Used for matching veterans with appropriate resources

3. **Resources**
   - Categorized veteran services and benefits
   - Complete contact information (phone, email, website)
   - Location data for geographic matching
   - Eligibility criteria and hours of operation
   - Categories: healthcare, housing, employment, mental-health, education, crisis

**Schema Validation:**
- Zod schemas generated from Drizzle table definitions
- Type-safe insert/update operations
- Shared schemas between client and server via `@shared` path alias

### External Dependencies

**Third-Party UI Libraries:**
- Radix UI: Accessible component primitives (dialogs, dropdowns, menus, tooltips, etc.)
- Lucide React: Icon library
- Embla Carousel: Carousel functionality
- CMDK: Command menu component
- date-fns: Date manipulation utilities

**Development Tools:**
- Replit-specific plugins (cartographer, dev banner, runtime error overlay)
- ESBuild: Production server bundling
- TSX: TypeScript execution for development server
- Drizzle Kit: Database migrations and schema management

**Planned Integrations:**
- Google Maps API: For displaying nearby resources (currently not implemented)
- Veterans Crisis Line: Direct tel: link integration (988)

**Session Management:**
- connect-pg-simple: PostgreSQL session store (configured but authentication not active)

**Database:**
- Neon Serverless PostgreSQL: Cloud-hosted database
- Connection via DATABASE_URL environment variable
- Drizzle ORM handles connection pooling and queries