import { useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

export default function Uploader() {
  const [specFile, setSpecFile] = useState(null);
  const [csvFile, setCsvFile] = useState(null);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setStatus("Uploading...");

    if (!specFile && !csvFile) {
      setError("Please select at least one file to upload.");
      setStatus(null);
      return;
    }

    const form = new FormData();
    if (specFile) form.append("spec", specFile);
    if (csvFile) form.append("csv", csvFile);

    try {
      const res = await fetch(`${BACKEND_URL}/api/upload`, {
        method: "POST",
        body: form,
      });
      if (!res.ok) throw new Error(`Upload failed (${res.status})`);
      const data = await res.json();
      setStatus("Upload complete.");
      setError(null);
      return data;
    } catch (err) {
      setError(err.message || "Upload failed");
      setStatus(null);
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6 shadow-xl">
      <h2 className="text-white text-xl font-semibold mb-4">Upload your files</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-blue-200 mb-1">H.A.R.M.O.N.I. spec</label>
          <input
            type="file"
            accept=".txt,.md,.pdf"
            onChange={(e) => setSpecFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-blue-100 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
          />
        </div>
        <div>
          <label className="block text-sm text-blue-200 mb-1">P1–P9 breed vectors CSV</label>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-blue-100 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition"
        >
          Upload
        </button>
        {status && <p className="text-sm text-blue-200">{status}</p>}
        {error && <p className="text-sm text-red-300">{error}</p>}
      </form>
    </div>
  );
}
