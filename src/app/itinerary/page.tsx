'use client';

import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { Send, MapPin, Calendar, Loader2, Sun, Utensils, Building2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import toast, { Toaster } from 'react-hot-toast';
import Header from '@/components/Header';

interface DayPlan {
  day: string;
  activities: string[];
  description: string;
}

export default function Itinerary() {
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [itinerary, setItinerary] = useState<DayPlan[] | null>(null);
  const [chat, setChat] = useState<any>(null);

  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY || '';
  const MODEL_NAME = 'gemini-2.0-pro-exp-02-05';
  const genAI = new GoogleGenerativeAI(API_KEY);

  const generationConfig = {
    temperature: 0.7,
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
        const newChat = await genAI.getGenerativeModel({ model: MODEL_NAME }).startChat({
          generationConfig,
          safetySettings,
        });
        setChat(newChat);
      } catch{
        setError("Failed to initialize chat. Please try again.");
        toast.error("Failed to initialize chat. Please try again.");
      }
    };
    initChat();
  }, []);

  const handleSubmit = async () => {
    if (!destination.trim() || !days.trim()) {
      setError("Please provide both a destination and number of days.");
      toast.error("Please provide both a destination and number of days.");
      return;
    }

    setLoading(true);
    setError(null);
    const loadingToast = toast.loading('Generating your itinerary...');

    try {
      if (chat) {
        const inputPrompt = `
          You are an expert travel planner. I will give you a destination and number of days for a trip.
          Provide me with a day-by-day travel plan in JSON format with [] only and nothing else, where each day contains keys "day", "activities", and "description".
          The destination is: ${destination}, and the trip lasts ${days} days.
          Respond with only the JSON, no extra text.
        `;

        const result = await chat.sendMessage(inputPrompt);
        const resultText = await result.response.text();

        // Clean up response and parse JSON
        const cleanedResultText = resultText.replace(/```json|```/g, '').trim();
        let parsedItinerary: DayPlan[];
        try {
          parsedItinerary = JSON.parse(cleanedResultText);
          setItinerary(parsedItinerary);
          toast.success('Itinerary generated successfully!');
        } catch (parseError) {
          console.error("JSON parsing error:", parseError);
          setError("Failed to parse travel plan. Please try again.");
          toast.error("Failed to parse travel plan. Please try again.");
          return;
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setError("Failed to get travel plan. Please try again.");
      toast.error("Failed to get travel plan. Please try again.");
    } finally {
      setLoading(false);
      toast.dismiss(loadingToast);
    }
  };

  const getActivityIcon = (activity: string) => {
    const lowercaseActivity = activity.toLowerCase();
    if (lowercaseActivity.includes('visit')) return <MapPin className="h-5 w-5 text-blue-500" />;
    if (lowercaseActivity.includes('dinner') || lowercaseActivity.includes('lunch')) return <Utensils className="h-5 w-5 text-orange-500" />;
    if (lowercaseActivity.includes('temple')) return <Building2 className="h-5 w-5 text-purple-500" />;
    return <Sun className="h-5 w-5 text-yellow-500" />;
  };

  const renderItinerary = () => {
    if (!itinerary || itinerary.length === 0) return null;

    return (
      <div className="mt-8 space-y-6">
        {itinerary.map((dayPlan, index) => (
          <Card key={index} className="bg-white">
            <CardHeader className="bg-green-50 border-b border-green-100">
              <CardTitle className="text-xl font-bold text-green-800 flex items-center">
                <Calendar className="mr-2 h-6 w-6 text-green-600" />
                Day {dayPlan.day}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <ScrollArea className="h-40 w-full">
                <div className="flex flex-col space-y-3">
                  {dayPlan.activities.map((activity, actIndex) => (
                    <div key={actIndex} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      {getActivityIcon(activity)}
                      <span className="text-green-700 font-medium">{activity}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <Separator className="my-4" />
              <CardDescription className="text-base text-gray-700">{dayPlan.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 p-8">
        <Toaster position="top-right" />
        <Card className="max-w-7xl mx-auto bg-white">
          <CardHeader>
            <CardTitle className="text-4xl font-bold text-center text-green-800 flex items-center justify-center">
              <Calendar className="mr-3 h-10 w-10 text-green-600" /> Trip Itinerary Planner
            </CardTitle>
            <CardDescription className="text-xl font-semibold text-center text-gray-600">
              Plan your day-by-day itinerary based on your travel destination and trip duration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mb-8">
              <div className="w-full md:w-2/3">
                <Input
                  id="destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Enter your travel destination..."
                />
              </div>
              <div className="w-full md:w-1/3">
                <Input
                  id="days"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  placeholder="Number of days for your trip"
                />
              </div>
              <Button
                onClick={handleSubmit}
                className="w-full md:w-1/4 bg-green-500 hover:bg-slate-100 hover:text-black text-white"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Send className="mr-2 h-5 w-5" />
                )}
                {loading ? 'Generating Plan...' : 'Create Itinerary'}
              </Button>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {renderItinerary()}
          </CardContent>
        </Card>
      </div>
    </>
  );
}