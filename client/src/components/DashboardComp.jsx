import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
  HiEye,
  HiHeart,
} from 'react-icons/hi';
import { Button, Table } from 'flowbite-react';
import { Link } from 'react-router-dom';

export default function DashboardComp() {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/user/getusers?limit=5');
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users || []);
          setTotalUsers(data.totalUsers || 0);
          setLastMonthUsers(data.lastMonthUsers || 0);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchPosts = async () => {
      try {
        const query = currentUser?.isAdmin
          ? '/api/post/getposts?limit=5'
          : `/api/post/getposts?userId=${currentUser?._id}&limit=5`;
        const res = await fetch(query);
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts || []);
          setTotalPosts(data.totalPosts || 0);
          setLastMonthPosts(data.lastMonthPosts || 0);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchComments = async () => {
      try {
        const res = await fetch('/api/comment/getcomments?limit=5');
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments || []);
          setTotalComments(data.totalComments || 0);
          setLastMonthComments(data.lastMonthComments || 0);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser) {
      fetchPosts();
      if (currentUser.isAdmin) {
        fetchUsers();
        fetchComments();
      }
    }
  }, [currentUser]);

  return (
    <div className='p-4 w-full max-w-6xl mx-auto'>
      <div className='mb-6'>
        <h2 className='text-2xl font-bold text-slate-900 dark:text-white'>
          {currentUser?.isAdmin ? 'Platform Overview & Telemetry' : 'Author Analytics & Publications'}
        </h2>
        <p className='text-xs text-slate-500'>
          Real-time metrics, recent user activity, and publication health
        </p>
      </div>

      {/* Metrics Row */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8'>
        {currentUser?.isAdmin && (
          <div className='p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between'>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider'>
                  Registered Engineers
                </h3>
                <p className='text-3xl font-extrabold text-slate-900 dark:text-white mt-1'>
                  {totalUsers}
                </p>
              </div>
              <div className='w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 text-2xl'>
                <HiOutlineUserGroup />
              </div>
            </div>
            <div className='flex items-center gap-1.5 text-xs text-slate-500 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800'>
              <span className='text-emerald-500 font-bold flex items-center'>
                <HiArrowNarrowUp /> +{lastMonthUsers}
              </span>
              <span>new accounts this month</span>
            </div>
          </div>
        )}

        {currentUser?.isAdmin && (
          <div className='p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between'>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider'>
                  Community Discussions
                </h3>
                <p className='text-3xl font-extrabold text-slate-900 dark:text-white mt-1'>
                  {totalComments}
                </p>
              </div>
              <div className='w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 text-2xl'>
                <HiAnnotation />
              </div>
            </div>
            <div className='flex items-center gap-1.5 text-xs text-slate-500 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800'>
              <span className='text-emerald-500 font-bold flex items-center'>
                <HiArrowNarrowUp /> +{lastMonthComments}
              </span>
              <span>comments posted this month</span>
            </div>
          </div>
        )}

        <div className='p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between'>
          <div className='flex items-center justify-between'>
            <div>
              <h3 className='text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider'>
                {currentUser?.isAdmin ? 'Technical Publications' : 'My Publications'}
              </h3>
              <p className='text-3xl font-extrabold text-slate-900 dark:text-white mt-1'>
                {totalPosts}
              </p>
            </div>
            <div className='w-12 h-12 rounded-2xl bg-pink-50 dark:bg-pink-950/50 flex items-center justify-center text-pink-600 text-2xl'>
              <HiDocumentText />
            </div>
          </div>
          <div className='flex items-center gap-1.5 text-xs text-slate-500 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800'>
            <span className='text-emerald-500 font-bold flex items-center'>
              <HiArrowNarrowUp /> +{lastMonthPosts}
            </span>
            <span>published recently</span>
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Recent Posts Table */}
        <div className='p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm'>
          <div className='flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-800'>
            <h3 className='font-bold text-base text-slate-900 dark:text-white'>Recent Publications</h3>
            <Link to='/dashboard?tab=posts'>
              <Button size='xs' color='gray' outline>
                See All
              </Button>
            </Link>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Cover</Table.HeadCell>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
            </Table.Head>
            <Table.Body className='divide-y'>
              {posts &&
                posts.map((post) => (
                  <Table.Row key={post._id} className='bg-white dark:border-slate-800 dark:bg-slate-900'>
                    <Table.Cell>
                      <img
                        src={post.image}
                        alt={post.title}
                        className='w-12 h-8 rounded-md object-cover bg-slate-200'
                      />
                    </Table.Cell>
                    <Table.Cell className='max-w-[200px]'>
                      <Link
                        to={`/post/${post.slug}`}
                        className='font-semibold text-xs text-slate-900 dark:text-white line-clamp-1 hover:text-indigo-600'
                      >
                        {post.title}
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <span className='text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 capitalize'>
                        {post.category}
                      </span>
                    </Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
        </div>

        {/* Recent Users or Community Table */}
        {currentUser?.isAdmin ? (
          <div className='p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm'>
            <div className='flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-800'>
              <h3 className='font-bold text-base text-slate-900 dark:text-white'>Recent Users</h3>
              <Link to='/dashboard?tab=users'>
                <Button size='xs' color='gray' outline>
                  See All
                </Button>
              </Link>
            </div>
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Avatar</Table.HeadCell>
                <Table.HeadCell>Username</Table.HeadCell>
                <Table.HeadCell>Role</Table.HeadCell>
              </Table.Head>
              <Table.Body className='divide-y'>
                {users &&
                  users.map((user) => (
                    <Table.Row key={user._id} className='bg-white dark:border-slate-800 dark:bg-slate-900'>
                      <Table.Cell>
                        <img
                          src={user.profilePicture}
                          alt={user.username}
                          className='w-8 h-8 rounded-full object-cover bg-slate-200'
                        />
                      </Table.Cell>
                      <Table.Cell className='font-semibold text-xs text-slate-800 dark:text-slate-200'>
                        @{user.username}
                      </Table.Cell>
                      <Table.Cell>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          user.isAdmin
                            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                          {user.isAdmin ? 'Admin' : 'Author'}
                        </span>
                      </Table.Cell>
                    </Table.Row>
                  ))}
              </Table.Body>
            </Table>
          </div>
        ) : (
          <div className='p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-slate-900 dark:to-slate-800 flex flex-col justify-between'>
            <div>
              <h3 className='font-bold text-base text-slate-900 dark:text-white mb-2'>
                Developer Author Guide
              </h3>
              <p className='text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4'>
                As a DevPulse author, you can draft technical articles, embed code snippets with JetBrains Mono syntax styling, and tag engineering categories like Microservices, React 19, or Redis.
              </p>
              <ul className='space-y-1.5 text-xs text-slate-600 dark:text-slate-300'>
                <li>&bull; Include code blocks using markdown pre tags</li>
                <li>&bull; Reading times and unique slugs are generated automatically</li>
                <li>&bull; Content is protected by client-side DOMPurify sanitization</li>
              </ul>
            </div>
            <Link to='/create-post' className='mt-6'>
              <Button size='sm' gradientDuoTone='purpleToPink' className='w-full font-semibold'>
                Write New Publication
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
