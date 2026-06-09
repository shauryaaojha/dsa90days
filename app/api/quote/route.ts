import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/db';
import Quote from '@/models/Quote';

const QUOTES = [
  {
    dayIndex: 1,
    text: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥',
    translation: 'You have the right to perform your actions, but never to the fruits of those actions. Let not the fruit of action be your motive, nor let your attachment be to inaction.',
    meaning: 'Do the work. Show up. Solve the problem. Don\'t obsess over results — the consistency is what compounds.',
    source: 'Bhagavad Gita, Chapter 2 · Verse 47',
  },
  {
    dayIndex: 2,
    text: 'उद्धरेदात्मनात्मानं नात्मानमवसादयेत्। आत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः॥',
    translation: 'Elevate yourself through the power of your own mind, and do not degrade yourself. The mind can be both the friend and the enemy of the self.',
    meaning: 'No one will drag you through 90 days. Only you can. The discipline you build is your greatest ally; the excuses you make are your only enemy.',
    source: 'Bhagavad Gita, Chapter 6 · Verse 5',
  },
  {
    dayIndex: 3,
    text: 'Arise, awake, and stop not till the goal is reached.',
    meaning: 'Progress has only one direction. Every problem you skip today compounds tomorrow into a harder climb.',
    source: 'Swami Vivekananda',
  },
  {
    dayIndex: 4,
    text: 'नेहाभिक्रमनाशोऽस्ति प्रत्यवायो न विद्यते। स्वल्पमप्यस्य धर्मस्य त्रायते महतो भयात्॥',
    translation: 'In this path, no effort is ever lost and no obstacle prevails. Even a little practice of this discipline protects one from great danger.',
    meaning: 'Every problem you attempt, every line of code you write — none of it is wasted. Even small progress today shields you in the interview.',
    source: 'Bhagavad Gita, Chapter 2 · Verse 40',
  },
  {
    dayIndex: 5,
    text: 'तस्मात्त्वमुत्तिष्ठ यशो लभस्व जित्वा शत्रून् भुङ्क्ष्व राज्यं समृद्धम्।',
    translation: 'Therefore arise, win glory, conquer your enemies, and enjoy a prosperous kingdom.',
    meaning: 'The hard problems are your enemies. The offer letter is your kingdom. Arise — open the editor, read the problem, write something.',
    source: 'Bhagavad Gita, Chapter 11 · Verse 33',
  },
  {
    dayIndex: 6,
    text: 'The mind is everything. What you think, you become.',
    meaning: 'If you tell yourself "I\'m not built for DSA", you won\'t be. Train your mind first; the hands follow.',
    source: 'Gautama Buddha',
  },
  {
    dayIndex: 7,
    text: 'तस्मादसक्तः सततं कार्यं कर्म समाचर। असक्तो ह्याचरन्कर्म परमाप्नोति पूरुषः॥',
    translation: 'Therefore, without attachment, always perform the duty that needs to be done. By performing action without attachment, a person attains the Supreme.',
    meaning: 'Don\'t solve problems hoping for an immediate reward. Solve them because solving is the work. The skill compounds quietly in the background.',
    source: 'Bhagavad Gita, Chapter 3 · Verse 19',
  },
  {
    dayIndex: 8,
    text: 'An ounce of practice is worth more than tons of theory.',
    meaning: 'You can watch 50 tutorials on Two Pointers, or you can open LeetCode and attempt one problem. The latter builds real skill every time.',
    source: 'Swami Vivekananda',
  },
  {
    dayIndex: 9,
    text: 'यतो यतो निश्चरति मनश्चञ्चलमस्थिरम्। ततस्ततो नियम्यैतदात्मन्येव वशं नयेत्॥',
    translation: 'Whenever and wherever the restless mind wanders, bring it back and place it under the control of the Self alone.',
    meaning: 'Your mind will drift to social media, to distractions, to what-ifs. Notice it. Return. Open the problem tab. That\'s the practice.',
    source: 'Bhagavad Gita, Chapter 6 · Verse 26',
  },
  {
    dayIndex: 10,
    text: 'Education is the best friend. An educated person is respected everywhere. Education beats beauty and youth.',
    meaning: 'You\'re not grinding LeetCode for a number on a leaderboard. You\'re building a mind that can decompose any problem, in any domain, forever.',
    source: 'Chanakya',
  },
  {
    dayIndex: 11,
    text: 'न हि ज्ञानेन सदृशं पवित्रमिह विद्यते।',
    translation: 'There is nothing in this world as purifying as knowledge.',
    meaning: 'Every pattern you internalize — Sliding Window, BFS, DP — is permanent wealth. No market crash, no layoff can take your understanding away.',
    source: 'Bhagavad Gita, Chapter 4 · Verse 38',
  },
  {
    dayIndex: 12,
    text: 'You have to dream before your dreams can come true.',
    meaning: 'Visualize yourself in the interview room — calm, confident, writing clean code. Your preparation is building that moment into reality right now.',
    source: 'A.P.J. Abdul Kalam',
  },
  {
    dayIndex: 13,
    text: 'मात्रास्पर्शास्तु कौन्तेय शीतोष्णसुखदुःखदाः। आगमापायिनोऽनित्यास्तांस्तितिक्षस्व भारत॥',
    translation: 'The non-permanent appearance of happiness and distress, and their disappearance in due course, are like the appearance and disappearance of winter and summer. Endure them without being disturbed.',
    meaning: 'Some days you\'ll solve five problems. Some days you\'ll be stuck on one for two hours. Both are normal. Neither defines you. Keep going.',
    source: 'Bhagavad Gita, Chapter 2 · Verse 14',
  },
  {
    dayIndex: 14,
    text: 'The secret of getting ahead is getting started.',
    meaning: 'You don\'t need to understand the full solution before you begin. Read the problem. Write the brute force. Progress begins with the first line.',
    source: 'Mark Twain',
  },
  {
    dayIndex: 15,
    text: 'आपूर्यमाणमचलप्रतिष्ठं समुद्रमापः प्रविशन्ति यद्वत्। तद्वत्कामा यं प्रविशन्ति सर्वे स शान्तिमाप्नोति न कामकामी॥',
    translation: 'As the ocean remains undisturbed though waters continually enter it, so the wise person remains undisturbed despite the flow of desires. Such a person attains peace — not one who chases after objects of desire.',
    meaning: 'Be the ocean. Distractions, bad days, hard problems — let them flow through. Stay steady. Solve anyway. Peace comes from the practice, not the result.',
    source: 'Bhagavad Gita, Chapter 2 · Verse 70',
  },
  {
    dayIndex: 16,
    text: 'The only way to do great work is to love what you do.',
    meaning: 'Find beauty in the puzzle. There\'s elegance in a clean O(n) solution, art in a well-named variable. Fall in love with the craft itself.',
    source: 'Steve Jobs',
  },
  {
    dayIndex: 17,
    text: 'असंशयं महाबाहो मनो दुर्निग्रहं चलम्। अभ्यासेन तु कौन्तेय वैराग्येण च गृह्यते॥',
    translation: 'Undoubtedly, O mighty-armed one, the mind is difficult to control and restless, but it is possible to control it by constant practice and by detachment.',
    meaning: 'You will not feel like solving today. That is expected. Practice anyway — the habit is being forged precisely in the moments of resistance.',
    source: 'Bhagavad Gita, Chapter 6 · Verse 35',
  },
  {
    dayIndex: 18,
    text: 'Before you start some work, always ask yourself three questions: Why am I doing it? What results might follow? Will I be successful? Only when you think deeply and find satisfactory answers, proceed.',
    meaning: 'Approach each problem deliberately. Why this pattern? What\'s the time complexity? Can I do better? Ask before you code — think before you type.',
    source: 'Chanakya',
  },
  {
    dayIndex: 19,
    text: 'वासांसि जीर्णानि यथा विहाय नवानि गृह्णाति नरोऽपराणि। तथा शरीराणि विहाय जीर्णान्यन्यानि संयाति नवानि देही॥',
    translation: 'Just as a person puts on new garments, giving up old ones, the soul similarly accepts new material bodies, giving up the old and useless ones.',
    meaning: 'The version of you that found Trees confusing is being replaced. A new version — one who reads DFS intuitively — is being assembled right now through this work.',
    source: 'Bhagavad Gita, Chapter 2 · Verse 22',
  },
  {
    dayIndex: 20,
    text: 'It does not matter how slowly you go as long as you do not stop.',
    meaning: 'One problem per day for 90 days beats zero problems per day. Slow is fine. Stopping is not. Show up.',
    source: 'Confucius',
  },
  {
    dayIndex: 21,
    text: 'जितात्मनः प्रशान्तस्य परमात्मा समाहितः। शीतोष्णसुखदुःखेषु तथा मानापमानयोः॥',
    translation: 'For one who has conquered the mind, the highest reality is already reached, for that person has attained tranquility. To such a person, happiness and distress, heat and cold, honor and dishonor are all the same.',
    meaning: 'Equanimity is a trainable skill. Train yourself not to panic at a Hard tag, not to relax at an Easy tag. Just solve.',
    source: 'Bhagavad Gita, Chapter 6 · Verse 7',
  },
  {
    dayIndex: 22,
    text: 'Hard work beats talent when talent doesn\'t work hard.',
    meaning: 'You are not behind anyone. The engineer who got that offer ground LeetCode for months. That\'s the whole game. Play it.',
    source: 'Tim Notke',
  },
  {
    dayIndex: 23,
    text: 'न प्रहृष्येत्प्रियं प्राप्य नोद्विजेत्प्राप्य चाप्रियम्। स्थिरबुद्धिरसम्मूढो ब्रह्मविद्ब्रह्मणि स्थितः॥',
    translation: 'One who is neither elated upon achieving something pleasant nor disturbed upon obtaining something unpleasant, who is self-intelligent and unbewildered — such a one is already situated in transcendence.',
    meaning: 'Solve a Hard problem — don\'t celebrate too long. Fail an Easy — don\'t spiral. Stay even. Keep the pace.',
    source: 'Bhagavad Gita, Chapter 5 · Verse 20',
  },
  {
    dayIndex: 24,
    text: 'First, have a definite practical ideal — a goal. Second, have the necessary means — wisdom and method. Third, adjust all your means to that end.',
    meaning: 'Your goal: DSA fluency. Your means: this tracker, daily problems, pattern review. Adjust everything to that end — including how you spend your evenings.',
    source: 'Aristotle',
  },
  {
    dayIndex: 25,
    text: 'Take up one idea. Make it your life — think of it, dream of it, live on that idea. Let the brain, muscles, nerves, every part of your body be full of that idea.',
    meaning: 'For the next 90 days, DSA is your idea. Not notifications, not side-projects, not "I\'ll start properly next week". This. Now. Today.',
    source: 'Swami Vivekananda',
  },
  {
    dayIndex: 26,
    text: 'धृत्या यया धारयते मनःप्राणेन्द्रियक्रियाः। योगेनाव्यभिचारिण्या धृतिः सा पार्थ सात्त्विकी॥',
    translation: 'O Arjuna, that determination which is unbreakable, which is sustained by yoga practice, and which controls the activities of the mind, life, and the senses — that determination is of the nature of goodness.',
    meaning: 'Goodness is consistency. The warrior who shows up every day — even for 30 minutes — beats the one who does 6-hour sessions twice a month.',
    source: 'Bhagavad Gita, Chapter 18 · Verse 33',
  },
  {
    dayIndex: 27,
    text: 'The impediment to action advances action. What stands in the way becomes the way.',
    meaning: 'The Hard problem you keep avoiding is exactly where your growth is hiding. Run toward the thing that intimidates you on LeetCode.',
    source: 'Marcus Aurelius',
  },
  {
    dayIndex: 28,
    text: 'तेजः क्षमा धृतिः शौचमद्रोहो नातिमानिता। भवन्ति सम्पदं दैवीमभिजातस्य भारत॥',
    translation: 'Radiance, forgiveness, fortitude, purity, freedom from malice, and absence of excessive pride — these are the qualities of one born for a higher nature.',
    meaning: 'Fortitude and purity of purpose: no shortcuts, no copy-pasting solutions without understanding. Write honest code. Understand every line you submit.',
    source: 'Bhagavad Gita, Chapter 16 · Verse 3',
  },
  {
    dayIndex: 29,
    text: 'When you want to succeed as badly as you want to breathe, then you will be successful.',
    meaning: 'Most people want the offer "if it works out". The ones who get it want it the way they want oxygen. Which version of yourself are you becoming?',
    source: 'Eric Thomas',
  },
  {
    dayIndex: 30,
    text: 'श्रेयान्स्वधर्मो विगुणः परधर्मात्स्वनुष्ठितात्। स्वधर्मे निधनं श्रेयः परधर्मो भयावहः॥',
    translation: 'Better is one\'s own duty, though imperfectly performed, than the duty of another well performed. Better is death in one\'s own duty; the duty of another is full of danger.',
    meaning: 'Your path is yours. Don\'t compare your day 30 to someone else\'s day 90. Run your race. Your pace, your method, your growth.',
    source: 'Bhagavad Gita, Chapter 3 · Verse 35',
  },
  {
    dayIndex: 31,
    text: 'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज। अहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः॥',
    translation: 'Abandon all varieties of religion and just surrender unto Me. I shall deliver you from all sinful reactions. Do not fear.',
    meaning: 'End of the month: let go of perfection, of guilt about days you missed, of comparison. Surrender to the process. Show up again tomorrow. That is enough.',
    source: 'Bhagavad Gita, Chapter 18 · Verse 66',
  },
];

async function seedQuotes() {
  const count = await Quote.countDocuments();
  if (count === 0) {
    await Quote.insertMany(QUOTES);
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    await seedQuotes();

    const dayIndex = new Date().getDate(); // 1–31
    const quote = await Quote.findOne({ dayIndex });

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    return NextResponse.json({ quote });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
