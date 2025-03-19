const admin = require('firebase-admin');
const fs = require('fs');

// Inițializarea Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Citirea datelor îmbogățite
const enhancedData = JSON.parse(fs.readFileSync('enhanced_data.json', 'utf8'));

async function addOrUpdateTrip(trip) {
  const tripData = {
    ...trip,
    month: parseInt(trip.date.split('.')[1]),
    lastUpdated: admin.firestore.FieldValue.serverTimestamp()
  };

  try {
    const tripId = `${trip.title}_${trip.date}`.replace(/\s+/g, '_').toLowerCase();
    const tripRef = db.collection('trips').doc(tripId);
    const doc = await tripRef.get();

    if (doc.exists) {
      await tripRef.update(tripData);
      console.log(`Actualizat cu succes: ${trip.title} (${trip.date})`);
    } else {
      await tripRef.set(tripData);
      console.log(`Adăugat cu succes: ${trip.title} (${trip.date})`);
    }
  } catch (error) {
    console.error(`Eroare la adăugarea/actualizarea ${trip.title} (${trip.date}):`, error);
  }
}

async function deleteObsoleteTrips(currentTrips) {
  const currentTripIds = new Set(currentTrips.map(trip => 
    `${trip.title}_${trip.date}`.replace(/\s+/g, '_').toLowerCase()
  ));

  const snapshot = await db.collection('trips').get();
  const deletionPromises = [];

  snapshot.forEach(doc => {
    if (!currentTripIds.has(doc.id)) {
      console.log(`Ștergere călătorie obsoletă: ${doc.id}`);
      deletionPromises.push(doc.ref.delete());
    }
  });

  await Promise.all(deletionPromises);
  console.log(`Au fost șterse ${deletionPromises.length} călătorii obsolete.`);
}

async function importOrUpdateAllTrips() {
  for (const trip of enhancedData) {
    await addOrUpdateTrip(trip);
  }
  await deleteObsoleteTrips(enhancedData);
  console.log('Import/actualizare finalizat(ă)');
}

importOrUpdateAllTrips().then(() => {
  process.exit(0);
}).catch(error => {
  console.error('Eroare în timpul importului/actualizării:', error);
  process.exit(1);
});