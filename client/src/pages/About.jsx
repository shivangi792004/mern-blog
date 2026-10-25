import CallToAction from '../components/CallToAction';
import { Button } from 'flowbite-react';
import { Link } from 'react-router-dom';
import {
  HiAcademicCap,
  HiBadgeCheck,
  HiCode,
  HiChip,
  HiOutlineMail,
  HiSparkles,
} from 'react-icons/hi';
import { BsGithub, BsLinkedin } from 'react-icons/bs';

export default function About() {
  const certifications = [
    {
      issuer: 'Cisco Networking Academy',
      title: 'Python Essentials 2',
      date: 'Aug 2026',
      badge: 'Cisco Certified',
    },
    {
      issuer: 'IBM SkillsBuild',
      title: 'Data Literacy',
      date: 'Aug 2026',
      badge: 'IBM Verified',
    },
    {
      issuer: 'HackerRank',
      title: 'SQL (Advanced) — Certificate of Accomplishment',
      date: 'Feb 2025',
      badge: '5-Star Advanced',
    },
  ];

  const education = [
    {
      institution: 'Lovely Professional University',
      location: 'Punjab, India',
      degree: 'B.Tech in Computer Science and Engineering',
      duration: 'Aug 2022 – June 2026',
      score: 'CGPA: 7.8 / 10',
      highlight: 'Core CS subjects: Data Structures & Algorithms, OS, DBMS, Computer Networks, Distributed Computing.',
    },
    {
      institution: 'Sri Chaitanya',
      location: 'Hyderabad, India',
      degree: "Associate's in Science Stream",
      duration: 'Apr 2021 – Mar 2022',
      score: 'Score: 86%',
      highlight: 'Advanced Mathematics, Physics, and foundational computational problem-solving.',
    },
  ];

  const achievements = [
    {
      title: 'LeetCode 300+ Problems Solved',
      desc: 'Solved 300+ algorithmic problems across arrays, trees, dynamic programming, and graphs with 200+ active days, building strong DSA fundamentals and coding efficiency.',
      date: 'Aug 2025',
    },
    {
      title: 'HackerRank 5-Star C++, Python & SQL',
      desc: 'Earned 5-star proficiency badges in C++, Python, and SQL, demonstrating deep language mastery, complex query optimization, and structured problem-solving.',
      date: 'Nov 2024',
    },
  ];

  return (
    <div className='min-h-screen py-16 px-4 max-w-5xl mx-auto'>
      {/* Student Profile Hero Header */}
      <div className='p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm mb-12 flex flex-col md:flex-row gap-8 items-center'>
        <div className='w-44 h-44 sm:w-48 sm:h-48 rounded-3xl overflow-hidden ring-4 ring-indigo-500/20 shadow-lg flex-shrink-0 bg-slate-100 dark:bg-slate-800'>
          <img
            src='/shivangi.jpg'
            alt='Shivangi Singh'
            className='w-full h-full object-cover object-top'
          />
        </div>

        <div className='flex-1 text-center md:text-left'>
          <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 mb-3'>
            <span className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse'></span>
            <span>Student • B.Tech CSE (2022–2026)</span>
          </div>

          <h1 className='text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2'>
            Shivangi Singh
          </h1>

          <p className='text-base text-slate-600 dark:text-slate-300 font-medium mb-3'>
            Aspiring Software Development Engineer (SDE) &bull; Computer Science Undergrad
          </p>

          <p className='text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6 max-w-xl'>
            Passionate CS student at Lovely Professional University with strong Data Structures &amp; Algorithms fundamentals (300+ LeetCode problems), hands-on full-stack development experience, and a drive to build scalable software systems. Actively seeking SDE opportunities.
          </p>

          {/* Social & Contact Actions */}
          <div className='flex flex-wrap items-center justify-center md:justify-start gap-2.5'>
            <a
              href='https://linkedin.com/in/shivangisingh04/'
              target='_blank'
              rel='noopener noreferrer'
            >
              <Button size='xs' gradientDuoTone='purpleToBlue' className='font-semibold'>
                <BsLinkedin className='mr-1.5 text-sm' /> LinkedIn
              </Button>
            </a>

            <a
              href='https://github.com/shivangi792004'
              target='_blank'
              rel='noopener noreferrer'
            >
              <Button size='xs' color='gray' outline className='font-semibold'>
                <BsGithub className='mr-1.5 text-sm' /> GitHub
              </Button>
            </a>

            <a href='mailto:shivangisingh8688@gmail.com'>
              <Button size='xs' color='light' className='font-semibold'>
                <HiOutlineMail className='mr-1.5 text-sm text-rose-500' /> shivangisingh8688@gmail.com
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Education Section */}
      <div className='mb-14'>
        <div className='flex items-center gap-2 mb-6'>
          <HiAcademicCap className='text-2xl text-indigo-600 dark:text-indigo-400' />
          <h2 className='text-2xl font-bold text-slate-900 dark:text-white'>
            Academic Education
          </h2>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {education.map((edu, idx) => (
            <div
              key={idx}
              className='p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between'
            >
              <div>
                <div className='flex items-center justify-between mb-2'>
                  <span className='px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50'>
                    {edu.duration}
                  </span>
                  <span className='text-xs font-bold text-emerald-600 dark:text-emerald-400'>
                    {edu.score}
                  </span>
                </div>
                <h3 className='text-base font-bold text-slate-900 dark:text-white'>
                  {edu.institution}
                </h3>
                <p className='text-xs text-slate-500 dark:text-slate-400 mb-2'>
                  {edu.degree} &bull; {edu.location}
                </p>
                <p className='text-xs text-slate-600 dark:text-slate-400 leading-relaxed'>
                  {edu.highlight}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications & Industry Credentials */}
      <div className='mb-14'>
        <div className='flex items-center gap-2 mb-6'>
          <HiBadgeCheck className='text-2xl text-indigo-600 dark:text-indigo-400' />
          <h2 className='text-2xl font-bold text-slate-900 dark:text-white'>
            Certifications &amp; Credentials
          </h2>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-3 gap-5'>
          {certifications.map((cert, idx) => (
            <div
              key={idx}
              className='p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between'
            >
              <div>
                <span className='inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mb-2.5'>
                  {cert.badge}
                </span>
                <h4 className='text-sm font-bold text-slate-900 dark:text-white mb-1'>
                  {cert.title}
                </h4>
                <p className='text-xs text-slate-500 dark:text-slate-400'>
                  {cert.issuer}
                </p>
              </div>
              <div className='mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 font-mono'>
                Issued: {cert.date}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DSA & Coding Achievements */}
      <div className='mb-14'>
        <div className='flex items-center gap-2 mb-6'>
          <HiSparkles className='text-2xl text-amber-500' />
          <h2 className='text-2xl font-bold text-slate-900 dark:text-white'>
            DSA Fundamentals &amp; Achievements
          </h2>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {achievements.map((ach, idx) => (
            <div
              key={idx}
              className='p-6 rounded-2xl border border-amber-200/50 dark:border-amber-900/30 bg-amber-50/20 dark:bg-amber-950/10 shadow-sm'
            >
              <div className='flex items-center justify-between mb-2'>
                <h3 className='text-base font-bold text-slate-900 dark:text-white'>
                  {ach.title}
                </h3>
                <span className='text-[11px] font-mono font-semibold text-amber-600 dark:text-amber-400'>
                  {ach.date}
                </span>
              </div>
              <p className='text-xs text-slate-600 dark:text-slate-300 leading-relaxed'>
                {ach.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Skills Overview */}
      <div className='mb-16 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm'>
        <h3 className='text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2'>
          <HiChip className='text-indigo-600 text-2xl' /> Core Technical Stack
        </h3>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs'>
          <div>
            <h4 className='font-bold uppercase tracking-wider text-slate-500 mb-2'>Languages</h4>
            <div className='flex flex-wrap gap-1.5'>
              {['C++', 'Python', 'SQL', 'JavaScript'].map((s, i) => (
                <span key={i} className='px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium font-mono'>
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className='font-bold uppercase tracking-wider text-slate-500 mb-2'>Databases</h4>
            <div className='flex flex-wrap gap-1.5'>
              {['MongoDB', 'MySQL', 'Redis'].map((s, i) => (
                <span key={i} className='px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium font-mono'>
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className='font-bold uppercase tracking-wider text-slate-500 mb-2'>Web Architecture</h4>
            <div className='flex flex-wrap gap-1.5'>
              {['React 18', 'Node.js', 'Express', 'Redux Toolkit', 'Tailwind CSS'].map((s, i) => (
                <span key={i} className='px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium font-mono'>
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className='font-bold uppercase tracking-wider text-slate-500 mb-2'>Cloud &amp; Tools</h4>
            <div className='flex flex-wrap gap-1.5'>
              {['Linux', 'Docker', 'Kubernetes', 'Git', 'GitHub', 'VS Code'].map((s, i) => (
                <span key={i} className='px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium font-mono'>
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Call to action */}
      <CallToAction />
    </div>
  );
}