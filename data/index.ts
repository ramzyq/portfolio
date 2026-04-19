import type { LucideIcon } from "lucide-react";
import { Award, Medal, Trophy } from "lucide-react";

export type ProjectStatus = "Shipped" | "Prototype" | "In Progress" | "Done" | "Ongoing";

export type ProjectType = {
  slug: string;
  name: string;
  description: string;
  stack: string[];
  status: ProjectStatus;
  collaborators?: string;
  github?: string;
  demo?: string;
  featured?: boolean;
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
};

export type AchievementType = {
  title: string;
  event: string;
  icon: LucideIcon;
};

export type SocialLinkType = {
  label: string;
  href: string;
};

export type RoleRotationType = string[];

export const OWNER = {
  fullName: "Konde Ramzy Gbati",
  shortName: "Ramzy",
  initials: "KRG",
  role: "Information Technology Student, University of Ghana",
  location: "Accra, Ghana",
  tagline: "Builder. Designer. Educator.",
  email: "konderamzy30@gmail.com",
  bioShort:
    "I'm an IT student and builder focused on shipping things that work for real people — not demos.",
  bioLong: [
    "I'm Konde Ramzy Gbati — an IT student at the University of Ghana and a builder who works across mobile development, product design, cybersecurity, and STEM education.",
    "I don't vibe-code. I understand every line I ship. I care about building things that work for real people, not things that only look good in a pitch deck. That principle shows up whether I'm wiring up a Flutter screen, designing a user flow, or setting up a pentest lab.",
    "Outside of building, I coach robotics teams across Ghana and help students discover engineering through First Lego League and World Robot Olympiad. Teaching sharpens the way I think — if I can't explain it simply, I don't understand it yet.",
  ],
} as const;

export const SOCIAL_LINKS: SocialLinkType[] = [
  { label: "GitHub", href: "https://github.com/ramzyq" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/konderamzygbati" },
  { label: "X", href: "https://x.com/Ramzyyqq" },
  { label: "Email", href: "mailto:konderamzy30@gmail.com" },
];

export const ROLE_ROTATION: RoleRotationType = [
  "Flutter Developer",
  "Product Designer",
  "STEM Educator",
  "Cybersecurity Enthusiast",
];

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
    description:
      "AI-powered business advisor for informal market traders in Ghana. Helps small traders with pricing, inventory insights, and day-to-day business decisions in plain language.",
    stack: ["AI / LLM backend"],
    status: "Done",
    collaborators: "Built with Julien & Richmond (hackathon)",
    github: "https://github.com/ramzyq/traderwise",
    featured: true,
  },
  {
    slug: "notely",
    name: "Notely",
    description:
      "A clean note-taking app with full create, read, update, and delete support. Built to feel instant on mobile and stay out of the user's way.",
    stack: ["Flutter", "Dart", "Claude Code"],
    status: "Done",
    github: "https://github.com/ramzyq/mynotes",
  },
  {
    slug: "cyber-home-lab",
    name: "Cybersecurity Home Lab",
    description:
      "A personal penetration testing lab built on virtual machines for hands-on practice with ethical hacking, vulnerability research, and reporting.",
    stack: ["Kali Linux", "Metasploitable 2", "DVWA", "VirtualBox"],
    status: "Ongoing",
    github: "#",
    demo: "#",
  },
  {
    slug: "makersplace-robotics",
    name: "Makersplace Robotics",
    description:
      "Designed and facilitated FLL and WRO robotics competitions across Ghana. Coached student teams from concept through build, programming, and competition day.",
    stack: ["LEGO Mindstorms", "EV3", "Python"],
    status: "Ongoing",
  },
];

export const EXPERIENCE: ExperienceType[] = [
  {
    title: "Competition Facilitator & Coach",
    organization: "Makersplace Robotics",
    period: "2023 — Present",
    description:
      "Facilitated First Lego League and World Robot Olympiad events across Ghana. Mentored student teams in robotics design, programming, and presentation.",
    kind: "work",
  },
  {
    title: "President",
    organization: "Pioneer Robotics Club, Achimota School",
    period: "2021 — 2023",
    description:
      "Led the club through its most competitive years. Organized training sessions and managed team logistics for national and international competitions.",
    kind: "work",
  },
  {
    title: "BSc Information Technology",
    organization: "University of Ghana",
    period: "2025 — Present",
    description:
      "Coursework: Computer Organization & Architecture, Digital Logic, Databases, Automata Theory, Academic Writing, Cybersecurity.",
    kind: "education",
  },
  {
    title: "WASSCE",
    organization: "Achimota School",
    period: "2021 — 2024",
    description:
      "Completed secondary education with a focus on science. Served as president of the Pioneer Robotics Club.",
    kind: "education",
  },
];

export const ACHIEVEMENTS: AchievementType[] = [
  {
    title: "3rd Place · Best Engineering Design",
    event: "FLL Nationals, Ghana",
    icon: Trophy,
  },
  {
    title: "8th Place",
    event: "RoboFest International",
    icon: Medal,
  },
  {
    title: "9th Place",
    event: "World Robot Olympiad (WRO)",
    icon: Award,
  },
];

export const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
] as const;
