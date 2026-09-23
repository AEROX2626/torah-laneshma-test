const fs = require("fs");
let p = fs.readFileSync("app/page.tsx", "utf8");

const newHandleForm = `const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    // Add Web3Forms configuration
    formData.append("access_key", process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "YOUR_WEB3FORMS_KEY");
    formData.append("subject", "ליד חדש מהאתר - בקשה לחברותא!");
    formData.append("from_name", "תורה לנשמה");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });
      const data = await response.json();
      
      if (data.success) {
        setIsSubmitting(false);
        setIsModalOpen(true);
        form.reset();
      } else {
        console.error("Form submission failed", data);
        alert("אירעה שגיאה בשליחת הטופס. נסו שוב או פנו אלינו בוואטסאפ.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error(error);
      alert("אירעה שגיאה. בדקו את החיבור לאינטרנט ונסו שוב.");
      setIsSubmitting(false);
    }
  };`;

p = p.replace(/const handleFormSubmit = \(e: React\.FormEvent\) => \{[\s\S]*?\}, 1500\);\n  \};/, newHandleForm);

fs.writeFileSync("app/page.tsx", p, "utf8");
