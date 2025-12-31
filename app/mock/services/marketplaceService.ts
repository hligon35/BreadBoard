import { mockDb, type MockMarketplacePack } from "@app/mock/data/mockDb";

export async function listMockMarketplacePacks(kind?: MockMarketplacePack["kind"]): Promise<MockMarketplacePack[]> {
  const packs = mockDb.marketplacePacks;
  return kind ? packs.filter((p) => p.kind === kind) : packs;
}
