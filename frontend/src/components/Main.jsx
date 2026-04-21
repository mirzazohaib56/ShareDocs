import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function MainPage() {
  const navigate = useNavigate();

  const [showLang, setShowLang] = useState(false);
  const [openMenu, setOpenMenu] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(""); // selected main category
  const [selectedSubcategory, setSelectedSubcategory] = useState(""); // selected subcategory
  // ---------------- CATEGORY DATA ----------------
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

  // ---------------- DEMO DOCUMENTS ----------------
  // ---------------- DEMO DOCUMENTS ----------------
const demoDocs = [
  // Academic
  {
    id: 1,
    title: "Chinese Language Basics",
    img: "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg",
    category: "Academic",
    subcategory: "Chinese",
  },
  {
    id: 2,
    title: "ESL Beginner Grammar Notes",
    img: "https://images.pexels.com/photos/261909/pexels-photo-261909.jpeg",
    category: "Academic",
    subcategory: "ESL",
  },
  {
    id: 3,
    title: "Astronomy Introduction Guide",
    img: "https://images.pexels.com/photos/2150/sky-space-dark-galaxy.jpg",
    category: "Academic",
    subcategory: "Astronomy",
  },
  {
    id: 4,
    title: "Biology Short Notes",
    img: "https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg",
    category: "Academic",
    subcategory: "Biology",
  },

  // Education / Philosophy
  {
    id: 5,
    title: "Child Education Basics",
    img: "https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg",
    category: "Academic",
    subcategory: "Child Education",
  },
  {
    id: 6,
    title: "Introduction to Philosophy",
    img: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg",
    category: "Academic",
    subcategory: "Philosophy",
  },

  // Professional
  {
    id: 7,
    title: "Marketing Strategy Notes",
    img: "https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg",
    category: "Professional",
    subcategory: "Marketing",
  },
  {
    id: 8,
    title: "Finance Fundamentals Guide",
    img: "https://images.pexels.com/photos/210990/pexels-photo-210990.jpeg",
    category: "Professional",
    subcategory: "Finance",
  },
  {
    id: 9,
    title: "HR Management Notes",
    img: "https://images.pexels.com/photos/3182763/pexels-photo-3182763.jpeg",
    category: "Professional",
    subcategory: "HR",
  },
  {
    id: 10,
    title: "IT & Software Basics",
    img: "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg",
    category: "Professional",
    subcategory: "IT & Software",
  },
  {
    id: 11,
    title: "Networking Fundamentals",
    img: "https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg",
    category: "Professional",
    subcategory: "Networking",
  },
  {
    id: 12,
    title: "Data Science Introduction",
    img: "https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg",
    category: "Professional",
    subcategory: "Data Science",
  },

  // Engineering
  {
    id: 13,
    title: "Electrical Engineering Notes",
    img: "https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg",
    category: "Professional",
    subcategory: "Electrical",
  },
  {
    id: 14,
    title: "Mechanical Engineering Basics",
    img: "https://images.pexels.com/photos/162568/engineer-mechanical-162568.jpeg",
    category: "Professional",
    subcategory: "Mechanical",
  },

  // Culture
  {
    id: 15,
    title: "World War II Summary",
    img: "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg",
    category: "Culture",
    subcategory: "World War II",
  },
  {
    id: 16,
    title: "Ancient Civilizations Guide",
    img: "https://images.pexels.com/photos/2104882/pexels-photo-2104882.jpeg",
    category: "Culture",
    subcategory: "Ancient Civilizations",
  },
  {
    id: 17,
    title: "French Language Basics",
    img: "https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg",
    category: "Culture",
    subcategory: "French",
  },
  {
    id: 18,
    title: "Arabic Language Guide",
    img: "https://images.pexels.com/photos/724921/pexels-photo-724921.jpeg",
    category: "Culture",
    subcategory: "Arabic",
  },

  // Lifestyle / Traditions
  {
    id: 19,
    title: "Festivals Around the World",
    img: "https://images.pexels.com/photos/3171837/pexels-photo-3171837.jpeg",
    category: "Culture",
    subcategory: "Festivals",
  },
  {
    id: 20,
    title: "Lifestyle & Traditions Notes",
    img: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg",
    category: "Culture",
    subcategory: "Lifestyle",
  },

  // Arts
  {
    id: 21,
    title: "Painting Basics Guide",
    img: "https://images.pexels.com/photos/102127/pexels-photo-102127.jpeg",
    category: "Popular",
    subcategory: "Painting",
  },
  {
    id: 22,
    title: "DIY Crafts Ideas",
    img: "https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg",
    category: "Popular",
    subcategory: "DIY Crafts",
  },

  // Sports
  {
    id: 23,
    title: "Cricket Training Notes",
    img: "https://images.pexels.com/photos/163452/cricket-player-sport-163452.jpeg",
    category: "Popular",
    subcategory: "Cricket",
  },
  {
    id: 24,
    title: "Football Strategy Guide",
    img: "https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg",
    category: "Popular",
    subcategory: "Football",
  },

  // Games
  {
    id: 25,
    title: "Chess Opening Guide",
    img: "https://images.pexels.com/photos/411207/pexels-photo-411207.jpeg",
    category: "Popular",
    subcategory: "Chess",
  },
  {
    id: 26,
    title: "Puzzle Solving Techniques",
    img: "https://images.pexels.com/photos/278918/pexels-photo-278918.jpeg",
    category: "Popular",
    subcategory: "Puzzles",
  },

  // Motivation
  {
    id: 27,
    title: "Success Tips Guide",
    img: "https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg",
    category: "PersonalGrowth",
    subcategory: "Success Tips",
  },
  {
    id: 28,
    title: "Time Management Notes",
    img: "https://images.pexels.com/photos/1051075/pexels-photo-1051075.jpeg",
    category: "PersonalGrowth",
    subcategory: "Time Management",
  },

  // Health
  {
    id: 29,
    title: "Workout Routine Guide",
    img: "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg",
    category: "PersonalGrowth",
    subcategory: "Workout",
  },
  {
    id: 30,
    title: "Nutrition Basics",
    img: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
    category: "PersonalGrowth",
    subcategory: "Nutrition",
  },

  {
    id: 31,
    title: "Self Discipline Guide",
    img: "https://images.pexels.com/photos/3757376/pexels-photo-3757376.jpeg",
    category: "PersonalGrowth",
    subcategory: "Self Discipline",
  },
  {
    id: 32,
    title: "Habit Building Notes",
    img: "https://images.pexels.com/photos/1008739/pexels-photo-1008739.jpeg",
    category: "PersonalGrowth",
    subcategory: "Habits",
  },
];


  // ---------------- SEARCH HANDLER ----------------
  const handleSearch = () => {
    const text = searchText.trim().toLowerCase();
    if (text === "") {
      setSearchResults([]);
      return;
    }
    const results = demoDocs.filter((doc) =>
      doc.title.toLowerCase().includes(text)
    );
    setSearchResults(results);
  };
  

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  // ---------------- DOWNLOAD HANDLER ----------------
  const handleDownload = (doc) => {
    setSelectedDoc(doc);
    setShowPopup(true);
  };

  // ---------------- FILTER DEMO DOCS BY CATEGORY/SUBCATEGORY ----------------
  const filteredDocs = demoDocs.filter((doc) => {
    if (!selectedCategory) return true;
    if (selectedCategory && !selectedSubcategory) return true;
    return doc.subcategory === selectedSubcategory;
  });

  return (
    <div style={styles.page}>
      {/* NAVBAR */}
      <nav style={styles.nav}>
        <div style={styles.logo}>SHAREDOCS</div>
        <div style={styles.searchBox}>
          <input
            style={styles.searchInput}
            placeholder="Search documents..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button style={styles.searchBtn} onClick={handleSearch}>
            Search
          </button>
        </div>
        <div style={styles.navRight}>
          <div
            style={styles.navItem}
            onMouseEnter={() => setShowLang(true)}
            onMouseLeave={() => setShowLang(false)}
          >
            🌐 EN
            {showLang && (
              <div
                style={styles.dropdown}
                onMouseEnter={() => setShowLang(true)}
                onMouseLeave={() => setShowLang(false)}
              >
                {["English", "Spanish", "French", "German", "Urdu"].map(
                  (lang) => (
                    <label key={lang} style={styles.langItem}>
                      <input type="radio" name="language" value={lang} />
                      {lang}
                    </label>
                  )
                )}
              </div>
            )}
          </div>

          <div style={styles.navItem} onClick={() => navigate("/login")}>
            Sign In
          </div>
          <button style={styles.signupBtn} onClick={() => navigate("/")}>
            15 Days Free Trial
          </button>
        </div>
      </nav>

      {/* ---------------- CATEGORY BAR ---------------- */}
<div style={styles.categoryBar}>
  {Object.keys(categoryData).map((category) => (
    
    <div
      key={category}
      style={styles.categoryItem}
      onMouseEnter={() => setOpenMenu(category)}
    >
      {category
        .replace("PersonalGrowth", "Personal Growth")
        .replace("AllDocuments", "All Documents")} ▾

      {openMenu === category && (
        <div
          style={styles.categoryDropdown}
          onMouseLeave={() => setOpenMenu("")}   // 👈 move here
        >
          {categoryData[category].map((col, i) => (
            <div key={i} style={styles.catColumn}>
              <h4>{col.title}</h4>

              {col.items.map((item) => (
                <p
                  key={item}
                  style={{ cursor: "pointer", margin: "6px 0" }}
                  onClick={() => {
                    setSelectedCategory(category);
                    setSelectedSubcategory(item);
                    setOpenMenu("");
                  }}
                >
                  {item}
                </p>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>

  ))}
</div>

      {/* ---------------- HERO SECTION ---------------- */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Get to the source.</h1>
        <p style={styles.heroText}>
          Specialized knowledge on any topic. Study material, notes, guides,
          and more.
        </p>
      </div>

      {/* ---------------- SEARCH RESULTS ---------------- */}
      {searchText.trim() !== "" && (
        <div style={styles.demoSection}>
          <h2>Search Results</h2>
          {searchResults.length > 0 ? (
            <div style={styles.docsGrid}>
              {searchResults.map((doc) => (
                <div key={doc.id} style={styles.docCard}>
                  <img src={doc.img} style={styles.docImg} alt={doc.title} />
                  <p style={styles.docTitle}>{doc.title}</p>
                  <button
                    style={styles.downloadBtn}
                    onClick={() => handleDownload(doc)}
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "#fff", fontSize: 18, marginTop: 12 }}>
              No results found for "<strong>{searchText}</strong>".
            </p>
          )}
        </div>
      )}

      {/* ---------------- FILTERED DEMO DOCS ---------------- */}
      <div style={styles.demoSection}>
        <h2 style={{ marginBottom: "20px" }}>
          {selectedCategory
            ? selectedSubcategory
              ? `Documents: ${selectedSubcategory}`
              : `Documents in ${selectedCategory}`
            : "Random Demo Documents"}
        </h2>

        <div style={styles.docsGrid}>
          {filteredDocs.map((doc) => (
            <div key={doc.id} style={styles.docCard}>
              <img src={doc.img} style={styles.docImg} alt={doc.title} />
              <p style={styles.docTitle}>{doc.title}</p>
              <button
                style={styles.downloadBtn}
                onClick={() => handleDownload(doc)}
              >
                Download
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------- POPUP ---------------- */}
      {showPopup && selectedDoc && (
        <div style={styles.popupOverlay}>
          <div style={styles.popupBox}>
            <h3 style={{ marginBottom: 8 }}>Unlock Download</h3>
            <p style={{ marginBottom: 12 }}>
              You selected: <strong>{selectedDoc.title}</strong>
            </p>
            <p style={{ marginBottom: 16 }}>Choose how you'd like to unlock:</p>

            <button
              style={styles.popupBtn}
              onClick={() => {
                setShowPopup(false);
                navigate("/premium");
              }}
            >
              Go to Premium Page
            </button>

            <button
              style={styles.popupBtn}
              onClick={() => {
                setShowPopup(false);
                navigate("/upload");
              }}
            >
              Upload Files to Unlock
            </button>

            <button
              style={styles.closeBtn}
              onClick={() => {
                setShowPopup(false);
                setSelectedDoc(null);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------- STYLES --------------------
// Keep your existing `styles` object here...


//
// -------------------- STYLES --------------------
//
const styles = {
  page: {
    fontFamily: "Arial, sans-serif",
    color: "#fff",
    minHeight: "200vh",
    backgroundImage:
      "url('https://images.pexels.com/photos/2041540/pexels-photo-2041540.jpeg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },

  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 40px",
    background: "rgba(0,0,0,0.65)",
    backdropFilter: "blur(6px)",
  },
  logo: {
    fontSize: "26px",
    fontWeight: "bold",
    letterSpacing: "2px",
  },

  searchBox: {
    display: "flex",
    background: "#fff",
    borderRadius: "8px",
    overflow: "hidden",
  },
  searchInput: {
    padding: "10px",
    width: "350px",
    border: "none",
    outline: "none",
  },
  searchBtn: {
    padding: "10px 18px",
    background: "#1abc9c",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },

  navRight: {
    display: "flex",
    gap: "25px",
    alignItems: "center",
  },
  navItem: { cursor: "pointer", position: "relative" },

  dropdown: {
    position: "absolute",
    top: "25px",
    right: "0",
    background: "#222",
    padding: "10px 15px",
    borderRadius: "6px",
    zIndex: 10,
  },

  signupBtn: {
    padding: "8px 20px",
    background: "#2ecc71",
    border: "none",
    borderRadius: "5px",
    color: "#fff",
    cursor: "pointer",
  },

  categoryBar: {
    display: "flex",
    gap: "30px",
    padding: "15px 40px",
    background: "rgba(0,0,0,0.5)",
  },
  categoryItem: { position: "relative", cursor: "pointer" },

  categoryDropdown: {
    position: "absolute",
    top: "35px",
    left: "0",
    background: "#fff",
    color: "#000",
    padding: "20px",
    display: "flex",
    gap: "40px",
    borderRadius: "10px",
    zIndex: 20,
  },
  catColumn: { minWidth: "180px" },

  hero: {
    padding: "150px 40px",
    background: "rgba(0,0,0,0.6)",
    marginTop: "20px",
  },
  heroTitle: { fontSize: "55px" },
  heroText: { fontSize: "20px", maxWidth: "600px" },

  demoSection: {
    marginTop: "50px",
    padding: "40px",
    background: "rgba(0,0,0,0.7)",
    textAlign: "center",
  },

  docsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "25px",
  },
  docCard: {
    background: "#fff",
    color: "#000",
    borderRadius: "10px",
    overflow: "hidden",
    cursor: "pointer",
    paddingBottom: "10px",
  },
  docImg: { width: "100%", height: "150px", objectFit: "cover" },
  docTitle: { padding: "10px", fontWeight: "bold" },

  downloadBtn: {
    marginTop: "10px",
    padding: "8px 15px",
    background: "#1abc9c",
    border: "none",
    color: "#fff",
    borderRadius: "5px",
    cursor: "pointer",
  },

  popupOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },

  popupBox: {
    background: "#fff",
    color: "#000",
    padding: "25px",
    width: "360px",
    borderRadius: "10px",
    textAlign: "center",
  },

  popupBtn: {
    marginTop: "12px",
    padding: "10px 20px",
    width: "100%",
    border: "none",
    background: "#3498db",
    color: "#fff",
    borderRadius: "6px",
    cursor: "pointer",
  },

  closeBtn: {
    marginTop: "12px",
    padding: "10px 20px",
    width: "100%",
    border: "none",
    background: "red",
    color: "#fff",
    borderRadius: "6px",
    cursor: "pointer",
  },
  navItem: {
    position: "relative",
    cursor: "pointer",
    padding: "10px",
    color: "#fff",
    fontWeight: "bold",
  },

  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    background: "linear-gradient(135deg, #f9f9f9 0%, #e0f7fa 100%)", // soft pastel gradient
    color: "#333",
    borderRadius: "12px",
    padding: "10px 0",
    zIndex: 100,
    width: "160px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
    transition: "all 0.3s ease",
  },

  langItem: {
    display: "flex",
    alignItems: "center",
    padding: "8px 15px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background 0.2s ease, color 0.2s ease",
    borderRadius: "8px",
    margin: "4px 8px",
  },

  radio: {
    marginRight: "10px",
    accentColor: "#1abc9c", // bright green check
  },
};
