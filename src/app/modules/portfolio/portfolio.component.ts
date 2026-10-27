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
    '(window:resize)': 'sizeVideoPlayer()',
  },
})
export class PortfolioComponent implements AfterViewInit {
  @ViewChild('audioPlayer') audioPlayerRef!: ElementRef<HTMLAudioElement>;

  // Personal Info
  fullName = 'Muhammad Imran Arshad';
  phone = '+92-306-8444929';
  email = 'buildwithimran@gmail.com';
  domain = 'buildwithimran.pro';
  linkedInUrl = 'https://www.linkedin.com/in/buildwithimran';
  whatsAppUrl =
    'https://api.whatsapp.com/send/?phone=923068440929&text&type=phone_number&app_absent=0';
  githubUrl = 'https://github.com/buildwithimran';
  youtubeUrl = 'https://www.youtube.com/@MuhammadImran-p4w';
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

  // YouTube player size — recalculated on open/resize so it fits phones (16:9, max 864px wide).
  videoWidth = signal(864);
  videoHeight = signal(486);

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
      title: 'Dinyx',
      type: 'SaaS',
      status: 'OWNED · LIVE DEMO',
      statusClass: 'text-primary border-primary/30',
      description:
        'Owned restaurant operations platform. One NestJS API behind 7 apps: back office, POS, waiter, owner, table ordering, pickup, and customer portal.',
      imageUrl: './assets/images/projects/dinyx/dinyx.jpg',
      tech: [
        { name: 'NestJS', icon: 'dns' },
        { name: 'Angular', icon: 'data_object' },
        { name: 'Flutter', icon: 'phone_iphone' },
        { name: 'MongoDB', icon: 'database' },
        { name: 'SockJS', icon: 'bolt' },
      ],
      links: [
        {
          name: 'VISIT LIVE',
          icon: 'open_in_new',
          url: 'https://dinyx.buildwithimran.pro',
        },
      ],
      videoUrl: '',
      subTitle: 'Restaurant Operations Platform — One API, 7 Apps',
      myRole:
        'Solo owner. Wrote the NestJS 12 backend from scratch against the contract of 7 existing frontends: layered modules over abstract repositories with Mongoose, JWT auth with Argon2 and OTP verification, SockJS real-time order events, Stripe and a fake payment gateway for demo mode, PDFKit and ExcelJS exports, S3 or local media storage, Pino logging, Sentry, and Terminus health checks. One monorepo with a GitHub Actions pipeline that tests, builds and deploys the API and the web apps to EC2.',
      problem:
        'Restaurants run dine-in, pickup, staff and reporting on separate tools. Dinyx puts table ordering, the waiter flow, the POS, the owner dashboard and the customer portal on one backend.',
      constraints: [
        'Backend had to match 7 existing frontends exactly, endpoint by endpoint.',
        'Orders must reach waiters and the kitchen in real time.',
        'Demo mode must run safely in public: fake payments, console mail, local storage.',
        'Multi-restaurant data with role checks on every endpoint.',
      ],
      whatYouShipped: [
        'NestJS API: auth, restaurants, menus, tables, orders, payments, staff, reports, media.',
        'Real-time order events over SockJS for waiter and kitchen screens.',
        'Back office, table ordering, pickup and customer portal deployed as web apps.',
        'POS, waiter and owner mobile apps (Flutter / Ionic) pointed at the same API.',
        'Unit and end-to-end tests run on every push before deploy.',
      ],
      impact: [
        'One API replaced the backend the 7 apps used to depend on.',
        'Swappable drivers (payments, mail, storage) let the same build run as a public demo or in production.',
        'Monorepo pipeline deploys the API and every web app on push.',
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
          url: 'https://loyalty-tap.buildwithimran.pro',
        },
      ],
      videoUrl: 'pt5d_PdaYs8',
      subTitle: 'Multi-tenant Loyalty & Rewards SaaS — Owned Product',
      myRole:
        'Solo full-stack owner. Architected a modular Angular 21 app (standalone components, lazy-loaded feature routes, route guards, HTTP auth interceptor, i18n, SEO) split across merchant, customer, super-admin, visit, and public surfaces. Designed and built the Express + Mongoose API as domain modules (merchant, customer, super-admin, subscription, public-site) with JWT auth, TOTP-based 2FA, Cloudinary uploads, Google Sign-In, and background cron jobs for account deletion, subscription reminders, and scan-claim expiry. Frontends on Firebase Hosting; API on AWS EC2 behind nginx, deployed by GitHub Actions.',
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
        'Firebase Hosting for both SPAs with a runtime env.js (API URL, Google client ID); API on AWS EC2 behind nginx, deployed by GitHub Actions.',
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
      imageUrl: './assets/images/projects/jdrive/jdrive.jpg',
      tech: [
        { name: 'Angular 21', icon: 'data_object' },
        { name: 'NestJS', icon: 'dns' },
        { name: 'MongoDB', icon: 'database' },
        { name: 'Cloudinary', icon: 'cloud_upload' },
        { name: 'Firebase Hosting', icon: 'cloud' },
      ],
      links: [
        {
          name: 'VISIT LIVE',
          icon: 'open_in_new',
          url: 'https://jdrive.buildwithimran.pro',
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
      imageUrl: './assets/images/projects/nexa/nexa.jpg',
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
        'Web app on Firebase Hosting; API on AWS EC2 behind nginx, deployed by GitHub Actions on push.',
        'Socket.io handshake reuses the JWT layer — no separate session store needed.',
        'Feature-based Angular structure keeps real-time, auth, and settings concerns isolated.',
        'Backend stays lean (~3 route domains) so iteration on the real-time layer is fast.',
      ],
    },
    {
      title: 'VeoLMS',
      type: 'EdTech',
      status: 'OWNED · LIVE',
      statusClass: 'text-primary border-primary/30',
      description:
        'Owned community-first LMS. HLS video lessons, live workshops, course group chat, semantic search, AI tutor, and verified certificates.',
      imageUrl: './assets/images/projects/veolms/veolms.jpg',
      tech: [
        { name: 'Angular 21 SSR', icon: 'data_object' },
        { name: 'NestJS', icon: 'dns' },
        { name: 'MongoDB', icon: 'database' },
        { name: 'BullMQ', icon: 'memory' },
        { name: 'Socket.io', icon: 'bolt' },
      ],
      links: [
        {
          name: 'VISIT LIVE',
          icon: 'open_in_new',
          url: 'https://veolms.buildwithimran.pro',
        },
      ],
      videoUrl: 'slFdr3aJCpg',
      subTitle: 'Community-First Learning Platform — Courses, Workshops, AI Tutor',
      myRole:
        'Solo full-stack owner. Built the Angular 21 frontend with SSR, a service worker, hls.js playback, Chart.js dashboards, and socket.io-client, split into student, teacher, admin, community, workshops, and payment features. Designed the NestJS 11 backend as 30+ domain modules with Mongoose, JWT + Google OAuth, BullMQ queues on Redis (email, campaigns) with Bull Board, Redis-backed throttling, Socket.io messaging, ffmpeg HLS transcoding, Stripe payments and payouts, PDFKit certificates, Sentry, and Swagger docs.',
      problem:
        'Online courses are usually a lonely playlist — learners drop off without peers, live sessions, or help when they get stuck. Creators also need payments, payouts, and moderation without stitching five tools together.',
      constraints: [
        'Video must stream adaptively on slow connections — no raw MP4 downloads.',
        'Three roles (student, teacher, admin) with strict authorization on every endpoint.',
        'Search must find courses by meaning, not just keywords.',
        'AI tutor must work across providers without exposing API keys in the database.',
        'Email campaigns and notifications must never block the request path.',
      ],
      whatYouShipped: [
        'Course builder: sections, lessons, quizzes, progress tracking, reviews, and wishlist.',
        'ffmpeg pipeline that transcodes uploads to HLS, played back with hls.js.',
        'Per-course community: group chat over Socket.io, course feed, and live workshops.',
        'Semantic search using MiniLM embeddings (@xenova/transformers) running in-process.',
        'AI tutor with pluggable providers (Groq, Gemini, OpenAI, Claude) and encrypted keys at rest.',
        'Stripe checkout, coupons, multi-currency pricing, teacher payouts, and refund claims.',
        'PDF certificates on completion, BullMQ email and campaign queues, newsletter, and moderation tools.',
      ],
      impact: [
        'HLS streaming keeps lessons playable on weak connections instead of stalling on full-file downloads.',
        'Embedding search runs in-process — no paid vector database needed to ship semantic search.',
        'Queue-backed email and campaigns keep API latency flat during bulk sends.',
        '30+ isolated NestJS modules let teacher, payment, and community features ship independently.',
      ],
    },
    {
      title: 'OpenRole',
      type: 'AI SaaS',
      status: 'OWNED · LIVE',
      statusClass: 'text-primary border-primary/30',
      description:
        'Owned job search engine. Saved searches crawl job sources on a schedule, every role is scored against your resumes, and the shortlist lands in your inbox.',
      imageUrl: './assets/images/projects/openrole/openrole.jpg',
      tech: [
        { name: 'Next.js 16', icon: 'web' },
        { name: 'NestJS 12', icon: 'dns' },
        { name: 'MongoDB', icon: 'database' },
        { name: 'BullMQ', icon: 'memory' },
        { name: 'Playwright', icon: 'smart_toy' },
      ],
      links: [
        {
          name: 'VISIT LIVE',
          icon: 'open_in_new',
          url: 'https://openrole.buildwithimran.pro',
        },
      ],
      videoUrl: '',
      subTitle: 'Personal Job Search Engine — Scheduled Crawls, Resume Scoring, Email Shortlists',
      myRole:
        'Solo full-stack owner. Built the Next.js 16 + React 19 frontend (TanStack Query, Table and Virtual, React Hook Form + Zod) and a NestJS 12 API plus a separate worker on BullMQ and Redis for crawling, scoring, emails and auto apply. Auth uses short-lived JWTs with rotated, HMAC-hashed refresh cookies; resumes live in GridFS; job emails go out through Resend. CI runs lint, typecheck, tests, build and a dependency audit, then deploys to EC2.',
      problem:
        'Job hunting means checking the same boards every day, reading posts that do not fit, and losing track of what was applied to. OpenRole does the checking and filtering, and sends only the roles worth reading.',
      constraints: [
        'Crawls must respect each source quota and never block the API.',
        'Duplicate posts across sources must collapse into one job.',
        'Resume uploads checked by file signature with a 5 MB limit.',
        'Signup closed: built multi-user but run as a personal tool.',
      ],
      whatYouShipped: [
        'Saved searches that run on a schedule across job sources.',
        'Eligibility and match scoring of every job against each resume.',
        'Email shortlists through Resend and live updates over SSE.',
        'Playwright auto apply limited to job-board URLs, one fresh browser context each time.',
        'Audit log of sign-ins, setting changes, applications and emails.',
      ],
      impact: [
        'A daily manual search becomes one email of pre-filtered roles.',
        'Queue-based worker keeps the API fast while crawls and scoring run.',
        'Dependency audit in CI blocks deploys with high-severity advisories.',
      ],
    },
    {
      title: 'Bizora',
      type: 'E-commerce',
      status: 'OWNED · LIVE',
      statusClass: 'text-primary border-primary/30',
      description:
        'Owned fashion e-commerce store. Next.js storefront, separate admin app, and a NestJS API covering catalog, checkout, orders, returns, and procurement.',
      imageUrl: './assets/images/projects/bizora/bizora.jpg',
      tech: [
        { name: 'Next.js 16', icon: 'web' },
        { name: 'NestJS', icon: 'dns' },
        { name: 'MongoDB', icon: 'database' },
        { name: 'Stripe', icon: 'payments' },
        { name: 'Tailwind 4', icon: 'palette' },
      ],
      links: [
        {
          name: 'VISIT LIVE',
          icon: 'open_in_new',
          url: 'https://bizora.buildwithimran.online',
        },
      ],
      videoUrl: '',
      subTitle: 'Pakistani Fashion Store — Storefront, Admin, and Commerce API',
      myRole:
        'Solo full-stack owner. Built a pnpm monorepo with three apps: a Next.js 16 storefront (App Router, Server Components, Server Actions, next-intl, Zustand cart, Stripe Elements), a Next.js admin (TanStack Table, drag-and-drop sorting with dnd-kit, React Hook Form + Zod), and a NestJS 11 API on the native MongoDB driver with Argon2 auth, Zod contracts, PDFKit invoices, and Nodemailer. Enforced Conventional Commits with Husky and commitlint.',
      problem:
        'Pakistani fashion buyers wanted a proper online store — men and women collections, card checkout, and WhatsApp ordering — plus a back office to run stock, orders, and returns without marketplace fees.',
      constraints: [
        'Money stored as integer minor units in PKR — no floating-point totals anywhere.',
        'Storefront must be fast and indexable, so Server Components by default.',
        'Strict layering: UI → feature → service → repository → MongoDB.',
        'Admin and storefront deploy separately but share one API contract.',
      ],
      whatYouShipped: [
        'Storefront: collections, search, product pages, cart, Stripe checkout, and customer accounts.',
        'Admin: catalog with drag-and-drop ordering, orders, customers, coupons, promotions, and reports.',
        'API domains: catalog, checkout, orders, returns, shipping, procurement, reviews, support, audit.',
        'PDF invoices via PDFKit and transactional email via Nodemailer.',
        'Shared Zod contracts so storefront, admin, and API validate the same shapes.',
      ],
      impact: [
        'Integer minor-unit money model removes rounding errors from totals, discounts, and refunds.',
        'Server-rendered storefront keeps product pages crawlable for search.',
        'Audit and procurement modules give the owner stock and change history without spreadsheets.',
        'Monorepo with enforced commit conventions keeps three apps releasable from one repo.',
      ],
    },
    {
      title: 'TempoType',
      type: 'Web App',
      status: 'OWNED · LIVE',
      statusClass: 'text-primary border-primary/30',
      description:
        'Owned typing test with an adaptive coach. Works offline without login; optional account adds cloud sync, history, and a leaderboard.',
      imageUrl: './assets/images/projects/tempo-type/tempo-type.jpg',
      tech: [
        { name: 'Angular 21', icon: 'data_object' },
        { name: 'Express', icon: 'dns' },
        { name: 'MongoDB', icon: 'database' },
        { name: 'IndexedDB', icon: 'storage' },
        { name: 'Zod', icon: 'verified' },
      ],
      links: [
        {
          name: 'VISIT LIVE',
          icon: 'open_in_new',
          url: 'https://tempo-drill.buildwithimran.pro',
        },
      ],
      videoUrl: '',
      subTitle: 'Typing Test + Adaptive Coach — Offline-First, Sync Optional',
      myRole:
        'Solo full-stack owner. Built the Angular 21 frontend with standalone components and signals, a custom typing engine, IndexedDB local storage, and Chart.js progress charts. Backend is Express + TypeScript on the native MongoDB driver with Zod validation, Argon2 password hashing, Helmet, rate limiting, and Pino logging. API covered by Vitest + Supertest tests.',
      problem:
        'Most typing tests show a WPM number and stop there. Learners need to know which keys, patterns, and pauses slow them down — and they should not have to sign up just to practise.',
      constraints: [
        'Typing must work with no login and even with the backend down.',
        'Anonymous results, settings, and personal bests stay on the device.',
        'Keystroke timing must stay accurate — no input lag from change detection.',
        'Leaderboard scores must not trust anything the client calculates.',
      ],
      whatYouShipped: [
        'Typing test with time, words, quote, and zen modes plus punctuation and numbers.',
        'Adaptive coach that finds weak keys, patterns, pauses, and recovery problems.',
        'Results and progress pages with Chart.js history.',
        'Optional account with cloud sync, multi-device history, and leaderboard.',
        'Settings, themes, and accessibility options.',
      ],
      impact: [
        'Offline-first design keeps the core test usable even during API downtime.',
        'Login is optional, so first-time visitors start typing immediately.',
        'WPM and accuracy are recalculated server-side from raw keystroke totals — client-sent scores are ignored and impossible character rates are rejected.',
        'Argon2 hashing and rate-limited auth give a small app a production security floor.',
      ],
    },
    {
      title: 'TubeAi',
      type: 'AI SaaS',
      status: 'OWNED · IN BUILD',
      statusClass: 'text-accent-amber border-accent-amber/40',
      description:
        'AI study companion for YouTube. Pulls transcripts, generates flashcards and review courses with Gemini, and gates usage by plan tier.',
      imageUrl: './assets/images/projects/tubeai/tubeai.jpg',
      tech: [
        { name: 'Angular 21', icon: 'data_object' },
        { name: 'NestJS', icon: 'dns' },
        { name: 'BullMQ', icon: 'memory' },
        { name: 'Redis', icon: 'bolt' },
        { name: 'Gemini', icon: 'auto_awesome' },
      ],
      links: [
        {
          name: 'VISIT LIVE',
          icon: 'open_in_new',
          url: 'https://tube-ai.buildwithimran.pro',
        },
      ],
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
      imageUrl: './assets/images/projects/zelo/zelo.jpg',
      tech: [
        { name: 'Angular 21', icon: 'data_object' },
        { name: 'NestJS', icon: 'dns' },
        { name: 'Socket.io', icon: 'bolt' },
        { name: 'BullMQ', icon: 'memory' },
        { name: 'Leaflet', icon: 'map' },
      ],
      links: [
        {
          name: 'VISIT LIVE',
          icon: 'open_in_new',
          url: 'https://zelo.buildwithimran.pro',
        },
      ],
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
      imageUrl: './assets/images/projects/docpilot-ai/docpilot-ai.jpg',
      tech: [
        { name: 'Angular 21', icon: 'data_object' },
        { name: 'NestJS', icon: 'dns' },
        { name: 'Yjs CRDT', icon: 'sync' },
        { name: 'Hocuspocus', icon: 'bolt' },
        { name: 'Tiptap', icon: 'edit_note' },
      ],
      links: [
        {
          name: 'VISIT LIVE',
          icon: 'open_in_new',
          url: 'https://docpilot-ai.buildwithimran.pro',
        },
      ],
      videoUrl: 'K28aMZyYcBg',
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
      imageUrl: './assets/images/projects/aman-tag/aman-tag.jpg',
      tech: [
        { name: 'Angular 21', icon: 'data_object' },
        { name: 'NestJS', icon: 'dns' },
        { name: 'MongoDB', icon: 'database' },
        { name: 'JWT', icon: 'shield_lock' },
        { name: 'Cloudinary', icon: 'cloud_upload' },
      ],
      links: [
        {
          name: 'VISIT LIVE',
          icon: 'open_in_new',
          url: 'https://amantag.buildwithimran.pro',
        },
      ],
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

  projectFilters = ['All', 'SaaS', 'AI SaaS', 'EdTech', 'E-commerce', 'Marketplace', 'Collab Tool', 'Web App'];
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
      value: '11+',
      label: 'Shipped products',
      context: 'Owned SaaS and client builds — live in production or under active development.',
      project: 'buildwithimran.pro',
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
    this.sizeVideoPlayer();
    this.selectedVideoId.set(videoId);
  }

  sizeVideoPlayer(): void {
    // Modal is max-w-4xl (896px) with 16px side padding
    const width = Math.min(window.innerWidth, 896) - 32;
    this.videoWidth.set(width);
    this.videoHeight.set(Math.round((width * 9) / 16));
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

