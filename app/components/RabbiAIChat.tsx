export default function RabbiAIChat() {
  return (
    <div className="w-full h-[600px] rounded-2xl overflow-hidden shadow-elevated border border-ink-100 bg-white relative animate-fade-up">
      <div className="absolute inset-0 flex items-center justify-center bg-ink-50 animate-pulse -z-10">
        <span className="text-ink-400 font-medium text-sm">טוען את הרב הווירטואלי...</span>
      </div>
      <iframe
        src="https://widget.rabbiai.app/he/chat/rabbi?display-mode=auto&app=torah-laneshma"
        width="100%"
        height="100%"
        frameBorder="0"
        title="הרב AI - תורה לנשמה"
        className="absolute inset-0 z-10"
      ></iframe>
    </div>
  );
}
