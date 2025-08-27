# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 frontend application for the SnapIter project, built with:
- Next.js 15.5.0 with App Router
- React 19.1.0
- TypeScript (strict mode enabled)
- Tailwind CSS v4
- Biome for linting and formatting
- MapLibre GL JS via react-map-gl for interactive maps
- Swiper for carousel/slider components
- jotai for state management
- Backend swagger API https://api.partypieps.nl/api/api-docs/V1

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production bundle with Turbopack
- `npm run start` - Start production server
- `npm run lint` - Run Biome linter checks
- `npm run format` - Format code with Biome

## Architecture

This is a standard Next.js App Router application:
- Uses TypeScript path aliases (`@/*` maps to `./src/*`)
- App directory structure under `src/app/`
- Geist fonts (sans and mono) configured globally
- Tailwind CSS configured with PostCSS

## Code Standards

- Biome is configured for linting and formatting with:
  - 2-space indentation
  - Recommended rules for React and Next.js
  - Auto-organize imports enabled
- TypeScript strict mode is enforced
- ES2017 target with modern module resolution