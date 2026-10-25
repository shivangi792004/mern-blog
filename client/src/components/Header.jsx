import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun, FaBookmark, FaPen } from 'react-icons/fa';
import { HiLightningBolt } from 'react-icons/hi';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
import { signoutSuccess, signInSuccess } from '../redux/user/userSlice';
import { useEffect, useState } from 'react';

export default function Header() {
  const path = useLocation().pathname;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleQuickDemo = async () => {
    try {
      const res = await fetch('/api/auth/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'admin' }),
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate('/dashboard?tab=dash');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const getProfilePicture = () => {
    if (currentUser && currentUser.profilePicture) {
      return currentUser.profilePicture;
    }
    return '/shivangi.jpg';
  };

  return (
    <Navbar className='sticky top-0 z-50 backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200'>
      <Link
        to='/'
        className='self-center flex items-center gap-2 whitespace-nowrap text-lg sm:text-2xl font-bold dark:text-white tracking-tight'
      >
        <span className='w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25'>
          ⚡
        </span>
        <span className='bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent font-extrabold'>
          Personal Blog
        </span>
      </Link>

      <form onSubmit={handleSubmit} className='relative hidden lg:inline'>
        <TextInput
          type='text'
          placeholder='Search articles, topics, architecture...'
          rightIcon={AiOutlineSearch}
          className='w-72 xl:w-80'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>

      <div className='flex items-center gap-2 md:order-2'>
        <Button
          className='w-10 h-10 flex items-center justify-center rounded-xl'
          color='gray'
          onClick={() => dispatch(toggleTheme())}
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {theme === 'light' ? (
            <FaMoon className='text-slate-700' />
          ) : (
            <FaSun className='text-amber-400' />
          )}
        </Button>

        {currentUser ? (
          <div className='flex items-center gap-2'>
            <Link to='/create-post' className='hidden sm:inline'>
              <Button
                size='sm'
                gradientDuoTone='purpleToPink'
                className='font-medium'
              >
                <FaPen className='mr-1.5 h-3.5 w-3.5' /> Write
              </Button>
            </Link>

            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar
                  alt='user'
                  img={getProfilePicture()}
                  rounded
                  className='ring-2 ring-indigo-500/30'
                />
              }
            >
              <Dropdown.Header>
                <span className='block text-sm font-semibold'>@{currentUser.username}</span>
                <span className='block text-xs text-slate-500 truncate'>
                  {currentUser.email}
                </span>
                {currentUser.isAdmin && (
                  <span className='inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'>
                    Admin
                  </span>
                )}
              </Dropdown.Header>
              <Link to={'/dashboard?tab=profile'}>
                <Dropdown.Item>Profile Settings</Dropdown.Item>
              </Link>
              <Link to={'/dashboard?tab=dash'}>
                <Dropdown.Item>Dashboard</Dropdown.Item>
              </Link>
              <Link to={'/dashboard?tab=posts'}>
                <Dropdown.Item>Manage Posts</Dropdown.Item>
              </Link>
              <Link to={'/create-post'}>
                <Dropdown.Item>Create New Post</Dropdown.Item>
              </Link>
              <Link to={'/dashboard?tab=bookmarks'}>
                <Dropdown.Item icon={FaBookmark}>Saved Articles</Dropdown.Item>
              </Link>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleSignout} className='text-red-600 dark:text-red-400'>
                Sign out
              </Dropdown.Item>
            </Dropdown>
          </div>
        ) : (
          <div className='flex items-center gap-2'>
            <Button
              size='sm'
              color='gray'
              onClick={handleQuickDemo}
              className='hidden sm:flex items-center text-xs'
              title='Instant demo login for reviewers'
            >
              <HiLightningBolt className='text-amber-500 mr-1 text-sm' /> Demo Login
            </Button>
            <Link to='/sign-in'>
              <Button size='sm' gradientDuoTone='purpleToBlue' outline>
                Sign In
              </Button>
            </Link>
          </div>
        )}
        <Navbar.Toggle />
      </div>

      <Navbar.Collapse>
        <Navbar.Link active={path === '/'} as={'div'}>
          <Link to='/' className='font-medium'>Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/search'} as={'div'}>
          <Link to='/search' className='font-medium'>Explore Articles</Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/projects'} as={'div'}>
          <Link to='/projects' className='font-medium'>Architecture Projects</Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/about'} as={'div'}>
          <Link to='/about' className='font-medium'>About Shivangi</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}