import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ChatInterface() {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'I have analyzed the document. Ask me anything about specific clauses or risks.' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [thinking, setThinking] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages, thinking]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);
        setThinking(true);

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            const response = await fetch(`${apiUrl}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: input,
                    history: messages
                }),
            });

            const data = await response.json();
            setThinking(false);
            setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
        } catch (error) {
            setThinking(false);
            setMessages(prev => [...prev, { role: 'assistant', content: "Error communicating with the Agent. Check backend connection." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] border-3 border-ink shadow-brutal bg-paper relative">
            {/* Header */}
            <div className="bg-ink text-paper p-4 flex justify-between items-center border-b-3 border-ink shrink-0">
                <div className="flex items-center gap-2 font-bold font-mono text-lg uppercase">
                    <Bot className="w-6 h-6" />
                    <span>Legal_Assistant_Bot_v1</span>
                </div>
                <span className="text-xs bg-paper text-ink px-2 py-1 font-bold border-2 border-transparent relative">
                    <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                    ONLINE
                </span>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-[url('data:image/gray;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzhhYWGMYAEYB8RmROaABADeOQ8CXl/xfgAAAABJRU5ErkJggg==')] bg-opacity-5 scroll-smooth">
                AnimatePresence
                {messages.map((msg, idx) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={idx}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[85%] md:max-w-[75%] p-4 border-2 border-ink shadow-brutal-sm text-sm ${msg.role === 'user'
                                    ? 'bg-ink text-white'
                                    : 'bg-white text-ink'
                                }`}
                        >
                            <div className="flex items-center gap-2 mb-2 opacity-50 text-xs font-bold uppercase font-mono border-b border-current pb-1 w-full">
                                {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                                {msg.role === 'user' ? 'YOU' : 'AGENT'}
                            </div>
                            <div className={`prose prose-sm max-w-none ${msg.role === 'user' ? 'prose-invert' : ''}`}>
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {msg.content}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {thinking && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                    >
                        <div className="bg-white border-2 border-ink p-4 shadow-brutal-sm flex items-center gap-3">
                            <Sparkles className="w-4 h-4 text-ink animate-spin" />
                            <span className="font-mono text-xs font-bold uppercase animate-pulse">Thinking...</span>
                            <div className="flex space-x-1">
                                <div className="w-1.5 h-1.5 bg-ink animate-bounce"></div>
                                <div className="w-1.5 h-1.5 bg-ink animate-bounce delay-75"></div>
                                <div className="w-1.5 h-1.5 bg-ink animate-bounce delay-150"></div>
                            </div>
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-4 bg-white border-t-3 border-ink flex gap-4 shrink-0">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="QUERY_THE_DOCUMENT..."
                    className="flex-1 p-3 font-mono border-2 border-ink focus:outline-none focus:shadow-brutal-sm transition-all placeholder:text-gray-400"
                    disabled={loading}
                />
                <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="bg-ink text-paper px-6 py-2 font-bold font-mono uppercase hover:translate-y-1 hover:shadow-none shadow-brutal transition-all disabled:opacity-50 disabled:shadow-none disabled:translate-y-1 cursor-pointer flex items-center gap-2"
                >
                    <Send className="w-5 h-5" />
                    <span className="hidden md:inline">SEND</span>
                </button>
            </form>
        </div>
    );
}
