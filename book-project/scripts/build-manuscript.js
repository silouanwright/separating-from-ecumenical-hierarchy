#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const SRC_DIR = './src';
const OUTPUT_FILE = './dist/complete-manuscript.md';

function buildManuscript() {
    console.log('Building complete manuscript...');
    
    // Ensure dist directory exists
    const distDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir, { recursive: true });
    }
    
    // Get all files in src directory
    const files = fs.readdirSync(SRC_DIR)
        .filter(file => file.endsWith('.md'))
        .sort(naturalSort);
    
    console.log('Found files:', files);
    
    let combinedContent = '';
    
    for (const file of files) {
        const filePath = path.join(SRC_DIR, file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Add the content
        combinedContent += content;
        
        // Add spacing between files (but not after the last one)
        if (file !== files[files.length - 1]) {
            // Ensure proper spacing - exactly two newlines between sections
            combinedContent = combinedContent.replace(/\n*$/, '\n\n');
        }
    }
    
    // Write the combined manuscript
    fs.writeFileSync(OUTPUT_FILE, combinedContent);
    
    console.log(`Built complete manuscript: ${OUTPUT_FILE}`);
    console.log(`Combined ${files.length} files`);
    
    // Show some stats
    const lines = combinedContent.split('\n').length;
    const words = combinedContent.split(/\s+/).filter(w => w.length > 0).length;
    console.log(`Stats: ${lines} lines, ~${words} words`);
}

// Natural sort function to handle chapter-01, chapter-02, etc.
function naturalSort(a, b) {
    // Extract numbers from filenames for proper sorting
    const aMatch = a.match(/(\d+)/);
    const bMatch = b.match(/(\d+)/);
    
    if (aMatch && bMatch) {
        const aNum = parseInt(aMatch[1]);
        const bNum = parseInt(bMatch[1]);
        return aNum - bNum;
    }
    
    // Fallback to alphabetical
    return a.localeCompare(b);
}

buildManuscript();