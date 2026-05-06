# User Prompts

## Prompt 1

```text
okay so heres the task 

# Project: UST GradeTracker — Visual Academic Progress Dashboard

## Overview
Build a multi-page web application for University of Santo Tomas (UST) students to visually track academic progress. The core pain point is that the current UST portal is entirely text-based with zero visual feedback. This app fixes that with graphs, color-coded indicators, and intelligent projections.

---

## Design System & Theme

Use the official UST color palette throughout:
- Primary: #4B2E83 (UST Gold Yellow) → actually UST's gold is #F5A800 and main color is #1A1A2E dark navy/black
- Correct UST colors:
  - Gold/Yellow: #F5A800
  - Black: #1C1C1C
  - White: #FFFFFF
  - Dark accent: #2C1810
- Typography: Use a refined serif or editorial display font paired with a clean sans-serif body font. Avoid Inter, Roboto, Arial. Suggest: Playfair Display + DM Sans, or Cormorant Garamond + Outfit.
- Aesthetic direction: Refined academic — think premium university portal. Dark navy/gold accents, elegant cards, subtle grain texture on backgrounds, clean data visualization.
- Apply the `.agent/skills/frontend-design` and `.agent/skills/ui-ux-pro-max` skills throughout all UI decisions.

---

## App Flow

### Step 0: Welcome / Name Entry Screen
- Full-screen landing with UST branding (logo area, colors, subtle pattern/texture)
- Single input: "What's your name, Thomasian?"
- Store the name in app state — use it throughout the entire app in greetings, labels, and messages (e.g., "Welcome back, [Name]!", "Here's your progress, [Name].")
- Proceed button leads to the main dashboard

---

### Step 1: Grade Upload — Semester Grades Input

**Screen: Upload Your Grades**
- Prompt: "Upload a screenshot of your grades for Semester 1."
- Accept image upload (PNG/JPG)
- Use OCR or display the image with a manual entry table fallback
- Display grades in a **table on the left** (Subject | Prelim | Midterm | Finals | Final Grade)
- Display **graphical representations on the right**:
  - Line chart showing grade trend per subject over the grading period (Prelim → Midterm → Finals)
  - Bar chart comparing all subjects side-by-side for the semester
  - Color coding: 
    - 1.00–1.50 = Green (Excellent)
    - 1.51–2.00 = Blue (Good)
    - 2.01–2.50 = Yellow (Satisfactory)
    - 2.51–3.00 = Orange (Passing)
    - Below 3.00 / 5.00 = Red (At Risk)
- Show a risk alert banner if any subject is at risk
- Allow filtering by subject to isolate individual course trends
- Support multiple semesters — allow adding Semester 2 and beyond to compare across semesters

---

### Step 2: Latin Honor Tracker

**Screen: Latin Honor Eligibility Tracker**

#### Sub-step A: College Selection
- Ask: "What college are you from?"
- Show a searchable dropdown menu of all UST colleges (sourced from `UST_COLLEGES.md`)
- User can type to filter the list

#### Sub-step B: Course Selection (CICS only for now)
- If user selects **College of Information and Computing Sciences (CICS)**, show a second dropdown:
  - Computer Science
  - Information Technology
  - Information Systems

#### Sub-step C: Curriculum-Based Tracking
- If **Computer Science** is selected, load curriculum data from `COMPSCI_UST.md`
  - Pull: list of subjects per year/semester, unit counts per subject
  - Calculate total curriculum units
  - Ask user to input their grades for completed subjects (or pull from Step 1 data if available)

#### Sub-step D: Latin Honor Projection Dashboard
Display a projection/forecasting card for each Latin honors tier:

| Tier | Required GWA |
|------|-------------|
| Cum Laude | 1.75 or better |
| Magna Cum Laude | 1.50 or better |
| Summa Cum Laude | 1.25 or better |

For each tier, the system must:
1. Calculate total units completed vs. total curriculum units remaining
2. Compute current cumulative GWA from entered grades (weighted by units)
3. **Forecast the required average GWA** the student must maintain across all remaining semesters to hit that tier
4. Show the **gap**: difference between current GWA and required GWA
5. If required grade is better than 1.000 (impossible), mark tier as **"No longer reachable"** and show a soft, encouraging message (e.g., "Keep pushing — you're building something great, [Name].")
6. If tier is still reachable, show a clear target: "You need to average **1.60** across your remaining **X semesters**."

UI: Show each tier as a card with a progress arc/gauge, color-coded status badge, and the projection details. Make it motivating and visual.

---

### Step 3: Subject Grade Calculator

**Screen: Target Grade Calculator**

#### Input Flow:
1. **Upload grading system screenshot** — user uploads a photo/screenshot of the professor's grading breakdown (e.g., "Quizzes 30%, Midterm 30%, Finals 40%")
2. **Parse the grading system** — display the parsed components as editable fields:
   - Component name (e.g., Quiz, Assignment, Midterm Exam)
   - Weight (%) 
   - Number of assessments under that component
3. **For each assessment**, generate an input row with:
   - Max Score field
   - Score Achieved field (leave blank if not yet taken)
4. **Desired final grade input** — "What grade do you want for this subject?"
5. **Calculate** — the system solves for the minimum required scores on all blank (future) assessments to reach the target grade
6. Display results clearly:
   - Show computed scores needed per remaining assessment
   - If target is mathematically impossible given remaining assessments, show a message: "This grade may no longer be reachable with current scores, [Name]. Here's the best possible grade you can achieve."
   - Color-code feasibility (green = easily reachable, yellow = challenging but possible, red = not reachable)

---

## Technical Requirements

- **Framework**: React (preferred) or plain HTML/CSS/JS
- **Charts**: Use Recharts or Chart.js for all data visualizations
- **State**: Persist the user's name and uploaded grades across all pages/tabs using React state or localStorage
- **Image upload**: Use standard `<input type="file">` with FileReader API; display image preview
- **Responsive**: Must work on desktop and tablet
- **No backend required**: All calculations client-side; curriculum data loaded from local markdown/JSON files
- **Files to include in project**:
  - `UST_COLLEGES.md` — list of all UST colleges for the dropdown
  - `COMPSCI_UST.md` — Computer Science curriculum with subject names and unit counts

---

## Navigation
- Persistent top nav bar with UST branding, student name, and links to:
  - Dashboard (Grade Tracker)
  - Latin Honor Tracker
  - Subject Calculator
- Active tab highlighted in UST gold

---

## Tone & Copy
- Warm, encouraging, personal — always address the student by their entered name
- Academic but not cold — think "smart senior student helping you" not "bureaucratic portal"
- Soft motivational messages on empty states and unreachable projections

---

## Deliverables
Generate the complete working application with all screens, components, and logic implemented. Apply the `frontend-design` and `ui-ux-pro-max` agent skills for all visual and UX decisions.
```

## Prompt 2

```text
heres a sample of our grades 

in UST we dont have mid terms only prelims and finals, so just compute for the final grade using the Prelim and Final then display the final average at the bottom
```

Image attached: sample UST grades screenshot.

## Prompt 3

```text
why is the bar chart for inverted?! its starting from the top
```

## Prompt 4

```text
no okay actually the grades in the finals is already the final average so from there compute the finals grade.
```

## Prompt 5

```text
use this image for the logo. The name of the website is USTats
```

File/image mentioned: `C:/Users/Lance/Downloads/681795370_1375440107815941_4797188754921862257_n.png`

## Prompt 6

```text
can you also add forecasting logic on the "safety" or "risk" of their grades similar to something like this
```

Image attached: safety/risk dashboard mockup.

## Prompt 7

```text
for the semester records there still so much space in the left. make it so that I dont have to scroll to see the whole part
```

## Prompt 8

```text
dont make the logo awkward convert it into a png/trasnparent then sclae it from there
```

## Prompt 9

```text
make it so that the cics programs does not show up yet until I have clicked the cics
```

Image attached: CICS programs visible before selecting CICS.

## Prompt 10

```text
dont say this verbatim Select College of Information and Computing Sciences to show CICS programs, Pacs.

say select a college first bro
```

## Prompt 11

```text
also make a log out button that resets you to the start of the page
```

## Prompt 12

```text
this part doesnt really show nothing yet make the things scale depending on your progress 

so for example my current grade is 1.39 which surpasses the required gpa for cum laude. so it shows that its full and the requirements have been successfuly met for this and congratulate them
```

Image attached: Latin honor tracker cards.

## Prompt 13

```text
like show it like this depending on the grade. 
```

Image attached: Latin Honors Tracker reference modal.

## Prompt 14

```text
yes semesters left but for this case I think we can also use the amounts of units
```

## Prompt 15

```text
like here are the units for ust computer science.
```

File mentioned: `C:\Users\Lance\Desktop\DevProjects\KiroChallenge\COMPSCI_UST.md`

## Prompt 16

```text
by the way I think we can disregard the bottom part of the latin honor tracker part where it shows the curriculum based tracking since that part can still be visible in  the dashboard/grade tracker
```

## Prompt 17

```text
make the gap clearer currently it does not really look close until you look at it more clearly. also start cum laude on the magna middle then summa on the right
```

## Prompt 18

```text
the forecasting here is wrong it says across 8 semesterss but since I added already 1 semester it should say 7 instead
```

Image attached: Latin honors summary showing 8 semesters.

## Prompt 19

```text
upload this to vercel
```

## Prompt 20

```text
just upload the code into this remote repo https://github.com/AxeL21-cs/USTats.git
```

## Prompt 21

```text
also add a feature where we can delete the current uploaded grades
```

## Prompt 22

```text
add here a button to delete these grades or maybe add also a button to start over fresh with no grades
```

Diff comment context:

```text
File: browser:2025-2026 1st Term
Side: R
Lines: 1
Node position: (144, 407) in 599x694 viewport
Page URL: http://127.0.0.1:5173/
Frame: top document
Target: 2025-2026 1st Term
Target selector: main.page-grid > section.toolbar-row:nth-of-type(2) > div.segmented > button.active
Target path: main > section > div > button
Comment:
add here a button to delete these grades or maybe add also a button to start over fresh with no grades
```

## Prompt 23

```text
also the course trend is inverted fix it like you did with the bar graph
```

## Prompt 24

```text
update this commit on vercel and also as well to the repo add the new commit and push iti
```

## Prompt 25

```text
can you compile me all the prompts I have given you
```

## Prompt 26

```text
the exact prompt
```

## Prompt 27

```text
yes please place it into a md file
```
