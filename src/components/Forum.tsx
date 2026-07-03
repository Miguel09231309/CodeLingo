import React from 'react';
import { MessageSquare, Heart, Share2, Send, PenTool, Search, HelpCircle, Code, ChevronRight, User, X } from 'lucide-react';
import { ForumPost, Language } from '../types';

interface ForumProps {
  lang: Language;
}

export default function Forum({ lang }: ForumProps) {
  const [activeSubject, setActiveSubject] = React.useState<'html' | 'python' | 'javascript' | 'geral'>('geral');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  
  // Create Post fields
  const [newTitle, setNewTitle] = React.useState('');
  const [newContent, setNewContent] = React.useState('');
  const [newSubject, setNewSubject] = React.useState<'html' | 'python' | 'javascript' | 'geral'>('geral');

  // Active replies tracker
  const [replyInputs, setReplyInputs] = React.useState<{ [key: string]: string }>({});

  const [posts, setPosts] = React.useState<ForumPost[]>([
    {
      id: 'p-1',
      author: 'Guilherme_Coder',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      title: 'Como funciona o flexbox na vertical?',
      content: 'Estou tentando centralizar verticalmente três botões usando flex-direction: column, mas eles ficam colados no topo da div container. Alguém pode me ajudar?',
      subject: 'html',
      likes: 12,
      likedByCurrentUser: false,
      date: '2026-07-02',
      replies: [
        {
          id: 'r-1',
          author: 'Ana_Coders',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
          content: 'Certifique-se de que o seu container tem uma altura definida (ex: height: 100vh ou h-64) e use justify-content: center. No column flex, justify-content controla o eixo vertical!',
          date: '2026-07-02'
        }
      ]
    },
    {
      id: 'p-2',
      author: 'Lucas_Py',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
      title: 'Diferença prática entre Lista e Tupla em Python?',
      content: 'Sei que listas usam colchetes [ ] e tuplas usam parênteses ( ). Mas quando devo REALMENTE escolher usar uma no lugar da outra em sistemas reais?',
      subject: 'python',
      likes: 24,
      likedByCurrentUser: true,
      date: '2026-07-01',
      replies: [
        {
          id: 'r-2',
          author: 'Sofia_JS',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
          content: 'Escolha Tuplas quando você quer garantir imutabilidade (dados que não podem ser editados após a criação, como coordenadas geográficas ou chaves de config). Além de mais seguras, elas são ligeiramente mais rápidas!',
          date: '2026-07-01'
        }
      ]
    },
    {
      id: 'p-3',
      author: 'Davi_Stack',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      title: 'O que é "TDZ" (Temporal Dead Zone) em JavaScript?',
      content: 'Me deparei com esse termo hoje lendo documentação avançada. Tem a ver com let e const?',
      subject: 'javascript',
      likes: 9,
      likedByCurrentUser: false,
      date: '2026-06-30',
      replies: []
    }
  ]);

  const t = {
    title: lang === 'pt' ? 'Fórum da Comunidade' : 'Community Forum',
    subtitle: lang === 'pt' ? 'Tire suas dúvidas, compartilhe soluções e aprenda com o ecossistema.' : 'Ask questions, share solutions, and learn with other developers.',
    newPost: lang === 'pt' ? 'Criar Tópico' : 'New Thread',
    search: lang === 'pt' ? 'Pesquisar perguntas...' : 'Search questions...',
    likes: lang === 'pt' ? 'curtidas' : 'likes',
    answers: lang === 'pt' ? 'respostas' : 'answers',
    publish: lang === 'pt' ? 'Publicar Tópico' : 'Publish Thread',
    postTitle: lang === 'pt' ? 'Título do Tópico' : 'Thread Title',
    postContent: lang === 'pt' ? 'Explique sua dúvida em detalhes...' : 'Explain your question in detail...',
    chooseSubject: lang === 'pt' ? 'Escolha o Assunto' : 'Choose Subject',
    replyPlaceholder: lang === 'pt' ? 'Escreva uma resposta de ajuda...' : 'Write an answer to help...',
    empty: lang === 'pt' ? 'Nenhum tópico encontrado.' : 'No threads found.',
    all: lang === 'pt' ? 'Todos' : 'All'
  };

  const filteredPosts = posts.filter(post => {
    const matchesSubject = activeSubject === 'geral' || post.subject === activeSubject;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  const handleLike = (id: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === id) {
        return {
          ...post,
          likes: post.likedByCurrentUser ? post.likes - 1 : post.likes + 1,
          likedByCurrentUser: !post.likedByCurrentUser
        };
      }
      return post;
    }));
  };

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const post: ForumPost = {
      id: `p-${posts.length + 1}`,
      author: 'Você (Estudante)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      title: newTitle,
      content: newContent,
      subject: newSubject,
      likes: 0,
      likedByCurrentUser: false,
      date: new Date().toISOString().split('T')[0],
      replies: []
    };

    setPosts([post, ...posts]);
    setNewTitle('');
    setNewContent('');
    setShowCreateModal(false);
  };

  const handleReplyChange = (postId: string, val: string) => {
    setReplyInputs({ ...replyInputs, [postId]: val });
  };

  const handleAddReply = (postId: string) => {
    const text = replyInputs[postId];
    if (!text || !text.trim()) return;

    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          replies: [
            ...post.replies,
            {
              id: `r-${post.replies.length + 1}`,
              author: 'Você (Estudante)',
              avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
              content: text,
              date: new Date().toISOString().split('T')[0]
            }
          ]
        };
      }
      return post;
    }));

    // Reset input
    setReplyInputs({ ...replyInputs, [postId]: '' });
  };

  return (
    <div className="space-y-6 pb-10">
      
      {/* Forum Title & Search Layout */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2.5 uppercase">
            <MessageSquare className="w-6 h-6 text-[#58CC02] stroke-[2.5]" />
            <span>{t.title}</span>
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
            {t.subtitle}
          </p>
        </div>

        <button
          id="btn-trigger-post"
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-5 py-3 bg-[#58CC02] hover:bg-emerald-500 text-white text-xs font-black rounded-xl border-b-4 border-emerald-700 active:border-b-0 active:translate-y-[4px] uppercase tracking-wider transition-all self-start md:self-auto cursor-pointer"
        >
          <PenTool className="w-4 h-4 stroke-[2.5]" />
          <span>{t.newPost}</span>
        </button>
      </div>

      {/* Topics Filtering Navigation Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-850 p-4 rounded-3xl shadow-sm border-b-4">
        <div className="flex gap-2 overflow-x-auto w-full sm:w-auto">
          {(['geral', 'html', 'python', 'javascript'] as const).map((subject) => {
            const isActive = activeSubject === subject;
            return (
              <button
                id={`forum-filter-${subject}`}
                key={subject}
                onClick={() => setActiveSubject(subject)}
                className={`px-4 py-2 text-2xs uppercase font-black rounded-xl transition-all border-2 border-b-4 active:translate-y-[2px] active:border-b-2 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#58CC02]/10 border-[#58CC02] text-[#58CC02] border-b-[#46a302]'
                    : 'border-slate-200 dark:border-slate-800 border-b-slate-300 dark:border-b-slate-950 hover:border-slate-300 text-slate-500'
                }`}
              >
                {subject === 'geral' ? t.all : subject}
              </button>
            );
          })}
        </div>

        {/* Dynamic Text Search filter bar */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400 stroke-[2.5]" />
          <input
            id="forum-search-field"
            type="text"
            placeholder={t.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs font-bold text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#58CC02] transition-all"
          />
        </div>
      </div>

      {/* Creation Modal Overlays */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl relative border-b-8">
            <button 
              id="close-forum-modal"
              onClick={() => setShowCreateModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1.5 rounded-lg border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-800"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>

            <h3 className="font-black text-lg text-slate-800 dark:text-white uppercase tracking-tight">
              {t.publish}
            </h3>

            <form onSubmit={handleAddPost} className="space-y-4">
              <div className="space-y-1">
                <label className="text-3xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t.postTitle}</label>
                <input
                  id="new-post-title"
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Como remover itens de um array em JS?"
                  className="w-full bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#58CC02]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-3xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t.chooseSubject}</label>
                  <select
                    id="new-post-subj"
                    value={newSubject}
                    onChange={(e: any) => setNewSubject(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-[#58CC02]"
                  >
                    <option value="geral">Geral</option>
                    <option value="html">HTML</option>
                    <option value="python">Python</option>
                    <option value="javascript">JavaScript</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-3xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Descrição detalhada</label>
                <textarea
                  id="new-post-content"
                  required
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder={t.postContent}
                  className="w-full bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#58CC02]"
                />
              </div>

              <button
                id="submit-forum-post"
                type="submit"
                className="w-full py-3 bg-[#58CC02] hover:bg-emerald-500 text-white text-xs font-black rounded-xl transition-all border-b-4 border-emerald-700 active:border-b-0 active:translate-y-[4px] uppercase tracking-wider shadow-md"
              >
                {t.publish}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main filterable posts container feed */}
      <div className="space-y-5">
        {filteredPosts.length === 0 ? (
          <div className="text-center p-12 bg-white dark:bg-slate-900 rounded-3xl tactile-card">
            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-2 stroke-[2]" />
            <p className="text-slate-400 text-sm font-black uppercase tracking-wider">{t.empty}</p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div 
              id={`post-card-${post.id}`}
              key={post.id} 
              className="bg-white dark:bg-slate-900 rounded-3xl p-5 md:p-6 space-y-4 tactile-card text-slate-800 dark:text-slate-100"
            >
              {/* Post author and badge metadata header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img src={post.avatar} alt={post.author} className="w-9 h-9 rounded-full object-cover border-2 border-slate-200 dark:border-slate-800" />
                  <div>
                    <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight">@{post.author}</h4>
                    <span className="text-3xs text-slate-400 dark:text-slate-500 font-mono font-bold uppercase tracking-wider">{post.date}</span>
                  </div>
                </div>
                
                <span className="bg-[#58CC02]/10 text-[#58CC02] text-3xs uppercase font-black tracking-widest px-3 py-1 rounded-full border border-[#58CC02]/20">
                  #{post.subject}
                </span>
              </div>

              {/* Title and Description body text */}
              <div className="space-y-1.5">
                <h3 className="font-black text-sm md:text-base text-slate-800 dark:text-white leading-tight uppercase tracking-tight">
                  {post.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-bold">
                  {post.content}
                </p>
              </div>

              {/* Interactive buttons (Likes, Comments Count) */}
              <div className="flex items-center gap-4 text-3xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 pt-2.5 border-t-2 border-slate-100 dark:border-slate-800/80">
                <button
                  id={`btn-like-${post.id}`}
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-1.5 hover:text-rose-500 transition-all cursor-pointer ${
                    post.likedByCurrentUser ? 'text-rose-500' : ''
                  }`}
                >
                  <Heart className={`w-4 h-4 ${post.likedByCurrentUser ? 'fill-current text-rose-500' : ''}`} />
                  <span>{post.likes} {t.likes}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4" />
                  <span>{post.replies.length} {t.answers}</span>
                </div>
              </div>

              {/* Thread comments section list */}
              {post.replies.length > 0 && (
                <div className="bg-slate-50 dark:bg-slate-800/20 rounded-2xl p-4 space-y-4 border-2 border-slate-100 dark:border-slate-850">
                  {post.replies.map((reply) => (
                    <div key={reply.id} className="flex gap-3 text-xs border-b border-slate-100 dark:border-slate-850 last:border-0 pb-3 last:pb-0">
                      <img src={reply.avatar} alt={reply.author} className="w-7 h-7 rounded-full object-cover shrink-0 border-2 border-slate-200 dark:border-slate-800" />
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-slate-850 dark:text-slate-200 uppercase tracking-tight text-3xs">@{reply.author}</span>
                          <span className="text-3xs text-slate-400 font-mono font-bold">{reply.date}</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-bold">
                          {reply.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Active reply input block */}
              <div className="flex gap-2">
                <input
                  id={`reply-input-${post.id}`}
                  type="text"
                  placeholder={t.replyPlaceholder}
                  value={replyInputs[post.id] || ''}
                  onChange={(e) => handleReplyChange(post.id, e.target.value)}
                  className="flex-1 bg-slate-50 dark:bg-slate-800/40 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#58CC02]"
                />
                <button
                  id={`reply-submit-${post.id}`}
                  onClick={() => handleAddReply(post.id)}
                  className="p-2.5 bg-[#58CC02] hover:bg-emerald-500 text-white rounded-xl shadow-md transition-all flex items-center justify-center border-b-2 border-emerald-700 active:border-b-0 active:translate-y-[2px] cursor-pointer"
                >
                  <Send className="w-4.5 h-4.5 stroke-[2.5]" />
                </button>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
