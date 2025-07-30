import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import {
  Send,
  Upload,
  FileText,
  Trash2,
  Loader2,
  MessageSquare,
  Bot,
  User,
  Plus,
  Clock,
  Paperclip,
  ChevronRight,
  FileEdit,
  Eye,
  EyeOff,
  X,
  Share2,
  Check,
  Copy,
  Download
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  streaming?: boolean;
  citations?: Citation[];
}

interface Document {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  chunks?: number;
  enabled?: boolean;
}

interface Citation {
  id: number;
  documentName: string;
  text: string;
  score: number;
}

interface Chunk {
  id: number;
  documentName: string;
  text: string;
  score: number;
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showDocumentDrawer, setShowDocumentDrawer] = useState(false);
  const [highlightedChunk, setHighlightedChunk] = useState<Chunk | null>(null);
  const [showChunkModal, setShowChunkModal] = useState(false);
  const [currentChunks, setCurrentChunks] = useState<Chunk[]>([]);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [sharingMessageId, setSharingMessageId] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const response = await fetch('/api/chat/conversations');
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations);
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  const loadConversation = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/chat/conversations/${conversationId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
        setDocuments(data.documents);
        setCurrentConversationId(conversationId);
      }
    } catch (error) {
      console.error('Failed to load conversation:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });

    if (currentConversationId) {
      formData.append('conversationId', currentConversationId);
    }

    try {
      const response = await fetch('/api/chat/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        // Add documents with enabled flag set to true by default
        const newDocs = data.documents.map((doc: Document) => ({ ...doc, enabled: true }));
        setDocuments(prev => [...prev, ...newDocs]);
        
        // Create new conversation if needed
        if (!currentConversationId && data.conversationId) {
          setCurrentConversationId(data.conversationId);
          await loadConversations();
        }
      } else {
        console.error('Upload failed:', await response.text());
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      streaming: true,
    };

    setMessages(prev => [...prev, assistantMessage]);

    try {
      // Only send enabled documents
      const enabledDocumentIds = documents
        .filter(doc => doc.enabled !== false)
        .map(doc => doc.id);

      const response = await fetch('/api/chat/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputValue,
          conversationId: currentConversationId,
          documentIds: enabledDocumentIds,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let accumulatedContent = '';
        let citations: Citation[] = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                
                if (data.chunks) {
                  // Store chunks for citation references
                  setCurrentChunks(data.chunks);
                  citations = data.chunks;
                }
                
                if (data.content) {
                  accumulatedContent += data.content;
                  setMessages(prev =>
                    prev.map(msg =>
                      msg.id === assistantMessage.id
                        ? { ...msg, content: accumulatedContent, citations }
                        : msg
                    )
                  );
                }

                if (data.conversationId && !currentConversationId) {
                  setCurrentConversationId(data.conversationId);
                  await loadConversations();
                }
              } catch (e) {
                console.error('Failed to parse SSE data:', e);
              }
            }
          }
        }

        // Mark streaming as complete
        setMessages(prev => 
          prev.map(msg => 
            msg.id === assistantMessage.id 
              ? { ...msg, streaming: false }
              : msg
          )
        );
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => 
        prev.map(msg => 
          msg.id === assistantMessage.id 
            ? { ...msg, content: 'Sorry, an error occurred. Please try again.', streaming: false }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      const response = await fetch(`/api/chat/documents/${documentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      }
    } catch (error) {
      console.error('Failed to delete document:', error);
    }
  };

  const handleNewConversation = () => {
    setCurrentConversationId(null);
    setMessages([]);
    setDocuments([]);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const toggleDocumentEnabled = (documentId: string) => {
    setDocuments(prev =>
      prev.map(doc =>
        doc.id === documentId
          ? { ...doc, enabled: !doc.enabled }
          : doc
      )
    );
  };

  const handleCitationClick = (citationNumber: number) => {
    const chunk = currentChunks.find(c => c.id === citationNumber);
    if (chunk) {
      setHighlightedChunk(chunk);
      setShowChunkModal(true);
    }
  };

  const renderMessageWithCitations = (content: string, citations?: Citation[]) => {
    if (!citations || citations.length === 0) {
      return <span className="whitespace-pre-wrap">{content}</span>;
    }

    // Parse content for citation markers ^[n]
    const parts = content.split(/(\^\[\d+\])/g);
    
    return (
      <span className="whitespace-pre-wrap">
        {parts.map((part, index) => {
          const citationMatch = part.match(/\^\[(\d+)\]/);
          if (citationMatch) {
            const citationNumber = parseInt(citationMatch[1]);
            return (
              <button
                key={index}
                onClick={() => handleCitationClick(citationNumber)}
                className="inline-flex items-center justify-center w-5 h-5 text-xs rounded-full bg-primary/20 text-primary hover:bg-primary/30 transition-colors align-super ml-0.5"
                title={`View source ${citationNumber}`}
              >
                {citationNumber}
              </button>
            );
          }
          return <span key={index}>{part}</span>;
        })}
      </span>
    );
  };

  const handleShareMessage = async (messageId: string) => {
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1) return;

    // Find the user message (question) for this assistant response
    let questionIndex = messageIndex;
    if (messages[messageIndex].role === 'assistant') {
      // Look backwards for the nearest user message
      for (let i = messageIndex - 1; i >= 0; i--) {
        if (messages[i].role === 'user') {
          questionIndex = i;
          break;
        }
      }
    }

    const question = messages[questionIndex].content;
    const answer = messages[messageIndex].role === 'assistant'
      ? messages[messageIndex].content
      : messages[messageIndex + 1]?.content || '';

    setSharingMessageId(messageId);

    try {
      const response = await fetch('/api/chat/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          answer,
          citations: messages[messageIndex].citations || currentChunks
        })
      });

      if (response.ok) {
        const data = await response.json();
        setShareUrl(data.shareUrl);
        setShareModalOpen(true);
      } else {
        console.error('Failed to create share link');
      }
    } catch (error) {
      console.error('Error sharing message:', error);
    } finally {
      setSharingMessageId(null);
    }
  };

  const handleCopyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleExportConversation = async (format: 'markdown' | 'json') => {
    if (!currentConversationId || messages.length === 0) return;

    try {
      const response = await fetch('/api/chat/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: currentConversationId,
          format
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `conversation-${currentConversationId}.${format === 'markdown' ? 'md' : 'json'}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error('Failed to export conversation');
      }
    } catch (error) {
      console.error('Error exporting conversation:', error);
    }
  };

  return (
    <div className="flex h-full">
      {/* Left Sidebar - Conversation History */}
      <div className="w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex flex-col">
        <div className="p-4 border-b">
          <Button
            className="w-full gradient-metallic-primary"
            onClick={handleNewConversation}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            {conversations.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <MessageSquare className="w-8 h-8 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No conversations yet</p>
                <p className="text-xs mt-1">Start a new chat to begin</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => loadConversation(conv.id)}
                  className={`w-full text-left p-3 rounded-lg transition-all group relative ${
                    conv.id === currentConversationId
                      ? 'bg-gradient-to-r from-gradient-metal-start to-gradient-metal-end text-white shadow-sm'
                      : 'hover:bg-muted/80'
                  }`}
                >
                  <div className="pr-6">
                    <p className={`font-medium text-sm truncate ${
                      conv.id === currentConversationId ? 'text-white' : ''
                    }`}>
                      {conv.title}
                    </p>
                    <p className={`text-xs truncate mt-1 ${
                      conv.id === currentConversationId
                        ? 'text-white/80'
                        : 'text-muted-foreground'
                    }`}>
                      {conv.lastMessage}
                    </p>
                    <div className={`flex items-center gap-1 mt-1 text-xs ${
                      conv.id === currentConversationId
                        ? 'text-white/60'
                        : 'text-muted-foreground'
                    }`}>
                      <Clock className="w-3 h-3" />
                      {new Date(conv.timestamp).toLocaleDateString()}
                    </div>
              
                    {/* Document Drawer */}
                    {showDocumentDrawer && (
                      <div className="w-80 border-l bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex flex-col">
                        <div className="p-4 border-b flex items-center justify-between">
                          <h3 className="font-semibold">Uploaded Documents</h3>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowDocumentDrawer(false)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <ScrollArea className="flex-1">
                          <div className="p-4 space-y-3">
                            {documents.length === 0 ? (
                              <div className="text-center text-muted-foreground py-8">
                                <FileText className="w-8 h-8 mx-auto mb-3 opacity-50" />
                                <p className="text-sm">No documents uploaded</p>
                              </div>
                            ) : (
                              documents.map((doc) => (
                                <Card key={doc.id} className="p-3">
                                  <div className="flex items-start gap-3">
                                    <FileText className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                          <p className="font-medium text-sm truncate">{doc.name}</p>
                                          <p className="text-xs text-muted-foreground">
                                            {formatFileSize(doc.size)} • {doc.chunks} chunks
                                          </p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="w-8 h-8"
                                            onClick={() => toggleDocumentEnabled(doc.id)}
                                            title={doc.enabled ? 'Disable document' : 'Enable document'}
                                          >
                                            {doc.enabled ? (
                                              <Eye className="w-4 h-4" />
                                            ) : (
                                              <EyeOff className="w-4 h-4 text-muted-foreground" />
                                            )}
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="w-8 h-8 hover:text-destructive"
                                            onClick={() => handleDeleteDocument(doc.id)}
                                          >
                                            <Trash2 className="w-4 h-4" />
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </Card>
                              ))
                            )}
                          </div>
                        </ScrollArea>
                        
                        <div className="p-4 border-t">
                          <Button
                            className="w-full"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                          >
                            {isUploading ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Documents
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
              
                    {/* Citation Modal */}
                    <Dialog open={showChunkModal} onOpenChange={setShowChunkModal}>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Source: {highlightedChunk?.documentName}
                          </DialogTitle>
                        </DialogHeader>
                        <ScrollArea className="flex-1 mt-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span className="font-medium">Relevance:</span>
                              <span>{highlightedChunk ? (highlightedChunk.score * 100).toFixed(1) : 0}%</span>
                            </div>
                            <div className="p-4 bg-muted rounded-lg">
                              <pre className="whitespace-pre-wrap text-sm font-mono">
                                {highlightedChunk?.text}
                              </pre>
                            </div>
                          </div>
                        </ScrollArea>
                      </DialogContent>
                    </Dialog>
              
                    {/* Share Modal */}
                    <Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Share2 className="w-5 h-5" />
                            Share This Conversation
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          <p className="text-sm text-muted-foreground">
                            Anyone with this link can view this Q&A snippet. The link will expire in 30 days.
                          </p>
                          <div className="flex gap-2">
                            <Input
                              value={shareUrl}
                              readOnly
                              className="font-mono text-xs"
                            />
                            <Button
                              onClick={handleCopyShareLink}
                              variant="outline"
                              size="icon"
                              className="flex-shrink-0"
                            >
                              {copySuccess ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                          {copySuccess && (
                            <p className="text-sm text-green-600">Link copied to clipboard!</p>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header Bar */}
        <div className="border-b px-6 py-3 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bot className="w-5 h-5 text-primary" />
              <h2 className="font-semibold">AI Assistant</h2>
            </div>
            <div className="flex items-center gap-2">
              {documents.length > 0 && (
                <button
                  onClick={() => setShowDocumentDrawer(!showDocumentDrawer)}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Paperclip className="w-4 h-4" />
                  <span>{documents.length} document{documents.length !== 1 ? 's' : ''}</span>
                  <ChevronRight className={`w-4 h-4 transition-transform ${showDocumentDrawer ? 'rotate-90' : ''}`} />
                </button>
              )}
              
              {/* Export dropdown */}
              {currentConversationId && messages.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="ml-2">
                      <Download className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleExportConversation('markdown')}>
                      <FileText className="w-4 h-4 mr-2" />
                      Export as Markdown
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExportConversation('json')}>
                      <FileText className="w-4 h-4 mr-2" />
                      Export as JSON
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <ScrollArea className="flex-1 px-6">
          <div className="max-w-3xl mx-auto py-6">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-gradient-metal-start to-gradient-metal-end mb-4">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">How can I help you today?</h3>
                <p className="text-muted-foreground mb-6">
                  Upload documents and ask questions to get started
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Documents
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-4 ${
                      message.role === 'assistant' ? '' : 'justify-end'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gradient-metal-start to-gradient-metal-end flex items-center justify-center flex-shrink-0">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div
                        className={`relative rounded-2xl px-4 py-3 max-w-[80%] group ${
                          message.role === 'assistant'
                            ? 'bg-muted'
                            : 'bg-gradient-to-r from-gradient-metal-start to-gradient-metal-end text-white'
                        }`}
                      >
                        <div className="text-sm leading-relaxed">
                          {renderMessageWithCitations(message.content, message.citations)}
                        </div>
                        {message.streaming && (
                          <span className="inline-block w-1 h-4 bg-current animate-pulse ml-1" />
                        )}
                        
                        {/* Share button for assistant messages */}
                        {message.role === 'assistant' && !message.streaming && (
                          <button
                            onClick={() => handleShareMessage(message.id)}
                            disabled={sharingMessageId === message.id}
                            className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity ${
                              message.role === 'assistant'
                                ? 'text-muted-foreground hover:text-foreground'
                                : 'text-white/70 hover:text-white'
                            }`}
                            title="Share this Q&A"
                          >
                            {sharingMessageId === message.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Share2 className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                      {message.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5" />
                        </div>
                      )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          {/* Documents Bar */}
          {documents.length > 0 && (
            <div className="px-6 py-3 border-b">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">Attached Documents</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-sm"
                  >
                    <FileText className="w-3 h-3" />
                    <span className="max-w-[150px] truncate">{doc.name}</span>
                    <button
                      onClick={() => handleDeleteDocument(doc.id)}
                      className="ml-1 hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Message Input */}
          <div className="px-6 py-4">
            <div className="max-w-3xl mx-auto">
              <div className="flex gap-2">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  size="icon"
                  disabled={isUploading}
                  className="flex-shrink-0"
                >
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Paperclip className="w-4 h-4" />
                  )}
                </Button>
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputValue.trim()}
                  className="gradient-metallic-primary flex-shrink-0"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".txt,.pdf,.doc,.docx,.md,.json,.csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}