# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server at localhost:4321
- `npm run build` - Build production site to ./dist/
- `npm run preview` - Preview production build locally

## Architecture Overview

This is an Astro-based cafe discovery application with hybrid static/client-side rendering. The app finds nearby cafes using Google Places API and stores data in Supabase.

### Key Architecture Components

**Frontend Framework**: Astro with React components for interactive elements, TailwindCSS for styling

**Data Flow**: 
- Location-based cafe search using Google Places API
- Client-side caching with localStorage (72hr expiration, 4MB limit)
- Scoring algorithm combines distance, rating, and review count
- Optional Supabase integration for persistent data

**Component Structure**:
- Static components (.astro) for server-side rendering
- Interactive components (.jsx) for client-side functionality
- Hybrid approach with both static and dynamic versions of Place/Places components

### Important Implementation Details

**Environment Variables** (configured in astro.config.mjs):
- `PUBLIC_GOOGLE_MAPS_API_KEY` - Google Maps/Places API
- `SUPABASE_URL` and `SUPABASE_ANON_KEY` - Database connection

**Google Maps Integration**:
- Uses `useGoogleMaps` hook for script loading
- Places API via New Places API (v1) with POST requests
- Libraries: places, geometry

**Caching Strategy**:
- Location-based cache keys: `places_{lat}_{lng}`
- LZ-string compression for storage efficiency
- Automatic cache size management

**Scoring Algorithm** (usePlaces.js:15-40):
- Distance weight: 50%
- Rating weight: 30% 
- Rating count weight: 20%
- Max search radius: 5km

### Current Branch Context

Working on `staticVersion` branch - focuses on static rendering optimizations vs dynamic components.