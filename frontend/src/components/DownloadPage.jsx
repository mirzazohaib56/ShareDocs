import { useEffect, useState, useRef  } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Download, Loader, ArrowLeft, Lock } from "lucide-react";

/**
 * DownloadPage
 *
 * Reached via: navigate(`/download/${doc._id}`, { state: { doc } })
 *
 * Current flow  : Upload 3 files → redirect here → auto-download starts
 * Future flow   : Stripe payment → redirect here with ?session_id=xxx → verify → download
 *
 * Add this route in your router:
 *   <Route path="/download/:fileId" element={<DownloadPage />} />
 */

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// ── Helpers ───────────────────────────────────────────────────────────────────

const FILE_TYPE_LABEL = {
  "application/pdf": "PDF",
  "application/msword": "DOC",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
  "application/vnd.ms-excel": "XLS",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "XLSX",
  "application/vnd.ms-powerpoint": "PPT",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "PPTX",
};

const getTypeLabel = (mimeType) => {
  if (!mimeType) return "FILE";
  if (mimeType.startsWith("image/")) return "IMAGE";
  return FILE_TYPE_LABEL[mimeType] || "FILE";
};

const getFileEmoji = (mimeType) => {
  if (!mimeType) return "📁";
  if (mimeType.startsWith("image/")) return "🖼️";
  if (mimeType === "application/pdf") return "📄";
  if (mimeType.includes("word")) return "📝";
  if (mimeType.includes("sheet") || mimeType.includes("excel")) return "📊";
  if (mimeType.includes("presentation") || mimeType.includes("powerpoint")) return "📋";
  return "📁";
};

const triggerDownload = async (url, filename) => {
  try {
    // Fetch as blob to force download instead of opening in new tab
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename || "download";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
  } catch {
    // Fallback if blob fetch fails (e.g. CORS)
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || "download";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function DownloadPage() {
  const { fileId } = useParams();
  const location = useLocation();
  console.log("DownloadPage state:", location.state);
  const navigate = useNavigate();

  const [doc, setDoc] = useState(location.state?.doc || null);
  const [status, setStatus] = useState("loading"); // loading | ready | downloading | done | error | premium
  const [error, setError] = useState("");
  const downloadTriggered = useRef(false);

  // ── 1. Resolve the doc (from state or fetch from API) ──────────────────────
  useEffect(() => {
    const resolveDoc = async () => {
      if (doc) {
        await checkAccessAndProceed(doc);
        return;
      }
    
      // Build query — pass whatever proof we have
      const params        = new URLSearchParams(location.search);
      const sessionId     = params.get("session_id");
      const downloadToken = location.state?.downloadToken;
    
      let query = "";
      if (sessionId)          query = `?session_id=${sessionId}`;
      else if (downloadToken) query = `?token=${downloadToken}`;
      else { setStatus("blocked"); return; }
    
      try {
        const res = await fetch(`${API_BASE}/api/files/${fileId}${query}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!res.ok) { setStatus("blocked"); return; }
        const data = await res.json();
        setDoc(data);
        await checkAccessAndProceed(data);
      } catch (err) {
        setError(err.message);
        setStatus("error");
      }
    };

    resolveDoc();
  }, [fileId]);

  // ── 2. Check access ────────────────────────────────────────────────────────
  //
  // Current: anyone who lands here (after upload) gets access → "ready"
  //
  // For Stripe: check query param ?session_id=xxx, verify with your backend
  // e.g. GET /api/stripe/verify-session?session_id=xxx → { valid: true }
  // If valid → "ready", else → "premium"
  //
  const checkAccessAndProceed = async (resolvedDoc) => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");        // Stripe (future)
    const downloadToken = location.state?.downloadToken;   // Upload unlock (current)

    console.log("sessionId:", sessionId);
  console.log("downloadToken:", downloadToken);
  console.log("status will be:", sessionId ? "stripe" : downloadToken ? "upload" : "blocked");

    // ── Stripe flow (future) ──────────────────────────────────────────────────
    if (sessionId) {
      try {
        const res = await fetch(`${API_BASE}/api/stripe/verify-session?session_id=${sessionId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        data.valid ? startDownload(resolvedDoc) : setStatus("premium");
      } catch {
        setStatus("premium");
      }
      return;
    }

    // ── No token at all — block immediately ───────────────────────────────────
    if (!downloadToken) {
      setStatus("blocked");
      return;
    }

    // ── Verify upload unlock token ────────────────────────────────────────────
    try {
      const res = await fetch(
        `${API_BASE}/api/files/download-token/verify?token=${downloadToken}&fileId=${resolvedDoc._id}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      const data = await res.json();
      data.valid ? startDownload(resolvedDoc) : setStatus("blocked");
    } catch {
      setStatus("blocked");
    }
  };
  // ── 3. Trigger the actual download ─────────────────────────────────────────
  const startDownload = async (resolvedDoc) => {
    if (downloadTriggered.current) return; // ← guard
    downloadTriggered.current = true;
  
    setStatus("downloading");
    const fileUrl = resolvedDoc.url;
    const filename = resolvedDoc.title || "download";
  
    if (!fileUrl) {
      setError("No file URL available.");
      setStatus("error");
      return;
    }
  
    await triggerDownload(fileUrl, filename);
    setTimeout(() => setStatus("done"), 1500);
  };

  const handleRetry = () => {
    if (doc) startDownload(doc);
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Back */}
        <button onClick={() => navigate("/dashboard")} style={styles.backBtn}>
          <ArrowLeft size={16} /> Back to Documents
        </button>

        {/* Loading */}
        {status === "loading" && (
          <div style={styles.center}>
            <Loader size={48} color="#1abc9c" style={{ animation: "spin 1s linear infinite" }} />
            <p style={styles.statusText}>Preparing your download…</p>
          </div>
        )}
        {/* Status Blocked */}
        {status === "blocked" && (
          <div style={styles.center}>
            <div style={styles.iconCircle("#fee2e2")}>
              <Lock size={40} color="#dc2626" />
            </div>
            <h2 style={styles.title}>Access Denied</h2>
            <p style={styles.subtitle}>
              You need to upload 3 files or go Premium to download.
              Direct access to this page is not allowed.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap", justifyContent: "center" }}>
              <button onClick={() => navigate("/dashboard")} style={styles.btnPrimary}>
                Go to Dashboard
              </button>
            </div>
          </div>
        )}

        {/* Downloading */}
        {status === "downloading" && doc && (
          <div style={styles.center}>
            <div style={styles.iconCircle("#dcfce7")}>
              <Download size={40} color="#16a34a" style={{ animation: "bounce 1s infinite" }} />
            </div>
            <h2 style={styles.title}>Download Started!</h2>
            <p style={styles.subtitle}>Your file is downloading…</p>
            <div style={styles.docInfo}>
              <span style={{ fontSize: 36 }}>{getFileEmoji(doc.fileType)}</span>
              <div>
                <p style={{ margin: 0, fontWeight: 700, color: "#1a202c" }}>{doc.title}</p>
                <p style={{ margin: 0, fontSize: 13, color: "#718096" }}>{getTypeLabel(doc.fileType)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Done */}
        {status === "done" && doc && (
          <div style={styles.center}>
            <div style={styles.iconCircle("#dcfce7")}>
              <CheckCircle size={40} color="#16a34a" />
            </div>
            <h2 style={styles.title}>Download Complete</h2>
            <p style={styles.subtitle}>
              <strong>{doc.title}</strong> has been downloaded successfully.
            </p>
            <div style={styles.docInfo}>
              <span style={{ fontSize: 36 }}>{getFileEmoji(doc.fileType)}</span>
              <div>
                <p style={{ margin: 0, fontWeight: 700, color: "#1a202c" }}>{doc.title}</p>
                <p style={{ margin: 0, fontSize: 13, color: "#718096" }}>{doc.description}</p>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginTop: 24 }}>
              <button onClick={handleRetry} style={styles.btnPrimary}>
                <Download size={16} /> Download Again
              </button>
              <button onClick={() => navigate("/dashboard")} style={styles.btnSecondary}>
                Browse More
              </button>
            </div>
          </div>
        )}

        {/* Error */}
        {status === "error" && (
          <div style={styles.center}>
            <div style={styles.iconCircle("#fee2e2")}>
              <span style={{ fontSize: 36 }}>⚠️</span>
            </div>
            <h2 style={styles.title}>Something went wrong</h2>
            <p style={styles.subtitle}>{error || "Could not load the file."}</p>
            <button onClick={() => navigate("/dashboard")} style={styles.btnSecondary}>
              Go Back Home
            </button>
          </div>
        )}

        {/*
          ── PREMIUM GATE (for Stripe integration) ────────────────────────────
          When Stripe is ready:
          1. Create a Checkout Session on your backend:
             POST /api/stripe/create-session → { url: "https://checkout.stripe.com/..." }
          2. Redirect user to that URL.
          3. Set success_url to: `${window.location.origin}/download/${fileId}?session_id={CHECKOUT_SESSION_ID}`
          4. This page will pick up session_id, verify, and trigger download.
        */}
        {status === "premium" && (
          <div style={styles.center}>
            <div style={styles.iconCircle("#fef9c3")}>
              <Lock size={40} color="#ca8a04" />
            </div>
            <h2 style={styles.title}>Premium Required</h2>
            <p style={styles.subtitle}>
              Upgrade to Premium to download this file, or upload 3 files to unlock it for free.
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginTop: 24 }}>
              {/* Stripe button — wire this up when ready */}
              <button
                onClick={async () => {
                  try {
                    const res = await fetch(`${API_BASE}/api/stripe/create-session`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                      },
                      body: JSON.stringify({
                        fileId,
                        successUrl: `${window.location.origin}/download/${fileId}?session_id={CHECKOUT_SESSION_ID}`,
                        cancelUrl: window.location.href,
                      }),
                    });
                    const data = await res.json();
                    if (data.url) window.location.href = data.url;
                  } catch {
                    alert("Could not start payment. Try again.");
                  }
                }}
                style={styles.btnPrimary}
              >
                ⭐ Go Premium
              </button>

              <button onClick={() => navigate("/")} style={styles.btnSecondary}>
                Upload 3 Files Instead
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin   { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
      `}</style>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: 20, fontFamily: "Arial, sans-serif",
  },
  card: {
    width: "100%", maxWidth: 520,
    background: "#fff", borderRadius: 20,
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
    padding: 40,
  },
  backBtn: {
    display: "flex", alignItems: "center", gap: 6,
    background: "none", border: "none",
    color: "#718096", fontSize: 13, cursor: "pointer",
    marginBottom: 28, padding: 0, fontWeight: 600,
  },
  center: { display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" },
  iconCircle: (bg) => ({
    width: 80, height: 80, borderRadius: "50%", background: bg,
    display: "flex", alignItems: "center", justifyContent: "center",
    marginBottom: 20,
  }),
  title: { fontSize: 26, fontWeight: 700, color: "#1a202c", marginBottom: 10 },
  subtitle: { fontSize: 15, color: "#718096", maxWidth: 360, lineHeight: 1.6 },
  statusText: { fontSize: 16, color: "#718096", marginTop: 16 },
  docInfo: {
    display: "flex", alignItems: "center", gap: 16,
    background: "#f7fafc", border: "1px solid #e2e8f0",
    borderRadius: 12, padding: "16px 20px", marginTop: 24,
    textAlign: "left", width: "100%",
  },
  btnPrimary: {
    display: "flex", alignItems: "center", gap: 8,
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff", border: "none", borderRadius: 10,
    padding: "12px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer",
    boxShadow: "0 4px 16px rgba(102,126,234,0.4)",
  },
  btnSecondary: {
    background: "#f7fafc", color: "#4a5568",
    border: "1px solid #e2e8f0", borderRadius: 10,
    padding: "12px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer",
  },
};