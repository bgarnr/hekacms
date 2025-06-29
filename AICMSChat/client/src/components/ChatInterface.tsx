import { useState, useRef, useEffect } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { ScrollArea } from "./ui/scroll-area"
import { Card } from "./ui/card"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { Send, Bot, User, Sparkles, Code, Eye, Save } from "lucide-react"
import { Badge } from "./ui/badge"
import { Separator } from "./ui/separator"

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  metadata?: {
    schema?: any
    preview?: any
    suggestions?: string[]
  }
}

interface ChatInterfaceProps {
  onContentTypeCreate?: (schema: any) => void
  onContentCreate?: (content: any) => void
  context?: 'content-type' | 'content-creation' | 'general'
  initialMessage?: string
  showSchemaPreview?: boolean
}

export function ChatInterface({
  onContentTypeCreate,
  onContentCreate,
  context = 'general',
  initialMessage,
  showSchemaPreview = false
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentSchema, setCurrentSchema] = useState<any>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (initialMessage) {
      const welcomeMessage: Message = {
        id: '1',
        type: 'ai',
        content: initialMessage,
        timestamp: new Date()
      }
      setMessages([welcomeMessage])
    }
  }, [initialMessage])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    console.log('Sending message:', input)

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(input, context)
      setMessages(prev => [...prev, aiResponse])
      
      // Update current schema if it exists in the response
      if (aiResponse.metadata?.schema) {
        setCurrentSchema(aiResponse.metadata.schema)
      }
      
      setIsLoading(false)
    }, 1000)
  }

  const generateAIResponse = (userInput: string, context: string): Message => {
    const responses = {
      'content-type': {
        'recipe': {
          content: "Perfect! I'll help you create a recipe content type. Based on what you've said, here's the structure I'm building:\n\n**Recipe Content Type:**\n- Title (Text field, required)\n- Author (Text field, required)\n- Date Created (Date field, required)\n- Cuisine Type (Select field, required)\n- Description (Textarea field, required)\n- Instructions (Rich text field, required)\n- Ingredients (Multi-text field, required)\n- Prep Time (Number field, optional)\n- Cook Time (Number field, optional)\n- Servings (Number field, optional)\n\nWould you like me to add or modify any fields?",
          metadata: {
            schema: {
              name: 'Recipe',
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'author', type: 'text', required: true },
                { name: 'dateCreated', type: 'date', required: true },
                { name: 'cuisineType', type: 'select', required: true, options: ['Italian', 'Mexican', 'Asian', 'American', 'French', 'Other'] },
                { name: 'description', type: 'textarea', required: true },
                { name: 'instructions', type: 'richtext', required: true },
                { name: 'ingredients', type: 'multitext', required: true },
                { name: 'prepTime', type: 'number', required: false },
                { name: 'cookTime', type: 'number', required: false },
                { name: 'servings', type: 'number', required: false }
              ]
            },
            suggestions: ['Add more fields', 'Modify existing fields', 'Ready to save']
          }
        },
        'appointment': {
          content: "Great! I understand you want to create an appointment content type. Let me suggest the structure I'm thinking of:\n\n**Appointment Content Type:**\n- Place (Text field, required)\n- Time (DateTime field, required) \n- Subject (Text field, required)\n- Attendees (Multi-select field, required)\n\nWould you like me to create this content type?",
          metadata: {
            schema: {
              name: 'Appointment',
              fields: [
                { name: 'place', type: 'text', required: true },
                { name: 'time', type: 'datetime', required: true },
                { name: 'subject', type: 'text', required: true },
                { name: 'attendees', type: 'multiselect', required: true }
              ]
            },
            suggestions: ['Add more fields', 'Modify fields', 'Ready to save']
          }
        },
        'blog': {
          content: "Perfect! I'll help you create a blog post content type. Here's what I'm suggesting:\n\n**Blog Post Content Type:**\n- Title (Text field, required)\n- Content (Rich text field, required)\n- Author (Text field, required)\n- Published Date (Date field, required)\n- Tags (Multi-select field, optional)\n- Featured Image (Image field, optional)\n\nShall I proceed with creating this structure?",
          metadata: {
            schema: {
              name: 'BlogPost',
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'content', type: 'richtext', required: true },
                { name: 'author', type: 'text', required: true },
                { name: 'publishedDate', type: 'date', required: true },
                { name: 'tags', type: 'multiselect', required: false },
                { name: 'featuredImage', type: 'image', required: false }
              ]
            },
            suggestions: ['Add SEO Fields', 'Customize Layout', 'Ready to save']
          }
        }
      },
      'content-creation': {
        'appointment': {
          content: "I'll help you create a new appointment. Let's start with the basics - what's the subject of this appointment?",
          metadata: {
            suggestions: ['Team standup meeting', 'Client presentation', 'Project review']
          }
        }
      }
    }

    // Enhanced keyword matching for demo
    if (userInput.toLowerCase().includes('recipe')) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: responses[context]?.['recipe']?.content || "I'd be happy to help you with recipes!",
        timestamp: new Date(),
        metadata: responses[context]?.['recipe']?.metadata
      }
    } else if (userInput.toLowerCase().includes('appointment')) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: responses[context]?.['appointment']?.content || "I'd be happy to help you with appointments!",
        timestamp: new Date(),
        metadata: responses[context]?.['appointment']?.metadata
      }
    } else if (userInput.toLowerCase().includes('blog')) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: responses[context]?.['blog']?.content || "I'd be happy to help you with blog posts!",
        timestamp: new Date(),
        metadata: responses[context]?.['blog']?.metadata
      }
    }

    return {
      id: Date.now().toString(),
      type: 'ai',
      content: "I understand! Could you provide more details about what you'd like to create? I can help you with content types, content instances, or page layouts.",
      timestamp: new Date(),
      metadata: {
        suggestions: ['Create content type', 'Add new content', 'Build a page']
      }
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    console.log('Suggestion clicked:', suggestion)
    setInput(suggestion)
  }

  const handleActionClick = (action: string, metadata?: any) => {
    console.log('Action clicked:', action, metadata)
    if (action === 'Create Content Type' && metadata?.schema && onContentTypeCreate) {
      onContentTypeCreate(metadata.schema)
    }
  }

  const handleSaveSchema = () => {
    if (currentSchema && onContentTypeCreate) {
      onContentTypeCreate(currentSchema)
    }
  }

  return (
    <div className="flex h-full gap-4">
      {/* Chat Interface */}
      <div className={`${showSchemaPreview ? 'flex-1' : 'w-full'}`}>
        <Card className="h-full flex flex-col bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-0 shadow-xl">
          <div className="flex items-center gap-3 p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-sm">AI Assistant</h3>
                <p className="text-xs text-muted-foreground">Powered by GPT-4</p>
              </div>
            </div>
            <Badge variant="secondary" className="ml-auto">
              <Sparkles className="h-3 w-3 mr-1" />
              Active
            </Badge>
          </div>

          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="space-y-3">
                  <div className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {message.type === 'ai' && (
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`max-w-[80%] ${message.type === 'user' ? 'order-first' : ''}`}>
                      <div className={`rounded-lg p-3 ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white ml-auto'
                          : 'bg-gray-50 dark:bg-slate-800 text-foreground'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    {message.type === 'user' && (
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarFallback className="bg-gray-200 dark:bg-slate-700">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>

                  {message.metadata?.suggestions && (
                    <div className="ml-11 flex flex-wrap gap-2">
                      {message.metadata.suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="text-xs h-7"
                          onClick={() => {
                            if (suggestion === 'Create Content Type') {
                              handleActionClick(suggestion, message.metadata)
                            } else {
                              handleSuggestionClick(suggestion)
                            }
                          }}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <Separator />

          <div className="p-4">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Schema Preview Panel */}
      {showSchemaPreview && (
        <div className="w-96">
          <Card className="h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-0 shadow-xl">
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
              <div className="flex items-center gap-2">
                <Code className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-sm">Schema Preview</h3>
              </div>
              {currentSchema && (
                <Button
                  onClick={handleSaveSchema}
                  size="sm"
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
              )}
            </div>
            
            <div className="p-4 h-[calc(100%-73px)] overflow-y-auto">
              {currentSchema ? (
                <div className="space-y-4">
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                    <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
                      {currentSchema.name} Content Type
                    </h4>
                    <Badge variant="secondary" className="text-xs">
                      {currentSchema.fields?.length || 0} fields defined
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Fields:</h5>
                    {currentSchema.fields?.map((field: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-slate-800 rounded border">
                        <div>
                          <span className="text-sm font-medium">{field.name}</span>
                          <Badge variant="outline" className="ml-2 text-xs">
                            {field.type}
                          </Badge>
                        </div>
                        {field.required && (
                          <Badge variant="destructive" className="text-xs">
                            Required
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded border">
                    <h5 className="text-sm font-medium mb-2">JSON Schema:</h5>
                    <pre className="text-xs bg-white dark:bg-slate-900 p-2 rounded border overflow-x-auto">
                      {JSON.stringify(currentSchema, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">Schema preview will appear here as you define your content type</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}