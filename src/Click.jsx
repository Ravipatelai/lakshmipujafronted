// Click.js
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// 🔧 Update this to your production backend URL (e.g., from Vercel or Railway)
const BACKEND_URL = "http://localhost:5000"; // replace with your deployed backend URL

export default function Click() {
  const [selected, setSelected] = useState(null);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [file, setFile] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [balance, setBalance] = useState(0);

  const occupations = {
    Student: { label: "Student :- 200", amount: 200 },
    "Private job": { label: "Private job :- 350", amount: 350 },
    "Gorvament job": { label: "Gorvament job :- 1000", amount: 1000 },
  };

  const images = {
    Student: "raviQR.jpg",
    "Private job": "raviQR.jpg",
    "Gorvament job": "raviQR.jpg",
  };

  useEffect(() => {
    const total = history.reduce((sum, item) => sum + (item.amount || 0), 0);
    setBalance(total);
  }, [history]);

  const handleSubmit = async () => {
    if (!name.trim()) return alert("⚠ Please enter your name!");
    if (!mobile.trim() || !/^\d{10}$/.test(mobile))
      return alert("⚠ Please enter a valid 10-digit mobile number!");
    if (!selected) return alert("⚠ Please select your Occupation!");
    if (!file) return alert("⚠ Please upload an image!");

    const occupationValue = occupations[selected]?.amount || 0;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("mobile", mobile);
    formData.append("occupation", selected); // ✅ correct field name
    formData.append("image", file);

    try {
      const response = await fetch(`${BACKEND_URL}/save`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save entry");
      }

      alert(data.message || "✅ Saved!");

      // 🆕: Extract image filename from response
      const savedImage = data.image?.split("/").pop() || file.name;

      setHistory([
        ...history,
        {
          name,
          mobile,
          occupation: selected,
          image: savedImage,
          createdAt: new Date().toISOString(),
          amount: occupationValue,
        },
      ]);

      // Reset form
      setName("");
      setMobile("");
      setFile(null);
      setSelected(null);
    } catch (err) {
      console.error("❌ Save error:", err);
      alert("❌ Error saving data");
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/all`);
      const data = await res.json();

      // ✅ Prevent crash if backend sends an error object
      if (!Array.isArray(data)) {
        console.error("Invalid response format:", data);
        alert("❌ Failed to load history");
        return;
      }

      const historyWithAmount = data.map((item) => ({
        ...item,
        amount: occupations[item.occupation]?.amount || 0,
      }));

      setHistory(historyWithAmount);
      setShowHistory(true);
    } catch (err) {
      console.error("❌ Fetch error:", err);
      alert("❌ Failed to load history");
    }
  };

  return (
    <div className="p-6 text-center font-sans bg-gray-50 min-h-screen">
      <div className="text-center text-3xl font-bold bg-clip-text text-transparent 
        bg-gradient-to-r from-orange-500 via-green-500 to-blue-500 p-4 rounded-lg shadow-md flex items-center justify-center gap-2">
        <img src="lakshmema.jpg" alt="Lakshmi Maa" className="w-10 h-10" />
        <span> पटेल समिति घोरहा </span>
        <img src="lakshmema.jpg" alt="Lakshmi Maa" className="w-10 h-10" />
      </div>

      <h1 className="text-3xl font-bold mb-2 text-yellow-600 drop-shadow-lg">
        Shree Lakshmi Puja
      </h1>
      <p className="mb-1 font-semibold">आप क्या करते हैं?</p>

      <div className="flex gap-4 justify-center mb-6 flex-wrap">
        {Object.entries(occupations).map(([key, occ]) => (
          <button
            key={key}
            onClick={() => setSelected(key)}
            className={`px-6 py-3 rounded-lg shadow-lg font-semibold transition-all duration-300 ${
              selected === key
                ? "scale-105 bg-gradient-to-r from-yellow-400 to-yellow-300 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {occ.label}
          </button>
        ))}
      </div>

      {selected && (
        <div className="mb-6 animate-fadeIn">
          <img
            src={images[selected]}
            alt={selected}
            className="mx-auto w-64 rounded-xl shadow-xl border-2 border-yellow-300 transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}

      <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-2xl mb-6 animate-fadeIn">
        <h2 className="text-xl font-bold mb-4 text-gray-700">Enter Your Details</h2>
        <input
          type="text"
          placeholder="Your Name"
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Mobile Number"
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          className="w-full p-2 mb-4 border rounded-lg cursor-pointer"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button
          onClick={handleSubmit}
          className="w-full bg-yellow-400 text-white py-3 rounded-xl shadow-lg font-bold hover:bg-yellow-500 transition-all duration-300"
        >
          Submit
        </button>
      </div>

      <div className="flex gap-4 justify-center mb-4 flex-wrap">
        <button
          onClick={() => {
            if (!showHistory) fetchHistory();
            else setShowHistory(false);
          }}
          className="px-6 py-3 bg-purple-500 text-white rounded-xl shadow-lg hover:bg-purple-600 transition-all duration-300 font-semibold"
        >
          {showHistory ? "Hide History" : "Show History"}
        </button>

        <button
          disabled={balance === 0}
          className="px-6 py-3 bg-green-500 text-white rounded-xl shadow-lg hover:bg-green-600 transition-all duration-300 font-semibold disabled:opacity-50"
        >
          Balance: ₹{balance}
        </button>

        <button className="px-6 py-3 bg-blue-500 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-all duration-300 font-semibold">
          <Link to="/lakshmi-info">Information</Link>
        </button>
      </div>

      {showHistory && (
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-6 transition-all duration-700 ease-in-out">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">History</h2>
          <ul className="space-y-6">
            {history.map((item, idx) => (
              <li
                key={idx}
                className="border-b pb-3 hover:bg-gray-50 rounded-lg transition-colors duration-300"
              >
                <p><span className="font-semibold">Name:</span> {item.name}</p>
                <p><span className="font-semibold">Mobile:</span> {item.mobile}</p>
                <p><span className="font-semibold">Occupation:</span> {item.occupation}</p>
                <p><span className="font-semibold">Amount:</span> ₹{item.amount}</p>
                <p>
                  <span className="font-semibold">Image:</span>{" "}
                  <a
                    href={`${BACKEND_URL}/uploads/${item.image}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800 transition-colors duration-300"
                  >
                    {item.image}
                  </a>
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
