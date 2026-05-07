/**
 * generate_docx.js — Agent-callable DOCX generator
 *
 * Alternative to build_docx.js that reads from Output/ markdown files
 * and generates a full RTL Arabic Word document with embedded images.
 *
 * Usage: node .agents/scripts/generate_docx.js
 */
const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, TextRun, ImageRun,
        AlignmentType, HeadingLevel, PageBreak } = require('docx');

const OUTPUT_DIR = path.join(__dirname, '..', '..', 'Output');
const IMAGES_DIR = path.join(OUTPUT_DIR, 'images', 'extracted');
const DOCX_PATH = path.join(OUTPUT_DIR, 'report.docx');

// Get all markdown files in order
const files = fs.readdirSync(OUTPUT_DIR)
    .filter(f => f.endsWith('.md') && !f.includes('research_log') && !f.includes('log_'))
    .sort();

// Get all extracted images
let availableImages = [];
if (fs.existsSync(IMAGES_DIR)) {
    availableImages = fs.readdirSync(IMAGES_DIR)
        .filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg'))
        .map(f => path.join(IMAGES_DIR, f));
}

let imageIndex = 0;
function getNextImage() {
    if (availableImages.length === 0) return null;
    const img = availableImages[imageIndex % availableImages.length];
    imageIndex++;
    return img;
}

// Configuration — customize for your template
const FONT_NAME = 'Sakkal Majalla';

const docChildren = [];

// Cover Page — customize for your institution
docChildren.push(
    new Paragraph({
        bidirectional: true,
        alignment: AlignmentType.CENTER,
        spacing: { before: 2000, after: 1000 },
        children: [
            new TextRun({ text: "[Institution Name]", rightToLeft: true, font: FONT_NAME, size: 36, bold: true })
        ]
    }),
    new Paragraph({
        bidirectional: true,
        alignment: AlignmentType.CENTER,
        spacing: { after: 3000 },
        children: [
            new TextRun({ text: "[Thesis Title]", rightToLeft: true, font: FONT_NAME, size: 56, bold: true, color: "000080" })
        ]
    }),
    new Paragraph({ children: [new PageBreak()] })
);

// Process each file
for (const file of files) {
    const filePath = path.join(OUTPUT_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    for (let line of lines) {
        line = line.trim();
        if (!line) continue;

        // Image placeholder
        if (line.startsWith('![') && line.includes('](image:')) {
            const captionMatch = line.match(/!\[(.*?)\]/);
            const caption = captionMatch ? captionMatch[1] : "figure";

            const imgPath = getNextImage();
            if (imgPath) {
                try {
                    const imgData = fs.readFileSync(imgPath);
                    docChildren.push(
                        new Paragraph({
                            bidirectional: true,
                            alignment: AlignmentType.CENTER,
                            spacing: { before: 240, after: 120 },
                            children: [
                                new ImageRun({
                                    data: imgData,
                                    transformation: { width: 500, height: 350 },
                                    type: imgPath.endsWith('png') ? "png" : "jpg"
                                })
                            ]
                        }),
                        new Paragraph({
                            bidirectional: true,
                            alignment: AlignmentType.CENTER,
                            spacing: { after: 360 },
                            children: [
                                new TextRun({
                                    text: caption,
                                    rightToLeft: true,
                                    font: FONT_NAME,
                                    size: 24,
                                    italics: true
                                })
                            ]
                        })
                    );
                } catch (e) {
                    console.error(`Failed to load image: ${imgPath}`);
                }
            }
            continue;
        }

        // Headings
        if (line.startsWith('# ')) {
            docChildren.push(new Paragraph({ children: [new PageBreak()] }));
            docChildren.push(new Paragraph({
                bidirectional: true, alignment: AlignmentType.CENTER, heading: HeadingLevel.HEADING_1,
                spacing: { before: 600, after: 400 },
                children: [new TextRun({ text: line.replace('# ', ''), rightToLeft: true, font: FONT_NAME, size: 48, bold: true })]
            }));
            continue;
        }
        if (line.startsWith('## ')) {
            docChildren.push(new Paragraph({
                bidirectional: true, alignment: AlignmentType.RIGHT, heading: HeadingLevel.HEADING_2,
                spacing: { before: 400, after: 200 },
                children: [new TextRun({ text: line.replace('## ', ''), rightToLeft: true, font: FONT_NAME, size: 36, bold: true })]
            }));
            continue;
        }
        if (line.startsWith('### ')) {
            docChildren.push(new Paragraph({
                bidirectional: true, alignment: AlignmentType.RIGHT, heading: HeadingLevel.HEADING_3,
                spacing: { before: 300, after: 120 },
                children: [new TextRun({ text: line.replace('### ', ''), rightToLeft: true, font: FONT_NAME, size: 32, bold: true, color: "000080" })]
            }));
            continue;
        }

        // Lists
        if (line.startsWith('- ') || line.startsWith('* ')) {
            docChildren.push(new Paragraph({
                bidirectional: true, alignment: AlignmentType.JUSTIFY,
                spacing: { before: 120, after: 120 },
                indent: { end: 720 },
                children: [new TextRun({ text: "\u2022 " + line.substring(2), rightToLeft: true, font: FONT_NAME, size: 28 })]
            }));
            continue;
        }
        if (line.match(/^\d+\.\s/)) {
            docChildren.push(new Paragraph({
                bidirectional: true, alignment: AlignmentType.JUSTIFY,
                spacing: { before: 120, after: 120 },
                indent: { end: 720 },
                children: [new TextRun({ text: line, rightToLeft: true, font: FONT_NAME, size: 28 })]
            }));
            continue;
        }

        // Normal text
        let cleanText = line.replace(/\*\*/g, '').replace(/\*/g, '');
        docChildren.push(new Paragraph({
            bidirectional: true, alignment: AlignmentType.JUSTIFY,
            spacing: { before: 120, after: 120 },
            children: [new TextRun({ text: cleanText, rightToLeft: true, font: FONT_NAME, size: 28 })]
        }));
    }
}

// Assemble Document
const doc = new Document({
    sections: [{
        properties: {
            page: {
                margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
            }
        },
        children: docChildren
    }]
});

Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync(DOCX_PATH, buffer);
    console.log("Document generated successfully at:", DOCX_PATH);
});
