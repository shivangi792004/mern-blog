import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage('Please fill out all fields.');
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if (res.ok) {
        navigate('/sign-in');
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className='min-h-[85vh] flex items-center justify-center p-4 py-12'>
      <div className='flex p-6 max-w-4xl w-full mx-auto flex-col md:flex-row md:items-center gap-10 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-xl'>
        {/* Left Branding */}
        <div className='flex-1 flex flex-col gap-4'>
          <Link to='/' className='flex items-center gap-2 text-3xl font-extrabold tracking-tight dark:text-white'>
            <span className='w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25'>
              ⚡
            </span>
            <span className='bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent'>
              Personal Blog
            </span>
          </Link>
          <p className='text-sm text-slate-600 dark:text-slate-300 leading-relaxed'>
            Join Shivangi Singh's personal engineering publication. Bookmark architecture deep dives, discuss system designs, and share insights.
          </p>
          <div className='p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs text-slate-600 dark:text-slate-400'>
            💡 Tip: Reviewers can also click <strong>&quot;Demo Login&quot;</strong> on the Sign In page for instant one-click access!
          </div>
        </div>

        {/* Right Form */}
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='Choose your username' className='text-xs font-semibold' />
              <TextInput
                type='text'
                placeholder='e.g., alex_dev'
                id='username'
                required
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value='Your email address' className='text-xs font-semibold' />
              <TextInput
                type='email'
                placeholder='name@company.com'
                id='email'
                required
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value='Create a strong password (min 6 characters)' className='text-xs font-semibold' />
              <TextInput
                type='password'
                placeholder='••••••••'
                id='password'
                required
                onChange={handleChange}
              />
            </div>
            <Button
              gradientDuoTone='purpleToPink'
              type='submit'
              disabled={loading}
              className='font-semibold shadow-md shadow-indigo-500/20'
            >
              {loading ? (
                <>
                  <Spinner size='sm' />
                  <span className='pl-2'>Registering account...</span>
                </>
              ) : (
                'Create Account'
              )}
            </Button>
            <OAuth />
          </form>

          <div className='flex items-center justify-between text-xs mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-slate-500'>
            <span>Already registered?</span>
            <Link to='/sign-in' className='text-indigo-600 dark:text-indigo-400 font-semibold hover:underline'>
              Sign In &rarr;
            </Link>
          </div>

          {errorMessage && (
            <Alert className='mt-4' color='failure'>
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
