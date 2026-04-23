const https = require('https');
const fs = require('fs');

// Approximate coordinates for Graphic Era University (Dehradun)
const LAT = 30.2675;
const LON = 77.9959;
// Search within 3 kilometers (3000 meters)
const RADIUS = 3000;

// Overpass QL query to find cafes, restaurants, and fast food near GEU
const query = `[out:json][timeout:60];node["amenity"~"cafe|restaurant|fast_food"](around:${RADIUS},${LAT},${LON});out body;`;
const postData = `data=${encodeURIComponent(query)}`;

const options = {
  hostname: 'lz4.overpass-api.de',
  path: '/api/interpreter',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(postData),
    'User-Agent': 'GeobiteCafeSeeder/1.0 (kartik.garg@geu.ac.in)' // Overpass requires a User-Agent
  }
};

console.log(`📡 Fetching real cafes within ${RADIUS}m of Graphic Era University...`);

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      
      if (!json.elements || json.elements.length === 0) {
        console.log('❌ No cafes found in this area on OpenStreetMap. You might need to expand the radius.');
        return;
      }

      const formattedCafes = json.elements.map((element) => {
        const randomRating = (Math.random() * 2 + 3).toFixed(1); // 3.0 to 5.0
        const randomPrice = Math.floor(Math.random() * 3) + 1; // 1 to 3

        return {
          name: element.tags.name || element.tags['name:en'] || "Unnamed Cafe",
          genre: element.tags.cuisine || "Cafe / Bakery",
          averageRating: parseFloat(randomRating),
          priceLevel: randomPrice,
          location: {
            type: "Point",
            coordinates: [element.lon, element.lat]
          }
        };
      });

      const finalDataset = formattedCafes.filter(cafe => cafe.name !== "Unnamed Cafe");

      fs.writeFileSync('./geu_cafes_dataset.json', JSON.stringify(finalDataset, null, 2));
      console.log(`✅ Success! Downloaded ${finalDataset.length} cafes and saved to geu_cafes_dataset.json`);
      console.log(`👉 You can now plug this file into your seeder.js!`);
      
    } catch (err) {
      console.error('❌ Error parsing data. The server returned:');
      console.error(data); // This will print the exact XML error so we see why it failed
    }
  });
});

req.on('error', (err) => {
  console.error('❌ Error fetching from Overpass API:', err.message);
});

req.write(postData);
req.end();
