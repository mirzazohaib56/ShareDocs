import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import CategoryBar from "../components/CategoryBar";

const categoryData = {
  Academic: [
    { title: "Foreign Language Studies", items: ["Chinese", "ESL"] },
    { title: "Science & Mathematics", items: ["Astronomy", "Biology"] },
    { title: "Teaching Methods", items: ["Child Education", "Philosophy"] },
  ],
  Professional: [
    { title: "Business", items: ["Marketing", "Finance", "HR"] },
    { title: "IT & Software", items: ["Networking", "Data Science"] },
    { title: "Engineering", items: ["Electrical", "Mechanical"] },
  ],
  Culture: [
    { title: "History", items: ["World War II", "Ancient Civilizations"] },
    { title: "Languages", items: ["French", "Arabic"] },
    { title: "Traditions", items: ["Festivals", "Lifestyle"] },
  ],
  Hobbies: [
    { title: "Arts & Crafts", items: ["Painting", "DIY Crafts"] },
    { title: "Sports", items: ["Cricket", "Football"] },
    { title: "Games", items: ["Chess", "Puzzles"] },
  ],
  PersonalGrowth: [
    { title: "Motivation", items: ["Success Tips", "Time Management"] },
    { title: "Health", items: ["Workout", "Nutrition"] },
    { title: "Lifestyle", items: ["Self Discipline", "Habits"] },
  ],
  AllDocuments: [
    { title: "Top Categories", items: ["Academic", "Professional", "Culture"] },
    { title: "Popular Docs", items: ["Notes", "Guides", "E-Books"] },
    { title: "Uploads", items: ["PDFs", "Docs", "Slides"] },
  ],
};

const demoDocs = [
  { id: 1, title: "Chinese Language Basics", img: "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg", category: "Academic", subcategory: "Chinese" },
  { id: 2, title: "ESL Beginner Grammar Notes", img: "https://images.pexels.com/photos/261909/pexels-photo-261909.jpeg", category: "Academic", subcategory: "ESL" },
  { id: 3, title: "Astronomy Introduction Guide", img: "https://images.pexels.com/photos/2150/sky-space-dark-galaxy.jpg", category: "Academic", subcategory: "Astronomy" },
  { id: 4, title: "Biology Short Notes", img: "https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg", category: "Academic", subcategory: "Biology" },
  { id: 5, title: "Child Education Basics", img: "https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg", category: "Academic", subcategory: "Child Education" },
  { id: 6, title: "Introduction to Philosophy", img: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg", category: "Academic", subcategory: "Philosophy" },
  { id: 7, title: "Marketing Strategy Notes", img: "https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg", category: "Professional", subcategory: "Marketing" },
  { id: 8, title: "Finance Fundamentals Guide", img: "https://images.pexels.com/photos/210990/pexels-photo-210990.jpeg", category: "Professional", subcategory: "Finance" },
  { id: 9, title: "HR Management Notes", img: "https://images.pexels.com/photos/3182763/pexels-photo-3182763.jpeg", category: "Professional", subcategory: "HR" },
  { id: 10, title: "Networking Fundamentals", img: "https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg", category: "Professional", subcategory: "Networking" },
  { id: 11, title: "Data Science Introduction", img: "https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg", category: "Professional", subcategory: "Data Science" },
  { id: 12, title: "World War II Summary", img: "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg", category: "Culture", subcategory: "World War II" },
  { id: 13, title: "Ancient Civilizations Guide", img: "https://images.pexels.com/photos/2104882/pexels-photo-2104882.jpeg", category: "Culture", subcategory: "Ancient Civilizations" },
  { id: 14, title: "French Language Basics", img: "https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg", category: "Culture", subcategory: "French" },
  { id: 15, title: "Festivals Around the World", img: "https://images.pexels.com/photos/3171837/pexels-photo-3171837.jpeg", category: "Culture", subcategory: "Festivals" },
  { id: 16, title: "Painting Basics Guide", img: "https://images.pexels.com/photos/102127/pexels-photo-102127.jpeg", category: "Hobbies", subcategory: "Painting" },
  { id: 17, title: "Cricket Training Notes", img: "https://images.pexels.com/photos/163452/cricket-player-sport-163452.jpeg", category: "Hobbies", subcategory: "Cricket" },
  { id: 18, title: "Chess Opening Guide", img: "https://images.pexels.com/photos/411207/pexels-photo-411207.jpeg", category: "Hobbies", subcategory: "Chess" },
  { id: 19, title: "Success Tips Guide", img: "https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg", category: "PersonalGrowth", subcategory: "Success Tips" },
  { id: 20, title: "Workout Routine Guide", img: "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg", category: "PersonalGrowth", subcategory: "Workout" },
  { id: 21, title: "Nutrition Basics", img: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg", category: "PersonalGrowth", subcategory: "Nutrition" },
  { id: 22, title: "Self Discipline Guide", img: "https://images.pexels.com/photos/3757376/pexels-photo-3757376.jpeg", category: "PersonalGrowth", subcategory: "Self Discipline" },
  { id: 23, title: "Time Management Notes", img: "https://images.pexels.com/photos/1051075/pexels-photo-1051075.jpeg", category: "PersonalGrowth", subcategory: "Time Management" },
  { id: 24, title: "Football Strategy Guide", img: "https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg", category: "Hobbies", subcategory: "Football" },
];

export default function MainPage() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const handleSearch = (text) => {
    setSearchText(text);
    const trimmed = text.trim().toLowerCase();
    if (!trimmed) { setSearchResults([]); return; }
    setSearchResults(
      demoDocs.filter((d) => d.title.toLowerCase().includes(trimmed))
    );
  };

  const handleDownload = (doc) => {
    setSelectedDoc(doc);
    setShowPopup(true);
  };

  const filteredDocs = demoDocs.filter((doc) => {
    if (!selectedCategory) return true;
    if (!selectedSubcategory) return doc.category === selectedCategory;
    return doc.subcategory === selectedSubcategory;
  });

  const docsToShow = searchText.trim() ? searchResults : filteredDocs;

  const sectionTitle = searchText.trim()
    ? `Search results for "${searchText}"`
    : selectedSubcategory
    ? `📂 ${selectedSubcategory}`
    : selectedCategory
    ? `📁 ${selectedCategory}`
    : "🔥 Popular Documents";

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <Navbar onSearch={handleSearch} />

      {/* Category Bar */}
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
                Specialized knowledge on any topic. Study material, notes,
                guides, and more — all in one place.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <button
                  className="btn btn-success btn-lg px-4"
                  onClick={() => navigate("/upload")}
                >
                  Upload & Share
                </button>
                <button
                  className="btn btn-outline-light btn-lg px-4"
                  onClick={() => navigate("/premium")}
                >
                  Go Premium
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="col-lg-5 mt-5 mt-lg-0">
              <div className="row g-3">
                {[
                  { icon: "📄", count: "10K+", label: "Documents" },
                  { icon: "👥", count: "5K+", label: "Users" },
                  { icon: "📂", count: "50+", label: "Categories" },
                  { icon: "⭐", count: "4.8", label: "Rating" },
                ].map((stat) => (
                  <div key={stat.label} className="col-6">
                    <div
                      className="rounded-3 p-3 text-center"
                      style={styles.statCard}
                    >
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

          {/* Section Header */}
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <h2 className="text-white fw-bold mb-0">{sectionTitle}</h2>
            {(selectedCategory || selectedSubcategory) && (
              <button
                className="btn btn-outline-light btn-sm"
                onClick={() => {
                  setSelectedCategory("");
                  setSelectedSubcategory("");
                }}
              >
                ✕ Clear Filter
              </button>
            )}
          </div>

          {/* No Results */}
          {docsToShow.length === 0 && (
            <div className="text-center py-5">
              <div style={{ fontSize: 60 }}>🔍</div>
              <h4 className="text-white mt-3">No documents found</h4>
              <p className="text-white-50">Try a different search or category</p>
            </div>
          )}

          {/* Docs Grid */}
          <div className="row g-4">
            {docsToShow.map((doc) => (
              <div key={doc.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                <div
                  className="card h-100 border-0 shadow"
                  style={styles.docCard}
                >
                  <div style={styles.imgWrapper}>
                    <img
                      src={doc.img}
                      alt={doc.title}
                      className="card-img-top"
                      style={styles.docImg}
                    />
                    <span
                      className="badge bg-success position-absolute"
                      style={{ top: 10, left: 10 }}
                    >
                      {doc.category}
                    </span>
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h6 className="card-title fw-bold">{doc.title}</h6>
                    <p className="text-muted small mb-3">{doc.subcategory}</p>
                    <button
                      className="btn btn-success btn-sm mt-auto w-100"
                      onClick={() => handleDownload(doc)}
                    >
                      ⬇ Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <div className="container">
          <div className="row py-4 gy-3">
            <div className="col-md-4">
              <h5 className="text-white fw-bold">SHAREDOCS</h5>
              <p className="text-white-50 small">
                Your go-to platform for sharing and discovering knowledge.
              </p>
            </div>
            <div className="col-md-4">
              <h6 className="text-white">Quick Links</h6>
              <ul className="list-unstyled">
                {["Home", "Upload", "Premium", "About"].map((link) => (
                  <li key={link}>
                    <span
                      className="text-white-50 small"
                      style={{ cursor: "pointer" }}
                    >
                      {link}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-md-4">
              <h6 className="text-white">Popular Categories</h6>
              <ul className="list-unstyled">
                {["Academic", "Professional", "Culture", "Hobbies"].map((c) => (
                  <li key={c}>
                    <span
                      className="text-white-50 small"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setSelectedCategory(c);
                        setSelectedSubcategory("");
                      }}
                    >
                      {c}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <hr style={{ borderColor: "rgba(255,255,255,0.1)" }} />
          <p className="text-white-50 text-center small pb-2 mb-0">
            © 2025 ShareDocs. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Download Popup */}
      {showPopup && selectedDoc && (
        <div style={styles.overlay}>
          <div
            className="bg-white rounded-4 p-4 shadow-lg"
            style={{ width: "100%", maxWidth: 400 }}
          >
            <h5 className="fw-bold mb-1">Unlock Download</h5>
            <p className="text-muted small mb-3">
              You selected: <strong>{selectedDoc.title}</strong>
            </p>
            <p className="mb-3">Choose how you'd like to unlock:</p>

            <button
              className="btn btn-primary w-100 mb-2"
              onClick={() => { setShowPopup(false); navigate("/premium"); }}
            >
              ⭐ Go Premium
            </button>
            <button
              className="btn btn-outline-success w-100 mb-2"
              onClick={() => { setShowPopup(false); navigate("/upload"); }}
            >
              📤 Upload to Unlock
            </button>
            <button
              className="btn btn-outline-danger w-100"
              onClick={() => { setShowPopup(false); setSelectedDoc(null); }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  heroBg: {
    background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
  },
  statCard: {
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.1)",
    backdropFilter: "blur(10px)",
  },
  docsBg: {
    background: "#0f0f0f",
    minHeight: "60vh",
  },
  docCard: {
    borderRadius: "12px",
    overflow: "hidden",
    background: "#1a1a1a",
    color: "#fff",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "pointer",
  },
  imgWrapper: {
    position: "relative",
    overflow: "hidden",
  },
  docImg: {
    height: "160px",
    objectFit: "cover",
    width: "100%",
    transition: "transform 0.3s",
  },
  footer: {
    background: "#0a0a0a",
    borderTop: "1px solid rgba(255,255,255,0.05)",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.75)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
    padding: "20px",
  },
};