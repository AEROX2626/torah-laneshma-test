const fs = require("fs");
let p = fs.readFileSync("app/page.tsx", "utf8");

const oldCode = `  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsModalOpen(true);
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };`;

const newCode = `  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    // Add Web3Forms access key
    formData.append("access_key", process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "YOUR_KEY_HERE");
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

if(p.includes(oldCode)) {
  p = p.replace(oldCode, newCode);
  fs.writeFileSync("app/page.tsx", p, "utf8");
  console.log("Success");
} else {
  console.log("Failed to find exact block. Finding by line array...");
  const lines = p.split('\n');
  const startIdx = lines.findIndex(l => l.includes('const handleFormSubmit = (e: React.FormEvent) => {'));
  if(startIdx > -1) {
    let endIdx = startIdx;
    while(!lines[endIdx].includes('  };') && endIdx < startIdx + 15) {
      endIdx++;
    }
    lines.splice(startIdx, endIdx - startIdx + 1, newCode);
    fs.writeFileSync("app/page.tsx", lines.join('\n'), "utf8");
    console.log("Success via lines splice");
  } else {
    console.log("Could not find start string.");
  }
}
