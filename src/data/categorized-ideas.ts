export interface Idea {
  id: string;
  text: string;
  votes: number;
  author: string;
  timestamp: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  ideas: Idea[];
}

export const categories: Category[] = [
  {
    id: 'foreign-policy',
    name: 'Foreign Policy',
    icon: '🌍',
    ideas: [
      {
        id: 'fp1',
        text: 'Establish stronger diplomatic ties with emerging economies in Southeast Asia',
        votes: 1247,
        author: 'Sarah Chen',
        timestamp: '2 hours ago'
      },
      {
        id: 'fp2',
        text: 'Create international climate cooperation framework with binding commitments',
        votes: 982,
        author: 'Marcus Johnson',
        timestamp: '4 hours ago'
      },
      {
        id: 'fp3',
        text: 'Increase cultural exchange programs to promote mutual understanding',
        votes: 756,
        author: 'Emily Rodriguez',
        timestamp: '6 hours ago'
      }
    ]
  },
  {
    id: 'education',
    name: 'Education',
    icon: '📚',
    ideas: [
      {
        id: 'ed1',
        text: 'Implement universal pre-K programs to ensure early childhood education access',
        votes: 2134,
        author: 'David Kim',
        timestamp: '1 hour ago'
      },
      {
        id: 'ed2',
        text: 'Modernize curriculum to include AI literacy and digital skills',
        votes: 1876,
        author: 'Priya Patel',
        timestamp: '3 hours ago'
      },
      {
        id: 'ed3',
        text: 'Increase teacher salaries to attract and retain quality educators',
        votes: 1654,
        author: 'Alex Thompson',
        timestamp: '5 hours ago'
      }
    ]
  },
  {
    id: 'technology',
    name: 'Technology',
    icon: '💻',
    ideas: [
      {
        id: 'tech1',
        text: 'Develop national broadband infrastructure for rural and underserved areas',
        votes: 1892,
        author: 'Jordan Lee',
        timestamp: '30 minutes ago'
      },
      {
        id: 'tech2',
        text: 'Create regulations for ethical AI development and deployment',
        votes: 1543,
        author: 'Taylor Brown',
        timestamp: '2 hours ago'
      },
      {
        id: 'tech3',
        text: 'Invest in quantum computing research and development',
        votes: 1234,
        author: 'Morgan Davis',
        timestamp: '4 hours ago'
      }
    ]
  },
  {
    id: 'transportation',
    name: 'Transportation',
    icon: '🚗',
    ideas: [
      {
        id: 'trans1',
        text: 'Expand electric vehicle charging infrastructure nationwide',
        votes: 2456,
        author: 'Casey Wilson',
        timestamp: '1 hour ago'
      },
      {
        id: 'trans2',
        text: 'Build high-speed rail network connecting major metropolitan areas',
        votes: 2187,
        author: 'Riley Martin',
        timestamp: '3 hours ago'
      },
      {
        id: 'trans3',
        text: 'Improve public transit accessibility for disabled communities',
        votes: 1765,
        author: 'Jamie Anderson',
        timestamp: '5 hours ago'
      }
    ]
  },
  {
    id: 'energy',
    name: 'Energy',
    icon: '⚡',
    ideas: [
      {
        id: 'energy1',
        text: 'Transition to 100% renewable energy grid by 2035',
        votes: 3021,
        author: 'Sam Garcia',
        timestamp: '2 hours ago'
      },
      {
        id: 'energy2',
        text: 'Incentivize home solar panel installation through tax credits',
        votes: 2543,
        author: 'Drew Martinez',
        timestamp: '4 hours ago'
      },
      {
        id: 'energy3',
        text: 'Invest in next-generation nuclear fusion research',
        votes: 1987,
        author: 'Quinn Taylor',
        timestamp: '6 hours ago'
      }
    ]
  },
  {
    id: 'tourism',
    name: 'Tourism',
    icon: '✈️',
    ideas: [
      {
        id: 'tour1',
        text: 'Promote sustainable tourism practices to protect natural landmarks',
        votes: 1654,
        author: 'Avery White',
        timestamp: '1 hour ago'
      },
      {
        id: 'tour2',
        text: 'Create digital heritage tours for historical sites',
        votes: 1432,
        author: 'Blake Harris',
        timestamp: '3 hours ago'
      },
      {
        id: 'tour3',
        text: 'Support local tourism businesses through grants and training programs',
        votes: 1289,
        author: 'Parker Clark',
        timestamp: '5 hours ago'
      }
    ]
  }
];
