import React, { useState } from 'react';
import { CompanyPost } from '../types';
import { useToast } from './Toast';

interface CompanyFeedModalProps {
  isOpen: boolean;
  onClose: () => void;
  posts: CompanyPost[];
  onAddPost?: (post: CompanyPost) => void;
}

export const CompanyFeedModal: React.FC<CompanyFeedModalProps> = ({
  isOpen,
  onClose,
  posts,
  onAddPost,
}) => {
  const { showToast } = useToast();
  const [filter, setFilter] = useState('All');
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [hasLiked, setHasLiked] = useState<Record<string, boolean>>({});
  const [commentInput, setCommentInput] = useState<Record<string, string>>({});
  const [commentsMap, setCommentsMap] = useState<Record<string, string[]>>({});

  if (!isOpen) return null;

  const categories = ['All', 'Executive Announcement', 'Culture & Holidays', 'Kudos & Spotlights'];

  const filtered = posts.filter((p) => filter === 'All' || p.category === filter);

  const handleLike = (id: string, initialLikes: number) => {
    if (hasLiked[id]) {
      setHasLiked((prev) => ({ ...prev, [id]: false }));
      setLikes((prev) => ({ ...prev, [id]: (prev[id] ?? initialLikes) - 1 }));
    } else {
      setHasLiked((prev) => ({ ...prev, [id]: true }));
      setLikes((prev) => ({ ...prev, [id]: (prev[id] ?? initialLikes) + 1 }));
      showToast('Liked post! ❤️', 'success');
    }
  };

  const handleAddComment = (postId: string) => {
    const text = commentInput[postId]?.trim();
    if (!text) return;
    setCommentsMap((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), `Alex Kumar: ${text}`],
    }));
    setCommentInput((prev) => ({ ...prev, [postId]: '' }));
    showToast('Comment posted to company bulletin!', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">campaign</span>
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">MHK Company Feed & Bulletins</h2>
              <p className="text-xs text-slate-400">All-hands notices, department celebrations, and town halls</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 cursor-pointer">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="px-4 py-2.5 bg-white border-b border-slate-100 flex items-center gap-2 overflow-x-auto text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 rounded-full font-semibold transition-all whitespace-nowrap cursor-pointer ${
                filter === cat
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Posts Stream */}
        <div className="p-4 overflow-y-auto space-y-4 divide-y divide-slate-100 text-xs">
          {filtered.map((post) => {
            const currentLikes = likes[post.id] ?? post.likes;
            const userLiked = hasLiked[post.id] ?? false;
            const extraComments = commentsMap[post.id] || [];

            return (
              <div key={post.id} className="pt-4 first:pt-0 space-y-2.5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      alt={post.author}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-purple-100"
                      src={post.authorAvatar}
                    />
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span>{post.author}</span>
                        {post.pinned && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-bold uppercase tracking-wider flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[11px]">push_pin</span> Pinned
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {post.authorRole} • {post.timestamp}
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium">
                    {post.category}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm leading-snug">{post.title}</h3>
                <p className="text-slate-700 leading-relaxed text-xs">{post.content}</p>

                {/* Post Actions: Like & Comment */}
                <div className="flex items-center gap-4 pt-1 text-xs text-slate-500">
                  <button
                    type="button"
                    onClick={() => handleLike(post.id, post.likes)}
                    className={`flex items-center gap-1.5 cursor-pointer font-semibold transition-colors ${
                      userLiked ? 'text-red-600 font-bold' : 'hover:text-red-600'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">{userLiked ? 'favorite' : 'favorite_border'}</span>
                    <span>{currentLikes} Likes</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">chat_bubble_outline</span>
                    <span>{post.comments + extraComments.length} Comments</span>
                  </div>
                </div>

                {/* Comments list if any added */}
                {extraComments.length > 0 && (
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                    {extraComments.map((c, i) => (
                      <div key={i} className="text-[11px] text-slate-700">
                        💬 {c}
                      </div>
                    ))}
                  </div>
                )}

                {/* Comment input */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={commentInput[post.id] || ''}
                    onChange={(e) =>
                      setCommentInput((prev) => ({ ...prev, [post.id]: e.target.value }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddComment(post.id);
                    }}
                    placeholder="Write a response or celebration..."
                    className="flex-1 h-8 px-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddComment(post.id)}
                    className="px-3 h-8 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs cursor-pointer"
                  >
                    Reply
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Synced across Hyderabad Hub & Texas Global HQ</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-100 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
