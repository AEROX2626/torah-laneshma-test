import RabbiAIChat from '../../components/RabbiAIChat';
import { articles } from '../data';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

type Params = Promise<{ slug: string }>;

export default async function ArticlePage(props: { params: Params }) {
  const params = await props.params;
  const article = articles.find((a) => a.slug === params.slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="pt-32 pb-20 min-h-screen relative overflow-hidden bg-[#fbfcfd]">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 relative z-10">
        
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/#content" className="text-ink-500 hover:text-primary-600 font-medium inline-flex items-center gap-2 transition-colors">
            <i className="fas fa-arrow-right text-sm"></i>
            חזרה לכל המאמרים
          </Link>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 md:p-14 shadow-elevated border border-ink-100 reveal-scale active">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-50 text-accent-700 font-bold text-xs tracking-widest uppercase mb-6">
            <i className="fas fa-bookmark"></i>
            <span>{article.category}</span>
          </div>

          <h1 className="font-heading font-black text-3xl md:text-5xl text-ink-950 mb-8 leading-tight">
            {article.title}
          </h1>

          <div className="relative w-full h-[300px] md:h-[450px] mb-12 rounded-[2rem] overflow-hidden shadow-soft">
            <img 
              src={article.image} 
              alt={article.title} 
              className="w-full h-full object-cover"
            />
          </div>

          <div 
            className="prose prose-lg prose-ink max-w-none text-ink-700 font-medium leading-relaxed
                       prose-headings:font-heading prose-headings:font-extrabold prose-headings:text-ink-900 prose-headings:mb-4
                       prose-p:mb-6 prose-strong:text-ink-900"
            dangerouslySetInnerHTML={{ __html: article.content }} 
          />

          
          <div className="mt-16 pt-12 border-t border-ink-100 mb-10">
            <div className="text-center mb-8">
              <h3 className="font-heading font-black text-2xl md:text-3xl text-ink-950 mb-3">�� ��� ����� ������ �� �����?</h3>
              <p className="text-ink-600 font-medium">��� ���������� ���� ���� ����� ��� �� �� ����, ��� ������.</p>
            </div>
            <RabbiAIChat />
          </div>

          <div className="mt-14 pt-10 border-t border-ink-100 flex justify-center">
            <Link href="/#join" className="btn-primary px-8 py-4 rounded-2xl font-bold text-lg inline-flex items-center justify-center gap-3 group">
              <span>זה הזמן לקבוע חברותא</span>
              <i className="fas fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
