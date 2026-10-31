import type { IconComponent } from "@/components/site/icons";
import { Award, Medal, Trophy } from "@/components/site/icons";

export type ProjectStatus = "Shipped" | "Prototype" | "In Progress" | "Done" | "Ongoing";

export type ProjectType = {
  slug: string;
  name: string;
  description: string;
  tagline: string;
  stack: string[];
  status: ProjectStatus;
  collaborators?: string;
  github?: string;
  demo?: string;
  featured?: boolean;
  cover: {
    from: string;
    to: string;
    accent: string;
    ink: string;
  };
};

export type SkillGroupType = {
  title: string;
  items: string[];
};

export type ExperienceType = {
  title: string;
  organization: string;
  period: string;
  description: string;
  kind: "work" | "education";
  start: number;
  end: number;
  current?: boolean;
};

export type AchievementType = {
  title: string;
  event: string;
  caption: string;
  icon: IconComponent;
  cover: { from: string; to: string };
};

export type SocialLinkType = {
  label: string;
  href: string;
};

export type ArchiveKind = "fll" | "robofest" | "wro" | "stem" | "events";

export type ArchiveItemType = {
  kind: ArchiveKind;
  name: string;
  caption: string;
  href: string;
};

export type StatType = {
  value: number;
  suffix?: string;
  label: string;
  caption: string;
};

export const OWNER = {
  fullName: "Konde Ramzy Gbati",
  shortName: "Ramzy",
  initials: "KRG",
  role: "Information Technology Student, University of Ghana",
  location: "Accra, Ghana",
  tagline: "Builder. Designer. Educator.",
  email: "konderamzy30@gmail.com",
  currentlyAt: "University of Ghana",
  currentlyAtShort: "UG",
  bioShort:
    "I'm an IT student and builder focused on shipping things that work for real people, not demos.",
  headlineLead: "I’m Ramzy, a builder, designer, and STEM educator.",
  headlineMute:
    "Currently studying Information Technology at the University of Ghana.",
  aboutLead: "I build with purpose:",
  aboutMute:
    "shipping things that work for real people, teaching as I go, and keeping the craft honest.",
  bioLong: [
    "I'm Konde Ramzy Gbati — an IT student at the University of Ghana and a builder who works across mobile development, product design, cybersecurity, and STEM education.",
    "I build with purpose—every decision is grounded in solving real problems. Whether shipping mobile apps, designing user experiences, or securing systems, I prioritize what works in production over what looks good in presentations.",
    "Outside of building, I coach robotics teams across Ghana and help students discover engineering through First Lego League and World Robot Olympiad. Teaching sharpens the way I think — if I can't explain it simply, I don't understand it yet.",
  ],
} as const;

export const SOCIAL_LINKS: SocialLinkType[] = [
  { label: "GitHub", href: "https://github.com/ramzyq" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/konderamzygbati" },
  { label: "X", href: "https://x.com/Ramzyyqq" },
  { label: "Email", href: "mailto:konderamzy30@gmail.com" },
];

export const ROLE_ROTATION = [
  "Flutter Developer",
  "Product Designer",
  "STEM Educator",
  "Cybersecurity Enthusiast",
] as const;

export const SKILL_GROUPS: SkillGroupType[] = [
  {
    title: "Mobile Development",
    items: ["Flutter", "Dart"],
  },
  {
    title: "Languages",
    items: ["Python", "Flutter", "Dart", "SQL"],
  },
  {
    title: "Design",
    items: ["Claude Design", "UI/UX", "Product Design"],
  },
  {
    title: "Cybersecurity",
    items: ["Kali Linux", "Metasploitable 2", "DVWA", "Ethical Hacking"],
  },
  {
    title: "Tools",
    items: ["Git", "GitHub", "VS Code", "Claude Code"],
  },
];

export const PROJECTS: ProjectType[] = [
  {
    slug: "traderwise",
    name: "TraderWise",
    tagline: "Advice for market traders",
    description:
      "AI business advisor for informal market traders in Ghana. Helps small traders with pricing, inventory insights, and daily business decisions in plain language.",
    stack: ["AI / LLM backend"],
    status: "Done",
    collaborators: "Built with Julien & Richmond (hackathon)",
    github: "https://github.com/ramzyq/traderwise",
    featured: true,
    cover: {
      from: "#d7f0c8",
      to: "#f4fbe8",
      accent: "#2f6b32",
      ink: "#1c3b1e",
    },
  },
  {
    slug: "notely",
    name: "Notely",
    tagline: "A calmer place to write",
    description:
      "A clean app for notes with full create, read, update, and delete support. Built to feel instant on mobile and stay out of the user's way.",
    stack: ["Flutter", "Dart", "Claude Code"],
    status: "Done",
    github: "https://github.com/ramzyq/mynotes",
    cover: {
      from: "#e7eefc",
      to: "#f7f5ef",
      accent: "#3b5bdb",
      ink: "#1f2937",
    },
  },
  {
    slug: "cyber-home-lab",
    name: "Home Lab",
    tagline: "Practice, not theory",
    description:
      "A personal penetration testing lab built on virtual machines for practical experience with ethical hacking, vulnerability research, and reporting.",
    stack: ["Kali Linux", "Metasploitable 2", "DVWA", "VirtualBox"],
    status: "Ongoing",
    cover: {
      from: "#d9e8e4",
      to: "#f3f7f6",
      accent: "#0f766e",
      ink: "#134e4a",
    },
  },
  {
    slug: "makersplace-robotics",
    name: "Makersplace",
    tagline: "From kits to competition",
    description:
      "Designed and facilitated FLL and WRO robotics competitions across Ghana. Coached student teams from concept through build, programming, and competition day.",
    stack: ["LEGO Mindstorms", "EV3", "Python"],
    status: "Ongoing",
    cover: {
      from: "#fde68a",
      to: "#fff7ed",
      accent: "#c2410c",
      ink: "#7c2d12",
    },
  },
];

export const EXPERIENCE: ExperienceType[] = [
  {
    title: "BSc Information Technology",
    organization: "University of Ghana",
    period: "2025 — Present",
    description:
      "Coursework: Computer Organization & Architecture, Digital Logic, Databases, Cybersecurity.",
    kind: "education",
    start: 2025,
    end: 2027,
    current: true,
  },
  {
    title: "Competition Facilitator & Coach",
    organization: "Makersplace Robotics",
    period: "2025 — Present",
    description:
      "Facilitated First Lego League, AI for Good and World Robot Olympiad events across Ghana. Mentored student teams in robotics design, programming, and presentation.",
    kind: "work",
    start: 2025,
    end: 2027,
    current: true,
  },
  {
    title: "President",
    organization: "Pioneer Robotics Club",
    period: "2023 — 2024",
    description:
      "Led the club through its most competitive years. Organized training sessions and managed team logistics for national and international competitions.",
    kind: "work",
    start: 2023,
    end: 2024,
  },
  {
    title: "WASSCE",
    organization: "Achimota School",
    period: "2021 — 2024",
    description:
      "Completed secondary education with a focus on science. Served as president of the Pioneer Robotics Club.",
    kind: "education",
    start: 2021,
    end: 2024,
  },
];

export const ACHIEVEMENTS: AchievementType[] = [
  {
    title: "Best Engineering Design",
    event: "FLL Nationals, Ghana",
    caption: "3rd place",
    icon: Trophy,
    cover: { from: "#fde68a", to: "#fef3c7" },
  },
  {
    title: "RoboFest International",
    event: "International placement",
    caption: "8th place",
    icon: Medal,
    cover: { from: "#ddd6fe", to: "#ede9fe" },
  },
  {
    title: "World Robot Olympiad",
    event: "WRO",
    caption: "9th place",
    icon: Award,
    cover: { from: "#bae6fd", to: "#e0f2fe" },
  },
];

export const ARCHIVE: ArchiveItemType[] = [
  {
    kind: "fll",
    name: "FLL Nationals",
    caption: "3rd place",
    href: "/learn",
  },
  {
    kind: "robofest",
    name: "RoboFest International",
    caption: "8th place",
    href: "/learn",
  },
  {
    kind: "wro",
    name: "World Robot Olympiad",
    caption: "9th place",
    href: "/learn",
  },
  {
    kind: "stem",
    name: "STEM education",
    caption: "100+ students mentored",
    href: "/learn",
  },
  {
    kind: "events",
    name: "Robotics events",
    caption: "12+ events coached",
    href: "/learn",
  },
];

export const STATS: StatType[] = [
  {
    value: 3,
    label: "International placements",
    caption: "FLL Nationals, RoboFest, World Robot Olympiad",
  },
  {
    value: 100,
    suffix: "+",
    label: "Students mentored",
    caption: "Across robotics camps and competition seasons",
  },
  {
    value: 4,
    label: "Disciplines I work across",
    caption: "Mobile, design, security, education",
  },
  {
    value: 12,
    suffix: "+",
    label: "Robotics events",
    caption: "Coached, judged, or facilitated since 2022",
  },
] as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Built", href: "/built" },
  { label: "Learn", href: "/learn" },
  { label: "Contact", href: "/contact" },
] as const;

export const TIMELINE_YEARS = [2021, 2022, 2023, 2024, 2025, 2026, 2027] as const;
