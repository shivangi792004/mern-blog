import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';
import OAuth from '../components/OAuth';
import { HiLightningBolt, HiShieldCheck, HiPencilAlt } from 'react-icons/hi';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const [demoLoading, setDemoLoading] = useState(false);
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure('Please fill out all fields'));
    }
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }

      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate('/');
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  const handleDemoLogin = async (role) => {
    try {
      setDemoLoading(true);
      dispatch(signInStart());
      const res = await fetch('/api/auth/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate(role === 'admin' ? '/dashboard?tab=dash' : '/');
      } else {
        dispatch(signInFailure(data.message));
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    } finally {
      setDemoLoading(false);
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
            Shivangi Singh's personal engineering publication. Explore technical deep-dives, publish new articles, or test full platform features.
          </p>

          {/* Quick Demo Login Box for Interviewers */}
          <div className='p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 mt-2 flex flex-col gap-2.5'>
            <div className='flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300'>
              <HiLightningBolt className='text-amber-500 text-sm' />
              <span>1-Click Demo Access (Explore as Author)</span>
            </div>
            <p className='text-[11px] text-slate-500 dark:text-slate-400'>
              Explore full authoring and management privileges as Shivangi Singh without manual signup:
            </p>
            <div className='grid grid-cols-2 gap-2 mt-1'>
              <Button
                size='xs'
                color='purple'
                disabled={loading || demoLoading}
                onClick={() => handleDemoLogin('admin')}
                className='font-semibold flex items-center justify-center'
              >
                <HiShieldCheck className='mr-1 text-sm' /> Demo Admin
              </Button>
              <Button
                size='xs'
                color='gray'
                disabled={loading || demoLoading}
                onClick={() => handleDemoLogin('author')}
                className='font-semibold flex items-center justify-center'
              >
                <HiPencilAlt className='mr-1 text-sm' /> Demo Author
              </Button>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
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
              <Label value='Your password' className='text-xs font-semibold' />
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
                  <span className='pl-2'>Authenticating...</span>
                </>
              ) : (
                'Sign In with Email'
              )}
            </Button>
            <OAuth />
          </form>

          <div className='flex items-center justify-between text-xs mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-slate-500'>
            <span>Don&apos;t have an account?</span>
            <Link to='/sign-up' className='text-indigo-600 dark:text-indigo-400 font-semibold hover:underline'>
              Create an Account &rarr;
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
