'use client';
import React, { useEffect, useState } from 'react';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { Send, MapPin, Loader2, Hotel, MapPinned, Leaf } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from '@/components/Header';
interface Hotel {
  name: string;
  price: number;
  address: string;
  carbon_offset: number;
  description: string;
  type: string;
  certifications: string[];
  features: string[];
  rating: string;
  image: string;
}
export default function TravelPlanner() {
  const [destination, setDestination] = useState('');
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chat, setChat] = useState<any>(null);
 
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY || '';
  const MODEL_NAME = 'gemini-1.0-pro-001';
  const genAI = new GoogleGenerativeAI(API_KEY);
  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };
  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];
  useEffect(() => {
    const initChat = async () => {
      try {
        const newChat = await genAI
          .getGenerativeModel({ model: MODEL_NAME })
          .startChat({
            generationConfig,
            safetySettings,
          });
        setChat(newChat);
      } catch {
        setError("Failed to initialize chat. Please try again.");
      }
    };
    initChat();
  }, []);
  const handleSubmit = async () => {
    if (!destination.trim()) {
      setError("Please provide a destination.");
      return;
    }
  
    setLoading(true);
    setError(null);
    try {
      if (chat) {
        const inputPrompt = `
          You are a skilled travel planner. I will provide a destination, and you will give me 5 hotel recommendations in a JSON format with [] only and nothing else before and after those brackets only data fill inside.
          Each hotel should include the following keys: "name", "price" (as a number in Rupees), "address", "carbon_offset" (in kg), "description", "type", "certifications", and "features".
          The destination is: ${destination}.
        `;
  
        const result = await chat.sendMessage(inputPrompt);
        const resultText = await result.response.text();
        
        const cleanedResultText = resultText.replace(/```JSON|```/g, '').trim();
        let parsedHotels: Hotel[];
        try {
          parsedHotels = JSON.parse(cleanedResultText);
          console.log(parsedHotels);
        } catch (parseError) {
          console.error("JSON parsing error:", parseError);
          setError("Failed to parse hotel recommendations. Please try again.");
          return;
        }
  
        // Add random ratings to each hotel
        const hotelsWithRatings = parsedHotels.map(hotel => ({
          ...hotel,
          rating: (Math.random() * (5 - 3.5) + 3.5).toFixed(1), // Random rating between 3.5 and 5
          image: "/placeholder.svg?height=200&width=300" // Placeholder image
        }));
  
        setHotels(hotelsWithRatings);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setError("Failed to get hotel recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <>
    <Header/>
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-green-800 mb-6 flex items-center justify-center">
          <MapPin className="mr-3 h-10 w-10 text-green-600" /> Eco-Friendly Travel Planner
        </h1>
        <h2 className="text-xl font-semibold text-center text-gray-600 mb-8">
          Discover Sustainable Hotels for Your Next Adventure
        </h2>
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mb-8">
          <div className="w-full md:w-3/4">
            <Input
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full rounded-lg border-2 border-green-300 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 bg-white p-3 text-gray-700"
              placeholder="Enter your dream destination..."
            />
          </div>
          <Button
            onClick={handleSubmit}
            className="w-full md:w-1/4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg text-lg px-6 py-3 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Send className="mr-2 h-5 w-5" />
            )}
            {loading ? 'Searching...' : 'Find Hotels'}
          </Button>
        </div>
        {error && (
          <p className="text-center text-red-500 mb-4 bg-red-100 p-3 rounded-lg">{error}</p>
        )}
        <section className="container mx-auto py-16 px-4">
  
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {hotels.map((hotel, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">{hotel.name}</CardTitle>
                  <CardDescription className="flex items-center space-x-2">
                    <MapPinned className="h-4 w-4 text-green-600" />
                    <span>{hotel.address}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-gray-600"><strong>Description:</strong> <br/>{hotel.description}</div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-green-600 flex items-center space-x-2">
                      <span className="font-semibold text-lg">₹{hotel.price}</span>
                    </div>
                    <div className="text-yellow-500 flex items-center space-x-1">
                      <Hotel className="h-5 w-5" />
                      <span>{hotel.rating} / 5</span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center space-x-2">
                    <Leaf className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-500">
                      Carbon offset: {hotel.carbon_offset} kg
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-wrap gap-2">
                  {hotel.certifications.map((cert, certIndex) => (
                    <Badge key={certIndex} variant="outline" className="bg-green-100 text-green-600 border-green-600">
                      {cert}
                    </Badge>
                  ))}
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
    </>
    
  );
}