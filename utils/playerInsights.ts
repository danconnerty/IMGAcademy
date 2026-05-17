import { Player } from '../types';

export interface Drill {
  id: string;
  title: string;
  breakdown: string;
  insight: string;
  videoUrl?: string;
}

export interface StyleDefinition {
  name: string;
  description: string;
  strategy: string;
}

export interface PlayerProfile {
  communication: StyleDefinition;
  learning: StyleDefinition;
  motivation: StyleDefinition;
}

export const DRILLS: Drill[] = [
  { id: 'confidence', title: 'Confidence Scripting (I Am)', breakdown: "You perform who you believe you are. Create a mantra that defines your highest self, like 'I am a relentless competitor' or 'I own the box.' Repeat it internally every time you step into the arena. This primes your identity, pushing out hesitation and ensuring you play aggressive, assertive, and without fear.", insight: "This is 'Self-Signaling.' You are broadcasting your intent to your own nervous system. It shifts your posture and hormone levels (testosterone vs cortisol) before the play starts.", videoUrl: 'https://youtu.be/Qc7q9L_NRlU' },
  { id: 'visualization', title: 'Visualization (Perfect Rep)', breakdown: "Get your reps in before you even step on the field. Find a quiet spot, close your eyes, and visualize yourself executing perfectly in real-time. Feel the texture of the equipment, hear the crowd, see the result. This fires the same neural pathways as physical practice, giving you 'free reps' that build the automatic muscle memory needed to execute without thinking.", insight: "Include all senses (smell of grass, sound of cleat on dirt). The more sensory details, the more the brain treats the visualization as a real physical repetition.", videoUrl: 'https://youtu.be/4SxwpRLBpUA' },
  { id: 'box', title: 'Box Breathing Reset (4-4-4-4)', breakdown: "When the game speeds up, the elite know how to slow their internal engine down. Inhale through your nose for 4 seconds, hold for 4, exhale for 4, and hold empty for 4. This isn't just relaxation; it is a mechanical override switch for your nervous system. It clears the physical tension instantly so you can make a cold, calculated decision while everyone else is rushing.", insight: "The 'Hold Empty' phase is critical - it increases CO2 tolerance, which calms the amygdala (fear center). Use this specifically after a bad call or error.", videoUrl: 'https://youtu.be/MDEsW3yE-K8' },
  { id: 'cooldown', title: 'Cognitive Cooldown Walk', breakdown: "You cannot perform at 100% if you never recover. Immediately post-game, before checking your phone, take a 5-minute walk alone. Look around and simply name what you see - 'blue chair,' 'green grass' - without judgment. We call this 'down-shifting.' It pulls your brain out of combat mode so you can recharge your battery completely for the next battle.", insight: "This prevents 'Competition Hangover.' By manually switching off your fight-or-flight response, you improve sleep quality and recovery speed for the next day's game.", videoUrl: 'https://youtu.be/FHwbZwAaLKk' },
  { id: 'body-scan', title: 'Body Scan Check', breakdown: "Hidden tension kills mechanics. Lay flat and scan your body from toes to head. Tense a muscle group hard for 5 seconds, then let it go completely. Feel the difference between 'locked' and 'loose.' This trains your awareness so you can detect tightness in your shoulders or hands mid-game and release it instantly, keeping your movement fluid and explosive.", insight: "Most errors come from 'guarding' (unconscious tension). Doing this pre-game helps you identify which muscle groups are carrying stress today so you can stretch them specifically.", videoUrl: 'https://youtu.be/yNTzdDLGv-U' },
  { id: 'flush', title: 'Post-Error Reset (The Flush)', breakdown: "The most dangerous player is the one who doesn't care about the last mistake. Pick a physical trigger - like unstrapping a glove. The moment an error happens, hit that trigger, take a breath, and say 'Flush.' That physical action deletes the error from your RAM. It allows you to step into the next play with zero baggage, ready to make an impact.", insight: "The physical anchor is key. You are conditioning a Pavlovian response: Physical Action = Emotional Reset. Over time, the motion alone will lower your heart rate.", videoUrl: 'https://youtu.be/bMzY1OILR-k' },
  { id: 'if-then', title: 'Bounce-Back Planning (If-Then)', breakdown: "Amateurs react with emotion; pros respond with protocol. Script your response now. Write down: 'IF I make a mistake, THEN I will look at a specific spot, take a breath, and reset.' When adversity hits, you don't have to think or feel; you just execute the protocol. This keeps you in control and dangerous even when things go wrong.", insight: "This outsources decision making. Under stress, your frontal cortex (logic) shuts down. Having a pre-loaded script bypasses the need for logic and relies on automatic execution.", videoUrl: 'https://youtu.be/rIYKDBFWUxE' },
  { id: 'adversity', title: 'Adversity Simulation (Worst Case)', breakdown: "We don't hope for easy games; we train for the war. Start a practice drill with a massive disadvantage - down on the scoreboard with seconds left. Your goal isn't just to win, but to keep your body language dominant. We call this 'inoculation.' By living in the fire during practice, the pressure of a real game will feel slow, familiar, and manageable.", insight: "The goal is 'Desensitization.' If you normalize panic in practice, your brain won't spike adrenaline during the game, allowing you to maintain fine motor control.", videoUrl: 'https://youtu.be/hx6QV34DJhI' },
  { id: 'memory', title: 'Success Memory Bank (Highlight Reel)', breakdown: "Doubt is just a bad habit. We need to overwrite it with evidence of your greatness. Every night, write down three winning moments from your day - even small ones. Visualize them in 4K detail before sleep. This builds a 'Highlight Reel' in your subconscious that crowds out fear and reminds you that you are built for this level.", insight: "Do this right before sleep. Your brain consolidates memory during REM cycles. Programming success visuals pre-sleep physically rewires neural pathways for confidence.", videoUrl: 'https://youtu.be/ZhJ_e2gxOC0' },
  { id: 'self-talk', title: 'Self-Talk Optimization (Neutral Thinking)', breakdown: "Emotion is slow; neutral is fast. When you catch yourself saying 'I was terrible,' flip it immediately to data: 'My hands were slow, I need to be quicker.' Replace judgment with instruction. This keeps your brain in problem-solving mode, not emotional meltdown mode. You're no longer a victim of the moment - you become the engineer of your response.", insight: "Separate identity ('I am bad') from behavior ('I made a bad rep') - this protects confidence and speeds correction.", videoUrl: 'https://youtu.be/4nw7gEFyBuQ' },
  { id: 'focus-interval', title: 'Focus Interval Training', breakdown: 'Build concentration like a muscle. Work in short, timed blocks where all attention goes to one cue, one breath pattern, or one execution detail. As your consistency improves, increase the interval length to train sustained attention under pressure.', insight: 'This creates attentional endurance and helps you recover faster when your focus slips mid-game.', videoUrl: 'https://youtu.be/QliFmb9QFbA' },
  { id: 'distraction-control', title: 'Distraction Control', breakdown: 'Practice executing your routine while controlled distractions are introduced - noise, movement, and interruptions. Your objective is to notice the distraction, label it, and immediately return to your task cue without emotional reaction.', insight: 'The key skill is fast attentional re-centering: acknowledge, reset, execute.', videoUrl: 'https://youtu.be/MnfsxL0yqmU' },
  { id: 'post-performance-journaling', title: 'Post-Performance Journaling', breakdown: "Capture the game while it's still fresh. Immediately after performance, journal what happened, what you felt, and what you learned. Keep it objective: 3 wins, 1 adjustment, and 1 intention for next time.", insight: 'Journaling externalizes emotion and converts experience into repeatable learning cues, improving consistency and recovery.', videoUrl: 'https://youtu.be/2KVr7IgVNOc' },
  { id: 'wide-to-narrow', title: 'Wide-to-Narrow Toggles', breakdown: 'Train attentional flexibility by intentionally shifting from broad situational awareness (wide) to a single task cue (narrow), then back again. Repeat this cycle under pressure to improve focus control in chaotic environments.', insight: 'Elite performers can rapidly toggle attention width without losing composure. This drill makes that switch automatic.', videoUrl: 'https://youtu.be/ZFSYk8qHxec' },
];

export const COMMUNICATION_STYLES: StyleDefinition[] = [
  {
    name: 'Direct',
    description: 'Prioritizes clarity and efficiency. Speaks candidly and expects the same. Often perceived as blunt but values honesty above all.',
    strategy: "Be concise. Focus on 'what' and 'when'. Avoid sugarcoating feedback. Give clear, bottom-line instructions."
  },
  {
    name: 'Supportive',
    description: 'Prioritizes harmony and connection. Values tone, reassurance, and emotional safety. Dislikes conflict and harsh criticism.',
    strategy: 'Start with the positive. Use a warm tone. Validate feelings before correcting. Emphasize that feedback is for their support.'
  },
  {
    name: 'Expressive',
    description: 'Prioritizes energy and vision. Thinks out loud, uses emotion, and is often enthusiastic. Can be scattered but brings life to the dugout.',
    strategy: "Match their enthusiasm. Allow space for them to verbalize ideas. Focus on the big picture and the 'feeling' of the play."
  },
  {
    name: 'Reserved',
    description: 'Prioritizes observation and reflection. Speaks only when necessary and processes internally. Values logic and time to think.',
    strategy: "Give them time to process before demanding an answer. Don't mistake silence for disinterest. Ask specific, open-ended questions."
  }
];

export const LEARNING_STYLES: StyleDefinition[] = [
  {
    name: 'Visual',
    description: "Learns best by seeing. Processes information spatially and graphically. Needs to see the 'picture' of success.",
    strategy: "Use video analysis, diagrams, and demonstrations. 'Show, don't just tell'. Use visual cues for plays."
  },
  {
    name: 'Auditory',
    description: 'Learns best by listening. Sensitive to tone, rhythm, and verbal cues. Can process complex verbal instructions.',
    strategy: "Use clear verbal cues. Ask them to repeat instructions back. Discuss concepts and 'talk shop' to reinforce learning."
  },
  {
    name: 'Kinesthetic',
    description: 'Learns best by doing. Needs physical engagement and muscle memory. Learns through trial, error, and physical feeling.',
    strategy: 'Prioritize reps and walkthroughs. Use physical cues/touch (with permission). Keep them moving; minimize long lectures.'
  }
];

export const MOTIVATIONAL_ANCHORS: StyleDefinition[] = [
  {
    name: 'Intrinsic Growth',
    description: 'Driven by self-improvement, mastery, and the process of getting better. Competes primarily against themselves.',
    strategy: 'Focus on technical details and personal bests. Track individual progress metrics. Frame challenges as skill acquisition.'
  },
  {
    name: 'Competitive Edge',
    description: 'Driven by winning, ranking, and beating opponents. Thrives on comparison and high-stakes moments.',
    strategy: 'Gamify practice. Use leaderboards. Frame challenges as win/loss scenarios. Put something on the line.'
  },
  {
    name: 'Team Commitment',
    description: 'Driven by belonging, loyalty, and not letting the team down. Values the collective success over individual glory.',
    strategy: 'Emphasize their role in the team success. Use partner drills. Highlight collective goals and how their effort helps the group.'
  },
  {
    name: 'Recognition/Opportunity',
    description: 'Driven by visibility, status, and the chance to advance (recruiting, starting role). Wants to be seen.',
    strategy: 'Provide public praise for good performance. Clearly map out the path to starting roles or next-level opportunities. Showcase highlights.'
  }
];

const byIndex = <T,>(arr: T[], index: number): T => arr[index % arr.length];

export const getPlayerSeed = (player: Player): number => Number(player.id.replace(/\D/g, '')) || 0;

export const getPlayerProfile = (player: Player): PlayerProfile => {
  const fitScore = player.fitScore ?? 0;
  const idSeed = getPlayerSeed(player);

  const communication = player.clutchFactor >= 760
    ? byIndex(COMMUNICATION_STYLES, idSeed)
    : byIndex(COMMUNICATION_STYLES, idSeed + 3);

  const learning = player.position.length % 3 === 0
    ? byIndex(LEARNING_STYLES, idSeed + 1)
    : byIndex(LEARNING_STYLES, idSeed + 2);

  const motivation = fitScore >= 70
    ? MOTIVATIONAL_ANCHORS[0]
    : fitScore >= 62.5
      ? MOTIVATIONAL_ANCHORS[2]
      : player.clutchFactor >= 760
        ? MOTIVATIONAL_ANCHORS[1]
        : MOTIVATIONAL_ANCHORS[3];

  return { communication, learning, motivation };
};

export const getPlayerPrescribedDrills = (player: Player, count = 2): Drill[] => {
  const seed = getPlayerSeed(player);
  return Array.from({ length: count }, (_, index) => DRILLS[(seed + index) % DRILLS.length]);
};
