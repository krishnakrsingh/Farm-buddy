
"use client";

import { useState, useMemo } from "react";
import { Newspaper, Bell, MapPin, CloudRain, Sun, Zap, Info, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const ALERTS = [
  {
    id: 1,
    type: "Infrastructure",
    title: "New Flower Market in Sector 52A",
    location: "Sector 52A, Gurugram",
    category: "infrastructure",
    description: "A new flower market is being developed to support local flower growers, featuring an auction center and grading units.",
    severity: "High",
    icon: MapPin,
    date: "2 days ago",
  },
  {
    id: 2,
    type: "Policy",
    title: "Natural Farming Subsidy",
    location: "Gurugram District",
    category: "policy",
    description: "Haryana govt offers Rs 30,000 subsidy for farmers adopting natural farming and purchasing cows.",
    severity: "Medium",
    icon: Info,
    date: "3 days ago",
  },
  {
    id: 3,
    type: "Innovation",
    title: "Exotic Agri Hub Project",
    location: "Sector 109, Gurugram",
    category: "innovation",
    description: "Plans to transform Gurugram into an exotic flower and vegetable hub with a 10-acre wholesale market.",
    severity: "Medium",
    icon: Zap,
    date: "1 week ago",
  },
  {
    id: 4,
    type: "Training",
    title: "Scientific Farming Workshops",
    location: "SARAS Aajeevika Mela",
    category: "training",
    description: "Workshops for Self Help Groups on organic certification and soil health management.",
    severity: "Informational",
    icon: Newspaper,
    date: "Yesterday",
  },
  {
    id: 5,
    type: "Market",
    title: "Dedicated Grain Market",
    location: "Gurugram",
    category: "market",
    description: "New dedicated grain market established for procurement of naturally farmed crops.",
    severity: "Medium",
    icon: Sun,
    date: "4 days ago",
  },
  {
    id: 6,
    type: "Weather",
    title: "Light Rain Forecast",
    location: "Gurugram & Surrounding",
    category: "weather",
    description: "Light rain expected in the next 24 hours. Humidity levels to rise.",
    severity: "Low",
    icon: CloudRain,
    date: "3 hours ago",
  },
];

export default function NewsPage() {
  const [category, setCategory] = useState("all");

  const filteredAlerts = useMemo(() => {
    if (category === "all") return ALERTS;
    return ALERTS.filter((alert) => alert.category === category);
  }, [category]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <Newspaper /> Gurugram Agriculture News
          </h1>
          <p className="text-muted-foreground flex items-center gap-1">
            <MapPin size={16} /> Showing updates for {category === "all" ? "all categories" : category}
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full md:w-[200px] bg-white rounded-full">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All News</SelectItem>
              <SelectItem value="market">Market</SelectItem>
              <SelectItem value="policy">Policy</SelectItem>
              <SelectItem value="innovation">Innovation</SelectItem>
              <SelectItem value="infrastructure">Infrastructure</SelectItem>
              <SelectItem value="weather">Weather</SelectItem>
              <SelectItem value="training">Training</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAlerts.map((alert) => {
          const Icon = alert.icon;
          return (
            <Card key={alert.id} className="border-none shadow-lg overflow-hidden group hover:shadow-xl transition-all">
              <div className={cn(
                "h-2",
                alert.severity === "Critical" ? "bg-destructive" :
                  alert.severity === "High" ? "bg-orange-500" :
                    alert.severity === "Medium" ? "bg-accent" : "bg-primary"
              )} />
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary" className="bg-primary/5 text-primary">
                    {alert.type}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{alert.date}</span>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">{alert.title}</CardTitle>
                <CardDescription className="flex items-center gap-1 text-primary/70 font-medium">
                  <MapPin size={14} /> {alert.location}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center text-primary">
                    <Icon size={24} />
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {alert.description}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/30 py-3">
                <Button variant="link" className="p-0 text-primary h-auto font-bold ml-auto">
                  View Full Report
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {filteredAlerts.length === 0 && (
        <div className="text-center py-20">
          <Newspaper size={64} className="mx-auto text-primary/10 mb-4" />
          <h3 className="text-2xl font-bold text-primary">No alerts for this category</h3>
          <p className="text-muted-foreground">Try selecting a different category or check back later.</p>
        </div>
      )}

      <Card className="bg-primary text-white border-none shadow-2xl overflow-hidden relative">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <CardContent className="p-8 md:p-12 relative">
          <h2 className="text-3xl font-bold mb-4">Never miss an update</h2>
          <p className="text-white/80 max-w-xl mb-6">
            Get instant push notifications for critical pest warnings and weather anomalies in your specific PIN code.
          </p>
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full h-12 px-8">
            <Bell className="mr-2" size={20} /> Enable Smart Notifications
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
