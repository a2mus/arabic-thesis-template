/**
 * build_docx.js — Markdown-to-DOCX builder
 *
 * Reads all .md files from Output/ (sorted by numeric prefix),
 * parses headings, paragraphs, and image placeholders,
 * then generates a single RTL Arabic Word document.
 *
 * Usage: node build_docx.js
 * Prerequisites: npm install
 */
const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, TextRun, ImageRun, AlignmentType, HeadingLevel, PageBreak } = require('docx');
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();

// ── Configuration ─────────────────────────────────────────────
const FONT_FAMILY = "Sakkal Majalla"; // Change to match your template
const OUTPUT_DIR = path.join(__dirname, 'Output');
const IMAGES_DIR = path.join(OUTPUT_DIR, 'images', 'extracted');
// ──────────────────────────────────────────────────────────────

function createTextRun(text, options = {}) {
    return new TextRun({
        text: text,
        rightToLeft: true,
        font: FONT_FAMILY,
        size: options.size || 28,
        bold: options.bold || false,
        italics: options.italics || false,
    });
}

function createParagraph(children, options = {}) {
    return new Paragraph({
        children: children,
        bidirectional: true,
        alignment: options.alignment || AlignmentType.JUSTIFY,
        heading: options.heading || undefined,
        spacing: { line: 360, after: 200, before: options.before || 0 },
    });
}

function processMarkdownToDocxElements(mdContent, outputDir) {
    const elements = [];
    const tokens = md.parse(mdContent, {});

    let currentHeadingLevel = null;
    let currentParagraphText = [];

    const flushParagraph = () => {
        if (currentParagraphText.length > 0) {
            const text = currentParagraphText.join('');
            if (currentHeadingLevel) {
                let size = 36;
                let alignment = AlignmentType.RIGHT;
                if (currentHeadingLevel === HeadingLevel.HEADING_1) size = 44;
                if (currentHeadingLevel === HeadingLevel.HEADING_2) size = 36;
                if (currentHeadingLevel === HeadingLevel.HEADING_3) size = 32;

                elements.push(createParagraph([createTextRun(text, { size, bold: true })], {
                    heading: currentHeadingLevel,
                    alignment: alignment,
                    before: 400
                }));
            } else {
                elements.push(createParagraph([createTextRun(text, { size: 28 })]));
            }
            currentParagraphText = [];
            currentHeadingLevel = null;
        }
    };

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];

        if (token.type === 'heading_open') {
            flushParagraph();
            const level = parseInt(token.tag.replace('h', ''));
            if (level === 1) currentHeadingLevel = HeadingLevel.HEADING_1;
            else if (level === 2) currentHeadingLevel = HeadingLevel.HEADING_2;
            else currentHeadingLevel = HeadingLevel.HEADING_3;
        } else if (token.type === 'heading_close') {
            flushParagraph();
        } else if (token.type === 'paragraph_open') {
            flushParagraph();
        } else if (token.type === 'paragraph_close') {
            flushParagraph();
        } else if (token.type === 'inline') {
            let hasImage = false;
            for (const child of token.children) {
                if (child.type === 'image') {
                    hasImage = true;
                    flushParagraph();

                    const src = child.attrGet('src');
                    const alt = child.content;
                    const imgPath = path.resolve(outputDir, src);

                    if (fs.existsSync(imgPath)) {
                        let imgExt = path.extname(imgPath).toLowerCase();
                        let type = "png";
                        if (imgExt === '.jpg' || imgExt === '.jpeg') type = "jpg";
                        if (imgExt === '.gif') type = "gif";

                        try {
                            const imageData = fs.readFileSync(imgPath);
                            elements.push(new Paragraph({
                                bidirectional: true,
                                alignment: AlignmentType.CENTER,
                                spacing: { before: 400, after: 100 },
                                children: [
                                    new ImageRun({
                                        data: imageData,
                                        transformation: { width: 500, height: 350 },
                                        type: type
                                    })
                                ]
                            }));
                            elements.push(new Paragraph({
                                bidirectional: true,
                                alignment: AlignmentType.CENTER,
                                spacing: { after: 400 },
                                children: [createTextRun(alt, { size: 24, italics: true, bold: true })]
                            }));
                        } catch (e) {
                            console.error(`Failed to load image: ${imgPath}`, e);
                        }
                    } else {
                        elements.push(createParagraph(
                            [createTextRun(`[Image missing: ${alt}]`, { size: 24, italics: true, bold: true })],
                            { alignment: AlignmentType.CENTER }
                        ));
                    }
                } else if (child.type === 'text') {
                    currentParagraphText.push(child.content);
                }
            }
        } else if (token.type === 'hr') {
            flushParagraph();
            elements.push(new Paragraph({
                children: [createTextRun("---", { size: 28, bold: true })],
                alignment: AlignmentType.CENTER,
                bidirectional: true
            }));
        }
    }
    flushParagraph();
    return elements;
}

async function buildDocx() {
    const files = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.md')).sort();
    const docElements = [];

    // ── Cover Page (customize for your institution) ────────────
    docElements.push(createParagraph(
        [createTextRun("[Institution Name]", { size: 32, bold: true })],
        { alignment: AlignmentType.CENTER }
    ));
    docElements.push(createParagraph(
        [createTextRun("[Thesis Title]", { size: 48, bold: true })],
        { alignment: AlignmentType.CENTER }
    ));
    docElements.push(new Paragraph({ children: [new PageBreak()] }));
    // ──────────────────────────────────────────────────────────

    for (const file of files) {
        const filePath = path.join(OUTPUT_DIR, file);
        const content = fs.readFileSync(filePath, 'utf8');

        // Add page breaks before chapter introductions
        if (file.includes('_00_')) {
            docElements.push(new Paragraph({ children: [new PageBreak()] }));
        }

        const elements = processMarkdownToDocxElements(content, OUTPUT_DIR);
        docElements.push(...elements);
    }

    const doc = new Document({
        sections: [{
            properties: {
                page: {
                    margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
                },
            },
            children: docElements
        }]
    });

    const buffer = await Packer.toBuffer(doc);
    const outputPath = path.join(OUTPUT_DIR, 'report.docx');
    fs.writeFileSync(outputPath, buffer);
    console.log("Document generated successfully at:", outputPath);
}

buildDocx().catch(console.error);
