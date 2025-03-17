import React from "react";

const EmailTemplate = ({ data }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-3">Tech Products & Services</h2>
      <div dangerouslySetInnerHTML={{ __html: data }} />
    </div>
  );
};

export default EmailTemplate;
