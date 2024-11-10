
'use client';

import React, { useState, Suspense } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Car, Plane, Train, Bike, User, Calculator as CalculatorIcon, MapPin, Loader2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Header from '@/components/Header';
import { CardContent, CardDescription, CardHeader, CardTitle, CardFooter, Card } from '@/components/ui/card';
import toast, { Toaster } from 'react-hot-toast';
import type { LatLngExpression } from 'leaflet';

const ORS_API_KEY = process.env.NEXT_PUBLIC_ORS_API_KEY || '';

const MapComponent = React.lazy(() => import('@/components/MapComponent'));

interface TravelMode {
  id: string;
  name: string;
  icon: React.ElementType;
}

const travelModes: TravelMode[] = [
  { id: 'driving-car', name: 'Driving', icon: Car },
  { id: 'foot-walking', name: 'Walking', icon: User },
  { id: 'cycling-regular', name: 'Cycling', icon: Bike },
  { id: 'train', name: 'Train', icon: Train },
  { id: 'flying', name: 'Flying', icon: Plane },
];

interface DrivingProfile {
  id: string;
  name: string;
}

const drivingProfiles: DrivingProfile[] = [
  { id: 'driving-car', name: 'Car' },
  { id: 'driving-hgv', name: 'Heavy Goods Vehicle' },
  { id: 'driving-electric', name: 'Electric Car' },
];

const emissionFactors: { [key: string]: number } = {
  'driving-car': 0.192,
  'driving-hgv': 0.5,
  'driving-electric': 0.05,
  'foot-walking': 0,
  'cycling-regular': 0,
  'train': 0.041,
  'flying': 0.255,
};

interface EnvironmentalImpact {
  label: string;
  color: string;
}

const getEnvironmentalImpact = (carbonFootprint: number): EnvironmentalImpact => {
  if (carbonFootprint === 0) return { label: 'No Impact', color: 'bg-green-500' };
  if (carbonFootprint < 50) return { label: 'Low Impact', color: 'bg-yellow-500' };
  if (carbonFootprint < 100) return { label: 'Moderate Impact', color: 'bg-orange-500' };
  return { label: 'High Impact', color: 'bg-red-500' };
};

const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33F1', '#33FFF1', '#F1FF33'];

interface RouteResult {
  mode: string;
  icon: React.ElementType;
  distance: string;
  carbonFootprint: string;
  route: number[][];
}

export default function FreeTravelCarbonCalculator() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [results, setResults] = useState<RouteResult[]>([]);
  const [routes, setRoutes] = useState<LatLngExpression[][]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState<number | null>(null);
  const [highestCarbonRouteIndex, setHighestCarbonRouteIndex] = useState<number | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const calculateRoutes = async () => {
    if (!origin || !destination) {
      toast.error('Please enter both origin and destination.');
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading('Calculating routes...');

    try {
      const originCoords = origin.includes(',') 
        ? origin.split(',').map(Number) 
        : await getCoordinates(origin);
      const destCoords = await getCoordinates(destination);

      if (!originCoords || !destCoords) {
        toast.error('Unable to find coordinates for the given locations.');
        return;
      }

      const newResults: RouteResult[] = [];
      const newRoutes: LatLngExpression[][] = [];

      // Calculate routes for all travel modes
      for (const mode of travelModes) {
        if (mode.id.startsWith('driving')) {
          // For driving, calculate routes for all profiles
          for (const profile of drivingProfiles) {
            const result = await calculateRoute(originCoords, destCoords, profile.id);
            if (result) {
              newResults.push({
                ...result,
                mode: `${mode.name} (${profile.name})`,
                icon: mode.icon,
              });
              newRoutes.push(result.route);
            }
          }
        } else {
          const result = await calculateRoute(originCoords, destCoords, mode.id);
          if (result) {
            newResults.push({
              ...result,
              mode: mode.name,
              icon: mode.icon,
            });
            if (mode.id === 'foot-walking' || mode.id === 'cycling-regular') {
              newRoutes.push(result.route);
            }
          }
        }
      }

      // Find the route with the highest carbon emission
      const highestCarbonIndex = newResults.reduce((maxIndex, current, index, array) => 
        parseFloat(current.carbonFootprint) > parseFloat(array[maxIndex].carbonFootprint) ? index : maxIndex
      , 0);

      setResults(newResults);
      setRoutes(newRoutes);
      setHighestCarbonRouteIndex(highestCarbonIndex);
      setSelectedRouteIndex(null); // Reset selected route

      toast.success('Routes calculated successfully!');
    } catch (error) {
      console.error('Error calculating routes:', error);
      toast.error('An error occurred while calculating the routes. Please try again.');
    } finally {
      setIsLoading(false);
      toast.dismiss(loadingToast);
    }
  };

  const calculateRoute = async (originCoords: number[], destCoords: number[], modeId: string) => {
    const url = `https://api.openrouteservice.org/v2/directions/${modeId}?api_key=${ORS_API_KEY}&start=${originCoords.join(',')}&end=${destCoords.join(',')}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const routeData = data.features[0];
      const distance = routeData.properties.segments[0].distance / 1000; // Convert to kilometers
      const carbonFootprint = distance * emissionFactors[modeId];
      const routeCoordinates = routeData.geometry.coordinates.map((coord: number[]): LatLngExpression => [coord[1], coord[0]]);

      return {
        distance: distance.toFixed(2),
        carbonFootprint: carbonFootprint.toFixed(2),
        route: routeCoordinates,
      };
    }
    return null;
  };

  const getCoordinates = async (place: string): Promise<number[] | null> => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.length > 0) {
      return [parseFloat(data[0].lon), parseFloat(data[0].lat)];
    }
    return null;
  };

  const handleGetCurrentLocation = () => {
    setIsLocating(true);
    const locatingToast = toast.loading('Getting your location...');

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`);
            const data = await response.json();
            if (data.address) {
              const city = data.address.city || data.address.town || data.address.village || data.address.hamlet;
              setOrigin(city || `${latitude}, ${longitude}`);
              toast.success(`Location set to ${city || 'your current coordinates'}`);
            } else {
              setOrigin(`${latitude}, ${longitude}`);
              toast.success('Location set to your current coordinates');
            }
          } catch (error) {
            console.error('Error getting nearby city:', error);
            setOrigin(`${latitude}, ${longitude}`);
            toast.success('Location set to your current coordinates');
          }
          setIsLocating(false);
          toast.dismiss(locatingToast);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLocating(false);
          toast.dismiss(locatingToast);
          toast.error('Unable to retrieve your location. Please check your browser settings.');
        }
      );
    } else {
      setIsLocating(false);
      toast.dismiss(locatingToast);
      toast.error('Geolocation is not supported by your browser.');
    }
  };

  return (
    <div>
      <div><Header /></div>
      <div className="min-h-screen bg-green-100 p-6">
        <Toaster position="top-right" />
        <Card className="max-w-6xl mx-auto border-green-200">
          <CardHeader className="bg-green-50 space-y-2">
            <CardTitle className="text-green-800 flex items-center text-3xl">
              <CalculatorIcon className="mr-3 h-8 w-8 text-green-500" />
              Eco-Friendly Travel Carbon Footprint Calculator
            </CardTitle>
            <CardDescription className="text-green-600 text-lg">
              Calculate the carbon footprint of your journey using free APIs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="origin" className="text-green-700">Origin</Label>
                <div className="relative flex items-center">
                  <MapPin className="absolute left-3 text-green-500" />
                  <Input
                    id="origin"
                    placeholder="Enter your starting point"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="pl-10 pr-24 border-green-300 focus:border-green-500 focus:ring-green-500"
                  />
                  <Button
                    onClick={handleGetCurrentLocation}
                    className="absolute right-0 bg-green-600 hover:bg-green-700 text-white"
                    disabled={isLocating}
                  >
                    {isLocating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Current Location"}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination" className="text-green-700">Destination</Label>
                <div className="relative">
                  <MapPin className="absolute top-3 left-3 text-green-500" />
                  <Input
                    id="destination"
                    placeholder="Enter your destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="pl-10 border-green-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>
            <Button onClick={calculateRoutes} className="w-full bg-green-600 hover:bg-green-700 text-white">
              Calculate Routes
            </Button>
            {isLoading && (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
              </div>
            )}
            {!isLoading && results.length > 0 && (
              <div className="grid md:grid-cols-2 gap-6">
                <ScrollArea className="h-[600px] rounded-md border border-green-200 p-4">
                  <div className="space-y-4 pr-4">
                    <Button 
                      onClick={() => setSelectedRouteIndex(null)} 
                      className="w-full mb-4 bg-green-600 hover:bg-green-700 text-white"
                    >
                      Show All Routes
                    </Button>
                    {results.map((result, index) => {
                      const Icon = result.icon;
                      const impact = getEnvironmentalImpact(parseFloat(result.carbonFootprint));
                      return (
                        <Card 
                          key={index} 
                          className={`border-green-200 cursor-pointer ${selectedRouteIndex === index ? 'ring-2 ring-green-500' : ''}`}
                          onClick={() => setSelectedRouteIndex(index)}
                        >
                          <CardHeader className="bg-green-50 pb-2">
                            <CardTitle className="flex items-center text-green-800 text-lg">
                              <Icon className="mr-2 h-5 w-5 text-green-600" />
                              {result.mode}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="bg-white pt-2 space-y-2">
                            <p className="text-green-700">Distance: {result.distance} km</p>
                            <p className="text-green-700">Carbon Footprint: {result.carbonFootprint} kg CO2</p>
                            <Badge className={`${impact.color} text-white`}>
                              {impact.label}
                            </Badge>
                            <div 
                              className="w-6 h-6 rounded-full ml-2" 
                              style={{ backgroundColor: index === highestCarbonRouteIndex ? '#FF0000' : colors[index % colors.length] }}
                            />
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </ScrollArea>
                <div className="h-[600px] rounded-lg overflow-hidden border border-green-300">
                  <Suspense fallback={
                    <div className="flex items-center justify-center h-full bg-green-50">
                      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
                    </div>
                  }>
                    <MapComponent 
                      routes={routes} 
                      selectedRouteIndex={selectedRouteIndex}
                      highestCarbonRouteIndex={highestCarbonRouteIndex}
                    />
                  </Suspense>
                </div>
              </div>
            )}
          </CardContent>
          <Separator className="bg-green-200" />
          <CardFooter className="bg-green-50  mt-6">
            <p className="text-sm text-green-600 flex items-center">
              <AlertCircle className="inline-block mr-2 text-green-500" />
              Carbon footprint calculations are estimates and may vary based on specific vehicles and conditions.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}