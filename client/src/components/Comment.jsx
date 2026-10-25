import moment from 'moment';
import { useEffect, useState } from 'react';
import { FaThumbsUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Button, Textarea } from 'flowbite-react';

export default function Comment({ comment, onLike, onEdit, onDelete }) {
  const [user, setUser] = useState({
    username: comment.authorName || '',
    profilePicture: comment.authorAvatar || '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    // Only fetch if author details were not returned from the backend
    if (!comment.authorName && comment.userId) {
      const getUser = async () => {
        try {
          const res = await fetch(`/api/user/${comment.userId}`);
          const data = await res.json();
          if (res.ok) {
            setUser(data);
          }
        } catch (error) {
          console.log(error.message);
        }
      };
      getUser();
    }
  }, [comment]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/comment/editComment/${comment._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: editedContent,
        }),
      });
      if (res.ok) {
        setIsEditing(false);
        onEdit(comment, editedContent);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const authorName = user.username || comment.authorName || 'developer';
  const authorAvatar =
    user.profilePicture ||
    comment.authorAvatar ||
    'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';

  return (
    <div className='flex p-4 border-b border-slate-200/80 dark:border-slate-800/80 text-sm'>
      <div className='flex-shrink-0 mr-3'>
        <img
          className='w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700 bg-slate-100 dark:bg-slate-800'
          src={authorAvatar}
          alt={authorName}
        />
      </div>
      <div className='flex-1'>
        <div className='flex items-center gap-1.5 mb-1'>
          <span className='font-bold text-xs text-slate-800 dark:text-slate-200 truncate'>
            @{authorName}
          </span>
          <span className='text-slate-400 text-[11px]'>•</span>
          <span className='text-slate-500 dark:text-slate-400 text-xs'>
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>

        {isEditing ? (
          <>
            <Textarea
              className='mb-2'
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className='flex justify-end gap-2 text-xs'>
              <Button
                type='button'
                size='xs'
                gradientDuoTone='purpleToBlue'
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                type='button'
                size='xs'
                color='gray'
                outline
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className='text-slate-700 dark:text-slate-300 pb-2 text-sm leading-relaxed'>
              {comment.content}
            </p>
            <div className='flex items-center pt-2 text-xs border-t border-slate-100 dark:border-slate-800/60 max-w-fit gap-3'>
              <button
                type='button'
                onClick={() => onLike(comment._id)}
                className={`flex items-center gap-1 text-slate-400 hover:text-indigo-600 transition-colors ${
                  currentUser &&
                  comment.likes?.includes(currentUser._id) &&
                  '!text-indigo-600 font-semibold'
                }`}
              >
                <FaThumbsUp className='text-xs' />
                <span>
                  {comment.numberOfLikes > 0 && comment.numberOfLikes}
                </span>
              </button>

              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <>
                    <button
                      type='button'
                      onClick={handleEdit}
                      className='text-slate-400 hover:text-indigo-600 transition-colors'
                    >
                      Edit
                    </button>
                    <button
                      type='button'
                      onClick={() => onDelete(comment._id)}
                      className='text-slate-400 hover:text-red-500 transition-colors'
                    >
                      Delete
                    </button>
                  </>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
