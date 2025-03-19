const fs = require('fs');

function processData(inputData) {
  const circuits = inputData.split('____________________').filter(circuit => circuit.trim() !== '');
  const processedData = [];

  circuits.forEach(circuit => {
    const lines = circuit.trim().split('\n');
    if (lines.length < 4) return; // Ignoră circuitele incomplete

    const partialLink = lines[0].trim();
    const priceMatch = lines[1].match(/De la (\d+) [€euro]/i);
    const price = priceMatch ? parseInt(priceMatch[1]) : 0;
    const title = lines[2].replace(/^Avion\s+/, '').trim();
    const durationMatch = lines[3].match(/(\d+) nopți/);
    const nights = durationMatch ? parseInt(durationMatch[1]) : 0;

    const dates = lines.slice(4).filter(line => {
      const parts = line.trim().split(' ');
      return parts.length === 2 && !isNaN(parseInt(parts[0]));
    });

    dates.forEach(date => {
      const [day, month] = date.trim().split(' ');
      const monthNumber = getMonthNumber(month);
      if (monthNumber) {
        processedData.push({
          title,
          nights,
          date: `${day.padStart(2, '0')}.${monthNumber}`,
          price,
          link: `https://www.jinfotours.ro/circuite/detalii/${partialLink}`
        });
      } else {
        console.log(`Lună invalidă ignorată: ${month} în circuitul ${partialLink}`);
      }
    });
  });

  return processedData;
}

function getMonthNumber(month) {
  if (!month) return null;
  const months = {
    'ianuarie': '01', 'februarie': '02', 'martie': '03', 'aprilie': '04',
    'mai': '05', 'iunie': '06', 'iulie': '07', 'august': '08',
    'septembrie': '09', 'octombrie': '10', 'noiembrie': '11', 'decembrie': '12'
  };
  return months[month.toLowerCase()] || null;
}

// Citirea datelor din fișier și procesarea lor
try {
  const inputData = fs.readFileSync('input_data.txt', 'utf8');
  const processedData = processData(inputData);

  // Scrierea rezultatelor într-un fișier JSON
  fs.writeFileSync('processed_data.json', JSON.stringify(processedData, null, 2));

  console.log(`Procesarea datelor a fost finalizată. Au fost procesate ${processedData.length} plecări.`);
  console.log('Rezultatele au fost salvate în processed_data.json');
} catch (error) {
  console.error('A apărut o eroare în timpul procesării:', error);
}