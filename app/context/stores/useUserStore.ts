import { create } from "zustand";

export type UserProfile = {
  id: string;
  displayName: string;
  businessName: string;
  currency: string;
};

type UserState = {
  profile: UserProfile;
  setDisplayName: (name: string) => void;
  setBusinessName: (name: string) => void;
};

export const useUserStore = create<UserState>((set) => ({
  profile: {
    id: "user_mock_1",
    displayName: "Harold",
    businessName: "Bread Board Studio",
    currency: "USD",
  },
  setDisplayName: (displayName) => set((s) => ({ profile: { ...s.profile, displayName } })),
  setBusinessName: (businessName) => set((s) => ({ profile: { ...s.profile, businessName } })),
}));
