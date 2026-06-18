import {
  Component,
  signal,
  AfterViewInit,
  ElementRef,
  ViewChild,
  computed,
  HostListener,
} from '@angular/core';
import { YouTubePlayerModule } from '@angular/youtube-player';

interface ProjectLink {
  name: string;
  icon: string;
  url: string;
}
interface ProjectTech {
  name: string;
  icon: string;
}
interface Project {
  title: string;
  status: string;
  type: string;
  statusClass: string;
  description: string;
  imageUrl: string;
  tech: ProjectTech[];
  links: ProjectLink[];
  videoUrl?: string;
  subTitle: string;
  myRole: string;
  // Case Study Data
  problem: string;
  constraints: string[];
  whatYouShipped: string[];
  impact: string[];
  systemDesign?: {
    diagramUrl: string;
    description: string;
    tradeoffs: string[];
  };
}
interface Experience {
  date: string;
  title: string;
  company: string;
  companyUrl: string;
  logoUrl: string;
  description: string;
  points: string[];
  tags: string[];
  isCurrent: boolean;
  teamSize: string;
  // Augmented data
  startDate: string;
  endDate: string;
  locationType: 'Onsite' | 'Remote';
  location: string;
  countryCode: string;
}

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss',
  imports: [YouTubePlayerModule],
  host: {
    '(window:scroll)': 'onWindowScroll()',
  },
})
export class PortfolioComponent implements AfterViewInit {
  @ViewChild('audioPlayer') audioPlayerRef!: ElementRef<HTMLAudioElement>;

  // Personal Info
  fullName = 'Muhammad Imran Arshad';
  phone = '+92-306-8444929';
  email = 'buildwithimran@gmail.com';
  domain = 'buildwithimran.online';
  linkedInUrl = 'https://www.linkedin.com/in/buildwithimran';
  whatsAppUrl =
    'https://api.whatsapp.com/send/?phone=923068440929&text&type=phone_number&app_absent=0';
  githubUrl = 'https://github.com/buildwithimran';
  currentYear = new Date().getFullYear();
  profileImageUrl = 'assets/images/me.png';
  resumeLastUpdated = 'Mar 2026';

  // Parallax offset for hero photo (subtle scroll-driven movement)
  heroPhotoOffset = signal(0);

  // Mobile menu state
  mobileMenuOpen = signal(false);

  // Navbar links — order matches the on-page section flow.
  // Update both this array AND the corresponding section ids together.
  navLinks: { id: string; label: string }[] = [
    { id: 'projects', label: 'Work' },
    { id: 'impact', label: 'Impact' },
    { id: 'experience', label: 'Experience' },
    { id: 'architecture', label: 'Systems' },
    { id: 'stack', label: 'Stack' },
    { id: 'process', label: 'Process' },
    { id: 'services', label: 'Services' },
    { id: 'contact', label: 'Contact' },
  ];

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((v) => !v);
    document.body.style.overflow = this.mobileMenuOpen() ? 'hidden' : '';
  }

  closeMobileMenu(): void {
    if (this.mobileMenuOpen()) {
      this.mobileMenuOpen.set(false);
      document.body.style.overflow = '';
    }
  }

  // New Impact-focused stats
  completedProjects = 20;
  professionalWorkYears = 5;
  timezone = 'GMT+5';

  // UI State
  selectedVideoId = signal<string | null>(null);
  selectedProject = signal<Project | null>(null);
  showScrollToTop = signal(false);
  isAudioPlaying = signal(false);
  isTogglingAudio = signal(false);
  showResumeToast = signal(false);
  activeSection = signal<string>('home');

  // Count-up animation signals
  displayedProjects = signal(0);

  width = 900;
  height = 500;

  constructor() {
    this.experience.set(this.processExperienceData());
  }

  ngAfterViewInit(): void {
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.scroll-animate').forEach((el) => {
      observer.observe(el);
    });

    const countUpObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.startProjectCountUpAnimation();
            countUpObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.8 }
    );

    const projectCounterEl = document.querySelector('#project-counter');
    if (projectCounterEl) {
      countUpObserver.observe(projectCounterEl);
    }

    const player = this.audioEl;
    if (player) {
      player.addEventListener('play', () => this.isAudioPlaying.set(true));
      player.addEventListener('pause', () => this.isAudioPlaying.set(false));
    }

    this.setupSectionObserver();
  }

  private setupSectionObserver(): void {
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    const sections = document.querySelectorAll('section[id]');

    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -60% 0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          this.activeSection.set(sectionId);
          history.replaceState(null, '', `#${sectionId}`);
        }
      });
    }, observerOptions);

    sections.forEach((section) => {
      observer.observe(section);
    });
  }

  skills = signal([
    { name: 'Software Architecture', color: 'bg-sky-500' },
    { name: 'Web Development', color: 'bg-green-500' },
    { name: 'Mobile Solutions', color: 'bg-purple-500' },
  ]);

  experience = signal<Experience[]>([]);

  private rawExperienceData = [
    {
      date: 'Feb 2026 – Present',
      title: 'Team Lead (Full Stack)',
      company: 'Zoombox',
      companyUrl: '#',
      logoUrl: 'https://avatar.vercel.sh/zoombox.svg?text=ZB&color=white&background=%232d2e32',
      description:
        'Full-stack Team Lead handling overall system design and scalability for web/mobile products. I lead technical direction end-to-end and manage release/deployment workflows.',
      points: [
        'Own system architecture and scalability for Node.js/NestJS backends and integrations.',
        'Lead full-stack delivery across Flutter mobile + web/front-end interfaces, focusing on maintainability and performance.',
        'Manage deployment and release operations using Slack, Trello, and GitHub (handoffs, coordination, production readiness).',
      ],
      tags: ['NestJS', 'Node.js', 'Flutter', 'System Design', 'Leadership'],
      isCurrent: true,
      location: 'Faisalabad, Pakistan',
      locationType: 'Onsite' as const,
      countryCode: 'pk',
      teamSize: '8-12 Engineers',
    },
    {
      date: 'March 2022 – Feb 2026',
      title: 'Team Lead Frontend Developer',
      company: 'Sittap',
      companyUrl: 'https://sittap.com',
      logoUrl: 'https://avatar.vercel.sh/sittap.svg?text=ST&color=white&background=%232d2e32',
      description:
        'Led frontend development across 5 major apps in a multi-vendor SaaS platform for restaurants. Translated Figma/XD to responsive UIs, integrated i18n, improved performance, and spearheaded API integrations.',
      points: [
        'Architected a scalable state management solution, reducing bug reports by 30%.',
        'Improved initial load times by 45% through code splitting and lazy loading.',
        'Mentored junior developers, improving team-wide code quality and best practices.',
      ],
      tags: ['Angular', 'Flutter', 'Ionic', 'Typescript'],
      isCurrent: false,
      location: 'Paris, France',
      locationType: 'Remote' as const,
      countryCode: 'fr',
      teamSize: '8-10 Engineers',
    },
    {
      date: 'Jul 2023 – Oct 2023',
      title: 'Full-stack Developer',
      company: 'Paragon Logics',
      companyUrl: 'https://paragonlogics.com/',
      logoUrl: 'https://avatar.vercel.sh/paragon.svg?text=PL&color=white&background=%232d2e32',
      description:
        'Delivered web and mobile solutions including a full-featured Buy & Sell app using Flutter and Node.js. Handled backend logic, UI flow, and integrated MongoDB database.',
      points: [
        'Solely developed a B2C marketplace app, achieving 10,000+ downloads in 3 months.',
        'Designed and implemented a real-time chat feature using WebSockets.',
        'Deployed the application on AWS using Docker and Nginx.',
      ],
      tags: ['Angular', 'Flutter', 'Node', 'Mysql'],
      isCurrent: false,
      location: 'Lahore, Pakistan',
      locationType: 'Onsite' as const,
      countryCode: 'pk',
      teamSize: '4-5 Engineers',
    },
    {
      date: 'Jan 2020 – Mar 2022',
      title: 'Mean Stack Developer',
      company: 'Coliseum Soft',
      companyUrl: '#',
      logoUrl: 'https://avatar.vercel.sh/coliseum.svg?text=CS&color=white&background=%232d2e32',
      description:
        'Worked on full-stack development for SaaS products. Delivered responsive Angular-based frontends and Node.js backends, gaining hands-on experience with MongoDB and REST APIs.',
      points: [
        'Contributed to a major refactor of a monolithic backend to a microservices architecture.',
        'Built and maintained a component library that was adopted across 5 company projects.',
        'Optimized database queries, reducing average response time by 200ms.',
      ],
      tags: ['Angular', 'Node', 'Mongodb'],
      isCurrent: false,
      location: 'Lahore, Pakistan',
      locationType: 'Onsite' as const,
      countryCode: 'pk',
      teamSize: '3-4 Engineers',
    },
    {
      date: 'Jan 2018 – Dec 2019',
      title: 'Freelancer',
      company: 'Fiverr, Upwork',
      companyUrl: '#',
      logoUrl: 'https://avatar.vercel.sh/freelance.svg?text=F&color=white&background=%232d2e32',
      description:
        'Worked independently on various mobile and web projects. Specialized in frontend development, API integration, and scalable architecture, delivering custom solutions across industries.',
      points: [
        'Successfully delivered over 20 projects for international clients.',
        'Maintained a 100% job success score on Upwork over 3 years.',
        'Specialized in turning complex business requirements into elegant, functional applications.',
      ],
      tags: ['Angular', 'Flutter', 'Ionic', 'Node', 'MongoDB'],
      isCurrent: false,
      location: 'Global',
      locationType: 'Remote' as const,
      countryCode: 'un',
      teamSize: 'Solo',
    },
  ];

  private processExperienceData(): Experience[] {
    const dataWithDates = this.rawExperienceData.map((item) => {
      let startDate = '';
      let endDate = '';

      if (item.date.includes('–')) {
        const parts = item.date.split('–').map((p) => p.trim());
        const start = new Date(parts[0]);
        const end = parts[1].toLowerCase() === 'present' ? 'Present' : new Date(parts[1]);

        if (!isNaN(start.getTime())) {
          startDate = start.toISOString().split('T')[0];
        }
        if (end !== 'Present' && typeof end !== 'string' && !isNaN(end.getTime())) {
          endDate = end.toISOString().split('T')[0];
        } else {
          endDate = 'Present';
        }
      }

      return { ...item, startDate, endDate };
    });

    return dataWithDates;
  }

  calculateDuration(startDateStr: string, endDateStr: string): string {
    if (!startDateStr) return '';
    const start = new Date(startDateStr);
    const end = endDateStr === 'Present' ? new Date() : new Date(endDateStr);

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }

    if (end.getDate() < start.getDate()) {
      months--;
      if (months < 0) {
        years--;
        months = 11;
      }
    }

    let resultText = '';
    if (years > 0) {
      resultText += `${years} Year${years > 1 ? 's' : ''}`;
    }
    if (months > 0) {
      if (resultText) resultText += ' ';
      resultText += `${months} Month${months > 1 ? 's' : ''}`;
    }
    if (resultText === '') resultText = 'Less than a month';
    return resultText;
  }

  startProjectCountUpAnimation() {
    const final = this.completedProjects;
    const duration = 1500; // ms
    const frameRate = 60; // fps
    const totalFrames = duration / (1000 / frameRate);
    const increment = final / totalFrames;
    let currentCount = 0;

    const animate = () => {
      currentCount += increment;
      if (currentCount >= final) {
        this.displayedProjects.set(final);
        return;
      }
      this.displayedProjects.set(Math.floor(currentCount));
      requestAnimationFrame(animate);
    };

    animate();
  }

  techStack = signal({
    frontend: [
      {
        name: 'Angular',
        imageUrl:
          'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/angular/angular-original.svg',
      },
      {
        name: 'Flutter',
        imageUrl:
          'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flutter/flutter-original.svg',
      },
      {
        name: 'TypeScript',
        imageUrl:
          'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg',
      },
      {
        name: 'Tailwind CSS',
        imageUrl:
          'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg',
      },
    ],
    backend: [
      {
        name: 'Node.js',
        imageUrl:
          'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original-wordmark.svg',
      },
      {
        name: 'NestJS',
        imageUrl:
          'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nestjs/nestjs-original.svg',
      },
      {
        name: 'Express',
        imageUrl:
          'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg',
      },
      {
        name: 'MongoDB',
        imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
      },
      {
        name: 'Firebase',
        imageUrl:
          'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg',
      },
    ],
    tools: [
      {
        name: 'Git / GitHub',
        imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg',
      },
      {
        name: 'Docker',
        imageUrl:
          'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg',
      },
      {
        name: 'Jira',
        imageUrl:
          'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jira/jira-original.svg',
      },
    ],
  });

  projects = signal<Project[]>([
    {
      title: 'Sittap',
      type: 'SaaS',
      status: 'LIVE',
      statusClass: 'text-primary border-primary/30',
      description:
        'Multi-vendor restaurant SaaS — 5 connected apps, NFC staff check-ins, real-time KDS, customer pickup, all multilingual.',
      imageUrl: './assets/images/projects/sittap/sittap.png',
      tech: [
        { name: 'Angular', icon: 'data_object' },
        { name: 'Flutter', icon: 'phone_iphone' },
        { name: 'Ionic', icon: 'phone_android' },
        { name: 'Node.js', icon: 'dns' },
      ],
      links: [{ name: 'VISIT LIVE', icon: 'open_in_new', url: 'https://sittap.com' }],
      videoUrl: '9ScjxHw93ww',
      subTitle: 'All-in-One Restaurant Operations Platform — 5 Apps, 5+ Languages',
      myRole:
        'Led frontend architecture across 5 interconnected web/mobile apps using Angular, Flutter, and Ionic. Translated UI/UX from Figma to pixel-perfect, multilingual interfaces. Integrated NFC-based session handling, KDS, and dynamic reel-based menus. Built reusable modules, structured a scalable folder hierarchy, and streamlined API handling with RxJS and interceptors.',
      problem:
        'Restaurants were struggling with inefficient workflows, fragmented systems for ordering, and high staff turnover driven by complex tools.',
      constraints: [
        'Multi-vendor SaaS platform with complex tenancy.',
        'Low-latency requirements for Kitchen Display Systems (KDS).',
        'NFC integration for secure staff check-ins.',
        'Needed to support 5+ languages.',
      ],
      whatYouShipped: [
        'A unified Angular dashboard for restaurant managers.',
        'A cross-platform Flutter app for waiters with NFC login.',
        'A real-time Kanban-style KDS for kitchen staff.',
        'A customer-facing pickup app with order tracking.',
        'Reusable component library shared across 5 applications.',
      ],
      impact: [
        '30% fewer bug reports after introducing a normalized state-management pattern.',
        'Initial load time cut from 4.8s to 2.1s via code-splitting and lazy-loaded modules.',
        '50% faster waiter onboarding thanks to the intuitive mobile UI.',
        'Enabled franchise expansion with a scalable multi-restaurant architecture.',
      ],
    },
    {
      title: 'LoyaltyTap',
      type: 'SaaS',
      status: 'OWNED · LIVE',
      statusClass: 'text-primary border-primary/30',
      description:
        'Owned multi-tenant loyalty SaaS. QR/NFC visit scans, tiered rewards, branded storefronts, billing, and a super-admin control plane.',
      imageUrl: './assets/images/projects/loyalty-tap/loyalty-tap.png',
      tech: [
        { name: 'Angular 21', icon: 'data_object' },
        { name: 'Node.js', icon: 'dns' },
        { name: 'MongoDB', icon: 'database' },
      ],
      links: [
        {
          name: 'VISIT LIVE',
          icon: 'open_in_new',
          url: 'https://loyalty-tap.buildwithimran.online',
        },
      ],
      videoUrl: '',
      subTitle: 'Multi-tenant Loyalty & Rewards SaaS — Owned Product',
      myRole:
        'Solo full-stack owner. Architected a modular Angular 21 app (standalone components, lazy-loaded feature routes, route guards, HTTP auth interceptor, i18n, SEO) split across merchant, customer, super-admin, visit, and public surfaces. Designed and built the Express + Mongoose API as domain modules (merchant, customer, super-admin, subscription, public-site) with JWT auth, TOTP-based 2FA, Cloudinary uploads, Google Sign-In, and background cron jobs for account deletion, subscription reminders, and scan-claim expiry. Deployed on AWS Amplify + Firebase Hosting.',
      problem:
        'Independent merchants needed a low-friction loyalty program they could run from a single QR / NFC tap — with rewards, tiered customer levels, and a control plane to operate the business — without paying for a heavy POS suite.',
      constraints: [
        'Multi-tenant data model: every entity scoped per merchant with hard isolation.',
        'Two distinct frontends (merchant admin + customer storefront) sharing one API.',
        'Strict security posture: helmet, rate limiting, XSS / NoSQL sanitization, JWT + 2FA, CORS allow-list in production.',
        'Time-bound rewards and scans requiring scheduled background jobs that survive restarts.',
        'Solo build — required clear domain boundaries to stay maintainable.',
      ],
      whatYouShipped: [
        'Merchant dashboard: shops, levels, rewards, announcements, customers, claims, billing, website builder.',
        'Customer storefront and portal with QR-scan visits, points, rewards redemption, and notifications.',
        'Super-admin control plane: merchant management, subscription packages, billing oversight.',
        'Visit flow: short-link QR resolves to a public scan page that mints visit tokens and updates points in real time.',
        'Cron services: auto-delete inactive accounts, subscription reminders, scan-claim expiry.',
        'AWS Amplify build pipeline injecting runtime config (API URL, Google client ID) into the SPA.',
      ],
      impact: [
        'Replaced manual loyalty workflows with self-serve SaaS — merchants onboard, configure rewards, and go live without engineering support.',
        'Multi-tenant architecture lets a single deployment serve unlimited merchants, each with isolated data and branded storefronts.',
        'Background jobs eliminate ops toil for expiry and reminders that previously required manual intervention.',
        'Strict per-module domain boundaries kept the codebase shippable as a solo developer over many feature waves.',
      ],
    },
    {
      title: 'JDrive',
      type: 'SaaS',
      status: 'OWNED · LIVE',
      statusClass: 'text-primary border-primary/30',
      description:
        'Owned cloud file-vault SaaS. Tiered plans, server-enforced quotas, share-link controls, workspace roles, and a branded client portal.',
      imageUrl: './assets/images/projects/jdrive/jdrive.png',
      tech: [
        { name: 'Angular 21', icon: 'data_object' },
        { name: 'NestJS', icon: 'dns' },
        { name: 'MongoDB', icon: 'database' },
        { name: 'Cloudinary', icon: 'cloud_upload' },
        { name: 'AWS Amplify', icon: 'cloud' },
      ],
      links: [
        {
          name: 'VISIT LIVE',
          icon: 'open_in_new',
          url: 'https://jdrive.buildwithimran.online',
        },
      ],
      videoUrl: '',
      subTitle: 'Cloud File Vault & Client Portal — Tiered SaaS',
      myRole:
        'Solo full-stack owner. Built the Angular 21 frontend (standalone components, lazy-loaded routes, Tailwind 4) and the NestJS backend with Mongoose, JWT + 2FA (TOTP via otplib), Argon2 password hashing, Cloudinary uploads, Helmet, and structured Pino logging. Designed the workspace + role model (owner / admin / member / viewer), tiered storage plans, share links with expiry, and audit logs.',
      problem:
        'Individuals and small teams needed a trusted file vault that handles secure sharing, storage limits, and client delivery without the bloat of enterprise suites — and at clear, predictable pricing.',
      constraints: [
        'Per-user storage quotas enforced server-side across plan tiers.',
        'Share links must support password protection, expiry, and revocation.',
        'Workspace roles with strict authorization at every API boundary.',
        'Argon2 hashing + TOTP 2FA for production-grade auth.',
      ],
      whatYouShipped: [
        'File operations: upload, download, rename, move, delete, restore, version history.',
        'Tiered plans (Starter / Pro / Business) with storage quotas and feature gating.',
        'Secure share links with passwords, expiry, and per-link download controls.',
        'Workspace accounts with owner / admin / member / viewer roles and team folders.',
        'Branded client portal with upload-request links and access history.',
        'Admin: user management, storage control, audit logs, billing invoices.',
      ],
      impact: [
        'Single-deploy SaaS serves individuals through small-team workspaces from one codebase.',
        'Plan gating and quota enforcement happen server-side — no client trust required.',
        'TOTP 2FA + Argon2 + Helmet gives the auth stack a production-grade security floor.',
        'Pino-backed structured logging makes incident triage and audit review fast.',
      ],
    },
    {
      title: 'Nexa',
      type: 'SaaS',
      status: 'OWNED · LIVE',
      statusClass: 'text-primary border-primary/30',
      description:
        'Owned real-time group messaging app. Persistent socket layer, invite-only spaces, and a JWT handshake that auths both REST and Socket.io.',
      imageUrl: './assets/images/projects/nexa/nexa.png',
      tech: [
        { name: 'Angular 21', icon: 'data_object' },
        { name: 'Node.js', icon: 'dns' },
        { name: 'MongoDB', icon: 'database' },
        { name: 'Socket.io', icon: 'bolt' },
        { name: 'Cloudinary', icon: 'cloud_upload' },
      ],
      links: [
        {
          name: 'VISIT LIVE',
          icon: 'open_in_new',
          url: 'https://www.nexa-solution.online',
        },
      ],
      videoUrl: '',
      subTitle: 'Real-Time Group Communication — Conversations, Invites, Shared Spaces',
      myRole:
        'Solo full-stack owner. Built the Angular 21 frontend (standalone components, Tailwind 4, socket.io-client) and the Express + Mongoose backend with JWT auth, Google Sign-In, Cloudinary uploads, Multer, and a Socket.io layer for real-time conversation events. Designed the auth, conversations, and invites domains with clean route boundaries.',
      problem:
        'Small groups needed a focused real-time communication space with invite control and shared media — without the noise and lock-in of mainstream messaging platforms.',
      constraints: [
        'Real-time message delivery and presence with reconnection handling.',
        'Invite-only group access with role boundaries and revocation.',
        'Media uploads routed through Cloudinary with size and type validation.',
        'JWT-protected REST + Socket.io auth handshake on every connection.',
      ],
      whatYouShipped: [
        'Real-time conversation engine over Socket.io with reliable reconnection.',
        'Invite system: token-based group joins with revocation and expiry.',
        'Google Sign-In + email/password auth, with JWT issued for both REST and socket.',
        'Cloudinary-backed media uploads with server-side validation.',
        'Frontend split into auth, dashboard, and settings feature modules.',
      ],
      impact: [
        'Single deployment serves AWS Amplify (web) and Firebase Hosting (mirror) from the same build.',
        'Socket.io handshake reuses the JWT layer — no separate session store needed.',
        'Feature-based Angular structure keeps real-time, auth, and settings concerns isolated.',
        'Backend stays lean (~3 route domains) so iteration on the real-time layer is fast.',
      ],
    },
    {
      title: 'TubeAi',
      type: 'AI SaaS',
      status: 'OWNED · IN BUILD',
      statusClass: 'text-accent-amber border-accent-amber/40',
      description:
        'AI study companion for YouTube. Pulls transcripts, generates flashcards and review courses with Gemini, and gates usage by plan tier.',
      imageUrl: './assets/images/projects/tubeai/tubeai.png',
      tech: [
        { name: 'Angular 21', icon: 'data_object' },
        { name: 'NestJS', icon: 'dns' },
        { name: 'BullMQ', icon: 'memory' },
        { name: 'Redis', icon: 'bolt' },
        { name: 'Gemini', icon: 'auto_awesome' },
      ],
      links: [],
      videoUrl: '',
      subTitle: 'AI Learning SaaS — YouTube Transcripts to Flashcards',
      myRole:
        'Solo full-stack owner. Built the Angular 21 frontend (standalone components, Tailwind 4, marked, jsPDF) and the NestJS 11 backend with BullMQ + Redis-backed AI generation, Google Gemini integration, multi-tier subscription enforcement, and per-plan rate limits.',
      problem:
        'Self-directed learners want structured notes and flashcards from YouTube lectures, but extracting transcripts and turning them into study material is manual, slow, and easy to abandon.',
      constraints: [
        'AI generation is expensive — gated behind subscription tiers and per-plan quotas.',
        'YouTube transcript fetching is rate-limited and brittle — needs retries and a queue.',
        'Long-running jobs must not block the request thread.',
        'Free tier caps must enforce reliably across restarts.',
      ],
      whatYouShipped: [
        'Transcript pipeline using youtubei.js + youtube-transcript with fallback handling.',
        'BullMQ workers on Redis for async Gemini calls (free plan: 3 videos/day, 15 generations/day).',
        'Subscription module (Free / Pro / Premium) with server-enforced plan gates.',
        'Flashcard, course, and review-card generation against Gemini 2.0/2.5 models.',
        'PDF + Markdown export via jsPDF and marked + dompurify.',
        'Admin panel for content, plans, and user management.',
      ],
      impact: [
        'Async pipeline keeps the request thread free — UI stays responsive under load.',
        'Plan-tier enforcement is server-side, with usage tracked per-user across sessions.',
        'Redis-backed queue survives restarts; failed jobs retry with backoff.',
        'Modular NestJS architecture isolates auth, AI generation, billing, and content.',
      ],
    },
    {
      title: 'Zelo',
      type: 'Marketplace',
      status: 'OWNED · IN BUILD',
      statusClass: 'text-accent-amber border-accent-amber/40',
      description:
        'Hyperlocal marketplace and delivery platform — live chat, map-based discovery, real-time order tracking, and a 16-module backend.',
      imageUrl: './assets/images/projects/zelo/zelo.png',
      tech: [
        { name: 'Angular 21', icon: 'data_object' },
        { name: 'NestJS', icon: 'dns' },
        { name: 'Socket.io', icon: 'bolt' },
        { name: 'BullMQ', icon: 'memory' },
        { name: 'Leaflet', icon: 'map' },
      ],
      links: [],
      videoUrl: '',
      subTitle: 'Hyperlocal Marketplace — Real-Time Discovery, Chat, and Orders',
      myRole:
        'Solo full-stack owner. Built the Angular 21 frontend with Leaflet maps + marker clustering, socket.io-client, and a complete admin / landing / auth / subscription surface. Backend is NestJS 11 with 16+ feature modules, Zod validation, BullMQ workers on Redis, Swagger docs, and Terminus health checks.',
      problem:
        'Local merchants and customers need a single place to discover nearby stores, chat in real time, and track orders — without the lock-in of a national platform.',
      constraints: [
        'Geospatial queries (nearby stores, delivery zones) must stay fast as data grows.',
        'Real-time chat and order tracking demand a reliable socket layer with reconnection.',
        'Role-based access across customers, merchants, and admins on every API boundary.',
        'Operational features (banners, coupons, announcements) need to ship without backend churn.',
      ],
      whatYouShipped: [
        'Domains: stores, products, orders, reviews, coupons, banners, announcements, bookings, services.',
        'WebSocket layer (Socket.io) for live chat and order events.',
        'Leaflet-based store discovery with marker clustering.',
        'BullMQ workers on Redis for async tasks (notifications, async writes).',
        'Multi-role RBAC with JWT + guards, Helmet, compression, and rate limits.',
        'Swagger/OpenAPI docs, Terminus health checks, audit logging.',
      ],
      impact: [
        'Backend split across 16+ feature modules — every domain has clean boundaries.',
        'Zod-validated DTOs reject malformed payloads at the gateway, not deep in services.',
        'Redis-backed queue absorbs spikes (chat fanout, order webhooks) without blocking writes.',
        'Health endpoints + structured logging make uptime monitoring trivial to wire up.',
      ],
    },
    {
      title: 'DocPilot AI',
      type: 'Collab Tool',
      status: 'OWNED · IN BUILD',
      statusClass: 'text-accent-amber border-accent-amber/40',
      description:
        'Real-time collaborative document workspace. CRDT-backed co-editing, rich text via Tiptap, and an AI roadmap built on a horizontally-scalable spine.',
      imageUrl: './assets/images/projects/docpilot-ai/docpilot-ai.png',
      tech: [
        { name: 'Angular 21', icon: 'data_object' },
        { name: 'NestJS', icon: 'dns' },
        { name: 'Yjs CRDT', icon: 'sync' },
        { name: 'Hocuspocus', icon: 'bolt' },
        { name: 'Tiptap', icon: 'edit_note' },
      ],
      links: [],
      videoUrl: '',
      subTitle: 'Real-Time Document Workspace — CRDT Co-Editing + AI Roadmap',
      myRole:
        'Solo full-stack owner. Built the Angular 21 + Tiptap editor with Yjs CRDT and @hocuspocus/provider for live presence and conflict-free merge. Backend is NestJS 11 with Hocuspocus server, JWT auth (rotating hashed refresh tokens), Mongoose persistence, and a Docker Compose stack (Redis, Mailpit, MinIO).',
      problem:
        'Teams need a focused document workspace with real co-editing — without the bloat or lock-in of suite-style tools. The CRDT plumbing is non-trivial and usually skipped.',
      constraints: [
        'CRDT sync must be conflict-free across concurrent edits and reconnections.',
        'Editor state, presence, and persistence must stay consistent across sockets and REST.',
        'Auth has to work for both REST endpoints and the Hocuspocus WebSocket layer.',
        'Architecture must scale horizontally — stateless API + Redis pub/sub for socket fanout.',
      ],
      whatYouShipped: [
        'Tiptap editor with Yjs CRDT, Hocuspocus sync protocol, and presence/awareness.',
        'Debounced auto-save with live save indicator.',
        'Document CRUD, soft-delete (trash), starred and recent views, search.',
        'JWT auth with rotating, hashed refresh tokens.',
        'Phased architecture for AI features (rewrite, summarize, command parsing) and voice control.',
        'Docker Compose dev environment: Redis, Mailpit, MinIO.',
      ],
      impact: [
        'CRDT-first design means edits never collide — no manual merge UI needed.',
        'Stateless API + Redis pub/sub lets the socket layer scale horizontally from day one.',
        'Rotating refresh tokens hashed at rest — production-grade auth posture from MVP.',
        'Phased roadmap keeps the codebase shippable while AI surface lands incrementally.',
      ],
    },
    {
      title: 'AmanTag',
      type: 'SaaS',
      status: 'OWNED · IN BUILD',
      statusClass: 'text-accent-amber border-accent-amber/40',
      description:
        'QR-coded emergency profile registry. A scan surfaces medical, identity, and emergency contact data through a public bridge token — no app install required.',
      imageUrl: './assets/images/projects/aman-tag/aman-tag.png',
      tech: [
        { name: 'Angular 21', icon: 'data_object' },
        { name: 'NestJS', icon: 'dns' },
        { name: 'MongoDB', icon: 'database' },
        { name: 'JWT', icon: 'shield_lock' },
        { name: 'Cloudinary', icon: 'cloud_upload' },
      ],
      links: [],
      videoUrl: '',
      subTitle: 'Emergency Profile Registry — QR-Coded, Bridge-Token Access',
      myRole:
        'Solo full-stack owner. Built the Angular 21 + Tailwind 4 frontend and the NestJS 11 backend with MongoDB/Mongoose, JWT (access + refresh), Google OAuth, Cloudinary uploads, throttled auth endpoints, and event-driven email flows.',
      problem:
        'In an emergency, responders rarely have time to unlock a phone or hunt for contacts. People need a fast, no-install way to expose critical health and identity info to a first responder — without giving up everyday privacy.',
      constraints: [
        'Public scan flow must work without an account or app install.',
        'Bridge tokens have to expose just enough data — not the full profile.',
        'Email verification + password reset windows: 15–60 min TTL.',
        'Auth surface must throttle aggressively (5 login attempts, 3 forgot-password tries).',
      ],
      whatYouShipped: [
        'QR-coded emergency profiles with public bridge tokens for anonymous responder access.',
        'JWT auth with access + refresh, Google OAuth, bcryptjs, Passport guards.',
        'Phone validation via libphonenumber-js; image uploads via Cloudinary.',
        'Event-driven email flows (verification, password reset) over Nodemailer.',
        'Admin panel for profile and notification management.',
        'Throttled auth endpoints to mitigate brute force.',
      ],
      impact: [
        'Bridge-token model exposes only emergency-safe fields — full profile stays private.',
        'EventEmitterModule keeps auth flows reactive without coupling controllers to mail.',
        'Per-endpoint throttling makes the auth surface safe to expose publicly.',
        'Mongoose schema isolation per domain keeps profile / contacts / admin separable.',
      ],
    },
  ]);

  projectFilters = ['All', 'SaaS', 'AI SaaS', 'Marketplace', 'Collab Tool'];
  activeProjectFilter = signal('All');

  filteredProjects = computed(() => {
    const filter = this.activeProjectFilter();
    if (filter === 'All') {
      return this.projects();
    }
    return this.projects().filter((p) => p.type === filter);
  });

  impactMetrics = signal([
    {
      value: '30%',
      label: 'Fewer bug reports',
      context: 'After normalizing state across 5 apps in the Sittap platform.',
      project: 'Sittap',
    },
    {
      value: '45%',
      label: 'Faster initial load',
      context: 'Code-splitting and lazy-loaded modules — 4.8s down to 2.1s.',
      project: 'Sittap',
    },
    {
      value: '10K+',
      label: 'Downloads in 90 days',
      context: 'Solo-built Buy & Sell marketplace — Flutter front end, Node API, AWS deploy.',
      project: 'Paragon Logics',
    },
    {
      value: '8+',
      label: 'Shipped products',
      context: 'Owned SaaS and client builds — live in production or under active development.',
      project: 'buildwithimran.online',
    },
  ]);

  packages = signal([
    {
      title: 'Production MVP Build',
      price: 'Scope a Project',
      description:
        'Take an idea to a live, multi-tenant product. Auth, data model, core feature, and cloud deploy — production-shaped from day one.',
      deliverables: [
        'Auth: JWT, Google Sign-In, optional TOTP 2FA',
        'Multi-tenant data model with isolation',
        'Angular front end + Node/NestJS API',
        'Deployed on AWS, EC2, or Hostinger',
      ],
      timeline: '4–6 weeks',
    },
    {
      title: 'Backend & Worker Layer',
      price: 'Scope a Project',
      description:
        'The infrastructure most teams skip until it breaks: queues, workers, schedulers, and structured logging — added to your existing stack.',
      deliverables: [
        'BullMQ queues on Redis with retries and DLQ',
        'Worker threads for CPU-bound jobs',
        'Cron services that survive restarts',
        'Pino-backed structured logging',
      ],
      timeline: '2–4 weeks',
    },
    {
      title: 'Cloud Deploy & Hardening',
      price: 'Scope a Project',
      description:
        'Take a working app from your laptop to a hardened production deploy — CI/CD, runtime config, secrets, and uptime patterns wired in.',
      deliverables: [
        'AWS Amplify or EC2 provisioning',
        'CI/CD pipeline with runtime config injection',
        'Helmet, rate limiting, sanitization, CORS',
        'Argon2 hashing + 2FA where it matters',
      ],
      timeline: '1–3 weeks',
    },
  ]);

  // Backend / Cloud architecture systems — real production experience
  backendSystems = signal([
    {
      group: 'Cloud & Hosting',
      tone: 'primary',
      icon: 'cloud',
      items: [
        { name: 'AWS', detail: 'Amplify · S3 · IAM', code: 'AWS' },
        { name: 'EC2', detail: 'VM provisioning · SSH', code: 'EC2' },
        { name: 'Hostinger', detail: 'VPS · Domain · DNS', code: 'HST' },
        { name: 'Firebase Hosting', detail: 'Static mirror · SSL', code: 'FBH' },
      ],
    },
    {
      group: 'Queues & Workers',
      tone: 'cyan',
      icon: 'memory',
      items: [
        { name: 'BullMQ', detail: 'Job queues · retries · DLQ', code: 'BQ' },
        { name: 'Redis', detail: 'Cache · pub/sub · locks', code: 'RDS' },
        { name: 'Worker Threads', detail: 'CPU-bound parallelism', code: 'WT' },
        { name: 'Cron Services', detail: 'Scheduled background jobs', code: 'CRN' },
      ],
    },
    {
      group: 'Backend Runtime',
      tone: 'amber',
      icon: 'dns',
      items: [
        { name: 'Node.js', detail: 'REST · WebSockets · streams', code: 'NJS' },
        { name: 'NestJS', detail: 'Modular · DI · guards', code: 'NST' },
        { name: 'Express', detail: 'Middleware · routing', code: 'EXP' },
        { name: 'MongoDB', detail: 'Mongoose · aggregation', code: 'MGO' },
      ],
    },
  ]);

  // What runs in production — concrete proof points, not adjectives
  systemStats = signal([
    {
      label: 'Auth posture',
      value: 'JWT · TOTP 2FA · Argon2',
      icon: 'shield_lock',
    },
    {
      label: 'Multi-tenant isolation',
      value: 'Per-merchant data scoping',
      icon: 'view_quilt',
    },
    {
      label: 'Background workers',
      value: 'BullMQ · Redis · cron services',
      icon: 'schedule',
    },
    {
      label: 'Real-time layer',
      value: 'Socket.io reusing JWT handshake',
      icon: 'bolt',
    },
  ]);

  // Work process — repeatable spine for every build
  workProcess = signal([
    {
      step: '01',
      title: 'Map the system',
      detail:
        'Data model and domain boundaries first — before a single screen. Decide what is multi-tenant, what is shared, and where state lives.',
    },
    {
      step: '02',
      title: 'Ship the spine',
      detail:
        'Auth, persistence, and one end-to-end flow up first — production-shaped, not a prototype. Everything else hangs off this skeleton.',
    },
    {
      step: '03',
      title: 'Build in modules',
      detail:
        'Each feature is a self-contained slice — route, store, API surface. Boundaries stay clean so the codebase scales past one engineer.',
    },
    {
      step: '04',
      title: 'Harden the worker layer',
      detail:
        'Move expensive or scheduled work off the request path — BullMQ jobs, Redis-backed locks, cron services that survive restarts.',
    },
    {
      step: '05',
      title: 'Deploy with intent',
      detail:
        'AWS Amplify, EC2, or Hostinger — picked for the workload. CI/CD wired in, runtime config injected at build, secrets out of the repo.',
    },
    {
      step: '06',
      title: 'Watch, fix, iterate',
      detail:
        'Structured Pino logging, real telemetry, short feedback loops. Production is where the work starts — not where it ends.',
    },
  ]);

  // Marquee ticker labels — tech I run in real systems
  tickerItems = signal([
    'AWS Amplify',
    'EC2',
    'Hostinger VPS',
    'Redis',
    'BullMQ',
    'Worker Threads',
    'Socket.io',
    'Node.js',
    'NestJS',
    'MongoDB',
    'Angular 21',
    'JWT · TOTP 2FA',
    'Pino Logging',
    'Cloudinary',
    'Firebase Hosting',
    'Cron Services',
  ]);

  setProjectFilter(filter: string) {
    this.activeProjectFilter.set(filter);
  }

  onWindowScroll(): void {
    const yOffset = window.scrollY;
    const show = yOffset > window.innerHeight / 2;
    this.showScrollToTop.set(show);

    // Subtle parallax on hero photo — only while hero is on screen
    if (yOffset < window.innerHeight) {
      this.heroPhotoOffset.set(yOffset * 0.08);
    }
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  async toggleAudio(): Promise<void> {
    const player = this.audioEl;
    if (!player || this.isTogglingAudio()) return;

    this.isTogglingAudio.set(true);

    try {
      if (player.paused) {
        player.muted = false;
        player.currentTime = player.currentTime || 0;
        await player.play();
      } else {
        player.pause();
      }
    } catch (err) {
      console.error('Audio playback error:', err);
    } finally {
      this.isTogglingAudio.set(false);
    }
  }

  downloadResume() {
    this.showResumeToast.set(true);
    setTimeout(() => this.showResumeToast.set(false), 4000);
  }

  openVideoModal(videoId: string): void {
    this.selectedVideoId.set(videoId);
  }

  closeVideoModal(): void {
    this.selectedVideoId.set(null);
  }

  openProjectModal(project: Project): void {
    this.selectedProject.set(project);
    document.body.style.overflow = 'hidden';
  }

  closeProjectModal(): void {
    this.selectedProject.set(null);
    document.body.style.overflow = '';
  }

  private get audioEl(): HTMLAudioElement | null {
    return this.audioPlayerRef?.nativeElement ?? null;
  }

  // FIX: Converted getter to a method to prevent "is not callable" errors from templates.
  // This commonly occurs if the template uses `phoneUrl()` instead of `phoneUrl`.
  // Making it a method makes the component resilient to this template error.
  phoneUrl(): string {
    return `tel:${this.phone.replace(/[ -]/g, '')}`;
  }

  onAudioEnded(): void {
    this.isAudioPlaying.set(false);
  }
}

