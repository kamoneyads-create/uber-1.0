
import { GoogleGenAI, Type } from "@google/genai";

// Banco de Dados de Viagens Programadas com endereços detalhados
const TRIP_DATABASE: Record<string, any[]> = {
  'São Paulo': [
    { 
      passengerName: 'Mariana Silva', p: 22.40, dist: '2.1 km', t: '6 min', tripDist: '8.2 km', tripDur: '15 min', 
      pickup: 'Rua das Flores, 123, Jardins, São Paulo - SP', 
      dest: 'Av. Paulista, 1000, Bela Vista, São Paulo - SP' 
    },
    { 
      passengerName: 'Ricardo Oliveira', p: 45.30, dist: '4.5 km', t: '12 min', tripDist: '14.8 km', tripDur: '28 min', 
      pickup: 'Rua Augusta, 1500, Consolação, São Paulo - SP', 
      dest: 'Praça Comandante Linneu Gomes, s/n, Aeroporto, São Paulo - SP' 
    },
    { 
      passengerName: 'Beatriz Costa', p: 15.20, dist: '0.8 km', t: '3 min', tripDist: '4.2 km', tripDur: '10 min', 
      pickup: 'Rua Oscar Freire, 800, Pinheiros, São Paulo - SP', 
      dest: 'Av. Pedro Álvares Cabral, s/n, Ibirapuera, São Paulo - SP' 
    }
  ],
  'Rio de Janeiro': [
    { 
      passengerName: 'Carlos Eduardo', p: 18.90, dist: '1.2 km', t: '4 min', tripDist: '5.5 km', tripDur: '12 min', 
      pickup: 'Av. Atlântica, 500, Copacabana, Rio de Janeiro - RJ', 
      dest: 'Av. Afrânio de Melo Franco, 290, Leblon, Rio de Janeiro - RJ' 
    },
    { 
      passengerName: 'Ana Paula', p: 52.00, dist: '3.8 km', t: '10 min', tripDist: '18.5 km', tripDur: '35 min', 
      pickup: 'Rua General Osório, 22, Ipanema, Rio de Janeiro - RJ', 
      dest: 'Av. Vinte de Janeiro, s/n, Galeão, Rio de Janeiro - RJ' 
    },
    { 
      passengerName: 'Lucas Santos', p: 12.50, dist: '0.5 km', t: '2 min', tripDist: '3.1 km', tripDur: '8 min', 
      pickup: 'Praça Mauá, 1, Centro, Rio de Janeiro - RJ', 
      dest: 'Av. Mem de Sá, 10, Lapa, Rio de Janeiro - RJ' 
    }
  ],
  'Belo Horizonte': [
    { 
      passengerName: 'Juliana Mendes', p: 21.30, dist: '2.5 km', t: '7 min', tripDist: '7.4 km', tripDur: '16 min', 
      pickup: 'Av. Afonso Pena, 1200, Centro, Belo Horizonte - MG', 
      dest: 'Praça da Liberdade, s/n, Savassi, Belo Horizonte - MG' 
    },
    { 
      passengerName: 'Felipe Rocha', p: 38.60, dist: '5.2 km', t: '14 min', tripDist: '13.2 km', tripDur: '25 min', 
      pickup: 'Rua da Bahia, 300, Lourdes, Belo Horizonte - MG', 
      dest: 'Av. Antônio Abrahão Caram, 1001, São José, Belo Horizonte - MG' 
    },
    { 
      passengerName: 'Isabela Lima', p: 14.80, dist: '1.5 km', t: '5 min', tripDist: '4.8 km', tripDur: '11 min', 
      pickup: 'Av. do Contorno, 4500, Funcionários, Belo Horizonte - MG', 
      dest: 'Av. Otacílio Negrão de Lima, 3000, Pampulha, Belo Horizonte - MG' 
    }
  ]
};

const GENERIC_TRIPS = [
  { 
    passengerName: 'João Silva', p: 15.00, dist: '1.0 km', t: '3 min', tripDist: '4.0 km', tripDur: '10 min', 
    pickup: 'Rua Central, 100, Bairro Novo, {CITY}', 
    dest: 'Av. das Américas, 500, Centro, {CITY}' 
  },
  { 
    passengerName: 'Fernanda Lima', p: 30.00, dist: '3.0 km', t: '8 min', tripDist: '10.0 km', tripDur: '20 min', 
    pickup: 'Rua do Comércio, 50, Vila Real, {CITY}', 
    dest: 'Terminal Rodoviário, 10, Centro, {CITY}' 
  },
  { 
    passengerName: 'Gabriel Costa', p: 22.00, dist: '2.0 km', t: '5 min', tripDist: '7.0 km', tripDur: '15 min', 
    pickup: 'Praça da Matriz, 10, Centro Histórico, {CITY}', 
    dest: 'Rua das Palmeiras, 200, Parque das Aves, {CITY}' 
  }
];

export const generateTripRequest = async (city: string, tripType: string, lastIndex?: number) => {
  const timestamp = Date.now();
  
  // Lógica para evitar repetição sequencial
  let seed: number;
  if (lastIndex !== undefined) {
    const availableIndices = [0, 1, 2].filter(idx => idx !== lastIndex);
    seed = availableIndices[Math.floor(Math.random() * availableIndices.length)];
  } else {
    seed = Math.floor(Math.random() * 3);
  }
  
  const cityTrips = TRIP_DATABASE[city] || GENERIC_TRIPS;
  const rawTrip = cityTrips[seed] || cityTrips[0];
  
  // Garante que o nome da cidade apareça corretamente nos endereços, 
  // mesmo que o motorista mude a cidade no cadastro
  const pickupAddress = rawTrip.pickup.replace('{CITY}', city);
  const destAddress = rawTrip.dest.replace('{CITY}', city);
  
  const priceVariation = 0.98 + Math.random() * 0.04;
  
  return {
    id: `TRIP-${city.substring(0,3).toUpperCase()}-${timestamp}-${seed}`,
    passengerName: rawTrip.passengerName,
    rating: Number((4.7 + Math.random() * 0.3).toFixed(2)),
    ratingCount: Math.floor(Math.random() * 200) + 15,
    distanceToPickup: rawTrip.dist,
    timeToPickup: rawTrip.t,
    tripDistance: rawTrip.tripDist,
    duration: rawTrip.tripDur,
    price: (rawTrip.p * priceVariation),
    pickup: pickupAddress,
    destination: destAddress,
    type: tripType,
    index: seed
  };
};

export const getCityCoords = async (city: string): Promise<[number, number]> => {
  const fallbacks: Record<string, [number, number]> = {
    'São Paulo': [-23.5505, -46.6333],
    'Rio de Janeiro': [-22.9068, -43.1729],
    'Belo Horizonte': [-19.9167, -43.9345],
    'Curitiba': [-25.4297, -49.2719],
    'Brasília': [-15.793889, -47.882778]
  };

  if (fallbacks[city]) return fallbacks[city];

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    // Refine: use responseSchema for structured data as recommended.
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Coordenadas geográficas (latitude e longitude) de ${city}, Brasil.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            lat: { type: Type.NUMBER },
            lng: { type: Type.NUMBER }
          },
          required: ["lat", "lng"]
        }
      }
    });
    // Correct extraction method: use property .text directly.
    const text = response.text || "{}";
    const data = JSON.parse(text);
    return [data.lat || -23.5505, data.lng || -46.6333];
  } catch (error) {
    return [-23.5505, -46.6333];
  }
};

export const getDriverAdvice = async (query: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        systemInstruction: "Você é um assistente virtual para motoristas da Uber. Forneça respostas curtas, úteis e profissionais em português.",
      }
    });
    // Correct method: property access .text (not a method).
    return response.text || "Desculpe, não consegui processar sua solicitação.";
  } catch (error) {
    return "Estou com dificuldades de conexão, mas posso te ajudar com o que está salvo localmente.";
  }
};
