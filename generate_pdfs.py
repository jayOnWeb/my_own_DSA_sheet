import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

# Define Palette
COLOR_PRIMARY = colors.HexColor("#0f172a")    # Slate 900
COLOR_ACCENT = colors.HexColor("#0d9488")     # Teal 600
COLOR_EMERALD = colors.HexColor("#10b981")    # Emerald 500
COLOR_INDIGO = colors.HexColor("#6366f1")     # Indigo 500
COLOR_AMBER = colors.HexColor("#d97706")      # Amber 600
COLOR_BG_LIGHT = colors.HexColor("#f8fafc")   # Slate 50
COLOR_TEXT_DARK = colors.HexColor("#1e293b")  # Slate 800
COLOR_MUTED = colors.HexColor("#64748b")      # Slate 500
COLOR_CARD_BG = colors.HexColor("#f1f5f9")    # Slate 100

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
        self.setFont("Helvetica", 9)
        self.setFillColor(COLOR_MUTED)
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, 750, "Off-Campus Software Engineer Placement Playbook 2026")
            self.setStrokeColor(colors.HexColor("#e2e8f0"))
            self.setLineWidth(0.5)
            self.line(54, 742, 558, 742)
            
        # Footer
        footer_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(558, 36, footer_text)
        self.drawString(54, 36, "Prepared for Jay (jayOnWeb) — Confidential & Personal Blueprint")
        self.setStrokeColor(colors.HexColor("#e2e8f0"))
        self.setLineWidth(0.5)
        self.line(54, 48, 558, 48)
        
        self.restoreState()

def build_styles():
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=COLOR_PRIMARY,
        spaceAfter=10
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=COLOR_ACCENT,
        spaceAfter=20
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=19,
        textColor=COLOR_PRIMARY,
        spaceBefore=16,
        spaceAfter=8,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=COLOR_INDIGO,
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=COLOR_TEXT_DARK,
        spaceAfter=8
    )

    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=body_style,
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=4
    )

    callout_style = ParagraphStyle(
        'Callout_Text',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor("#1e1b4b"),
        spaceBefore=4,
        spaceAfter=4
    )

    code_style = ParagraphStyle(
        'Code_Text',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor("#0f172a")
    )

    return {
        'Title': title_style,
        'Subtitle': subtitle_style,
        'H1': h1_style,
        'H2': h2_style,
        'Body': body_style,
        'Bullet': bullet_style,
        'Callout': callout_style,
        'Code': code_style
    }

def create_callout_box(text, title="PRO TIP", bg_color=colors.HexColor("#eff6ff"), border_color=colors.HexColor("#3b82f6"), style=None):
    content = [
        Paragraph(f"<b>{title}</b>", ParagraphStyle('CalloutTitle', parent=style, fontName='Helvetica-Bold', fontSize=10, leading=13, textColor=border_color)),
        Spacer(1, 4),
        Paragraph(text, style)
    ]
    t = Table([[content]], colWidths=[504])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), bg_color),
        ('BOX', (0,0), (-1,-1), 1, border_color),
        ('PADDING', (0,0), (-1,-1), 10),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    return t

# ==========================================
# PDF 1: JOB SEARCH & OFF-CAMPUS BLUEPRINT
# ==========================================
def generate_job_search_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54, rightMargin=54,
        topMargin=54, bottomMargin=54
    )
    styles = build_styles()
    story = []

    # Title Banner
    story.append(Paragraph("Off-Campus Job Search & Cold Outreach Blueprint", styles['Title']))
    story.append(Paragraph("Targeting SDE-1 / Software Engineer Roles | 2026 Graduation Batch", styles['Subtitle']))
    story.append(HRFlowable(width="100%", thickness=1.5, color=COLOR_ACCENT, spaceAfter=15))

    story.append(Paragraph("1. Top Tier Platforms for Tech Roles", styles['H1']))
    
    platforms_data = [
        [Paragraph("<b>Platform</b>", styles['Body']), Paragraph("<b>Best For</b>", styles['Body']), Paragraph("<b>Action Strategy</b>", styles['Body'])],
        [
            Paragraph("<b>LinkedIn</b>", styles['Body']),
            Paragraph("Recruiter outreach, hiring posts, alumni referrals", styles['Body']),
            Paragraph("Search <i>'hiring MERN'</i> or <i>'hiring SDE1'</i> under posts filtered by Past 24h. Send personalized connection notes.", styles['Body'])
        ],
        [
            Paragraph("<b>Wellfound</b><br/>(AngelList)", styles['Body']),
            Paragraph("High-growth startups, remote & AI tech roles", styles['Body']),
            Paragraph("Complete 100% profile. Apply directly to Founder/CTO with a tailored 3-bullet pitch highlighting K6Lab & AI tools.", styles['Body'])
        ],
        [
            Paragraph("<b>Instahyre</b>", styles['Body']),
            Paragraph("Top Indian startups & product unicorns (Swiggy, Razorpay, etc.)", styles['Body']),
            Paragraph("Instahyre uses AI matching. Keep skills updated (React, Node, Express, MongoDB, Data Structures, Redis).", styles['Body'])
        ],
        [
            Paragraph("<b>Cutshort</b>", styles['Body']),
            Paragraph("Direct chat with engineering managers & founders", styles['Body']),
            Paragraph("Take skill assessments (React / Node) to earn verified badges. High reply rate.", styles['Body'])
        ],
        [
            Paragraph("<b>Hirist / iimjobs</b>", styles['Body']),
            Paragraph("Mid-sized to large tech companies & fintechs", styles['Body']),
            Paragraph("Set daily job alerts for 'SDE Intern', 'Junior Backend', 'Frontend Developer'.", styles['Body'])
        ],
        [
            Paragraph("<b>YC Work at a Startup</b>", styles['Body']),
            Paragraph("US/Global Y-Combinator backed AI startups", styles['Body']),
            Paragraph("Apply directly at workatastartup.com. Startup founders value full-stack AI project experience.", styles['Body'])
        ]
    ]
    t_platforms = Table(platforms_data, colWidths=[100, 160, 244])
    t_platforms.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), COLOR_CARD_BG),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('PADDING', (0,0), (-1,-1), 6),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_platforms)
    story.append(Spacer(1, 15))

    story.append(Paragraph("2. Cold Emailing & Outreach System", styles['H1']))
    story.append(Paragraph("Cold emails have a 3x higher conversion rate than blind portal applications if written crisply.", styles['Body']))
    
    email_template = (
        "<b>Subject:</b> Full-Stack Engineer (MERN + AI) | 7th Sem Engineer — Jay<br/><br/>"
        "Hi [Hiring Manager / Founder Name],<br/><br/>"
        "I saw [Company Name] is building [mention product feature]. As a Full-Stack MERN developer who recently built <b>K6Lab</b> and an <b>AI-powered Productivity Tool</b>, I love solving performance and full-stack architecture challenges.<br/><br/>"
        "<b>Quick Highlights of My Work:</b><br/>"
        "• <b>K6Lab / AI Tools:</b> Built scalable REST APIs, integrated LLM workflows, optimized Mongo aggregations & React state.<br/>"
        "• <b>DSA & Problem Solving:</b> Solved 150+ core algorithmic problems across Patterns (HashMap, DP, Monotonic Stack, Graphs).<br/>"
        "• <b>GitHub / Live Demo:</b> <font color='#0d9488'><u>github.com/jayOnWeb</u></font><br/><br/>"
        "I would love 15 minutes to share how I can contribute to your engineering team. Are you available for a brief chat this week?<br/><br/>"
        "Best regards,<br/>"
        "<b>Jay</b> | Full Stack Developer"
    )
    story.append(create_callout_box(email_template, title="PROVEN COLD EMAIL TEMPLATE", bg_color=colors.HexColor("#f0fdf4"), border_color=COLOR_EMERALD, style=styles['Callout']))
    story.append(Spacer(1, 15))

    story.append(Paragraph("3. ATS Resume Optimization Checklist", styles['H1']))
    story.append(Paragraph("• <b>Single Page Standard:</b> Clean 1-column layout without tables or heavy graphic elements.", styles['Bullet']))
    story.append(Paragraph("• <b>Action + Impact Format:</b> <i>'Engineered X using Y, resulting in Z% performance improvement'</i>.", styles['Bullet']))
    story.append(Paragraph("• <b>Highlight AI & Architecture:</b> Clearly list Node.js, React, Express, MongoDB, Redux/Zustand, Docker/Git, REST APIs, AI Integration.", styles['Bullet']))
    story.append(Paragraph("• <b>Hyperlink Proof of Work:</b> Make GitHub, Deployed URLs (Vercel), and LeetCode profile links clickable.", styles['Bullet']))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Generated {filename}")

# ==========================================
# PDF 2: DSA 60-90 DAY MASTERY ROADMAP
# ==========================================
def generate_dsa_roadmap_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54, rightMargin=54,
        topMargin=54, bottomMargin=54
    )
    styles = build_styles()
    story = []

    story.append(Paragraph("DSA Sheet Consistency & 60-90 Day Execution Plan", styles['Title']))
    story.append(Paragraph("How to Systematically Master 75 Core + Full DSA Sheet starting Sept 22", styles['Subtitle']))
    story.append(HRFlowable(width="100%", thickness=1.5, color=COLOR_INDIGO, spaceAfter=15))

    story.append(Paragraph("1. The Core Philosophy: Pattern Over Memory", styles['H1']))
    story.append(Paragraph("Do not attempt to memorize solutions. Focus on <b>Pattern Recognition</b>. Once you recognize why a problem belongs to <i>HashMap + Prefix Sum</i> or <i>Monotonic Stack</i>, you can solve 10 similar unseen problems easily.", styles['Body']))
    
    story.append(create_callout_box(
        "<b>The Daily 2.5-Hour Non-Negotiable Routine:</b><br/>"
        "• <b>30 Mins:</b> Review previous day's problem notes & mental models.<br/>"
        "• <b>60 Mins:</b> Solve 2 fresh problems from the target topic.<br/>"
        "• <b>30 Mins:</b> If stuck > 25 mins, read editorial/pattern hint, code yourself, write note in app.<br/>"
        "• <b>30 Mins:</b> Maintain your active streak on your custom React DSA Tracker!",
        title="DAILY CONSISTENCY PROTOCOL", bg_color=colors.HexColor("#fef3c7"), border_color=COLOR_AMBER, style=styles['Callout']
    ))
    story.append(Spacer(1, 15))

    story.append(Paragraph("2. Month-by-Month Topic Breakdown", styles['H1']))

    breakdown_data = [
        [Paragraph("<b>Phase & Timeline</b>", styles['Body']), Paragraph("<b>Focus Topics & Core Patterns</b>", styles['Body']), Paragraph("<b>Target Problems</b>", styles['Body'])],
        [
            Paragraph("<b>Phase 1</b><br/>Weeks 1 - 3<br/><i>(Sept 22 - Oct 12)</i>", styles['Body']),
            Paragraph("<b>Arrays, Strings & Stacks</b><br/>Two Pointers, Sliding Window, Prefix Sum, Kadane, Monotonic Stack progression (20→496→739→503→84→85).", styles['Body']),
            Paragraph("Array (32)<br/>String (30)<br/>Stack (14)<br/><b>~76 Problems</b>", styles['Body'])
        ],
        [
            Paragraph("<b>Phase 2</b><br/>Weeks 4 - 6<br/><i>(Oct 13 - Nov 02)</i>", styles['Body']),
            Paragraph("<b>Linked Lists, Trees & Heaps</b><br/>Fast/Slow pointers, Tree DFS/BFS, BST property, Tree DP, Top K elements, Two Heaps.", styles['Body']),
            Paragraph("Queue/Heap (13)<br/>Linked List (15)<br/>Tree (23)<br/><b>~51 Problems</b>", styles['Body'])
        ],
        [
            Paragraph("<b>Phase 3</b><br/>Weeks 7 - 9<br/><i>(Nov 03 - Nov 23)</i>", styles['Body']),
            Paragraph("<b>Graphs, DP & Backtracking</b><br/>Grid DFS/BFS, Topological Sort, Union Find, Dijkstra, 1D/2D DP, Knapsack, Decision trees.", styles['Body']),
            Paragraph("Graph (23)<br/>DP (31)<br/>Backtracking (20)<br/><b>~74 Problems</b>", styles['Body'])
        ],
        [
            Paragraph("<b>Phase 4</b><br/>Final Weeks<br/><i>(Nov 24 - Dec 15)</i>", styles['Body']),
            Paragraph("<b>Core 75 Mastery & Mock Contests</b><br/>Re-solve Core 75 timed (20 mins/medium), practice mock interviews.", styles['Body']),
            Paragraph("Core 75 Revision<br/>Mock Tests", styles['Body'])
        ]
    ]
    t_breakdown = Table(breakdown_data, colWidths=[110, 260, 134])
    t_breakdown.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), COLOR_CARD_BG),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('PADDING', (0,0), (-1,-1), 6),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_breakdown)
    story.append(Spacer(1, 15))

    story.append(Paragraph("3. Handling 7th Semester Exams Gap", styles['H1']))
    story.append(Paragraph("When your 7th semester exams start (2-3 weeks gap):", styles['Body']))
    story.append(Paragraph("1. <b>Do NOT drop streak to zero:</b> Solve just 1 easy problem daily (15 mins) to keep the streak & mental inertia active.", styles['Bullet']))
    story.append(Paragraph("2. <b>Use Flashcards / Mental Models:</b> Review the <i>Patterns & Guides</i> tab in your app during exam breaks.", styles['Bullet']))
    story.append(Paragraph("3. <b>Immediate Recovery:</b> Resume 2.5-hour schedule right on the last day of exams.", styles['Bullet']))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Generated {filename}")

# ==========================================
# PDF 3: MERN STACK INTERVIEW GUIDE
# ==========================================
def generate_mern_guide_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54, rightMargin=54,
        topMargin=54, bottomMargin=54
    )
    styles = build_styles()
    story = []

    story.append(Paragraph("Full-Stack MERN Interview Deep-Dive Guide", styles['Title']))
    story.append(Paragraph("Must-Know Core Concepts, Architecture & Project Pitching (K6Lab & AI Tools)", styles['Subtitle']))
    story.append(HRFlowable(width="100%", thickness=1.5, color=COLOR_EMERALD, spaceAfter=15))

    story.append(Paragraph("1. React.js Concepts Interviewers Ask", styles['H1']))
    story.append(Paragraph("• <b>Virtual DOM & Fiber Reconciler:</b> How React calculates minimal DOM updates using double buffering & incremental rendering tree traversal.", styles['Bullet']))
    story.append(Paragraph("• <b>React Hooks Deep-Dive:</b> <code>useMemo</code>, <code>useCallback</code> for memoization; <code>useRef</code> for persistent values without re-render; custom hook design.", styles['Bullet']))
    story.append(Paragraph("• <b>State Management:</b> Context API vs Zustand / Redux Toolkit. Avoiding unnecessary re-renders with atomic selectors.", styles['Bullet']))
    story.append(Paragraph("• <b>Performance Optimization:</b> Lazy loading (<code>React.lazy</code> + <code>Suspense</code>), code splitting, virtualization (large lists), image optimization.", styles['Bullet']))

    story.append(Spacer(1, 10))
    story.append(Paragraph("2. Node.js & Express Internals", styles['H1']))
    story.append(Paragraph("• <b>Event Loop & Libuv Thread Pool:</b> Timers → Pending Callbacks → Idle/Prepare → Poll (I/O) → Check (setImmediate) → Close Callbacks. Microtasks (<code>process.nextTick</code> & Promises) run between phases.", styles['Bullet']))
    story.append(Paragraph("• <b>Streams & Buffer:</b> Readable, Writable, Transform streams for memory-efficient handling of large payloads (video, bulk files).", styles['Bullet']))
    story.append(Paragraph("• <b>Express Middleware Pipeline:</b> Error handling middleware <code>(err, req, res, next)</code>, rate limiting, CORS, Helmet security headers, JWT authentication flow.", styles['Bullet']))

    story.append(Spacer(1, 10))
    story.append(Paragraph("3. MongoDB & Database Engineering", styles['H1']))
    story.append(Paragraph("• <b>Indexing Strategies:</b> Single field, Compound indexes, ESR rule (Equality, Sort, Range), TTL indexes, Partial indexes.", styles['Bullet']))
    story.append(Paragraph("• <b>Aggregation Pipeline:</b> <code>$match</code>, <code>$group</code>, <code>$project</code>, <code>$lookup</code> (joins), <code>$unwind</code>, and <code>$facet</code> for parallel aggregations.", styles['Bullet']))
    story.append(Paragraph("• <b>Data Modeling:</b> Embedded documents (1:N small) vs Referenced relationships (1:N large / M:N). Transaction handling with sessions.", styles['Bullet']))

    story.append(Spacer(1, 10))
    story.append(Paragraph("4. Showcasing K6Lab & AI Projects in Interviews", styles['H1']))
    
    story.append(create_callout_box(
        "<b>How to pitch your projects (STAR Format):</b><br/><br/>"
        "<b>K6Lab (Performance / Testing AI Tool):</b><br/>"
        "<i>'I built K6Lab to simplify performance testing using AI. I engineered Node.js backend streams to process live load-test metrics, integrated LLM APIs for automated bottleneck analysis, and optimized MongoDB compound indexes, reducing analytical query latency by 60%.'</i><br/><br/>"
        "<b>Productivity AI Tool:</b><br/>"
        "<i>'Designed a full-stack MERN productivity suite integrating OpenAI/Gemini endpoints with custom prompt chaining, stateful client side caching using Zustand, and JWT auth with refresh token rotation.'</i>",
        title="ELEVATOR PITCH & ARCHITECTURAL HIGHLIGHTS", bg_color=colors.HexColor("#f0fdf4"), border_color=COLOR_EMERALD, style=styles['Callout']
    ))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Generated {filename}")

if __name__ == "__main__":
    out_dir = "/Users/jaykacha/Documents/antigravity/resilient-turing/public/pdfs"
    os.makedirs(out_dir, exist_ok=True)
    
    generate_job_search_pdf(os.path.join(out_dir, "Off_Campus_Job_Search_Blueprint.pdf"))
    generate_dsa_roadmap_pdf(os.path.join(out_dir, "DSA_60_90_Day_Mastery_Roadmap.pdf"))
    generate_mern_guide_pdf(os.path.join(out_dir, "MERN_Stack_Interview_Guide.pdf"))
    print("All 3 PDFs generated successfully!")
