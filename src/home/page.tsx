
import React from 'react';

type Section = {
  id: number;
  title: string;
  content: string;
  type: string;
  imageUrl?: string;
};

export default async function HomePage() {

  const res = await fetch("http://localhost:1337/api/sections?populate=*");
  const json = await res.json();
    console.log(json);
  const sections: Section[] = json.data.map((item: any) => {
    const raw = item;
    return {
      id: raw.id,
      title: raw.Title,
      content: raw.Content,
      type: raw.Type,
      imageUrl: raw.Image?.url || raw.Image?.formats?.thumbnail?.url || "",
    };
  });

  return (
    <div className="p-8 space-y-6">
      {sections.map((section) => (
        <div key={section.id} className="border p-4 rounded-md shadow-sm">
          <h2 className="text-xl font-bold">{section.title}</h2>
          <p>{section.content}</p>
          {section.imageUrl && (
            <img
              src={`${section.imageUrl}`}
              alt={section.title}
              className="mt-4 rounded shadow"
            />
          )}
        </div>
      ))}
    </div>
  );
}
