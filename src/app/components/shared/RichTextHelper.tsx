// components/RichTextRenderer.tsx
'use client';

import React from 'react';

interface RichTextBlock {
  type: string;
  children?: RichTextChild[];
}

interface RichTextChild {
  type: string;
  text?: string;
  bold?: boolean;
  url?: string;
  children?: RichTextChild[];
}

interface RichTextRendererProps {
  richTextData: RichTextBlock[];
}

const RichTextRenderer: React.FC<RichTextRendererProps> = ({ richTextData }) => {
  if (!richTextData || !Array.isArray(richTextData)) return null;

  return (
    <>
      {richTextData.map((block, index) => {
        if (block.type === 'paragraph') {
          return (
            <p key={index}>
              {block.children?.map((child, i) => {
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
                      {child.children?.map((linkChild, j) => (
                        <span key={j}>{linkChild.text}</span>
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
      })}
    </>
  );
};

export default RichTextRenderer;
