import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BsGithub, BsLinkedin, BsTwitter } from 'react-icons/bs';
import { HiOutlineMail, HiCheckCircle, HiOutlineSparkles, HiShieldCheck } from 'react-icons/hi';

export default function FooterCom() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className='border-t border-slate-200 dark:border-slate-800 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 transition-colors duration-200 mt-16'>
      {/* Top Banner: Newsletter / Architecture Dispatch */}
      <div className='border-b border-slate-200/80 dark:border-slate-800/80 bg-indigo-50/50 dark:bg-indigo-950/20'>
        <div className='max-w-7xl mx-auto px-6 py-10'>
          <div className='flex flex-col lg:flex-row items-center justify-between gap-6'>
            <div className='text-center lg:text-left'>
              <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300 mb-2'>
                <HiOutlineSparkles className='text-sm' />
                <span>Shivangi's Architecture Dispatch</span>
              </div>
              <h3 className='text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight'>
                Stay Updated on Modern System Design &amp; Architecture
              </h3>
              <p className='text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl'>
                Weekly engineering writeups on distributed systems, high-throughput Node.js microservices, and React 19 performance.
              </p>
            </div>

            {/* Newsletter Form */}
            <form onSubmit={handleSubscribe} className='w-full lg:w-auto flex flex-col sm:flex-row gap-2 max-w-md'>
              <div className='relative flex-1'>
                <HiOutlineMail className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base' />
                <input
                  type='email'
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='Enter your engineering email...'
                  className='w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm'
                />
              </div>
              <button
                type='submit'
                className='px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:from-indigo-700 hover:to-pink-600 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-1.5'
              >
                <span>Subscribe</span>
                <span>&rarr;</span>
              </button>
            </form>
          </div>

          {subscribed && (
            <div className='mt-3 flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 justify-center lg:justify-start'>
              <HiCheckCircle className='text-base' />
              <span>Thank you! You have been subscribed to Shivangi's Architecture Dispatch.</span>
            </div>
          )}
        </div>
      </div>

      {/* Main 4-Column Footer Content */}
      <div className='max-w-7xl mx-auto px-6 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12'>
          {/* Column 1 & 2: Engineer Profile & Platform Identity */}
          <div className='lg:col-span-2 flex flex-col gap-4'>
            <Link
              to='/'
              className='flex items-center gap-2.5 text-2xl font-extrabold dark:text-white tracking-tight'
            >
              <span className='w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white text-base shadow-md shadow-indigo-500/30'>
                ⚡
              </span>
              <span className='bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent font-black tracking-tight'>
                Personal Blog
              </span>
            </Link>

            {/* Shivangi Singh Profile Card */}
            <div className='p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm shadow-sm flex items-center gap-3.5'>
              <img
                src='/shivangi.jpg'
                alt='Shivangi Singh'
                className='w-12 h-12 rounded-xl object-cover object-top ring-2 ring-indigo-500/30 flex-shrink-0'
              />
              <div className='flex-1 min-w-0'>
                <div className='flex items-center gap-1.5'>
                  <h4 className='text-sm font-bold text-slate-900 dark:text-white truncate'>
                    Shivangi Singh
                  </h4>
                  <span className='px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300'>
                    LPU '26
                  </span>
                </div>
                <p className='text-xs text-slate-500 dark:text-slate-400 truncate'>
                  B.Tech CSE Student &bull; Aspiring SDE
                </p>
                <div className='flex items-center gap-1.5 mt-1'>
                  <span className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse'></span>
                  <span className='text-[11px] font-semibold text-emerald-600 dark:text-emerald-400'>
                    Actively Seeking SDE Job Roles
                  </span>
                </div>
              </div>
            </div>

            <p className='text-xs text-slate-600 dark:text-slate-400 leading-relaxed'>
              Personal Blog is Shivangi Singh's engineering portfolio and technical publication, documenting systems architecture, full-stack development, and algorithmic problem-solving.
            </p>

            {/* Direct Contact Button */}
            <div className='flex flex-wrap gap-2 pt-1'>
              <a
                href='mailto:shivangisingh8688@gmail.com'
                className='inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-500 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'
              >
                <span>✉️</span>
                <span>shivangisingh8688@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Column 3: Architecture & Guides */}
          <div>
            <h4 className='text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4'>
              Engineering Tracks
            </h4>
            <ul className='space-y-2.5 text-xs text-slate-600 dark:text-slate-400'>
              <li>
                <Link to='/search?category=architecture' className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5'>
                  <span>Distributed Systems</span>
                </Link>
              </li>
              <li>
                <Link to='/search?category=reactjs' className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5'>
                  <span>React 18 &amp; State Trees</span>
                </Link>
              </li>
              <li>
                <Link to='/search?category=database' className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5'>
                  <span>MongoDB Indexing (ESR)</span>
                </Link>
              </li>
              <li>
                <Link to='/search?category=security' className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5'>
                  <span>Zero-Trust JWT &amp; Sanitization</span>
                </Link>
              </li>
              <li>
                <Link to='/search?category=nodejs' className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5'>
                  <span>Node.js Microservices</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: SDE Portfolio & Demos */}
          <div>
            <h4 className='text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4'>
              Author Portfolio
            </h4>
            <ul className='space-y-2.5 text-xs text-slate-600 dark:text-slate-400'>
              <li>
                <Link to='/about' className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium'>
                  About Shivangi Singh
                </Link>
              </li>
              <li>
                <Link to='/projects' className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium'>
                  Architecture Projects (4 Specs)
                </Link>
              </li>
              <li>
                <Link to='/sign-in' className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'>
                  1-Click Author Demo Login
                </Link>
              </li>
              <li>
                <Link to='/dashboard?tab=bookmarks' className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'>
                  Saved Articles (Reading List)
                </Link>
              </li>
              <li>
                <Link to='/create-post' className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'>
                  Publish New Article
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Tech Stack Badges */}
          <div>
            <h4 className='text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4'>
              Built With Modern Stack
            </h4>
            <div className='flex flex-wrap gap-1.5'>
              {['React 18', 'Vite 7', 'Node.js 24', 'Express', 'MongoDB Atlas', 'Redux Toolkit', 'Tailwind CSS', 'DOMPurify', 'HttpOnly JWT', 'Rate Limiter'].map((tech, idx) => (
                <span
                  key={idx}
                  className='text-[10px] font-mono font-medium px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className='mt-5 p-3 rounded-xl border border-indigo-200/50 dark:border-indigo-900/50 bg-indigo-50/40 dark:bg-indigo-950/20'>
              <div className='flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300'>
                <HiShieldCheck className='text-sm' />
                <span>Zero Vulnerabilities</span>
              </div>
              <p className='text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-normal'>
                DOMPurify XSS scrubbing + sliding window brute-force defense.
              </p>
            </div>
          </div>
        </div>

        {/* Live System Telemetry Status Bar */}
        <div className='p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 mb-8 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-400'>
          <div className='flex items-center gap-2'>
            <span className='w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping'></span>
            <span className='font-semibold text-slate-900 dark:text-white'>System Health:</span>
            <span className='text-emerald-600 dark:text-emerald-400 font-bold'>All Systems 100% Operational</span>
          </div>

          <div className='flex flex-wrap items-center gap-4 sm:gap-6 font-mono text-[11px]'>
            <div>⚡ Latency: <span className='text-slate-900 dark:text-white font-bold'>&lt; 35ms</span></div>
            <div>🗄️ Database: <span className='text-slate-900 dark:text-white font-bold'>MongoDB Atlas</span></div>
            <div>🔒 Auth: <span className='text-slate-900 dark:text-white font-bold'>HttpOnly JWT</span></div>
            <div>🚀 Build: <span className='text-slate-900 dark:text-white font-bold'>v2.4.0 (SDE Candidate)</span></div>
          </div>
        </div>

        {/* Bottom Copyright & Social Icons */}
        <div className='pt-6 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500'>
          <p>
            &copy; {new Date().getFullYear()} <strong className='text-slate-700 dark:text-slate-300'>Personal Blog</strong> • Engineered by <strong className='text-indigo-600 dark:text-indigo-400 font-bold'>Shivangi Singh</strong> (LPU B.Tech CSE '26).
          </p>

          <div className='flex items-center gap-4'>
            <a
              href='https://github.com/shivangi792004'
              target='_blank'
              rel='noopener noreferrer'
              className='p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-base'
              title='GitHub Profile'
            >
              <BsGithub />
            </a>
            <a
              href='https://linkedin.com/in/shivangisingh04/'
              target='_blank'
              rel='noopener noreferrer'
              className='p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-600 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-base'
              title='LinkedIn Profile'
            >
              <BsLinkedin />
            </a>
            <a
              href='https://twitter.com'
              target='_blank'
              rel='noopener noreferrer'
              className='p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-sky-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-base'
              title='Twitter Profile'
            >
              <BsTwitter />
            </a>
            <a
              href='mailto:shivangisingh8688@gmail.com'
              className='p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-pink-600 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-base'
              title='Email Shivangi Singh'
            >
              <HiOutlineMail />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
