import React, { useMemo, useState } from "react";
import {
  Search,
  MapPin,
  Star,
  Dog,
  Volume2,
  Car,
  Leaf,
  ShieldCheck,
  Eye,
  CalendarDays,
  Filter,
  ExternalLink,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// =====================================================================
//  PLACES — TasteTrust verified restaurant data
//  ---------------------------------------------------------------------
//  Curated and verified by Gi-yeon. Originally focused on the US, now
//  expanding to cover Singapore / Johor Bahru / LA based on Gi-yeon's
//  shared Google Maps lists (한식, Restaurant, Cafe, Singapore, 일식,
//  Chinese). Records seeded from Google Maps; per-record fields like
//  giyeonNote, visitDate, dog policy, parking and vegan option must be
//  filled in manually after a real visit.
//
//  Schema (every record gets DEFAULTS applied via place()):
//    id              : stable string id
//    name            : restaurant name
//    category        : cuisine / format (e.g. "Korean BBQ", "Cafe")
//    neighborhood    : "Area, City" — left blank when not visible
//    rating          : 0–5, Google Maps score (replace with verified
//                      score after a real visit)
//    priceLevel      : "$" | "$$" | "$$$" | "$$$$"
//    filters         : { dogFriendly, noiseLevel, parking, veganOption }
//                      noiseLevel: "quiet" | "moderate" | "loud"
//    giyeonNote      : one-line first-person recommendation
//    visitDate       : "YYYY-MM" of last verified visit
//    image           : remote image URL (Unsplash placeholder ok)
//    verifiedVisits  : counter — bumped daily by ops script
//    analytics       : { monthlyViews, adClicks, conversions, couponsUsed }
//    sourceUrl       : original Google Maps link
//    listSource      : which curated list this came from
// =====================================================================

const DEFAULTS = {
  neighborhood: "",
  filters: {
    dogFriendly: false,
    noiseLevel: "moderate",
    parking: false,
    veganOption: false,
  },
  giyeonNote: "",
  visitDate: "",
  image: "",
  verifiedVisits: 0,
  analytics: {
    monthlyViews: 0,
    adClicks: 0,
    conversions: 0,
    couponsUsed: 0,
  },
  sourceUrl: "",
  listSource: "",
};

const place = (o) => ({
  ...DEFAULTS,
  ...o,
  filters: { ...DEFAULTS.filters, ...(o.filters || {}) },
  analytics: { ...DEFAULTS.analytics, ...(o.analytics || {}) },
});

// Source URLs (Google Maps shared lists)
const SRC = {
  korean: "https://maps.app.goo.gl/N4ibwRo1rNeg4DJV7",
  restaurant: "https://maps.app.goo.gl/3UaRat3mv2WzSbDK9",
  cafe: "https://maps.app.goo.gl/qi2nxeykvWq22b8H9",
  singapore: "https://maps.app.goo.gl/edh4GMEAoB1wrHbEA",
  japanese: "https://maps.app.goo.gl/gKbzSzySHks9b8L57",
  chinese:
    "https://www.google.com/maps/@/data=!3m1!4b1!4m2!11m1!2s7E5WcEjiK5GpQSo94Yz6NaI5AGS72A",
};

const PLACES = [
  // ---------- 한식 (Korean) — 17 places ----------
  place({ id: "han-01", name: "Sae Ma Eul BBQ Pelangi", category: "Korean BBQ", neighborhood: "Pelangi, Johor Bahru", rating: 4.8, priceLevel: "$$", sourceUrl: SRC.korean, listSource: "한식" }),
  place({ id: "han-02", name: "KyoChon Chicken @ JB City Square", category: "Korean Fried Chicken", neighborhood: "Johor Bahru", rating: 4.7, priceLevel: "", sourceUrl: SRC.korean, listSource: "한식" }),
  place({ id: "han-03", name: "GO K BBQ 고케이 비비큐", category: "Korean BBQ", neighborhood: "76 Amoy St, Singapore", rating: 4.4, priceLevel: "$$", sourceUrl: SRC.korean, listSource: "한식" }),
  place({ id: "han-04", name: "Hongdae Ip Gu", category: "Korean", neighborhood: "Johor Bahru", rating: 4.1, priceLevel: "$$", sourceUrl: SRC.korean, listSource: "한식" }),
  place({ id: "han-05", name: "Dal In Restaurant", category: "Korean", neighborhood: "", rating: 4.1, priceLevel: "$$", sourceUrl: SRC.korean, listSource: "한식" }),
  place({ id: "han-06", name: "하남돼지집 HANAM BBQ @ R&F Mall", category: "Korean BBQ", neighborhood: "R&F Mall, Johor Bahru", rating: 4.8, priceLevel: "", sourceUrl: SRC.korean, listSource: "한식" }),
  place({ id: "han-07", name: "Jang San Korean Restaurant 장산왕족발", category: "Korean", neighborhood: "", rating: 4.6, priceLevel: "", sourceUrl: SRC.korean, listSource: "한식" }),
  place({ id: "han-08", name: "Jeong's Jjajang", category: "Korean", neighborhood: "", rating: 4.8, priceLevel: "$$", sourceUrl: SRC.korean, listSource: "한식" }),
  place({ id: "han-09", name: "Oven & Fried Chicken", category: "Korean Fried Chicken", neighborhood: "", rating: 4.2, priceLevel: "$$", sourceUrl: SRC.korean, listSource: "한식" }),
  place({ id: "han-10", name: "Hoodadak 후다닥 한국 음식점", category: "Korean", neighborhood: "", rating: 4.1, priceLevel: "$$", sourceUrl: SRC.korean, listSource: "한식" }),
  place({ id: "han-11", name: "The Gogijip / Halmae Gukbab / Hanyang Bulgogi", category: "Korean", neighborhood: "Hansik Dining Collective", rating: 4.3, priceLevel: "", sourceUrl: SRC.korean, listSource: "한식" }),
  place({ id: "han-12", name: "SODENG — The Vintage BBQ", category: "Korean BBQ", neighborhood: "Telok Ayer, Singapore", rating: 4.9, priceLevel: "", sourceUrl: SRC.korean, listSource: "한식" }),
  place({ id: "han-13", name: "Pohang Seafood & Butchery 회랑고기랑", category: "Korean", neighborhood: "", rating: 4.6, priceLevel: "", sourceUrl: SRC.korean, listSource: "한식" }),
  place({ id: "han-14", name: "Noodle Star K", category: "Korean", neighborhood: "Tanjong Pagar, Singapore", rating: 4.6, priceLevel: "$$", sourceUrl: SRC.korean, listSource: "한식" }),
  place({ id: "han-15", name: "Myeong In Jip", category: "Korean", neighborhood: "", rating: 4.4, priceLevel: "", sourceUrl: SRC.korean, listSource: "한식" }),
  place({ id: "han-16", name: "DRIM — Korean Steak House", category: "Korean Steakhouse", neighborhood: "Mandarin Gallery, Singapore", rating: 4.9, priceLevel: "$$$$", sourceUrl: SRC.korean, listSource: "한식" }),
  place({ id: "han-17", name: "Kong Madam 콩마담", category: "Korean (Tofu)", neighborhood: "", rating: 4.6, priceLevel: "", sourceUrl: SRC.korean, listSource: "한식" }),

  // ---------- Restaurant — 20 of 48 visible ----------
  place({ id: "res-01", name: "Dusk by Mok Mok", category: "Cafe", neighborhood: "Johor Bahru", rating: 4.6, priceLevel: "$$", sourceUrl: SRC.restaurant, listSource: "Restaurant" }),
  place({ id: "res-02", name: "The Wagyu Tavern (JB)", category: "Yakiniku", neighborhood: "Johor Bahru", rating: 5.0, priceLevel: "$$$$", sourceUrl: SRC.restaurant, listSource: "Restaurant" }),
  place({ id: "res-03", name: "Commune by the Creators", category: "Restaurant", neighborhood: "", rating: 4.7, priceLevel: "", sourceUrl: SRC.restaurant, listSource: "Restaurant" }),
  place({ id: "res-04", name: "Bottega JB", category: "Italian", neighborhood: "Johor Bahru", rating: 4.5, priceLevel: "", sourceUrl: SRC.restaurant, listSource: "Restaurant" }),
  place({ id: "res-05", name: "Pizzeria Vincenzo Capuano", category: "Italian", neighborhood: "", rating: 4.7, priceLevel: "", sourceUrl: SRC.restaurant, listSource: "Restaurant" }),
  place({ id: "res-06", name: "Latteria Mozzarella Bar", category: "Italian", neighborhood: "", rating: 4.5, priceLevel: "$$", sourceUrl: SRC.restaurant, listSource: "Restaurant" }),
  place({ id: "res-07", name: "L'Arte Pizza & Focaccia", category: "Pizza", neighborhood: "", rating: 4.6, priceLevel: "$", sourceUrl: SRC.restaurant, listSource: "Restaurant" }),
  place({ id: "res-08", name: "Takeout IL CLAY @ Clarke Quay", category: "Italian", neighborhood: "Clarke Quay, Singapore", rating: 4.4, priceLevel: "", sourceUrl: SRC.restaurant, listSource: "Restaurant" }),
  place({ id: "res-09", name: "Scarpetta", category: "Italian", neighborhood: "", rating: 4.4, priceLevel: "", sourceUrl: SRC.restaurant, listSource: "Restaurant" }),
  place({ id: "res-10", name: "Yakiniku Tenshin", category: "Yakiniku", neighborhood: "Gurney Paragon, Penang", rating: 4.9, priceLevel: "$$$$", sourceUrl: SRC.restaurant, listSource: "Restaurant" }),
  place({ id: "res-11", name: "My Awesome Cafe", category: "Restaurant", neighborhood: "", rating: 4.7, priceLevel: "$$", sourceUrl: SRC.restaurant, listSource: "Restaurant" }),
  place({ id: "res-12", name: "Casa Vostra", category: "Italian", neighborhood: "Raffles City, Singapore", rating: 4.3, priceLevel: "", sourceUrl: SRC.restaurant, listSource: "Restaurant" }),
  place({ id: "res-13", name: "LeVeL33", category: "Modern European", neighborhood: "Singapore", rating: 4.4, priceLevel: "$$$$", sourceUrl: SRC.restaurant, listSource: "Restaurant" }),
  place({ id: "res-14", name: "Whiskey Library & Jazz Club", category: "Bar", neighborhood: "", rating: 4.3, priceLevel: "", sourceUrl: SRC.restaurant, listSource: "Restaurant" }),
  place({ id: "res-15", name: "Southbridge", category: "Bar", neighborhood: "", rating: 4.5, priceLevel: "$$", sourceUrl: SRC.restaurant, listSource: "Restaurant" }),
  place({ id: "res-16", name: "VUE", category: "Fine Dining", neighborhood: "", rating: 4.7, priceLevel: "$$$$", sourceUrl: SRC.restaurant, listSource: "Restaurant" }),
  place({ id: "res-17", name: "PREGO", category: "Italian", neighborhood: "", rating: 4.1, priceLevel: "$$$", sourceUrl: SRC.restaurant, listSource: "Restaurant" }),
  place({ id: "res-18", name: "Apollonia's Pizzeria", category: "Pizza", neighborhood: "", rating: 4.3, priceLevel: "$", sourceUrl: SRC.restaurant, listSource: "Restaurant" }),
  place({ id: "res-19", name: "Southside Interim Market", category: "Food court", neighborhood: "Sentosa", rating: 3.8, priceLevel: "$$", sourceUrl: SRC.restaurant, listSource: "Restaurant" }),
  place({ id: "res-20", name: "Blue Palms Brewhouse", category: "Gastropub", neighborhood: "", rating: 4.5, priceLevel: "$$", sourceUrl: SRC.restaurant, listSource: "Restaurant" }),

  // ---------- Cafe — 20 of 43 visible ----------
  place({ id: "caf-01", name: "Alley & Daisy Cafe", category: "Cafe", neighborhood: "Jalan Trus, Johor Bahru", rating: 4.7, priceLevel: "$", sourceUrl: SRC.cafe, listSource: "Cafe" }),
  place({ id: "caf-02", name: "Antipodean Coffee Johor Bahru", category: "Cafe", neighborhood: "Johor Bahru", rating: 4.6, priceLevel: "$", sourceUrl: SRC.cafe, listSource: "Cafe" }),
  place({ id: "caf-03", name: "Doña Bakehouse", category: "Bakery", neighborhood: "", rating: 4.5, priceLevel: "$", sourceUrl: SRC.cafe, listSource: "Cafe" }),
  place({ id: "caf-04", name: "off day cafe", category: "Cafe", neighborhood: "", rating: 4.3, priceLevel: "$", sourceUrl: SRC.cafe, listSource: "Cafe" }),
  place({ id: "caf-05", name: "La Levain", category: "Cafe", neighborhood: "", rating: 4.4, priceLevel: "$", sourceUrl: SRC.cafe, listSource: "Cafe" }),
  place({ id: "caf-06", name: "Baker's Bench Bakery", category: "Bakery", neighborhood: "", rating: 4.5, priceLevel: "$", sourceUrl: SRC.cafe, listSource: "Cafe" }),
  place({ id: "caf-07", name: "CAFE KREAMS", category: "Cafe", neighborhood: "", rating: 4.4, priceLevel: "", sourceUrl: SRC.cafe, listSource: "Cafe" }),
  place({ id: "caf-08", name: "Lean & Rich Bakery", category: "Bakery", neighborhood: "", rating: 4.4, priceLevel: "$", sourceUrl: SRC.cafe, listSource: "Cafe" }),
  place({ id: "caf-09", name: "ME Cafe & Games", category: "Board game cafe", neighborhood: "Orchard, Singapore", rating: 4.4, priceLevel: "", sourceUrl: SRC.cafe, listSource: "Cafe" }),
  place({ id: "caf-10", name: "Birds of Paradise Gelato — Craig", category: "Ice Cream", neighborhood: "Tanjong Pagar, Singapore", rating: 4.5, priceLevel: "", sourceUrl: SRC.cafe, listSource: "Cafe" }),
  place({ id: "caf-11", name: "Equate Coffee", category: "Coffee", neighborhood: "", rating: 4.6, priceLevel: "$", sourceUrl: SRC.cafe, listSource: "Cafe" }),
  place({ id: "caf-12", name: "YY Kafei Dian", category: "Coffee shop", neighborhood: "", rating: 4.1, priceLevel: "$", sourceUrl: SRC.cafe, listSource: "Cafe" }),
  place({ id: "caf-13", name: "queic by Olivia", category: "Dessert (Cheesecake)", neighborhood: "", rating: 4.1, priceLevel: "", sourceUrl: SRC.cafe, listSource: "Cafe" }),
  place({ id: "caf-14", name: "Mei Heong Yuen Dessert", category: "Dessert (Mango)", neighborhood: "", rating: 4.1, priceLevel: "$", sourceUrl: SRC.cafe, listSource: "Cafe" }),
  place({ id: "caf-15", name: "Champion Bolo Bun", category: "Cafe", neighborhood: "", rating: 4.4, priceLevel: "$", sourceUrl: SRC.cafe, listSource: "Cafe" }),
  place({ id: "caf-16", name: "Baristart Coffee Singapore", category: "Cafe", neighborhood: "Tras Street, Singapore", rating: 4.1, priceLevel: "$$", sourceUrl: SRC.cafe, listSource: "Cafe" }),
  place({ id: "caf-17", name: "Atico Lounge", category: "Lounge bar", neighborhood: "", rating: 4.1, priceLevel: "", sourceUrl: SRC.cafe, listSource: "Cafe" }),
  place({ id: "caf-18", name: "DAMSO", category: "Coffee (Korean rice cakes)", neighborhood: "", rating: 4.9, priceLevel: "$", sourceUrl: SRC.cafe, listSource: "Cafe" }),
  place({ id: "caf-19", name: "Burnt Ends Bakery", category: "Bakery", neighborhood: "Audi House of Progress", rating: 4.5, priceLevel: "$", sourceUrl: SRC.cafe, listSource: "Cafe" }),
  place({ id: "caf-20", name: "Radio Bakery", category: "Bakery", neighborhood: "Los Angeles area", rating: 4.5, priceLevel: "$$", sourceUrl: SRC.cafe, listSource: "Cafe" }),

  // ---------- Singapore — 17 of 44 (3 non-restaurants skipped) ----------
  place({ id: "sgp-01", name: "IT Roo Café", category: "Cafe", neighborhood: "", rating: 4.1, priceLevel: "$", sourceUrl: SRC.singapore, listSource: "Singapore" }),
  place({ id: "sgp-02", name: "Hock Kee Kopitiam (City Square)", category: "Kopitiam", neighborhood: "City Square, Johor Bahru", rating: 4.4, priceLevel: "$", sourceUrl: SRC.singapore, listSource: "Singapore" }),
  place({ id: "sgp-03", name: "NangLen Thai Restaurant Bar", category: "Thai", neighborhood: "Tanjong Pagar, Singapore", rating: 4.6, priceLevel: "", sourceUrl: SRC.singapore, listSource: "Singapore" }),
  place({ id: "sgp-04", name: "National Kitchen by Violet Oon", category: "Nyonya", neighborhood: "Singapore", rating: 4.4, priceLevel: "$$$", sourceUrl: SRC.singapore, listSource: "Singapore" }),
  place({ id: "sgp-05", name: "The Coconut Club", category: "Singaporean", neighborhood: "Beach Road, Singapore", rating: 4.2, priceLevel: "$$", sourceUrl: SRC.singapore, listSource: "Singapore" }),
  place({ id: "sgp-06", name: "KOK Sen Restaurant", category: "Singaporean", neighborhood: "Singapore", rating: 4.1, priceLevel: "$$", sourceUrl: SRC.singapore, listSource: "Singapore" }),
  place({ id: "sgp-07", name: "The Teochew Kitchenette — Bak Kut Teh", category: "Teochew", neighborhood: "Keong Saik, Singapore", rating: 4.6, priceLevel: "$$", sourceUrl: SRC.singapore, listSource: "Singapore" }),
  place({ id: "sgp-08", name: "Honey Pork Rib / Kra Pow Thai", category: "Thai", neighborhood: "Chinatown Point, Singapore", rating: 4.6, priceLevel: "$", sourceUrl: SRC.singapore, listSource: "Singapore" }),
  place({ id: "sgp-09", name: "99 Old Trees Durian", category: "Durian / Fruit", neighborhood: "Singapore", rating: 4.4, priceLevel: "$$", sourceUrl: SRC.singapore, listSource: "Singapore" }),
  place({ id: "sgp-10", name: "Outram Park Ya Hua Rou Gu Cha", category: "Singaporean (Bak Kut Teh)", neighborhood: "Outram Park, Singapore", rating: 4.2, priceLevel: "$", sourceUrl: SRC.singapore, listSource: "Singapore" }),
  place({ id: "sgp-11", name: "Keng Eng Kee Seafood", category: "Seafood", neighborhood: "Alexandra Village, Singapore", rating: 4.3, priceLevel: "$$", sourceUrl: SRC.singapore, listSource: "Singapore" }),
  place({ id: "sgp-12", name: "Papa Ayam", category: "Restaurant", neighborhood: "313@Somerset, Singapore", rating: 4.5, priceLevel: "$", sourceUrl: SRC.singapore, listSource: "Singapore" }),
  place({ id: "sgp-13", name: "Hawkers' Street @ Tang Plaza", category: "Food court", neighborhood: "Tang Plaza, Singapore", rating: 4.5, priceLevel: "$", sourceUrl: SRC.singapore, listSource: "Singapore" }),
  place({ id: "sgp-14", name: "Market Street Hawker Centre", category: "Hawker centre", neighborhood: "Market Street, Singapore", rating: 4.3, priceLevel: "$", sourceUrl: SRC.singapore, listSource: "Singapore" }),
  place({ id: "sgp-15", name: "328 Katong Laksa", category: "Singaporean (Laksa)", neighborhood: "Katong, Singapore", rating: 3.9, priceLevel: "$", sourceUrl: SRC.singapore, listSource: "Singapore" }),
  place({ id: "sgp-16", name: "Tiong Shian Porridge", category: "Porridge", neighborhood: "Singapore", rating: 3.8, priceLevel: "$", sourceUrl: SRC.singapore, listSource: "Singapore" }),
  place({ id: "sgp-17", name: "Long Beach @ Robertson Quay", category: "Seafood", neighborhood: "Robertson Quay, Singapore", rating: 4.4, priceLevel: "$$$$", sourceUrl: SRC.singapore, listSource: "Singapore" }),

  // ---------- 일식 (Japanese) — 19 of 34 (1 non-restaurant skipped) ----------
  place({ id: "jpn-01", name: "Awagyu Yakiniku Taman Daya", category: "Yakiniku", neighborhood: "Taman Daya, Johor Bahru", rating: 4.9, priceLevel: "$$$$", sourceUrl: SRC.japanese, listSource: "일식" }),
  place({ id: "jpn-02", name: "Keijometo", category: "Japanese", neighborhood: "Johor Bahru", rating: 4.2, priceLevel: "$$", sourceUrl: SRC.japanese, listSource: "일식" }),
  place({ id: "jpn-03", name: "Sushi Shin JB", category: "Sushi", neighborhood: "Johor Bahru", rating: 4.6, priceLevel: "$$$$", sourceUrl: SRC.japanese, listSource: "일식" }),
  place({ id: "jpn-04", name: "Marado Japanese Cuisine", category: "Sushi", neighborhood: "Puteri Harbour", rating: 4.9, priceLevel: "", sourceUrl: SRC.japanese, listSource: "일식" }),
  place({ id: "jpn-05", name: "Monster Curry — ION Orchard", category: "Japanese Curry", neighborhood: "ION Orchard, Singapore", rating: 4.7, priceLevel: "$", sourceUrl: SRC.japanese, listSource: "일식" }),
  place({ id: "jpn-06", name: "Sushidan Singapore", category: "Sushi", neighborhood: "Singapore", rating: 4.6, priceLevel: "$$", sourceUrl: SRC.japanese, listSource: "일식" }),
  place({ id: "jpn-07", name: "Enishi @ International Plaza", category: "Ramen", neighborhood: "International Plaza, Singapore", rating: 4.6, priceLevel: "$$", sourceUrl: SRC.japanese, listSource: "일식" }),
  place({ id: "jpn-08", name: "Omoté", category: "Japanese", neighborhood: "", rating: 4.3, priceLevel: "$$", sourceUrl: SRC.japanese, listSource: "일식" }),
  place({ id: "jpn-09", name: "KOMA Singapore", category: "Japanese", neighborhood: "Singapore", rating: 4.3, priceLevel: "$$$$", sourceUrl: SRC.japanese, listSource: "일식" }),
  place({ id: "jpn-10", name: "Keria 酒菜けりあ", category: "Japanese", neighborhood: "", rating: 4.4, priceLevel: "", sourceUrl: SRC.japanese, listSource: "일식" }),
  place({ id: "jpn-11", name: "SANPOUTEI RAMEN", category: "Ramen", neighborhood: "", rating: 3.1, priceLevel: "$$", sourceUrl: SRC.japanese, listSource: "일식" }),
  place({ id: "jpn-12", name: "Tonshou", category: "Tonkatsu", neighborhood: "", rating: 4.5, priceLevel: "$$", sourceUrl: SRC.japanese, listSource: "일식" }),
  place({ id: "jpn-13", name: "MENSHO TOKYO", category: "Ramen", neighborhood: "Los Angeles, CA", rating: 4.8, priceLevel: "$$", sourceUrl: SRC.japanese, listSource: "일식" }),
  place({ id: "jpn-14", name: "Jeju (LA)", category: "Korean", neighborhood: "Los Angeles, CA", rating: 4.3, priceLevel: "$$$", sourceUrl: SRC.japanese, listSource: "일식" }),
  place({ id: "jpn-15", name: "Oh! BANZAI", category: "Japanese", neighborhood: "", rating: 4.5, priceLevel: "", sourceUrl: SRC.japanese, listSource: "일식" }),
  place({ id: "jpn-16", name: "Newport Seafood Restaurant", category: "Chinese (Lobster)", neighborhood: "Los Angeles area", rating: 4.4, priceLevel: "$$", sourceUrl: SRC.japanese, listSource: "일식" }),
  place({ id: "jpn-17", name: "Toku Unagi & Sushi", category: "Sushi", neighborhood: "Los Angeles, CA", rating: 4.4, priceLevel: "$$$", sourceUrl: SRC.japanese, listSource: "일식" }),
  place({ id: "jpn-18", name: "Uchi West Hollywood", category: "Sushi", neighborhood: "West Hollywood, CA", rating: 4.5, priceLevel: "$$$$", sourceUrl: SRC.japanese, listSource: "일식" }),
  place({ id: "jpn-19", name: "TONCHIN LA", category: "Ramen", neighborhood: "Los Angeles, CA", rating: 4.6, priceLevel: "$$$", sourceUrl: SRC.japanese, listSource: "일식" }),

  // ---------- Chinese — 13 of 14 (1 dup with 일식 list skipped) ----------
  place({ id: "chn-01", name: "Haidilao @ Zenith Mall", category: "Hot Pot", neighborhood: "Zenith Mall, Johor Bahru", rating: 4.7, priceLevel: "$$$", sourceUrl: SRC.chinese, listSource: "Chinese" }),
  place({ id: "chn-02", name: "Xiang Xiang Hunan Cuisine 湘香湖南菜", category: "Hunan", neighborhood: "Chinatown, Singapore", rating: 4.8, priceLevel: "$$", sourceUrl: SRC.chinese, listSource: "Chinese" }),
  place({ id: "chn-03", name: "Jia He Grand Chinese Restaurant", category: "Chinese", neighborhood: "Singapore", rating: 4.3, priceLevel: "$$$$", sourceUrl: SRC.chinese, listSource: "Chinese" }),
  place({ id: "chn-04", name: "Fragrance Bak Kwa @ Chinatown", category: "Bak Kwa shop", neighborhood: "Chinatown, Singapore", rating: 4.8, priceLevel: "", sourceUrl: SRC.chinese, listSource: "Chinese" }),
  place({ id: "chn-05", name: "Jing Hua Xiao Chi (Dim Sum)", category: "Chinese (Dim Sum)", neighborhood: "Singapore", rating: 4.0, priceLevel: "$$", sourceUrl: SRC.chinese, listSource: "Chinese" }),
  place({ id: "chn-06", name: "东北小厨 Dong Bei Xiao Chu", category: "Chinese (Northeastern)", neighborhood: "", rating: 4.3, priceLevel: "$$", sourceUrl: SRC.chinese, listSource: "Chinese" }),
  place({ id: "chn-07", name: "XiaoYanZi Tomato Hot Pot", category: "Hot Pot", neighborhood: "", rating: 4.8, priceLevel: "$$", sourceUrl: SRC.chinese, listSource: "Chinese" }),
  place({ id: "chn-08", name: "Cassia", category: "Cantonese", neighborhood: "", rating: 4.7, priceLevel: "$$$$", sourceUrl: SRC.chinese, listSource: "Chinese" }),
  place({ id: "chn-09", name: "Boiling Point", category: "Hot Pot", neighborhood: "Los Angeles area", rating: 4.2, priceLevel: "$$", sourceUrl: SRC.chinese, listSource: "Chinese" }),
  place({ id: "chn-10", name: "Howlin' Ray's Hot Chicken", category: "Hot Chicken", neighborhood: "Chinatown, Los Angeles", rating: 4.7, priceLevel: "$", sourceUrl: SRC.chinese, listSource: "Chinese" }),
  place({ id: "chn-11", name: "Feng Mao BBQ Lamb Kebab", category: "Chinese BBQ", neighborhood: "Olympic Blvd, Los Angeles", rating: 4.4, priceLevel: "$$$", sourceUrl: SRC.chinese, listSource: "Chinese" }),
  place({ id: "chn-12", name: "Bao Chick", category: "Fried Chicken Bao", neighborhood: "Los Angeles area", rating: 4.3, priceLevel: "$", sourceUrl: SRC.chinese, listSource: "Chinese" }),
  place({ id: "chn-13", name: "Sam Woo Village BBQ", category: "Chinese BBQ", neighborhood: "Los Angeles area", rating: 4.3, priceLevel: "$$", sourceUrl: SRC.chinese, listSource: "Chinese" }),
];

// ---------- helpers ----------
const NOISE_LABEL = {
  quiet: "Quiet",
  moderate: "Moderate",
  loud: "Lively",
};

function classNames(...xs) {
  return xs.filter(Boolean).join(" ");
}

// ---------- UI ----------
function Header() {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-amber-600" strokeWidth={2.2} />
          <div>
            <div className="text-lg font-semibold tracking-tight text-stone-900">
              TasteTrust
            </div>
            <div className="text-[11px] text-stone-500 -mt-0.5">
              Verified by Gi-yeon · Singapore · Johor Bahru · LA
            </div>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-stone-600">
          <a className="hover:text-stone-900" href="#places">
            Places
          </a>
          <a className="hover:text-stone-900" href="#about">
            How verification works
          </a>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="bg-gradient-to-b from-amber-50 to-white border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-5 py-12 md:py-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-amber-200 rounded-full text-xs font-medium text-amber-700 mb-5">
          <ShieldCheck className="w-3.5 h-3.5" />
          Every restaurant personally vetted
        </div>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-stone-900 leading-tight">
          The restaurants we&rsquo;d <em className="text-amber-700 not-italic">actually</em> send you to.
        </h1>
        <p className="mt-4 text-stone-600 max-w-xl mx-auto">
          A small, verified list of restaurants across Singapore, Johor Bahru
          and LA — vetted in person, scored honestly, and tagged with what
          actually matters.
        </p>
      </div>
    </section>
  );
}

function FilterBar({ filters, setFilters, query, setQuery, listFilter, setListFilter, listOptions }) {
  const toggle = (key) => setFilters((f) => ({ ...f, [key]: !f[key] }));

  return (
    <div className="max-w-6xl mx-auto px-5 mt-8">
      <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Search className="w-4 h-4 text-stone-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, neighborhood, cuisine…"
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-stone-400"
          />
          <Filter className="w-4 h-4 text-stone-400 hidden sm:block" />
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <button
            onClick={() => setListFilter("all")}
            className={classNames(
              "text-xs px-3 py-1.5 rounded-full border transition",
              listFilter === "all"
                ? "bg-stone-900 text-white border-stone-900"
                : "bg-white text-stone-700 border-stone-200 hover:border-stone-400"
            )}
          >
            All lists
          </button>
          {listOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setListFilter(opt)}
              className={classNames(
                "text-xs px-3 py-1.5 rounded-full border transition",
                listFilter === opt
                  ? "bg-stone-900 text-white border-stone-900"
                  : "bg-white text-stone-700 border-stone-200 hover:border-stone-400"
              )}
            >
              {opt}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-stone-100">
          <FilterChip
            active={filters.dogFriendly}
            onClick={() => toggle("dogFriendly")}
            icon={<Dog className="w-3.5 h-3.5" />}
            label="Dog-friendly"
          />
          <FilterChip
            active={filters.parking}
            onClick={() => toggle("parking")}
            icon={<Car className="w-3.5 h-3.5" />}
            label="Parking"
          />
          <FilterChip
            active={filters.veganOption}
            onClick={() => toggle("veganOption")}
            icon={<Leaf className="w-3.5 h-3.5" />}
            label="Vegan options"
          />
          <FilterChip
            active={filters.quiet}
            onClick={() => toggle("quiet")}
            icon={<Volume2 className="w-3.5 h-3.5" />}
            label="Quiet enough to talk"
          />
        </div>
      </div>
    </div>
  );
}

function FilterChip({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={classNames(
        "inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition",
        active
          ? "bg-amber-600 text-white border-amber-600"
          : "bg-white text-stone-700 border-stone-200 hover:border-stone-400"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function PlaceCard({ p }) {
  return (
    <article className="bg-white border border-stone-200 rounded-2xl overflow-hidden hover:shadow-md transition group flex flex-col">
      <div className="aspect-[16/10] bg-gradient-to-br from-amber-50 to-stone-100 overflow-hidden">
        {p.image ? (
          <img
            src={p.image}
            alt={p.name}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs">
            <ShieldCheck className="w-8 h-8 text-amber-300" />
          </div>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-stone-900 leading-tight text-[15px] truncate">
              {p.name}
            </h3>
            {p.neighborhood ? (
              <div className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="truncate">{p.neighborhood}</span>
              </div>
            ) : null}
          </div>
          <div className="flex items-center gap-1 text-amber-600 text-sm font-medium shrink-0">
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            {p.rating.toFixed(1)}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-stone-600">
          <span className="px-2 py-0.5 bg-stone-100 rounded-full">
            {p.category}
          </span>
          {p.priceLevel ? (
            <span className="px-2 py-0.5 bg-stone-100 rounded-full">
              {p.priceLevel}
            </span>
          ) : null}
          {p.listSource ? (
            <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full">
              {p.listSource}
            </span>
          ) : null}
        </div>

        {p.giyeonNote ? (
          <p className="mt-3 text-sm text-stone-700 italic border-l-2 border-amber-300 pl-3">
            &ldquo;{p.giyeonNote}&rdquo;
          </p>
        ) : null}

        <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] text-stone-600">
          {p.filters.dogFriendly && <Tag icon={<Dog className="w-3 h-3" />}>Dogs OK</Tag>}
          {p.filters.parking && <Tag icon={<Car className="w-3 h-3" />}>Parking</Tag>}
          {p.filters.veganOption && <Tag icon={<Leaf className="w-3 h-3" />}>Vegan</Tag>}
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between text-[11px] text-stone-500 border-t border-stone-100">
          <span className="inline-flex items-center gap-1">
            {p.visitDate ? (
              <>
                <CalendarDays className="w-3 h-3" />
                Visited {p.visitDate}
              </>
            ) : (
              <span className="text-stone-400">Awaiting note</span>
            )}
          </span>
          {p.sourceUrl ? (
            <a
              href={p.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-stone-700"
            >
              Maps <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            <span className="inline-flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {p.analytics.monthlyViews.toLocaleString()} / mo
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

function Tag({ icon, children }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-stone-100 rounded-full">
      {icon}
      {children}
    </span>
  );
}

function ListBreakdown({ places }) {
  const data = useMemo(() => {
    const counts = {};
    places.forEach((p) => {
      const k = p.listSource || "Other";
      counts[k] = (counts[k] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [places]);

  return (
    <section className="max-w-6xl mx-auto px-5 mt-12">
      <div className="bg-white border border-stone-200 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-stone-900">List breakdown</h2>
          <span className="text-xs text-stone-500">
            {places.length} places across {data.length} curated lists
          </span>
        </div>
        <div style={{ width: "100%", height: 220 }}>
          <ResponsiveContainer>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#C9A84C" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

// ---------- App ----------
export default function TasteTrust() {
  const [query, setQuery] = useState("");
  const [listFilter, setListFilter] = useState("all");
  const [filters, setFilters] = useState({
    dogFriendly: false,
    parking: false,
    veganOption: false,
    quiet: false,
  });

  const listOptions = useMemo(() => {
    const set = new Set();
    PLACES.forEach((p) => p.listSource && set.add(p.listSource));
    return [...set];
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PLACES.filter((p) => {
      if (listFilter !== "all" && p.listSource !== listFilter) return false;
      if (q) {
        const blob =
          `${p.name} ${p.neighborhood} ${p.category} ${p.listSource}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }
      if (filters.dogFriendly && !p.filters.dogFriendly) return false;
      if (filters.parking && !p.filters.parking) return false;
      if (filters.veganOption && !p.filters.veganOption) return false;
      if (filters.quiet && p.filters.noiseLevel !== "quiet") return false;
      return true;
    });
  }, [query, filters, listFilter]);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans">
      <Header />
      <Hero />

      <FilterBar
        filters={filters}
        setFilters={setFilters}
        query={query}
        setQuery={setQuery}
        listFilter={listFilter}
        setListFilter={setListFilter}
        listOptions={listOptions}
      />

      <main id="places" className="max-w-6xl mx-auto px-5 mt-8 pb-16">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-stone-700">
            {visible.length} verified place{visible.length === 1 ? "" : "s"}
            {listFilter !== "all" ? ` · ${listFilter}` : ""}
          </h2>
          <span className="text-xs text-stone-500">
            Updated {new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" })}
          </span>
        </div>

        {visible.length === 0 ? (
          <div className="text-center py-16 text-stone-500 text-sm border border-dashed border-stone-300 rounded-2xl">
            No places match the current filters.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {visible.map((p) => (
              <PlaceCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </main>

      <ListBreakdown places={PLACES} />

      <footer
        id="about"
        className="border-t border-stone-200 mt-10 py-10 text-center text-xs text-stone-500"
      >
        TasteTrust · Every restaurant on this list has been personally visited
        and vetted. No sponsored placements.
      </footer>
    </div>
  );
}
