import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Upload, File, CheckCircle, XCircle, Loader, AlertCircle } from "lucide-react";

// ─── Config ───────────────────────────────────────────────────────────────────

const MAX_FILES = 3;
const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const UPLOAD_ENDPOINT = `${API_BASE}/api/files/upload`;

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

const getFileNameWithoutExt = (name) => name.replace(/\.[^/.]+$/, "");

const uploadFileToBackend = async (file, title, description) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", title);
  formData.append("description", description);

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

const FileItem = ({ entry, index, onRemove, onUpdateMeta, disabled }) => {
  const { file, status, cloudinaryUrl, errorMsg, title, description } = entry;

  const isUploading = status === "uploading";
  const isSuccess = status === "success";
  const isError = status === "error";
  const isIdle = status === "idle";

  return (
    <div style={{
      background: "#fff",
      border: `1.5px solid ${isSuccess ? "#86efac" : isError ? "#fca5a5" : isUploading ? "#fde68a" : "#e2e8f0"}`,
      borderRadius: "16px",
      overflow: "hidden",
      transition: "border-color 0.3s",
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
    }}>
      {/* File Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "16px 20px",
        background: isSuccess ? "#f0fdf4" : isError ? "#fff1f2" : isUploading ? "#fffbeb" : "#f8fafc",
        borderBottom: (isIdle || isError) ? "1px solid #f1f5f9" : "none"
      }}>
        <div style={{
          width: "42px", height: "42px",
          background: isSuccess ? "#dcfce7" : isError ? "#fee2e2" : isUploading ? "#fef9c3" : "#e0e7ff",
          borderRadius: "10px",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0
        }}>
          {isUploading
            ? <Loader size={20} color="#ca8a04" style={{ animation: "spin 1s linear infinite" }} />
            : isSuccess
              ? <CheckCircle size={20} color="#16a34a" />
              : isError
                ? <AlertCircle size={20} color="#dc2626" />
                : <File size={20} color="#667eea" />
          }
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: "14px", fontWeight: "600", color: "#1a202c",
            margin: "0 0 2px 0",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
          }}>
            {file.name}
          </p>
          <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>
            {formatFileSize(file.size)}
            {isUploading && " · Uploading…"}
            {isSuccess && " · Uploaded successfully"}
            {isError && ` · ${errorMsg || "Upload failed"}`}
          </p>
        </div>

        <button
          onClick={() => onRemove(index)}
          disabled={disabled || isUploading}
          style={{
            background: "transparent", border: "none", padding: "6px",
            borderRadius: "8px", cursor: (disabled || isUploading) ? "not-allowed" : "pointer",
            opacity: isUploading ? 0.4 : 1, flexShrink: 0
          }}
        >
          <XCircle size={20} color="#ef4444" />
        </button>
      </div>

      {/* Title + Description fields — only when idle or error */}
      {(isIdle || isError) && (
        <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* Title */}
          <div>
            <label style={{
              fontSize: "11px", fontWeight: "700", color: "#64748b",
              textTransform: "uppercase", letterSpacing: "0.05em",
              display: "block", marginBottom: "6px"
            }}>
              Title <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="text"
              placeholder="Enter a title for this file"
              value={title}
              onChange={e => onUpdateMeta(index, "title", e.target.value)}
              disabled={disabled}
              style={{
                width: "100%",
                padding: "10px 14px",
                border: `1.5px solid ${title.trim() ? "#c7d2fe" : "#e2e8f0"}`,
                borderRadius: "10px",
                fontSize: "14px",
                color: "#1a202c",
                background: "#fff",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s",
                fontFamily: "inherit"
              }}
              onFocus={e => e.target.style.borderColor = "#667eea"}
              onBlur={e => e.target.style.borderColor = title.trim() ? "#c7d2fe" : "#e2e8f0"}
            />
          </div>

          {/* Description */}
          <div>
            <label style={{
              fontSize: "11px", fontWeight: "700", color: "#64748b",
              textTransform: "uppercase", letterSpacing: "0.05em",
              display: "block", marginBottom: "6px"
            }}>
              Description <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <textarea
              placeholder="Briefly describe what this file is about"
              value={description}
              onChange={e => onUpdateMeta(index, "description", e.target.value)}
              disabled={disabled}
              rows={2}
              style={{
                width: "100%",
                padding: "10px 14px",
                border: `1.5px solid ${description.trim() ? "#c7d2fe" : "#e2e8f0"}`,
                borderRadius: "10px",
                fontSize: "14px",
                color: "#1a202c",
                background: "#fff",
                outline: "none",
                resize: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s",
                fontFamily: "inherit",
                lineHeight: "1.5"
              }}
              onFocus={e => e.target.style.borderColor = "#667eea"}
              onBlur={e => e.target.style.borderColor = description.trim() ? "#c7d2fe" : "#e2e8f0"}
            />
          </div>

          {/* Helper text */}
          {(!title.trim() || !description.trim()) && (
            <p style={{ fontSize: "12px", color: "#f59e0b", margin: 0, display: "flex", alignItems: "center", gap: "6px" }}>
              <AlertCircle size={13} />
              Fill in both fields to enable upload
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function PDFUpload() {
  const navigate = useNavigate();
  const location = useLocation();
  const targetDoc = location.state?.doc;

  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
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
      const fresh = valid.filter(f => !existing.has(f.name));
      const slots = MAX_FILES - prev.length;

      if (slots <= 0) { setLimitWarning(true); return prev; }
      if (fresh.length > slots) setLimitWarning(true);
      else setLimitWarning(false);

      return [
        ...prev,
        ...fresh.slice(0, slots).map(f => ({
          file: f,
          status: "idle",
          cloudinaryUrl: null,
          errorMsg: null,
          title: getFileNameWithoutExt(f.name), // ← pre-fill with filename
          description: "",
        }))
      ];
    });

    if (inputRef.current) inputRef.current.value = "";
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setLimitWarning(false);
  };

  const updateMeta = (index, field, value) => {
    setFiles(prev => prev.map((e, i) => i === index ? { ...e, [field]: value } : e));
  };

  // ── Upload all ─────────────────────────────────────────────────────────────
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
          const url = await uploadFileToBackend(entry.file, entry.title, entry.description);
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

  // ── Redirect after all done ────────────────────────────────────────────────
  useEffect(() => {
    if (!allDone) return;
    if (!targetDoc) return;

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
        if (!data.downloadToken) throw new Error("No token received");

        navigate(`/download/${targetDoc._id}`, {
          state: { doc: targetDoc, downloadToken: data.downloadToken },
        });
      } catch (err) {
        setIsRedirecting(false);
        alert("Uploads successful but could not unlock download. Please try again.");
      }
    };

    const timer = setTimeout(requestToken, 1000);
    return () => clearTimeout(timer);
  }, [files]);

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => { e.preventDefault(); setIsDragging(false); addFiles(e.dataTransfer.files); };

  // ── Derived ────────────────────────────────────────────────────────────────
  const totalFiles = files.length;
  const successCount = files.filter(e => e.status === "success").length;
  const uploadingCount = files.filter(e => e.status === "uploading").length;
  const allDone = totalFiles === MAX_FILES && successCount === MAX_FILES;
  const hasErrors = !isUploading && files.some(e => e.status === "error");
  const atMax = totalFiles >= MAX_FILES;

  // All pending files must have title + description filled
  const allMetaFilled = files
    .filter(e => e.status === "idle" || e.status === "error")
    .every(e => e.title.trim() && e.description.trim());

  const uploadableCount = files.filter(e => e.status === "idle" || e.status === "error").length;
  const canUpload = totalFiles === MAX_FILES && uploadableCount > 0 && !isUploading && allMetaFilled;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px"
    }}>
      <div style={{
        width: "100%", maxWidth: "680px",
        background: "#ffffff",
        borderRadius: "24px",
        boxShadow: "0 24px 64px rgba(0,0,0,0.3)",
        padding: "40px"
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: "72px", height: "72px",
            background: "linear-gradient(135deg, #e0e7ff, #ede9fe)",
            borderRadius: "50%", marginBottom: "16px"
          }}>
            <Upload size={36} color="#667eea" />
          </div>
          <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#1a202c", margin: "0 0 8px" }}>
            Upload Files
          </h2>
          <p style={{ fontSize: "15px", color: "#718096", margin: 0 }}>
            {targetDoc
              ? <>Uploading to unlock: <strong>{targetDoc.title}</strong></>
              : "Select 3 files, add details, then upload (Max Size 10MB)"
            }
          </p>
        </div>

        {/* Drop Zone */}
        {!atMax && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
              border: `2.5px dashed ${isDragging ? "#667eea" : "#cbd5e0"}`,
              borderRadius: "16px",
              padding: "48px 20px",
              textAlign: "center",
              background: isDragging ? "#f0f4ff" : "#fafafa",
              transition: "all 0.3s ease",
              cursor: isUploading ? "not-allowed" : "pointer",
              opacity: isUploading ? 0.6 : 1,
              marginBottom: "24px"
            }}
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
              <div style={{
                width: "80px", height: "80px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 16px",
                boxShadow: "0 8px 24px rgba(102,126,234,0.4)"
              }}>
                <Upload size={40} color="#fff" />
              </div>
              <p style={{ fontSize: "17px", fontWeight: "600", color: "#2d3748", marginBottom: "6px" }}>
                Choose files or drag them here
              </p>
              <p style={{ fontSize: "13px", color: "#94a3b8", margin: 0 }}>
                PDF, DOC, XLS, PPT, Images · {MAX_FILES - totalFiles} slot{MAX_FILES - totalFiles !== 1 ? "s" : ""} remaining
              </p>
            </label>
          </div>
        )}

        {/* Limit warning */}
        {limitWarning && (
          <div style={{
            display: "flex", alignItems: "center", gap: "10px",
            background: "#fff7ed", border: "1px solid #fed7aa",
            borderRadius: "10px", padding: "12px 16px", marginBottom: "16px"
          }}>
            <AlertCircle size={16} color="#ea580c" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: "13px", color: "#ea580c", margin: 0, fontWeight: 600 }}>
              Maximum {MAX_FILES} files allowed.
            </p>
          </div>
        )}

        {/* Progress */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "#f8fafc", borderRadius: "12px", padding: "16px 20px",
          border: "1px solid #e2e8f0", marginBottom: "24px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ display: "flex", gap: "8px" }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: "12px", height: "12px", borderRadius: "50%",
                  background: i < successCount
                    ? "#16a34a"
                    : i < totalFiles
                      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                      : "#e2e8f0",
                  transition: "all 0.3s ease",
                  boxShadow: i < totalFiles ? "0 2px 6px rgba(102,126,234,0.3)" : "none"
                }} />
              ))}
            </div>
            <span style={{ fontSize: "14px", fontWeight: "600", color: "#2d3748" }}>
              {totalFiles}/{MAX_FILES} selected · {successCount} uploaded
            </span>
          </div>

          {isRedirecting ? (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#667eea" }}>
              <Loader size={16} style={{ animation: "spin 1s linear infinite" }} />
              <span style={{ fontSize: "13px", fontWeight: "700" }}>Unlocking…</span>
            </div>
          ) : allDone ? (
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#16a34a" }}>
              <CheckCircle size={18} />
              <span style={{ fontSize: "13px", fontWeight: "700" }}>All done!</span>
            </div>
          ) : totalFiles === MAX_FILES && allMetaFilled ? (
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#667eea" }}>
              <CheckCircle size={18} />
              <span style={{ fontSize: "13px", fontWeight: "700" }}>Ready to upload!</span>
            </div>
          ) : totalFiles === MAX_FILES && !allMetaFilled ? (
            <span style={{ fontSize: "13px", color: "#f59e0b", fontWeight: "600" }}>
              Fill in all details
            </span>
          ) : null}
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600" }}>
                UPLOADED FILES
              </span>
              <button
                onClick={() => { setFiles([]); setLimitWarning(false); }}
                disabled={isUploading || isRedirecting}
                style={{
                  background: "none", border: "none", color: "#94a3b8",
                  fontSize: "12px", cursor: (isUploading || isRedirecting) ? "not-allowed" : "pointer",
                  textDecoration: "underline", fontFamily: "inherit"
                }}
              >
                Clear all
              </button>
            </div>

            {files.map((entry, index) => (
              <FileItem
                key={entry.file.name + index}
                entry={entry}
                index={index}
                onRemove={removeFile}
                onUpdateMeta={updateMeta}
                disabled={isUploading || isRedirecting}
              />
            ))}

            {/* Add more */}
            {!atMax && (
              <button
                onClick={() => !isUploading && inputRef.current?.click()}
                disabled={isUploading}
                style={{
                  background: "transparent", border: "2px dashed #cbd5e0",
                  borderRadius: "12px", padding: "14px", color: "#94a3b8",
                  fontSize: "14px", fontWeight: "600",
                  cursor: isUploading ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease", display: "flex",
                  alignItems: "center", justifyContent: "center", gap: "8px",
                  fontFamily: "inherit"
                }}
                onMouseEnter={e => { if (!isUploading) { e.currentTarget.style.borderColor = "#667eea"; e.currentTarget.style.color = "#667eea"; }}}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#cbd5e0"; e.currentTarget.style.color = "#94a3b8"; }}
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
            width: "100%", padding: "16px",
            background: (canUpload && !isRedirecting)
              ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              : "#e2e8f0",
            color: (canUpload && !isRedirecting) ? "#fff" : "#a0aec0",
            border: "none", borderRadius: "14px",
            fontSize: "16px", fontWeight: "700",
            cursor: (canUpload && !isRedirecting) ? "pointer" : "not-allowed",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
            boxShadow: (canUpload && !isRedirecting) ? "0 8px 24px rgba(102,126,234,0.4)" : "none",
            transition: "all 0.3s ease", fontFamily: "inherit"
          }}
        >
          {isRedirecting ? (
            <><Loader size={20} style={{ animation: "spin 1s linear infinite" }} /> Unlocking your download…</>
          ) : isUploading ? (
            <><Loader size={20} style={{ animation: "spin 1s linear infinite" }} /> Uploading {uploadingCount} file{uploadingCount !== 1 ? "s" : ""}…</>
          ) : totalFiles < MAX_FILES ? (
            <><Upload size={20} /> Select {MAX_FILES - totalFiles} more file{MAX_FILES - totalFiles !== 1 ? "s" : ""}</>
          ) : !allMetaFilled ? (
            <><AlertCircle size={20} /> Fill in all titles and descriptions</>
          ) : (
            <><Upload size={20} /> Upload {uploadableCount} file{uploadableCount !== 1 ? "s" : ""}</>
          )}
        </button>

        {hasErrors && (
          <p style={{ textAlign: "center", fontSize: "13px", color: "#e53e3e", marginTop: "12px" }}>
            Some uploads failed. Fix the details and click Upload again to retry.
          </p>
        )}

        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
          textarea { font-family: inherit; }
        `}</style>
      </div>
    </div>
  );
}