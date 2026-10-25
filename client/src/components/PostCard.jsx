import { Link } from 'react-router-dom';
import { HiEye, HiHeart, HiClock } from 'react-icons/hi';

export default function PostCard({ post }) {
  const categoryBadgeColors = {
    reactjs: 'from-blue-600 to-cyan-500',
    nextjs: 'from-gray-900 to-gray-700',
    javascript: 'from-amber-500 to-yellow-400',
    architecture: 'from-purple-600 to-indigo-600',
    database: 'from-emerald-600 to-teal-500',
    security: 'from-rose-600 to-red-500',
  };

  const gradient = categoryBadgeColors[post.category?.toLowerCase()] || 'from-indigo-600 to-purple-600';

  return (
    <div className='group relative w-full sm:w-[360px] bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 dark:hover:border-indigo-500/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between mx-auto'>
      <div>
        <Link to={`/post/${post.slug}`} className='relative block overflow-hidden h-[210px] bg-slate-100 dark:bg-slate-800'>
          <img
            src={post.image || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80'}
            alt={post.title}
            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
            loading='lazy'
          />
          {/* Category Badge */}
          <span className={`absolute top-3 left-3 px-2.5 py-1 text-xs font-bold text-white rounded-lg shadow-md bg-gradient-to-r ${gradient} capitalize`}>
            {post.category || 'General'}
          </span>
          {/* Read Time Chip */}
          <span className='absolute bottom-3 right-3 px-2 py-0.5 text-[11px] font-medium text-slate-900 dark:text-slate-100 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-md flex items-center gap-1 shadow-sm'>
            <HiClock className='text-indigo-500' />
            {post.readTime || '3 min read'}
          </span>
        </Link>

        <div className='p-5 flex flex-col gap-2.5'>
          <div className='flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400'>
            <span>{new Date(post.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            <span>•</span>
            <span className='flex items-center gap-1'>
              <HiEye className='text-slate-400' /> {post.views || 0}
            </span>
            <span>•</span>
            <span className='flex items-center gap-1'>
              <HiHeart className='text-rose-500' /> {post.numberOfLikes || 0}
            </span>
          </div>

          <Link to={`/post/${post.slug}`}>
            <h3 className='text-lg font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug'>
              {post.title}
            </h3>
          </Link>
        </div>
      </div>

      <div className='px-5 pb-5 pt-0 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-3'>
        <div className='flex items-center gap-2.5'>
          <img
            src={post.authorAvatar || '/shivangi.jpg'}
            alt={post.authorName || 'Shivangi Singh'}
            className='w-7 h-7 rounded-full object-cover object-top ring-1 ring-slate-300 dark:ring-slate-700'
          />
          <span className='text-xs font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[140px]'>
            {post.authorName || 'Shivangi Singh'}
          </span>
        </div>

        <Link
          to={`/post/${post.slug}`}
          className='text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform'
        >
          Read Post &rarr;
        </Link>
      </div>
    </div>
  );
}
