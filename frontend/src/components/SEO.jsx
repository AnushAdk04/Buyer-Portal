import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, image, url, type = 'website', schema }) => {
  const defaultTitle = 'Buyer Portal - Real Estate Platform';
  const defaultDesc = 'Discover, compare, and connect with sellers. The ultimate platform to find your next home, apartment, or land in Nepal.';
  const defaultImage = '/og-image.jpg'; // This assumes there's an image at public/og-image.jpg

  const seoTitle = title ? `${title} | Buyer Portal` : defaultTitle;
  const seoDesc = description || defaultDesc;
  const seoImage = image || defaultImage;
  const seoUrl = url || window.location.href;

  return (
    <Helmet>
      {/* Basic HTML Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDesc} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDesc} />
      <meta property="og:image" content={seoImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={seoUrl} />
      <meta property="twitter:title" content={seoTitle} />
      <meta property="twitter:description" content={seoDesc} />
      <meta property="twitter:image" content={seoImage} />

      {/* JSON-LD Schema */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
