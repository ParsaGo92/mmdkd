import { useState, useEffect } from 'react';

export function useVisitCounter() {
  const [visitCount, setVisitCount] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading like the original
    setTimeout(() => {
      let visits = parseInt(localStorage.getItem('maniaVisitCount') || '10708');
      visits += 1;
      localStorage.setItem('maniaVisitCount', visits.toString());
      
      // Format with leading zero for display
      const formattedCount = visits.toString().padStart(6, '0');
      setVisitCount(formattedCount);
      setIsLoading(false);
    }, 1500); // 1.5 second delay to mimic original loading
  }, []);

  return { visitCount, isLoading };
}
