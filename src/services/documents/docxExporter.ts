import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  Header,
  Footer,
  PageNumber,
  ImageRun,
} from 'docx';
import { saveAs } from 'file-saver';
import type { Report, HospitalProfile, DoctorProfile } from '../../types';
import { auditService } from '../storage/auditService';

function base64ToUint8Array(base64: string): Uint8Array {
  const cleanBase64 = base64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
  const binaryString = window.atob(cleanBase64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function exportReportToDocx(
  report: Report,
  hospital: HospitalProfile,
  doctor?: DoctorProfile | null
): Promise<void> {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1000,
              bottom: 1000,
              left: 1200,
              right: 1200,
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: `${hospital.name} | Pulmonology Procedure Report`,
                    size: 16,
                    color: '64748B',
                    italics: true,
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `Report ID: ${report.reportNumber}  •  Page `,
                    size: 18,
                    color: '64748B',
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 18,
                    color: '64748B',
                  }),
                  new TextRun({
                    text: ' of ',
                    size: 18,
                    color: '64748B',
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    size: 18,
                    color: '64748B',
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          // Hospital Header Section
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: hospital.name.toUpperCase(),
                bold: true,
                size: 28,
                color: '0F172A',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: hospital.department,
                bold: true,
                size: 22,
                color: '0284C7',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: `${hospital.address} | Tel: ${hospital.contactPhone}`,
                size: 18,
                color: '475569',
              }),
            ],
          }),

          // Procedure Report Title Badge
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: `— ${report.procedureName.toUpperCase()} REPORT —`,
                bold: true,
                size: 24,
                color: '0F172A',
              }),
            ],
          }),

          // Patient & Visit Metadata Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Patient ID: ', bold: true, size: 20 }),
                          new TextRun({ text: report.patientId, size: 20 }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Patient Name: ', bold: true, size: 20 }),
                          new TextRun({ text: report.patientName, size: 20 }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Age / Gender: ', bold: true, size: 20 }),
                          new TextRun({
                            text: `${report.patientAge} Y / ${report.patientGender}`,
                            size: 20,
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Visit Date: ', bold: true, size: 20 }),
                          new TextRun({ text: report.visitDate, size: 20 }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Referred By: ', bold: true, size: 20 }),
                          new TextRun({ text: report.referredBy || '—', size: 20 }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Consulted By: ', bold: true, size: 20 }),
                          new TextRun({ text: report.consultedBy || doctor?.name || '—', size: 20 }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ spacing: { after: 200 } }),

          // Procedure Information
          new Paragraph({
            children: [
              new TextRun({
                text: 'PROCEDURE INFORMATION',
                bold: true,
                size: 22,
                color: '0284C7',
              }),
            ],
            spacing: { before: 150, after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Premedication: ', bold: true }),
              new TextRun({ text: report.premedication || 'None' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Sedation: ', bold: true }),
              new TextRun({ text: report.sedation || 'None' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Route: ', bold: true }),
              new TextRun({
                text:
                  report.route === 'Other'
                    ? `Other (${report.routeCustom || 'Specified'})`
                    : report.route,
              }),
            ],
            spacing: { after: 200 },
          }),

          // CT Findings (If present)
          ...(report.ctFindings
            ? [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: 'CT FINDINGS',
                      bold: true,
                      size: 22,
                      color: '0284C7',
                    }),
                  ],
                  spacing: { before: 150, after: 100 },
                }),
                new Paragraph({
                  children: [new TextRun({ text: report.ctFindings })],
                  spacing: { after: 200 },
                }),
              ]
            : []),

          // Clinical Indication
          ...(report.indication
            ? [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: 'CLINICAL INDICATION',
                      bold: true,
                      size: 22,
                      color: '0284C7',
                    }),
                  ],
                  spacing: { before: 150, after: 100 },
                }),
                new Paragraph({
                  children: [new TextRun({ text: report.indication })],
                  spacing: { after: 200 },
                }),
              ]
            : []),

          // Bronchoscopic Anatomical Findings Table
          new Paragraph({
            children: [
              new TextRun({
                text: 'BRONCHOSCOPIC FINDINGS',
                bold: true,
                size: 22,
                color: '0284C7',
              }),
            ],
            spacing: { before: 200, after: 100 },
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 35, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Anatomical Location', bold: true, color: '0F172A' }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 25, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Status', bold: true, color: '0F172A' }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 40, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Detailed Findings', bold: true, color: '0F172A' }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              ...report.findings.map(
                (f) =>
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: f.anatomicalLocation, bold: true })] })],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: f.findingType,
                                bold: f.findingType !== 'Normal',
                                color: f.findingType === 'Normal' ? '166534' : 'C2410C',
                              }),
                            ],
                          }),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [new TextRun({ text: f.customText || 'Normal appearance' })],
                          }),
                        ],
                      }),
                    ],
                  })
              ),
            ],
          }),

          new Paragraph({ spacing: { after: 200 } }),

          // Interventions / Samples Section
          new Paragraph({
            children: [
              new TextRun({
                text: 'INTERVENTIONS & SAMPLE COLLECTION',
                bold: true,
                size: 22,
                color: '0284C7',
              }),
            ],
            spacing: { before: 200, after: 100 },
          }),

          // BAL
          new Paragraph({
            children: [
              new TextRun({ text: '• Bronchoalveolar Lavage (BAL): ', bold: true }),
              new TextRun({ text: report.bal.done ? 'DONE' : 'Not Performed', bold: true, color: report.bal.done ? '0284C7' : '64748B' }),
              ...(report.bal.done
                ? [
                    new TextRun({ text: ` | Site: ${report.bal.sampleSite || 'Standard'} | Tests: ${report.bal.specimenTests || 'Cytology, AFB, Culture'} ${report.bal.notes ? `(${report.bal.notes})` : ''}` }),
                  ]
                : []),
            ],
            spacing: { after: 60 },
          }),

          // Biopsy
          new Paragraph({
            children: [
              new TextRun({ text: '• Endobronchial Biopsy: ', bold: true }),
              new TextRun({ text: report.endobronchialBiopsy.done ? 'DONE' : 'Not Performed', bold: true, color: report.endobronchialBiopsy.done ? '0284C7' : '64748B' }),
              ...(report.endobronchialBiopsy.done
                ? [
                    new TextRun({ text: ` | Site: ${report.endobronchialBiopsy.site || 'Lobe segment'} | Specimen: ${report.endobronchialBiopsy.specimenNotes || 'Sent for histopathology'}` }),
                  ]
                : []),
            ],
            spacing: { after: 60 },
          }),

          // TBNA
          new Paragraph({
            children: [
              new TextRun({ text: '• Conventional TBNA: ', bold: true }),
              new TextRun({ text: report.conventionalTbna.done ? 'DONE' : 'Not Performed', bold: true, color: report.conventionalTbna.done ? '0284C7' : '64748B' }),
              ...(report.conventionalTbna.done
                ? [
                    new TextRun({ text: ` | Station: ${report.conventionalTbna.stationSite || 'Subcarinal station'} | Tests: ${report.conventionalTbna.specimenTests || 'Cytology'} ${report.conventionalTbna.notes ? `(${report.conventionalTbna.notes})` : ''}` }),
                  ]
                : []),
            ],
            spacing: { after: 60 },
          }),

          // Brushing
          new Paragraph({
            children: [
              new TextRun({ text: '• Bronchial Brushing: ', bold: true }),
              new TextRun({ text: report.brushing.done ? 'DONE' : 'Not Performed', bold: true, color: report.brushing.done ? '0284C7' : '64748B' }),
              ...(report.brushing.done
                ? [
                    new TextRun({ text: ` | Site: ${report.brushing.site || 'Target segment'} ${report.brushing.notes ? `(${report.brushing.notes})` : ''}` }),
                  ]
                : []),
            ],
            spacing: { after: 200 },
          }),

          // IMPRESSION
          new Paragraph({
            children: [
              new TextRun({
                text: 'IMPRESSION',
                bold: true,
                size: 22,
                color: '0F172A',
              }),
            ],
            spacing: { before: 150, after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: report.impression || 'No impression specified.', bold: true, size: 22 })],
            spacing: { after: 200 },
          }),

          // ADVICE
          new Paragraph({
            children: [
              new TextRun({
                text: 'ADVICE & RECOMMENDATIONS',
                bold: true,
                size: 22,
                color: '0F172A',
              }),
            ],
            spacing: { before: 150, after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: report.advice || 'Follow standard post-bronchoscopy care instructions.' })],
            spacing: { after: 300 },
          }),

          // Medical Images Section (if images attached)
          ...(report.images && report.images.length > 0
            ? [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: 'MEDICAL BRONCHOSCOPY IMAGES',
                      bold: true,
                      size: 22,
                      color: '0284C7',
                    }),
                  ],
                  spacing: { before: 200, after: 150 },
                }),
                ...createDocxImageParagraphs(report.images),
              ]
            : []),

          // Doctor Signature Block
          new Paragraph({ spacing: { before: 400 } }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 60, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Report Status: ', bold: true }),
                          new TextRun({ text: report.status.toUpperCase(), bold: true, color: report.status === 'Completed' ? '166534' : 'D97706' }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Report ID: ', bold: true }),
                          new TextRun({ text: report.reportNumber }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Date Finalized: ', bold: true }),
                          new TextRun({ text: report.finalizedAt ? new Date(report.finalizedAt).toLocaleDateString() : 'Draft' }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 40, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({
                            text: doctor?.name || report.consultedBy || 'Attending Pulmonologist',
                            bold: true,
                            size: 20,
                          }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({
                            text: doctor?.designation || 'Consultant Pulmonologist',
                            size: 18,
                            color: '475569',
                          }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({
                            text: doctor?.credentials || 'MD, DM Pulmonology',
                            size: 16,
                            color: '64748B',
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${report.reportNumber}_Pulmonology_Report.docx`);

  await auditService.log(
    'Report Exported DOCX',
    report.id,
    `Exported report ${report.reportNumber} to Microsoft Word DOCX`
  );
}

function createDocxImageParagraphs(images: any[]): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    if (!img.dataUrl) continue;

    try {
      const imgBytes = base64ToUint8Array(img.dataUrl);
      const isPng = img.fileType === 'image/png';
      paragraphs.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 100, after: 40 },
          children: [
            new ImageRun({
              data: imgBytes,
              transformation: {
                width: 280,
                height: 200,
              },
              type: isPng ? 'png' : 'jpg',
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 150 },
          children: [
            new TextRun({
              text: `Fig ${i + 1}: ${img.label || 'Bronchoscopy Endoscopic View'}`,
              italics: true,
              size: 18,
              color: '475569',
            }),
          ],
        })
      );
    } catch (e) {
      console.error('Failed to embed image in DOCX', e);
    }
  }

  return paragraphs;
}
