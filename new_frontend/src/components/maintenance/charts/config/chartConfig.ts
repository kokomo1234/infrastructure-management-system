
// Configuration for chart colors
export const colors = {
  "UPS": "#2B44FF",          // Videotron blue
  "Système DC": "#4F9DF9",   // Videotron light blue
  "TSW": "#FF4438",          // Videotron red
  "Generatrice": "#0A2239",  // Videotron dark blue
  "Mécanique": "#1A1F2C",    // Videotron black
  "Incendie": "#FF4438",     // Videotron red
  "Complété": "#4F9DF9",     // Videotron light blue
  "Planifié": "#2B44FF",     // Videotron blue
  "En cours": "#FF4438",     // Videotron red
  "En retard": "#0A2239"     // Videotron dark blue
};

export const getChartConfig = () => {
  return {
    ...Object.entries(colors).reduce((acc, [key, value]) => {
      acc[key] = { color: value };
      return acc;
    }, {} as Record<string, { color: string }>),
  };
};
