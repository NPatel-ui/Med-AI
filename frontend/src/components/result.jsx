export default function Results() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4 text-blue-700">
        Analysis Results
      </h2>

      <div className="p-4 rounded-xl bg-blue-50 border-l-4 border-blue-600 mb-4">
        <p className="text-sm mb-2 text-gray-600">
          Based on your symptoms:
        </p>

        <h3 className="text-lg font-bold text-blue-800">Migraine</h3>

        <span className="inline-block mt-2 px-3 py-1 text-xs rounded-full 
        bg-red-100 text-red-700">
          Strong Match
        </span>

        <button className="mt-4 w-full py-2 rounded-xl text-white 
        bg-gradient-to-r from-blue-600 to-red-600">
          Learn More
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl border">
          <p className="font-semibold">Tension Headache</p>
          <span className="text-xs text-blue-600">Moderate</span>
        </div>
        <div className="p-3 rounded-xl border">
          <p className="font-semibold">Sinusitis</p>
          <span className="text-xs text-red-600">Possible</span>
        </div>
      </div>

      <div className="mt-4 text-xs text-red-700 bg-red-50 p-3 rounded-xl">
        ⚠️ Informational only. Consult a doctor for diagnosis.
      </div>
    </div>
  );
}
