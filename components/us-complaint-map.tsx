"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ComposableMap, 
  Geographies, 
  Geography,
  ZoomableGroup 
} from "react-simple-maps"
import { scaleQuantize } from "d3-scale"
import { MapPin, TrendingUp, AlertTriangle, Building2 } from "lucide-react"

interface State {
  id: string
  name: string
  abbreviation: string
  complaint_count: number
}

interface USComplaintMapProps {
  states: State[]
}

// Comprehensive US complaint data by state and major cities
const stateComplaintData: Record<string, number> = {
  // Top 10 States
  CA: 2847, TX: 2134, FL: 1892, NY: 1654, IL: 987,
  PA: 876, OH: 765, GA: 743, NC: 698, MI: 654,
  // Mid-tier states
  AZ: 612, WA: 589, MA: 534, VA: 512, NJ: 498,
  TN: 456, MD: 423, CO: 398, MN: 387, MO: 365,
  WI: 343, SC: 321, AL: 523, LA: 287, KY: 265,
  OR: 254, OK: 243, CT: 232, IA: 221, NV: 210,
  AR: 198, MS: 187, KS: 176, UT: 165, NM: 154,
  NE: 143, WV: 132, ID: 121, HI: 110, NH: 98,
  ME: 87, RI: 76, MT: 65, DE: 54, SD: 43,
  ND: 32, AK: 28, VT: 25, WY: 21, DC: 156
}

// Major city complaints
const cityCityComplaintsData: Record<string, { complaints: number; state: string }> = {
  // California
  "Los Angeles, CA": { complaints: 523, state: "CA" },
  "San Francisco, CA": { complaints: 412, state: "CA" },
  "San Diego, CA": { complaints: 321, state: "CA" },
  "Oakland, CA": { complaints: 245, state: "CA" },
  // Texas
  "Houston, TX": { complaints: 456, state: "TX" },
  "Dallas, TX": { complaints: 389, state: "TX" },
  "Austin, TX": { complaints: 312, state: "TX" },
  "San Antonio, TX": { complaints: 267, state: "TX" },
  // Florida
  "Miami, FL": { complaints: 478, state: "FL" },
  "Tampa, FL": { complaints: 323, state: "FL" },
  "Jacksonville, FL": { complaints: 287, state: "FL" },
  "Orlando, FL": { complaints: 234, state: "FL" },
  // New York
  "New York, NY": { complaints: 834, state: "NY" },
  "Buffalo, NY": { complaints: 189, state: "NY" },
  "Rochester, NY": { complaints: 145, state: "NY" },
  // Illinois
  "Chicago, IL": { complaints: 567, state: "IL" },
  // Pennsylvania
  "Philadelphia, PA": { complaints: 412, state: "PA" },
  "Pittsburgh, PA": { complaints: 267, state: "PA" },
  // Ohio
  "Columbus, OH": { complaints: 267, state: "OH" },
  "Cleveland, OH": { complaints: 234, state: "OH" },
  "Cincinnati, OH": { complaints: 198, state: "OH" },
  // Georgia
  "Atlanta, GA": { complaints: 423, state: "GA" },
  // North Carolina
  "Charlotte, NC": { complaints: 289, state: "NC" },
  "Raleigh, NC": { complaints: 234, state: "NC" },
  // Michigan
  "Detroit, MI": { complaints: 334, state: "MI" },
  // Arizona
  "Phoenix, AZ": { complaints: 389, state: "AZ" },
  // Washington
  "Seattle, WA": { complaints: 312, state: "WA" },
  // Massachusetts
  "Boston, MA": { complaints: 289, state: "MA" },
  // Virginia
  "Virginia Beach, VA": { complaints: 234, state: "VA" },
  // New Jersey
  "Newark, NJ": { complaints: 267, state: "NJ" },
  // Tennessee
  "Nashville, TN": { complaints: 234, state: "TN" },
  "Memphis, TN": { complaints: 189, state: "TN" },
  // Alabama - FOCUS AREA
  "Mobile, AL": { complaints: 523, state: "AL" },
  "Birmingham, AL": { complaints: 234, state: "AL" },
  "Montgomery, AL": { complaints: 145, state: "AL" },
}

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"

const colorScale = scaleQuantize<string>()
  .domain([0, 3000])
  .range([
    "#1e1e2e",
    "#2a2a3e",
    "#3a3a4e",
    "#4a4a5e",
    "#5a5a6e",
    "#dc2626",
    "#b91c1c",
    "#991b1b",
  ])

export function USComplaintMap({ states }: USComplaintMapProps) {
  const [selectedState, setSelectedState] = useState<string | null>(null)
  const [tooltipContent, setTooltipContent] = useState("")
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

  const getStateData = (abbr: string) => {
    return {
      complaints: stateComplaintData[abbr] || 0,
      name: states.find(s => s.abbreviation === abbr)?.name || abbr,
    }
  }

  const topStates = Object.entries(stateComplaintData)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Map */}
      <div className="lg:col-span-2">
        <Card className="bg-card border-border overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Interactive Complaint Map
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 relative">
            <div className="aspect-[4/3] w-full">
              <ComposableMap
                projection="geoAlbersUsa"
                projectionConfig={{
                  scale: 1000,
                }}
                className="w-full h-full"
              >
                <ZoomableGroup center={[-97, 38]} zoom={1}>
                  <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                      geographies.map((geo) => {
                        const stateAbbr = geo.properties.name
                        const stateData = getStateData(stateAbbr)
                        const complaints = stateComplaintData[stateAbbr] || 0
                        
                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill={colorScale(complaints)}
                            stroke="#27272a"
                            strokeWidth={0.5}
                            style={{
                              default: {
                                outline: "none",
                              },
                              hover: {
                                fill: "#dc2626",
                                outline: "none",
                                cursor: "pointer",
                              },
                              pressed: {
                                fill: "#b91c1c",
                                outline: "none",
                              },
                            }}
                            onMouseEnter={(e) => {
                              setTooltipContent(`${geo.properties.name}: ${complaints.toLocaleString()} complaints`)
                              setTooltipPosition({ x: e.clientX, y: e.clientY })
                            }}
                            onMouseLeave={() => {
                              setTooltipContent("")
                            }}
                            onClick={() => setSelectedState(stateAbbr)}
                          />
                        )
                      })
                    }
                  </Geographies>
                </ZoomableGroup>
              </ComposableMap>
            </div>
            
            {/* Tooltip */}
            {tooltipContent && (
              <div
                className="fixed z-50 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-md shadow-lg border border-border pointer-events-none"
                style={{
                  left: tooltipPosition.x + 10,
                  top: tooltipPosition.y - 40,
                }}
              >
                {tooltipContent}
              </div>
            )}

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 border border-border">
              <p className="text-xs font-medium text-foreground mb-2">Complaint Density</p>
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground">Low</span>
                <div className="flex gap-0.5">
                  {["#1e1e2e", "#3a3a4e", "#5a5a6e", "#dc2626", "#991b1b"].map((color) => (
                    <div
                      key={color}
                      className="w-4 h-3 rounded-sm"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">High</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Selected State Details */}
        {selectedState && (
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>{getStateData(selectedState).name}</span>
                <Badge variant="destructive">
                  {stateComplaintData[selectedState]?.toLocaleString() || 0} complaints
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-secondary/50 rounded-lg p-3">
                  <p className="text-2xl font-bold text-foreground">
                    {Math.floor((stateComplaintData[selectedState] || 0) * 0.4).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Open Cases</p>
                </div>
                <div className="bg-secondary/50 rounded-lg p-3">
                  <p className="text-2xl font-bold text-foreground">
                    {Math.floor((stateComplaintData[selectedState] || 0) * 0.3).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Resolved</p>
                </div>
              </div>
              <Link
                href={`/complaints?state=${selectedState}`}
                className="block w-full text-center py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                View All Complaints
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Top States */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Most Reported States
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {topStates.map(([abbr, count], index) => (
              <button
                key={abbr}
                onClick={() => setSelectedState(abbr)}
                className={`w-full flex items-center justify-between p-2 rounded-md hover:bg-secondary transition-colors ${
                  selectedState === abbr ? "bg-secondary" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-bold ${index < 3 ? "text-primary" : "text-muted-foreground"}`}>
                    #{index + 1}
                  </span>
                  <span className="font-medium text-foreground">
                    {states.find(s => s.abbreviation === abbr)?.name || abbr}
                  </span>
                </div>
                <Badge variant="secondary">
                  {count.toLocaleString()}
                </Badge>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Hot Topics */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Trending Issues
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-2 rounded-md bg-destructive/10">
              <Building2 className="h-4 w-4 text-destructive" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Security Deposit Theft</p>
                <p className="text-xs text-muted-foreground">+23% this week</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-md bg-warning/10">
              <Building2 className="h-4 w-4 text-warning" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">HOA Overreach</p>
                <p className="text-xs text-muted-foreground">+18% this week</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-md bg-primary/10">
              <Building2 className="h-4 w-4 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Maintenance Neglect</p>
                <p className="text-xs text-muted-foreground">+12% this week</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
