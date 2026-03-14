export default function Symptoms({ next }) {
  const symptoms = [
    { name: "Fever", desc: "High temperature" },
    { name: "Cough", desc: "Dry or productive" },
    { name: "Fatigue", desc: "Feeling tired" }
  ];

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4 text-blue-700">
        Add Symptoms
      </h2>

      <input
        placeholder="Search symptoms..."
        className="w-full mb-4 px-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-400"
      />

      <div className="space-y-3">
        {symptoms.map(s => (
          <label
            key={s.name}
            className="flex items-center p-3 rounded-xl 
            bg-white shadow hover:shadow-lg transition"
          >
            <input type="checkbox" className="mr-3 accent-red-600" />
            <div>
              <p className="font-medium">{s.name}</p>
              <p className="text-xs text-gray-500">{s.desc}</p>
            </div>
          </label>
        ))}
      </div>

      <button
        onClick={next}
        className="mt-6 w-full py-3 rounded-xl text-white font-semibold
        bg-gradient-to-r from-red-600 to-blue-600 shadow-lg"
      >
        Analyze Symptoms →
      </button>
    </div>
  );
}
