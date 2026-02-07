import React, { useState, useMemo, useEffect } from 'react';
import { Heart, Shield, Trash2, Send, User, CheckCircle, AlertCircle } from 'lucide-react';

// --- MOCK DATA ---
const INITIAL_USERS = [
  { id: 'u1', name: 'Sarah Chen', role: 'Engineer' },
  { id: 'u2', name: 'James Wilson', role: 'Designer' },
  { id: 'u3', name: 'Alex Rivera', role: 'Manager' },
  { id: 'u4', name: 'Jordan Smith', role: 'Admin' },
];

const INITIAL_KUDOS = [
  {
    id: 'k1',
    senderId: 'u1',
    receiverId: 'u2',
    message: 'Great work on the UI redesign, James! The tokens look amazing.',
    isVisible: true,
    createdAt: new Date(Date.now() - 1000000).toISOString(),
  },
  {
    id: 'k2',
    senderId: 'u3',
    receiverId: 'u1',
    message: 'Sarah, thanks for staying late to fix that critical bug.',
    isVisible: true,
    createdAt: new Date(Date.now() - 500000).toISOString(),
  }
];

export default function App() {
  const [users] = useState(INITIAL_USERS);
  const [kudos, setKudos] = useState(INITIAL_KUDOS);
  const [currentUser] = useState(INITIAL_USERS[0]); // Simulation: logged in as Sarah
  const [isAdmin, setIsAdmin] = useState(false);
  const [view, setView] = useState('feed'); // 'feed' | 'admin'

  // Form State
  const [receiverId, setReceiverId] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null);

  // --- LOGIC ---
  const handleSendKudos = (e) => {
    e.preventDefault();
    if (!receiverId || !message.trim()) return;
    if (message.length > 500) return;

    const newKudos = {
      id: `k-${Date.now()}`,
      senderId: currentUser.id,
      receiverId,
      message,
      isVisible: true,
      createdAt: new Date().toISOString(),
    };

    setKudos([newKudos, ...kudos]);
    setReceiverId('');
    setMessage('');
    setStatus('Kudos sent successfully!');
    setTimeout(() => setStatus(null), 3000);
  };

  const toggleVisibility = (id) => {
    setKudos(prev => prev.map(k => 
      k.id === id ? { ...k, isVisible: !k.isVisible, moderatedAt: new Date().toISOString() } : k
    ));
  };

  const visibleKudos = useMemo(() => kudos.filter(k => k.isVisible), [kudos]);

  const getUserName = (id) => users.find(u => u.id === id)?.name || 'Unknown';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navigation */}
      <nav className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-indigo-600 text-xl">
            <Heart className="fill-current" />
            <span>KudosPortal</span>
          </div>
          <div className="flex gap-4 items-center">
            <button 
              onClick={() => setView('feed')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${view === 'feed' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600'}`}
            >
              Public Feed
            </button>
            <button 
              onClick={() => { setView('admin'); setIsAdmin(true); }}
              className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium ${view === 'admin' ? 'bg-red-50 text-red-600' : 'text-slate-600'}`}
            >
              <Shield size={16} /> Admin
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-4 md:p-8">
        {view === 'feed' ? (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Left Column: Form */}
            <div className="md:col-span-1">
              <div className="bg-white p-6 rounded-xl border shadow-sm sticky top-24">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  Give Kudos
                </h2>
                <form onSubmit={handleSendKudos} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">To Colleague</label>
                    <select 
                      value={receiverId}
                      onChange={(e) => setReceiverId(e.target.value)}
                      className="w-full border rounded-lg p-2 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                      required
                    >
                      <option value="">Select a person...</option>
                      {users.filter(u => u.id !== currentUser.id).map(user => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <div className="flex justify-between items-end mb-1">
                      <label className="block text-xs font-bold uppercase text-slate-500">Message</label>
                      <span className={`text-[10px] ${message.length > 450 ? 'text-red-500' : 'text-slate-400'}`}>
                        {message.length}/500
                      </span>
                    </div>
                    <textarea 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Why are they awesome?"
                      className="w-full border rounded-lg p-2 bg-slate-50 h-32 resize-none focus:ring-2 focus:ring-indigo-500 outline-none"
                      required
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                  >
                    <Send size={16} /> Submit
                  </button>
                  {status && (
                    <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded border border-green-100">
                      <CheckCircle size={14} /> {status}
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Right Column: Feed */}
            <div className="md:col-span-2 space-y-4">
              <h2 className="text-xl font-bold text-slate-800">Recent Appreciation</h2>
              {visibleKudos.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed text-slate-400">
                  No kudos yet. Be the first!
                </div>
              ) : (
                visibleKudos.map(item => (
                  <div key={item.id} className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                        {getUserName(item.receiverId).charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          <span className="text-indigo-600 font-bold">{getUserName(item.senderId)}</span>
                          <span className="text-slate-400 mx-2">gave kudos to</span>
                          <span className="text-indigo-600 font-bold">{getUserName(item.receiverId)}</span>
                        </p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-slate-700 leading-relaxed italic border-l-4 border-indigo-100 pl-4 py-1">
                      "{item.message}"
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          /* Admin View */
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Shield className="text-red-500" /> Moderation Panel
              </h2>
              <button 
                onClick={() => setView('feed')}
                className="text-sm text-slate-500 hover:underline"
              >
                Back to Feed
              </button>
            </div>
            
            <div className="bg-white rounded-xl border overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="p-4 font-bold text-slate-600">From/To</th>
                    <th className="p-4 font-bold text-slate-600">Message</th>
                    <th className="p-4 font-bold text-slate-600">Status</th>
                    <th className="p-4 font-bold text-slate-600">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {kudos.map(item => (
                    <tr key={item.id} className={!item.isVisible ? 'bg-slate-50' : ''}>
                      <td className="p-4">
                        <div className="font-medium text-slate-900">{getUserName(item.senderId)}</div>
                        <div className="text-slate-400 text-xs">→ {getUserName(item.receiverId)}</div>
                      </td>
                      <td className="p-4 max-w-xs truncate text-slate-600">
                        {item.message}
                      </td>
                      <td className="p-4">
                        {item.isVisible ? (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase">Public</span>
                        ) : (
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-[10px] font-bold uppercase">Hidden</span>
                        )}
                      </td>
                      <td className="p-4">
                        <button 
                          onClick={() => toggleVisibility(item.id)}
                          className={`p-2 rounded-lg transition ${item.isVisible ? 'text-slate-400 hover:bg-red-50 hover:text-red-500' : 'text-red-500 hover:bg-green-50 hover:text-green-600'}`}
                          title={item.isVisible ? "Hide Message" : "Restore Message"}
                        >
                          {item.isVisible ? <Trash2 size={18} /> : <CheckCircle size={18} />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
