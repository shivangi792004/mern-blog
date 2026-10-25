import { Button } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { HiCode, HiSparkles } from 'react-icons/hi';

export default function CallToAction() {
  return (
    <div className='relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-indigo-900/10 via-purple-900/10 to-pink-900/10 dark:from-indigo-950/40 dark:via-purple-950/40 dark:to-slate-900 p-8 sm:p-10 my-8 shadow-sm'>
      {/* Background ambient glow */}
      <div className='absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none' />
      <div className='absolute -bottom-24 -left-24 w-72 h-72 bg-pink-500/15 rounded-full blur-3xl pointer-events-none' />

      <div className='relative flex flex-col md:flex-row items-center justify-between gap-8'>
        <div className='flex-1 flex flex-col items-start gap-4'>
          <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'>
            <HiSparkles className='text-amber-500' /> Production-Grade Architecture
          </span>

          <h2 className='text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight'>
            Building Scalable Full-Stack Systems from Scratch
          </h2>

          <p className='text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl'>
            Explore real-world system designs, distributed caching strategies, clean MVC architectures, and micro-frontend patterns crafted for modern software engineering teams.
          </p>

          <div className='flex flex-wrap gap-3 mt-2'>
            <Link to='/projects'>
              <Button gradientDuoTone='purpleToPink' className='font-semibold shadow-md'>
                Explore Architecture Projects
              </Button>
            </Link>
            <Link to='/search'>
              <Button color='gray' outline className='font-semibold'>
                Browse All Guides
              </Button>
            </Link>
          </div>
        </div>

        <div className='w-full md:w-80 p-5 rounded-2xl bg-slate-900/90 text-slate-200 border border-slate-700/80 shadow-2xl font-mono text-xs'>
          <div className='flex items-center gap-2 pb-3 border-b border-slate-800 text-slate-400'>
            <span className='w-3 h-3 rounded-full bg-red-500 inline-block' />
            <span className='w-3 h-3 rounded-full bg-yellow-500 inline-block' />
            <span className='w-3 h-3 rounded-full bg-green-500 inline-block' />
            <span className='ml-2 text-[11px] text-slate-400'>arch-spec.json</span>
          </div>
          <div className='pt-3 space-y-1.5'>
            <p><span className='text-purple-400'>"architecture"</span>: <span className='text-green-400'>"MERN Clean Architecture"</span>,</p>
            <p><span className='text-purple-400'>"auth"</span>: <span className='text-green-400'>"JWT HttpOnly + RateLimit"</span>,</p>
            <p><span className='text-purple-400'>"performance"</span>: <span className='text-green-400'>"Zero N+1 Queries"</span>,</p>
            <p><span className='text-purple-400'>"security"</span>: <span className='text-green-400'>"DOMPurify XSS Hardened"</span>,</p>
            <p><span className='text-purple-400'>"status"</span>: <span className='text-amber-400'>"Production Ready 🚀"</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
