export type MockCreator = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  styleSignature: string;
  location: string;
  followerCount: number;
  dropIds: string[];
};

export const MOCK_CREATORS: MockCreator[] = [
  {
    id: "mock-c-01",
    username: "mayawear",
    displayName: "Maya R.",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&h=400",
    bio: "exploring the beauty of silence through linen and light",
    styleSignature: "quiet luxury",
    location: "Pondicherry, India",
    followerCount: 42000,
    dropIds: ["mock-d-001", "mock-d-002", "mock-d-003", "mock-d-004", "mock-d-005"]
  },
  {
    id: "mock-c-02",
    username: "khadilinen",
    displayName: "Arjun S.",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400",
    bio: "hand-spun stories and conscious tailoring",
    styleSignature: "modern heirloom",
    location: "Jaipur, India",
    followerCount: 18500,
    dropIds: ["mock-d-006", "mock-d-007", "mock-d-008", "mock-d-009"]
  },
  {
    id: "mock-c-03",
    username: "quietorbit",
    displayName: "Sana K.",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400&h=400",
    bio: "minimalist silhouettes for the modern wanderer",
    styleSignature: "monochrome minimalism",
    location: "Berlin, Germany",
    followerCount: 32000,
    dropIds: ["mock-d-010", "mock-d-011", "mock-d-012", "mock-d-013"]
  },
  {
    id: "mock-c-04",
    username: "yash.wears",
    displayName: "Yash V.",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&h=400",
    bio: "graphic tees and oversized dreams",
    styleSignature: "street luxe",
    location: "Mumbai, India",
    followerCount: 28000,
    dropIds: ["mock-d-014", "mock-d-015", "mock-d-016", "mock-d-017"]
  },
  {
    id: "mock-c-05",
    username: "street.logic",
    displayName: "Rohan M.",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=400",
    bio: "contextualizing utility in the urban landscape",
    styleSignature: "technical streetwear",
    location: "Tokyo, Japan",
    followerCount: 15400,
    dropIds: ["mock-d-018", "mock-d-019", "mock-d-020"]
  },
  {
    id: "mock-c-06",
    username: "shiloh.studio",
    displayName: "Shiloh P.",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400&h=400",
    bio: "elevated basics that work as hard as you do",
    styleSignature: "corporate edgy",
    location: "New York, USA",
    followerCount: 21000,
    dropIds: ["mock-d-021", "mock-d-022", "mock-d-023"]
  },
  {
    id: "mock-c-07",
    username: "officediary",
    displayName: "Tanvi L.",
    avatarUrl: "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&q=80&w=400&h=400",
    bio: "sharp tailoring and soft palettes for 9 to 5",
    styleSignature: "elevated workwear",
    location: "Bangalore, India",
    followerCount: 9800,
    dropIds: ["mock-d-024", "mock-d-025", "mock-d-026"]
  },
  {
    id: "mock-c-08",
    username: "monsoondiary",
    displayName: "Isha G.",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400&h=400",
    bio: "romanticizing the rain through layered textures",
    styleSignature: "monsoon layering",
    location: "Kochi, India",
    followerCount: 12600,
    dropIds: ["mock-d-027", "mock-d-028", "mock-d-029"]
  },
  {
    id: "mock-c-09",
    username: "layerup.co",
    displayName: "Karan J.",
    avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400&h=400",
    bio: "more is more, but make it cohesive",
    styleSignature: "maximalist layering",
    location: "London, UK",
    followerCount: 7500,
    dropIds: ["mock-d-030", "mock-d-031", "mock-d-032"]
  },
  {
    id: "mock-c-10",
    username: "anoushkaknits",
    displayName: "Anoushka D.",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400&h=400",
    bio: "hand-knit warmth for festive nights",
    styleSignature: "contemporary festive",
    location: "Dehradun, India",
    followerCount: 5400,
    dropIds: ["mock-d-033", "mock-d-034", "mock-d-035"]
  },
  {
    id: "mock-c-11",
    username: "wanderweave",
    displayName: "Zoya H.",
    avatarUrl: "https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&q=80&w=400&h=400",
    bio: "curated suitcases for the global soul",
    styleSignature: "conscious travel",
    location: "Goa, India",
    followerCount: 3200,
    dropIds: ["mock-d-036", "mock-d-037", "mock-d-038"]
  },
  {
    id: "mock-c-12",
    username: "thrifted.in",
    displayName: "Kabir B.",
    avatarUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=400&h=400",
    bio: "forgotten treasures found and reframed",
    styleSignature: "curated vintage",
    location: "Delhi, India",
    followerCount: 8900,
    dropIds: ["mock-d-039", "mock-d-040"]
  }
];
