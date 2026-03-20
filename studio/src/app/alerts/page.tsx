"use client";

import { AlertCard } from "@/components/AlertCard";
import { Camera, MapPin } from "lucide-react";

export default function AlertsPage() {
    return (
        <div className="min-h-screen bg-background pb-24">

            {/* Header */}
            <div className="bg-primary text-primary-foreground pt-6 pb-6 px-4 rounded-b-3xl shadow-sm">
                <h1 className="text-2xl font-black tracking-tight mb-1">Local Alerts</h1>
                <div className="flex items-center gap-1.5 text-primary-foreground/80 text-sm font-medium">
                    <MapPin size={16} />
                    <p>Within 20km of Pipli Village</p>
                </div>
            </div>

            <div className="px-4 mt-6 max-w-lg mx-auto">

                {/* Report Action */}
                <button className="w-full mb-8 bg-card border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all p-4 rounded-xl flex items-center justify-center gap-3 group">
                    <div className="bg-primary/10 text-primary p-2.5 rounded-full group-hover:scale-110 transition-transform">
                        <Camera size={24} />
                    </div>
                    <div className="text-left">
                        <h3 className="font-bold text-foreground">See a new pest?</h3>
                        <p className="text-sm font-medium text-muted-foreground">Upload photo to warn other farmers</p>
                    </div>
                </button>

                {/* Alert Feed */}
                <div className="space-y-4">
                    <AlertCard
                        type="warning"
                        title="Yellow Rust Risk - High"
                        description="Favorable weather conditions for yellow rust expected over next 3 days. Monitor wheat crop."
                        date="Today"
                    />

                    <AlertCard
                        type="info"
                        title="Market Holiday"
                        description="Nearby Karnal mandi will be closed tomorrow."
                        date="Yesterday"
                    />

                    <AlertCard
                        type="danger"
                        title="Heavy Rain Warning"
                        description="Unexpected rainfall predicted tonight. Avoid spraying."
                        date="2 days ago"
                    />

                    <AlertCard
                        type="success"
                        title="Subsidy Approved"
                        description="State PM-Kisan installment has been released for your district."
                        date="3 days ago"
                    />
                </div>

            </div>
        </div>
    );
}
