"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { Dialog, DialogContent, DialogTitle } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { cn } from "@/shared/utils/tailwind-utils";
import {
  Search,
  TrendingUp,
  Clock,
  X,
  Sparkles,
  Image as ImageIcon,
  Users,
  Hash,
  ArrowRight,
  Trophy,
  Star,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock data - trong thực tế sẽ lấy từ API
const trendingSearches = [
  { id: 1, term: "Azuki", icon: "🔥", change: "+12%" },
  { id: 2, term: "BAYC", icon: "🦧", change: "+8%" },
  { id: 3, term: "Pudgy Penguins", icon: "🐧", change: "+45%" },
  { id: 4, term: "DeGods", icon: "👹", change: "-5%" },
];

const recentSearches = [
  { id: 1, term: "Cool Cats", type: "collection" },
  { id: 2, term: "0x742d...8921", type: "wallet" },
  { id: 3, term: "Art Blocks", type: "collection" },
];

const topCollections = [
  {
    id: 1,
    name: "Bored Ape Yacht Club",
    image: "https://picsum.photos/50/50?random=1",
    floor: "28.5 ETH",
    volume: "125K ETH",
    change: "+12.5%",
    verified: true,
  },
  {
    id: 2,
    name: "Azuki",
    image: "https://picsum.photos/50/50?random=2",
    floor: "15.2 ETH",
    volume: "89K ETH",
    change: "+8.2%",
    verified: true,
  },
  {
    id: 3,
    name: "Doodles",
    image: "https://picsum.photos/50/50?random=3",
    floor: "8.8 ETH",
    volume: "45K ETH",
    change: "-2.1%",
    verified: true,
  },
];

const categories = [
  { id: "all", label: "All", icon: Sparkles },
  { id: "collections", label: "Collections", icon: ImageIcon },
  { id: "users", label: "Users", icon: Users },
  { id: "items", label: "Items", icon: Hash },
];

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isSearching, setIsSearching] = useState(false);
  // Avoid firing a "search request" on every keystroke; the debounced
  // value updates 300ms after the user stops typing.
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Flip the searching indicator while the user is mid-keystroke and
  // clear it once the debounce settles. When the field is empty there
  // is no search in flight.
  useEffect(() => {
    if (searchTerm.length === 0) {
      setIsSearching(false);
      return;
    }
    if (searchTerm !== debouncedSearchTerm) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  }, [searchTerm, debouncedSearchTerm]);

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Once we wire the modal to a real search API, this effect is where
  // we'd dispatch the fetch (using debouncedSearchTerm). For now we
  // simply log when the debounced term changes.
  useEffect(() => {
    if (!debouncedSearchTerm) return;
    // Intentionally left empty — search hook to be added when the
    // collection search endpoint lands.
  }, [debouncedSearchTerm, selectedCategory]);

  // Click handler for trending / recent search chips. They populate
  // the input, which then drives the debounced search effect above.
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="p-0 gap-0 overflow-hidden"
        style={{ maxWidth: "45vw", width: "45vw", height: "55vh" }}
      >
        {/* Hidden title for accessibility */}
        <DialogTitle className="sr-only">Search NFTs and Collections</DialogTitle>

        {/* Search Header */}
        <div className="border-b border-border-subtle dark:border-border-subtle p-5 bg-background dark:bg-card">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-os-gray-300" />
            <Input
              autoFocus
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search NFTs, collections and creators..."
              className="pl-12 pr-12 h-12 text-base border border-border-subtle dark:border-border-subtle focus:border-accent focus-visible:ring-0 bg-secondary dark:bg-card rounded-[8px]"
            />
            <button
              onClick={onClose}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-os-gray-300 hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Main Content with Sidebar */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Categories */}
          <div className="w-48 border-r border-border-subtle dark:border-border-subtle bg-secondary/50 dark:bg-card p-3">
            <div className="space-y-1">
              {categories.map(category => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 rounded-[8px] text-sm font-medium transition-all",
                      selectedCategory === category.id
                        ? "bg-frosted-2/10 text-accent"
                        : "text-foreground hover:text-foreground dark:text-os-gray-300 dark:hover:text-foreground hover:bg-background dark:hover:bg-card"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{category.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Content - Search Results */}
          <ScrollArea className="flex-1">
            {!searchTerm ? (
              <div className="p-6 space-y-6">
                {/* Trending Searches */}
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-os-gray-300 mb-3">
                    <TrendingUp className="h-4 w-4" />
                    Trending Searches
                  </div>
                  <div className="grid grid-cols-3 xl:grid-cols-4 gap-3">
                    {trendingSearches.map(item => (
                      <button
                        key={item.id}
                        onClick={() => handleSearch(item.term)}
                        className="flex items-center justify-between p-3 rounded-[8px] bg-background border border-border-subtle hover:border-accent transition-all group"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{item.icon}</span>
                          <span className="font-medium">{item.term}</span>
                        </div>
                        <span
                          className={cn(
                            "text-xs font-medium font-sans",
                            item.change.startsWith("+")
                              ? "text-success dark:text-success"
                              : "text-destructive dark:text-destructive"
                          )}
                        >
                          {item.change}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recent Searches */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-os-gray-300">
                      <Clock className="h-4 w-4" />
                      Recent Searches
                    </div>
                    <button className="text-xs text-os-gray-300 hover:text-foreground">
                      Clear all
                    </button>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map(item => (
                      <button
                        key={item.id}
                        onClick={() => handleSearch(item.term)}
                        className="w-full flex items-center justify-between p-2.5 rounded-[8px] hover:bg-secondary transition-all duration-150 group"
                      >
                        <div className="flex items-center gap-3">
                          {item.type === "wallet" ? (
                            <Wallet className="h-4 w-4 text-os-gray-300" />
                          ) : (
                            <ImageIcon className="h-4 w-4 text-os-gray-300" />
                          )}
                          <span>{item.term}</span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-os-gray-300 opacity-0 group-hover:opacity-100 transition-all duration-150" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Top Collections */}
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-os-gray-300 mb-3">
                    <Trophy className="h-4 w-4" />
                    Top Collections Today
                  </div>
                  <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
                    {topCollections.map((collection, index) => (
                      <Link
                        key={collection.id}
                        href={`/collections/${collection.id}`}
                        onClick={onClose}
                        className="p-4 rounded-[8px] bg-background border border-border-subtle hover:border-accent transition-all group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative">
                            <Image
                              src={collection.image}
                              alt={collection.name}
                              width={48}
                              height={48}
                              className="rounded-[8px]"
                            />
                            {collection.verified && (
                              <div className="absolute -bottom-1 -right-1 bg-info rounded-full p-0.5">
                                <Star className="h-3 w-3 text-foreground fill-white" />
                              </div>
                            )}
                            <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center text-foreground text-xs font-bold">
                              {index + 1}
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium font-sans group-hover:text-accent">
                              {collection.name}
                            </p>
                            <div className="mt-2 space-y-1">
                              <div className="flex justify-between text-sm">
                                <span className="text-os-gray-300">Floor</span>
                                <span className="font-medium">{collection.floor}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-os-gray-300">Vol</span>
                                <span className="font-medium">{collection.volume}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-os-gray-300">24h</span>
                                <span
                                  className={cn(
                                    "font-medium font-sans",
                                    collection.change.startsWith("+")
                                      ? "text-success dark:text-success"
                                      : "text-destructive dark:text-destructive"
                                  )}
                                >
                                  {collection.change}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              // Search Results
              <div className="p-4">
                {isSearching ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="flex items-center gap-2 text-os-gray-300">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent" />
                      Searching...
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-sm text-os-gray-300">
                      Showing results for &quot;{searchTerm}&quot;
                    </div>
                    {/* Placeholder for search results */}
                    <div className="space-y-2">
                      {[1, 2, 3].map(i => (
                        <div
                          key={i}
                          className="p-4 rounded-[8px] border border-border-subtle hover:bg-secondary cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-[8px] bg-muted animate-pulse" />
                            <div className="flex-1">
                              <div className="h-4 w-32 bg-muted rounded animate-pulse mb-2" />
                              <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Footer */}
        <div className="border-t border-border-subtle bg-secondary dark:bg-card px-5 py-3 flex items-center justify-between text-xs text-os-gray-300">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">↑↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">Enter</kbd>
              Select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">Esc</kbd>
              Close
            </span>
          </div>
          <div>
            Powered by <span className="font-medium font-sans">Magic Search™</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
