
import { TeamSummary } from './types';

// Teams in alphabetical order by name
export const MOCK_TEAMS: TeamSummary[] = [
  { id: 'baseball', name: 'BASEBALL', playerCount: 10, avgClutchFactor: 662, clutchFactorRange: '460 - 784' },
  { id: 'football', name: 'FOOTBALL', playerCount: 2, avgClutchFactor: 701, clutchFactorRange: '643 - 759' }, 
  { id: 'hockey', name: 'HOCKEY', playerCount: 1, avgClutchFactor: 681, clutchFactorRange: '681 - 681' },
  { id: 'mbball', name: "MEN'S BASKETBALL", playerCount: 11, avgClutchFactor: 696, clutchFactorRange: '632 - 755' },
  { id: 'msoccer', name: "MEN'S SOCCER", playerCount: 11, avgClutchFactor: 664, clutchFactorRange: '458 - 796' },
  { id: 'mvolleyball', name: "MEN'S VOLLEYBALL", playerCount: 0, avgClutchFactor: 0, clutchFactorRange: '-' },
  { id: 'softball', name: "SOFTBALL", playerCount: 3, avgClutchFactor: 704, clutchFactorRange: '669 - 768' },
  { id: 'wbball', name: "WOMEN'S BASKETBALL", playerCount: 2, avgClutchFactor: 719, clutchFactorRange: '700 - 738' },
  { id: 'wsoccer', name: "WOMEN'S SOCCER", playerCount: 0, avgClutchFactor: 0, clutchFactorRange: '-' },
  { id: 'wvolleyball', name: "WOMEN'S VOLLEYBALL", playerCount: 0, avgClutchFactor: 0, clutchFactorRange: '-' },
].sort((a, b) => a.name.localeCompare(b.name));
