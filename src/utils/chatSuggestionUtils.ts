
/**
 * Returns context-based greeting based on the current route and health data
 */
export const getContextBasedIntro = (path: string, healthSummary: string): string => {
  if (path === '/history') {
    return 'Dette er din historikk-side. Jeg kan hjelpe deg å forstå utviklingen i dine helsedata over tid.';
  } else if (path === '/profile') {
    return 'Dette er din profilside. Jeg kan hjelpe deg med innstillinger eller svare på spørsmål om ditt medlemskap.';
  } else if (path.includes('/issue/')) {
    return 'Jeg ser at du utforsker en helseinsikt. Jeg kan hjelpe deg med å forstå hva dette betyr for deg og hvilke tiltak som kan være nyttige.';
  } else if (path.includes('/priority/')) {
    return 'Jeg kan hjelpe deg med å forstå disse helseprioriteringene og gi råd om hvordan du kan håndtere dem.';
  } else {
    // Home page with health summary
    if (healthSummary) {
      return `Hei! Jeg ser at kroppen din jobber med å balansere ${healthSummary}. Skal vi se nærmere på tiltak du kan gjøre i dag?`;
    } else {
      return 'Hei! Jeg er din personlige helseassistent. Hvordan kan jeg hjelpe deg i dag?';
    }
  }
};

/**
 * Returns suggested questions based on current route and health topics
 */
export const getSuggestedQuestions = (path: string, healthTopics: string[]): string[] => {
  // Default questions
  const defaultQuestions = [
    "Hvordan kan jeg forbedre min generelle helse?",
    "Hva betyr koherens-score?",
    "Hvordan bruker jeg denne appen?"
  ];
  
  // If we have health topics, suggest relevant questions
  if (healthTopics.length > 0) {
    const topicQuestions = healthTopics.map(topic => {
      switch (topic) {
        case 'fordøyelse':
          return "Hvilke matvarer kan støtte tarmhelsen min?";
        case 'avgiftning':
          return "Hvordan kan jeg redusere kjemikaliebelastningen min?";
        case 'stress':
          return "Hvilke øvelser kan hjelpe med stresshåndtering?";
        case 'muskel-skjelett':
          return "Hvilke øvelser kan hjelpe med nakke- og ryggspenninger?";
        case 'mikrobiell balanse':
          return "Hvordan kan jeg støtte kroppens naturlige forsvar mot parasitter og sopp?";
        default:
          return `Hva kan jeg gjøre for å bedre ${topic}?`;
      }
    });
    
    return topicQuestions.slice(0, 3);
  }
  
  if (path === '/history') {
    return [
      "Hva betyr trenden i min koherens-score?",
      "Er forbedringene mine på rett spor?",
      "Hvordan kan jeg forstå dataene mine over tid?"
    ];
  } else if (path.includes('/issue/') || path.includes('/priority/')) {
    return [
      "Hva er de beste tiltakene for denne tilstanden?",
      "Hvordan lang tid tar det å se forbedringer?",
      "Hvilke kosttilskudd kan hjelpe med dette?"
    ];
  }
  
  return defaultQuestions;
};
