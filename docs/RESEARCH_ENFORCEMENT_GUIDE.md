# Research Enforcement Guide for Sub-Agents

## Overview
This guide establishes mandatory research requirements for all sub-agents before implementing any code changes. All tasks must begin with thorough research and citation documentation.

## Research Requirements

### 1. Mandatory Research Phase
Every task MUST begin with a research phase that includes:
- **Minimum 3 citations** for any implementation task
- **Minimum 5 citations** for architectural or significant changes
- **Source verification** - all URLs must be current and accessible
- **Relevance justification** - explain how each source relates to the task

### 2. Citation Format
All citations must follow this format:
```markdown
**[Source Number]. [Title]** - [URL]
- Key findings: [Bullet points of relevant information]
- Relevance: [How this applies to the current task]
- Date accessed: [YYYY-MM-DD]
```

### 3. Research Categories

#### A. Official Documentation (Priority 1)
- Framework/library official docs
- API documentation
- Security best practices
- Accessibility guidelines (WCAG)

#### B. Implementation Examples (Priority 2)
- GitHub repositories with similar implementations
- Stack Overflow solutions (verified and recent)
- Blog posts from recognized experts
- Video tutorials from official sources

#### C. Performance & Optimization (Priority 3)
- Lighthouse documentation
- Web Vitals guidelines
- Browser-specific optimization guides
- Mobile/tablet best practices

### 4. Pre-Implementation Checklist

Before writing ANY code, sub-agents MUST:
- [ ] Complete research phase with required citations
- [ ] Document findings in task-specific research file
- [ ] Identify potential edge cases from research
- [ ] Note any security considerations found
- [ ] List browser/device compatibility concerns
- [ ] Create implementation plan based on research

### 5. Change Log Requirements

Every change must be documented with:
```markdown
## [Date] - [Task/Feature Name]
### Research Sources
1. [Citation 1 with URL]
2. [Citation 2 with URL]
3. [Citation 3 with URL]

### Changes Made
- [File]: [Specific changes with line numbers]
- Implementation based on: [Reference to research source]

### Testing Considerations
- Based on [Research Source X], tested for: [specific scenarios]
```

## Task-Specific Research Requirements

### UI/UX Changes
- Material Design guidelines
- iOS Human Interface Guidelines
- Accessibility standards (WCAG 2.1 AA)
- Touch target size requirements (44px minimum)

### Performance Optimizations
- Core Web Vitals documentation
- Framework-specific performance guides
- Bundle size optimization strategies
- Lazy loading best practices

### Security Implementations
- OWASP security guidelines
- Framework security documentation
- Authentication/authorization best practices
- Input validation standards

### API Integration
- REST/GraphQL best practices
- Error handling patterns
- Rate limiting considerations
- Retry strategies

## Enforcement Process

### 1. Task Initiation
```markdown
## Task: [Task Name]
### Research Phase Started: [Timestamp]
### Research Keywords: [List of search terms used]
```

### 2. Research Documentation
Create a file: `research/[task-name]-research.md` containing:
- All citations with full details
- Summary of findings
- Implementation recommendations
- Potential pitfalls identified

### 3. Code Review Gate
No code will be reviewed without:
- Completed research documentation
- Citations in change log
- Reference comments in code linking to research

## Example Research Entry

```markdown
## Task: Implement Touch-Optimized Drag and Drop
### Research Phase Started: 2025-01-17 14:00 UTC

### Citations
**1. SortableJS Touch Support Documentation** - https://github.com/SortableJS/Sortable#options
- Key findings: 
  - `delay` option needed for touch devices
  - `delayOnTouchOnly: true` prevents desktop interference
  - `touchStartThreshold` adjusts sensitivity
- Relevance: Core library for implementing touch drag-and-drop
- Date accessed: 2025-01-17

**2. iOS Safari Touch Events Guide** - https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/HandlingEvents/HandlingEvents.html
- Key findings:
  - Touch events fire differently than mouse events
  - Need to prevent default zoom behavior
  - Viewport meta tag considerations
- Relevance: Target platform optimization
- Date accessed: 2025-01-17

**3. MDN Touch Events API** - https://developer.mozilla.org/en-US/docs/Web/API/Touch_events
- Key findings:
  - Touch target size recommendations
  - Multi-touch handling considerations
  - Performance implications of touch handlers
- Relevance: Standards-compliant implementation
- Date accessed: 2025-01-17
```

## Consequences of Non-Compliance

Tasks submitted without proper research documentation will be:
1. Immediately rejected
2. Returned for research completion
3. Not eligible for code review
4. Subject to additional scrutiny on resubmission

## Research Tools & Resources

### Recommended Search Patterns
- `[technology] best practices [current year]`
- `[feature] implementation guide site:github.com`
- `[framework] [feature] documentation`
- `[issue] solution site:stackoverflow.com`

### Trusted Sources
- Official framework documentation
- MDN Web Docs
- Web.dev (Google)
- A11y Project
- Can I Use
- WCAG Guidelines
- Core Web Vitals

## Version History
- v1.0.0 (2025-01-17): Initial enforcement guide
- Last updated: 2025-01-17

---
*This guide is mandatory for all development tasks. No exceptions.*