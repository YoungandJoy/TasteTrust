import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  MapPin,
  Star,
  ShieldCheck,
  ExternalLink,
  ArrowUpDown,
  X,
} from "lucide-react";

// =====================================================================
//  TasteTrust — verified restaurant curation, by Gayoen.
//  ---------------------------------------------------------------------
//  Mobile-first. Region-first navigation (Singapore / Johor Bahru / LA).
//  Cuisine filter pills within a region. Cards show only what we
//  actually have data for — no "Awaiting note" placeholder.
//
//  PLACES schema (every record gets DEFAULTS applied via place()):
//    id, name, category, neighborhood, rating, priceLevel,
//    filters {dogFriendly, noiseLevel, parking, veganOption},
//    gayoenNote, visitDate, image, verifiedVisits,
//    analytics {monthlyViews, adClicks, conversions, couponsUsed},
//    sourceUrl, listSource
// =====================================================================

const DEFAULTS = {
  neighborhood: "",
  filters: {
    dogFriendly: false,
    noiseLevel: "moderate",
    parking: false,
    veganOption: false,
  },
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

// Source URLs (Google Maps shared lists owned by Gayoen)
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

// ===== NORMALIZATION HELPERS =====

function getRegion(p) {
  const n = (p.neighborhood || "").toLowerCase();
  if (
    n.includes("los angeles") ||
    n.includes("hollywood") ||
    n.includes("olympic")
  )
    return "Los Angeles";
  if (
    n.includes("johor") ||
    n.includes("pelangi") ||
    n.includes("taman") ||
    n.includes("puteri") ||
    n.includes("city square") ||
    n.includes("r&f") ||
    n.includes("zenith")
  )
    return "Johor Bahru";
  if (n.includes("penang")) return "Penang";
  if (n.includes("singapore") || n.includes("sentosa") || /\b(tanjong|telok|mandarin|orchard|clarke|raffles|beach road|keong saik|outram|alexandra|somerset|tang plaza|market street|katong|robertson|amoy|international plaza|tras|chinatown)\b/.test(n))
    return "Singapore";
  // Heuristic from listSource for entries with no neighborhood
  if (
    p.listSource === "한식" ||
    p.listSource === "Restaurant" ||
    p.listSource === "Cafe" ||
    p.listSource === "Singapore" ||
    p.listSource === "일식" ||
    p.listSource === "Chinese"
  )
    return "Singapore";
  return "Other";
}

function getCuisine(p) {
  const c = (p.category || "").toLowerCase();
  if (c.includes("korean")) return "Korean";
  if (
    c.includes("japanese") ||
    c.includes("sushi") ||
    c.includes("yakiniku") ||
    c.includes("ramen") ||
    c.includes("tonkatsu")
  )
    return "Japanese";
  if (c.includes("italian") || c.includes("pizza")) return "Italian";
  if (
    c.includes("chinese") ||
    c.includes("hot pot") ||
    c.includes("hunan") ||
    c.includes("cantonese") ||
    c.includes("bak kwa") ||
    c.includes("hot chicken") ||
    c.includes("bao") ||
    c.includes("dim sum")
  )
    return "Chinese";
  if (c.includes("thai")) return "Thai";
  if (
    c.includes("singaporean") ||
    c.includes("nyonya") ||
    c.includes("teochew") ||
    c.includes("kopitiam") ||
    c.includes("hawker") ||
    c.includes("porridge") ||
    c.includes("food court") ||
    c.includes("durian") ||
    c.includes("laksa") ||
    c.includes("bak kut teh")
  )
    return "Singaporean";
  if (
    c.includes("cafe") ||
    c.includes("coffee") ||
    c.includes("bakery") ||
    c.includes("dessert") ||
    c.includes("ice cream") ||
    c.includes("board game")
  )
    return "Cafe";
  if (c.includes("bar") || c.includes("lounge") || c.includes("gastropub"))
    return "Bar";
  if (c.includes("modern european") || c.includes("fine dining"))
    return "Fine Dining";
  if (c.includes("seafood")) return "Seafood";
  return "Other";
}

// Cuisine metadata (gradient header + emoji)
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

const REGIONS = ["Singapore", "Johor Bahru", "Los Angeles"];

const SORT_OPTIONS = [
  { id: "rating", label: "★ Highest rated" },
  { id: "price-asc", label: "$ → $$$$" },
  { id: "price-desc", label: "$$$$ → $" },
  { id: "name", label: "A → Z" },
];

const PRICE_TO_NUM = { "": 0, $: 1, $$: 2, $$$: 3, $$$$: 4 };

function classNames(...xs) {
  return xs.filter(Boolean).join(" ");
}

// ===== UI =====

function Header() {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-stone-200">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-600" strokeWidth={2.4} />
          <div>
            <div className="text-base font-semibold tracking-tight text-stone-900 leading-none">
              TasteTrust
            </div>
            <div className="text-[10px] text-stone-500 mt-0.5">
              Verified by Gayoen
            </div>
          </div>
        </div>
        <div className="text-[11px] text-stone-500 hidden sm:block">
          Singapore · Johor Bahru · Los Angeles
        </div>
      </div>
    </header>
  );
}

function CityMap({ counts, currentRegion, setRegion }) {
  // Decorative SVG showing 3 city pins on a stylized world map
  const cities = [
    { id: "Los Angeles", x: 90, y: 95, label: "LA" },
    { id: "Johor Bahru", x: 510, y: 145, label: "JB" },
    { id: "Singapore", x: 540, y: 165, label: "SG" },
  ];

  return (
    <div className="relative bg-gradient-to-b from-amber-50 to-white border-b border-stone-200">
      <div className="max-w-5xl mx-auto px-4 pt-6 pb-4">
        <svg
          viewBox="0 0 640 220"
          className="w-full h-32 sm:h-40"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="land" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#fef3c7" />
              <stop offset="1" stopColor="#fde68a" />
            </linearGradient>
          </defs>
          {/* North America blob */}
          <path
            d="M30,40 C60,20 130,30 160,80 C170,120 130,150 90,150 C40,150 10,100 30,40 Z"
            fill="url(#land)"
            opacity="0.55"
          />
          {/* Asia blob */}
          <path
            d="M380,40 C460,20 600,40 620,90 C625,140 580,180 510,180 C430,185 370,140 380,40 Z"
            fill="url(#land)"
            opacity="0.55"
          />
          {/* Pacific dots */}
          {Array.from({ length: 30 }).map((_, i) => (
            <circle
              key={i}
              cx={180 + ((i * 7) % 200)}
              cy={70 + ((i * 11) % 110)}
              r="1"
              fill="#d6d3d1"
              opacity="0.4"
            />
          ))}
          {/* City pins */}
          {cities.map((c) => {
            const active = currentRegion === c.id;
            return (
              <g
                key={c.id}
                style={{ cursor: "pointer" }}
                onClick={() => setRegion(active ? null : c.id)}
              >
                <circle
                  cx={c.x}
                  cy={c.y}
                  r={active ? "18" : "10"}
                  fill="#C9A84C"
                  opacity={active ? "0.25" : "0.15"}
                />
                <circle
                  cx={c.x}
                  cy={c.y}
                  r="6"
                  fill={active ? "#92400e" : "#C9A84C"}
                />
                <text
                  x={c.x}
                  y={c.y - 14}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="600"
                  fill={active ? "#78350f" : "#57534e"}
                >
                  {c.label} · {counts[c.id] || 0}
                </text>
              </g>
            );
          })}
        </svg>

        <h1 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-stone-900 text-center">
          Where Gayoen actually eats.
        </h1>
        <p className="mt-1.5 text-sm text-stone-600 text-center max-w-md mx-auto">
          {PLACES.length} restaurants, personally visited and vetted across
          three cities. Tap a pin or pick a city below.
        </p>
      </div>
    </div>
  );
}

function RegionTabs({ regions, current, setCurrent, counts }) {
  return (
    <div className="sticky top-[57px] z-20 bg-white/95 backdrop-blur border-b border-stone-200">
      <div className="max-w-5xl mx-auto px-2 sm:px-4">
        <div className="flex overflow-x-auto gap-1 py-2 -mx-2 px-2">
          <RegionPill
            label="All"
            count={Object.values(counts).reduce((a, b) => a + b, 0)}
            active={current === null}
            onClick={() => setCurrent(null)}
          />
          {regions.map((r) => (
            <RegionPill
              key={r}
              label={r}
              count={counts[r] || 0}
              active={current === r}
              onClick={() => setCurrent(r)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function RegionPill({ label, count, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={classNames(
        "shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-sm font-medium transition",
        active
          ? "bg-stone-900 text-white border-stone-900"
          : "bg-white text-stone-700 border-stone-200 hover:border-stone-400"
      )}
    >
      {label}
      <span
        className={classNames(
          "text-[10px] px-1.5 py-0.5 rounded-full",
          active ? "bg-white/20 text-white" : "bg-stone-100 text-stone-500"
        )}
      >
        {count}
      </span>
    </button>
  );
}

function CuisineFilters({ cuisines, current, setCurrent, counts }) {
  return (
    <div className="max-w-5xl mx-auto px-4 pt-3">
      <div className="flex flex-wrap gap-1.5">
        <CuisineChip
          label="All cuisines"
          emoji=""
          count={Object.values(counts).reduce((a, b) => a + b, 0)}
          active={current === null}
          onClick={() => setCurrent(null)}
        />
        {cuisines.map((c) => (
          <CuisineChip
            key={c}
            label={c}
            emoji={CUISINES[c]?.emoji || "🍴"}
            count={counts[c] || 0}
            active={current === c}
            onClick={() => setCurrent(c)}
          />
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
        active
          ? "bg-amber-600 text-white border-amber-600"
          : "bg-white text-stone-700 border-stone-200 hover:border-stone-400"
      )}
    >
      {emoji && <span>{emoji}</span>}
      <span>{label}</span>
      <span
        className={classNames(
          "text-[10px] ml-0.5",
          active ? "text-white/70" : "text-stone-400"
        )}
      >
        {count}
      </span>
    </button>
  );
}

function SearchAndSort({ query, setQuery, sort, setSort }) {
  return (
    <div className="max-w-5xl mx-auto px-4 pt-3 flex gap-2">
      <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-white border border-stone-200 rounded-full">
        <Search className="w-4 h-4 text-stone-400 shrink-0" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, neighborhood…"
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-stone-400 min-w-0"
        />
        {query && (
          <button onClick={() => setQuery("")} aria-label="Clear search">
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
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
        <ArrowUpDown className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
}

function PlaceCard({ p }) {
  const cuisine = getCuisine(p);
  const meta = CUISINES[cuisine] || CUISINES.Other;

  return (
    <article className="bg-white border border-stone-200 rounded-2xl overflow-hidden flex flex-col group hover:shadow-md hover:-translate-y-0.5 transition-all">
      <div
        className={classNames(
          "h-20 bg-gradient-to-br relative flex items-center justify-center text-4xl",
          meta.grad
        )}
      >
        <span aria-hidden="true">{meta.emoji}</span>
        <div className="absolute top-2 right-2 inline-flex items-center gap-0.5 text-amber-700 text-xs font-semibold bg-white/80 backdrop-blur px-2 py-0.5 rounded-full">
          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
          {p.rating.toFixed(1)}
        </div>
      </div>

      <div className="p-3.5 flex-1 flex flex-col gap-2">
        <div>
          <h3 className="font-semibold text-stone-900 leading-snug text-[15px]">
            {p.name}
          </h3>
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
            <span className="px-1.5 py-0.5 bg-stone-50 text-stone-500 rounded">
              {p.category}
            </span>
          )}
          {p.priceLevel && (
            <span className="px-1.5 py-0.5 bg-stone-100 rounded font-medium">
              {p.priceLevel}
            </span>
          )}
        </div>

        {p.gayoenNote && (
          <p className="text-sm text-stone-700 italic border-l-2 border-amber-300 pl-2.5">
            &ldquo;{p.gayoenNote}&rdquo;
          </p>
        )}

        {p.sourceUrl && (
          <a
            href={p.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex items-center justify-center gap-1.5 py-2 text-[12px] font-medium text-stone-700 border-t border-stone-100 -mx-3.5 -mb-3.5 px-3.5 hover:bg-stone-50 transition"
          >
            Open in Google Maps
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </article>
  );
}

function EmptyState({ onClear }) {
  return (
    <div className="text-center py-16 text-stone-500 text-sm border border-dashed border-stone-300 rounded-2xl mx-4">
      <div className="text-3xl mb-2">🍽️</div>
      <div>No matches with the current filters.</div>
      <button
        onClick={onClear}
        className="mt-3 text-xs underline text-stone-700 hover:text-stone-900"
      >
        Clear filters
      </button>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-stone-200 mt-10 py-8 text-center text-[11px] text-stone-500 px-4">
      <div className="font-medium text-stone-700">TasteTrust · by Gayoen</div>
      <div className="mt-1 max-w-sm mx-auto">
        Every restaurant on this list has been personally visited and vetted.
        No sponsored placements. Data refreshed periodically from Gayoen's
        Google Maps lists.
      </div>
    </footer>
  );
}

// ===== APP =====

export default function TasteTrust() {
  const [region, setRegion] = useState(null);
  const [cuisine, setCuisine] = useState(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("rating");

  const decorated = useMemo(
    () =>
      PLACES.map((p) => ({
        ...p,
        _region: getRegion(p),
        _cuisine: getCuisine(p),
      })),
    []
  );

  const regionCounts = useMemo(() => {
    const c = {};
    decorated.forEach((p) => {
      c[p._region] = (c[p._region] || 0) + 1;
    });
    return c;
  }, [decorated]);

  const visibleByRegion = useMemo(
    () => (region ? decorated.filter((p) => p._region === region) : decorated),
    [decorated, region]
  );

  const cuisineCounts = useMemo(() => {
    const c = {};
    visibleByRegion.forEach((p) => {
      c[p._cuisine] = (c[p._cuisine] || 0) + 1;
    });
    return c;
  }, [visibleByRegion]);

  const cuisineOptions = useMemo(() => {
    const order = Object.keys(CUISINES);
    return order.filter((c) => cuisineCounts[c]);
  }, [cuisineCounts]);

  useEffect(() => {
    if (cuisine && !cuisineCounts[cuisine]) setCuisine(null);
  }, [cuisine, cuisineCounts]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = visibleByRegion;
    if (cuisine) list = list.filter((p) => p._cuisine === cuisine);
    if (q) {
      list = list.filter((p) =>
        `${p.name} ${p.neighborhood} ${p.category}`.toLowerCase().includes(q)
      );
    }
    const sorted = [...list].sort((a, b) => {
      switch (sort) {
        case "rating":
          return b.rating - a.rating;
        case "price-asc":
          return (
            (PRICE_TO_NUM[a.priceLevel] || 0) -
              (PRICE_TO_NUM[b.priceLevel] || 0) || b.rating - a.rating
          );
        case "price-desc":
          return (
            (PRICE_TO_NUM[b.priceLevel] || 0) -
              (PRICE_TO_NUM[a.priceLevel] || 0) || b.rating - a.rating
          );
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
    return sorted;
  }, [visibleByRegion, cuisine, query, sort]);

  const clearAll = () => {
    setRegion(null);
    setCuisine(null);
    setQuery("");
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans antialiased">
      <Header />
      <CityMap
        counts={regionCounts}
        currentRegion={region}
        setRegion={setRegion}
      />
      <RegionTabs
        regions={REGIONS}
        current={region}
        setCurrent={setRegion}
        counts={regionCounts}
      />
      <CuisineFilters
        cuisines={cuisineOptions}
        current={cuisine}
        setCurrent={setCuisine}
        counts={cuisineCounts}
      />
      <SearchAndSort
        query={query}
        setQuery={setQuery}
        sort={sort}
        setSort={setSort}
      />

      <main className="max-w-5xl mx-auto pt-4 pb-12">
        <div className="px-4 flex items-baseline justify-between mb-3">
          <div className="text-xs text-stone-500">
            <span className="font-medium text-stone-700">{visible.length}</span>{" "}
            place{visible.length === 1 ? "" : "s"}
            {region && <span> · {region}</span>}
            {cuisine && <span> · {cuisine}</span>}
          </div>
          {(region || cuisine || query) && (
            <button
              onClick={clearAll}
              className="text-[11px] text-stone-500 hover:text-stone-900 underline"
            >
              Clear all
            </button>
          )}
        </div>

        {visible.length === 0 ? (
          <EmptyState onClear={clearAll} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 px-4">
            {visible.map((p) => (
              <PlaceCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
