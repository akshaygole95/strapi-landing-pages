'use client';

import React, { useEffect, useState } from 'react';
import RichTextRenderer from '../../components/shared/RichTextHelper';

interface BannerContent {
    type: 'image' | 'text' | 'image+text';
    title: string;
    text: string;
    image: { url: string }[];
    imagePosition?: 'left' | 'right';
    isActive: boolean;
    startDate?: string;
    endDate?: string;
    key: string;
}

interface BannerWrapper {
    bannerContent: BannerContent;
}

interface BannerProps {
    data: BannerWrapper;
}

const SharedBanner: React.FC<BannerProps> = ({ data }) => {

    const [visible, setVisible] = useState(true);

    if (!data || !data.bannerContent || !visible) return null;
    
    const banner = data?.bannerContent;
    if (!banner) return null;

    const today = new Date();
    const isActive =
        banner.isActive
    // &&
    // (!banner.startDate || new Date(banner.startDate) <= today) &&
    // (!banner.endDate || new Date(banner.endDate) >= today);

    if (!isActive) return null;

    console.log('BannerRenderer', banner);

    return (
        <div className="banner-wrapper">
            <div key={banner.key} className={banner.type == 'image' ? 'card image-banner' : banner.type == 'image+text' ? 'card image-text-banner' : 'card'} >
                <button
                    className="btn-close position-absolute top-0 end-0 m-2"
                    aria-label="Close"
                    onClick={() => setVisible(false)}
                ></button>
                <div className="row g-0 align-items-center">
                    {banner.type === 'image' && banner.image?.[0]?.url && (
                        <img
                            src={banner.image[0].url}
                            className="img-fluid rounded"
                            alt={banner.title}
                        />
                    )}

                    {banner.type === 'text' && (
                        <div className="card-body">
                            <h5 className="card-title">{banner.title}</h5>
                            <p className="card-text">{banner.text}</p>
                        </div>
                    )}

                    {banner.type === 'image+text' && (
                        <>
                            {banner.imagePosition === 'left' && (
                                <>
                                    <div className="col-md-4">
                                        <img
                                            src={banner.image?.[0]?.url}
                                            className="img-fluid rounded-start"
                                            alt={banner.title}
                                        />
                                    </div>
                                    <div className="col-md-8">
                                        <div className="card-body">
                                            <h5 className="card-title">{banner.title}</h5>
                                            <RichTextRenderer richTextData={Array.isArray(banner.text) ? banner.text : []} />

                                        </div>
                                    </div>
                                </>
                            )}
                            {banner.imagePosition === 'right' && (
                                <>
                                    <div className="col-md-8">
                                        <div className="card-body">
                                            <h5 className="card-title">{banner.title}</h5>
                                            <RichTextRenderer richTextData={Array.isArray(banner.text) ? banner.text : []} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <img
                                            src={banner.image?.[0]?.url}
                                            className="img-fluid rounded-end"
                                            alt={banner.title}
                                        />
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SharedBanner;
