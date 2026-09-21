import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

# Palette
COLOR_PRIMARY = colors.HexColor("#0f172a")     # Slate 900
COLOR_ACCENT = colors.HexColor("#0d9488")      # Teal 600
COLOR_EMERALD = colors.HexColor("#10b981")     # Emerald 500
COLOR_INDIGO = colors.HexColor("#6366f1")      # Indigo 500
COLOR_AMBER = colors.HexColor("#d97706")       # Amber 600
COLOR_ROSE = colors.HexColor("#e11d48")        # Rose 600
COLOR_BG_LIGHT = colors.HexColor("#f8fafc")    # Slate 50
COLOR_TEXT_DARK = colors.HexColor("#1e293b")   # Slate 800
COLOR_MUTED = colors.HexColor("#64748b")       # Slate 500
COLOR_CARD_BG = colors.HexColor("#f1f5f9")     # Slate 100
COLOR_CODE_BG = colors.HexColor("#090d16")     # Dark Slate

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(COLOR_MUTED)
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, 755, "Engineering Placement Prep 2026 — Master Blueprint")
            self.setStrokeColor(colors.HexColor("#cbd5e1"))
            self.setLineWidth(0.5)
            self.line(54, 747, 558, 747)
            
        # Footer
        footer_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(558, 30, footer_text)
        self.drawString(54, 30, "Strictly Confidential — Created for Jay (jayOnWeb)")
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.5)
        self.line(54, 42, 558, 42)
        
        self.restoreState()

def build_styles():
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=COLOR_PRIMARY,
        spaceAfter=6
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=15,
        textColor=COLOR_ACCENT,
        spaceAfter=15
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=COLOR_PRIMARY,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=COLOR_INDIGO,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=COLOR_TEXT_DARK,
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=body_style,
        leftIndent=12,
        firstLineIndent=-8,
        spaceAfter=3
    )

    callout_style = ParagraphStyle(
        'Callout_Text',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#0f172a")
    )

    code_block_style = ParagraphStyle(
        'Code_Block_Text',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8.5,
        leading=11.5,
        textColor=colors.HexColor("#f8fafc")
    )

    return {
        'Title': title_style,
        'Subtitle': subtitle_style,
        'H1': h1_style,
        'H2': h2_style,
        'Body': body_style,
        'Bullet': bullet_style,
        'Callout': callout_style,
        'Code': code_block_style
    }

def create_box(title, content_list, bg_color=colors.HexColor("#f8fafc"), border_color=colors.HexColor("#cbd5e1"), title_color=COLOR_PRIMARY, style=None):
    flowables = []
    if title:
        flowables.append(Paragraph(f"<b>{title}</b>", ParagraphStyle('BoxTitle', parent=style, fontName='Helvetica-Bold', fontSize=10.5, leading=14, textColor=title_color)))
        flowables.append(Spacer(1, 4))
    for item in content_list:
        if isinstance(item, str):
            flowables.append(Paragraph(item, style))
        else:
            flowables.append(item)
            
    t = Table([[flowables]], colWidths=[504])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), bg_color),
        ('BOX', (0,0), (-1,-1), 1, border_color),
        ('PADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    return t

def create_code_box(code_text, style):
    lines = code_text.strip().split('\n')
    formatted = "<br/>".join([line.replace(" ", "&nbsp;").replace("<", "&lt;").replace(">", "&gt;") for line in lines])
    p = Paragraph(formatted, style)
    t = Table([[p]], colWidths=[504])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), COLOR_CODE_BG),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#334155")),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    return t

# =========================================================================
# PDF 1: DETAILED DSA MASTERY & FULL EXECUTION ROADMAP
# =========================================================================
def generate_detailed_dsa_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54, rightMargin=54,
        topMargin=54, bottomMargin=54
    )
    styles = build_styles()
    story = []

    # Title Banner
    story.append(Paragraph("Complete DSA Mastery & 60-90 Day Execution Bible", styles['Title']))
    story.append(Paragraph("Comprehensive Pattern Breakdown, Daily Routine, Exam Strategy & Core 75 Checklist", styles['Subtitle']))
    story.append(HRFlowable(width="100%", thickness=1.5, color=COLOR_INDIGO, spaceAfter=12))

    # SECTION 1: MINDSET & STRATEGY
    story.append(Paragraph("1. Executive Strategy & Mindset Framework", styles['H1']))
    story.append(Paragraph("DSA mastery is not about solving 1000 questions blindly. It is about <b>Pattern Recognition Efficiency</b>. When presented with an unseen problem in an interview, your brain must execute a fast decision tree to identify the underlying pattern within 60 seconds.", styles['Body']))
    
    box1 = [
        "<b>The 4-Step Problem Solving Algorithm in Interviews:</b>",
        "1. <b>Understand & Constraints Analysis (2 mins):</b> Read constraints. If N <= 10^5, aim for O(N) or O(N log N). If N <= 20, exponential O(2^N) backtracking works.",
        "2. <b>Pattern Identification (2 mins):</b> Match problem clues to known patterns (e.g. 'Contiguous subarray' -> Sliding Window or Prefix Sum; 'Next greater element' -> Monotonic Stack).",
        "3. <b>Dry Run & Edge Cases (3 mins):</b> Test with minimal input, empty input, single element, duplicates, negative numbers.",
        "4. <b>Clean Code Implementation (12 mins):</b> Write production-ready code with meaningful variable names, handling nulls/bounds."
    ]
    story.append(create_box("THE 4-STEP INTERVIEW PROTOCOL", box1, bg_color=colors.HexColor("#eff6ff"), border_color=colors.HexColor("#3b82f6"), title_color=colors.HexColor("#1d4ed8"), style=styles['Body']))
    story.append(Spacer(1, 10))

    # SECTION 2: TOPIC-BY-TOPIC PATTERN DEEP DIVE
    story.append(Paragraph("2. Topic-by-Topic Deep-Dive & Code Templates", styles['H1']))

    # Topic 1: Arrays & Two Pointers / Sliding Window / Prefix Sum
    story.append(Paragraph("Topic 1: Arrays, Strings, Two Pointers & Sliding Window", styles['H2']))
    story.append(Paragraph("<b>Core Patterns & Clues:</b>", styles['Body']))
    story.append(Paragraph("• <b>Two Pointers:</b> Sorted array / opposite ends (#15 3Sum, #11 Container With Most Water, #42 Trapping Rain Water).", styles['Bullet']))
    story.append(Paragraph("• <b>Sliding Window (Variable Size):</b> Find longest/shortest subarray satisfying condition K (#3 Longest Substring Without Repeating, #76 Minimum Window Substring).", styles['Bullet']))
    story.append(Paragraph("• <b>Prefix Sum + HashMap:</b> Find count of subarrays with sum equal to K (#560 Subarray Sum K, #525 Contiguous Array). Clue: Subarray sum from L to R = Prefix[R] - Prefix[L-1] = K -> Prefix[L-1] = Prefix[R] - K.", styles['Bullet']))
    story.append(Paragraph("• <b>Kadane's Algorithm:</b> Maximum subarray sum. Track <code>maxEndingHere = max(num, maxEndingHere + num)</code>.", styles['Bullet']))

    array_code = """// Sliding Window Variable Size Template
int left = 0, maxLen = 0;
Map<Character, Integer> counts = new HashMap<>();

for (int right = 0; right < s.length(); right++) {
    char c = s.charAt(right);
    counts.put(c, counts.getOrDefault(c, 0) + 1);
    
    while (!isValid(counts)) { // Shrink window
        char leftChar = s.charAt(left);
        counts.put(leftChar, counts.get(leftChar) - 1);
        left++;
    }
    maxLen = Math.max(maxLen, right - left + 1);
}"""
    story.append(create_code_box(array_code, styles['Code']))
    story.append(Spacer(1, 10))

    # Topic 2: Stack & Monotonic Stack Progression
    story.append(Paragraph("Topic 2: Stack & The Monotonic Stack Progression", styles['H2']))
    story.append(Paragraph("Monotonic Stack is used when you need to find the <i>next greater</i> or <i>previous smaller</i> element in O(N) time.", styles['Body']))
    
    stack_box = [
        "<b>The 6-Step Monotonic Stack Progression Path:</b>",
        "1. <b>#20 Valid Parentheses (Easy):</b> Matching brackets using LIFO stack.",
        "2. <b>#496 Next Greater Element I (Easy):</b> Decreasing monotonic stack to store elements waiting for a greater next element.",
        "3. <b>#739 Daily Temperatures (Medium):</b> Store indices in monotonic stack; distance = <code>currentIndex - stack.pop()</code>.",
        "4. <b>#503 Next Greater Element II (Medium):</b> Circular array simulation using modulo <code>i % N</code> with 2*N loop.",
        "5. <b>#84 Largest Rectangle in Histogram (Hard):</b> Maintain increasing stack of height indices. When current height is smaller, pop and compute <code>height[popped] * (current_index - stack.peek() - 1)</code>.",
        "6. <b>#85 Maximal Rectangle (Hard):</b> Convert 2D binary matrix into 1D histogram per row, applying #84 for each row."
    ]
    story.append(create_box("MONOTONIC STACK MASTERY ROUTE", stack_box, bg_color=colors.HexColor("#ecfdf5"), border_color=COLOR_EMERALD, title_color=colors.HexColor("#047857"), style=styles['Body']))
    story.append(Spacer(1, 10))

    # Topic 3: Linked Lists
    story.append(Paragraph("Topic 3: Linked List Pointer Manipulation", styles['H2']))
    story.append(Paragraph("• <b>Fast & Slow Pointers (Floyd's Cycle Detection):</b> #141 Cycle, #142 Cycle II, #876 Middle of LL.", styles['Bullet']))
    story.append(Paragraph("• <b>In-place Reversal:</b> Maintain <code>prev = null, curr = head, next = null</code>. (#206 Reverse LL, #92 Reverse LL II).", styles['Bullet']))
    story.append(Paragraph("• <b>Complex Reorder & K-Group:</b> #143 Reorder List = (1) Find Middle + (2) Reverse 2nd Half + (3) Interleave. #25 Reverse Nodes in K-Group.", styles['Bullet']))
    story.append(Spacer(1, 10))

    # Topic 4: Trees & BST
    story.append(Paragraph("Topic 4: Binary Trees, BST & Tree DP", styles['H2']))
    story.append(Paragraph("• <b>DFS (Preorder/Inorder/Postorder):</b> Postorder is essential for bottom-up computation (#543 Diameter of Tree, #110 Balanced Tree).", styles['Bullet']))
    story.append(Paragraph("• <b>Tree DP:</b> At each node, compute values from left & right subtrees and pass max upward (#124 Binary Tree Max Path Sum).", styles['Bullet']))
    story.append(Paragraph("• <b>BST Property:</b> Inorder traversal of BST yields strictly sorted values (#98 Validate BST, #230 Kth Smallest).", styles['Bullet']))
    story.append(Paragraph("• <b>BFS Level Order:</b> Using Queue for level-by-level processing (#102 Level Order, #199 Right Side View).", styles['Bullet']))
    story.append(Spacer(1, 10))

    # Topic 5: Graphs
    story.append(Paragraph("Topic 5: Graphs, Topological Sort & Shortest Path", styles['H2']))
    story.append(Paragraph("• <b>Grid DFS/BFS:</b> #200 Number of Islands, #994 Rotting Oranges (Multi-source BFS using queue).", styles['Bullet']))
    story.append(Paragraph("• <b>Topological Sort (Kahn's Algorithm / Indegree BFS):</b> For DAG ordering and cycle detection (#207 Course Schedule I, #210 Course Schedule II).", styles['Bullet']))
    story.append(Paragraph("• <b>Disjoint Set Union (DSU / Union-Find):</b> Path compression + rank optimization (#684 Redundant Connection, #547 Provinces).", styles['Bullet']))
    story.append(Paragraph("• <b>Dijkstra's Algorithm:</b> Shortest path in weighted graph using Priority Queue (Min-Heap) (#743 Network Delay Time).", styles['Bullet']))

    graph_code = """// Kahn's Algorithm for Topological Sort / Course Schedule
int[] indegree = new int[numCourses];
for (int[] edge : prerequisites) indegree[edge[0]]++;

Queue<Integer> q = new LinkedList<>();
for (int i = 0; i < numCourses; i++) if (indegree[i] == 0) q.add(i);

int count = 0;
while (!q.isEmpty()) {
    int curr = q.poll();
    count++;
    for (int neighbor : adj.get(curr)) {
        if (--indegree[neighbor] == 0) q.add(neighbor);
    }
}
return count == numCourses;"""
    story.append(create_code_box(graph_code, styles['Code']))
    story.append(Spacer(1, 10))

    # Topic 6: Dynamic Programming & Backtracking
    story.append(Paragraph("Topic 6: Dynamic Programming & Backtracking", styles['H2']))
    story.append(Paragraph("• <b>Backtracking Mental Model:</b> <code>choose → explore → undo</code>. Subsets (#78) → Combinations (#77) → Combination Sum (#39) → Permutations (#46) → Word Search (#79) → N-Queens (#51).", styles['Bullet']))
    story.append(Paragraph("• <b>1D & 2D DP Framework:</b> State -> Choice -> Transition -> Base Case.", styles['Bullet']))
    story.append(Paragraph("  - <b>Take/Skip (0/1 Knapsack):</b> #198 House Robber, #416 Partition Equal Subset Sum.", styles['Bullet']))
    story.append(Paragraph("  - <b>Unbounded Knapsack:</b> #322 Coin Change (min coins), #518 Coin Change II (ways).", styles['Bullet']))
    story.append(Paragraph("  - <b>2D Sequence DP:</b> #1143 Longest Common Subsequence, #72 Edit Distance.", styles['Bullet']))
    story.append(Paragraph("  - <b>Interval DP:</b> #312 Burst Balloons.", styles['Bullet']))

    story.append(Spacer(1, 10))

    # SECTION 3: 60-90 DAY TIMETABLE & EXAM PROTOCOL
    story.append(Paragraph("3. 60-90 Day Timetable & 7th Sem Exam Protocol", styles['H1']))

    sched_data = [
        [Paragraph("<b>Phase</b>", styles['Body']), Paragraph("<b>Dates</b>", styles['Body']), Paragraph("<b>Topic Target</b>", styles['Body']), Paragraph("<b>Daily Goal</b>", styles['Body'])],
        [
            Paragraph("<b>Phase 1</b>", styles['Body']),
            Paragraph("Sept 22 - Oct 12", styles['Body']),
            Paragraph("Arrays, Strings, Two Pointers, Monotonic Stack", styles['Body']),
            Paragraph("3 problems/day + update streak app", styles['Body'])
        ],
        [
            Paragraph("<b>Phase 2</b>", styles['Body']),
            Paragraph("Oct 13 - Nov 02", styles['Body']),
            Paragraph("Linked Lists, Binary Trees, BST, Heaps", styles['Body']),
            Paragraph("2-3 problems/day + notes", styles['Body'])
        ],
        [
            Paragraph("<b>Phase 3</b>", styles['Body']),
            Paragraph("Nov 03 - Nov 23", styles['Body']),
            Paragraph("Graphs, DSU, Dijkstra, 1D/2D DP, Backtracking", styles['Body']),
            Paragraph("2 problems/day (Focus on pattern derivation)", styles['Body'])
        ],
        [
            Paragraph("<b>Exam Gap</b>", styles['Body']),
            Paragraph("2-3 Weeks (End Sem)", styles['Body']),
            Paragraph("Streak Maintenance & Revision", styles['Body']),
            Paragraph("<b>1 Easy problem/day (15 mins)</b>", styles['Body'])
        ],
        [
            Paragraph("<b>Phase 4</b>", styles['Body']),
            Paragraph("Nov 24 - Dec 15", styles['Body']),
            Paragraph("Core 75 Timed Re-run & Off-Campus Applying", styles['Body']),
            Paragraph("Timed mocks (20m/medium) + 3 Cold emails", styles['Body'])
        ]
    ]
    t_sched = Table(sched_data, colWidths=[65, 95, 204, 140])
    t_sched.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), COLOR_CARD_BG),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('PADDING', (0,0), (-1,-1), 5),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_sched)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Generated {filename}")

# =========================================================================
# PDF 2: COMPLETE MERN STACK INTERVIEW BIBLE
# =========================================================================
def generate_detailed_mern_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54, rightMargin=54,
        topMargin=54, bottomMargin=54
    )
    styles = build_styles()
    story = []

    # Title Banner
    story.append(Paragraph("MERN Stack & Full-Stack System Design Interview Bible", styles['Title']))
    story.append(Paragraph("Production Internals, React 18, Node.js Event Loop, MongoDB Engineering & AI Architectures", styles['Subtitle']))
    story.append(HRFlowable(width="100%", thickness=1.5, color=COLOR_EMERALD, spaceAfter=12))

    # SECTION 1: REACT.JS INTERNALS & ARCHITECTURE
    story.append(Paragraph("1. React.js In-Depth & Modern Engineering", styles['H1']))
    
    story.append(Paragraph("<b>A. Virtual DOM, Reconciliation & React Fiber Architecture</b>", styles['H2']))
    story.append(Paragraph("• <b>Virtual DOM:</b> In-memory lightweight JSON representation of the real DOM tree.", styles['Bullet']))
    story.append(Paragraph("• <b>React Fiber:</b> The re-implementation of React's core algorithm (React 16+). Fiber breaks rendering work into incremental units of work (workInProgress tree vs current tree). Enables pausing, prioritizing, and aborting work to ensure 60fps responsiveness.", styles['Bullet']))
    story.append(Paragraph("• <b>Diffing Heuristics:</b> O(N) diffing algorithm based on 2 assumptions: (1) Two elements of different types produce different trees, (2) Keys are stable and unique across sibling elements.", styles['Bullet']))

    story.append(Paragraph("<b>B. React Hooks Deep-Dive & Execution Mechanics</b>", styles['H2']))
    story.append(Paragraph("• <b>useState & useReducer:</b> Linked list of hook nodes on the Fiber node. Hook call order MUST remain identical across renders (never put hooks inside `if` conditionals or loops).", styles['Bullet']))
    story.append(Paragraph("• <b>useEffect vs useLayoutEffect:</b> <code>useEffect</code> executes asynchronously AFTER paint (non-blocking). <code>useLayoutEffect</code> executes synchronously BEFORE paint (use for DOM measurement to prevent layout flicker).", styles['Bullet']))
    story.append(Paragraph("• <b>useCallback vs useMemo:</b> <code>useCallback(fn, deps)</code> caches function instance. <code>useMemo(() => val, deps)</code> caches return value. Prevents unnecessary child component re-renders when passed as props.", styles['Bullet']))

    react_code = """// Custom Hook for Debouncing API Queries (e.g. Live Search)
import { useState, useEffect } from 'react';

export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler); // Cleanup on rapid typing
  }, [value, delay]);

  return debouncedValue;
}"""
    story.append(create_code_box(react_code, styles['Code']))
    story.append(Spacer(1, 10))

    # SECTION 2: NODE.JS & EXPRESS INTERNALS
    story.append(Paragraph("2. Node.js Architecture, Event Loop & Express", styles['H1']))

    story.append(Paragraph("<b>A. Node.js Event Loop 6 Phases</b>", styles['H2']))
    story.append(Paragraph("Node.js uses single-threaded event-driven architecture powered by <b>Libuv</b>.", styles['Body']))
    
    node_box = [
        "<b>The 6 Event Loop Phases:</b>",
        "1. <b>Timers Phase:</b> Executes callbacks scheduled by <code>setTimeout()</code> and <code>setInterval()</code>.",
        "2. <b>Pending Callbacks Phase:</b> Executes I/O callbacks deferred to the next loop iteration (e.g. TCP errors).",
        "3. <b>Idle, Prepare Phase:</b> Internal Node.js usage.",
        "4. <b>Poll Phase:</b> Retrieves new I/O events; executes I/O related callbacks (fs, network, db). Node will block here if queue is empty.",
        "5. <b>Check Phase:</b> Executes callbacks invoked by <code>setImmediate()</code>.",
        "6. <b>Close Callbacks Phase:</b> Executes close events (e.g. <code>socket.on('close')</code>).",
        "<br/><b>Microtasks Priority:</b> <code>process.nextTick()</code> and <code>Promise.then()</code> queues execute IMMEDIATELY after the current operation finishes, before moving to the next phase!"
    ]
    story.append(create_box("NODE.JS EVENT LOOP PHASES", node_box, bg_color=colors.HexColor("#f0fdf4"), border_color=COLOR_EMERALD, title_color=colors.HexColor("#047857"), style=styles['Body']))
    story.append(Spacer(1, 10))

    story.append(Paragraph("<b>B. Streams & Backpressure</b>", styles['H2']))
    story.append(Paragraph("Streams handle data chunk-by-chunk without loading whole files into memory. Backpressure occurs when Writable stream cannot process data as fast as Readable stream produces it. Handle using <code>readable.pipe(writable)</code>.", styles['Body']))

    story.append(Paragraph("<b>C. Express Security & Auth Best Practices</b>", styles['H2']))
    story.append(Paragraph("• <b>JWT Security:</b> Short-lived Access Token (15 mins, in memory) + Long-lived Refresh Token (7 days, stored in <code>httpOnly, Secure, SameSite=Strict</code> Cookie). Prevents XSS & CSRF.", styles['Bullet']))
    story.append(Paragraph("• <b>Security Headers & Middleware:</b> Helmet (headers), Express Rate Limit (DDoS protection), CORS whitelist, Express-mongo-sanitize (NoSQL injection prevention).", styles['Bullet']))

    # SECTION 3: MONGODB & DATABASE ENGINEERING
    story.append(Paragraph("3. MongoDB Indexing, Aggregation & Database Engineering", styles['H1']))

    story.append(Paragraph("<b>A. Indexing Strategies & The ESR Rule</b>", styles['H2']))
    story.append(Paragraph("Indexes use B-Trees. Without indexes, MongoDB performs a full collection scan (COLLSCAN).", styles['Body']))
    story.append(Paragraph("• <b>ESR Rule for Compound Indexes:</b> <b>E</b>quality fields first -> <b>S</b>ort fields second -> <b>R</b>ange fields last.", styles['Bullet']))
    story.append(Paragraph("  <i>Example:</i> Query `db.users.find({ status: 'ACTIVE', age: { $gte: 21 } }).sort({ createdAt: -1 })` -> Index: `{ status: 1, createdAt: -1, age: 1 }`.", styles['Bullet']))

    story.append(Paragraph("<b>B. MongoDB Aggregation Pipeline</b>", styles['H2']))
    
    mongo_code = """// Aggregation Pipeline for Analytics Dashboard
db.orders.aggregate([
  { $match: { status: "COMPLETED", createdAt: { $gte: new Date("2026-01-01") } } },
  { $group: {
      _id: "$category",
      totalRevenue: { $sum: "$amount" },
      avgOrderValue: { $avg: "$amount" },
      totalOrders: { $sum: 1 }
  }},
  { $sort: { totalRevenue: -1 } },
  { $limit: 10 }
]);"""
    story.append(create_code_box(mongo_code, styles['Code']))
    story.append(Spacer(1, 10))

    # SECTION 4: AI PROJECTS ARCHITECTURE PITCH (K6Lab & Productivity Tool)
    story.append(Paragraph("4. Architectural Deep-Dive & Pitch for Your AI Projects", styles['H1']))
    story.append(Paragraph("Interviewers love real system architecture details. Here is how to present your AI projects with full engineering maturity:", styles['Body']))

    project_box = [
        "<b>1. K6Lab (AI-Powered Performance Testing & Diagnostics):</b>",
        "• <b>Problem Solved:</b> Manual load testing with K6 produces raw metrics that take hours to diagnose manually.",
        "• <b>System Architecture:</b> Built Node.js backend runner spawned as child process streaming stdout/stderr metrics -> Server-Sent Events (SSE) streaming live throughput graphs to React client -> Automated LLM pipeline analyzing performance bottlenecks -> MongoDB Compound Indexed storage.",
        "• <b>Key Metric Claim:</b> Reduced load-test metric analysis time from 45 minutes to 15 seconds.",
        "<br/>",
        "<b>2. Productivity AI Tool:</b>",
        "• <b>Problem Solved:</b> High LLM API latency & token cost inefficiency in interactive productivity suites.",
        "• <b>System Architecture:</b> React + Zustand state store -> Express middleware with Redis caching layer (caching repeated prompt embeddings) -> Context trimming engine preventing prompt window inflation -> JWT auth with HttpOnly cookies.",
        "• <b>Key Metric Claim:</b> Reduced OpenAI token cost by 35% using local Redis response caching."
    ]
    story.append(create_box("PROJECT ARCHITECTURAL SHOWCASE", project_box, bg_color=colors.HexColor("#eef2ff"), border_color=COLOR_INDIGO, title_color=colors.HexColor("#3730a3"), style=styles['Body']))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Generated {filename}")

if __name__ == "__main__":
    dir1 = "/Users/jaykacha/Documents/antigravity/resilient-turing/public/pdfs"
    dir2 = "/Users/jaykacha/Downloads/placement_pdfs"
    os.makedirs(dir1, exist_ok=True)
    os.makedirs(dir2, exist_ok=True)

    pdf_dsa_1 = os.path.join(dir1, "DSA_60_90_Day_Mastery_Roadmap.pdf")
    pdf_dsa_2 = os.path.join(dir2, "DSA_60_90_Day_Mastery_Roadmap.pdf")

    pdf_mern_1 = os.path.join(dir1, "MERN_Stack_Interview_Guide.pdf")
    pdf_mern_2 = os.path.join(dir2, "MERN_Stack_Interview_Guide.pdf")

    generate_detailed_dsa_pdf(pdf_dsa_1)
    generate_detailed_mern_pdf(pdf_mern_1)

    # Copy to downloads
    import shutil
    shutil.copy(pdf_dsa_1, pdf_dsa_2)
    shutil.copy(pdf_mern_1, pdf_mern_2)

    # Copy to artifacts
    art_dir = "/Users/jaykacha/.gemini/antigravity/brain/c1b52601-5d2c-4136-9c82-2a7d657c8d1c/"
    if os.path.exists(art_dir):
        shutil.copy(pdf_dsa_1, os.path.join(art_dir, "DSA_60_90_Day_Mastery_Roadmap.pdf"))
        shutil.copy(pdf_mern_1, os.path.join(art_dir, "MERN_Stack_Interview_Guide.pdf"))

    print("Detailed PDFs regenerated successfully!")
