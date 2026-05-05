import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import CategoryBar from "../components/CategoryBar";
import { Upload, File, XCircle, Loader, CheckCircle, AlertCircle } from "lucide-react";

// ── Config ────────────────────────────────────────────────────────────────────
const API_BASE        = import.meta.env.VITE_BACKEND_URL|| "http://localhost:5000";
const UPLOAD_ENDPOINT = `${API_BASE}/api/upload`;
const FILES_ENDPOINT  = `${API_BASE}/api/files`; // GET all files from your File collection
const MAX_FILES       = 3;

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];

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
  if (mimeType.startsWith("image/")) return "IMG";
  return FILE_TYPE_LABEL[mimeType] || "FILE";
};

const getTypeBadgeColor = (mimeType) => {
  if (!mimeType) return "#6b7280";
  if (mimeType === "application/pdf") return "#dc2626";
  if (mimeType.startsWith("image/")) return "#7c3aed";
  if (mimeType.includes("word")) return "#2563eb";
  if (mimeType.includes("sheet") || mimeType.includes("excel")) return "#16a34a";
  if (mimeType.includes("presentation") || mimeType.includes("powerpoint")) return "#ea580c";
  return "#6b7280";
};

const formatFileSize = (bytes) => {
  if (!bytes) return "";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

// ── Category Data ─────────────────────────────────────────────────────────────
const categoryData = {
  Academic: [
    { title: "Foreign Language Studies", items: ["Chinese", "ESL"] },
    { title: "Science & Mathematics",    items: ["Astronomy", "Biology"] },
    { title: "Teaching Methods",         items: ["Child Education", "Philosophy"] },
  ],
  Professional: [
    { title: "Business",    items: ["Marketing", "Finance", "HR"] },
    { title: "IT & Software", items: ["Networking", "Data Science"] },
    { title: "Engineering", items: ["Electrical", "Mechanical"] },
  ],
  Culture: [
    { title: "History",     items: ["World War II", "Ancient Civilizations"] },
    { title: "Languages",   items: ["French", "Arabic"] },
    { title: "Traditions",  items: ["Festivals", "Lifestyle"] },
  ],
  Hobbies: [
    { title: "Arts & Crafts", items: ["Painting", "DIY Crafts"] },
    { title: "Sports",        items: ["Cricket", "Football"] },
    { title: "Games",         items: ["Chess", "Puzzles"] },
  ],
  PersonalGrowth: [
    { title: "Motivation", items: ["Success Tips", "Time Management"] },
    { title: "Health",     items: ["Workout", "Nutrition"] },
    { title: "Lifestyle",  items: ["Self Discipline", "Habits"] },
  ],
  AllDocuments: [
    { title: "Top Categories", items: ["Academic", "Professional", "Culture"] },
    { title: "Popular Docs",   items: ["Notes", "Guides", "E-Books"] },
    { title: "Uploads",        items: ["PDFs", "Docs", "Slides"] },
  ],
};

// ── Upload Popup ──────────────────────────────────────────────────────────────
const STATUS_STYLE = {
  idle:      { bg: "#fee2e2", iconColor: "#dc2626" },
  uploading: { bg: "#fef9c3", iconColor: "#ca8a04" },
  success:   { bg: "#dcfce7", iconColor: "#16a34a" },
  error:     { bg: "#fee2e2", iconColor: "#dc2626" },
};

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

function DownloadPopup({ doc, onClose }) {
  const navigate = useNavigate();
  const [loadingStripe, setLoadingStripe] = useState(false);

  const handlePremium = async () => {
    setLoadingStripe(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/stripe/create-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            fileId:    doc._id,
            fileTitle: doc.title,
            successUrl: `${window.location.origin}/download/${doc._id}?session_id={CHECKOUT_SESSION_ID}`,
            cancelUrl:  window.location.href,
          }),
        }
      );
      const data = await res.json();
      if (data.url) window.location.href = data.url; // redirect to Stripe
    } catch (err) {
      alert("Could not start payment. Please try again.");
    } finally {
      setLoadingStripe(false);
    }
  };

  return (
    <div style={overlayStyle}>
      <div className="bg-white rounded-4 p-4 shadow-lg" style={{ width: "100%", maxWidth: 400 }}>
        <h5 className="fw-bold mb-1">Unlock Download</h5>
        <p className="text-muted small mb-3">
          You selected: <strong>{doc?.title}</strong>
        </p>
        <p className="mb-3">Choose how you'd like to unlock:</p>

        <button
          className="btn btn-primary w-100 mb-2"
          onClick={handlePremium}
          disabled={loadingStripe}
        >
          {loadingStripe ? "Redirecting…" : "⭐ Pay $1.99 to Download"}
        </button>
        <button
          className="btn btn-outline-success w-100 mb-2"
          onClick={() => { onClose(); navigate("/upload", { state: { doc } }); }}
        >
          📤 Upload to Unlock
        </button>
        <button
          className="btn btn-outline-danger w-100"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function MainPage() {
  const navigate = useNavigate();
  const [dbFiles, setDbFiles]                   = useState([]);
  const [loading, setLoading]                   = useState(true);
  const [searchText, setSearchText]             = useState("");
  const [searchResults, setSearchResults]       = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [uploadPopupDoc, setUploadPopupDoc]     = useState(null); // the doc user clicked

  // Fetch files from DB
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await fetch(FILES_ENDPOINT, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        // expects array of file objects from your File schema
        setDbFiles(Array.isArray(data) ? data : data.files || []);
      } catch (err) {
        console.error("Failed to fetch files:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, []);

  const handleSearch = (text) => {
    setSearchText(text);
    const trimmed = text.trim().toLowerCase();
    if (!trimmed) { setSearchResults([]); return; }
    setSearchResults(dbFiles.filter(d => d.title?.toLowerCase().includes(trimmed)));
  };

  const filteredDocs = dbFiles.filter((doc) => {
    if (!selectedCategory) return true;
    if (!selectedSubcategory) return doc.category === selectedCategory;
    return doc.subcategory === selectedSubcategory;
  });

  const docsToShow = searchText.trim() ? searchResults : filteredDocs;

  const sectionTitle = searchText.trim()
    ? `Search results for "${searchText}"`
    : selectedSubcategory ? `📂 ${selectedSubcategory}`
    : selectedCategory    ? `📁 ${selectedCategory}`
    : "🔥 Popular Documents";

  // When all 3 uploads succeed → go to download page with the target doc
  const handleAllUploaded = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/files/download-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ fileId: uploadPopupDoc._id }),
      });
  
      const data = await res.json();
      if (!data.downloadToken) throw new Error("No token received");
  
      // Token goes in state only — not URL, not localStorage
      navigate(`/download/${uploadPopupDoc._id}`, {
        state: { doc: uploadPopupDoc, downloadToken: data.downloadToken },
      });
    } catch (err) {
      alert("Could not unlock download. Please try again.");
    }
  };

  return (
    <div style={styles.page}>
      <Navbar onSearch={handleSearch} />
      <CategoryBar
        categoryData={categoryData}
        onSelectSubcategory={(cat, item) => {
          setSelectedCategory(cat);
          setSelectedSubcategory(item);
          setSearchText("");
          setSearchResults([]);
        }}
      />

      {/* Hero */}
      <div style={styles.heroBg}>
        <div className="container py-5">
          <div className="row align-items-center py-4">
            <div className="col-lg-7">
              <span className="badge bg-success mb-3 px-3 py-2" style={{ fontSize: 13 }}>
                📚 10,000+ Documents Available
              </span>
              <h1 className="display-4 fw-bold text-white mb-3">
                Get to the <span style={{ color: "#1abc9c" }}>Source.</span>
              </h1>
              <p className="text-white-50 fs-5 mb-4" style={{ maxWidth: 520 }}>
                Specialized knowledge on any topic. Study material, notes, guides, and more — all in one place.
              </p>
            </div>
            <div className="col-lg-5 mt-5 mt-lg-0">
              <div className="row g-3">
                {[
                  { icon: "📄", count: "10K+", label: "Documents" },
                  { icon: "👥", count: "5K+",  label: "Users" },
                  { icon: "📂", count: "50+",  label: "Categories" },
                  { icon: "⭐", count: "4.8",  label: "Rating" },
                ].map(stat => (
                  <div key={stat.label} className="col-6">
                    <div className="rounded-3 p-3 text-center" style={styles.statCard}>
                      <div style={{ fontSize: 28 }}>{stat.icon}</div>
                      <div className="fw-bold text-white fs-4">{stat.count}</div>
                      <div className="text-white-50 small">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Documents Section */}
      <div style={styles.docsBg}>
        <div className="container py-5">
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <h2 className="text-white fw-bold mb-0">{sectionTitle}</h2>
            {(selectedCategory || selectedSubcategory) && (
              <button className="btn btn-outline-light btn-sm" onClick={() => { setSelectedCategory(""); setSelectedSubcategory(""); }}>
                ✕ Clear Filter
              </button>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-5">
              <Loader size={40} color="#1abc9c" style={{ animation: "spin 1s linear infinite" }} />
              <p className="text-white-50 mt-3">Loading documents…</p>
            </div>
          )}

          {/* No Results */}
          {!loading && docsToShow.length === 0 && (
            <div className="text-center py-5">
              <div style={{ fontSize: 60 }}>🔍</div>
              <h4 className="text-white mt-3">No documents found</h4>
              <p className="text-white-50">Try a different search or category</p>
            </div>
          )}

          {/* Docs Grid */}
          {!loading && (
            <div className="row g-4">
              {docsToShow.map((doc) => (
                <div key={doc._id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                  <div
                    className="card h-100 border-0 shadow"
                    style={styles.docCard}
                    onClick={() => setUploadPopupDoc(doc)}
                  >
                    {/* Type badge top-right */}
                    <div style={{ padding: "14px 14px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{
                        fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
                        background: getTypeBadgeColor(doc.fileType),
                        color: "#fff", padding: "3px 8px", borderRadius: 4
                      }}>
                        {getTypeLabel(doc.fileType)}
                      </span>
                      {doc.size && (
                        <span style={{ fontSize: 10, color: "#6b7280" }}>{formatFileSize(doc.size)}</span>
                      )}
                    </div>

                    <div className="card-body d-flex flex-column" style={{ padding: "12px 14px 14px" }}>
                      {/* File icon placeholder */}
                      <div style={{
                        width: "100%", height: 100, borderRadius: 8,
                        background: `${getTypeBadgeColor(doc.fileType)}18`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        marginBottom: 12, fontSize: 40
                      }}>
                        {doc.fileType?.startsWith("image/") ? "🖼️"
                          : doc.fileType === "application/pdf" ? "📄"
                          : doc.fileType?.includes("word") ? "📝"
                          : doc.fileType?.includes("sheet") || doc.fileType?.includes("excel") ? "📊"
                          : doc.fileType?.includes("presentation") || doc.fileType?.includes("powerpoint") ? "📋"
                          : "📁"}
                      </div>

                      <h6 className="card-title fw-bold" style={{ color: "#f0f0f0", fontSize: 14, marginBottom: 4 }}>
                        {doc.title || "Untitled"}
                      </h6>
                      <p className="text-muted small mb-3" style={{ fontSize: 12, color: "#9ca3af !important", flex: 1 }}>
                        {doc.description || "No description"}
                      </p>

                      {/* Tags */}
                      {doc.tags?.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
                          {doc.tags.slice(0, 3).map(tag => (
                            <span key={tag} style={{
                              fontSize: 10, background: "rgba(26,188,156,0.15)",
                              color: "#1abc9c", padding: "2px 7px", borderRadius: 20, fontWeight: 600
                            }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <button className="btn btn-success btn-sm mt-auto w-100">
                        ⬇ Download
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <div className="container">
          <div className="row py-4 gy-3">
            <div className="col-md-4">
              <h5 className="text-white fw-bold">SHAREDOCS</h5>
              <p className="text-white-50 small">Your go-to platform for sharing and discovering knowledge.</p>
            </div>
            <div className="col-md-4">
              <h6 className="text-white">Quick Links</h6>
              <ul className="list-unstyled">
                {["Home", "Upload", "Premium", "About"].map(link => (
                  <li key={link}><span className="text-white-50 small" style={{ cursor: "pointer" }}>{link}</span></li>
                ))}
              </ul>
            </div>
            <div className="col-md-4">
              <h6 className="text-white">Popular Categories</h6>
              <ul className="list-unstyled">
                {["Academic", "Professional", "Culture", "Hobbies"].map(c => (
                  <li key={c}>
                    <span className="text-white-50 small" style={{ cursor: "pointer" }}
                      onClick={() => { setSelectedCategory(c); setSelectedSubcategory(""); }}>
                      {c}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <hr style={{ borderColor: "rgba(255,255,255,0.1)" }} />
          <p className="text-white-50 text-center small pb-2 mb-0">© 2025 ShareDocs. All rights reserved.</p>
        </div>
      </footer>

      {/* Upload Popup */}
      {uploadPopupDoc && (
  <DownloadPopup
    doc={uploadPopupDoc}
    onClose={() => setUploadPopupDoc(null)}
  />
)}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

const overlayStyle = {
  position: "fixed", inset: 0,
  background: "rgba(0,0,0,0.75)",
  display: "flex", justifyContent: "center", alignItems: "center",
  zIndex: 999, padding: 20,
};

const popupStyle = {
  width: "100%", maxWidth: 480,
  background: "#fff", borderRadius: 16,
  padding: 28, boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
  maxHeight: "90vh", overflowY: "auto",
};

const styles = {
  page: { minHeight: "100vh", fontFamily: "Arial, sans-serif" },
  heroBg: {
    background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
  },
  statCard: {
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.1)",
    backdropFilter: "blur(10px)",
  },
  docsBg: { background: "#0f0f0f", minHeight: "60vh" },
  docCard: {
    borderRadius: 12, overflow: "hidden",
    background: "#1a1a1a", color: "#fff",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "pointer",
  },
  footer: { background: "#0a0a0a", borderTop: "1px solid rgba(255,255,255,0.05)" },
};