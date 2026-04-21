import { useState } from "react";

export default function CategoryBar({ categoryData, onSelectSubcategory }) {
  const [openMenu, setOpenMenu] = useState("");

  return (
    <div style={styles.categoryBar}>
      {Object.keys(categoryData).map((category) => (
        <div
          key={category}
          style={styles.categoryItem}
          onMouseEnter={() => setOpenMenu(category)}
        >
          {category
            .replace("PersonalGrowth", "Personal Growth")
            .replace("AllDocuments", "All Documents")}{" "}
          ▾
          {openMenu === category && (
            <div
              style={styles.categoryDropdown}
              onMouseLeave={() => setOpenMenu("")}
            >
              {categoryData[category].map((col, i) => (
                <div key={i} style={styles.catColumn}>
                  <h4>{col.title}</h4>
                  {col.items.map((item) => (
                    <p
                      key={item}
                      style={{ cursor: "pointer", margin: "6px 0" }}
                      onClick={() => {
                        onSelectSubcategory(category, item);
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
  );
}

const styles = {
  categoryBar: {
    display: "flex",
    gap: "30px",
    padding: "15px 40px",
    background: "rgba(0,0,0,0.5)",
  },
  categoryItem: {
    position: "relative",
    cursor: "pointer",
    color: "#fff",
    fontWeight: "bold",
  },
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
  catColumn: {
    minWidth: "180px",
  },
};