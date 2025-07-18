'use client';
import Image from 'next/image';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname, useParams } from 'next/navigation';


type Props = {
  params: {
    locale: string;
    slug: string;
  };
};

const API_BASE_URL = 'http://localhost:1337/api';
const populateQuery = `&populate[blocks][on][value.hero-section][populate][backgroundImage]=true
&populate[blocks][on][value.hero-section][populate][amenities][populate]=icon
&populate[blocks][on][value.route-description][populate]=*
&populate[blocks][on][value.unordered-icon-list][populate][list][populate]=icon
&populate[blocks][on][value.pick-up-drop-off-section][populate]=*
&populate[blocks][on][value.faq-list][populate]=*`;

async function getLocaleData(locale: any, slug: any) {
  // const slug = 'nyc-to-ithaca';
  const url = `${API_BASE_URL}/landing-pages?filters[slug][$eq]=${slug}&locale=${locale}${populateQuery}`;
  const res = await fetch(url);
  const json = await res.json();
  console.log('pageData', json)
  return json;
}

function richTextHelper(data: any) {
  return data.map((block: any, index: number) => {
    if (block.type === 'paragraph') {
      return (
        <p key={index} style={{ marginBottom: '1rem' }}>
          {block.children?.map((child: any, i: number) => {
            if (child.type === 'text') {
              return (
                <span key={i} style={{ fontWeight: child.bold ? 'bold' : 'normal' }}>
                  {child.text}
                </span>
              );
            }

            if (child.type === 'link') {
              return (
                <a
                  key={i}
                  href={child.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {child.children?.map((linkChild: any, j: number) => (
                    <span
                      key={j}

                    >
                      {linkChild.text}
                    </span>
                  ))}
                </a>
              );
            }

            return null;
          })}
        </p>
      );
    }

    return null;
  });
}

export default function HomePage() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();

  const { locale, slug } = params as { locale: 'en' | 'es'; slug: string };
  const [sections, setSections] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getLocaleData(locale, slug).then((json) => {
      const blocks = json.data[0]?.blocks || [];

      setSections({
        heroSection: blocks.find((b: any) => b.__component === 'value.hero-section'),
        routeDescription: blocks.find((b: any) => b.__component === 'value.route-description'),
        ticketPrice: blocks.find((b: any) => b.__component === 'value.unordered-icon-list' && b.key === 'ticket-price'),
        pickUpDropOffSection: blocks.find((b: any) => b.__component === 'value.pick-up-drop-off-section'),
        faqList: blocks.find((b: any) => b.__component === 'value.faq-list'),
        stopsAndLocations: blocks.find((b: any) => b.__component === 'value.unordered-icon-list' && b.key === 'bus-station'),
      });

      setLoading(false);
    });
  }, [locale, slug]);

  const handleSwitchLocale = (newLocale: 'en' | 'es') => {
    if (locale !== newLocale) {
      router.push(`/${newLocale}/${slug}`);
    }
  };

  if (loading || !sections) return <p>Loading...</p>;

  const { heroSection, routeDescription, ticketPrice, pickUpDropOffSection, faqList, stopsAndLocations } = sections;

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => handleSwitchLocale('en')} disabled={locale === 'en'}>English</button>
        <button onClick={() => handleSwitchLocale('es')} disabled={locale === 'es'} style={{ marginLeft: 10 }}>Español</button>
      </div>


      {heroSection &&
        <section className='container-fluid'
          style={{
            backgroundImage: `url(${heroSection.backgroundImage.url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '512px',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
            }}
          ></div>

          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>{heroSection.title}</h1>

            <div className='amenities-wrapper'
              style={{
                display: 'flex',
                gap: '30px',
                marginTop: '24px',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              {heroSection.amenities.map((item: any, index: any) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {item.icon?.url && (
                    <Image
                      src={item.icon.url}
                      alt={item.label}
                      width={20}
                      height={20}
                    />
                  )}
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      }

      {routeDescription &&
        <section className="container">
          <h2 className="section-title text-3xl font-bold text-center mb-6">
            {routeDescription.title}
          </h2>
          <div className="text-gray-700 text-base leading-7 space-y-5 mb-10">
            <p className='section-description'>{routeDescription.description}</p>
          </div>

          <div className="row">
            <div className="col-md-6">
              <img
                src={routeDescription.image1.url}
                alt="Waterfall near Ithaca"
                className="rounded-lg shadow-md w-full object-cover"
              />
            </div>
            <div className="col-md-6">
              <img
                src={routeDescription.image2.url}
                alt="Cornell University Building"
                className="rounded-lg shadow-md w-full object-cover"
              />
            </div>
          </div>
        </section>
      }

      {ticketPrice &&
        <section className="container ticket-price-section">
          <h2 className="section-title text-3xl font-bold text-center mb-6">
            {ticketPrice.title}
          </h2>
          {ticketPrice.list.map((item: any, index: any) => (
            <ul key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {item.icon?.url && (
                <Image
                  src={item.icon.url}
                  alt={item.label}
                  width={20}
                  height={20}
                />
              )}
              <span>{item.label}</span>
            </ul>
          ))}
        </section>
      }

      {pickUpDropOffSection &&
        <section className='container' style={{ padding: '2rem 0' }}>
          <h2 style={{ textAlign: 'center' }}>{pickUpDropOffSection.title}</h2>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginTop: '2rem' }}>
            <div style={{
              width: '5px',
              backgroundColor: 'green',
              height: '100%',
              minHeight: '1.5rem'
            }} />
            <div className='rich-text-content'>
              <h4>{pickUpDropOffSection.tripTitle}</h4>
              {richTextHelper(pickUpDropOffSection.description)}
            </div>
          </div>
        </section>
      }


      {faqList &&
        <section className='container' style={{ padding: '2rem 0' }}>
          <h2 style={{ textAlign: 'center' }}>{faqList.title}</h2>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginTop: '2rem' }}>

            <ul className='rich-text-content'>
              {faqList.faq.map((faq: any, index: any) => (
                <li key={index} style={{ marginBottom: '1rem' }}>
                  <strong>{faq.question}</strong>
                  {richTextHelper(faq.answer)}
                </li>
              )
              )}

            </ul>
          </div>
        </section >
      }


      {stopsAndLocations &&
        <section className='container' style={{ padding: '2rem 0' }}>
          <h2 className='section-title'>{stopsAndLocations.title}</h2>

          <div className='row'>
            <div className='col-md-6'>
              <ul className='rich-text-content'>
                {stopsAndLocations.list.map((loc: any, index: any) => (
                  <li key={index} style={{ marginBottom: '1rem' }}>
                    <div className='title-wrapper'>
                      <img src={loc.icon.url} alt="" />
                      <h3>{loc.label}</h3>
                    </div>
                    <div className='address-wrapper'>
                      <p>{loc.address}</p>
                      <button>{loc.buttonTitle}</button>
                    </div>
                  </li>
                )
                )}

              </ul>
            </div>
            <div className='col-md-6'></div>

          </div>
        </section >
      }

    </div>
  );
}
