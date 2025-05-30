import { useEffect, useState } from "react";
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

function AboutGroup({ groupId }) {
  const [group, setGroup] = useState(null);

  useEffect(() => {
    fetch(`${apiUrl}/api/groups/${groupId}`)
      .then((res) => res.json())
      .then((data) => setGroup(data))
      .catch((err) => console.error(err));
  }, [groupId]);

  const renderPoints = (text) => {
    if (!text) return ["No information available."];
    return text
      .split(/\n|•|-/)
      .map((point) => point.trim())
      .filter((point) => point.length > 0);
  };

  if (!group)
    return (
      <div className="text-center text-gray-500 py-10 text-lg font-medium">
        Loading group details...
      </div>
    );

  return (
    <div className="mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <h1 className="text-4xl font-bold text-green-800 mb-4">{group.name}</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-green-700 mb-2">About the Group</h2>
        <ul className="list-disc pl-6 text-gray-700 leading-relaxed space-y-1">
          {renderPoints(group.about).map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      </section>

      {group.description && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-green-700 mb-2">Description</h2>
          <ul className="list-disc pl-6 text-gray-700 leading-relaxed space-y-1">
            {renderPoints(group.description).map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

export default AboutGroup;
