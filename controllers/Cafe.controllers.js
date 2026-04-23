const Cafe = require('../models/Cafe.models');
const Review = require('../models/Review.models');
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });


exports.getNearbyCafes = async (req, res) => {
  try {
    const { lng, lat, maxPrice, radius } = req.query;

    if (!lng || !lat) {
      return res.status(400).json({ error: 'Missing coordinates' });
    }

    const maxDistance = radius ? parseInt(radius) : 2000;

    let query = {
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: maxDistance
        }
      }
    };

    if (maxPrice) {
      query.priceLevel = { $lte: parseInt(maxPrice) };
    }

    const cafes = await Cafe.find(query).sort({ averageRating: -1 });

    res.status(200).json({
      success: true,
      count: cafes.length,
      data: cafes
    });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.createCafe = async (req, res) => {
  try {
    const cafe = await Cafe.create(req.body);

    res.status(201).json({
      success: true,
      data: cafe
    });
  } catch (error) {
    res.status(400).json({ error: 'Failed to create cafe' });
  }
};

exports.getCafe = async (req, res) => {
  try {
    const cafe = await Cafe.findById(req.params.id);

    if (!cafe) {
      return res.status(404).json({ error: 'Cafe not found' });
    }

    const reviews = await Review.find({ cafe: req.params.id });

    res.status(200).json({
      success: true,
      data: cafe,
      reviews: reviews
    });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.aiSearchCafes = async (req, res) => {
  try {
    const { query, lng, lat, radius } = req.body;

    if (!query || !lng || !lat) {
      return res.status(400).json({ error: 'Missing search query or coordinates' });
    }

    const systemPrompt = `
      You are an AI assistant for a university cafe finder app.
      Your task is to parse the user's natural language search query and extract search parameters.
      Available parameters:
      - "genre": The type of food (e.g., 'Cafe / Bakery', 'tibetan', 'fast food'). Default to undefined if no clear match.
      - "maxPrice": The maximum price level (1 is cheap, 4 is expensive). (integer from 1 to 4). Default to undefined.

      Respond ONLY with a valid JSON object matching this schema exactly, and nothing else:
      {
        "genre": string | null,
        "maxPrice": number | null
      }
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: query }
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0,
      max_tokens: 100,
      response_format: { type: 'json_object' }
    });

    const aiRes = chatCompletion.choices[0]?.message?.content;
    let extractedParams = {};
    if (aiRes) {
      extractedParams = JSON.parse(aiRes);
    }

    const maxDistance = radius ? parseInt(radius) : 2000;

    let mongoQuery = {
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: maxDistance
        }
      }
    };

    if (extractedParams.genre) {
      mongoQuery.genre = { $regex: new RegExp(extractedParams.genre, "i") }; 
    }
    
    if (extractedParams.maxPrice) {
      mongoQuery.priceLevel = { $lte: parseInt(extractedParams.maxPrice) };
    }

    const cafes = await Cafe.find(mongoQuery).sort({ averageRating: -1 });

    res.status(200).json({
      success: true,
      ai_filters: extractedParams,
      count: cafes.length,
      data: cafes
    });
  } catch (error) {
    console.error('AI Search Error:', error);
    res.status(500).json({ error: 'AI Search Processing Failed' });
  }
};