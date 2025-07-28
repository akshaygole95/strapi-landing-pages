// File: src/app/[locale]/home/page.tsx
import React from 'react';

// Required for ISR
export const revalidate = 60; // Revalidate every 60 seconds globally

type StrapiHomePageResponse = {
  data: {
    id: number;
      title: string;
      description: string;
      // Add more fields if needed
  }[];
};

const STRAPI_BASE_URL = process.env.STRAPI_BASE_URL || 'http://localhost:1337/api';

async function getHomePageData(locale: string): Promise<StrapiHomePageResponse> {
  const res = await fetch(`${STRAPI_BASE_URL}/home-pages?locale=${locale}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    next: { revalidate: 60 }, // Optional: can be added per-request or globally via `export const revalidate`
  });

  if (!res.ok) {
    console.error('❌ Failed to fetch from Strapi:', res.status);
    throw new Error('Failed to fetch home page data from Strapi');
  }

  return res.json();
}

export default async function HomePage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } =  params;
  const home = await getHomePageData(locale);

  const pageData = home.data?.[0];

  if (!pageData) {
    return (
      <main className="p-10">
        <h1 className="text-2xl font-bold text-red-600">Content not found</h1>
      </main>
    );
  }

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-4">{pageData.title}</h1>
      <p>{pageData.description}</p>
    </main>
  );
}
