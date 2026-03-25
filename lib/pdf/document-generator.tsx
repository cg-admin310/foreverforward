"use server";

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
  renderToBuffer,
} from "@react-pdf/renderer";

// Register Poppins font (using Google Fonts URLs)
Font.register({
  family: "Poppins",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/poppins/v21/pxiEyp8kv8JHgFVrJJfecg.woff2",
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2",
      fontWeight: 600,
    },
    {
      src: "https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2",
      fontWeight: 700,
    },
  ],
});

// Brand Colors
const colors = {
  black: "#1A1A1A",
  gold: "#C9A84C",
  goldLight: "#FBF6E9",
  olive: "#5A7247",
  oliveLight: "#EFF4EB",
  gray: "#555555",
  lightGray: "#888888",
  border: "#DDDDDD",
  white: "#FFFFFF",
};

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: "Poppins",
    fontSize: 11,
    color: colors.black,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: colors.gold,
  },
  logo: {
    width: 150,
    height: 50,
  },
  headerInfo: {
    textAlign: "right",
    fontSize: 9,
    color: colors.gray,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: colors.black,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: colors.black,
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  paragraph: {
    fontSize: 11,
    lineHeight: 1.6,
    color: colors.gray,
    marginBottom: 10,
  },
  bulletPoint: {
    flexDirection: "row",
    marginBottom: 5,
    paddingLeft: 10,
  },
  bulletDot: {
    width: 5,
    fontSize: 11,
    color: colors.gold,
    marginRight: 8,
  },
  bulletText: {
    flex: 1,
    fontSize: 11,
    color: colors.gray,
    lineHeight: 1.5,
  },
  table: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tableRowHeader: {
    flexDirection: "row",
    backgroundColor: colors.goldLight,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tableCell: {
    flex: 1,
    padding: 8,
    fontSize: 10,
    color: colors.gray,
  },
  tableCellHeader: {
    flex: 1,
    padding: 8,
    fontSize: 10,
    fontWeight: 600,
    color: colors.black,
  },
  highlight: {
    backgroundColor: colors.goldLight,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 3,
    borderLeftColor: colors.gold,
  },
  highlightText: {
    fontSize: 12,
    fontWeight: 600,
    color: colors.black,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 50,
    right: 50,
    textAlign: "center",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    fontSize: 9,
    color: colors.lightGray,
  },
  pageNumber: {
    position: "absolute",
    bottom: 30,
    right: 50,
    fontSize: 9,
    color: colors.lightGray,
  },
  signatureSection: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signatureBlock: {
    width: "45%",
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: colors.black,
    marginBottom: 5,
    marginTop: 40,
  },
  signatureLabel: {
    fontSize: 9,
    color: colors.gray,
  },
});

// Document type for different templates
export type DocumentTemplateType = "proposal" | "contract" | "certificate";

interface DocumentData {
  type: DocumentTemplateType;
  title: string;
  clientName: string;
  content: string;
  date?: string;
  metadata?: Record<string, unknown>;
}

// Parse markdown-like content to sections
function parseContent(content: string): { type: string; content: string }[] {
  const lines = content.split("\n");
  const sections: { type: string; content: string }[] = [];
  let currentSection: { type: string; content: string } | null = null;

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Skip empty lines at the start
    if (!trimmedLine && !currentSection) continue;

    // Heading 1 (# Title)
    if (trimmedLine.startsWith("# ")) {
      if (currentSection) sections.push(currentSection);
      currentSection = { type: "h1", content: trimmedLine.slice(2) };
    }
    // Heading 2 (## Section)
    else if (trimmedLine.startsWith("## ")) {
      if (currentSection) sections.push(currentSection);
      currentSection = { type: "h2", content: trimmedLine.slice(3) };
    }
    // Heading 3 (### Subsection)
    else if (trimmedLine.startsWith("### ")) {
      if (currentSection) sections.push(currentSection);
      currentSection = { type: "h3", content: trimmedLine.slice(4) };
    }
    // Bullet points
    else if (trimmedLine.startsWith("- ") || trimmedLine.startsWith("* ")) {
      if (currentSection && currentSection.type !== "bullet") {
        sections.push(currentSection);
        currentSection = { type: "bullet", content: trimmedLine.slice(2) };
      } else if (currentSection?.type === "bullet") {
        currentSection.content += "\n" + trimmedLine.slice(2);
      } else {
        currentSection = { type: "bullet", content: trimmedLine.slice(2) };
      }
    }
    // Regular paragraph
    else if (trimmedLine) {
      if (currentSection && currentSection.type === "paragraph") {
        currentSection.content += " " + trimmedLine;
      } else {
        if (currentSection) sections.push(currentSection);
        currentSection = { type: "paragraph", content: trimmedLine };
      }
    }
    // Empty line ends current paragraph
    else if (currentSection) {
      sections.push(currentSection);
      currentSection = null;
    }
  }

  if (currentSection) sections.push(currentSection);
  return sections;
}

// Render parsed content to PDF elements
function renderContent(sections: { type: string; content: string }[]) {
  return sections.map((section, index) => {
    switch (section.type) {
      case "h1":
        return (
          <Text key={index} style={styles.title}>
            {section.content}
          </Text>
        );
      case "h2":
        return (
          <Text key={index} style={styles.sectionTitle}>
            {section.content}
          </Text>
        );
      case "h3":
        return (
          <Text
            key={index}
            style={[styles.sectionTitle, { fontSize: 12, marginTop: 10 }]}
          >
            {section.content}
          </Text>
        );
      case "bullet":
        return (
          <View key={index} style={styles.section}>
            {section.content.split("\n").map((bullet, i) => (
              <View key={i} style={styles.bulletPoint}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bulletText}>{bullet}</Text>
              </View>
            ))}
          </View>
        );
      case "paragraph":
      default:
        return (
          <Text key={index} style={styles.paragraph}>
            {section.content}
          </Text>
        );
    }
  });
}

// Main PDF Document Component
function DocumentPDF({ data }: { data: DocumentData }) {
  const sections = parseContent(data.content);
  const documentDate = data.date || new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Document
      title={data.title}
      author="Forever Forward Foundation"
      subject={`${data.type} for ${data.clientName}`}
    >
      <Page size="LETTER" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={{ fontSize: 18, fontWeight: 700, color: colors.gold }}>
              Forever Forward
            </Text>
            <Text style={{ fontSize: 10, color: colors.olive }}>
              Moving Forward, Together
            </Text>
          </View>
          <View style={styles.headerInfo}>
            <Text>6111 S Gramercy Pl, Suite 4</Text>
            <Text>Los Angeles, CA 90047</Text>
            <Text>(951) 877-5196</Text>
            <Text>4ever4wardfoundation@gmail.com</Text>
          </View>
        </View>

        {/* Document Info */}
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.subtitle}>{documentDate}</Text>
          <Text style={{ fontSize: 11, color: colors.gray }}>
            Prepared for: {data.clientName}
          </Text>
        </View>

        {/* Content */}
        <View style={styles.section}>{renderContent(sections)}</View>

        {/* Signature Section for Contracts */}
        {data.type === "contract" && (
          <View style={styles.signatureSection}>
            <View style={styles.signatureBlock}>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureLabel}>
                Forever Forward Foundation
              </Text>
              <Text style={styles.signatureLabel}>Date: _______________</Text>
            </View>
            <View style={styles.signatureBlock}>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureLabel}>{data.clientName}</Text>
              <Text style={styles.signatureLabel}>Date: _______________</Text>
            </View>
          </View>
        )}

        {/* Footer */}
        <Text style={styles.footer}>
          Forever Forward Foundation • 501(c)(3) Nonprofit • forever4ward.org
        </Text>
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber} of ${totalPages}`
          }
        />
      </Page>
    </Document>
  );
}

// Generate PDF Buffer
export async function generateDocumentPdf(
  content: string,
  title: string,
  type: DocumentTemplateType,
  clientName: string
): Promise<Buffer> {
  const documentData: DocumentData = {
    type,
    title,
    clientName,
    content,
    date: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  };

  const buffer = await renderToBuffer(<DocumentPDF data={documentData} />);
  return Buffer.from(buffer);
}

// Certificate Generator Component
function CertificatePDF({
  participantName,
  programName,
  completionDate,
  certificationNumber,
}: {
  participantName: string;
  programName: string;
  completionDate: string;
  certificationNumber: string;
}) {
  return (
    <Document
      title={`Certificate of Completion - ${participantName}`}
      author="Forever Forward Foundation"
    >
      <Page
        size="LETTER"
        orientation="landscape"
        style={[styles.page, { padding: 60 }]}
      >
        {/* Border */}
        <View
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            right: 20,
            bottom: 20,
            borderWidth: 3,
            borderColor: colors.gold,
          }}
        />
        <View
          style={{
            position: "absolute",
            top: 30,
            left: 30,
            right: 30,
            bottom: 30,
            borderWidth: 1,
            borderColor: colors.olive,
          }}
        />

        {/* Content */}
        <View style={{ alignItems: "center", marginTop: 30 }}>
          <Text
            style={{
              fontSize: 14,
              letterSpacing: 4,
              color: colors.olive,
              marginBottom: 15,
            }}
          >
            FOREVER FORWARD FOUNDATION
          </Text>

          <Text
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: colors.gold,
              marginBottom: 10,
            }}
          >
            Certificate of Completion
          </Text>

          <Text
            style={{ fontSize: 14, color: colors.gray, marginBottom: 30 }}
          >
            This is to certify that
          </Text>

          <Text
            style={{
              fontSize: 28,
              fontWeight: 600,
              color: colors.black,
              marginBottom: 10,
              paddingBottom: 5,
              borderBottomWidth: 1,
              borderBottomColor: colors.gold,
            }}
          >
            {participantName}
          </Text>

          <Text
            style={{ fontSize: 14, color: colors.gray, marginBottom: 10 }}
          >
            has successfully completed the
          </Text>

          <Text
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: colors.olive,
              marginBottom: 30,
            }}
          >
            {programName}
          </Text>

          <Text style={{ fontSize: 12, color: colors.gray, marginBottom: 40 }}>
            Awarded on {completionDate}
          </Text>

          {/* Signature */}
          <View style={{ flexDirection: "row", gap: 100 }}>
            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: colors.black,
                  fontStyle: "italic",
                }}
              >
                Thomas "TJ" Wilform
              </Text>
              <View
                style={{
                  width: 150,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.black,
                  marginTop: 5,
                }}
              />
              <Text style={{ fontSize: 10, color: colors.gray, marginTop: 5 }}>
                Founder & CEO
              </Text>
            </View>
          </View>

          <Text
            style={{
              fontSize: 9,
              color: colors.lightGray,
              marginTop: 30,
            }}
          >
            Certificate ID: {certificationNumber}
          </Text>
        </View>
      </Page>
    </Document>
  );
}

// Generate Certificate PDF Buffer
export async function generateCertificatePdf(data: {
  participantName: string;
  programName: string;
  completionDate: string;
  certificationNumber?: string;
}): Promise<Buffer> {
  const certNumber =
    data.certificationNumber ||
    `FF-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  const buffer = await renderToBuffer(
    <CertificatePDF
      participantName={data.participantName}
      programName={data.programName}
      completionDate={data.completionDate}
      certificationNumber={certNumber}
    />
  );
  return Buffer.from(buffer);
}
