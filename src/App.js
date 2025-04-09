// src/App.js
import React, { useState, useEffect } from "react";
import { MPPeriodicTable, MPList } from "@materialsproject/mp-react-components";
import axios from "axios";
import "./App.css";

function App() {
  const [filters, setFilters] = useState({
    cif_id: "",
    space_group: "",
    num_species: "",
    elements: [],
  });
  const [materials, setMaterials] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  useEffect(() => {
    const fetchMaterials = async () => {
      const query = new URLSearchParams();
      for (const key in filters) {
        if (filters[key]) {
          query.append(key, Array.isArray(filters[key]) ? filters[key].join(",") : filters[key]);
        }
      }

      const response = await axios.get(`http://158.144.59.113:5000/api/materials?${query}`);
      setMaterials(response.data);
    };

    fetchMaterials();
  }, [filters]);

  const handleElementSelect = (el) => {
    setFilters((prev) => {
      const exists = prev.elements.includes(el);
      const newEls = exists ? prev.elements.filter((e) => e !== el) : [...prev.elements, el];
      return { ...prev, elements: newEls };
    });
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  if (selectedMaterial) {
    return (
      <div className="App">
        <button onClick={() => setSelectedMaterial(null)}>⬅ Back</button>
        <h2>Material Detail</h2>
        <pre>{JSON.stringify(selectedMaterial, null, 2)}</pre>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>Materials Dashboard</h1>

      <div className="filters">
        <input
          type="text"
          name="cif_id"
          placeholder="Material ID"
          value={filters.cif_id}
          onChange={handleChange}
        />
        <input
          type="text"
          name="space_group"
          placeholder="Space Group"
          value={filters.space_group}
          onChange={handleChange}
        />
        <input
          type="number"
          name="num_species"
          placeholder="Number of Species"
          value={filters.num_species}
          onChange={handleChange}
        />
        <MPPeriodicTable onElementSelect={handleElementSelect} />
        <p>Selected Elements: {filters.elements.join(", ")}</p>
      </div>

      <MPList
        data={materials}
        columns={[
          { label: "Material ID", key: "cif_id" },
          { label: "Formula", key: "reduced_structure_name" },
          { label: "Space Group", key: "space_group" },
        ]}
        onSelect={(material) => setSelectedMaterial(material)}
      />
    </div>
  );
}

export default App;
