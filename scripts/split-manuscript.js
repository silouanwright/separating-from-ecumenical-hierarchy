#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const MANUSCRIPT_PATH = '../archive/MAIN_ARGUMENT_DOCUMENT.md';
const OUTPUT_DIR = '../src';

function splitManuscript() {
    console.log('Reading manuscript...');
    const content = fs.readFileSync(path.join(__dirname, MANUSCRIPT_PATH), 'utf8');
    const lines = content.split('\n');
    
    let currentChapter = null;
    let currentContent = [];
    let chapterCount = 0;
    
    // Track if we're in the frontmatter (before first chapter)
    let inFrontmatter = true;
    let frontmatterContent = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Check if this line starts a new chapter
        const chapterMatch = line.match(/^## Chapter (\d+): (.+)$/);
        
        if (chapterMatch) {
            const chapterTitle = chapterMatch[2];
            
            // Skip old content that's marked for reorganization
            if (chapterTitle.includes('[OLD CONTENT - TO BE REORGANIZED]')) {
                console.log(`Skipping old content: ${line}`);
                currentContent.push(line); // Add to current content but don't create new chapter
                continue;
            }
            
            // Save previous chapter if it exists
            if (currentChapter !== null) {
                saveChapter(currentChapter, currentContent);
            }
            
            // Save frontmatter if we were in it
            if (inFrontmatter) {
                saveFrontmatter(frontmatterContent);
                inFrontmatter = false;
            }
            
            // Start new chapter
            currentChapter = parseInt(chapterMatch[1]);
            currentContent = [line];
            chapterCount++;
            
        } else {
            // Add line to current content
            if (inFrontmatter) {
                frontmatterContent.push(line);
            } else {
                currentContent.push(line);
            }
        }
    }
    
    // Save the last chapter
    if (currentChapter !== null) {
        saveChapter(currentChapter, currentContent);
    }
    
    console.log(`Split manuscript into frontmatter + ${chapterCount} chapters`);
}

function saveFrontmatter(content) {
    // Remove trailing empty lines and add proper ending
    while (content.length > 0 && content[content.length - 1].trim() === '') {
        content.pop();
    }
    
    const filename = path.join(__dirname, OUTPUT_DIR, '00-frontmatter.md');
    fs.writeFileSync(filename, content.join('\n') + '\n');
    console.log(`Saved: 00-frontmatter.md`);
}

function saveChapter(chapterNum, content) {
    // Remove trailing empty lines and add proper ending
    while (content.length > 0 && content[content.length - 1].trim() === '') {
        content.pop();
    }
    
    const filename = path.join(__dirname, OUTPUT_DIR, `chapter-${chapterNum.toString().padStart(2, '0')}.md`);
    fs.writeFileSync(filename, content.join('\n') + '\n');
    console.log(`Saved: chapter-${chapterNum.toString().padStart(2, '0')}.md`);
}

// Ensure output directory exists
if (!fs.existsSync(path.join(__dirname, OUTPUT_DIR))) {
    fs.mkdirSync(path.join(__dirname, OUTPUT_DIR), { recursive: true });
}

splitManuscript();