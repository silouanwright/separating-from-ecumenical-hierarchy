#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const MANUSCRIPT_PATH = '../../01_core_argument/MAIN_ARGUMENT_DOCUMENT.md';

function renumberChapters() {
    console.log('Reading manuscript...');
    const content = fs.readFileSync(path.join(__dirname, MANUSCRIPT_PATH), 'utf8');
    
    // Find all chapter headings with their line positions
    const lines = content.split('\n');
    const chapters = [];
    
    for (let i = 0; i < lines.length; i++) {
        const match = lines[i].match(/^## Chapter (\d+): (.+)$/);
        if (match) {
            const originalNum = parseInt(match[1]);
            const title = match[2];
            
            // Skip the duplicate/old content chapter
            if (title.includes('[OLD CONTENT - TO BE REORGANIZED]')) {
                console.log(`Skipping duplicate chapter ${originalNum}: ${title}`);
                continue;
            }
            
            chapters.push({
                lineIndex: i,
                originalNum: originalNum,
                title: title,
                line: lines[i]
            });
        }
    }
    
    // Sort chapters by their line position (document order)
    chapters.sort((a, b) => a.lineIndex - b.lineIndex);
    
    console.log('\nChapter order found:');
    chapters.forEach((ch, index) => {
        console.log(`${index + 1}. Line ${ch.lineIndex}: Chapter ${ch.originalNum} - ${ch.title}`);
    });
    
    // Create renumbering map
    console.log('\nRenumbering plan:');
    let newContent = content;
    
    // Process in reverse order to avoid line index shifting issues
    for (let i = chapters.length - 1; i >= 0; i--) {
        const chapter = chapters[i];
        const newNum = i + 1;
        const oldLine = chapter.line;
        const newLine = `## Chapter ${newNum}: ${chapter.title}`;
        
        console.log(`Chapter ${chapter.originalNum} -> Chapter ${newNum}: ${chapter.title}`);
        
        // Replace the exact line
        newContent = newContent.replace(oldLine, newLine);
    }
    
    // Write the updated content
    const backupPath = path.join(__dirname, MANUSCRIPT_PATH + '.backup');
    fs.writeFileSync(backupPath, content); // Backup original
    fs.writeFileSync(path.join(__dirname, MANUSCRIPT_PATH), newContent);
    
    console.log(`\nRenumbering complete!`);
    console.log(`Backup saved to: ${backupPath}`);
    console.log(`Updated ${chapters.length} chapters`);
}

renumberChapters();