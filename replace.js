const fs = require('fs');
const path = 'app/articles/[slug]/page.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/import RabbiAIChat from '\.\.\/\.\.\/components\/RabbiAIChat';\r?\n/, '');

const newSection = `          <div className="mt-16 pt-12 border-t border-ink-100 mb-10">
            <div className="text-center mb-10">
              <h3 className="font-heading font-black text-2xl md:text-3xl text-ink-950 mb-3">מאמרים נוספים עבורך</h3>
              <p className="text-ink-600 font-medium">הנה עוד כמה כתבות שאולי יעניינו אותך להמשך קריאה</p>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {articles.filter((a) => a.slug !== article.slug).slice(0, 2).map((otherArticle) => (
                <Link key={otherArticle.slug} href={\`/articles/\${otherArticle.slug}\`} className="group bg-ink-50 rounded-2xl overflow-hidden border border-ink-100 hover:border-primary-200 flex flex-col h-full transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md">
                  <div className="h-40 overflow-hidden relative">
                    <img src={otherArticle.image} className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700 ease-out" alt={otherArticle.title} />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[10px] font-bold text-primary-600 bg-primary-100/50 px-2.5 py-1 rounded-full">{otherArticle.category}</span>
                    </div>
                    <h4 className="font-heading font-extrabold text-xl text-ink-900 mb-2 group-hover:text-primary-600 transition-colors leading-snug">{otherArticle.title}</h4>
                    <p className="text-ink-600 text-sm font-medium leading-relaxed line-clamp-2">{otherArticle.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>`;

content = content.replace(/<div className="mt-16 pt-12 border-t border-ink-100 mb-10">[\s\S]*?<RabbiAIChat \/>\s*<\/div>/, newSection);

fs.writeFileSync(path, content, 'utf8');
console.log('Done!');
