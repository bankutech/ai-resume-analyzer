import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Packer,
  BorderStyle,
} from 'docx';
import puppeteer from 'puppeteer';
import { ResumeDocument } from '@resumeforge/shared';
import { resumeRepository } from '../repositories/resume.repository';
import { AppError } from '../lib/errors';

export class ExportService {
  /**
   * Generates a Word (.docx) document buffer from a canonical ResumeDocument
   */
  async generateDocx(resumeDoc: ResumeDocument): Promise<Buffer> {
    const { basics, summary, education, skills, experience, projects, honors, certifications } = resumeDoc;

    const children: Paragraph[] = [];

    // Header Name
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
        children: [
          new TextRun({
            text: basics.fullName,
            bold: true,
            size: 32, // 16pt
            font: 'Arial',
          }),
        ],
      })
    );

    // Headline & Contact Line
    const contactParts = [
      basics.email,
      basics.phone,
      basics.location,
      ...basics.links.map((l) => `${l.displayHandle || l.label}: ${l.url}`),
    ].filter(Boolean);

    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: contactParts.join('  |  '),
            size: 19,
            font: 'Arial',
            color: '444444',
          }),
        ],
      })
    );

    // Professional Summary
    if (summary && summary.visible && summary.content) {
      children.push(this.createSectionHeading('PROFESSIONAL SUMMARY'));
      children.push(
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun({
              text: summary.content,
              size: 20,
              font: 'Arial',
            }),
          ],
        })
      );
    }

    // Education
    if (education && education.length > 0) {
      children.push(this.createSectionHeading('EDUCATION'));
      for (const edu of education) {
        if (!edu.visible) continue;
        children.push(
          new Paragraph({
            spacing: { before: 80, after: 40 },
            children: [
              new TextRun({
                text: `${edu.institution}`,
                bold: true,
                size: 21,
                font: 'Arial',
              }),
              new TextRun({
                text: ` — ${edu.location}     (${edu.startDate} – ${edu.endDate})`,
                italics: true,
                size: 20,
                font: 'Arial',
              }),
            ],
          })
        );
        children.push(
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: `${edu.degree}${edu.gpa ? ` (GPA: ${edu.gpa})` : ''}`,
                size: 20,
                font: 'Arial',
              }),
            ],
          })
        );
      }
    }

    // Skills
    if (skills && skills.length > 0) {
      children.push(this.createSectionHeading('TECHNICAL SKILLS'));
      for (const skill of skills) {
        if (!skill.visible) continue;
        children.push(
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: `${skill.category}: `,
                bold: true,
                size: 20,
                font: 'Arial',
              }),
              new TextRun({
                text: skill.items.join(', '),
                size: 20,
                font: 'Arial',
              }),
            ],
          })
        );
      }
    }

    // Professional Experience
    if (experience && experience.length > 0) {
      children.push(this.createSectionHeading('PROFESSIONAL EXPERIENCE'));
      for (const exp of experience) {
        if (!exp.visible) continue;
        children.push(
          new Paragraph({
            spacing: { before: 120, after: 40 },
            children: [
              new TextRun({
                text: `${exp.role} — ${exp.organization}`,
                bold: true,
                size: 21,
                font: 'Arial',
              }),
              new TextRun({
                text: ` (${exp.startDate} – ${exp.endDate})`,
                italics: true,
                size: 19,
                font: 'Arial',
              }),
            ],
          })
        );
        for (const bullet of exp.bullets) {
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 40 },
              children: [
                new TextRun({
                  text: bullet,
                  size: 20,
                  font: 'Arial',
                }),
              ],
            })
          );
        }
      }
    }

    // Academic Projects
    if (projects && projects.length > 0) {
      children.push(this.createSectionHeading('ACADEMIC & TECHNICAL PROJECTS'));
      for (const prj of projects) {
        if (!prj.visible) continue;
        children.push(
          new Paragraph({
            spacing: { before: 100, after: 40 },
            children: [
              new TextRun({
                text: prj.title,
                bold: true,
                size: 21,
                font: 'Arial',
              }),
              new TextRun({
                text: prj.techStack.length ? ` [${prj.techStack.join(', ')}]` : '',
                italics: true,
                size: 19,
                font: 'Arial',
                color: '333333',
              }),
            ],
          })
        );
        for (const bullet of prj.bullets) {
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 40 },
              children: [
                new TextRun({
                  text: bullet,
                  size: 20,
                  font: 'Arial',
                }),
              ],
            })
          );
        }
      }
    }

    // Honors
    if (honors && honors.length > 0) {
      children.push(this.createSectionHeading('HONORS & LEADERSHIP'));
      for (const hon of honors) {
        if (!hon.visible) continue;
        children.push(
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: `${hon.title} — ${hon.issuer} (${hon.date}): `,
                bold: true,
                size: 20,
                font: 'Arial',
              }),
              new TextRun({
                text: hon.description,
                size: 20,
                font: 'Arial',
              }),
            ],
          })
        );
      }
    }

    const doc = new Document({
      creator: 'myRmyC — myresume mycareer',
      title: `${basics?.fullName || 'Resume'} — myRmyC`,
      description: 'ATS-Compliant Resume generated by myRmyC — myresume mycareer',
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 720,
                right: 720,
                bottom: 720,
                left: 720,
              },
            },
          },
          children,
        },
      ],
    });

    return await Packer.toBuffer(doc);
  }

  /**
   * Generates a vector PDF using headless Chromium via Puppeteer.
   */
  async generatePdf(resumeId: string, clientUrl: string): Promise<Buffer> {
    const resume = await resumeRepository.findById(resumeId);
    if (!resume) {
      throw AppError.notFound('Resume not found');
    }

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=medium'],
    });

    try {
      const page = await browser.newPage();
      const printUrl = `${clientUrl}/print/resumes/${resumeId}`;
      await page.goto(printUrl, { waitUntil: 'networkidle0', timeout: 30000 });

      // Wait for fonts and template render completion
      await page.waitForSelector('#print-root[data-ready="true"]', { timeout: 15000 }).catch(() => {});
      await page.evaluateHandle('document.fonts.ready');

      const isA4 = (resume.document as any)?.metadata?.pageSize !== 'LETTER';

      const pdfBuffer = await page.pdf({
        format: isA4 ? 'A4' : 'Letter',
        printBackground: true,
        preferCSSPageSize: true,
        margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
      });

      return Buffer.from(pdfBuffer);
    } finally {
      await browser.close();
    }
  }

  private createSectionHeading(title: string): Paragraph {
    return new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 80 },
      border: {
        bottom: {
          color: '2B2B2B',
          space: 2,
          style: BorderStyle.SINGLE,
          size: 6,
        },
      },
      children: [
        new TextRun({
          text: title,
          bold: true,
          size: 22,
          font: 'Arial',
          color: '1A1A1A',
        }),
      ],
    });
  }
}

export const exportService = new ExportService();
