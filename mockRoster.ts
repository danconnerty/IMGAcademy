
import { Player, PlayerLevel } from './types';

// DATA GENERATORS FOR RANDOMIZATION
const MEN_FIRST_NAMES = [
    "James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas", "Charles", 
    "Christopher", "Daniel", "Matthew", "Anthony", "Donald", "Mark", "Paul", "Steven", "Andrew", "Kenneth", 
    "George", "Joshua", "Kevin", "Brian", "Edward", "Ronald", "Timothy", "Jason", "Jeffrey", "Ryan", 
    "Jacob", "Gary", "Nicholas", "Eric", "Stephen", "Jonathan", "Larry", "Justin", "Scott", "Brandon", 
    "Frank", "Benjamin", "Gregory", "Samuel", "Raymond", "Patrick", "Alexander", "Jack", "Dennis", "Jerry",
    "Aaron", "Adam", "Nathan", "Zachary", "Walter", "Harold", "Kyle", "Carl", "Arthur", "Gerald"
];

const WOMEN_FIRST_NAMES = [
    "Emma", "Olivia", "Ava", "Isabella", "Sophia", "Mia", "Charlotte", "Amelia", "Harper", "Evelyn",
    "Abigail", "Emily", "Elizabeth", "Mila", "Ella", "Avery", "Sofia", "Camila", "Aria", "Scarlett",
    "Victoria", "Madison", "Luna", "Grace", "Chloe", "Penelope", "Layla", "Riley", "Zoey", "Nora",
    "Lily", "Eleanor", "Hannah", "Lillian", "Addison", "Aubrey", "Ellie", "Stella", "Natalie", "Zoe",
    "Leah", "Hazel", "Violet", "Aurora", "Savannah", "Audrey", "Brooklyn", "Bella", "Claire", "Skylar",
    "Lucy", "Paisley", "Everly", "Anna", "Caroline", "Nova", "Genesis", "Emilia", "Kennedy", "Samantha"
];

const LAST_NAMES = [
    "Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", 
    "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson", 
    "Clark", "Rodriguez", "Lewis", "Lee", "Walker", "Hall", "Allen", "Young", "Hernandez", "King", 
    "Wright", "Lopez", "Hill", "Scott", "Green", "Adams", "Baker", "Gonzalez", "Nelson", "Carter", 
    "Mitchell", "Perez", "Roberts", "Turner", "Phillips", "Campbell", "Parker", "Evans", "Edwards", "Collins",
    "Stewart", "Sanchez", "Morris", "Rogers", "Reed", "Cook", "Morgan", "Bell", "Murphy", "Bailey"
];

export const SPORT_CONFIG: Record<string, { positions: string[], size: number }> = {
    baseball: {
        positions: ['P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'DH'],
        size: 40
    },
    football: {
        positions: ['QB', 'RB', 'WR', 'TE', 'OL', 'DL', 'LB', 'DB', 'K', 'P', 'LS'],
        size: 105
    },
    hockey: {
        positions: ['C', 'LW', 'RW', 'D', 'G'],
        size: 25
    },
    mbball: {
        positions: ['PG', 'SG', 'SF', 'PF', 'C'],
        size: 15
    },
    msoccer: {
        positions: ['GK', 'DEF', 'MID', 'FWD'],
        size: 30
    },
    mvolleyball: {
        positions: ['OH', 'OPP', 'MB', 'S', 'L', 'DS'],
        size: 18
    },
    softball: {
        positions: ['P', 'C', '1B', '2B', '3B', 'SS', 'OF'],
        size: 22
    },
    wbball: {
        positions: ['PG', 'SG', 'SF', 'PF', 'C'],
        size: 15
    },
    wsoccer: {
        positions: ['GK', 'DEF', 'MID', 'FWD'],
        size: 30
    },
    wvolleyball: {
        positions: ['OH', 'OPP', 'MB', 'S', 'L', 'DS'],
        size: 18
    }
};

const LEVELS: PlayerLevel[] = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Redshirt Fr', 'Redshirt So', 'Redshirt Jr'];

const WOMEN_SPORT_IDS = new Set(['softball', 'wbball', 'wsoccer', 'wvolleyball']);

// Helper to generate a random number in range [min, max]
const randomRange = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper to generate a random player
const generatePlayer = (index: number, sportId: string): Player => {
    const firstNamePool = WOMEN_SPORT_IDS.has(sportId) ? WOMEN_FIRST_NAMES : MEN_FIRST_NAMES;
    const firstName = firstNamePool[Math.floor(Math.random() * firstNamePool.length)];
    const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    
    const config = SPORT_CONFIG[sportId] || SPORT_CONFIG['football'];
    const pos = config.positions[Math.floor(Math.random() * config.positions.length)];
    const level = LEVELS[Math.floor(Math.random() * LEVELS.length)];
    
    // --- CLUTCH FACTOR GENERATION ---
    const clutchRoll = Math.random();
    let clutchFactor = 0;

    if (clutchRoll < 0.10) { // 10% Elite
        clutchFactor = randomRange(801, 950);
    } else if (clutchRoll < 0.25) { // 15% Great
        clutchFactor = randomRange(751, 800);
    } else if (clutchRoll < 0.45) { // 20% Above Average
        clutchFactor = randomRange(725, 750);
    } else if (clutchRoll < 0.80) { // 35% Average
        clutchFactor = randomRange(651, 724);
    } else { // 20% Below Average
        clutchFactor = randomRange(450, 650);
    }

    // --- FIT SCORE GENERATION ---
    const fitRoll = Math.random();
    let fitScore = 0;

    if (fitRoll < 0.15) { // 15% Exceptional
        fitScore = randomRange(75, 99);
    } else if (fitRoll < 0.40) { // 25% Strong
        fitScore = randomRange(63, 74);
    } else if (fitRoll < 0.65) { // 25% Conditional
        fitScore = randomRange(50, 62);
    } else if (fitRoll < 0.85) { // 20% Developmental
        fitScore = randomRange(38, 49);
    } else { // 15% Poor
        fitScore = randomRange(15, 37);
    }

    return {
        id: `${sportId}-roster-${index}`, 
        type: 'roster',
        name: `${lastName}, ${firstName}`,
        sport: sportId,
        position: pos,
        level: level,
        round: '2025 Pre-Season',
        graduationYear: 2025 + Math.floor(Math.random() * 4),
        clutchFactor: clutchFactor,
        status: Math.random() > 0.9 ? 'injured' : 'active',
        needsRetest: Math.random() > 0.8,
        lastTestedDate: new Date().toISOString(),
        fitScore: fitScore,
        height: `${5 + Math.floor(Math.random() * 2)}'${Math.floor(Math.random() * 11)}"`,
        weight: `${170 + Math.floor(Math.random() * 150)}`,
        inviteStatus: 'completed'
    };
};

const generateRosterForSport = (sportId: string): Player[] => {
    const config = SPORT_CONFIG[sportId] || SPORT_CONFIG['football'];
    return Array.from({ length: config.size }, (_, i) => generatePlayer(i, sportId));
};

// Generate roster for all defined sports
export const ALL_ROSTERS: Record<string, Player[]> = Object.keys(SPORT_CONFIG).reduce((acc, sportId) => {
    acc[sportId] = generateRosterForSport(sportId);
    return acc;
}, {} as Record<string, Player[]>);

// Export football specifically for backward compatibility if needed, though mostly using ALL_ROSTERS now
export const ROSTER_PLAYERS: Player[] = ALL_ROSTERS['football'];
