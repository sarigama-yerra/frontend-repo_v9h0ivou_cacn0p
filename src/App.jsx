import Uploader from "./components/Uploader";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>

      <div className="relative min-h-screen flex items-center justify-center p-8">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center mb-6">
              <img
                src="/flame-icon.svg"
                alt="Flames"
                className="w-24 h-24 drop-shadow-[0_0_25px_rgba(59,130,246,0.5)]"
              />
            </div>

            <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
              Upload your H.A.R.M.O.N.I. files
            </h1>

            <p className="text-xl text-blue-200 mb-6">
              Provide the exact spec and CSV. We’ll use them verbatim.
            </p>
          </div>

          <Uploader />

          <div className="text-center mt-6">
            <p className="text-sm text-blue-300/60">
              Your files are stored temporarily for this session only.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
