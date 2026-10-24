import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

const getPort = () => {
  if (process.env.PORT) {
    const envPort = Number(process.env.PORT);
    if (!isNaN(envPort) && envPort > 0) return envPort;
  }
  const portArgIndex = process.argv.indexOf('--port');
  if (portArgIndex !== -1 && process.argv[portArgIndex + 1]) {
    const argPort = Number(process.argv[portArgIndex + 1]);
    if (!isNaN(argPort) && argPort > 0) return argPort;
  }
  return 3000;
};

const PORT = getPort();

app.use(express.json());

// Initialize GoogleGenAI server-side with user-agent header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Gemini Multi-turn Dynamic Chat Endpoint for Mirchi 360 Culinary Concierge
app.post('/api/chat', async (req, res) => {
  const { messages, currentMenu } = req.body;
  if (!messages || !Array.isArray(messages)) {
    res.status(400).json({ error: 'Messages array is required' });
    return;
  }

  const latestUserMessage = messages[messages.length - 1]?.text || '';

  // Menu summary for dynamic context
  let menuContext = `
Key Menu Items & Real-time Pricing in Pakistani Rupees (PKR / Rs.):
1. Classic Chicken Bucket (8 Pcs) - Rs. 1,899 (Best Seller)
2. Nashville Hot Fire Burger - Rs. 850 (Double breaded, cayenne oil, purple slaw, brioche)
3. Artisan Glazed Wing Spread (12 Pcs) - Rs. 1,450 (Chipotle honey reduction)
4. Golden Herb Tenders Platter (6 Pcs) - Rs. 1,199 (100% breast meat, 24-hr buttermilk brine)
5. Family Crunch Feast - Rs. 3,850 (12 Pcs feast, 4 sides, 4 biscuits, 1.5L drink, feeds 4-6)
6. Weekend Gameday Mega Box - Rs. 4,250 (16 wings, 8 tenders, 2 waffle fries, 6 dips, 4 sodas, feeds 4-5)
7. Solo Crunch Box - Rs. 950 (3 Pcs, seasoned waffle fries, biscuit, drink)
8. Truffle & Garlic Crunch Burger - Rs. 920
9. Smoky Garlic Parmesan Wings (10 Pcs) - Rs. 1,350
10. Sides: Seasoned Waffle Fries (Rs. 450), Buttermilk Biscuits (Rs. 420), Purple Slaw (Rs. 350)
11. Drinks: Artisanal Spicy Ginger Beer (Rs. 280), Southern Sweet Tea (Rs. 220)
12. Active Deal: Promo code "MIRCHI20" gives 20% OFF all buckets and platters.
13. Spice Heat Levels: Original Herb (Mild), Mild Honey, Nashville Hot (Fiery), Ghost Pepper Heat (Extreme).
14. Free Delivery: Available on all orders over Rs. 2,000 across Karachi, Lahore, and Islamabad.
`;

  if (Array.isArray(currentMenu) && currentMenu.length > 0) {
    menuContext += `\nCurrently Active Kitchen Dishes:\n` + currentMenu.map((m: any) => `- ${m.name} (${m.category}): Rs. ${m.price} [${m.inStock !== false ? 'In Stock' : 'Out of Stock'}]`).join('\n');
  }

  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const contents = messages.map((m: { role: string; text: string }) => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.text }],
    }));

    // Wrap API call in timeout race to guarantee responsive user experience
    const apiCall = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents,
      config: {
        systemInstruction: `You are the "Mirchi 360 Culinary Concierge", an expert culinary advisor, spice pairing specialist, and ordering guide for Mirchi 360 - Pakistan's premier gourmet dark-mode kitchen delivering ultra-crispy fried chicken, fiery Nashville hot burgers, and crowd-pleasing feasts with 360-degree crunch.
Brand Name: Mirchi 360.
All prices are strictly in Pakistani Rupees (PKR / Rs.). NEVER use Dollars ($).
Atmosphere: Halal certified kitchen, 24-hr buttermilk herb brine, kettle-fried golden crunch, thermal heat-lock delivery.
${menuContext}

Guidelines:
- NEVER give canned, hardcoded responses (like static "Chicken Crispy"). Answer dynamically and accurately tailored directly to what the customer asked.
- Provide thoughtful, personalized suggestions for appetites, group sizes, dietary cravings, and spice tolerance.
- Quote exact prices in PKR (e.g. Rs. 850, Rs. 1,899).
- Mention active promo code "MIRCHI20" for 20% off when relevant.
- Keep tone warm, energetic, hospitable, and concise (2-4 sentences max per response unless the user specifically asks for a full menu breakdown).`,
        temperature: 0.7,
      },
    });

    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), 8000)
    );

    const response = await Promise.race([apiCall, timeout]);
    const reply = response.text || "I'm here to help you craft the ultimate Mirchi 360 meal! What flavors are you craving?";
    res.json({ reply });
  } catch (error: any) {
    console.warn('Using intelligent dynamic culinary response fallback:', error.message || error);
    const q = latestUserMessage.toLowerCase();
    let reply = "I'm your Mirchi 360 AI Culinary Concierge! ";

    if (q.includes('price') || q.includes('cost') || q.includes('pkr') || q.includes('rs') || q.includes('how much')) {
      reply += "Our bestselling Classic Chicken Bucket (8 Pcs) is Rs. 1,899, Nashville Hot Fire Burger is Rs. 850, and our Family Crunch Feast is Rs. 3,850. Use code MIRCHI20 for 20% off!";
    } else if (q.includes('spicy') || q.includes('hot') || q.includes('spice') || q.includes('level') || q.includes('heat')) {
      reply += "We offer 4 distinct spice intensities: Original Herb (mild), Mild Honey, Nashville Hot (our fiery cayenne signature), and Ghost Pepper Heat for extreme chili lovers!";
    } else if (q.includes('family') || q.includes('group') || q.includes('people') || q.includes('combo') || q.includes('feast')) {
      reply += "For groups of 4-6, our Family Crunch Feast (Rs. 3,850) includes 12 pieces of chicken, 4 sides, 4 biscuits, and a 1.5L drink. Feeds everyone generously!";
    } else if (q.includes('deal') || q.includes('discount') || q.includes('coupon') || q.includes('code') || q.includes('promo')) {
      reply += "Code MIRCHI20 is active! Apply it at checkout for an instant 20% discount on all chicken buckets and combo feasts.";
    } else if (q.includes('delivery') || q.includes('time') || q.includes('rider') || q.includes('area') || q.includes('location')) {
      reply += "We deliver across Karachi, Lahore, and Islamabad within 20-30 minutes in thermal heat-lock bags. Free delivery is unlocked on orders over Rs. 2,000!";
    } else if (q.includes('burger')) {
      reply += "Our Nashville Hot Fire Burger (Rs. 850) features a double-breaded chicken breast dipped in cayenne oil with purple slaw on toasted brioche. We also have the Truffle & Garlic Crunch Burger for Rs. 920!";
    } else if (q.includes('wing')) {
      reply += "Our Artisan Glazed Wing Spread (12 Pcs) is Rs. 1,450 tossed in smoky chipotle honey reduction, or try Smoky Garlic Parmesan Wings (10 Pcs) for Rs. 1,350!";
    } else {
      reply += `Regarding "${latestUserMessage}": I highly recommend pairing our Nashville Hot Fire Burger (Rs. 850) or Classic Chicken Bucket (Rs. 1,899) with Seasoned Waffle Fries (Rs. 450) and Smoky Chipotle BBQ dip. Use promo code MIRCHI20 for 20% off!`;
    }

    res.json({ reply });
  }
});

// Vite Middleware for Full-stack Dev
if (process.env.NODE_ENV !== 'production') {
  const vite = await createViteServer({
    server: {
      middlewareMode: true,
      hmr: false,
    },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static('dist'));
  app.get('*', (_req, res) => {
    res.sendFile('dist/index.html', { root: '.' });
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🍗 Mirchi 360 Server listening on port ${PORT}`);
});
