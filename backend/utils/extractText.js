import mammoth from "mammoth";
import * as XLSX from "xlsx";
import officeParser from "officeparser";
import { PDFParser } from "pdfnano";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

const tmpDir = path.join(process.cwd(), "tmp");
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

const extractPdfText = async (buffer) => {
  const tmpPath = path.join(tmpDir, `${randomUUID()}.pdf`);
  fs.writeFileSync(tmpPath, buffer);
  try {
    const parser = new PDFParser();
    const result = await parser.parseFile(tmpPath);
    return result.text || "";
  } finally {
    fs.unlinkSync(tmpPath);
  }
};

const parseWithOfficeParser = async (buffer, ext) => {
  const tmpPath = path.join(tmpDir, `${randomUUID()}.${ext}`);
  fs.writeFileSync(tmpPath, buffer);
  try {
    const text = await officeParser.parseOfficeAsync(tmpPath);
    return text;
  } finally {
    fs.unlinkSync(tmpPath);
  }
};

export const extractText = async (buffer, mimetype) => {
  try {
    // PDF
    if (mimetype === "application/pdf") {
      const text = await extractPdfText(buffer);
      return text?.slice(0, 3000) || "";
    }

    // DOCX
    if (mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const result = await mammoth.extractRawText({ buffer });
      return result.value?.slice(0, 3000) || "";
    }

    // DOC
    if (mimetype === "application/msword") {
      const text = await parseWithOfficeParser(buffer, "doc");
      return text?.slice(0, 3000) || "";
    }

    // XLSX
    if (mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      const workbook = XLSX.read(buffer, { type: "buffer" });
      let text = "";
      workbook.SheetNames.forEach((sheetName) => {
        const sheet = workbook.Sheets[sheetName];
        text += XLSX.utils.sheet_to_csv(sheet) + "\n";
      });
      return text?.slice(0, 3000) || "";
    }

    // XLS
    if (mimetype === "application/vnd.ms-excel") {
      const workbook = XLSX.read(buffer, { type: "buffer" });
      let text = "";
      workbook.SheetNames.forEach((sheetName) => {
        const sheet = workbook.Sheets[sheetName];
        text += XLSX.utils.sheet_to_csv(sheet) + "\n";
      });
      return text?.slice(0, 3000) || "";
    }

    // PPTX
    if (mimetype === "application/vnd.openxmlformats-officedocument.presentationml.presentation") {
      const text = await parseWithOfficeParser(buffer, "pptx");
      return text?.slice(0, 3000) || "";
    }

    // PPT
    if (mimetype === "application/vnd.ms-powerpoint") {
      const text = await parseWithOfficeParser(buffer, "ppt");
      return text?.slice(0, 3000) || "";
    }

    // Image
    if (mimetype.startsWith("image/")) {
      return null;
    }

    return "";
  } catch (err) {
    console.error("Text extraction failed:", err.message);
    return "";
  }
};