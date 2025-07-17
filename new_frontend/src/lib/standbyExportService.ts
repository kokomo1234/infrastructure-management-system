
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { standbyAssignments, getStandbyPersonById } from "./standbyService";

export const exportStandbyToCSV = () => {
  const headers = ['Date de début', 'Date de fin', 'Personne', 'Email', 'Type'];
  
  const data = standbyAssignments.map(assignment => {
    const person = getStandbyPersonById(assignment.personId);
    return [
      format(assignment.startDate, "P", { locale: fr }),
      format(assignment.endDate, "P", { locale: fr }),
      person?.name || 'Inconnu',
      person?.email || '',
      assignment.isFullWeek ? 'Semaine complète' : 'Journée'
    ];
  });

  const csvContent = [headers, ...data]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `planification-gardes-${format(new Date(), "yyyy-MM-dd")}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportStandbyToPDF = () => {
  // Utiliser une approche simple avec window.print pour générer un PDF
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) return;

  const assignments = standbyAssignments.map(assignment => {
    const person = getStandbyPersonById(assignment.personId);
    return {
      startDate: format(assignment.startDate, "P", { locale: fr }),
      endDate: format(assignment.endDate, "P", { locale: fr }),
      person: person?.name || 'Inconnu',
      email: person?.email || '',
      type: assignment.isFullWeek ? 'Semaine complète' : 'Journée'
    };
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Planification des Gardes</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        h1 { color: #333; }
      </style>
    </head>
    <body>
      <h1>Planification des Gardes</h1>
      <p>Généré le ${format(new Date(), "P 'à' HH:mm", { locale: fr })}</p>
      <table>
        <thead>
          <tr>
            <th>Date de début</th>
            <th>Date de fin</th>
            <th>Personne</th>
            <th>Email</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          ${assignments.map(assignment => `
            <tr>
              <td>${assignment.startDate}</td>
              <td>${assignment.endDate}</td>
              <td>${assignment.person}</td>
              <td>${assignment.email}</td>
              <td>${assignment.type}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
};
