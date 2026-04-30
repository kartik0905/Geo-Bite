const https = require('https');
const fs = require('fs');

// Approximate coordinates for Graphic Era University (Dehradun)
const LAT = 30.2675;
const LON = 77.9959;
// Search within 3 kilometers (3000 meters)
const RADIUS = 3000;

// Overpass QL query to find cafes, restaurants, fast food, and food courts near GEU
const query = `[out:json][timeout:60];
(
  nwr["amenity"~"cafe|restaurant|fast_food|food_court|bar|pub|ice_cream"](around:${RADIUS},${LAT},${LON});
  nwr["shop"~"bakery|pastry|deli|convenience|supermarket|greengrocer|confectionery"](around:${RADIUS},${LAT},${LON});
);
out center;`;
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
          name: element.tags.name || element.tags['name:en'] || `Local ${element.tags.cuisine ? element.tags.cuisine.split(';')[0] : 'Eatery'}`,
          genre: element.tags.cuisine || "Cafe / Bakery",
          averageRating: parseFloat(randomRating),
          priceLevel: randomPrice,
          location: {
            type: "Point",
            coordinates: [
              element.lon || (element.center && element.center.lon),
              element.lat || (element.center && element.center.lat)
            ]
          }
        };
      });

      const finalDataset = formattedCafes;

      // If we don't have enough data for the AI demo, let's generate some synthetic ones nearby within the radius
      if (finalDataset.length < 50) {
        console.log(`⚠️ Only found ${finalDataset.length} real places in OSM. Generating synthetic restaurants for the AI demo...`);
        const needed = 50 - finalDataset.length;
        const cuisines = ['Indian', 'Chinese', 'Italian', 'Fast Food', 'Cafe', 'Bakery', 'North Indian', 'South Indian', 'Continental', 'Beverages'];
        const prefixes = ['The Great', 'Spice', 'Urban', 'Royal', 'Desi', 'Golden', 'Tasty', 'Street', 'Mountain', 'Doon'];
        const suffixes = ['Diner', 'Eatery', 'Bistro', 'Cafe', 'Restaurant', 'Kitchen', 'Point', 'Hub', 'Lounge', 'Delight'];

        for (let i = 0; i < needed; i++) {
          // Generate within ~3km. 1 degree latitude is ~111km. 3km is ~0.027 degrees.
          const randomLat = LAT + (Math.random() - 0.5) * 0.054;
          const randomLon = LON + (Math.random() - 0.5) * 0.054;
          const randomRating = (Math.random() * 2 + 3).toFixed(1);
          const randomPrice = Math.floor(Math.random() * 3) + 1;
          const cuisine = cuisines[Math.floor(Math.random() * cuisines.length)];
          const name = `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${cuisine} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
          
          finalDataset.push({
            name: name,
            genre: cuisine,
            averageRating: parseFloat(randomRating),
            priceLevel: randomPrice,
            location: {
              type: "Point",
              coordinates: [randomLon, randomLat]
            }
          });
        }
      }

      fs.writeFileSync('./geu_cafes_dataset.json', JSON.stringify(finalDataset, null, 2));
      console.log(`✅ Success! Saved ${finalDataset.length} places (real + synthetic) to geu_cafes_dataset.json`);
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
