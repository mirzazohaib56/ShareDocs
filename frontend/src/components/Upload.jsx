import { useState } from "react";
import { Upload, File, CheckCircle, XCircle, Download } from "lucide-react";

// Styled Components
const PageContainer = ({ children }) => (
  <div style={{
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px"
  }}>
    {children}
  </div>
);

const Card = ({ children }) => (
  <div style={{
    width: "100%",
    maxWidth: "700px",
    background: "#ffffff",
    borderRadius: "20px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
    padding: "40px"
  }}>
    {children}
  </div>
);

const Header = ({ children }) => (
  <div style={{
    textAlign: "center",
    marginBottom: "40px"
  }}>
    {children}
  </div>
);

const IconCircle = ({ children, background = "#e3f2fd" }) => (
  <div style={{
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "80px",
    height: "80px",
    background: background,
    borderRadius: "50%",
    marginBottom: "20px"
  }}>
    {children}
  </div>
);

const Title = ({ children }) => (
  <h2 style={{
    fontSize: "32px",
    fontWeight: "700",
    color: "#1a202c",
    marginBottom: "10px"
  }}>
    {children}
  </h2>
);

const Subtitle = ({ children }) => (
  <p style={{
    fontSize: "16px",
    color: "#718096",
    margin: "0"
  }}>
    {children}
  </p>
);

const UploadArea = ({ isDragging, onDragOver, onDragLeave, onDrop, disabled, children }) => (
  <div
    onDragOver={onDragOver}
    onDragLeave={onDragLeave}
    onDrop={onDrop}
    style={{
      border: `3px dashed ${isDragging ? "#667eea" : "#cbd5e0"}`,
      borderRadius: "16px",
      padding: "60px 20px",
      textAlign: "center",
      background: isDragging ? "#f0f4ff" : "#fafafa",
      transition: "all 0.3s ease",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.6 : 1
    }}
  >
    {children}
  </div>
);

const UploadButton = ({ children }) => (
  <div style={{
    width: "100px",
    height: "100px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
    boxShadow: "0 10px 30px rgba(102, 126, 234, 0.4)"
  }}>
    {children}
  </div>
);

const ProgressBar = ({ children }) => (
  <div style={{
    marginTop: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#f7fafc",
    borderRadius: "12px",
    padding: "20px",
    border: "1px solid #e2e8f0"
  }}>
    {children}
  </div>
);

const ProgressDots = ({ count, total = 3 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
    <div style={{ display: "flex", gap: "8px" }}>
      {[...Array(total)].map((_, i) => (
        <div
          key={i}
          style={{
            width: "14px",
            height: "14px",
            borderRadius: "50%",
            background: i < count 
              ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              : "#e2e8f0",
            transform: i < count ? "scale(1.2)" : "scale(1)",
            transition: "all 0.3s ease",
            boxShadow: i < count ? "0 2px 8px rgba(102, 126, 234, 0.4)" : "none"
          }}
        />
      ))}
    </div>
    <span style={{
      fontSize: "14px",
      fontWeight: "600",
      color: "#2d3748"
    }}>
      {count}/{total} files selected
    </span>
  </div>
);

const FileItem = ({ file, onRemove, disabled }) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: "linear-gradient(to right, #f7fafc, #ffffff)",
      border: "1px solid #e2e8f0",
      borderRadius: "12px",
      padding: "20px",
      transition: "all 0.2s ease",
      boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "15px", flex: 1, minWidth: 0 }}>
        <div style={{
          width: "48px",
          height: "48px",
          background: "#fee2e2",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0
        }}>
          <File size={24} color="#dc2626" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: "14px",
            fontWeight: "600",
            color: "#1a202c",
            margin: "0 0 4px 0",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}>
            {file.name}
          </p>
          <p style={{
            fontSize: "12px",
            color: "#718096",
            margin: "0"
          }}>
            {formatFileSize(file.size)}
          </p>
        </div>
      </div>
      <button
        onClick={onRemove}
        disabled={disabled}
        style={{
          background: "transparent",
          border: "none",
          padding: "8px",
          borderRadius: "8px",
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "background 0.2s ease",
          flexShrink: 0,
          marginLeft: "15px"
        }}
        onMouseEnter={(e) => !disabled && (e.currentTarget.style.background = "#fee2e2")}
        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
      >
        <XCircle size={24} color="#ef4444" />
      </button>
    </div>
  );
};

// Main Component
export default function PDFUpload() {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFiles = (selectedFiles) => {
    if (selectedFiles.length > 3) {
      alert("You can only upload 3 PDF files.");
      return;
    }

    setFiles(selectedFiles);

    if (selectedFiles.length === 3) {
      setIsProcessing(true);
      
      selectedFiles.forEach((file) => {
        const fileURL = URL.createObjectURL(file);
        const link = document.createElement("a");
        link.href = fileURL;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(fileURL);
      });

      setTimeout(() => {
        alert("Files downloaded! Redirecting to main...");
        setIsProcessing(false);
      }, 1000);
    }
  };

  const handleUpload = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      file => file.type === "application/pdf"
    );
    
    handleFiles(droppedFiles);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <PageContainer>
      <Card>
        <Header>
          <IconCircle background="#e3f2fd">
            <Upload size={40} color="#667eea" />
          </IconCircle>
          <Title>Upload PDF Files</Title>
          <Subtitle>Select or drag and drop up to 3 PDF files</Subtitle>
        </Header>

        <UploadArea
          isDragging={isDragging}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          disabled={isProcessing}
        >
          <input
            type="file"
            accept="application/pdf"
            multiple
            onChange={handleUpload}
            style={{ display: "none" }}
            id="file-upload"
            disabled={isProcessing}
          />
          
          <label htmlFor="file-upload" style={{ cursor: isProcessing ? "not-allowed" : "pointer" }}>
            <UploadButton>
              <Upload size={48} color="#ffffff" />
            </UploadButton>
            <p style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#2d3748",
              marginBottom: "8px"
            }}>
              Choose files or drag them here
            </p>
            <p style={{
              fontSize: "14px",
              color: "#718096",
              margin: "0"
            }}>
              PDF files only, max 3 files
            </p>
          </label>
        </UploadArea>

        <ProgressBar>
          <ProgressDots count={files.length} />
          
          {files.length === 3 && (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#10b981"
            }}>
              <CheckCircle size={20} />
              <span style={{
                fontSize: "14px",
                fontWeight: "700"
              }}>
                Ready!
              </span>
            </div>
          )}
        </ProgressBar>

        {files.length > 0 && (
          <div style={{ marginTop: "30px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {files.map((file, index) => (
              <FileItem
                key={index}
                file={file}
                onRemove={() => removeFile(index)}
                disabled={isProcessing}
              />
            ))}
          </div>
        )}

        {isProcessing && (
          <div style={{
            marginTop: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            color: "#667eea"
          }}>
            <Download size={20} style={{ animation: "bounce 1s infinite" }} />
            <span style={{
              fontSize: "14px",
              fontWeight: "600"
            }}>
              Processing downloads...
            </span>
          </div>
        )}

        <style>{`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
        `}</style>
      </Card>
    </PageContainer>
  );
}