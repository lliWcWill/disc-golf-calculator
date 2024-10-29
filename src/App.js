import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Button } from './components/ui/button';

const DiscGolfCalculator = () => {
  const [formInputs, setFormInputs] = useState({
    speed: 7,
    glide: 5,
    turn: -2,
    fade: 2,
  });

  const [activeDiscStats, setActiveDiscStats] = useState(null);
  const [throwStyle, setThrowStyle] = useState("RHBH");

  // Function to generate the flight path based on throw style and input data
  const generateFlightPath = (powerFactor = 1) => {
    if (!activeDiscStats) return '';

    const { turn, fade } = activeDiscStats;
    
    // Starting coordinates for the flight path
    const startX = 200;
    const startY = 500;

    // Adjust turn and fade amounts based on throw style
    let turnAmount = -turn * 70 * powerFactor;
    let fadeAmount = fade * 50 * powerFactor;

    // Flip the path for forehand (RHFH)
    if (throwStyle === "RHFH") {
      turnAmount = -turnAmount;
      fadeAmount = -fadeAmount;
    }

    const midY = startY - (200 * powerFactor);
    const endY = startY - (400 * powerFactor);

    return `
      M ${startX} ${startY}
      C ${startX + turnAmount} ${midY},
        ${startX + turnAmount} ${endY},
        ${startX + turnAmount - fadeAmount} ${endY}
    `;
  };

  const determineStability = (turn, fade) => {
    if (turn < -1) {
      return fade >= 2 ? 'Stable' : 'Understable';
    }
    return fade >= 3 ? 'Overstable' : 'Stable';
  };

  const calculateDistance = (speed, glide, powerFactor = 1) => {
    const baseDistance = speed * 30;
    const glideBonus = glide * 15;
    return Math.round((baseDistance + glideBonus) * powerFactor);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormInputs((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setActiveDiscStats(formInputs);
  };

  const stability = activeDiscStats
    ? determineStability(activeDiscStats.turn, activeDiscStats.fade)
    : null;
  const normalDistance = activeDiscStats
    ? calculateDistance(activeDiscStats.speed, activeDiscStats.glide, 1)
    : null;
  const underDistance = activeDiscStats
    ? calculateDistance(activeDiscStats.speed, activeDiscStats.glide, 0.7)
    : null;
  const overDistance = activeDiscStats
    ? calculateDistance(activeDiscStats.speed, activeDiscStats.glide, 1.3)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <Card className="max-w-7xl mx-auto shadow-xl bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center border-b bg-gradient-to-r from-blue-600 to-indigo-600 p-8">
          <CardTitle className="text-4xl font-bold text-white">
            Disc Golf Flight Path Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Calculator Controls */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="speed" className="text-base">Speed</Label>
                    <Input
                      id="speed"
                      name="speed"
                      type="number"
                      value={formInputs.speed}
                      onChange={handleInputChange}
                      min="1"
                      max="14"
                      className="text-lg h-12"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="glide" className="text-base">Glide</Label>
                    <Input
                      id="glide"
                      name="glide"
                      type="number"
                      value={formInputs.glide}
                      onChange={handleInputChange}
                      min="1"
                      max="7"
                      className="text-lg h-12"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="turn" className="text-base">Turn</Label>
                    <Input
                      id="turn"
                      name="turn"
                      type="number"
                      value={formInputs.turn}
                      onChange={handleInputChange}
                      min="-5"
                      max="1"
                      className="text-lg h-12"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="fade" className="text-base">Fade</Label>
                    <Input
                      id="fade"
                      name="fade"
                      type="number"
                      value={formInputs.fade}
                      onChange={handleInputChange}
                      min="0"
                      max="5"
                      className="text-lg h-12"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full h-12 text-lg">
                  Generate Flight Paths
                </Button>
              </form>
              <div className="flex justify-around mt-6">
                <Button
                  variant="outline"
                  onClick={() => setThrowStyle("RHBH")}
                  className={`text-lg ${throwStyle === "RHBH" ? "bg-blue-500 text-white" : ""}`}
                >
                  RHBH
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setThrowStyle("RHFH")}
                  className={`text-lg ${throwStyle === "RHFH" ? "bg-blue-500 text-white" : ""}`}
                >
                  RHFH
                </Button>
              </div>
            </div>

            {/* Middle Column - Stats */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              {activeDiscStats ? (
                <>
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Flight Characteristics</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-base text-blue-600">Stability</p>
                      <p className="text-2xl font-bold">{stability}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-base text-green-600">Distance</p>
                      <p className="text-2xl font-bold">{normalDistance} ft</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <p className="text-base text-orange-600">Under Power</p>
                      <p className="text-2xl font-bold">{underDistance} ft</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <p className="text-base text-red-600">Over Power</p>
                      <p className="text-2xl font-bold">{overDistance} ft</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400 text-lg">
                  Enter disc specifications to see flight characteristics
                </div>
              )}
            </div>

            {/* Right Column - Graph */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="aspect-square w-full relative">
                <svg viewBox="0 0 500 500" className="w-full h-full">
                  <line x1="200" y1="500" x2="200" y2="20" stroke="#e5e7eb" strokeWidth="1" />
                  <line x1="100" y1="500" x2="100" y2="20" stroke="#e5e7eb" strokeWidth="1" />
                  <line x1="300" y1="500" x2="300" y2="20" stroke="#e5e7eb" strokeWidth="1" />

                  <text x="205" y="250" className="text-sm fill-gray-400">250 ft</text>
                  <text x="205" y="100" className="text-sm fill-gray-400">400 ft</text>

                  {activeDiscStats && (
                    <>
                      <path d={generateFlightPath(0.7)} stroke="#f97316" strokeWidth="3" fill="none" strokeDasharray="5,5" />
                      <path d={generateFlightPath(1)} stroke="#22c55e" strokeWidth="4" fill="none" />
                      <path d={generateFlightPath(1.3)} stroke="#ef4444" strokeWidth="3" fill="none" strokeDasharray="5,5" />

                      <g transform="translate(10, 10)">
                        <line x1="0" y1="0" x2="20" y2="0" stroke="#f97316" strokeWidth="3" strokeDasharray="5,5" />
                        <text x="25" y="5" className="text-sm fill-gray-600">Under Power</text>
                        
                        <line x1="0" y1="20" x2="20" y2="20" stroke="#22c55e" strokeWidth="4" />
                        <text x="25" y="25" className="text-sm fill-gray-600">Normal Power</text>
                        
                        <line x1="0" y1="40" x2="20" y2="40" stroke="#ef4444" strokeWidth="3" strokeDasharray="5,5" />
                        <text x="25" y="45" className="text-sm fill-gray-600">Over Power</text>
                      </g>
                    </>
                  )}
                  <circle cx="200" cy="500" r="4" fill="#000" />
                </svg>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiscGolfCalculator;
