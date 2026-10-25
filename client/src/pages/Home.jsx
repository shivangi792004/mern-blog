import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import { Button, Spinner } from 'flowbite-react';
import { HiLightningBolt, HiSparkles, HiCode, HiDatabase, HiShieldCheck } from 'react-icons/hi';
import { FaReact, FaNodeJs } from 'react-icons/fa';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Articles', icon: HiSparkles },
    { id: 'architecture', label: 'Architecture', icon: HiCode },
    { id: 'reactjs', label: 'React.js', icon: FaReact },
    { id: 'database', label: 'Databases', icon: HiDatabase },
    { id: 'security', label: 'Security', icon: HiShieldCheck },
  ];

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/post/getposts?limit=9');
      const data = await res.json();
      if (res.ok) {
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.log('Error fetching posts:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSeedPosts = async () => {
    try {
      setSeeding(true);
      const res = await fetch('/api/post/seed?force=true', {
        method: 'POST',
      });
      if (res.ok) {
        await fetchPosts();
      }
    } catch (error) {
      console.log('Error seeding posts:', error.message);
    } finally {
      setSeeding(false);
    }
  };

  const filteredPosts =
    selectedCategory === 'all'
      ? posts
      : posts.filter(
          (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
        );

  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <div className='relative overflow-hidden border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-indigo-50/50 via-white to-transparent dark:from-slate-900/50 dark:via-slate-950 dark:to-transparent py-16 sm:py-24 px-4'>
        {/* Glow ambient background elements */}
        <div className='absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-3xl pointer-events-none' />

        <div className='max-w-5xl mx-auto flex flex-col items-center text-center gap-6 relative z-10'>
          <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-indigo-100/80 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50 shadow-sm'>
            <HiSparkles className='text-amber-500 text-base' />
            <span>Personal Blog &bull; Engineering &amp; System Insights</span>
          </div>

          <h1 className='text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight max-w-4xl leading-[1.15]'>
            Engineering Scalable Systems,{' '}
            <span className='bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent'>
              From Concept to Production
            </span>
          </h1>

          <p className='text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed'>
            A personal engineering blog by{' '}
            <strong className='text-slate-900 dark:text-white font-semibold'>Shivangi Singh</strong>.
            Computer Science undergrad at Lovely Professional University (B.Tech '26) actively seeking SDE roles, exploring distributed architectures, modern full-stack systems, and algorithmic problem-solving.
          </p>

          <div className='flex flex-wrap items-center justify-center gap-3 pt-2'>
            <Link to='/search'>
              <Button size='lg' gradientDuoTone='purpleToPink' className='font-semibold shadow-lg shadow-indigo-500/20'>
                Explore Technical Guides &rarr;
              </Button>
            </Link>
            <Link to='/projects'>
              <Button size='lg' color='gray' outline className='font-semibold'>
                View System Specs
              </Button>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 pt-10 border-t border-slate-200/80 dark:border-slate-800/80 w-full max-w-3xl text-center'>
            <div>
              <p className='text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400'>100%</p>
              <p className='text-xs text-slate-500 dark:text-slate-400 font-medium'>MERN Full Stack</p>
            </div>
            <div>
              <p className='text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400'>Zero</p>
              <p className='text-xs text-slate-500 dark:text-slate-400 font-medium'>N+1 Query Bottlenecks</p>
            </div>
            <div>
              <p className='text-2xl sm:text-3xl font-extrabold text-pink-600 dark:text-pink-400'>HttpOnly</p>
              <p className='text-xs text-slate-500 dark:text-slate-400 font-medium'>Strict JWT Security</p>
            </div>
            <div>
              <p className='text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400'>99.9%</p>
              <p className='text-xs text-slate-500 dark:text-slate-400 font-medium'>Architectural Resilience</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-10'>
        {/* Category Filter Pills */}
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <div>
            <h2 className='text-2xl font-bold text-slate-900 dark:text-white'>Recent Publications</h2>
            <p className='text-sm text-slate-500 dark:text-slate-400'>Hand-crafted architectural guides and deep-dives</p>
          </div>

          <div className='flex flex-wrap gap-2'>
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-indigo-400'
                  }`}
                >
                  <Icon className={isActive ? 'text-white' : 'text-indigo-500'} />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading / Empty / Posts Grid */}
        {loading ? (
          <div className='flex justify-center items-center py-20'>
            <Spinner size='xl' />
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'>
            {filteredPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div className='text-center py-16 px-4 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 flex flex-col items-center gap-4'>
            <div className='w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-2xl'>
              ✍️
            </div>
            <h3 className='text-xl font-bold text-slate-900 dark:text-white'>No Articles in this Category Yet</h3>
            <p className='text-sm text-slate-500 dark:text-slate-400 max-w-md'>
              Seed sample engineering posts to immediately populate high-quality technical content for testing and evaluation.
            </p>
            <Button
              onClick={handleSeedPosts}
              disabled={seeding}
              gradientDuoTone='purpleToPink'
              className='font-semibold mt-2'
            >
              {seeding ? (
                <>
                  <Spinner size='sm' className='mr-2' /> Seeding Sample Articles...
                </>
              ) : (
                <>
                  <HiLightningBolt className='mr-2' /> Seed Sample Engineering Posts
                </>
              )}
            </Button>
          </div>
        )}

        {/* Architecture Spec CTA */}
        <CallToAction />
      </div>
    </div>
  );
}