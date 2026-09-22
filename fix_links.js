const fs = require("fs");
let p = fs.readFileSync("app/page.tsx", "utf8");

const slugs = ["bitachon", "chavruta", "lech-lecha", "noah", "vayera", "bereshit"];

let splitPoint = p.indexOf("טעימה מהלימוד");
if (splitPoint !== -1) {
  let before = p.substring(0, splitPoint);
  let after = p.substring(splitPoint);
  
  const searchStr = '<a href="#join" onClick={(e) => scrollToSection(e, "#join")} className="group bg-white';
  
  for (let i = 0; i < slugs.length; i++) {
    const replaceStr = `<Link href="/articles/${slugs[i]}" className="group bg-white`;
    after = after.replace(searchStr, replaceStr);
  }

  const closeSearchStr = '<i className="fas fa-arrow-left mt-0.5 text-xs"></i>\n                </div>\n              </div>\n            </a>';
  const closeSearchStr2 = '<i className="fas fa-arrow-left mt-0.5 text-xs"></i>\r\n                </div>\r\n              </div>\r\n            </a>';
  
  for (let i = 0; i < slugs.length; i++) {
    after = after.replace(closeSearchStr, '<i className="fas fa-arrow-left mt-0.5 text-xs"></i>\n                </div>\n              </div>\n            </Link>');
    after = after.replace(closeSearchStr2, '<i className="fas fa-arrow-left mt-0.5 text-xs"></i>\r\n                </div>\r\n              </div>\r\n            </Link>');
  }

  p = before + after;
}

fs.writeFileSync("app/page.tsx", p);
