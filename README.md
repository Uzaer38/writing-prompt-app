# Creative Writing Prompt & Response App

A Next.js application for creating and responding to writing prompts using the Lexical rich text editor.

## Installation & Running

```bash
npm install && npm run dev
```

## Architecture

- Built with Next.js 13+ App Router and TypeScript
- Uses Tailwind CSS for styling
- Implements Lexical editor for rich text responses
- In-memory data storage using Maps
- RESTful API routes for CRUD operations

## Key Design Decisions

1. App Router: Chosen for better performance and server components
2. In-memory Storage: Simple implementation for demonstration
3. Lexical Integration: Modular editor component with basic formatting
4. TypeScript: Type safety and better development experience
5. Tailwind CSS: Rapid UI development with utility classes

## Project Structure

```
├── app/
│   ├── api/         # API routes
│   ├── prompts/     # Prompt pages
│   └── page.tsx     # Page page
├── components/      # React components
├── types/          # TypeScript definitions
└── README.md
```
