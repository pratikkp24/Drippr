import { MOCK_CREATORS, type MockCreator } from "./creators";
import { MOCK_DROPS, type MockDrop } from "./drops";
import { MOCK_PIECES, type MockPiece } from "./pieces";

export { MOCK_CREATORS, type MockCreator };
export { MOCK_DROPS, type MockDrop };
export { MOCK_PIECES, type MockPiece };

export function getCreatorByUsername(username: string): MockCreator | undefined {
  return MOCK_CREATORS.find((c) => c.username === username);
}

export function getDropBySlug(slug: string): (MockDrop & { creator: MockCreator; pieces: MockPiece[] }) | undefined {
  const drop = MOCK_DROPS.find((d) => d.slug === slug);
  if (!drop) return undefined;
  
  const creator = MOCK_CREATORS.find((c) => c.id === drop.creatorId)!;
  const pieces = MOCK_PIECES.filter((p) => drop.pieceIds.includes(p.id));
  
  return { ...drop, creator, pieces };
}

export function getCreatorProfile(username: string): { creator: MockCreator; drops: MockDrop[] } | undefined {
  const creator = getCreatorByUsername(username);
  if (!creator) return undefined;
  
  const drops = MOCK_DROPS.filter((d) => d.creatorId === creator.id);
  return { creator, drops };
}

export function getHomeFeed(): { featuredDrop: MockDrop & { creator: MockCreator }; creatorPicks: (MockPiece & { user: MockCreator })[] } {
  const featured = [...MOCK_DROPS].sort((a, b) => b.saveCount - a.saveCount)[0];
  const featuredCreator = MOCK_CREATORS.find((c) => c.id === featured.creatorId)!;
  
  // Recent pieces as creator picks
  const recentPieces = MOCK_PIECES.slice(0, 8).map((p) => {
    const drop = MOCK_DROPS.find((d) => d.pieceIds.includes(p.id))!;
    const user = MOCK_CREATORS.find((c) => c.id === drop.creatorId)!;
    return { ...p, user };
  });
  
  return {
    featuredDrop: { ...featured, creator: featuredCreator },
    creatorPicks: recentPieces
  };
}

export function getDiscoverPieces(filters?: { category?: string; vibeTag?: string }): (MockPiece & { drop: MockDrop; creator: MockCreator })[] {
  let pieces = MOCK_PIECES.map((p) => {
    const drop = MOCK_DROPS.find((d) => d.pieceIds.includes(p.id))!;
    const creator = MOCK_CREATORS.find((c) => c.id === drop.creatorId)!;
    return { ...p, drop, creator };
  });

  if (filters?.category && filters.category !== "all") {
    pieces = pieces.filter((p) => p.category.toLowerCase() === filters.category?.toLowerCase());
  }
  
  if (filters?.vibeTag && filters.vibeTag !== "all") {
    pieces = pieces.filter((p) => p.drop.vibeTags.includes(filters.vibeTag!));
  }
  
  return pieces;
}
