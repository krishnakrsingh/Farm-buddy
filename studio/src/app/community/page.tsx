"use client";

import { Users, Search, MessageSquare, ThumbsUp, Share2, Award, Info, Plus } from "lucide-react";
import Image from "next/image";

const POSTS = [
    {
        id: 1,
        author: "Rakesh Kumar",
        avatar: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=100&h=100&q=80",
        role: "Farmer • 5y Exp",
        time: "2 hours ago",
        content: "My wheat crop leaves are turning yellow in patches. It's been raining heavily the past 3 days. Could this be yellow rust?",
        tags: ["#Wheat", "#Disease"],
        image: "https://images.unsplash.com/photo-1596484552809-54359480fae7?auto=format&fit=crop&w=800&q=80",
        likes: 45,
        comments: 12,
        hasExpertReply: true,
    },
    {
        id: 2,
        author: "Dr. Sharma",
        avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=100&h=100&q=80",
        role: "Agronomist",
        expert: true,
        time: "5 hours ago",
        content: "Reminder: Mandi closing this Sunday for local elections. Plan your harvest sales accordingly to avoid storage bottlenecks.",
        tags: ["#Mandi", "#News"],
        likes: 120,
        comments: 4,
        hasExpertReply: false,
    }
];

export default function CommunityPage() {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-32">
            {/* Dynamic Header */}
            <div className="bg-emerald-600 pb-8 pt-6 px-6 rounded-b-[2.5rem] shadow-xl relative sticky top-0 z-20">
                {/* Background Patterns */}
                <div className="absolute inset-0 overflow-hidden rounded-b-[2.5rem]">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-black/10 rounded-full blur-3xl pointer-events-none" />
                </div>

                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-6 text-white">
                        <div>
                            <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
                                <Users className="text-emerald-100" /> Chaupal Forum
                            </h1>
                            <p className="text-sm text-emerald-100/90 font-medium mt-1">
                                1 Active Farmer
                            </p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors">
                            <Info size={20} />
                        </div>
                    </div>

                    {/* SearchBar */}
                    <div className="relative mb-5 shadow-lg">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Ask a question..."
                            className="w-full bg-white dark:bg-zinc-900 border-none rounded-2xl py-3 pl-11 pr-4 text-sm font-medium focus:ring-4 focus:ring-emerald-500/30 transition-all font-body text-foreground"
                        />
                    </div>

                    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                        {["Trending", "My Crops", "Expert Answers", "Subsidies"].map((tag, i) => (
                            <button key={tag} className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors border ${i === 0 ? 'bg-white text-emerald-700 border-white' : 'bg-transparent text-emerald-50 border-emerald-400/50 hover:bg-emerald-500'}`}>
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Posts Feed */}
            <div className="px-4 mt-6 space-y-6 max-w-xl mx-auto">
                {POSTS.map((post) => (
                    <div key={post.id} className="bg-white dark:bg-zinc-900 rounded-[2rem] p-5 shadow-sm border border-zinc-100 dark:border-zinc-800">

                        {/* Author Row */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full overflow-hidden relative border-2 border-zinc-100 dark:border-zinc-800 shrink-0">
                                <Image src={post.avatar} alt={post.author} fill className="object-cover" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-sm flex items-center gap-1">
                                        {post.author}
                                        {post.expert && <Award size={14} className="text-blue-500 fill-blue-500" />}
                                    </h3>
                                    <span className="text-[10px] text-muted-foreground font-medium">{post.time}</span>
                                </div>
                                <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">{post.role}</p>
                            </div>
                        </div>

                        {/* Content */}
                        <p className="text-sm text-foreground/90 font-medium leading-relaxed mb-3">
                            {post.content}
                        </p>

                        {/* Optional Image */}
                        {post.image && (
                            <div className="w-full h-48 relative rounded-2xl overflow-hidden mb-3 bg-zinc-100 dark:bg-zinc-800">
                                <Image src={post.image} alt="Post Attachment" fill className="object-cover" />
                            </div>
                        )}

                        {/* Tags */}
                        <div className="flex gap-2 mb-4">
                            {post.tags.map(tag => (
                                <span key={tag} className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-lg">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Expert Reply Indicator */}
                        {post.hasExpertReply && (
                            <div className="bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 px-3 py-2 rounded-xl text-xs font-bold mb-4 flex items-center gap-2 border border-blue-100 dark:border-blue-900/50">
                                <Award size={14} className="text-blue-500" /> Expert Agronomist has replied
                            </div>
                        )}

                        <hr className="border-border/50 mb-3" />

                        {/* Interactions */}
                        <div className="flex justify-between items-center text-muted-foreground">
                            <div className="flex gap-4">
                                <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
                                    <ThumbsUp size={18} /> <span className="text-xs font-bold">{post.likes}</span>
                                </button>
                                <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
                                    <MessageSquare size={18} /> <span className="text-xs font-bold">{post.comments}</span>
                                </button>
                            </div>
                            <button className="hover:text-primary transition-colors">
                                <Share2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}

                {/* Floating Action Button */}
                <button className="fixed bottom-24 right-6 bg-primary text-primary-foreground w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all z-40">
                    <Plus size={24} strokeWidth={3} />
                </button>
            </div>
        </div>
    );
}
