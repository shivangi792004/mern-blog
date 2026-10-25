import CallToAction from '../components/CallToAction';
import { Button } from 'flowbite-react';
import { HiCode, HiServer, HiLightningBolt, HiExternalLink } from 'react-icons/hi';
import { BsGithub } from 'react-icons/bs';

export default function Projects() {
  const projects = [
    {
      title: 'Personal Blog — Full-Stack Technical Publishing Platform',
      tagline: 'High-Throughput Architectural Publication & Community Platform',
      tech: ['MongoDB', 'Express.js', 'React 18', 'Node.js', 'Redux Toolkit', 'Tailwind CSS'],
      highlights: [
        'Hardened with HttpOnly JWT authentication and IP rate limiting against brute-force attacks',
        'Eliminated N+1 query bottlenecks in comment and author retrieval using pre-populated schemas',
        'Built-in DOMPurify sanitization pipeline preventing stored Cross-Site Scripting (XSS)',
        'Collision-free automated slug generation algorithm with graceful duplicate fallback',
      ],
      liveLink: '/',
      githubLink: 'https://github.com/shivangi792004',
      badge: 'Current Showcase',
    },
    {
      title: 'Distributed Asynchronous Task Engine',
      tagline: 'Scalable Background Job Pipeline & Worker Pool',
      tech: ['Node.js', 'Redis', 'BullMQ', 'Docker', 'Prometheus'],
      highlights: [
        'Processes up to 5,000 asynchronous background jobs/second with exponential backoff retries',
        'Implemented dead-letter queues (DLQ) and distributed locks using Redis Redlock algorithm',
        'Health and telemetry metrics exported for Prometheus and Grafana observability dashboards',
      ],
      liveLink: '#',
      githubLink: 'https://github.com/shivangi792004',
      badge: 'Backend Architecture',
    },
    {
      title: 'High-Concurrency Real-Time Collaboration Hub',
      tagline: 'Multi-User Concurrent Canvas with WebSocket Synchronization',
      tech: ['React 18', 'WebSockets', 'Node.js', 'Redis Pub/Sub', 'Tailwind CSS'],
      highlights: [
        'Bi-directional real-time communication pipeline with sub-30ms latency across geographic regions',
        'Conflict resolution using Operational Transformation (OT) and optimistic local rendering',
        'Horizontal scaling across clustered Node processes using Redis Pub/Sub backplane',
      ],
      liveLink: '#',
      githubLink: 'https://github.com/shivangi792004',
      badge: 'Real-Time Systems',
    },
    {
      title: 'Zero-Trust Cloud API Gateway',
      tagline: 'Reverse Proxy with Token-Bucket Rate Limiting & Auth Validation',
      tech: ['Express.js', 'Node.js', 'JWT', 'Docker', 'Nginx'],
      highlights: [
        'Centralized authentication gatekeeper validating cryptographic JWTs for downstream microservices',
        'Sliding-window counter and token-bucket algorithms preventing Denial of Service (DoS)',
        'Dynamic routing with automatic SSL termination and request header normalization',
      ],
      liveLink: '#',
      githubLink: 'https://github.com/shivangi792004',
      badge: 'Cloud & Security',
    },
  ];

  return (
    <div className='min-h-screen py-16 px-4 max-w-6xl mx-auto'>
      <div className='text-center max-w-3xl mx-auto mb-14'>
        <span className='px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'>
          Engineering Portfolio
        </span>
        <h1 className='text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mt-4 mb-3 tracking-tight'>
          Architecture &amp; System Projects
        </h1>
        <p className='text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed'>
          A curated collection of production-grade distributed systems, full-stack web applications, and architectural benchmarks engineered by <strong>Shivangi Singh</strong> (Lovely Professional University, B.Tech '26).
        </p>
      </div>

      {/* Projects Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-16'>
        {projects.map((proj, idx) => (
          <div
            key={idx}
            className='p-7 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between'
          >
            <div>
              <div className='flex items-center justify-between mb-3'>
                <span className='px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50'>
                  {proj.badge}
                </span>
                <div className='flex gap-2 text-slate-400'>
                  <a
                    href={proj.githubLink}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='hover:text-slate-900 dark:hover:text-white transition-colors'
                    title='GitHub Repository'
                  >
                    <BsGithub className='text-lg' />
                  </a>
                </div>
              </div>

              <h3 className='text-xl font-bold text-slate-900 dark:text-white mb-1.5'>
                {proj.title}
              </h3>
              <p className='text-xs font-medium text-slate-500 dark:text-slate-400 mb-4'>
                {proj.tagline}
              </p>

              {/* Highlights */}
              <ul className='space-y-2 mb-6'>
                {proj.highlights.map((item, hIdx) => (
                  <li
                    key={hIdx}
                    className='text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2 leading-relaxed'
                  >
                    <span className='text-indigo-500 font-bold mt-0.5'>&bull;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              {/* Tech Stack Chips */}
              <div className='flex flex-wrap gap-1.5 mb-6 pt-4 border-t border-slate-100 dark:border-slate-800'>
                {proj.tech.map((t, tIdx) => (
                  <span
                    key={tIdx}
                    className='px-2.5 py-0.5 rounded-md text-[10px] font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className='flex items-center gap-3'>
                <a
                  href={proj.liveLink}
                  className='flex-1'
                >
                  <Button
                    size='xs'
                    gradientDuoTone='purpleToPink'
                    className='w-full font-semibold'
                  >
                    <HiExternalLink className='mr-1.5 text-sm' /> View Live System
                  </Button>
                </a>
                <a
                  href={proj.githubLink}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <Button size='xs' color='gray' outline className='font-semibold'>
                    <BsGithub className='mr-1' /> Code
                  </Button>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <CallToAction />
    </div>
  );
}
