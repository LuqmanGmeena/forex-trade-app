import { Task, Quiz, Achievement } from '../types/rewards';

export const tasksData: Task[] = [
  {
    id: 'daily_login',
    title: 'Daily Login',
    description: 'Log in to the platform',
    type: 'ENGAGEMENT',
    reward: 5,
    requirements: {},
    isDaily: true
  },
  {
    id: 'first_trade',
    title: 'Make Your First Trade',
    description: 'Execute your first buy or sell order',
    type: 'TRADING',
    reward: 25,
    requirements: { trades: 1 }
  },
  {
    id: 'profitable_trade',
    title: 'Profitable Trade',
    description: 'Close a trade with profit',
    type: 'TRADING',
    reward: 50,
    requirements: { profit: 1 }
  },
  {
    id: 'daily_trader',
    title: 'Daily Trader',
    description: 'Make 5 trades in a day',
    type: 'TRADING',
    reward: 75,
    requirements: { trades: 5 },
    timeLimit: 24,
    isDaily: true
  },
  {
    id: 'week_active',
    title: 'Weekly Warrior',
    description: 'Stay active for 7 consecutive days',
    type: 'ENGAGEMENT',
    reward: 100,
    requirements: { daysActive: 7 }
  },
  {
    id: 'refer_friend',
    title: 'Refer a Friend',
    description: 'Invite someone to join the platform',
    type: 'REFERRAL',
    reward: 200,
    requirements: { referrals: 1 }
  }
];

export const quizzesData: Quiz[] = [
  {
    id: 'forex_basics',
    title: 'Forex Trading Basics',
    description: 'Test your knowledge of fundamental forex concepts',
    reward: 100,
    passingScore: 80,
    questions: [
      {
        id: 'q1',
        question: 'What does "pip" stand for in forex trading?',
        options: [
          'Price Interest Point',
          'Percentage in Point',
          'Profit in Percentage',
          'Point in Price'
        ],
        correctAnswer: 1
      },
      {
        id: 'q2',
        question: 'In the currency pair EUR/USD, which is the base currency?',
        options: ['USD', 'EUR', 'Both', 'Neither'],
        correctAnswer: 1
      },
      {
        id: 'q3',
        question: 'What is a "spread" in forex trading?',
        options: [
          'The difference between bid and ask price',
          'The profit from a trade',
          'The time between trades',
          'The currency exchange rate'
        ],
        correctAnswer: 0
      },
      {
        id: 'q4',
        question: 'What does "going long" mean?',
        options: [
          'Selling a currency',
          'Buying a currency',
          'Holding for a long time',
          'Trading with high leverage'
        ],
        correctAnswer: 1
      },
      {
        id: 'q5',
        question: 'What is leverage in forex trading?',
        options: [
          'The profit margin',
          'Borrowed capital to increase potential returns',
          'The trading fee',
          'The currency conversion rate'
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'risk_management',
    title: 'Risk Management',
    description: 'Learn about managing risks in forex trading',
    reward: 150,
    passingScore: 75,
    questions: [
      {
        id: 'q1',
        question: 'What is a stop-loss order?',
        options: [
          'An order to buy at a lower price',
          'An order to sell at a higher price',
          'An order to limit losses by closing a position',
          'An order to increase position size'
        ],
        correctAnswer: 2
      },
      {
        id: 'q2',
        question: 'What percentage of your account should you risk per trade?',
        options: ['1-2%', '5-10%', '15-20%', '25-30%'],
        correctAnswer: 0
      },
      {
        id: 'q3',
        question: 'What is position sizing?',
        options: [
          'The time to hold a position',
          'The amount of capital allocated to a trade',
          'The number of currency pairs to trade',
          'The leverage ratio used'
        ],
        correctAnswer: 1
      },
      {
        id: 'q4',
        question: 'What is diversification in trading?',
        options: [
          'Trading only one currency pair',
          'Spreading risk across multiple trades/assets',
          'Using maximum leverage',
          'Trading at different times'
        ],
        correctAnswer: 1
      }
    ]
  }
];

export const achievementsData: Achievement[] = [
  {
    id: 'first_steps',
    title: 'First Steps',
    description: 'Complete your first trade',
    icon: 'Trophy',
    reward: 50,
    requirement: { type: 'TRADES_COUNT', value: 1 }
  },
  {
    id: 'trader_novice',
    title: 'Novice Trader',
    description: 'Complete 10 trades',
    icon: 'Target',
    reward: 100,
    requirement: { type: 'TRADES_COUNT', value: 10 }
  },
  {
    id: 'profit_maker',
    title: 'Profit Maker',
    description: 'Earn $500 in total profits',
    icon: 'DollarSign',
    reward: 200,
    requirement: { type: 'PROFIT_AMOUNT', value: 500 }
  },
  {
    id: 'dedicated_trader',
    title: 'Dedicated Trader',
    description: 'Stay active for 30 days',
    icon: 'Calendar',
    reward: 300,
    requirement: { type: 'DAYS_ACTIVE', value: 30 }
  },
  {
    id: 'task_master',
    title: 'Task Master',
    description: 'Complete 20 tasks',
    icon: 'CheckCircle',
    reward: 250,
    requirement: { type: 'TASKS_COMPLETED', value: 20 }
  },
  {
    id: 'quiz_champion',
    title: 'Quiz Champion',
    description: 'Score 100% on any quiz',
    icon: 'Award',
    reward: 150,
    requirement: { type: 'QUIZ_SCORE', value: 100 }
  }
];