import { useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

export default function Uploader() {
  const [specFile, setSpecFile] = useState(null);
  const [csvFile, setCsvFile] = useState(null);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [csvPreview, setCsvPreview] = useState(null); // JSON preview from backend

  const makeAbsUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${BACKEND_URL}${path}`;
  };

  const requestCsvPreview = async (storedName, maxLines = 10) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/csv/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: storedName, max_lines: maxLines }),
      });
      if (!res.ok) throw new Error(`CSV preview failed (${res.status})`);
      const data = await res.json();
      setCsvPreview(data);
    } catch (e) {
      setCsvPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setStatus("Uploading...");
    setResult(null);
    setCsvPreview(null);

    if (!specFile && !csvFile) {
      setError("Please select at least one file to upload.");
      setStatus(null);
      return;
    }

    if (!BACKEND_URL) {
      setError("Backend URL is not configured. Please set VITE_BACKEND_URL and reload.");
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
      setResult(data);

      // If CSV uploaded, request a backend-generated preview (first N rows, verbatim)
      const storedCsvName = data?.files?.csv?.stored_as;
      if (storedCsvName) {
        await requestCsvPreview(storedCsvName, 10);
      }
    } catch (err) {
      setError(err.message || "Upload failed");
      setStatus(null);
    }
  };

  const FileRow = ({ label, file }) => {
    if (!file) return null;
    const abs = makeAbsUrl(file.url);
    return (
      <div className="flex items-center justify-between py-2 px-3 rounded-md bg-slate-700/40 border border-blue-500/10">
        <div className="min-w-0">
          <p className="text-sm text-blue-100 truncate">
            <span className="text-blue-300">{label}: </span>
            {file.filename} <span className="text-blue-300">({file.size} bytes)</span>
          </p>
          {abs && (
            <a href={abs} target="_blank" rel="noreferrer" className="text-xs text-blue-300 underline">
              View file
            </a>
          )}
        </div>
      </div>
    );
  };

  const CsvPreviewTable = ({ preview }) => {
    if (!preview) return null;
    const { headers = [], rows = [] } = preview;
    return (
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-blue-200">CSV preview (first {rows.length} rows, verbatim)</p>
        </div>
        <div className="overflow-auto border border-blue-500/10 rounded-md bg-slate-900/60">
          <table className="min-w-full text-xs text-blue-100">
            {headers.length > 0 && (
              <thead className="bg-slate-800/60">
                <tr>
                  {headers.map((h, i) => (
                    <th key={i} className="px-3 py-2 text-left font-semibold text-blue-200 whitespace-pre">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {rows.map((r, ri) => (
                <tr key={ri} className={ri % 2 ? "bg-slate-800/30" : ""}>
                  {r.map((cell, ci) => (
                    <td key={ci} className="px-3 py-2 align-top whitespace-pre">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
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

      {result && (
        <div className="mt-6 space-y-3">
          <h3 className="text-white font-semibold">Uploaded files</h3>
          <FileRow label="Spec" file={result?.files?.spec} />
          <FileRow label="CSV" file={result?.files?.csv} />

          <CsvPreviewTable preview={csvPreview} />
        </div>
      )}
    </div>
  );
}
