import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface UserProfile {
    gamesPlayed: bigint;
    name: string;
}
export interface GameScore {
    streak: bigint;
    dailyScoreTimestamp: Time;
    scoreTimestamp: Time;
    perksEarned: Array<string>;
    points: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDailyLeaderboard(): Promise<Array<GameScore>>;
    getLeaderboard(): Promise<Array<GameScore>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitScore(points: bigint, streak: bigint, perksEarned: Array<string>): Promise<void>;
    unlockPerk(perk: string): Promise<void>;
}
