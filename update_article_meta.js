const fs = require('fs');
let code = fs.readFileSync('app/articles/[slug]/page.tsx', 'utf8');

const generateMetadata = `
import { Metadata } from 'next';

export async function generateMetadata(
  props: { params: Params }
): Promise<Metadata> {
  const params = await props.params;
  const article = articles.find((a) => a.slug === params.slug);

  if (!article) {
    return {
      title: 'מאמר לא נמצא | תורה לנשמה',
    };
  }

  const articleUrl = \`https://www.torah-laneshma.org/articles/\${article.slug}\`;
  // Clean HTML from abstract for description
  const cleanDescription = article.abstract ? article.abstract.replace(/<[^>]+>/g, '').substring(0, 160) : 'מאמר מרתק מתורה לנשמה - היכנסו לקריאה.';

  return {
    title: \`\${article.title} | תורה לנשמה\`,
    description: cleanDescription,
    authors: [{ name: article.author || 'תורה לנשמה' }],
    openGraph: {
      title: article.title,
      description: cleanDescription,
      url: articleUrl,
      type: 'article',
      publishedTime: article.date,
      images: article.image ? [{ url: article.image }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: cleanDescription,
      images: article.image ? [article.image] : [],
    },
    alternates: {
      canonical: articleUrl,
    }
  };
}
`;

code = code.replace(
  'type Params = Promise<{ slug: string }>;',
  'type Params = Promise<{ slug: string }>;\n' + generateMetadata
);

fs.writeFileSync('app/articles/[slug]/page.tsx', code, 'utf8');
console.log("Updated article metadata");
