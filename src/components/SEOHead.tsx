import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  canonicalUrl?: string;
  jsonLd?: Record<string, any>;
}

export default function SEOHead({
  title = 'Prime Properties — Luxury Real Estate Pune & Mumbai',
  description = 'Discover exclusive ultra-luxury flats, sea-facing penthouses, and private estates for rent and sale in Mumbai and Pune with Prime Properties.',
  ogImage = '/images/hero_luxury_mumbai_pune_1792781619397.jpg',
  ogType = 'website',
  canonicalUrl,
  jsonLd,
}: SEOHeadProps) {
  useEffect(() => {
    // 1. Update Document Title
    document.title = title;

    // 2. Helper to set or update meta tag
    const setMetaTag = (nameAttr: string, key: string, content: string) => {
      let element = document.querySelector(`meta[${nameAttr}="${key}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(nameAttr, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Description & Standard Tags
    setMetaTag('name', 'description', description);
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', ogImage);

    // Canonical link
    const currentUrl = canonicalUrl || window.location.href;
    setMetaTag('property', 'og:url', currentUrl);
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', currentUrl);

    // 3. Dynamic JSON-LD Structured Data
    const scriptId = 'dynamic-page-jsonld';
    let dynamicScript = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (jsonLd) {
      if (!dynamicScript) {
        dynamicScript = document.createElement('script');
        dynamicScript.id = scriptId;
        dynamicScript.type = 'application/ld+json';
        document.head.appendChild(dynamicScript);
      }
      dynamicScript.textContent = JSON.stringify(jsonLd);
    } else if (dynamicScript) {
      dynamicScript.remove();
    }

    return () => {
      // Clean up dynamic script when component unmounts if desired
      const script = document.getElementById(scriptId);
      if (script) {
        script.remove();
      }
    };
  }, [title, description, ogImage, ogType, canonicalUrl, jsonLd]);

  return null;
}
