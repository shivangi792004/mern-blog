import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';
import DashPosts from '../components/DashPosts';
import DashUsers from '../components/DashUsers';
import DashComments from '../components/DashComments';
import DashboardComp from '../components/DashboardComp';
import DashBookmarks from '../components/DashBookmarks';

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState('');
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <div className='min-h-screen flex flex-col md:flex-row bg-slate-50/50 dark:bg-slate-950/50'>
      <div className='md:w-64'>
        {/* Sidebar */}
        <DashSidebar />
      </div>
      <div className='flex-1 p-4 md:p-8'>
        {/* profile */}
        {tab === 'profile' && <DashProfile />}
        {/* posts */}
        {tab === 'posts' && <DashPosts />}
        {/* users */}
        {tab === 'users' && <DashUsers />}
        {/* comments */}
        {tab === 'comments' && <DashComments />}
        {/* dashboard comp */}
        {(tab === 'dash' || !tab) && <DashboardComp />}
        {/* bookmarks */}
        {tab === 'bookmarks' && <DashBookmarks />}
      </div>
    </div>
  );
}
