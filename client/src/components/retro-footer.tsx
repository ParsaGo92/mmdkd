export default function RetroFooter() {
  return (
    <footer className="retro-border bg-card rounded-lg p-4">
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <button 
          className="hover:text-primary transition-colors"
          data-testid="button-prev"
        >
          ← prev
        </button>
        
        <div className="flex space-x-4">
          <button 
            className="hover:text-primary transition-colors"
            data-testid="link-webring"
          >
            webring
          </button>
          <button 
            className="hover:text-primary transition-colors"
            data-testid="link-json"
          >
            json
          </button>
          <button 
            className="hover:text-primary transition-colors"
            data-testid="link-rss"
          >
            rss
          </button>
        </div>
        
        <button 
          className="hover:text-primary transition-colors"
          data-testid="button-next"
        >
          next →
        </button>
      </div>
    </footer>
  );
}
