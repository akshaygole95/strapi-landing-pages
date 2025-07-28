'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import BannerRenderer from '../../components/shared/BannerRenderer';
import RichTextRenderer from '../../components/shared/RichTextHelper';

export default function ClientPage({
  locale,
  slug,
  sections,
}: {
  locale: 'en' | 'es';
  slug: string;
  sections: any;
}) {
  const router = useRouter();

  const handleSwitchLocale = (newLocale: 'en' | 'es') => {
    if (locale !== newLocale) {
      router.push(`/${newLocale}/${slug}`);
    }
  };

  const {
    heroSection,
    routeDescription,
    ticketPrice,
    pickUpDropOffSection,
    faqList,
    stopsAndLocations,
    banners,
  } = sections || {};

  return (
    <div>
      {banners?.map((banner: any, index: number) => (
        <div key={index} className="banner">
          <BannerRenderer data={banner} />
        </div>
      ))}

      <div style={{ marginBottom: 20 }}>
        <button onClick={() => handleSwitchLocale('en')} disabled={locale === 'en'}>
          English
        </button>
        <button onClick={() => handleSwitchLocale('es')} disabled={locale === 'es'} style={{ marginLeft: 10 }}>
          Español
        </button>
      </div>

      {heroSection && (
        <section
          className="container-fluid"
          style={{
            backgroundImage: `url(${heroSection?.backgroundImage?.url || ''})`,
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
            <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>{heroSection?.title}</h1>
            <div
              className="amenities-wrapper"
              style={{
                display: 'flex',
                gap: '30px',
                marginTop: '24px',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              {heroSection?.amenities?.map((item: any, index: number) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {item.icon?.url && <Image src={item.icon.url} alt={item.label} width={20} height={20} />}
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {routeDescription && (
        <section className="container">
          <h2 className="section-title text-3xl font-bold text-center mb-6">
            {routeDescription?.title}
          </h2>
          <p className="section-description">{routeDescription?.description}</p>
          <div className="row">
            <div className="col-md-6">
              <img
                src={routeDescription?.image1?.url}
                alt="Image 1"
                className="rounded-lg shadow-md w-full object-cover"
              />
            </div>
            <div className="col-md-6">
              <img
                src={routeDescription?.image2?.url}
                alt="Image 2"
                className="rounded-lg shadow-md w-full object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {ticketPrice && (
        <section className="container ticket-price-section">
          <h2 className="section-title text-3xl font-bold text-center mb-6">
            {ticketPrice?.title}
          </h2>
          {ticketPrice?.list?.map((item: any, index: number) => (
            <ul key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {item.icon?.url && <Image src={item.icon.url} alt={item.label} width={20} height={20} />}
              <span>{item.label}</span>
            </ul>
          ))}
        </section>
      )}

      {pickUpDropOffSection && (
        <section className="container" style={{ padding: '2rem 0' }}>
          <h2 style={{ textAlign: 'center' }}>{pickUpDropOffSection?.title}</h2>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <div style={{ width: '5px', backgroundColor: 'green', minHeight: '1.5rem' }} />
            <div className="rich-text-content">
              <h4>{pickUpDropOffSection?.tripTitle}</h4>
              <RichTextRenderer richTextData={pickUpDropOffSection?.description} />
            </div>
          </div>
        </section>
      )}

      {faqList && (
        <section className="container" style={{ padding: '2rem 0' }}>
          <h2 style={{ textAlign: 'center' }}>{faqList?.title}</h2>
          <ul className="rich-text-content">
            {faqList?.faq?.map((faq: any, index: number) => (
              <li key={index} style={{ marginBottom: '1rem' }}>
                <strong>{faq.question}</strong>
                <RichTextRenderer richTextData={faq.answer} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {stopsAndLocations && (
        <section className="container" style={{ padding: '2rem 0' }}>
          <h2 className="section-title">{stopsAndLocations?.title}</h2>
          <div className="row">
            <div className="col-md-6">
              <ul className="rich-text-content">
                {stopsAndLocations?.list?.map((loc: any, index: number) => (
                  <li key={index} style={{ marginBottom: '1rem' }}>
                    <div className="title-wrapper">
                      {loc.icon?.url && <img src={loc.icon.url} alt="" />}
                      <h3>{loc.label}</h3>
                    </div>
                    <div className="address-wrapper">
                      <p>{loc.address}</p>
                      <button>{loc.buttonTitle}</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-md-6" />
          </div>
        </section>
      )}
    </div>
  );
}
