
export type ViewType = 'master' | 'home' | 'recruiting' | 'nterpret' | 'nterpret-profile' | 'development-plan' | 'my-profile' | 'methodology';

export type HomeTab = 'roster' | 'recruits' | 'alignment';

export type PlayerLevel = 'Freshman' | 'Sophomore' | 'Junior' | 'Senior' | 'Redshirt Fr' | 'Redshirt So' | 'Redshirt Jr' | 'HS Senior' | 'HS Junior';

// Changed from union to string to support all sports dynamically
export type Position = string;

export type InviteStatus = 'not_sent' | 'sent' | 'opened' | 'completed';

export interface Player {
  id: string;
  type: 'roster' | 'recruit';
  name: string;
  sport: string; // Added to disambiguate positions (e.g. 'C' in Hockey vs Baseball)
  position: Position;
  level: PlayerLevel;
  round: string;
  graduationYear?: number | string;
  clutchFactor: number;
  status: 'active' | 'injured' | 'redshirt';
  needsRetest: boolean;
  lastTestedDate: string;
  isInterested?: boolean; // Used for "Watchlist" in recruiting
  fitScore?: number;
  inviteStatus?: InviteStatus;
  dateInvited?: string;
  height?: string;
  weight?: string;
  recruitCommitment?: 'signed' | 'offered' | 'uncommitted';
  isArchived?: boolean;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  role: string;
  orgName: string;
  email: string;
  phone: string;
  organization: string;
  memberSince: string;
  plan: string;
}

export interface TeamSummary {
  id: string;
  name: string;
  playerCount: number;
  avgClutchFactor: number;
  clutchFactorRange: string;
}

export enum PlayerStatus {
  ACTIVE = 'active',
  INJURED = 'injured',
  REDSHIRT = 'redshirt'
}
