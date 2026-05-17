
import { Player, PlayerLevel, InviteStatus } from './types';
import { SPORT_CONFIG } from './mockRoster';

// DATA GENERATORS FOR RANDOMIZATION
const MEN_FIRST_NAMES = [
    "Tyler", "Kyle", "Jordan", "Austin", "Zach", "Noah", "Ethan", "Caleb", "Hunter", "Mason", 
    "Logan", "Lucas", "Jackson", "Aiden", "Elijah", "Liam", "Dylan", "Connor", "Brayden", "Landon", 
    "Cameron", "Evan", "Gavin", "Cole", "Carson", "Blake", "Chase", "Dominic", "Jeremiah", "Micah",
    "Brody", "Xavier", "Ryder", "Tristan", "Parker", "Jace", "Cooper", "Hayden", "Miles", "Easton"
];

const WOMEN_FIRST_NAMES = [
    "Emma", "Olivia", "Ava", "Isabella", "Sophia", "Mia", "Charlotte", "Amelia", "Harper", "Evelyn",
    "Abigail", "Emily", "Elizabeth", "Mila", "Ella", "Avery", "Sofia", "Camila", "Aria", "Scarlett",
    "Victoria", "Madison", "Luna", "Grace", "Chloe", "Penelope", "Layla", "Riley", "Zoey", "Nora",
    "Lily", "Eleanor", "Hannah", "Lillian", "Addison", "Aubrey", "Ellie", "Stella", "Natalie", "Zoe"
];

const LAST_NAMES = [
    "Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", 
    "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson", 
    "Clark", "Rodriguez", "Lewis", "Lee", "Walker", "Hall", "Allen", "Young", "Hernandez", "King",
    "Wright", "Lopez", "Hill", "Scott", "Green", "Adams", "Baker", "Gonzalez", "Nelson", "Carter"
];

const HS_LEVELS: PlayerLevel[] = ['HS Junior', 'HS Senior'];
const COLLEGE_LEVELS: PlayerLevel[] = ['Freshman', 'Sophomore', 'Junior', 'Senior'];
const WOMEN_SPORT_IDS = new Set(['softball', 'wbball', 'wsoccer', 'wvolleyball']);

// Helper to generate a random number in range [min, max]
const randomRange = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper to generate recent dates
const getRecentDate = (daysAgo: number) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Helper to generate a random recruit
const generateRecruit = (index: number): Player => {
    // 1. Pick a random sport
    const sportKeys = Object.keys(SPORT_CONFIG);
    const sportId = sportKeys[Math.floor(Math.random() * sportKeys.length)];

    const firstNamePool = WOMEN_SPORT_IDS.has(sportId) ? WOMEN_FIRST_NAMES : MEN_FIRST_NAMES;
    const firstName = firstNamePool[Math.floor(Math.random() * firstNamePool.length)];
    const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    
    // 2. Pick a valid position for that sport
    const config = SPORT_CONFIG[sportId];
    const pos = config.positions[Math.floor(Math.random() * config.positions.length)];
    
    // Mix of HS and Transfer Portal (College) recruits
    const isHighSchool = Math.random() > 0.4;
    const level = isHighSchool 
        ? HS_LEVELS[Math.floor(Math.random() * HS_LEVELS.length)]
        : COLLEGE_LEVELS[Math.floor(Math.random() * COLLEGE_LEVELS.length)];
    
    const gradYear = 2025 + Math.floor(Math.random() * 3);
    
    const isPending = Math.random() < 0.15; // 15% pending invites
    const status: InviteStatus = isPending ? 'sent' : 'completed';
    
    // --- DATE GENERATION ---
    let dateInvited;
    if (isPending) {
        // Pending invites should be very recent (0-3 days)
        const daysAgo = Math.floor(Math.random() * 4); 
        if (daysAgo === 0) dateInvited = 'Just now';
        else if (daysAgo === 1) dateInvited = 'Yesterday';
        else dateInvited = getRecentDate(daysAgo);
    } else {
        // Completed invites are older (4-60 days)
        dateInvited = getRecentDate(randomRange(4, 60));
    }

    // --- CLUTCH FACTOR GENERATION ---
    let clutchFactor = 0;
    if (!isPending) {
        const clutchRoll = Math.random();
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
    }
    
    // --- FIT SCORE GENERATION ---
    let fitScore: number | undefined = undefined;
    if (!isPending) {
        const fitRoll = Math.random();
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
    }


    // --- RECRUIT COMMITMENT PRE-SELECTION (mix of preset and blank) ---
    let recruitCommitment: Player['recruitCommitment'] = undefined;
    if (!isPending) {
        const commitmentRoll = Math.random();
        if (commitmentRoll < 0.25) recruitCommitment = 'signed';
        else if (commitmentRoll < 0.55) recruitCommitment = 'offered';
        else if (commitmentRoll < 0.75) recruitCommitment = 'uncommitted';
        // else keep undefined/blank for manual assignment
    }

    return {
        id: `recruit-${index}`,
        type: 'recruit',
        name: `${lastName}, ${firstName}`,
        sport: sportId,
        position: pos,
        level: level,
        round: 'Prospect',
        graduationYear: gradYear,
        clutchFactor: clutchFactor,
        status: 'active',
        needsRetest: false,
        lastTestedDate: new Date().toISOString(),
        inviteStatus: status,
        dateInvited: dateInvited,
        height: `${5 + Math.floor(Math.random() * 2)}'${Math.floor(Math.random() * 11)}"`,
        weight: `${165 + Math.floor(Math.random() * 120)}`,
        fitScore: fitScore,
        recruitCommitment: recruitCommitment
    };
};

// Generate 80 random recruits to ensure good spread across sports
export const RECRUIT_PLAYERS: Player[] = Array.from({ length: 80 }, (_, i) => generateRecruit(i));
