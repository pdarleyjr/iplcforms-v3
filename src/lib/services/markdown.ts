// Markdown rendering service with sanitization for IPLC Forms v3
// Provides secure markdown processing for Title/Subtitle elements

import MarkdownIt from 'markdown-it';
import DOMPurify from 'dompurify';

// Configure markdown-it with safe settings
const markdown = new MarkdownIt({
  html: false,        // Disable raw HTML in markdown
  xhtmlOut: true,     // Use '/' to close single tags (<br />)
  breaks: true,       // Convert '\n' in paragraphs into <br>
  linkify: true,      // Autoconvert URL-like text to links
  typographer: true,  // Enable smart quotes and other typographic replacements
});

// Configure DOMPurify with strict settings for form elements
const purifyConfig = {
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'em', 'u', 'code', 
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'blockquote'
  ],
  ALLOWED_ATTR: [],
  ALLOW_DATA_ATTR: false,
  ALLOW_UNKNOWN_PROTOCOLS: false,
  FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'textarea', 'select'],
  FORBID_ATTR: ['onclick', 'onload', 'onerror', 'style'],
  KEEP_CONTENT: true,
  RETURN_DOM: false,
  RETURN_DOM_FRAGMENT: false,
  SANITIZE_DOM: true
};

/**
 * Renders markdown text to sanitized HTML
 * @param markdownText - The markdown text to render
 * @param options - Optional configuration overrides
 * @returns Sanitized HTML string
 */
export function renderMarkdown(
  markdownText: string,
  options?: {
    allowedTags?: string[];
    enableTypographer?: boolean;
    enableBreaks?: boolean;
  }
): string {
  if (!markdownText || typeof markdownText !== 'string') {
    return '';
  }

  try {
    // Create a custom markdown instance if options are provided
    let mdInstance = markdown;
    if (options?.enableTypographer !== undefined || options?.enableBreaks !== undefined) {
      mdInstance = new MarkdownIt({
        html: false,
        xhtmlOut: true,
        breaks: options?.enableBreaks ?? true,
        linkify: true,
        typographer: options?.enableTypographer ?? true,
      });
    }

    // Render markdown to HTML
    const renderedHtml = mdInstance.render(markdownText);
    
    // Create custom purify config if allowedTags specified
    const customConfig = options?.allowedTags
      ? { ...purifyConfig, ALLOWED_TAGS: options.allowedTags }
      : purifyConfig;
    
    // Sanitize the HTML output
    const sanitizedHtml = DOMPurify.sanitize(renderedHtml, customConfig);
    
    return sanitizedHtml;
  } catch (error) {
    console.error('Markdown rendering error:', error);
    // Return the original text as plain text fallback
    return DOMPurify.sanitize(markdownText, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  }
}

/**
 * Renders inline markdown (no block elements like paragraphs)
 * Useful for titles and labels where you want formatting but not structure
 * @param markdownText - The markdown text to render inline
 * @returns Sanitized HTML string without block elements
 */
export function renderInlineMarkdown(markdownText: string): string {
  if (!markdownText || typeof markdownText !== 'string') {
    return '';
  }

  try {
    // Use inline rendering method
    const renderedHtml = markdown.renderInline(markdownText);
    
    // Use more restrictive config for inline content
    const inlineConfig = {
      ...purifyConfig,
      ALLOWED_TAGS: ['strong', 'em', 'u', 'code'], // Only inline formatting
      ALLOWED_ATTR: []
    };
    
    const sanitizedHtml = DOMPurify.sanitize(renderedHtml, inlineConfig);
    
    return sanitizedHtml;
  } catch (error) {
    console.error('Inline markdown rendering error:', error);
    // Return the original text as plain text fallback
    return DOMPurify.sanitize(markdownText, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  }
}

/**
 * Validates if markdown text contains only safe content
 * @param markdownText - The markdown text to validate
 * @returns Object with validation result and any warnings
 */
export function validateMarkdown(markdownText: string): {
  isValid: boolean;
  warnings: string[];
  sanitizedText: string;
} {
  const warnings: string[] = [];
  
  if (!markdownText || typeof markdownText !== 'string') {
    return { isValid: true, warnings: [], sanitizedText: '' };
  }

  // Check for potentially unsafe patterns
  const unsafePatterns = [
    { pattern: /<script/i, warning: 'Script tags are not allowed' },
    { pattern: /javascript:/i, warning: 'JavaScript URLs are not allowed' },
    { pattern: /on\w+\s*=/i, warning: 'Event handlers are not allowed' },
    { pattern: /<iframe/i, warning: 'IFrame tags are not allowed' },
    { pattern: /<object/i, warning: 'Object tags are not allowed' },
    { pattern: /<embed/i, warning: 'Embed tags are not allowed' },
  ];

  unsafePatterns.forEach(({ pattern, warning }) => {
    if (pattern.test(markdownText)) {
      warnings.push(warning);
    }
  });

  try {
    const sanitizedText = renderMarkdown(markdownText);
    return {
      isValid: warnings.length === 0,
      warnings,
      sanitizedText
    };
  } catch (error) {
    return {
      isValid: false,
      warnings: [...warnings, 'Failed to process markdown'],
      sanitizedText: DOMPurify.sanitize(markdownText, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
    };
  }
}

/**
 * Strips all markdown formatting and returns plain text
 * @param markdownText - The markdown text to convert to plain text
 * @returns Plain text string
 */
export function stripMarkdown(markdownText: string): string {
  if (!markdownText || typeof markdownText !== 'string') {
    return '';
  }

  try {
    // Render markdown then strip all HTML tags
    const htmlText = markdown.render(markdownText);
    const plainText = DOMPurify.sanitize(htmlText, { 
      ALLOWED_TAGS: [], 
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true 
    });
    
    // Clean up extra whitespace
    return plainText.replace(/\s+/g, ' ').trim();
  } catch (error) {
    console.error('Strip markdown error:', error);
    return markdownText.replace(/[*_`#>\-+]/g, '').replace(/\s+/g, ' ').trim();
  }
}

/**
 * Configuration object for markdown service
 */
export const MarkdownConfig = {
  // Default allowed tags for different contexts
  TITLE_TAGS: ['strong', 'em', 'u', 'code'],
  CONTENT_TAGS: ['p', 'br', 'strong', 'em', 'u', 'code', 'ul', 'ol', 'li', 'blockquote'],
  HEADING_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'em', 'u', 'code'],
  
  // Security settings
  MAX_LENGTH: 10000, // Maximum characters to process
  TIMEOUT: 5000,     // Processing timeout in milliseconds
} as const;

export default {
  renderMarkdown,
  renderInlineMarkdown,
  validateMarkdown,
  stripMarkdown,
  MarkdownConfig
};