
// Mock data for charts
export const progressByType = [
  { name: "UPS", completed: 85, total: 100 },
  { name: "Système DC", completed: 72, total: 80 },
  { name: "Generatrice", completed: 65, total: 75 },
  { name: "TSW", completed: 48, total: 60 },
  { name: "Mécanique", completed: 35, total: 50 },
  { name: "Incendie", completed: 25, total: 30 },
];

export const progressByStatus = [
  { name: "Complété", value: 45 },
  { name: "Planifié", value: 30 },
  { name: "En cours", value: 15 },
  { name: "En retard", value: 10 },
];

export const progressByContractor = [
  { 
    name: "MécaFroid Inc.",
    "Complété": 35,
    "En cours": 10,
    "Planifié": 15,
    "En retard": 5
  },
  { 
    name: "Électro-Systèmes Québec",
    "Complété": 28,
    "En cours": 8,
    "Planifié": 12,
    "En retard": 2
  },
  { 
    name: "Sécurité Incendie Plus",
    "Complété": 15,
    "En cours": 5,
    "Planifié": 8,
    "En retard": 3
  }
];

// Generate monthly trend data for status tab
export const statusTrendData = [
  { month: "Jan", "Complété": 15, "En cours": 8, "Planifié": 12, "En retard": 5 },
  { month: "Fév", "Complété": 18, "En cours": 7, "Planifié": 14, "En retard": 4 },
  { month: "Mar", "Complété": 22, "En cours": 6, "Planifié": 10, "En retard": 3 },
  { month: "Avr", "Complété": 25, "En cours": 8, "Planifié": 12, "En retard": 2 },
  { month: "Mai", "Complété": 30, "En cours": 9, "Planifié": 8, "En retard": 4 },
  { month: "Jui", "Complété": 32, "En cours": 7, "Planifié": 10, "En retard": 3 }
];

// Calculate progress percentages
export const getProgressPercentages = () => {
  return progressByType.map(item => ({
    name: item.name,
    percentage: Math.round((item.completed / item.total) * 100)
  }));
};
