import { useSelector } from 'react-redux';
import { useEffect } from 'react';

export default function ThemeProvider({ children }) {
  const { theme } = useSelector((state) => state.theme);
  
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className='bg-white text-gray-700 dark:text-gray-200 dark:bg-[rgb(16,23,42)] min-h-screen'>
      {children}
    </div>
  );
}