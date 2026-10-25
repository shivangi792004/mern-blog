import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';
import { HiPhotograph, HiSparkles } from 'react-icons/hi';

const IMAGE_PRESETS = [
  {
    name: 'Architecture',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'React / Frontend',
    url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Database / MongoDB',
    url: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Zero-Trust Security',
    url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Cloud & Infrastructure',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
  },
];

export default function CreatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({
    category: 'architecture',
    image: IMAGE_PRESETS[0].url,
  });
  const [tagsInput, setTagsInput] = useState('');
  const [publishError, setPublishError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleUpdloadImage = async () => {
    try {
      if (!file) {
        setImageUploadError('Please select an image file first');
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError('Firebase upload failed: using preset image instead.');
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError('Upload error. You can also paste an image URL directly below.');
      setImageUploadProgress(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setPublishError(null);

    if (!formData.title || !formData.title.trim()) {
      setPublishError('Please enter a valid article title.');
      setIsSubmitting(false);
      return;
    }

    if (!formData.content || !formData.content.trim() || formData.content === '<p><br></p>') {
      setPublishError('Please write some article content before publishing.');
      setIsSubmitting(false);
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      const res = await fetch('/api/post/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          tags,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message || 'Failed to publish article.');
        setIsSubmitting(false);
        return;
      }

      navigate(`/post/${data.slug}`);
    } catch (error) {
      setPublishError('Network error. Please check your connection and try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className='p-4 max-w-4xl mx-auto min-h-screen py-10'>
      <div className='mb-8 text-center'>
        <span className='px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'>
          Authoring Studio
        </span>
        <h1 className='text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2'>
          Publish Engineering Article
        </h1>
        <p className='text-sm text-slate-500 mt-1'>
          Share system design patterns, architectural guides, or technical tutorials
        </p>
      </div>

      <form className='flex flex-col gap-5' onSubmit={handleSubmit}>
        <div className='flex flex-col sm:flex-row gap-4 justify-between'>
          <TextInput
            type='text'
            placeholder='Article Title (e.g., Designing Distributed Caching Pipelines with Redis)'
            required
            id='title'
            className='flex-1'
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <Select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value='architecture'>Architecture &amp; System Design</option>
            <option value='reactjs'>React.js &amp; Frontend</option>
            <option value='nextjs'>Next.js &amp; SSR</option>
            <option value='javascript'>JavaScript / TypeScript</option>
            <option value='database'>Databases &amp; MongoDB</option>
            <option value='security'>Security &amp; Zero-Trust</option>
            <option value='devops'>DevOps &amp; Cloud</option>
          </Select>
        </div>

        {/* Cover Image Picker & Presets */}
        <div className='p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col gap-4'>
          <div className='flex items-center justify-between'>
            <label className='text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5'>
              <HiPhotograph className='text-indigo-600' /> Cover Image Options
            </label>
            <span className='text-[11px] text-slate-500'>Upload file OR paste URL below</span>
          </div>

          {/* Quick presets */}
          <div>
            <p className='text-[11px] text-slate-400 mb-1.5 font-medium'>1-Click High-Res Engineering Presets:</p>
            <div className='flex flex-wrap gap-2'>
              {IMAGE_PRESETS.map((preset) => (
                <button
                  type='button'
                  key={preset.name}
                  onClick={() => setFormData({ ...formData, image: preset.url })}
                  className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${
                    formData.image === preset.url
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-400'
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div className='flex flex-col sm:flex-row gap-3 items-center'>
            <TextInput
              type='url'
              placeholder='Custom Cover Image URL'
              value={formData.image || ''}
              className='flex-1 w-full'
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            />
            <div className='flex items-center gap-2 w-full sm:w-auto'>
              <FileInput
                type='file'
                accept='image/*'
                onChange={(e) => setFile(e.target.files[0])}
                className='text-xs'
              />
              <Button
                type='button'
                gradientDuoTone='purpleToBlue'
                size='sm'
                outline
                onClick={handleUpdloadImage}
                disabled={imageUploadProgress}
              >
                {imageUploadProgress ? (
                  <div className='w-8 h-8'>
                    <CircularProgressbar
                      value={imageUploadProgress}
                      text={`${imageUploadProgress}%`}
                    />
                  </div>
                ) : (
                  'Upload'
                )}
              </Button>
            </div>
          </div>

          {imageUploadError && <Alert color='warning'>{imageUploadError}</Alert>}

          {formData.image && (
            <div className='relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 h-52'>
              <img
                src={formData.image}
                alt='Preview'
                className='w-full h-full object-cover'
              />
              <span className='absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] bg-black/60 text-white backdrop-blur-sm'>
                Live Preview
              </span>
            </div>
          )}
        </div>

        {/* Tags input */}
        <TextInput
          type='text'
          placeholder='Tags (comma separated, e.g., Microservices, Redis, Scalability)'
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
        />

        {/* Quill Editor */}
        <div className='bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-2'>
          <ReactQuill
            theme='snow'
            placeholder='Write your technical article, system diagram descriptions, and code snippets here...'
            className='h-80 mb-12'
            required
            onChange={(value) => {
              setFormData({ ...formData, content: value });
            }}
          />
        </div>

        <Button
          type='submit'
          gradientDuoTone='purpleToPink'
          size='lg'
          disabled={isSubmitting}
          className='font-semibold shadow-lg shadow-indigo-500/20'
        >
          {isSubmitting ? 'Publishing Publication...' : 'Publish Technical Article'}
        </Button>

        {publishError && (
          <Alert color='failure'>
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}
