# Orthodox Separation Book: Chapter-Based Workflow

This repository contains the complete Orthodox theological work on separation from compromised hierarchy, organized as individual chapter files with automated build process.

## Repository Structure

```
/
├── src/
│   ├── 00-frontmatter.md    # Title + Introduction
│   ├── chapter-01.md        # Individual chapters
│   ├── chapter-02.md        # (24 chapters total)
│   └── ...
├── dist/                    # Generated complete manuscript
│   └── complete-manuscript.md
├── scripts/
│   ├── build-manuscript.js  # Concatenates chapters
│   └── split-manuscript.js  # Archive splitting script
├── archive/                 # Original monolithic files
│   └── MAIN_ARGUMENT_DOCUMENT.md
└── README.md
```

## Primary Workflow

**Edit individual chapters** → **Build complete manuscript**

1. **Edit chapters** in `src/` directory (each chapter is self-contained)
2. **Generate manuscript**: `npm run build`
3. **Git hooks**: Pre-commit automatically rebuilds and commits manuscript
4. **Generated files**: `dist/complete-manuscript.md` tracked in git for Claude Code access

## Commands

- `npm run build` - Generate complete manuscript from chapters
- `npm run split-from-archive` - Re-split from archived file (rarely needed)

## Chapter Organization

- **Sequential numbering**: chapter-01.md through chapter-24.md
- **Consistent formatting**: `## Chapter X:` headers
- **Self-contained**: Each chapter readable independently
- **Natural sorting**: Files concatenated in proper order (01, 02, 03...)

## Generation Strategy

The complete manuscript is generated at `dist/complete-manuscript.md` and contains:
- All 25 files (frontmatter + 24 chapters) 
- ~61,312 words across 4,990 lines
- Proper spacing between sections
- All original formatting preserved

## Transition Notes

The original monolithic file has been archived. Going forward, work primarily with individual chapter files in `src/`. The build process ensures the complete manuscript stays synchronized with chapter edits.