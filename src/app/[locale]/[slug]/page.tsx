// File: app/[locale]/[slug]/page.tsx
import { notFound } from 'next/navigation';
import ClientPage from './ClientPage';


type PageProps = {
  params: {
    locale: 'en' | 'es';
    slug: string;
  };
};

const API_BASE_URL = process.env.STRAPI_BASE_URL || 'http://localhost:1337/api';
const populateQuery = `&populate[blocks][on][value.hero-section][populate][backgroundImage]=true
&populate[blocks][on][value.hero-section][populate][amenities][populate]=icon
&populate[blocks][on][value.route-description][populate]=*
&populate[blocks][on][value.unordered-icon-list][populate][list][populate]=icon
&populate[blocks][on][value.pick-up-drop-off-section][populate]=*
&populate[blocks][on][value.faq-list][populate]=*
&populate[banners][populate][bannerContent][populate]=image`;

async function getLocaleData(locale: string, slug: string) {
  const url = `${API_BASE_URL}/landing-pages?filters[slug][$eq]=${slug}&locale=${locale}${populateQuery}`;
  const res = await fetch(url, {
    next: { tags: [`page-${locale}-${slug}`] },
  });

  if (!res.ok) {
    console.error('❌ Failed to fetch from Strapi:', res.status);
    notFound();
  }

  const json = await res.json();

  if (!json || !json.data || json.data.length === 0) {
    notFound();
  }

  const blocks = json.data[0]?.blocks || [];

  return {
    sections: {
      heroSection: blocks.find((b: any) => b.__component === 'value.hero-section'),
      routeDescription: blocks.find((b: any) => b.__component === 'value.route-description'),
      ticketPrice: blocks.find((b: any) => b.__component === 'value.unordered-icon-list' && b.key === 'ticket-price'),
      pickUpDropOffSection: blocks.find((b: any) => b.__component === 'value.pick-up-drop-off-section'),
      faqList: blocks.find((b: any) => b.__component === 'value.faq-list'),
      stopsAndLocations: blocks.find((b: any) => b.__component === 'value.unordered-icon-list' && b.key === 'bus-station'),
      banners: json.data[0]?.banners || [],
    },
  };
}

export async function generateStaticParams() {
  const res = await fetch(`${API_BASE_URL}/landing-pages?populate=*&pagination[pageSize]=100`);
  const json = await res.json();
   console.log('🔁 Generating static params for landing pages', json.data?.length);
  //  console.log(json.data)
  return json.data.map((page: any) => ({
    locale: page.locale,
    slug: page.slug,
  }));
}

export default async function Page({ params }: PageProps) {
  const { locale, slug } = await Promise.resolve(params);

  if (!['en', 'es'].includes(locale)) {
    notFound();
  }

  const data = await getLocaleData(locale, slug);

  return (
    <ClientPage
      locale={locale}
      slug={slug}
      sections={data.sections}
    />
  );
}
