
export const availableColors = [
  "#3B82F6", // Bleu
  "#10B981", // Turquoise
  "#F59E0B", // Orange
  "#EF4444", // Rouge
  "#8B5CF6", // Violet
  "#06B6D4", // Cyan
  "#84CC16", // Lime
  "#F97316", // Orange foncé
];

export const getUserColor = (userId: string): string => {
  // Génère une couleur cohérente basée sur l'ID utilisateur
  const hash = userId.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const index = Math.abs(hash) % availableColors.length;
  return availableColors[index];
};

export const getWeekColor = (date: Date): string => {
  // Génère une couleur pour la semaine basée sur la date
  const weekNumber = Math.floor(date.getTime() / (1000 * 60 * 60 * 24 * 7));
  const index = weekNumber % availableColors.length;
  return availableColors[index];
};

export const lightenColor = (color: string, amount: number): string => {
  // Éclaircit une couleur hexadécimale
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * amount);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  
  return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255))
    .toString(16).slice(1);
};
