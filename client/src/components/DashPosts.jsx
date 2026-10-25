import { Modal, Table, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle, HiPlus } from 'react-icons/hi';

export default function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const query = currentUser.isAdmin
          ? '/api/post/getposts'
          : `/api/post/getposts?userId=${currentUser._id}`;
        const res = await fetch(query);
        const data = await res.json();
        if (res.ok) {
          setUserPosts(data.posts || []);
          if (data.posts.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser) {
      fetchPosts();
    }
  }, [currentUser]);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const baseQuery = currentUser.isAdmin
        ? `/api/post/getposts?startIndex=${startIndex}`
        : `/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`;
      const res = await fetch(baseQuery);
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserPosts((prev) =>
          prev.filter((post) => post._id !== postIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-4 w-full max-w-5xl scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      <div className='flex items-center justify-between mb-4'>
        <div>
          <h2 className='text-2xl font-bold text-slate-900 dark:text-white'>
            {currentUser.isAdmin ? 'All Publications' : 'My Publications'}
          </h2>
          <p className='text-xs text-slate-500'>
            Manage and edit published articles
          </p>
        </div>
        <Link to='/create-post'>
          <Button gradientDuoTone='purpleToPink' size='sm'>
            <HiPlus className='mr-1' /> Create Post
          </Button>
        </Link>
      </div>

      {userPosts.length > 0 ? (
        <>
          <Table hoverable className='shadow-sm rounded-2xl overflow-hidden'>
            <Table.Head>
              <Table.HeadCell>Date</Table.HeadCell>
              <Table.HeadCell>Image</Table.HeadCell>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Views</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>Edit</Table.HeadCell>
            </Table.Head>
            <Table.Body className='divide-y'>
              {userPosts.map((post) => (
                <Table.Row
                  key={post._id}
                  className='bg-white dark:border-slate-800 dark:bg-slate-900'
                >
                  <Table.Cell className='text-xs'>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className='w-16 h-10 object-cover rounded-lg bg-slate-200'
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className='font-semibold text-slate-900 dark:text-white line-clamp-1 hover:text-indigo-600'
                      to={`/post/${post.slug}`}
                    >
                      {post.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <span className='px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 capitalize'>
                      {post.category}
                    </span>
                  </Table.Cell>
                  <Table.Cell className='text-xs text-slate-500'>
                    {post.views || 0}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setPostIdToDelete(post._id);
                      }}
                      className='font-medium text-red-500 hover:underline cursor-pointer text-xs'
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className='text-indigo-600 dark:text-indigo-400 font-medium hover:underline text-xs'
                      to={`/update-post/${post._id}`}
                    >
                      Edit
                    </Link>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className='w-full text-indigo-600 dark:text-indigo-400 self-center text-sm py-5 hover:underline font-medium'
            >
              Show more articles
            </button>
          )}
        </>
      ) : (
        <div className='text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8'>
          <p className='text-base font-semibold text-slate-700 dark:text-slate-300'>
            No posts found!
          </p>
          <p className='text-xs text-slate-500 mt-1 mb-4'>
            Write your first engineering article or architecture guide today.
          </p>
          <Link to='/create-post'>
            <Button gradientDuoTone='purpleToPink' size='sm' className='mx-auto'>
              Create a Post
            </Button>
          </Link>
        </div>
      )}

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-rose-500 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg font-semibold text-slate-800 dark:text-slate-200'>
              Are you sure you want to delete this publication?
            </h3>
            <p className='text-xs text-slate-500 mb-6'>
              This action cannot be undone. The article and its comments will be permanently removed.
            </p>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeletePost}>
                Yes, delete it
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
