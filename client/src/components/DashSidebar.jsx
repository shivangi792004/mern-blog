import { Sidebar } from 'flowbite-react';
import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiAnnotation,
  HiChartPie,
  HiBookmark,
} from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { signoutSuccess } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function DashSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
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

  return (
    <Sidebar className='w-full md:w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'>
      <Sidebar.Items>
        <Sidebar.ItemGroup className='flex flex-col gap-1.5'>
          {currentUser && currentUser.isAdmin && (
            <Link to='/dashboard?tab=dash'>
              <Sidebar.Item
                active={tab === 'dash' || !tab}
                icon={HiChartPie}
                as='div'
              >
                Analytics &amp; Metrics
              </Sidebar.Item>
            </Link>
          )}

          <Link to='/dashboard?tab=profile'>
            <Sidebar.Item
              active={tab === 'profile'}
              icon={HiUser}
              label={currentUser.isAdmin ? 'Admin' : 'Author'}
              labelColor='indigo'
              as='div'
            >
              Profile Settings
            </Sidebar.Item>
          </Link>

          <Link to='/dashboard?tab=posts'>
            <Sidebar.Item
              active={tab === 'posts'}
              icon={HiDocumentText}
              as='div'
            >
              {currentUser.isAdmin ? 'All Publications' : 'My Publications'}
            </Sidebar.Item>
          </Link>

          <Link to='/dashboard?tab=bookmarks'>
            <Sidebar.Item
              active={tab === 'bookmarks'}
              icon={HiBookmark}
              as='div'
            >
              Saved Articles
            </Sidebar.Item>
          </Link>

          {currentUser && currentUser.isAdmin && (
            <>
              <div className='pt-3 pb-1 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400'>
                Administration
              </div>
              <Link to='/dashboard?tab=users'>
                <Sidebar.Item
                  active={tab === 'users'}
                  icon={HiOutlineUserGroup}
                  as='div'
                >
                  Manage Users
                </Sidebar.Item>
              </Link>
              <Link to='/dashboard?tab=comments'>
                <Sidebar.Item
                  active={tab === 'comments'}
                  icon={HiAnnotation}
                  as='div'
                >
                  Moderate Comments
                </Sidebar.Item>
              </Link>
            </>
          )}

          <div className='pt-4 mt-4 border-t border-slate-100 dark:border-slate-800'>
            <Sidebar.Item
              icon={HiArrowSmRight}
              className='cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30'
              onClick={handleSignout}
            >
              Sign Out
            </Sidebar.Item>
          </div>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
