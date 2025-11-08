import { useEffect, useState } from "react";

const defaultNames = [
  "Zach",
  "Elle",
  "Reece",
  "Ella",
  "Maggie",
  "Kim",
  "Bekah",
  "Jacob",
  "Dmytro",
  "Noah",
];

export default function App() {
  const [people, setPeople] = useState([]);
  const [newName, setNewName] = useState("");
  const [clicked, setClicked] = useState({});
  const [notes, setNotes] = useState({});

  // Load people from localStorage or default list
  useEffect(() => {
    const stored = localStorage.getItem("people-list");
    if (stored) {
      setPeople(JSON.parse(stored));
    } else {
      setPeople(defaultNames);
    }
  }, []);

  // Save people list to localStorage
  useEffect(() => {
    if (people.length > 0) {
      localStorage.setItem("people-list", JSON.stringify(people));
    }
  }, [people]);

  const handleAdd = () => {
    const name = newName.trim();
    if (name && !people.includes(name)) {
      setPeople([...people, name]);
      setNewName("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-4">People Cards</h1>

      <div className="flex space-x-2 mb-8">
        <input
          type="text"
          placeholder="Add a name..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="border rounded-md p-2 w-48"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Add
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {people.map((name) => (
          <div key={name} className="flex flex-col items-center space-y-2">
            <button
              onClick={() =>
                setClicked((prev) => ({
                  ...prev,
                  [name]: !prev[name],
                }))
              }
              className={`w-24 h-24 rounded-lg shadow-md transition-colors duration-200 ${
                clicked[name] ? "bg-red-500" : "bg-green-500"
              }`}
            ></button>
            <div className="text-lg font-semibold">{name}</div>
            <input
              type="text"
              placeholder="Enter notes..."
              value={notes[name] || ""}
              onChange={(e) =>
                setNotes((prev) => ({
                  ...prev,
                  [name]: e.target.value,
                }))
              }
              className="border rounded-md p-1 w-28 text-sm"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
