export default function Home({ next }) {
  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent mb-4">
        Med-AI
      </h1>

      <img
        src="https://illustrations.popsy.co/blue/doctor.svg"
        className="w-48 mx-auto mb-6"
        alt="doctor"
      />

      <h2 className="text-xl font-semibold mb-2">
        Not feeling your best?
      </h2>

      <p className="text-gray-600 text-sm mb-6">
        Med-AI analyzes your symptoms using AI and medical intelligence.
      </p>

      <button
        onClick={next}
        className="w-full py-3 rounded-xl font-semibold text-white 
        bg-gradient-to-r from-blue-600 to-red-600 
        hover:scale-[1.03] transition-transform shadow-lg"
      >
        Start Symptom Check
      </button>

      <div className="flex justify-between text-xs text-gray-500 mt-4">
        <span>How it works</span>
        <span>Privacy</span>
      </div>
    </div>
  );
}
