import React, { useState } from "react";

const ClientInfo = ({ data }) => {
  const [selectedPoints, setSelectedPoints] = useState({
    tech: {},
    notech: {},
  });
  const [emailContent, setEmailContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSelection = (category, key, point) => {
    setSelectedPoints((prev) => ({
      ...prev,
      [category === "Technical" ? "tech" : "notech"]: {
        ...prev[category === "Technical" ? "tech" : "notech"],
        [key]: prev[category === "Technical" ? "tech" : "notech"][key]
          ? undefined
          : point,
      },
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    const filteredSelections = {
      tech: Object.fromEntries(
        Object.entries(selectedPoints.tech).filter(([, v]) => v)
      ),
      notech: Object.fromEntries(
        Object.entries(selectedPoints.notech).filter(([, v]) => v)
      ),
    };

    try {
      const response = await fetch("http://127.0.0.1:5006/generateemail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selected_points: filteredSelections }),
      });

      if (!response.ok) throw new Error("Failed to generate email");

      const result = await response.json();
      setEmailContent(result.email_content);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
    console.log("Selected Points:", filteredSelections);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-3">Company Information</h2>

      <h3 className="font-medium">Non-Technical Points:</h3>
      <ul className="list-disc pl-5 mb-3">
        {Object.entries(data.Non_Technical_Points).map(([key, point]) => (
          <li key={key} className="text-gray-700 flex items-center gap-2">
            <input
              type="checkbox"
              onChange={() => handleSelection("Non-Technical", key, point)}
              checked={Boolean(selectedPoints.notech[key])}
            />
            {point}
          </li>
        ))}
      </ul>

      <h3 className="font-medium">Technical Points:</h3>
      <ul className="list-disc pl-5">
        {Object.entries(data.Technical_Points).map(([key, point]) => (
          <li key={key} className="text-gray-700 flex items-center gap-2">
            <input
              type="checkbox"
              onChange={() => handleSelection("Technical", key, point)}
              checked={Boolean(selectedPoints.tech[key])}
            />
            {point}
          </li>
        ))}
      </ul>

      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Mail"}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {emailContent && (
        <div className="mt-4 p-3 border border-gray-300 rounded-lg bg-gray-50 shadow">
          <h3 className="text-lg font-semibold">Generated Email:</h3>
          <div
            className="text-gray-700 text-sm mt-2"
            dangerouslySetInnerHTML={{ __html: emailContent }}
          />
        </div>
      )}
    </div>
  );
};

export default ClientInfo;
