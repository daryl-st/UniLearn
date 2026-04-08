import type { Course, Notification } from '@/types/course';

// i will have this kind of data fetched from the api and use it accross my pages
export const COURSES: Course[] = [
  {
    id: 'nn-ar-409',
    title: 'Advanced Neural Architecture Search',
    description: 'Master the automated design of artificial neural networks using evolutionary algorithms and reinforcement learning protocols.',
    instructor: 'Dr. Elias Thorne',
    instructorImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXlMR9LwLBWFSsk-1AB183Anmp0nf75qbQOz9Ps-3UC84M4qnFlfh7rcO8xoiv2j8y5FJPOAZGrPx0wg2ARrMWWVI9fpLKIHtWTAh8K6C5V7zmicIhHDAQTBAmUHdGirV8h0YiZaVOIpFpBUxu9VEJ_v37io7WTS-XP9Mr5OsmdsdJhCzeerNny2FPqGT0V7TIJz8Ym-LS2sXEu4gYVMyrsOZ9xtqhIhzu63PxVAjNBAwqCZiBUdn_5hyUVoWNZGCZUGnZQpACC05D',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANu_TQIv26iUy09RULyHXqAgw01WRxR1f9AnQpMp7nBVijbkPy5kMpV2Fs1mf7uNB7Q1QoroeoiqKqKSQ5nCr7eQfyajJg9b_3rjuDdtyAOoL5Z3EFRIRzDxojNZwLSAbgJnoxh7OicIKo4CSwPwiV7IOnuA6CsOpww4lHbcOZIrJ_ufBK2dLt6naoT-pAwgQ1Zd2OzKmO15GkJnpcmmYNDgbkJgu65mn1HFnbD_HXXg7djOQGl0HZdWGAKRMrnlXeaz1olxX_haa_',
    progress: 68,
    duration: '14h 20m',
    level: 'Advanced',
    category: 'Featured Protocol',
    lessonsCount: 12,
    modules: [
      {
        id: 'm1',
        title: 'Foundations of Neural Architecture',
        lessons: [
          { id: 'l1', title: 'Introduction to NAS Protocols', type: 'video', duration: '12:40', isCompleted: true },
          { id: 'l2', title: 'Search Space Definition', type: 'reading', duration: '15:00', isCompleted: true },
          { id: 'l3', title: 'Performance Estimation Strategies', type: 'video', duration: '22:15', isCompleted: true },
        ]
      },
      {
        id: 'm2',
        title: 'Evolutionary Search Algorithms',
        lessons: [
          { id: 'l4', title: 'Genetic Algorithms in NAS', type: 'video', duration: '18:30', isCompleted: true },
          { id: 'l5', title: 'Population-based Training', type: 'video', duration: '25:45', isCompleted: false },
          { id: 'l6', title: 'Quiz: Evolutionary Protocols', type: 'quiz', duration: '10:00', isCompleted: false },
        ]
      },
      {
        id: 'm3',
        title: 'Reinforcement Learning for NAS',
        lessons: [
          { id: 'l7', title: 'Policy Gradient Methods', type: 'video', duration: '30:00', isCompleted: false },
          { id: 'l8', title: 'Controller RNN Architectures', type: 'video', duration: '28:20', isCompleted: false },
        ],
        isLocked: true
      }
    ]
  },
  {
    id: 'transformers-101',
    title: 'Transformers & Attention Mechanisms',
    description: 'Deep dive into the architecture that revolutionized modern large language models.',
    instructor: 'Dr. Elias Thorne',
    instructorImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5TOj7IJMV0VSlgxEJn2K4URJWjizkVuxM9Lt0w1zwDrGvKkOaT6yPylP6RqJdKMGHDCTFeBMx08DyrBqDmr5VPHZsZrbEHTIJwYFBJT9KaUmvgLUg2laZlAQ_VSjCretRebLTM4Rjdd9FgBX_Pi5AgsWF7wctlFFCr-sQ-wwWezdU3jrPEaSKmJj0Ea13n814molhpayR-QKDw8dcTTwDE914kfEozRdMoz4tWAv4IUXQ4qRf72TSDxYTbrYWc0HjGrt-KAfqCFXX',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBh4vEwwZWwxSwT24EHyYp2T3ghmxkK1RnC2jwHNg6_CxpshWpDX4X-o4Zk1DPVrElZcibcU5iKoBaYanULv10VTnI160-QACe0LZ5pwWzcsv-ynreS-dp_dzmoLhZV-PXHW44EMKXB2mVmEmU_CWcyd9KMmeQLv7xcfiK6WIktcTpRS1DNbQomwDOOlMPB-6KfN__OPrz_V16shDgAOebwxWx3sGewsKkuDiS5lg2sJXu_NsLUEC0ItDzSIEjUMg89u_87YsYc_aQ_',
    progress: 0,
    duration: '12h',
    level: 'Intermediate',
    category: 'Core',
    lessonsCount: 12,
  },
  {
    id: 'adversarial-ml',
    title: 'Adversarial Machine Learning',
    description: 'Protecting models from poisoning and evasion attacks in high-stakes environments.',
    instructor: 'Sarah Vane, PhD',
    instructorImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2vJHvIdVMtf2QkZts1CK5Di6CSfvXALXFkQUoglFhYxe64dDK2idNTCjiyAr1kMxR5DXXTJG5784I6JFYyiW26Rw3ZkqA1GhEh2EvokUeyOyyTUK3LakcybgUvuIv4-8gPOl-6Pz0zUT43LSnGHYd5xldUSdkVSpPSRBZQTSsXnS7VwEXvliql9mCyDRw5ig2YO0PzmnDcfSO62kfiKTzpBBK7Va8oJiJxaf2uV--mlMq2L0Gdld2m-gbW7nVa41k9saIaSr1RukW',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChgzmx-GVynyZdFDE7E4zaziHoIm26mCbg7LCB7Te8CdlPQaQ16lTEAO_xzmPVRJHjk1dSMoZh8tYGk5fFBTBUpDCktdsw6vq7XzmxtxHYt4xFfsnwctIa8G2gnLZ7886KfaqzMhq5xK6FZfliDiYzCzfUT2mkgzY-ZndLdSLhSNMW1cS8N9Etek_kzZ-KKwrXW_sYeGTOve_-ptAfbFhJgIixsM7Agvv5tIuaHKccRUQYqBhyE6nZO9uKL8rZbePc8KGVXp-ajcXq',
    progress: 12,
    duration: '8.2h',
    level: 'Advanced',
    category: 'Security',
    lessonsCount: 8,
  }
];

export const NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Certification Issued',
    description: 'Foundations of Large Language Models',
    time: '02:14 PM',
    type: 'system',
  },
  {
    id: '2',
    title: 'Instructor Comment',
    description: 'Dr. Thorne responded to your query on Vector DBs.',
    time: 'YESTERDAY',
    type: 'instructor',
  },
  {
    id: '3',
    title: 'New Lab Available',
    description: 'Hands-on: Distributed Inference Optimization',
    time: 'AUG 14',
    type: 'sandbox',
  }
];
