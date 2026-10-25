import { Button, Select, TextInput, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';
import { HiFilter, HiSearch, HiRefresh } from 'react-icons/hi';

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    sort: 'desc',
    category: 'all',
  });

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const sortFromUrl = urlParams.get('sort');
    const categoryFromUrl = urlParams.get('category');
    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        searchTerm: searchTermFromUrl || '',
        sort: sortFromUrl || 'desc',
        category: categoryFromUrl || 'all',
      });
    }

    const fetchPosts = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/post/getposts?${searchQuery}`);
      if (!res.ok) {
        setLoading(false);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
        setLoading(false);
        if (data.posts && data.posts.length >= 9) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      }
    };
    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === 'searchTerm') {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }
    if (e.target.id === 'sort') {
      const order = e.target.value || 'desc';
      setSidebarData({ ...sidebarData, sort: order });
    }
    if (e.target.id === 'category') {
      const category = e.target.value || 'all';
      setSidebarData({ ...sidebarData, category });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', sidebarData.searchTerm || '');
    urlParams.set('sort', sidebarData.sort || 'desc');
    if (sidebarData.category && sidebarData.category !== 'all') {
      urlParams.set('category', sidebarData.category);
    } else {
      urlParams.delete('category');
    }
    navigate(`/search?${urlParams.toString()}`);
  };

  const handleReset = () => {
    setSidebarData({
      searchTerm: '',
      sort: 'desc',
      category: 'all',
    });
    navigate('/search');
  };

  const handleShowMore = async () => {
    const startIndex = posts.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/post/getposts?${searchQuery}`);
    if (!res.ok) return;
    if (res.ok) {
      const data = await res.json();
      setPosts([...posts, ...data.posts]);
      if (data.posts.length >= 9) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    }
  };

  return (
    <div className='flex flex-col md:flex-row min-h-screen'>
      {/* Sidebar Filters */}
      <div className='p-6 md:w-80 border-b md:border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'>
        <div className='flex items-center gap-2 mb-6'>
          <HiFilter className='text-indigo-600 text-xl' />
          <h2 className='text-lg font-bold text-slate-900 dark:text-white'>Filter Publications</h2>
        </div>

        <form className='flex flex-col gap-5' onSubmit={handleSubmit}>
          <div>
            <label className='block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5'>
              Search Query
            </label>
            <TextInput
              placeholder='Keyword, title, or topic...'
              id='searchTerm'
              type='text'
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className='block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5'>
              Sort By Date
            </label>
            <Select onChange={handleChange} value={sidebarData.sort} id='sort'>
              <option value='desc'>Latest First (Newest)</option>
              <option value='asc'>Oldest First</option>
            </Select>
          </div>

          <div>
            <label className='block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5'>
              Category
            </label>
            <Select
              onChange={handleChange}
              value={sidebarData.category}
              id='category'
            >
              <option value='all'>All Categories</option>
              <option value='architecture'>Architecture &amp; System Design</option>
              <option value='reactjs'>React.js &amp; Frontend</option>
              <option value='nextjs'>Next.js &amp; SSR</option>
              <option value='javascript'>JavaScript / TypeScript</option>
              <option value='database'>Databases &amp; MongoDB</option>
              <option value='security'>Security &amp; Zero-Trust</option>
              <option value='devops'>DevOps &amp; Cloud</option>
            </Select>
          </div>

          <div className='flex flex-col gap-2 pt-2'>
            <Button type='submit' gradientDuoTone='purpleToPink' className='font-semibold'>
              <HiSearch className='mr-1.5 text-base' /> Apply Filters
            </Button>
            <Button type='button' color='gray' outline onClick={handleReset} className='text-xs'>
              <HiRefresh className='mr-1' /> Reset Filters
            </Button>
          </div>
        </form>
      </div>

      {/* Results View */}
      <div className='flex-1 p-6 md:p-8 bg-slate-50/50 dark:bg-slate-950/50'>
        <div className='border-b border-slate-200/80 dark:border-slate-800/80 pb-4 mb-6 flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-extrabold text-slate-900 dark:text-white'>
              Publications &amp; Technical Guides
            </h1>
            <p className='text-xs text-slate-500'>
              Found {posts.length} {posts.length === 1 ? 'article' : 'articles'}
            </p>
          </div>
        </div>

        {loading ? (
          <div className='flex justify-center items-center py-20'>
            <Spinner size='xl' />
          </div>
        ) : posts.length === 0 ? (
          <div className='text-center py-20 px-4'>
            <div className='w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center text-3xl mx-auto mb-4'>
              🔍
            </div>
            <h3 className='text-xl font-bold text-slate-900 dark:text-white mb-2'>
              No publications match your filter
            </h3>
            <p className='text-sm text-slate-500 max-w-sm mx-auto mb-4'>
              Try adjusting your search keyword or clearing the category filter.
            </p>
            <Button color='gray' onClick={handleReset} size='sm' className='mx-auto'>
              View All Articles
            </Button>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}

        {showMore && (
          <button
            onClick={handleShowMore}
            className='text-indigo-600 dark:text-indigo-400 font-bold hover:underline py-8 w-full text-center block'
          >
            Load More Articles &rarr;
          </button>
        )}
      </div>
    </div>
  );
}
