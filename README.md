<h1 align="center">Geobite</h1>
<p align="center">
    <img src="https://img.shields.io/badge/React-149ECA.svg?&style=for-the-badge&logo=react&logoColor=white" />
    <img src="https://img.shields.io/badge/Express.js-000000.svg?&style=for-the-badge&logo=express&logoColor=white" />
    <img src="https://img.shields.io/badge/Node.js-339933.svg?&style=for-the-badge&logo=nodedotjs&logoColor=white" />
    <img src="https://img.shields.io/badge/MongoDB-47A248.svg?&style=for-the-badge&logo=mongodb&logoColor=white" />
    <img src="https://img.shields.io/badge/Vite-646CFF.svg?&style=for-the-badge&logo=vite&logoColor=white" />
    <img src="https://img.shields.io/badge/JWT-black.svg?&style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
</p>

Geobite is an intelligent, full-stack location-based application built to help students discover cafes, bakeries, and restaurants specifically around the Graphic Era University (GEU).

The platform enforces campus-specific authentication and utilizes **cutting-edge AI** to process natural language queries, turning conversational searches into instant spatial database queries.

---

## Key Features

- **Geospatial Searching**: Uses MongoDB's powerful `2dsphere` indexes and `$near` queries to automatically find cafes within a configurable radius of the user's live GPS coordinates.
- **AI Smart Search (Groq Integration)**: Integrated with the blazing-fast Groq API running `llama-3.1-8b-instant`. Users can type natural sentences like *"Find me cheap Tibetan food nearby"* and the AI instantly maps the intent directly into active database filters.
- **Campus-Restricted Auth**: JWT-based user authentication that strictly verifies registrations ensuring only `@geu.ac.in` emails are permitted.
- **Live Map Data Pipeline**: Includes an integrated script (`fetch_cafes.js`) that queries OpenStreetMap's Overpass API to pull live geographic data and inject it straight into the database via the local JSON seeder.
- **Premium Frontend**: A reactive, modern user interface built using React, Vite, and highly interactive components powered by `lucide-react` icons.

## Technology Stack

- **Frontend**: React.js, Vite, Tailwind CSS (assumed design system)
- **Backend / API**: Node.js, Express.js
- **Database**: MongoDB (Mongoose, GeoJSON support)
- **AI Processing**: Groq SDK (LPU-native inference pipeline)

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB installed locally or a valid `MONGO_URI`
- A free API key from [Groq](https://console.groq.com/keys)

### 1. Environment Setup
Create a `.env` file in the root backend directory:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/geobite
JWT_SECRET=your_jwt_secret_token_here
JWT_EXPIRE=30d
GROQ_API_KEY=gsk_your_groq_api_key_here
```

### 2. Install Dependencies

**For Backend:**
```bash
npm install
```

**For Frontend:**
```bash
cd frontend
npm install
```

### 3. Seed the Database
To fetch the campus cafes and load them into MongoDB, run:
```bash
# Optional: re-fetch from OpenStreetMap limits
# node fetch_cafes.js 

# Push the dataset to MongoDB
node seeder.js
```

### 4. Run the Application

Start the **Backend server** (from the root directory):
```bash
npm run dev
```

Start the **Frontend client** (from the `/frontend` directory):
```bash
npm run dev
```

The React app will typically run on `http://localhost:5173` while the server API hums away on `http://localhost:3000`.

---
*Built with ❤️ by Kartik Garg.*
