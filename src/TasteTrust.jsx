import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  MapPin,
  Star,
  ShieldCheck,
  ExternalLink,
  ArrowUpDown,
  X,
  Heart,
  Share2,
  Languages,
  Clock,
  ChefHat,
  History,
  Sparkles,
} from "lucide-react";

// =====================================================================
//  TasteTrust — verified restaurant curation, by Gayoen.
//  v3: cuisine images, detail panel, favorites, deep links, ko/en, PWA.
// =====================================================================

const DEFAULTS = {
  neighborhood: "",
  filters: { dogFriendly: false, noiseLevel: "moderate", parking: false, veganOption: false },
  gayoenNote: "",
  visitDate: "",
  image: "",
  verifiedVisits: 0,
  analytics: { monthlyViews: 0, adClicks: 0, conversions: 0, couponsUsed: 0 },
  sourceUrl: "",
  listSource: "",
};

const place = (o) => ({
  ...DEFAULTS,
  ...o,
  filters: { ...DEFAULTS.filters, ...(o.filters || {}) },
  analytics: { ...DEFAULTS.analytics, ...(o.analytics || {}) },
});

const SRC = {
  korean: "https://maps.app.goo.gl/N4ibwRo1rNeg4DJV7",
  restaurant: "https://maps.app.goo.gl/3UaRat3mv2WzSbDK9",
  cafe: "https://maps.app.goo.gl/qi2nxeykvWq22b8H9",
  singapore: "https://maps.app.goo.gl/edh4GMEAoB1wrHbEA",
  japanese: "https://maps.app.goo.gl/gKbzSzySHks9b8L57",
  chinese: "https://www.google.com/maps/@/data=!3m1!4b1!4m2!11m1!2s7E5WcEjiK5GpQSo94Yz6NaI5AGS72A",
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

  // ---------- Singapore — 17 of 44 ----------
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

  // ---------- 일식 (Japanese) — 19 of 34 ----------
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

  // ---------- Chinese — 13 of 14 ----------
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

// ===== NORMALIZATION HELPERS =====

function getRegion(p) {
  const n = (p.neighborhood || "").toLowerCase();
  if (n.includes("los angeles") || n.includes("hollywood") || n.includes("olympic")) return "Los Angeles";
  if (n.includes("johor") || n.includes("pelangi") || n.includes("taman") || n.includes("puteri") || n.includes("city square") || n.includes("r&f") || n.includes("zenith")) return "Johor Bahru";
  if (n.includes("penang")) return "Johor Bahru"; // group Penang under JB for now
  if (n.includes("singapore") || n.includes("sentosa") || /\b(tanjong|telok|mandarin|orchard|clarke|raffles|beach road|keong saik|outram|alexandra|somerset|tang plaza|market street|katong|robertson|amoy|international plaza|tras|chinatown)\b/.test(n)) return "Singapore";
  if (p.listSource === "한식" || p.listSource === "Restaurant" || p.listSource === "Cafe" || p.listSource === "Singapore" || p.listSource === "일식" || p.listSource === "Chinese") return "Singapore";
  return "Other";
}

function getCuisine(p) {
  const c = (p.category || "").toLowerCase();
  if (c.includes("korean")) return "Korean";
  if (c.includes("japanese") || c.includes("sushi") || c.includes("yakiniku") || c.includes("ramen") || c.includes("tonkatsu")) return "Japanese";
  if (c.includes("italian") || c.includes("pizza")) return "Italian";
  if (c.includes("chinese") || c.includes("hot pot") || c.includes("hunan") || c.includes("cantonese") || c.includes("bak kwa") || c.includes("hot chicken") || c.includes("bao") || c.includes("dim sum")) return "Chinese";
  if (c.includes("thai")) return "Thai";
  if (c.includes("singaporean") || c.includes("nyonya") || c.includes("teochew") || c.includes("kopitiam") || c.includes("hawker") || c.includes("porridge") || c.includes("food court") || c.includes("durian") || c.includes("laksa") || c.includes("bak kut teh")) return "Singaporean";
  if (c.includes("cafe") || c.includes("coffee") || c.includes("bakery") || c.includes("dessert") || c.includes("ice cream") || c.includes("board game")) return "Cafe";
  if (c.includes("bar") || c.includes("lounge") || c.includes("gastropub")) return "Bar";
  if (c.includes("modern european") || c.includes("fine dining")) return "Fine Dining";
  if (c.includes("seafood")) return "Seafood";
  return "Other";
}

const CUISINES = {
  Korean: { emoji: "🍖", grad: "from-rose-200 via-amber-100 to-amber-50" },
  Japanese: { emoji: "🍣", grad: "from-rose-100 via-pink-50 to-stone-50" },
  Italian: { emoji: "🍝", grad: "from-emerald-100 via-amber-50 to-rose-100" },
  Chinese: { emoji: "🥡", grad: "from-red-200 via-amber-100 to-amber-50" },
  Thai: { emoji: "🌶️", grad: "from-lime-100 via-amber-50 to-rose-100" },
  Singaporean: { emoji: "🦐", grad: "from-teal-100 via-amber-50 to-amber-100" },
  Cafe: { emoji: "☕", grad: "from-amber-100 via-amber-50 to-stone-50" },
  Bar: { emoji: "🍷", grad: "from-purple-200 via-stone-100 to-stone-50" },
  "Fine Dining": { emoji: "🍽️", grad: "from-stone-300 via-stone-100 to-stone-50" },
  Seafood: { emoji: "🦞", grad: "from-sky-100 via-amber-50 to-amber-100" },
  Other: { emoji: "🍴", grad: "from-stone-100 to-stone-50" },
};

// Cuisine-specific Unsplash photos. Deterministically picked by id hash.
const CUISINE_IMAGES = {
  Korean: [
    "https://images.unsplash.com/photo-1583224964978-2257b960c3d3?w=600&q=70",
    "https://images.unsplash.com/photo-1635352997299-9a7c19a4ec4e?w=600&q=70",
    "https://images.unsplash.com/photo-1632558148928-2ed31d8632b6?w=600&q=70",
  ],
  Japanese: [
    "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&q=70",
    "https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=600&q=70",
    "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=600&q=70",
  ],
  Italian: [
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=70",
    "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&q=70",
    "https://images.unsplash.com/photo-1481931098730-318b6f776db0?w=600&q=70",
  ],
  Chinese: [
    "https://images.unsplash.com/photo-1552611052-33e04de081de?w=600&q=70",
    "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&q=70",
    "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=70",
  ],
  Thai: [
    "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600&q=70",
    "https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=600&q=70",
  ],
  Singaporean: [
    "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=600&q=70",
    "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=600&q=70",
    "https://images.unsplash.com/photo-1603088549155-6ae9395b928f?w=600&q=70",
  ],
  Cafe: [
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=70",
    "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=600&q=70",
    "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=70",
  ],
  Bar: [
    "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&q=70",
    "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=70",
  ],
  "Fine Dining": [
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=70",
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=70",
  ],
  Seafood: [
    "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=600&q=70",
    "https://images.unsplash.com/photo-1565530341854-9c8aef3e8f1d?w=600&q=70",
  ],
  Other: [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=70",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=70",
  ],
};

function pickImage(p, cuisine) {
  const list = CUISINE_IMAGES[cuisine] || CUISINE_IMAGES.Other;
  const id = p.id || "x";
  let h = 7;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return list[h % list.length];
}

const REGIONS = ["Singapore", "Johor Bahru", "Los Angeles"];

const SORT_OPTIONS = [
  { id: "rating", labelKey: "sort.rating" },
  { id: "price-asc", labelKey: "sort.priceAsc" },
  { id: "price-desc", labelKey: "sort.priceDesc" },
  { id: "name", labelKey: "sort.name" },
];

const PRICE_TO_NUM = { "": 0, $: 1, $$: 2, $$$: 3, $$$$: 4 };

// ===== I18N =====

const STRINGS = {
  en: {
    "site.title": "TasteTrust",
    "site.subtitle": "Verified by Gayoen",
    "site.tagline": "Where Gayoen actually eats.",
    "site.intro": "{n} restaurants, personally visited and vetted across three cities. Tap a pin or pick a city below.",
    "site.regionsList": "Singapore · Johor Bahru · Los Angeles",
    "tabs.all": "All",
    "tabs.favs": "♥ Favorites",
    "cuisines.all": "All cuisines",
    "search.placeholder": "Search name, neighborhood…",
    "search.clear": "Clear search",
    "sort.rating": "★ Highest rated",
    "sort.priceAsc": "$ → $$$$",
    "sort.priceDesc": "$$$$ → $",
    "sort.name": "A → Z",
    "results.places": "places",
    "results.place": "place",
    "results.clearAll": "Clear all",
    "card.maps": "Open in Google Maps",
    "card.fav.add": "Save to favorites",
    "card.fav.remove": "Remove from favorites",
    "panel.close": "Close",
    "panel.share": "Copy link",
    "panel.shared": "Link copied!",
    "panel.menu": "Recommended menu",
    "panel.menu.empty": "Gayoen will add menu picks after the next visit.",
    "panel.hours": "Hours",
    "panel.hours.empty": "Check Google Maps for opening hours.",
    "panel.note": "Gayoen's note",
    "panel.note.empty": "No note yet. Coming after Gayoen's next visit.",
    "panel.visit": "Last visited {date}",
    "recent.title": "Recently viewed",
    "recent.clear": "Clear",
    "empty.title": "No matches with the current filters.",
    "empty.cta": "Clear filters",
    "empty.favs": "No favorites yet. Tap the ♥ on any card to save it.",
    "footer.line1": "TasteTrust · by Gayoen",
    "footer.line2": "Every restaurant on this list has been personally visited and vetted. No sponsored placements.",
    "lang.toggle": "한국어",
  },
  ko: {
    "site.title": "TasteTrust",
    "site.subtitle": "가연이 검증",
    "site.tagline": "가연이가 진짜 가는 식당.",
    "site.intro": "세 도시에서 가연이가 직접 다녀온 검증 식당 {n}곳. 핀을 누르거나 아래 도시를 골라보세요.",
    "site.regionsList": "싱가포르 · 조호바루 · 로스앤젤레스",
    "tabs.all": "전체",
    "tabs.favs": "♥ 즐겨찾기",
    "cuisines.all": "전체 카테고리",
    "search.placeholder": "이름, 동네 검색…",
    "search.clear": "검색 지우기",
    "sort.rating": "★ 평점 높은 순",
    "sort.priceAsc": "$ → $$$$",
    "sort.priceDesc": "$$$$ → $",
    "sort.name": "가나다순",
    "results.places": "곳",
    "results.place": "곳",
    "results.clearAll": "모두 초기화",
    "card.maps": "구글맵에서 열기",
    "card.fav.add": "즐겨찾기에 추가",
    "card.fav.remove": "즐겨찾기에서 제거",
    "panel.close": "닫기",
    "panel.share": "링크 복사",
    "panel.shared": "복사 완료!",
    "panel.menu": "추천 메뉴",
    "panel.menu.empty": "다음 방문 때 가연이가 추천 메뉴를 추가할 예정이에요.",
    "panel.hours": "영업 시간",
    "panel.hours.empty": "영업 시간은 구글맵에서 확인하세요.",
    "panel.note": "가연 한 줄평",
    "panel.note.empty": "아직 코멘트 없음. 다음 방문 후 추가 예정.",
    "panel.visit": "최근 방문 {date}",
    "recent.title": "최근 본 식당",
    "recent.clear": "지우기",
    "empty.title": "필터 조건에 맞는 식당이 없어요.",
    "empty.cta": "필터 초기화",
    "empty.favs": "즐겨찾기가 아직 없어요. 카드에서 ♥를 눌러 저장하세요.",
    "footer.line1": "TasteTrust · 가연 큐레이션",
    "footer.line2": "이 리스트의 모든 식당은 가연이가 직접 방문하고 검증했어요. 광고/협찬 없음.",
    "lang.toggle": "EN",
  },
};

function tr(lang, key, vars) {
  let s = (STRINGS[lang] && STRINGS[lang][key]) || STRINGS.en[key] || key;
  if (vars) Object.entries(vars).forEach(([k, v]) => { s = s.replace("{" + k + "}", v); });
  return s;
}

// ===== STORAGE HOOKS =====

function safeGet(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v == null ? fallback : JSON.parse(v);
  } catch (e) {
    return fallback;
  }
}
function safeSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
}

function useFavorites() {
  const [favs, setFavs] = useState(() => safeGet("tt_favs", []));
  useEffect(() => safeSet("tt_favs", favs), [favs]);
  const toggle = useCallback(
    (id) => setFavs((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id])),
    []
  );
  const isFav = useCallback((id) => favs.includes(id), [favs]);
  return { favs, toggle, isFav };
}

function useRecent() {
  const [recent, setRecent] = useState(() => safeGet("tt_recent", []));
  useEffect(() => safeSet("tt_recent", recent), [recent]);
  const push = useCallback(
    (id) => setRecent((r) => [id, ...r.filter((x) => x !== id)].slice(0, 8)),
    []
  );
  const clear = useCallback(() => setRecent([]), []);
  return { recent, push, clear };
}

// ===== HELPERS =====

function classNames(...xs) {
  return xs.filter(Boolean).join(" ");
}

function readUrl() {
  if (typeof window === "undefined") return {};
  const p = new URLSearchParams(window.location.search);
  return {
    region: p.get("region") || null,
    cuisine: p.get("cuisine") || null,
    q: p.get("q") || "",
    fav: p.get("fav") === "1",
    place: p.get("place") || null,
    sort: p.get("sort") || "rating",
  };
}

function writeUrl(state) {
  if (typeof window === "undefined") return;
  const p = new URLSearchParams();
  if (state.region) p.set("region", state.region);
  if (state.cuisine) p.set("cuisine", state.cuisine);
  if (state.q) p.set("q", state.q);
  if (state.fav) p.set("fav", "1");
  if (state.place) p.set("place", state.place);
  if (state.sort && state.sort !== "rating") p.set("sort", state.sort);
  const qs = p.toString();
  const url = window.location.pathname + (qs ? "?" + qs : "");
  window.history.replaceState({}, "", url);
}

// ===== UI =====

function Header({ lang, setLang }) {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-stone-200">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" strokeWidth={2.4} />
          <div className="min-w-0">
            <div className="text-base font-semibold tracking-tight text-stone-900 leading-none">
              {tr(lang, "site.title")}
            </div>
            <div className="text-[10px] text-stone-500 mt-0.5 truncate">
              {tr(lang, "site.subtitle")}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] text-stone-500 hidden sm:block">
            {tr(lang, "site.regionsList")}
          </span>
          <button
            onClick={() => setLang(lang === "en" ? "ko" : "en")}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full border border-stone-200 bg-white text-stone-700 hover:border-stone-400 transition"
            aria-label="Toggle language"
          >
            <Languages className="w-3.5 h-3.5" />
            {tr(lang, "lang.toggle")}
          </button>
        </div>
      </div>
    </header>
  );
}

function CityMap({ counts, currentRegion, setRegion, lang }) {
  const cities = [
    { id: "Los Angeles", x: 90, y: 95, label: "LA" },
    { id: "Johor Bahru", x: 510, y: 145, label: "JB" },
    { id: "Singapore", x: 540, y: 165, label: "SG" },
  ];

  return (
    <div className="relative bg-gradient-to-b from-amber-50 to-white border-b border-stone-200">
      <div className="max-w-5xl mx-auto px-4 pt-6 pb-4">
        <svg viewBox="0 0 640 220" className="w-full h-32 sm:h-40" aria-hidden="true">
          <defs>
            <linearGradient id="land" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#fef3c7" />
              <stop offset="1" stopColor="#fde68a" />
            </linearGradient>
          </defs>
          <path d="M30,40 C60,20 130,30 160,80 C170,120 130,150 90,150 C40,150 10,100 30,40 Z" fill="url(#land)" opacity="0.55" />
          <path d="M380,40 C460,20 600,40 620,90 C625,140 580,180 510,180 C430,185 370,140 380,40 Z" fill="url(#land)" opacity="0.55" />
          {Array.from({ length: 30 }).map((_, i) => (
            <circle key={i} cx={180 + ((i * 7) % 200)} cy={70 + ((i * 11) % 110)} r="1" fill="#d6d3d1" opacity="0.4" />
          ))}
          {cities.map((c) => {
            const active = currentRegion === c.id;
            return (
              <g key={c.id} style={{ cursor: "pointer" }} onClick={() => setRegion(active ? null : c.id)}>
                <circle cx={c.x} cy={c.y} r={active ? "18" : "10"} fill="#C9A84C" opacity={active ? "0.25" : "0.15"} />
                <circle cx={c.x} cy={c.y} r="6" fill={active ? "#92400e" : "#C9A84C"} />
                <text x={c.x} y={c.y - 14} textAnchor="middle" fontSize="11" fontWeight="600" fill={active ? "#78350f" : "#57534e"}>
                  {c.label} · {counts[c.id] || 0}
                </text>
              </g>
            );
          })}
        </svg>
        <h1 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-stone-900 text-center">
          {tr(lang, "site.tagline")}
        </h1>
        <p className="mt-1.5 text-sm text-stone-600 text-center max-w-md mx-auto">
          {tr(lang, "site.intro", { n: PLACES.length })}
        </p>
      </div>
    </div>
  );
}

function RegionTabs({ regions, current, setCurrent, counts, favCount, favOnly, setFavOnly, lang }) {
  return (
    <div className="sticky top-[57px] z-20 bg-white/95 backdrop-blur border-b border-stone-200">
      <div className="max-w-5xl mx-auto px-2 sm:px-4">
        <div className="flex overflow-x-auto gap-1 py-2 -mx-2 px-2">
          <Pill label={tr(lang, "tabs.all")} count={Object.values(counts).reduce((a, b) => a + b, 0)} active={!current && !favOnly} onClick={() => { setCurrent(null); setFavOnly(false); }} dark />
          {regions.map((r) => (
            <Pill key={r} label={r} count={counts[r] || 0} active={current === r && !favOnly} onClick={() => { setCurrent(r); setFavOnly(false); }} dark />
          ))}
          <Pill label={tr(lang, "tabs.favs")} count={favCount} active={favOnly} onClick={() => { setFavOnly(!favOnly); setCurrent(null); }} amber />
        </div>
      </div>
    </div>
  );
}

function Pill({ label, count, active, onClick, dark, amber }) {
  const activeStyle = amber ? "bg-rose-500 text-white border-rose-500" : "bg-stone-900 text-white border-stone-900";
  return (
    <button
      onClick={onClick}
      className={classNames(
        "shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-sm font-medium transition",
        active ? activeStyle : "bg-white text-stone-700 border-stone-200 hover:border-stone-400"
      )}
    >
      {label}
      <span className={classNames("text-[10px] px-1.5 py-0.5 rounded-full", active ? "bg-white/20 text-white" : "bg-stone-100 text-stone-500")}>
        {count}
      </span>
    </button>
  );
}

function CuisineFilters({ cuisines, current, setCurrent, counts, lang }) {
  return (
    <div className="max-w-5xl mx-auto px-4 pt-3">
      <div className="flex flex-wrap gap-1.5">
        <CuisineChip label={tr(lang, "cuisines.all")} emoji="" count={Object.values(counts).reduce((a, b) => a + b, 0)} active={current === null} onClick={() => setCurrent(null)} />
        {cuisines.map((c) => (
          <CuisineChip key={c} label={c} emoji={CUISINES[c]?.emoji || "🍴"} count={counts[c] || 0} active={current === c} onClick={() => setCurrent(c)} />
        ))}
      </div>
    </div>
  );
}

function CuisineChip({ label, emoji, count, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={classNames(
        "inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs transition",
        active ? "bg-amber-600 text-white border-amber-600" : "bg-white text-stone-700 border-stone-200 hover:border-stone-400"
      )}
    >
      {emoji && <span>{emoji}</span>}
      <span>{label}</span>
      <span className={classNames("text-[10px] ml-0.5", active ? "text-white/70" : "text-stone-400")}>{count}</span>
    </button>
  );
}

function SearchAndSort({ query, setQuery, sort, setSort, lang }) {
  return (
    <div className="max-w-5xl mx-auto px-4 pt-3 flex gap-2">
      <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-white border border-stone-200 rounded-full">
        <Search className="w-4 h-4 text-stone-400 shrink-0" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={tr(lang, "search.placeholder")}
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-stone-400 min-w-0"
        />
        {query && (
          <button onClick={() => setQuery("")} aria-label={tr(lang, "search.clear")}>
            <X className="w-4 h-4 text-stone-400 hover:text-stone-600" />
          </button>
        )}
      </div>
      <div className="relative">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="appearance-none pl-9 pr-7 py-2 bg-white border border-stone-200 rounded-full text-xs font-medium text-stone-700 cursor-pointer focus:outline-none focus:border-stone-400"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.id} value={o.id}>{tr(lang, o.labelKey)}</option>
          ))}
        </select>
        <ArrowUpDown className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
}

function RecentSection({ recent, places, onPick, onClear, lang }) {
  const items = useMemo(() => {
    const byId = Object.fromEntries(places.map((p) => [p.id, p]));
    return recent.map((id) => byId[id]).filter(Boolean);
  }, [recent, places]);

  if (items.length === 0) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 pt-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-medium text-stone-700">
          <History className="w-3.5 h-3.5" />
          {tr(lang, "recent.title")}
        </div>
        <button onClick={onClear} className="text-[11px] text-stone-500 hover:text-stone-900 underline">
          {tr(lang, "recent.clear")}
        </button>
      </div>
      <div className="flex overflow-x-auto gap-2 -mx-4 px-4 pb-1">
        {items.map((p) => {
          const cuisine = getCuisine(p);
          const meta = CUISINES[cuisine] || CUISINES.Other;
          return (
            <button
              key={p.id}
              onClick={() => onPick(p)}
              className="shrink-0 w-44 bg-white border border-stone-200 rounded-xl overflow-hidden text-left hover:shadow-sm transition"
            >
              <div className={classNames("h-12 bg-gradient-to-br flex items-center justify-center text-2xl", meta.grad)}>
                {meta.emoji}
              </div>
              <div className="p-2">
                <div className="text-[12px] font-medium text-stone-900 truncate">{p.name}</div>
                <div className="text-[10px] text-stone-500 truncate">{p.neighborhood || cuisine}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PlaceCard({ p, cuisine, isFav, onToggleFav, onOpen, lang }) {
  const meta = CUISINES[cuisine] || CUISINES.Other;
  const img = pickImage(p, cuisine);

  return (
    <article
      onClick={() => onOpen(p)}
      className="bg-white border border-stone-200 rounded-2xl overflow-hidden flex flex-col group hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
    >
      <div className={classNames("relative h-32 bg-gradient-to-br overflow-hidden", meta.grad)}>
        <img
          src={img}
          alt={p.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-300"
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
        <div className="absolute top-2 right-2 inline-flex items-center gap-0.5 text-amber-700 text-xs font-semibold bg-white/90 backdrop-blur px-2 py-0.5 rounded-full shadow-sm">
          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
          {p.rating.toFixed(1)}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFav(p.id); }}
          aria-label={isFav ? tr(lang, "card.fav.remove") : tr(lang, "card.fav.add")}
          className="absolute top-2 left-2 w-8 h-8 inline-flex items-center justify-center rounded-full bg-white/90 backdrop-blur shadow-sm hover:bg-white transition"
        >
          <Heart className={classNames("w-4 h-4 transition", isFav ? "fill-rose-500 text-rose-500" : "text-stone-600")} />
        </button>
      </div>

      <div className="p-3.5 flex-1 flex flex-col gap-2">
        <div>
          <h3 className="font-semibold text-stone-900 leading-snug text-[15px]">{p.name}</h3>
          {p.neighborhood && (
            <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{p.neighborhood}</span>
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-1 text-[11px] text-stone-700">
          <span className="px-1.5 py-0.5 bg-stone-100 rounded">{cuisine}</span>
          {p.category && p.category !== cuisine && (
            <span className="px-1.5 py-0.5 bg-stone-50 text-stone-500 rounded">{p.category}</span>
          )}
          {p.priceLevel && (
            <span className="px-1.5 py-0.5 bg-stone-100 rounded font-medium">{p.priceLevel}</span>
          )}
        </div>
      </div>
    </article>
  );
}

function DetailPanel({ place, onClose, isFav, onToggleFav, onShare, sharedAt, lang }) {
  if (!place) return null;
  const cuisine = getCuisine(place);
  const meta = CUISINES[cuisine] || CUISINES.Other;
  const img = pickImage(place, cuisine);

  // Close on ESC
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-stretch sm:justify-end" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-white sm:h-full max-h-[92vh] sm:max-h-none rounded-t-3xl sm:rounded-none shadow-2xl overflow-y-auto animate-[slideup_0.25s_ease-out] sm:animate-[slideleft_0.25s_ease-out]">
        <div className={classNames("relative h-48 bg-gradient-to-br overflow-hidden", meta.grad)}>
          <img src={img} alt={place.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
          <button
            onClick={onClose}
            aria-label={tr(lang, "panel.close")}
            className="absolute top-3 right-3 w-9 h-9 inline-flex items-center justify-center rounded-full bg-white/90 backdrop-blur shadow hover:bg-white"
          >
            <X className="w-5 h-5 text-stone-700" />
          </button>
          <button
            onClick={() => onToggleFav(place.id)}
            aria-label={isFav ? tr(lang, "card.fav.remove") : tr(lang, "card.fav.add")}
            className="absolute top-3 left-3 w-9 h-9 inline-flex items-center justify-center rounded-full bg-white/90 backdrop-blur shadow hover:bg-white"
          >
            <Heart className={classNames("w-5 h-5", isFav ? "fill-rose-500 text-rose-500" : "text-stone-700")} />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-xl font-semibold tracking-tight text-stone-900">{place.name}</h2>
              <div className="inline-flex items-center gap-1 text-amber-700 text-sm font-semibold shrink-0">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                {place.rating.toFixed(1)}
              </div>
            </div>
            {place.neighborhood && (
              <div className="text-sm text-stone-600 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5" />
                {place.neighborhood}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 text-xs">
            <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full inline-flex items-center gap-1">
              <span>{meta.emoji}</span>
              {cuisine}
            </span>
            {place.category && place.category !== cuisine && (
              <span className="px-2 py-0.5 bg-stone-100 text-stone-600 rounded-full">{place.category}</span>
            )}
            {place.priceLevel && (
              <span className="px-2 py-0.5 bg-stone-100 text-stone-700 font-medium rounded-full">{place.priceLevel}</span>
            )}
          </div>

          <Section icon={<Sparkles className="w-3.5 h-3.5" />} title={tr(lang, "panel.note")}>
            {place.gayoenNote ? (
              <p className="text-sm text-stone-700 italic border-l-2 border-amber-300 pl-3">&ldquo;{place.gayoenNote}&rdquo;</p>
            ) : (
              <p className="text-xs text-stone-400">{tr(lang, "panel.note.empty")}</p>
            )}
          </Section>

          <Section icon={<ChefHat className="w-3.5 h-3.5" />} title={tr(lang, "panel.menu")}>
            <p className="text-xs text-stone-400">{tr(lang, "panel.menu.empty")}</p>
          </Section>

          <Section icon={<Clock className="w-3.5 h-3.5" />} title={tr(lang, "panel.hours")}>
            <p className="text-xs text-stone-400">{tr(lang, "panel.hours.empty")}</p>
          </Section>

          {place.visitDate && (
            <p className="text-[11px] text-stone-500">
              {tr(lang, "panel.visit", { date: place.visitDate })}
            </p>
          )}

          <div className="flex flex-col gap-2 mt-2">
            {place.sourceUrl && (
              <a
                href={place.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium text-white bg-stone-900 rounded-full hover:bg-stone-800 transition"
              >
                {tr(lang, "card.maps")}
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            <button
              onClick={onShare}
              className="inline-flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium text-stone-700 bg-stone-50 border border-stone-200 rounded-full hover:bg-stone-100 transition"
            >
              <Share2 className="w-4 h-4" />
              {sharedAt ? tr(lang, "panel.shared") : tr(lang, "panel.share")}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideup { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes slideleft { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
    </div>
  );
}

function Section({ icon, title, children }) {
  return (
    <div>
      <div className="text-[11px] font-medium text-stone-500 uppercase tracking-wider flex items-center gap-1 mb-1">
        {icon}
        {title}
      </div>
      {children}
    </div>
  );
}

function EmptyState({ onClear, message, ctaLabel }) {
  return (
    <div className="text-center py-16 text-stone-500 text-sm border border-dashed border-stone-300 rounded-2xl mx-4">
      <div className="text-3xl mb-2">🍽️</div>
      <div className="px-4">{message}</div>
      {ctaLabel && (
        <button onClick={onClear} className="mt-3 text-xs underline text-stone-700 hover:text-stone-900">
          {ctaLabel}
        </button>
      )}
    </div>
  );
}

function Footer({ lang }) {
  return (
    <footer className="border-t border-stone-200 mt-10 py-8 text-center text-[11px] text-stone-500 px-4">
      <div className="font-medium text-stone-700">{tr(lang, "footer.line1")}</div>
      <div className="mt-1 max-w-sm mx-auto">{tr(lang, "footer.line2")}</div>
    </footer>
  );
}

// ===== APP =====

export default function TasteTrust() {
  const initial = useMemo(() => readUrl(), []);

  const [lang, setLang] = useState(() => safeGet("tt_lang", "en"));
  const [region, setRegion] = useState(initial.region);
  const [cuisine, setCuisine] = useState(initial.cuisine);
  const [query, setQuery] = useState(initial.q);
  const [sort, setSort] = useState(initial.sort || "rating");
  const [favOnly, setFavOnly] = useState(initial.fav);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [sharedAt, setSharedAt] = useState(0);

  const { favs, toggle: toggleFav, isFav } = useFavorites();
  const { recent, push: pushRecent, clear: clearRecent } = useRecent();

  // Save language preference
  useEffect(() => safeSet("tt_lang", lang), [lang]);

  // Sync URL params with state
  useEffect(() => {
    writeUrl({ region, cuisine, q: query, fav: favOnly, sort, place: selectedPlace?.id });
  }, [region, cuisine, query, favOnly, sort, selectedPlace]);

  // If URL has ?place=id on load, open detail panel
  useEffect(() => {
    if (initial.place) {
      const p = PLACES.find((x) => x.id === initial.place);
      if (p) setSelectedPlace(p);
    }
    // eslint-disable-next-line
  }, []);

  const decorated = useMemo(
    () => PLACES.map((p) => ({ ...p, _region: getRegion(p), _cuisine: getCuisine(p) })),
    []
  );

  const regionCounts = useMemo(() => {
    const c = {};
    decorated.forEach((p) => { c[p._region] = (c[p._region] || 0) + 1; });
    return c;
  }, [decorated]);

  const baseList = useMemo(() => {
    let list = decorated;
    if (favOnly) list = list.filter((p) => favs.includes(p.id));
    if (region) list = list.filter((p) => p._region === region);
    return list;
  }, [decorated, region, favOnly, favs]);

  const cuisineCounts = useMemo(() => {
    const c = {};
    baseList.forEach((p) => { c[p._cuisine] = (c[p._cuisine] || 0) + 1; });
    return c;
  }, [baseList]);

  const cuisineOptions = useMemo(() => {
    const order = Object.keys(CUISINES);
    return order.filter((c) => cuisineCounts[c]);
  }, [cuisineCounts]);

  useEffect(() => {
    if (cuisine && !cuisineCounts[cuisine]) setCuisine(null);
  }, [cuisine, cuisineCounts]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = baseList;
    if (cuisine) list = list.filter((p) => p._cuisine === cuisine);
    if (q) {
      list = list.filter((p) =>
        (p.name + " " + p.neighborhood + " " + p.category).toLowerCase().includes(q)
      );
    }
    const sorted = [...list].sort((a, b) => {
      switch (sort) {
        case "rating": return b.rating - a.rating;
        case "price-asc":
          return (PRICE_TO_NUM[a.priceLevel] || 0) - (PRICE_TO_NUM[b.priceLevel] || 0) || b.rating - a.rating;
        case "price-desc":
          return (PRICE_TO_NUM[b.priceLevel] || 0) - (PRICE_TO_NUM[a.priceLevel] || 0) || b.rating - a.rating;
        case "name": return a.name.localeCompare(b.name);
        default: return 0;
      }
    });
    return sorted;
  }, [baseList, cuisine, query, sort]);

  const clearAll = useCallback(() => {
    setRegion(null);
    setCuisine(null);
    setQuery("");
    setFavOnly(false);
  }, []);

  const openPlace = useCallback(
    (p) => {
      setSelectedPlace(p);
      pushRecent(p.id);
    },
    [pushRecent]
  );

  const closePanel = useCallback(() => setSelectedPlace(null), []);

  const sharePlace = useCallback(() => {
    if (typeof navigator === "undefined") return;
    const url = window.location.href;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(() => setSharedAt(Date.now()));
    } else {
      try {
        const ta = document.createElement("textarea");
        ta.value = url;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        setSharedAt(Date.now());
      } catch (e) {}
    }
    setTimeout(() => setSharedAt(0), 2000);
  }, []);

  const showingFavsButEmpty = favOnly && visible.length === 0;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans antialiased">
      <Header lang={lang} setLang={setLang} />
      <CityMap counts={regionCounts} currentRegion={region} setRegion={setRegion} lang={lang} />
      <RegionTabs
        regions={REGIONS}
        current={region}
        setCurrent={setRegion}
        counts={regionCounts}
        favCount={favs.length}
        favOnly={favOnly}
        setFavOnly={setFavOnly}
        lang={lang}
      />
      <CuisineFilters cuisines={cuisineOptions} current={cuisine} setCurrent={setCuisine} counts={cuisineCounts} lang={lang} />
      <SearchAndSort query={query} setQuery={setQuery} sort={sort} setSort={setSort} lang={lang} />

      <RecentSection recent={recent} places={decorated} onPick={openPlace} onClear={clearRecent} lang={lang} />

      <main className="max-w-5xl mx-auto pt-4 pb-12">
        <div className="px-4 flex items-baseline justify-between mb-3">
          <div className="text-xs text-stone-500">
            <span className="font-medium text-stone-700">{visible.length}</span>{" "}
            {visible.length === 1 ? tr(lang, "results.place") : tr(lang, "results.places")}
            {region && <span> · {region}</span>}
            {cuisine && <span> · {cuisine}</span>}
            {favOnly && <span> · ♥</span>}
          </div>
          {(region || cuisine || query || favOnly) && (
            <button onClick={clearAll} className="text-[11px] text-stone-500 hover:text-stone-900 underline">
              {tr(lang, "results.clearAll")}
            </button>
          )}
        </div>

        {visible.length === 0 ? (
          <EmptyState
            onClear={clearAll}
            message={showingFavsButEmpty ? tr(lang, "empty.favs") : tr(lang, "empty.title")}
            ctaLabel={showingFavsButEmpty ? null : tr(lang, "empty.cta")}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 px-4">
            {visible.map((p) => (
              <PlaceCard
                key={p.id}
                p={p}
                cuisine={p._cuisine}
                isFav={isFav(p.id)}
                onToggleFav={toggleFav}
                onOpen={openPlace}
                lang={lang}
              />
            ))}
          </div>
        )}
      </main>

      <Footer lang={lang} />

      <DetailPanel
        place={selectedPlace}
        onClose={closePanel}
        isFav={selectedPlace ? isFav(selectedPlace.id) : false}
        onToggleFav={toggleFav}
        onShare={sharePlace}
        sharedAt={sharedAt}
        lang={lang}
      />
    </div>
  );
}

