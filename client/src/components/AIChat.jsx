/**
 * This is a product of Scalovate Systems Solutions.
 * All rights reserved.
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PaperAirplaneIcon,
  SparklesIcon,
  UserIcon,
  CpuChipIcon,
  PaperClipIcon,
  FaceSmileIcon,
  PhoneIcon,
  VideoCameraIcon,
  CalendarIcon,
  DocumentTextIcon,
  XMarkIcon,
  CheckIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

const AIChat = ({ context, initialMessage, candidateId, isRecruiterChat = true }) => {
  const { user, userProfile } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('online');
  const [showScheduler, setShowScheduler] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadChatHistory();
    if (initialMessage) {
      sendMessage(initialMessage, true);
    }
  }, [candidateId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    generateAISuggestions();
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      // Simulate loading chat history
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockHistory = candidateId ? [
        {
          id: 1,
          sender: 'candidate',
          senderName: 'Sarah Johnson',
          content: 'Hi! Thank you for reaching out about the React Developer position. I\'m very interested in learning more.',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          type: 'text',
          status: 'read'
        },
        {
          id: 2,
          sender: 'recruiter',
          senderName: userProfile?.firstName || 'Recruiter',
          content: 'Great to hear from you, Sarah! I\'ve reviewed your profile and think you\'d be a perfect fit. The role involves leading frontend development for enterprise applications. Are you available for a quick call this week?',
          timestamp: new Date(Date.now() - 3000000).toISOString(),
          type: 'text',
          status: 'read'
        },
        {
          id: 3,
          sender: 'candidate',
          senderName: 'Sarah Johnson',
          content: 'Absolutely! I\'m available Tuesday or Wednesday afternoon. Should I prepare anything specific for the call?',
          timestamp: new Date(Date.now() - 2400000).toISOString(),
          type: 'text',
          status: 'read'
        }
      ] : [];
      
      setMessages(mockHistory);
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const generateAISuggestions = async () => {
    if (messages.length === 0) return;
    
    try {
      // Simulate AI suggestion generation
      const lastMessage = messages[messages.length - 1];
      
      if (lastMessage.sender === 'candidate') {
        const suggestions = [
          "That sounds great! Let's schedule a call to discuss the details.",
          "I'd love to hear more about your experience with React.",
          "When would be a good time for a quick conversation?",
          "Let me share the job description with you."
        ];
        setAiSuggestions(suggestions);
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
    }
  };

  const sendMessage = async (messageContent = newMessage, isInitial = false) => {
    if (!messageContent.trim() && !isInitial) return;

    const message = {
      id: Date.now(),
      sender: isRecruiterChat ? 'recruiter' : 'candidate',
      senderName: userProfile?.firstName || (isRecruiterChat ? 'Recruiter' : 'Candidate'),
      content: messageContent,
      timestamp: new Date().toISOString(),
      type: 'text',
      status: 'sending'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    setShowSuggestions(false);

    try {
      // Simulate message sending
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update message status
      setMessages(prev => 
        prev.map(msg => 
          msg.id === message.id 
            ? { ...msg, status: 'sent' }
            : msg
        )
      );

      // Simulate delivery confirmation
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === message.id 
              ? { ...msg, status: 'delivered' }
              : msg
          )
        );
      }, 1000);

      // Simulate read receipt
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === message.id 
              ? { ...msg, status: 'read' }
              : msg
          )
        );
      }, 2000);

      // Auto-generate response if needed
      if (isRecruiterChat && !isInitial) {
        setTimeout(() => {
          generateAutoResponse(messageContent);
        }, 3000);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => 
        prev.map(msg => 
          msg.id === message.id 
            ? { ...msg, status: 'failed' }
            : msg
        )
      );
    }
  };

  const generateAutoResponse = async (originalMessage) => {
    setIsTyping(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate contextual response
      let response = '';
      const lowerMessage = originalMessage.toLowerCase();
      
      if (lowerMessage.includes('schedule') || lowerMessage.includes('call') || lowerMessage.includes('meeting')) {
        response = "I'm available for a call! Let me check my calendar and get back to you with some time slots.";
      } else if (lowerMessage.includes('salary') || lowerMessage.includes('compensation')) {
        response = "I'm open to discussing compensation. Could you share the salary range for this position?";
      } else if (lowerMessage.includes('remote') || lowerMessage.includes('work from home')) {
        response = "Yes, I'm very comfortable with remote work. I have a great home office setup and experience collaborating with distributed teams.";
      } else if (lowerMessage.includes('experience') || lowerMessage.includes('background')) {
        response = "I'd be happy to discuss my experience in more detail. Would you like me to walk you through my most relevant projects?";
      } else {
        response = "Thank you for the information! I'm very interested in moving forward. What would be the next step in the process?";
      }

      const autoMessage = {
        id: Date.now(),
        sender: 'candidate',
        senderName: 'Sarah Johnson',
        content: response,
        timestamp: new Date().toISOString(),
        type: 'text',
        status: 'read'
      };

      setMessages(prev => [...prev, autoMessage]);
    } catch (error) {
      console.error('Error generating auto response:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const useSuggestion = (suggestion) => {
    setNewMessage(suggestion);
    setShowSuggestions(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMessageStatusIcon = (status) => {
    switch (status) {
      case 'sending':
        return <ClockIcon className="w-3 h-3 text-gray-400" />;
      case 'sent':
        return <CheckIcon className="w-3 h-3 text-gray-400" />;
      case 'delivered':
        return (
          <div className="flex">
            <CheckIcon className="w-3 h-3 text-gray-400" />
            <CheckIcon className="w-3 h-3 text-gray-400 -ml-1" />
          </div>
        );
      case 'read':
        return (
          <div className="flex">
            <CheckIcon className="w-3 h-3 text-blue-500" />
            <CheckIcon className="w-3 h-3 text-blue-500 -ml-1" />
          </div>
        );
      case 'failed':
        return <ExclamationTriangleIcon className="w-3 h-3 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <UserIcon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              {candidateId ? 'Sarah Johnson' : 'Chat'}
            </h3>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                connectionStatus === 'online' ? 'bg-green-500' : 
                connectionStatus === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
              }`}></div>
              <span className="text-xs text-muted-foreground">
                {connectionStatus === 'online' ? 'Online' : 
                 connectionStatus === 'away' ? 'Away' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="btn btn-outline btn-sm">
            <PhoneIcon className="w-4 h-4" />
          </button>
          <button className="btn btn-outline btn-sm">
            <VideoCameraIcon className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setShowScheduler(true)}
            className="btn btn-outline btn-sm"
          >
            <CalendarIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${
                message.sender === (isRecruiterChat ? 'recruiter' : 'candidate') 
                  ? 'justify-end' 
                  : 'justify-start'
              }`}
            >
              <div className={`max-w-xs lg:max-w-md ${
                message.sender === (isRecruiterChat ? 'recruiter' : 'candidate')
                  ? 'order-2'
                  : 'order-1'
              }`}>
                <div className={`px-4 py-2 rounded-lg ${
                  message.sender === (isRecruiterChat ? 'recruiter' : 'candidate')
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}>
                  <p className="text-sm">{message.content}</p>
                </div>
                <div className={`flex items-center mt-1 space-x-2 ${
                  message.sender === (isRecruiterChat ? 'recruiter' : 'candidate')
                    ? 'justify-end'
                    : 'justify-start'
                }`}>
                  <span className="text-xs text-muted-foreground">
                    {formatTime(message.timestamp)}
                  </span>
                  {message.sender === (isRecruiterChat ? 'recruiter' : 'candidate') && (
                    <div className="flex items-center">
                      {getMessageStatusIcon(message.status)}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-muted px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-1">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-xs text-muted-foreground ml-2">typing...</span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* AI Suggestions */}
      {showSuggestions && aiSuggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-2 border-t border-border bg-muted/30"
        >
          <div className="flex items-center space-x-2 mb-2">
            <SparklesIcon className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-primary">AI Suggestions</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {aiSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => useSuggestion(suggestion)}
                className="px-3 py-1 bg-background border border-border rounded-full text-xs hover:bg-accent transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Message Input */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex items-end space-x-2">
          <button className="btn btn-outline btn-sm">
            <PaperClipIcon className="w-4 h-4" />
          </button>
          
          <div className="flex-1 min-h-10 max-h-32">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="w-full resize-none border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              rows="1"
              style={{
                minHeight: '40px',
                height: 'auto',
                overflow: 'hidden'
              }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
            />
          </div>

          <div className="flex items-center space-x-2">
            <button className="btn btn-outline btn-sm">
              <FaceSmileIcon className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => sendMessage()}
              disabled={!newMessage.trim()}
              className="btn btn-primary btn-sm"
            >
              <PaperAirplaneIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Meeting Scheduler Modal */}
      {showScheduler && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg shadow-xl w-full max-w-md m-4">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Schedule Meeting</h3>
              <button
                onClick={() => setShowScheduler(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Meeting Type</label>
                <select className="input w-full">
                  <option>Phone Interview</option>
                  <option>Video Call</option>
                  <option>In-Person Meeting</option>
                  <option>Coffee Chat</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Date & Time</label>
                <input type="datetime-local" className="input w-full" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Duration</label>
                <select className="input w-full">
                  <option>30 minutes</option>
                  <option>45 minutes</option>
                  <option>1 hour</option>
                  <option>1.5 hours</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Notes</label>
                <textarea
                  className="input w-full h-20 resize-none"
                  placeholder="Add any notes or agenda items..."
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 p-4 border-t">
              <button
                onClick={() => setShowScheduler(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowScheduler(false);
                  // Add meeting scheduling logic here
                  const meetingMessage = {
                    id: Date.now(),
                    sender: isRecruiterChat ? 'recruiter' : 'candidate',
                    senderName: userProfile?.firstName || 'Recruiter',
                    content: '📅 Meeting scheduled for tomorrow at 2:00 PM - Phone Interview (30 minutes)',
                    timestamp: new Date().toISOString(),
                    type: 'system',
                    status: 'read'
                  };
                  setMessages(prev => [...prev, meetingMessage]);
                }}
                className="btn btn-primary"
              >
                Schedule Meeting
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChat; 