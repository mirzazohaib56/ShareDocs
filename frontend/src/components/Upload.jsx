import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Upload, File, CheckCircle, XCircle, Loader, AlertCircle } from "lucide-react";

// ─── Styled Components ────────────────────────────────────────────────────────

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
  <div style={{ textAlign: "center", marginBottom: "40px" }}>
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
    background,
    borderRadius: "50%",
    marginBottom: "20px"
  }}>
    {children}
  </div>
);

const Title = ({ children }) => (
  <h2 style={{ fontSize: "32px", fontWeight: "700", color: "#1a202c", marginBottom: "10px" }}>
    {children}
  </h2>
);

const Subtitle = ({ children }) => (
  <p style={{ fontSize: "16px", color: "#718096", margin: "0" }}>
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MAX_FILES = 3;

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];

const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

const STATUS_STYLE = {
  idle:      { bg: "#fee2e2", iconColor: "#dc2626" },
  uploading: { bg: "#fef9c3", iconColor: "#ca8a04" },
  success:   { bg: "#dcfce7", iconColor: "#16a34a" },
  error:     { bg: "#fee2e2", iconColor: "#dc2626" },
};

// ─── Config ───────────────────────────────────────────────────────────────────

const API_BASE        = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const UPLOAD_ENDPOINT = `${API_BASE}/api/files/upload`;

const uploadFileToBackend = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(UPLOAD_ENDPOINT, {
    method: "POST",
    body: formData,
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Upload failed (${res.status})`);
  }

  const data = await res.json();
  return data.url;
};

// ─── FileItem ─────────────────────────────────────────────────────────────────

const FileItem = ({ file, status, cloudinaryUrl, errorMsg, onRemove, disabled }) => {
  const { bg, iconColor } = STATUS_STYLE[status] || STATUS_STYLE.idle;

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: "linear-gradient(to right, #f7fafc, #ffffff)",
      border: "1px solid #e2e8f0",
      borderRadius: "12px",
      padding: "20px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "15px", flex: 1, minWidth: 0 }}>
        <div style={{
          width: "48px", height: "48px",
          background: bg,
          borderRadius: "10px",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0
        }}>
          {status === "uploading"
            ? <Loader size={24} color={iconColor} style={{ animation: "spin 1s linear infinite" }} />
            : <File size={24} color={iconColor} />
          }
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: "14px", fontWeight: "600", color: "#1a202c",
            margin: "0 0 4px 0",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
          }}>
            {file.name}
          </p>
          <p style={{ fontSize: "12px", color: "#718096", margin: 0 }}>
            {formatFileSize(file.size)}
          </p>

          {status === "uploading" && (
            <p style={{ fontSize: "11px", color: "#ca8a04", margin: "4px 0 0", fontWeight: 600 }}>
              Uploading to Cloudinary…
            </p>
          )}
          {status === "success" && cloudinaryUrl && (
            <a
              href={cloudinaryUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "11px", color: "#16a34a", margin: "4px 0 0",
                display: "block", fontWeight: 600, textDecoration: "underline",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
              }}
            >
              ✓ Uploaded · View on Cloudinary
            </a>
          )}
          {status === "error" && (
            <p style={{ fontSize: "11px", color: "#dc2626", margin: "4px 0 0", fontWeight: 600 }}>
              ✕ {errorMsg || "Upload failed — click Upload to retry"}
            </p>
          )}
        </div>
      </div>

      <button
        onClick={onRemove}
        disabled={disabled || status === "uploading"}
        style={{
          background: "transparent", border: "none", padding: "8px",
          borderRadius: "8px",
          cursor: (disabled || status === "uploading") ? "not-allowed" : "pointer",
          flexShrink: 0, marginLeft: "15px",
          opacity: status === "uploading" ? 0.4 : 1,
          transition: "background 0.2s"
        }}
        onMouseEnter={e => { if (status !== "uploading" && !disabled) e.currentTarget.style.background = "#fee2e2"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
      >
        <XCircle size={24} color="#ef4444" />
      </button>
    </div>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function PDFUpload() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const targetDoc  = location.state?.doc; // set when user came from Main via "Upload to Unlock"

  const [files, setFiles]               = useState([]);
  const [isDragging, setIsDragging]     = useState(false);
  const [isUploading, setIsUploading]   = useState(false);
  const [limitWarning, setLimitWarning] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const inputRef = useRef(null);

  // ── Add files ──────────────────────────────────────────────────────────────
  const addFiles = (incoming) => {
    const valid = Array.from(incoming).filter(
      f => ALLOWED_TYPES.includes(f.type) || f.type.startsWith("image/")
    );
    if (!valid.length) return;

    setFiles(prev => {
      const existing = new Set(prev.map(e => e.file.name));
      const fresh    = valid.filter(f => !existing.has(f.name));
      const slots    = MAX_FILES - prev.length;

      if (slots <= 0) { setLimitWarning(true); return prev; }
      if (fresh.length > slots) setLimitWarning(true);
      else setLimitWarning(false);

      return [
        ...prev,
        ...fresh.slice(0, slots).map(f => ({
          file: f, status: "idle", cloudinaryUrl: null, errorMsg: null
        }))
      ];
    });

    if (inputRef.current) inputRef.current.value = "";
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setLimitWarning(false);
  };

  // ── Upload all pending files ───────────────────────────────────────────────
  const handleUploadAll = async () => {
    const pending = files.filter(e => e.status === "idle" || e.status === "error");
    if (!pending.length) return;

    setIsUploading(true);

    await Promise.all(
      pending.map(async (entry) => {
        setFiles(prev => prev.map(e =>
          e.file.name === entry.file.name
            ? { ...e, status: "uploading", errorMsg: null }
            : e
        ));

        try {
          const url = await uploadFileToBackend(entry.file);
          setFiles(prev => prev.map(e =>
            e.file.name === entry.file.name
              ? { ...e, status: "success", cloudinaryUrl: url }
              : e
          ));
        } catch (err) {
          setFiles(prev => prev.map(e =>
            e.file.name === entry.file.name
              ? { ...e, status: "error", errorMsg: err.message }
              : e
          ));
        }
      })
    );

    setIsUploading(false);
  };

  // ── When all 3 done → request download token → redirect ───────────────────
  useEffect(() => {
    if (!allDone) return;
    if (!targetDoc) return; // user uploaded without a target doc, do nothing

    const requestToken = async () => {
      setIsRedirecting(true);
      try {
        const res = await fetch(`${API_BASE}/api/files/download-token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ fileId: targetDoc._id }),
        });

        const data = await res.json();
        console.log("token response:", data); // 👈 add this
    console.log("targetDoc:", targetDoc); // 👈 add this
        if (!data.downloadToken) throw new Error("No token received");

        navigate(`/download/${targetDoc._id}`, {
          state: { doc: targetDoc, downloadToken: data.downloadToken },
        });
      } catch (err) {
        setIsRedirecting(false);
        alert("Uploads successful but could not unlock download. Please try again.");
      }
    };

    // 1s delay so user sees the "All uploaded!" state before redirect
    const timer = setTimeout(requestToken, 1000);
    return () => clearTimeout(timer);
  }, [files]); // runs whenever files state changes

  const handleDragOver  = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop      = (e) => { e.preventDefault(); setIsDragging(false); addFiles(e.dataTransfer.files); };

  // ── Derived ────────────────────────────────────────────────────────────────
  const totalFiles      = files.length;
  const uploadableCount = files.filter(e => e.status === "idle" || e.status === "error").length;
  const uploadingCount  = files.filter(e => e.status === "uploading").length;
  const successCount    = files.filter(e => e.status === "success").length;
  const allDone         = totalFiles === MAX_FILES && successCount === MAX_FILES;
  const hasErrors       = !isUploading && files.some(e => e.status === "error");
  const atMax           = totalFiles >= MAX_FILES;
  const canUpload       = totalFiles === MAX_FILES && uploadableCount > 0 && !isUploading;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <PageContainer>
      <Card>
        <Header>
          <IconCircle background="#e3f2fd">
            <Upload size={40} color="#667eea" />
          </IconCircle>
          <Title>Upload Files</Title>
          <Subtitle>
            {targetDoc
              ? <>Uploading to unlock: <strong>{targetDoc.title}</strong></>
              : "Select exactly 3 files to upload"
            }
          </Subtitle>
        </Header>

        {/* Drop Zone — hidden once 3 files are selected */}
        {!atMax && (
          <UploadArea
            isDragging={isDragging}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            disabled={isUploading}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,image/*"
              multiple
              onChange={e => addFiles(e.target.files)}
              style={{ display: "none" }}
              id="file-upload"
              disabled={isUploading}
            />
            <label htmlFor="file-upload" style={{ cursor: isUploading ? "not-allowed" : "pointer" }}>
              <UploadButton>
                <Upload size={48} color="#ffffff" />
              </UploadButton>
              <p style={{ fontSize: "18px", fontWeight: "600", color: "#2d3748", marginBottom: "8px" }}>
                Choose files or drag them here
              </p>
              <p style={{ fontSize: "14px", color: "#718096", margin: "0" }}>
                PDF, DOC, XLS, PPT, Images · {MAX_FILES - totalFiles} slot{MAX_FILES - totalFiles !== 1 ? "s" : ""} remaining
              </p>
            </label>
          </UploadArea>
        )}

        {/* Over-limit warning */}
        {limitWarning && (
          <div style={{
            marginTop: "16px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "#fff7ed",
            border: "1px solid #fed7aa",
            borderRadius: "10px",
            padding: "12px 16px"
          }}>
            <AlertCircle size={18} color="#ea580c" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: "13px", color: "#ea580c", margin: 0, fontWeight: 600 }}>
              Maximum {MAX_FILES} files allowed. Remove a file to add a different one.
            </p>
          </div>
        )}

        {/* Progress Row */}
        <ProgressBar>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <div style={{ display: "flex", gap: "8px" }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: "14px", height: "14px", borderRadius: "50%",
                  background: i < totalFiles
                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    : "#e2e8f0",
                  transform: i < totalFiles ? "scale(1.2)" : "scale(1)",
                  transition: "all 0.3s ease",
                  boxShadow: i < totalFiles ? "0 2px 8px rgba(102,126,234,0.4)" : "none"
                }} />
              ))}
            </div>
            <span style={{ fontSize: "14px", fontWeight: "600", color: "#2d3748" }}>
              {totalFiles}/{MAX_FILES} files selected
              {successCount > 0 && ` · ${successCount} uploaded`}
            </span>
          </div>

          {isRedirecting ? (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#667eea" }}>
              <Loader size={18} style={{ animation: "spin 1s linear infinite" }} />
              <span style={{ fontSize: "14px", fontWeight: "700" }}>Unlocking…</span>
            </div>
          ) : allDone ? (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#10b981" }}>
              <CheckCircle size={20} />
              <span style={{ fontSize: "14px", fontWeight: "700" }}>All uploaded!</span>
            </div>
          ) : totalFiles === MAX_FILES && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#667eea" }}>
              <CheckCircle size={20} />
              <span style={{ fontSize: "14px", fontWeight: "700" }}>Ready!</span>
            </div>
          )}
        </ProgressBar>

        {/* File List */}
        {files.length > 0 && (
          <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", color: "#a0aec0" }}>
                Remove a file to swap it out
              </span>
              <button
                onClick={() => { setFiles([]); setLimitWarning(false); }}
                disabled={isUploading || isRedirecting}
                style={{
                  background: "none", border: "none", color: "#a0aec0",
                  fontSize: "12px", cursor: (isUploading || isRedirecting) ? "not-allowed" : "pointer",
                  textDecoration: "underline"
                }}
              >
                Clear all
              </button>
            </div>

            {files.map((entry, index) => (
              <FileItem
                key={entry.file.name + index}
                file={entry.file}
                status={entry.status}
                cloudinaryUrl={entry.cloudinaryUrl}
                errorMsg={entry.errorMsg}
                onRemove={() => removeFile(index)}
                disabled={isUploading || isRedirecting}
              />
            ))}

            {/* Add More — only shown when below max */}
            {!atMax && (
              <button
                onClick={() => !isUploading && inputRef.current?.click()}
                disabled={isUploading}
                style={{
                  background: "transparent",
                  border: "2px dashed #cbd5e0",
                  borderRadius: "12px",
                  padding: "14px",
                  color: "#a0aec0",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: isUploading ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}
                onMouseEnter={e => { if (!isUploading) { e.currentTarget.style.borderColor = "#667eea"; e.currentTarget.style.color = "#667eea"; }}}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#cbd5e0"; e.currentTarget.style.color = "#a0aec0"; }}
              >
                + Add more files ({MAX_FILES - totalFiles} remaining)
              </button>
            )}
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUploadAll}
          disabled={!canUpload || isRedirecting}
          style={{
            marginTop: "30px",
            width: "100%",
            padding: "16px",
            background: (canUpload && !isRedirecting)
              ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              : "#e2e8f0",
            color: (canUpload && !isRedirecting) ? "#fff" : "#a0aec0",
            border: "none",
            borderRadius: "12px",
            fontSize: "16px",
            fontWeight: "700",
            cursor: (canUpload && !isRedirecting) ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            boxShadow: (canUpload && !isRedirecting) ? "0 8px 24px rgba(102,126,234,0.4)" : "none",
            transition: "all 0.3s ease"
          }}
        >
          {isRedirecting ? (
            <>
              <Loader size={20} style={{ animation: "spin 1s linear infinite" }} />
              Unlocking your download…
            </>
          ) : isUploading ? (
            <>
              <Loader size={20} style={{ animation: "spin 1s linear infinite" }} />
              Uploading {uploadingCount} file{uploadingCount !== 1 ? "s" : ""}…
            </>
          ) : totalFiles < MAX_FILES ? (
            <>
              <Upload size={20} />
              Select {MAX_FILES - totalFiles} more file{MAX_FILES - totalFiles !== 1 ? "s" : ""} to enable upload
            </>
          ) : (
            <>
              <Upload size={20} />
              Upload {uploadableCount} file{uploadableCount !== 1 ? "s" : ""} to Cloudinary
            </>
          )}
        </button>

        {hasErrors && (
          <p style={{ textAlign: "center", fontSize: "13px", color: "#e53e3e", marginTop: "12px" }}>
            Some uploads failed. Click Upload again to retry failed files.
          </p>
        )}

        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
        `}</style>
      </Card>
    </PageContainer>
  );
}