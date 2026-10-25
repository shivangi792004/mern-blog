import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { useSelector } from 'react-redux';
import CallToAction from '../components/CallToAction';
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';
import {
  HiHeart,
  HiOutlineHeart,
  HiBookmark,
  HiOutlineBookmark,
  HiShare,
  HiCheck,
  HiClock,
  HiEye,
  HiArrowLeft,
} from 'react-icons/hi';
import { FaTwitter, FaLinkedin } from 'react-icons/fa';

export default function PostPage() {
  const { postSlug } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Reading progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok || !data.posts || data.posts.length === 0) {
          setError(true);
          setLoading(false);
          return;
        }

        const foundPost = data.posts[0];
        setPost(foundPost);
        setLikesCount(foundPost.numberOfLikes || 0);
        if (currentUser && foundPost.likes?.includes(currentUser._id)) {
          setIsLiked(true);
        }

        // Check if bookmarked
        if (currentUser && currentUser.bookmarks?.includes(foundPost._id)) {
          setIsBookmarked(true);
        }

        setLoading(false);
        setError(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug, currentUser]);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?limit=3`);
        const data = await res.json();
        if (res.ok) {
          setRecentPosts(data.posts);
        }
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchRecentPosts();
  }, []);

  const handleLike = async () => {
    if (!currentUser || !post) return;
    try {
      const res = await fetch(`/api/post/like/${post._id}`, {
        method: 'PUT',
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        setIsLiked(!isLiked);
        setLikesCount(data.numberOfLikes);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleBookmark = async () => {
    if (!currentUser || !post) return;
    try {
      const res = await fetch(`/api/user/bookmark/${post._id}`, {
        method: 'PUT',
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        setIsBookmarked(data.isBookmarked);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className='flex flex-col justify-center items-center min-h-screen gap-3'>
        <Spinner size='xl' />
        <p className='text-sm text-slate-500 font-medium'>Loading technical article...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className='flex flex-col justify-center items-center min-h-[70vh] gap-4 text-center px-4'>
        <h1 className='text-3xl font-extrabold text-slate-900 dark:text-white'>Article Not Found</h1>
        <p className='text-slate-500 max-w-md'>The publication you are looking for might have been moved or removed.</p>
        <Link to='/search'>
          <Button gradientDuoTone='purpleToBlue'>Browse All Articles</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Scroll Reading Progress Bar */}
      <div
        className='reading-progress-bar'
        style={{ width: `${scrollProgress}%` }}
      />

      <main className='py-10 px-4 max-w-4xl mx-auto min-h-screen'>
        {/* Back Link */}
        <Link
          to='/search'
          className='inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 mb-6 transition-colors'
        >
          <HiArrowLeft /> Back to all articles
        </Link>

        {/* Article Meta Header */}
        <div className='flex flex-col gap-4'>
          <div className='flex flex-wrap items-center gap-2'>
            <Link to={`/search?category=${post.category}`}>
              <span className='px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 capitalize hover:opacity-80 transition-opacity'>
                {post.category || 'General'}
              </span>
            </Link>
            <span className='text-slate-400'>•</span>
            <span className='text-xs text-slate-500 flex items-center gap-1'>
              <HiClock className='text-indigo-500' /> {post.readTime || '3 min read'}
            </span>
            <span className='text-slate-400'>•</span>
            <span className='text-xs text-slate-500 flex items-center gap-1'>
              <HiEye /> {post.views || 0} views
            </span>
          </div>

          <h1 className='text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight'>
            {post.title}
          </h1>

          {/* Author info & Actions bar */}
          <div className='flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-200/80 dark:border-slate-800/80 my-2'>
            <div className='flex items-center gap-3'>
              <img
                src={post.authorAvatar || '/shivangi.jpg'}
                alt={post.authorName || 'Shivangi Singh'}
                className='w-11 h-11 rounded-full object-cover object-top ring-2 ring-indigo-500/20'
              />
              <div>
                <p className='text-sm font-bold text-slate-900 dark:text-white'>
                  {post.authorName || 'Shivangi Singh'}
                </p>
                <p className='text-xs text-slate-500 dark:text-slate-400'>
                  Published on {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Interaction Buttons */}
            <div className='flex items-center gap-2'>
              <button
                onClick={handleLike}
                title={currentUser ? 'Like post' : 'Sign in to like'}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  isLiked
                    ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/40 dark:border-rose-900/60 dark:text-rose-400'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-rose-400'
                }`}
              >
                {isLiked ? <HiHeart className='text-rose-500 text-base' /> : <HiOutlineHeart className='text-base' />}
                <span>{likesCount}</span>
              </button>

              <button
                onClick={handleBookmark}
                title={currentUser ? 'Save to reading list' : 'Sign in to bookmark'}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  isBookmarked
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-950/40 dark:border-indigo-900/60 dark:text-indigo-400'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-indigo-400'
                }`}
              >
                {isBookmarked ? <HiBookmark className='text-indigo-600 text-base' /> : <HiOutlineBookmark className='text-base' />}
                <span className='hidden sm:inline'>{isBookmarked ? 'Saved' : 'Save'}</span>
              </button>

              <button
                onClick={handleCopyLink}
                title='Copy link'
                className='flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-indigo-400 transition-colors'
              >
                {copied ? <HiCheck className='text-emerald-500 text-base' /> : <HiShare className='text-base' />}
                <span>{copied ? 'Copied!' : 'Share'}</span>
              </button>

              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`}
                target='_blank'
                rel='noopener noreferrer'
                className='p-2 rounded-xl text-slate-500 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-slate-800 transition-colors'
                title='Share on Twitter / X'
              >
                <FaTwitter />
              </a>

              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                target='_blank'
                rel='noopener noreferrer'
                className='p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors'
                title='Share on LinkedIn'
              >
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>

        {/* Featured Cover Image */}
        <div className='my-8 overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md'>
          <img
            src={post.image || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80'}
            alt={post.title}
            className='w-full max-h-[500px] object-cover'
          />
        </div>

        {/* Sanitized Article Body with DOMPurify */}
        <article
          className='post-content leading-relaxed'
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(post.content || ''),
          }}
        />

        {/* Tags Section */}
        {post.tags && post.tags.length > 0 && (
          <div className='flex flex-wrap gap-2 mt-8 pt-6 border-t border-slate-200 dark:border-slate-800'>
            <span className='text-xs font-semibold text-slate-500 self-center mr-1'>Tags:</span>
            {post.tags.map((tag, i) => (
              <span
                key={i}
                className='px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Author Bio Card */}
        <div className='p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 my-10 flex flex-col sm:flex-row items-center gap-5'>
          <img
            src={post.authorAvatar || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'}
            alt={post.authorName}
            className='w-16 h-16 rounded-full object-cover ring-2 ring-indigo-500/30'
          />
          <div className='flex-1 text-center sm:text-left'>
            <h4 className='text-base font-bold text-slate-900 dark:text-white'>Written by {post.authorName}</h4>
            <p className='text-xs text-slate-500 dark:text-slate-400 mt-1'>
              Software Development Engineer passionate about scalable architectures, system design, and high-quality full-stack engineering.
            </p>
          </div>
          <Link to='/about'>
            <Button size='xs' color='gray' outline>
              About Author
            </Button>
          </Link>
        </div>

        {/* Architecture CTA */}
        <CallToAction />

        {/* Comments Section */}
        <div className='my-10'>
          <CommentSection postId={post._id} />
        </div>

        {/* Related Technical Articles */}
        {recentPosts && recentPosts.length > 0 && (
          <div className='my-16 border-t border-slate-200 dark:border-slate-800 pt-10'>
            <div className='flex items-center justify-between mb-8'>
              <div>
                <h3 className='text-2xl font-bold text-slate-900 dark:text-white'>Related Technical Guides</h3>
                <p className='text-xs text-slate-500'>Continue exploring architecture and engineering topics</p>
              </div>
              <Link to='/search' className='text-xs font-semibold text-indigo-600 hover:underline'>
                See all &rarr;
              </Link>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              {recentPosts
                .filter((p) => p._id !== post._id)
                .slice(0, 3)
                .map((recent) => (
                  <PostCard key={recent._id} post={recent} />
                ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
