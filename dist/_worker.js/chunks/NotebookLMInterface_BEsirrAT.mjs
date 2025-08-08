globalThis.process ??= {}; globalThis.process.env ??= {};
import { r as reactExports, j as jsxRuntimeExports, a4 as Root, a5 as Viewport, a6 as Corner, a7 as ScrollAreaScrollbar, a8 as ScrollAreaThumb, a9 as Overlay, aa as Portal, ab as Content, ac as Close, X, ad as Title, ae as Description, af as Root$1, ag as SubTrigger2, K as ChevronRight, ah as SubContent2, ai as Portal2, aj as Content2, ak as Item2, al as CheckboxItem2, am as ItemIndicator2, e as Check, an as RadioItem2, ao as Circle, ap as Label2, aq as Separator2, ar as Root2, as as Trigger, at as BookOpen, au as Search, L as LoaderCircle, av as FilePlus, aw as FolderOpen, ax as Eye, ay as EyeOff, az as Trash2, aA as Brain, M as MessageSquare, aB as Clock, aC as Sparkles, aD as Plus, aE as Download, W as FileText, h as CircleAlert, a3 as Bot, a1 as Share2, a2 as User, aF as Send, aG as Copy, aH as FileImage, aI as FileCode } from './react-vendor_BBaf1uT2.mjs';
import { B as Button } from './button_D4hUjemp.mjs';
import { I as Input } from './input_BA3f0EGX.mjs';
import { e as cn, C as Card } from './card_DRaKdq96.mjs';
import { A as Alert, b as AlertTitle, a as AlertDescription } from './alert_oZX2k7yW.mjs';
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from './tabs_BvJqzT84.mjs';

const ScrollArea = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  Root,
  {
    ref,
    className: cn("relative overflow-hidden", className),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Viewport, { className: "h-full w-full rounded-[inherit]", children }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollBar, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Corner, {})
    ]
  }
));
ScrollArea.displayName = Root.displayName;
const ScrollBar = reactExports.forwardRef(({ className, orientation = "vertical", ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  ScrollAreaScrollbar,
  {
    ref,
    orientation,
    className: cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaThumb, { className: "relative flex-1 rounded-full bg-border" })
  }
));
ScrollBar.displayName = ScrollAreaScrollbar.displayName;

const Dialog = Root$1;
const DialogPortal = Portal;
const DialogOverlay = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = Overlay.displayName;
const DialogContent = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = Content.displayName;
const DialogHeader = ({
  className,
  ...props
}) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    className: cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    ),
    ...props
  }
);
DialogHeader.displayName = "DialogHeader";
const DialogTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Title,
  {
    ref,
    className: cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    ),
    ...props
  }
));
DialogTitle.displayName = Title.displayName;
const DialogDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = Description.displayName;

const DropdownMenu = Root2;
const DropdownMenuTrigger = Trigger;
const DropdownMenuSubTrigger = reactExports.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  SubTrigger2,
  {
    ref,
    className: cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent",
      inset && "pl-8",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "ml-auto h-4 w-4" })
    ]
  }
));
DropdownMenuSubTrigger.displayName = SubTrigger2.displayName;
const DropdownMenuSubContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  SubContent2,
  {
    ref,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
));
DropdownMenuSubContent.displayName = SubContent2.displayName;
const DropdownMenuContent = reactExports.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Portal2, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content2,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
) }));
DropdownMenuContent.displayName = Content2.displayName;
const DropdownMenuItem = reactExports.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Item2,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
DropdownMenuItem.displayName = Item2.displayName;
const DropdownMenuCheckboxItem = reactExports.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  CheckboxItem2,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    checked,
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicator2, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }) }) }),
      children
    ]
  }
));
DropdownMenuCheckboxItem.displayName = CheckboxItem2.displayName;
const DropdownMenuRadioItem = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  RadioItem2,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicator2, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "h-2 w-2 fill-current" }) }) }),
      children
    ]
  }
));
DropdownMenuRadioItem.displayName = RadioItem2.displayName;
const DropdownMenuLabel = reactExports.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Label2,
  {
    ref,
    className: cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
DropdownMenuLabel.displayName = Label2.displayName;
const DropdownMenuSeparator = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Separator2,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
DropdownMenuSeparator.displayName = Separator2.displayName;

function NotebookLMInterface() {
  const [messages, setMessages] = reactExports.useState([]);
  const [documents, setDocuments] = reactExports.useState([]);
  const [conversations, setConversations] = reactExports.useState([]);
  const [currentConversationId, setCurrentConversationId] = reactExports.useState(null);
  const [inputValue, setInputValue] = reactExports.useState("");
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const [isUploading, setIsUploading] = reactExports.useState(false);
  const [selectedDocument, setSelectedDocument] = reactExports.useState(null);
  const [highlightedChunk, setHighlightedChunk] = reactExports.useState(null);
  const [showChunkModal, setShowChunkModal] = reactExports.useState(false);
  const [currentChunks, setCurrentChunks] = reactExports.useState([]);
  const [shareModalOpen, setShareModalOpen] = reactExports.useState(false);
  const [shareUrl, setShareUrl] = reactExports.useState("");
  const [sharingMessageId, setSharingMessageId] = reactExports.useState(null);
  const [copySuccess, setCopySuccess] = reactExports.useState(false);
  const [aiError, setAiError] = reactExports.useState(null);
  const [isStreaming, setIsStreaming] = reactExports.useState(false);
  const [activeTab, setActiveTab] = reactExports.useState("sources");
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [showDocumentPreview, setShowDocumentPreview] = reactExports.useState(false);
  const [documentContent, setDocumentContent] = reactExports.useState("");
  const fileInputRef = reactExports.useRef(null);
  const messagesEndRef = reactExports.useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  reactExports.useEffect(() => {
    scrollToBottom();
  }, [messages]);
  reactExports.useEffect(() => {
    loadConversations();
    loadDocuments();
  }, []);
  function isConversationList(data) {
    return !!data && typeof data === "object" && Array.isArray(data.conversations);
  }
  function isDocumentsList(data) {
    return !!data && typeof data === "object" && Array.isArray(data.documents);
  }
  function isConversationDetail(data) {
    return !!data && typeof data === "object" && Array.isArray(data.messages) && Array.isArray(data.documents);
  }
  function isUploadResponse(data) {
    return !!data && typeof data === "object" && Array.isArray(data.documents);
  }
  const loadConversations = async () => {
    try {
      const response = await fetch("/api/chat/conversations");
      if (response.ok) {
        const data = await response.json();
        if (isConversationList(data)) {
          setConversations(data.conversations);
        } else {
          console.warn("Unexpected conversations payload");
        }
      }
    } catch (error) {
      console.error("Failed to load conversations:", error);
    }
  };
  const loadDocuments = async () => {
    try {
      const response = await fetch("/api/chat/documents");
      if (response.ok) {
        const data = await response.json();
        if (isDocumentsList(data)) {
          setDocuments(data.documents);
        } else {
          console.warn("Unexpected documents payload");
        }
      }
    } catch (error) {
      console.error("Failed to load documents:", error);
    }
  };
  const loadConversation = async (conversationId) => {
    try {
      const response = await fetch(`/api/chat/conversations/${conversationId}`);
      if (response.ok) {
        const data = await response.json();
        if (isConversationDetail(data)) {
          setMessages(data.messages);
          setDocuments(data.documents);
          setCurrentConversationId(conversationId);
        } else {
          console.warn("Unexpected conversation detail payload");
        }
      }
    } catch (error) {
      console.error("Failed to load conversation:", error);
    }
  };
  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });
    if (currentConversationId) {
      formData.append("conversationId", currentConversationId);
    }
    try {
      const response = await fetch("/api/chat/upload", {
        method: "POST",
        body: formData
      });
      if (response.ok) {
        const data = await response.json();
        if (isUploadResponse(data)) {
          const newDocs = data.documents.map((doc) => ({ ...doc, enabled: true }));
          setDocuments((prev) => [...prev, ...newDocs]);
          if (!currentConversationId && data.conversationId) {
            setCurrentConversationId(data.conversationId);
            await loadConversations();
          }
        } else {
          console.warn("Unexpected upload response payload");
        }
      } else {
        console.error("Upload failed:", await response.text());
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || isStreaming) return;
    const messageToSend = inputValue.trim();
    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: messageToSend,
      timestamp: /* @__PURE__ */ new Date()
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setIsStreaming(true);
    setAiError(null);
    const assistantMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
      timestamp: /* @__PURE__ */ new Date(),
      streaming: true
    };
    setMessages((prev) => [...prev, assistantMessage]);
    try {
      const enabledDocumentIds = documents.filter((doc) => doc.enabled !== false).map((doc) => doc.id);
      const response = await fetch("/api/chat/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageToSend,
          conversationId: currentConversationId,
          documentIds: enabledDocumentIds
        })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (reader) {
        let accumulatedContent = "";
        let citations = [];
        let buffer = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const messages2 = buffer.split("\n\n");
          buffer = messages2.pop() || "";
          for (const message of messages2) {
            if (!message.trim()) continue;
            const lines = message.split("\n");
            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const dataStr = line.slice(6).trim();
                if (!dataStr || dataStr === "[DONE]") continue;
                try {
                  const data = JSON.parse(dataStr);
                  if (data.chunks) {
                    setCurrentChunks(data.chunks);
                    citations = data.chunks;
                  }
                  if (data.content) {
                    accumulatedContent += data.content;
                    setMessages(
                      (prev) => prev.map(
                        (msg) => msg.id === assistantMessage.id ? { ...msg, content: accumulatedContent, citations } : msg
                      )
                    );
                  }
                  if (data.conversationId && !currentConversationId) {
                    setCurrentConversationId(data.conversationId);
                    await loadConversations();
                  }
                  if (data.error) {
                    console.error("SSE Error:", data.error);
                    setMessages(
                      (prev) => prev.map(
                        (msg) => msg.id === assistantMessage.id ? { ...msg, content: data.error || "An error occurred", streaming: false } : msg
                      )
                    );
                    return;
                  }
                } catch (e) {
                  console.error("Failed to parse SSE data:", e, "Data:", dataStr);
                }
              }
            }
          }
        }
        if (buffer.trim()) {
          const lines = buffer.split("\n");
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const dataStr = line.slice(6).trim();
              if (dataStr && dataStr !== "[DONE]") {
                try {
                  const data = JSON.parse(dataStr);
                  if (data.content) {
                    accumulatedContent += data.content;
                  }
                } catch (e) {
                  console.error("Failed to parse final SSE data:", e);
                }
              }
            }
          }
        }
        setMessages(
          (prev) => prev.map(
            (msg) => msg.id === assistantMessage.id ? { ...msg, content: accumulatedContent || "No response received", streaming: false } : msg
          )
        );
      }
    } catch (error) {
      console.error("Chat error:", error);
      let errorMessage = "Sorry, an error occurred. Please try again.";
      let showErrorBanner = false;
      if (error instanceof Error) {
        if (error.message.includes("workers-ai-failed") || error.message.includes("AI service is at capacity") || error.message.includes("Rate limit exceeded") || error.message.includes("rate limit") || error.message.includes("Daily quota limit reached") || error.message.includes("AI service access denied") || error.message.includes("AI service is temporarily unavailable") || error.message.includes("AI service is not properly configured") || error.message.includes("Concurrency limit") || error.message.includes("concurrent")) {
          const parts = error.message.split(" - ");
          errorMessage = parts[0] || error.message;
          showErrorBanner = true;
          setAiError(errorMessage);
        }
      }
      setMessages(
        (prev) => prev.map(
          (msg) => msg.id === assistantMessage.id ? { ...msg, content: showErrorBanner ? "" : errorMessage, streaming: false } : msg
        )
      );
      if (showErrorBanner) {
        setMessages((prev) => prev.filter((msg) => msg.id !== assistantMessage.id));
      }
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };
  const handleDeleteDocument = async (documentId) => {
    try {
      const response = await fetch(`/api/chat/documents/${documentId}`, {
        method: "DELETE"
      });
      if (response.ok) {
        setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
      }
    } catch (error) {
      console.error("Failed to delete document:", error);
    }
  };
  const handleNewConversation = () => {
    setCurrentConversationId(null);
    setMessages([]);
    setDocuments([]);
  };
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };
  const toggleDocumentEnabled = (documentId) => {
    setDocuments(
      (prev) => prev.map(
        (doc) => doc.id === documentId ? { ...doc, enabled: !doc.enabled } : doc
      )
    );
  };
  const handleCitationClick = (citationNumber) => {
    const chunk = currentChunks.find((c) => c.id === citationNumber);
    if (chunk) {
      setHighlightedChunk(chunk);
      setShowChunkModal(true);
    }
  };
  const renderMessageWithCitations = (content, citations) => {
    if (!citations || citations.length === 0) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "whitespace-pre-wrap", children: content });
    }
    const parts = content.split(/(\^\[\d+\])/g);
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "whitespace-pre-wrap", children: parts.map((part, index) => {
      const citationMatch = part.match(/\^\[(\d+)\]/);
      if (citationMatch) {
        const citationNumber = parseInt(citationMatch[1]);
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => handleCitationClick(citationNumber),
            className: "inline-flex items-center justify-center w-5 h-5 text-xs rounded-full bg-primary/20 text-primary hover:bg-primary/30 transition-colors align-super ml-0.5",
            title: `View source ${citationNumber}`,
            children: citationNumber
          },
          index
        );
      }
      return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: part }, index);
    }) });
  };
  const handleShareMessage = async (messageId) => {
    const messageIndex = messages.findIndex((m) => m.id === messageId);
    if (messageIndex === -1) return;
    let questionIndex = messageIndex;
    if (messages[messageIndex].role === "assistant") {
      for (let i = messageIndex - 1; i >= 0; i--) {
        if (messages[i].role === "user") {
          questionIndex = i;
          break;
        }
      }
    }
    const question = messages[questionIndex].content;
    const answer = messages[messageIndex].role === "assistant" ? messages[messageIndex].content : messages[messageIndex + 1]?.content || "";
    setSharingMessageId(messageId);
    try {
      const response = await fetch("/api/chat/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          answer,
          citations: messages[messageIndex].citations || currentChunks
        })
      });
      if (response.ok) {
        const data = await response.json();
        const isShare = (v) => !!v && typeof v === "object" && typeof v.shareUrl === "string";
        if (isShare(data)) {
          setShareUrl(data.shareUrl);
          setShareModalOpen(true);
        } else {
          console.warn("Unexpected share payload");
        }
      } else {
        console.error("Failed to create share link");
      }
    } catch (error) {
      console.error("Error sharing message:", error);
    } finally {
      setSharingMessageId(null);
    }
  };
  const handleCopyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2e3);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };
  const handleExportConversation = async (format) => {
    if (!currentConversationId || messages.length === 0) return;
    try {
      const response = await fetch("/api/chat/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: currentConversationId,
          format
        })
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `conversation-${currentConversationId}.${format === "markdown" ? "md" : "json"}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error("Failed to export conversation");
      }
    } catch (error) {
      console.error("Error exporting conversation:", error);
    }
  };
  const handleDocumentClick = async (document2) => {
    setSelectedDocument(document2);
    setShowDocumentPreview(true);
    try {
      const response = await fetch(`/api/chat/documents/${document2.id}`);
      if (response.ok) {
        const data = await response.json();
        const isDocContent = (v) => !!v && typeof v === "object" && ("content" in v ? typeof v.content === "string" || typeof v.content === "undefined" : true);
        if (isDocContent(data)) {
          setDocumentContent(data.content || "No preview available");
        } else {
          console.warn("Unexpected document content payload");
          setDocumentContent("No preview available");
        }
      }
    } catch (error) {
      console.error("Failed to load document content:", error);
      setDocumentContent("Failed to load document content");
    }
  };
  const getFileIcon = (fileType) => {
    if (fileType.includes("image")) return FileImage;
    if (fileType.includes("code") || fileType.includes("json")) return FileCode;
    return FileText;
  };
  const filteredDocuments = documents.filter(
    (doc) => doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-96 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-5 h-5 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold", children: "NotebookLM" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full grid-cols-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "sources", children: "Sources" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "notebook", children: "Notebook" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "history", children: "History" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "sources", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "Search documents...",
                  value: searchQuery,
                  onChange: (e) => setSearchQuery(e.target.value),
                  className: "pl-9"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                className: "w-full gradient-metallic-primary",
                onClick: () => fileInputRef.current?.click(),
                disabled: isUploading,
                children: isUploading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 mr-2 animate-spin" }),
                  "Uploading..."
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FilePlus, { className: "w-4 h-4 mr-2" }),
                  "Add Sources"
                ] })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "h-[calc(100vh-250px)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: filteredDocuments.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center text-muted-foreground py-8", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FolderOpen, { className: "w-8 h-8 mx-auto mb-3 opacity-50" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No sources uploaded" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mt-1", children: "Add documents to get started" })
            ] }) : filteredDocuments.map((doc) => {
              const FileIcon = getFileIcon(doc.type);
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                Card,
                {
                  className: `p-3 cursor-pointer transition-all hover:shadow-md ${selectedDocument?.id === doc.id ? "ring-2 ring-primary" : ""}`,
                  onClick: () => handleDocumentClick(doc),
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(FileIcon, { className: "w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm truncate", children: doc.name }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                          formatFileSize(doc.size),
                          " • ",
                          doc.chunks,
                          " chunks"
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
                          "Uploaded ",
                          new Date(doc.uploadedAt).toLocaleDateString()
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Button,
                          {
                            variant: "ghost",
                            size: "icon",
                            className: "w-8 h-8",
                            onClick: (e) => {
                              e.stopPropagation();
                              toggleDocumentEnabled(doc.id);
                            },
                            title: doc.enabled ? "Disable document" : "Enable document",
                            children: doc.enabled ? /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "w-4 h-4 text-muted-foreground" })
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Button,
                          {
                            variant: "ghost",
                            size: "icon",
                            className: "w-8 h-8 hover:text-destructive",
                            onClick: (e) => {
                              e.stopPropagation();
                              handleDeleteDocument(doc.id);
                            },
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" })
                          }
                        )
                      ] })
                    ] }) })
                  ] })
                },
                doc.id
              );
            }) }) })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "notebook", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center text-muted-foreground py-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "w-8 h-8 mx-auto mb-3 opacity-50" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "Notebook coming soon" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mt-1", children: "Your AI-generated notes and insights" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "history", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "h-[calc(100vh-250px)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: conversations.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center text-muted-foreground py-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "w-8 h-8 mx-auto mb-3 opacity-50" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No conversations yet" })
          ] }) : conversations.map((conv) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => loadConversation(conv.id),
              className: `w-full text-left p-3 rounded-lg transition-all group relative ${conv.id === currentConversationId ? "bg-gradient-to-r from-gradient-metal-start to-gradient-metal-end text-white shadow-sm" : "hover:bg-muted/80"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `font-medium text-sm truncate ${conv.id === currentConversationId ? "text-white" : ""}`, children: conv.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-xs truncate mt-1 ${conv.id === currentConversationId ? "text-white/80" : "text-muted-foreground"}`, children: conv.lastMessage }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-1 mt-1 text-xs ${conv.id === currentConversationId ? "text-white/60" : "text-muted-foreground"}`, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3" }),
                  new Date(conv.timestamp).toLocaleDateString()
                ] })
              ]
            },
            conv.id
          )) }) }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          ref: fileInputRef,
          type: "file",
          multiple: true,
          accept: ".txt,.pdf,.doc,.docx,.md,.json,.csv",
          onChange: handleFileUpload,
          className: "hidden"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b px-6 py-3 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-5 h-5 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold", children: "AI Assistant" }),
          documents.filter((d) => d.enabled).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
            "(",
            documents.filter((d) => d.enabled).length,
            " sources active)"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: handleNewConversation,
              variant: "outline",
              size: "sm",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-2" }),
                "New Chat"
              ]
            }
          ),
          currentConversationId && messages.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4" }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => handleExportConversation("markdown"), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-4 h-4 mr-2" }),
                "Export as Markdown"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => handleExportConversation("json"), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-4 h-4 mr-2" }),
                "Export as JSON"
              ] })
            ] })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "flex-1 px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto py-6", children: [
        aiError && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { variant: "warning", className: "mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTitle, { children: "AI Service Issue" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDescription, { children: [
            aiError,
            (aiError.includes("quota") || aiError.toLowerCase().includes("rate limit")) && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm", children: "Free tier limits: 100k requests/day, 20 requests/minute, 2 concurrent GPU jobs. Consider upgrading for better performance." }),
            aiError.includes("capacity") && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm", children: "The AI service is experiencing high demand. Please wait a moment and try again." }),
            (aiError.toLowerCase().includes("concurrent") || aiError.includes("Concurrency limit")) && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm", children: "The free tier allows only 2 concurrent AI requests. Your request has been queued and will process when a slot becomes available." })
          ] })
        ] }),
        messages.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-gradient-metal-start to-gradient-metal-end mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "w-8 h-8 text-white" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-semibold mb-2", children: "How can I help you today?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6", children: "Upload documents and ask questions to get started" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 max-w-md mx-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-4 cursor-pointer hover:shadow-md transition-all", onClick: () => setInputValue("Summarize the key points from my documents"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-5 h-5 text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm", children: "Summarize documents" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Get key insights from your sources" })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-4 cursor-pointer hover:shadow-md transition-all", onClick: () => setInputValue("Create an outline based on the main topics"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "w-5 h-5 text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm", children: "Generate outline" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Structure your content logically" })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-4 cursor-pointer hover:shadow-md transition-all", onClick: () => setInputValue("What are the most important findings?"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-5 h-5 text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm", children: "Extract insights" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Discover key findings and patterns" })
              ] })
            ] }) })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          messages.map((message) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: `flex gap-4 ${message.role === "assistant" ? "" : "justify-end"}`,
              children: [
                message.role === "assistant" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-gradient-to-r from-gradient-metal-start to-gradient-metal-end flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "w-5 h-5 text-white" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: `relative rounded-2xl px-4 py-3 max-w-[80%] group ${"bg-muted" }`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm leading-relaxed", children: renderMessageWithCitations(message.content, message.citations) }),
                        message.streaming && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-2", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3 h-3 animate-spin text-muted-foreground" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "AI is typing..." })
                        ] }),
                        message.role === "assistant" && !message.streaming && /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            onClick: () => handleShareMessage(message.id),
                            disabled: sharingMessageId === message.id,
                            className: `absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity ${message.role === "assistant" ? "text-muted-foreground hover:text-foreground" : "text-white/70 hover:text-white"}`,
                            title: "Share this Q&A",
                            children: sharingMessageId === message.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "w-4 h-4" })
                          }
                        )
                      ]
                    }
                  )
                ] }),
                message.role === "user" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: `relative rounded-2xl px-4 py-3 max-w-[80%] group ${"bg-muted" }`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm leading-relaxed", children: message.content })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-5 h-5" }) })
                ] })
              ]
            },
            message.id
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: messagesEndRef })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-3xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: inputValue,
            onChange: (e) => setInputValue(e.target.value),
            onKeyPress: (e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            },
            placeholder: isStreaming ? "AI is responding..." : "Ask a question about your documents...",
            disabled: isLoading || isStreaming,
            className: "flex-1"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: handleSendMessage,
            disabled: isLoading || isStreaming || !inputValue.trim(),
            className: "gradient-metallic-primary flex-shrink-0",
            title: isStreaming ? "Please wait for the current response to complete" : "Send message",
            children: isLoading || isStreaming ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-4 h-4" })
          }
        )
      ] }) }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showDocumentPreview, onOpenChange: setShowDocumentPreview, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-4xl max-h-[80vh] overflow-hidden flex flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-5 h-5" }),
        selectedDocument?.name
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "flex-1 mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-muted rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "whitespace-pre-wrap text-sm font-mono", children: documentContent }) }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showChunkModal, onOpenChange: setShowChunkModal, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-2xl max-h-[80vh] overflow-hidden flex flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-5 h-5" }),
        "Source: ",
        highlightedChunk?.documentName
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "flex-1 mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "Relevance:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            highlightedChunk ? (highlightedChunk.score * 100).toFixed(1) : 0,
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-muted rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "whitespace-pre-wrap text-sm font-mono", children: highlightedChunk?.text }) })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: shareModalOpen, onOpenChange: setShareModalOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "w-5 h-5" }),
        "Share This Conversation"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 mt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Anyone with this link can view this Q&A snippet. The link will expire in 30 days." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: shareUrl,
              readOnly: true,
              className: "font-mono text-xs"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: handleCopyShareLink,
              variant: "outline",
              size: "icon",
              className: "flex-shrink-0",
              children: copySuccess ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4 text-green-600" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-4 h-4" })
            }
          )
        ] }),
        copySuccess && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-green-600", children: "Link copied to clipboard!" })
      ] })
    ] }) })
  ] });
}

export { NotebookLMInterface as N };
//# sourceMappingURL=NotebookLMInterface_BEsirrAT.mjs.map
