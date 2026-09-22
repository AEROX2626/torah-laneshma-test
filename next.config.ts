import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Articles Mapping
      { source: '/פרשות-השבוע/פרשת-לך-לך', destination: '/articles/lech-lecha', permanent: true },
      { source: '/פרשות-השבוע/פרשת-נח', destination: '/articles/noah', permanent: true },
      { source: '/פרשות-השבוע/פרשת-וירא', destination: '/articles/vayera', permanent: true },
      { source: '/פרשות-השבוע/מהו-ביטחון-בהשם', destination: '/articles/bitachon', permanent: true },
      { source: '/פרשות-השבוע/הכירו-את-החברותא-הטלפונית-שלנו', destination: '/articles/chavruta', permanent: true },
      { source: '/פרשות-השבוע', destination: '/#content', permanent: true },

      // Adopt an Avrech (Donations)
      { source: '/אמץ-אברך', destination: '/adopt', permanent: true },
      { source: '/100-מהתרומה-ישירות-לאברך', destination: '/adopt', permanent: true },
      { source: '/טופס-הצטרפות-אמץ-אברך', destination: '/adopt', permanent: true },
      { source: '/אפשר-לתרום-ממעשר-כספים', destination: '/adopt', permanent: true },
      { source: '/להיות-שותף-בלימוד-התורה', destination: '/adopt', permanent: true },
      { source: '/אין-צורך-בסכום-חודשי-קבוע', destination: '/adopt', permanent: true },
      { source: '/אמץ-אברך-תרום-עכשיו', destination: '/adopt', permanent: true },
      { source: '/אמץ-אברך-תרום-עכשיו-1', destination: '/adopt', permanent: true },
      { source: '/אמץ-אברך-תרום-עכשיו-2', destination: '/adopt', permanent: true },
      { source: '/אמץ-אברך-תרום-עכשיו-3', destination: '/adopt', permanent: true },
      { source: '/אמץ-אברך-תרום-עכשיו-4', destination: '/adopt', permanent: true },
      { source: '/אמץ-אברך-תרום-עכשיו-5', destination: '/adopt', permanent: true },

      // Home Sections (How it works)
      { source: '/איך-זה-עובד', destination: '/#how', permanent: true },
      { source: '/איך-זה-עובד-1', destination: '/#how', permanent: true },
      { source: '/איך-זה-עובד-2', destination: '/#how', permanent: true },
      { source: '/איך-זה-עובד-3', destination: '/#how', permanent: true },
      { source: '/איך-זה-עובד-4', destination: '/#how', permanent: true },
      { source: '/איך-זה-עובד-5', destination: '/#how', permanent: true },

      // Home Sections (About, FAQ, Join)
      { source: '/מה-זה-חברותא', destination: '/#about', permanent: true },
      { source: '/האם-ה-חברותא-הטלפונית-יחזיר-אותי-בתשובה', destination: '/#faq', permanent: true },
      { source: '/אפשר-להציע-לך-חברותא', destination: '/#join', permanent: true },
      { source: '/השאירו-פרטים-עכשיו', destination: '/#join', permanent: true },

      // Catchall for variants of the main page (Wix duplicates)
      { source: '/חברותא-טלפונית-ללימוד-תורה-ללא-עלות', destination: '/', permanent: true },
      { source: '/חברותא-טלפונית-ללימוד-תורה-ללא-עלות-1', destination: '/', permanent: true },
      { source: '/חברותא-טלפונית-ללימוד-תורה-ללא-עלות-1-1', destination: '/', permanent: true },
      { source: '/חברותא-טלפונית-ללימוד-תורה-ללא-עלות-1-1-1', destination: '/', permanent: true },
      { source: '/חברותא-טלפונית-ללימוד-תורה-ללא-עלות-1-1-1-1', destination: '/', permanent: true }
    ];
  },
};

export default nextConfig;
