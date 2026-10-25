import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Spinner } from 'flowbite-react';
import { HiBookmark, HiClock, HiTrash } from 'react-icons/hi';

export default function DashBookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/user/bookmarks/all', {
          credentials: 'include',
        });
        const data = await res.json();
        if (res.ok) {
          setBookmarks(data || []);
        }
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarks();
  }, []);

  const handleRemoveBookmark = async (postId) => {
    try {
      const res = await fetch(`/api/user/bookmark/${postId}`, {
        method: 'PUT',
        credentials: 'include',
      });
      if (res.ok) {
        setBookmarks((prev) => prev.filter((p) => p._id !== postId));
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className='p-4 w-full max-w-5xl md:mx-auto'>
      <div className='mb-6'>
        <h2 className='text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2'>
          <HiBookmark className='text-indigo-600' /> Saved Articles
        </h2>
        <p className='text-xs text-slate-500'>
          Your personalized reading list for offline and future reference
        </p>
      </div>

      {loading ? (
        <div className='flex justify-center items-center py-16'>
          <Spinner size='lg' />
        </div>
      ) : bookmarks.length > 0 ? (
        <Table hoverable className='shadow-sm rounded-2xl overflow-hidden'>
          <Table.Head>
            <Table.HeadCell>Article</Table.HeadCell>
            <Table.HeadCell>Category</Table.HeadCell>
            <Table.HeadCell>Reading Time</Table.HeadCell>
            <Table.HeadCell>Action</Table.HeadCell>
          </Table.Head>
          <Table.Body className='divide-y'>
            {bookmarks.map((post) => (
              <Table.Row
                key={post._id}
                className='bg-white dark:border-slate-800 dark:bg-slate-900'
              >
                <Table.Cell>
                  <div className='flex items-center gap-3'>
                    <img
                      src={post.image || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=200&q=80'}
                      alt={post.title}
                      className='w-14 h-10 rounded-lg object-cover bg-slate-200'
                    />
                    <Link
                      to={`/post/${post.slug}`}
                      className='font-semibold text-slate-900 dark:text-white hover:text-indigo-600 line-clamp-1'
                    >
                      {post.title}
                    </Link>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <span className='px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 capitalize'>
                    {post.category}
                  </span>
                </Table.Cell>
                <Table.Cell className='text-xs text-slate-500'>
                  <span className='flex items-center gap-1'>
                    <HiClock /> {post.readTime || '3 min read'}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <button
                    onClick={() => handleRemoveBookmark(post._id)}
                    className='text-slate-400 hover:text-rose-500 transition-colors p-1.5'
                    title='Remove from saved'
                  >
                    <HiTrash className='text-base' />
                  </button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <div className='text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center gap-3'>
          <div className='w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 text-xl'>
            <HiBookmark />
          </div>
          <h3 className='text-lg font-bold text-slate-800 dark:text-slate-200'>
            Your Reading List is Empty
          </h3>
          <p className='text-xs text-slate-500 max-w-sm'>
            When browsing guides and architecture deep dives, click the "Save" button to keep them here.
          </p>
          <Link to='/search'>
            <Button size='sm' gradientDuoTone='purpleToBlue' className='mt-2'>
              Explore Articles
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
