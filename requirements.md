# UST GradeTracker Requirements Document

## Introduction

UST GradeTracker is a multi-page web application designed for University of Santo Tomas (UST) students to visually track their academic progress. The application addresses the core pain point that the current UST portal is entirely text-based with zero visual feedback. UST GradeTracker transforms raw grade data into intuitive visualizations, color-coded indicators, and intelligent projections, enabling students to understand their academic standing at a glance and make informed decisions about their studies.

The application provides four core features: personalized welcome experience, semester grade tracking with visual analytics, Latin honor projection dashboard, and subject-level grade calculation tools. All data persists locally on the student's device, ensuring privacy and offline accessibility.

## Glossary

- **GradeTracker**: The UST GradeTracker web application
- **Student**: A UST student using the application
- **Semester**: An academic term (1st Term or 2nd Term) within an academic year
- **Grade**: A numerical or letter grade assigned to a subject
- **GWA**: General Weighted Average; the cumulative GPA across all semesters
- **Latin_Honors**: Academic distinction tiers (Cum Laude, Magna Cum Laude, Summa Cum Laude)
- **Subject**: An individual course taken by the student
- **College**: An academic unit within UST (e.g., College of Information and Computing Sciences)
- **Curriculum**: The structured set of subjects required for a degree program
- **OCR**: Optical Character Recognition; technology to extract text from images
- **Risk_Alert**: A visual indicator warning of low grades or GWA decline
- **Color_Code**: A visual system using colors to represent grade ranges or academic standing
- **Projection**: A calculated forecast of future GWA or Latin honors tier based on current performance
- **Component**: A grading element (e.g., Midterm, Final, Participation) that contributes to a subject grade
- **Target_Grade**: A desired grade the student aims to achieve in a subject
- **Feasibility_Analysis**: An assessment of whether a target grade is achievable given current performance
- **localStorage**: Browser-based client-side storage for persisting application data
- **UST_Colors**: The official UST color palette (Gold #F5A800, Black #1C1C1C, White #FFFFFF, Dark accent #2C1810)

## Requirements

### Requirement 1: Welcome and Personalization

**User Story:** As a new student, I want to enter my name on a welcoming landing page, so that the application feels personal and addresses me by name throughout my experience.

#### Acceptance Criteria

1. WHEN the GradeTracker is first loaded, THE Application SHALL display a full-screen welcome page with UST branding and logo
2. THE Welcome_Page SHALL include a single text input field labeled "Enter your name"
3. WHEN the Student enters their name and submits, THE Application SHALL store the name in localStorage
4. WHEN the Student returns to the application, THE Application SHALL retrieve the stored name from localStorage and skip the welcome page
5. THE Application SHALL display the Student's name in a personalized greeting on the welcome page
6. WHERE the Student wishes to change their name, THE Application SHALL provide a settings option to update the stored name
7. THE Welcome_Page SHALL use UST Colors (Gold #F5A800 and Black #1C1C1C) with refined academic aesthetic
8. THE Welcome_Page SHALL be fully responsive on desktop and tablet devices

#### Correctness Properties

- **Idempotence**: Entering the same name multiple times SHALL result in the same stored value
- **Round-trip**: Storing a name in localStorage and retrieving it SHALL return the exact same string
- **Invariant**: The Student's name SHALL remain consistent across all pages until explicitly changed

---

### Requirement 2: Semester Grade Upload and Display

**User Story:** As a student, I want to upload my semester grades via image or manual entry, so that I can visualize my academic performance with charts and color-coded indicators.

#### Acceptance Criteria

1. WHEN the Student navigates to the Grade Upload page, THE Application SHALL display an upload interface with two input methods: image upload and manual table entry
2. WHEN the Student uploads an image of their grade sheet, THE Application SHALL attempt to extract grade data using OCR
3. IF OCR extraction fails or produces incomplete data, THE Application SHALL display the extracted data for manual correction
4. WHEN the Student manually enters grades, THE Application SHALL accept subject name, grade value, and credit units
5. THE Application SHALL validate that grade values are within the valid range (0-100 or A-F scale)
6. WHEN grade data is submitted, THE Application SHALL store the semester grades in localStorage with semester identifier and academic year
7. THE Application SHALL display all entered grades in a sortable, filterable table with columns: Subject, Grade, Credit Units, Grade_Points
8. THE Application SHALL calculate and display the semester GPA based on weighted average of grades
9. THE Application SHALL support multiple semesters, allowing the Student to add, edit, and view grades from different academic periods
10. THE Application SHALL display a line chart showing GPA trends across semesters
11. THE Application SHALL display a bar chart comparing grades across subjects within a semester
12. THE Application SHALL apply color-coding to grades: Green (80-100), Yellow (70-79), Orange (60-69), Red (below 60)
13. WHEN a grade falls below 70, THE Application SHALL display a Risk_Alert indicator for that subject
14. WHEN semester GPA drops below 2.0, THE Application SHALL display a Risk_Alert for the entire semester
15. THE Grade_Upload page SHALL be fully responsive on desktop and tablet devices

#### Correctness Properties

- **Invariant**: The sum of (grade × credit_units) divided by total credit units SHALL equal the displayed semester GPA
- **Round-trip**: Uploading grades, storing in localStorage, and retrieving SHALL produce equivalent grade data
- **Metamorphic**: Adding a new subject with average grade SHALL not decrease the overall GPA if the new grade equals the current GPA
- **Idempotence**: Submitting the same grade data multiple times SHALL result in a single entry (no duplicates)

---

### Requirement 3: Latin Honor Tracker and GWA Projection

**User Story:** As a student pursuing Latin honors, I want to track my progress toward Cum Laude, Magna Cum Laude, or Summa Cum Laude, so that I can understand my current standing and project my final GWA.

#### Acceptance Criteria

1. WHEN the Student navigates to the Latin Honor Tracker, THE Application SHALL display a college selection dropdown with all UST colleges
2. WHEN the Student selects a college, THE Application SHALL display a course selection dropdown with available programs
3. WHERE the Student selects College of Information and Computing Sciences, THE Application SHALL display the Computer Science curriculum with all required subjects
4. THE Application SHALL display the curriculum as a structured list organized by year and semester
5. THE Application SHALL allow the Student to mark subjects as completed and enter their grades
6. THE Application SHALL calculate the current GWA excluding NSTP subjects (as per UST Latin honors policy)
7. THE Application SHALL display the current GWA prominently on the dashboard
8. THE Application SHALL display three Latin honors tiers with their GWA thresholds: Summa Cum Laude (≥3.5), Magna Cum Laude (≥3.25), Cum Laude (≥3.0)
9. THE Application SHALL highlight the Student's current tier based on their GWA
10. THE Application SHALL calculate and display the projected final GWA based on: (a) completed subjects with grades, (b) remaining subjects with assumed average grade
11. WHEN the Student adjusts assumed grades for remaining subjects, THE Application SHALL recalculate the projected GWA in real-time
12. THE Application SHALL display a visual indicator showing the gap between current GWA and the next honors tier
13. THE Application SHALL calculate the minimum average grade needed in remaining subjects to achieve each honors tier
14. THE Application SHALL display a progress bar showing completion percentage of the curriculum
15. THE Latin_Honor_Tracker page SHALL use warm, encouraging tone with motivational messages
16. THE Latin_Honor_Tracker page SHALL be fully responsive on desktop and tablet devices

#### Correctness Properties

- **Invariant**: The current GWA SHALL never exceed 4.0 or fall below 0.0
- **Invariant**: The projected GWA SHALL be between the current GWA and 4.0 (assuming positive grades for remaining subjects)
- **Round-trip**: Entering grades for all subjects and calculating GWA, then retrieving from localStorage, SHALL produce the same GWA value
- **Metamorphic**: Adding a subject with a grade equal to the current GWA SHALL not change the overall GWA (approximately)
- **Idempotence**: Recalculating GWA multiple times with the same input data SHALL produce the same result

---

### Requirement 4: Subject Grade Calculator

**User Story:** As a student, I want to calculate what grade I need on remaining assessments to achieve a target grade in a subject, so that I can plan my study efforts strategically.

#### Acceptance Criteria

1. WHEN the Student navigates to the Subject Grade Calculator, THE Application SHALL display a form to input grading system details
2. THE Application SHALL accept an image upload of the grading system (e.g., syllabus screenshot showing component weights)
3. IF image upload is provided, THE Application SHALL attempt to extract component names and weights using OCR
4. IF OCR extraction fails, THE Application SHALL display extracted data for manual correction
5. THE Application SHALL allow manual entry of grading components with their weights (e.g., Midterm 30%, Final 40%, Participation 30%)
6. THE Application SHALL validate that component weights sum to 100%
7. WHEN component weights are confirmed, THE Application SHALL display an assessment input form
8. THE Application SHALL allow the Student to enter current grades for completed assessments
9. THE Application SHALL allow the Student to enter a Target_Grade they wish to achieve
10. WHEN a Target_Grade is entered, THE Application SHALL calculate the required grade on remaining assessments
11. THE Application SHALL display the required grade with a Feasibility_Analysis: (a) achievable (required grade ≤ 100), (b) challenging (required grade 90-100), (c) not achievable (required grade > 100)
12. THE Application SHALL display a visual breakdown of current grade contribution vs. remaining assessment contribution
13. THE Application SHALL support multiple subjects, allowing the Student to save and retrieve calculator states
14. THE Application SHALL store calculator data in localStorage with subject identifier
15. THE Subject_Grade_Calculator page SHALL be fully responsive on desktop and tablet devices

#### Correctness Properties

- **Invariant**: Component weights SHALL always sum to 100%
- **Round-trip**: Entering component weights, calculating required grade, and retrieving from localStorage SHALL produce the same required grade
- **Idempotence**: Calculating the required grade multiple times with the same input data SHALL produce the same result
- **Metamorphic**: If current grade equals target grade, the required grade on remaining assessments SHALL equal the target grade

---

### Requirement 5: Data Persistence and Storage

**User Story:** As a student, I want my data to persist across browser sessions, so that I don't lose my grades and progress when I close the application.

#### Acceptance Criteria

1. THE Application SHALL store all student data in browser localStorage
2. WHEN the Student enters data (name, grades, calculator states), THE Application SHALL automatically save to localStorage
3. WHEN the Student closes and reopens the application, THE Application SHALL retrieve all stored data from localStorage
4. THE Application SHALL display a data export option allowing the Student to download their data as JSON
5. THE Application SHALL display a data import option allowing the Student to restore data from a previously exported JSON file
6. WHERE the Student wishes to clear all data, THE Application SHALL provide a "Clear All Data" option with confirmation dialog
7. THE Application SHALL validate imported data for integrity before restoring
8. IF imported data is corrupted or invalid, THE Application SHALL display an error message and preserve existing data

#### Correctness Properties

- **Round-trip**: Exporting data to JSON and importing it back SHALL produce equivalent data
- **Idempotence**: Saving the same data multiple times SHALL result in a single stored version
- **Invariant**: Data in localStorage SHALL match the last saved state until explicitly modified

---

### Requirement 6: Visual Design and User Interface

**User Story:** As a student, I want the application to feel refined and academically appropriate, so that I'm motivated to use it regularly and trust the data it displays.

#### Acceptance Criteria

1. THE Application SHALL use UST Colors: Gold (#F5A800), Black (#1C1C1C), White (#FFFFFF), Dark accent (#2C1810)
2. THE Application SHALL use typography: Playfair Display for headings and DM Sans for body text (or Cormorant Garamond + Outfit as alternative)
3. THE Application SHALL apply a refined academic aesthetic with elegant cards, subtle grain texture, and dark navy/gold accents
4. THE Application SHALL display the Student's name prominently on each page in a warm, personalized manner
5. THE Application SHALL use consistent navigation across all pages (e.g., sidebar or top navigation)
6. THE Application SHALL display motivational messages tailored to the Student's academic standing
7. THE Application SHALL use color-coding consistently across all pages (Green for strong performance, Yellow for caution, Orange for concern, Red for risk)
8. THE Application SHALL ensure all text has sufficient contrast for accessibility (WCAG AA standard)
9. THE Application SHALL be fully responsive on desktop (1920px+), tablet (768px-1024px), and mobile (320px-767px) devices
10. THE Application SHALL load within 2 seconds on standard internet connections
11. THE Application SHALL provide smooth transitions and animations that enhance usability without distraction

#### Correctness Properties

- **Invariant**: Color-coding SHALL be consistent across all pages and components
- **Invariant**: Typography sizes and weights SHALL follow a consistent scale
- **Idempotence**: Navigating between pages and returning SHALL preserve the UI state

---

### Requirement 7: Chart and Visualization Components

**User Story:** As a student, I want to see my grades visualized in charts, so that I can quickly understand trends and patterns in my academic performance.

#### Acceptance Criteria

1. THE Application SHALL use Recharts or Chart.js for all visualizations
2. THE Application SHALL display a line chart showing GPA trends across semesters with clear axis labels and legend
3. THE Application SHALL display a bar chart comparing grades across subjects within a selected semester
4. THE Application SHALL display a pie chart showing the distribution of grade ranges (A, B, C, D, F) across all semesters
5. THE Application SHALL display a progress bar showing curriculum completion percentage in the Latin Honor Tracker
6. THE Application SHALL display a visual gauge showing current GWA relative to honors tiers
7. THE Application SHALL display a stacked bar chart in the Subject Grade Calculator showing current grade contribution vs. remaining assessment contribution
8. ALL charts SHALL be interactive, allowing the Student to hover for detailed values
9. ALL charts SHALL be responsive and adapt to different screen sizes
10. ALL charts SHALL use UST Colors and maintain visual consistency with the application design

#### Correctness Properties

- **Invariant**: Chart data points SHALL match the underlying data in localStorage
- **Round-trip**: Exporting chart data and re-importing SHALL produce visually identical charts
- **Idempotence**: Rendering the same chart multiple times with the same data SHALL produce identical visualizations

---

### Requirement 8: Error Handling and Validation

**User Story:** As a student, I want the application to guide me when I make mistakes, so that I can correct errors and continue using the application smoothly.

#### Acceptance Criteria

1. WHEN the Student enters invalid data (e.g., grade > 100), THE Application SHALL display a clear error message
2. THE Application SHALL prevent submission of invalid data and highlight the problematic field
3. WHEN OCR extraction fails, THE Application SHALL display the extracted data with a warning and allow manual correction
4. WHEN localStorage is unavailable, THE Application SHALL display a warning and offer to use session storage as fallback
5. WHEN imported data is corrupted, THE Application SHALL display a specific error message and preserve existing data
6. THE Application SHALL validate component weights sum to 100% before allowing calculator submission
7. THE Application SHALL display helpful tooltips explaining each input field
8. THE Application SHALL provide undo/redo functionality for recent data entries

#### Correctness Properties

- **Invariant**: Invalid data SHALL never be stored in localStorage
- **Idempotence**: Displaying the same error message multiple times SHALL not affect application state

---

### Requirement 9: Curriculum Data Management

**User Story:** As a Computer Science student, I want the application to include my curriculum with all required subjects, so that I can track my progress through the program.

#### Acceptance Criteria

1. THE Application SHALL include the complete UST Computer Science curriculum with all subjects organized by year and semester
2. THE Application SHALL display subject details: code, name, lecture units, lab units, prerequisites, and notes
3. THE Application SHALL mark NSTP subjects as excluded from Latin honors calculation
4. THE Application SHALL allow the Student to mark subjects as completed and enter grades
5. THE Application SHALL validate that prerequisites are met before allowing grade entry for dependent subjects
6. THE Application SHALL support multiple colleges and programs (with Computer Science as the primary focus)
7. THE Application SHALL allow future expansion to include other UST college curricula

#### Correctness Properties

- **Invariant**: NSTP subjects SHALL always be excluded from GWA calculation
- **Invariant**: Total curriculum units SHALL match the official UST Computer Science curriculum (164 units)
- **Idempotence**: Retrieving curriculum data multiple times SHALL produce identical subject lists

---

### Requirement 10: Responsive Design and Accessibility

**User Story:** As a student, I want to use the application on any device (desktop, tablet, mobile), so that I can check my grades anytime, anywhere.

#### Acceptance Criteria

1. THE Application SHALL be fully responsive on desktop (1920px+), tablet (768px-1024px), and mobile (320px-767px) devices
2. THE Application SHALL use a mobile-first design approach
3. THE Application SHALL adapt layout, font sizes, and chart sizes for different screen sizes
4. THE Application SHALL ensure all interactive elements are touch-friendly on mobile devices (minimum 44px tap target)
5. THE Application SHALL provide keyboard navigation for all interactive elements
6. THE Application SHALL use semantic HTML for screen reader compatibility
7. THE Application SHALL include alt text for all images and charts
8. THE Application SHALL ensure color is not the only means of conveying information (use patterns, labels, or text)
9. THE Application SHALL maintain a logical tab order for keyboard navigation
10. THE Application SHALL display a skip-to-content link for keyboard users

#### Correctness Properties

- **Invariant**: Layout SHALL adapt correctly to all specified screen sizes
- **Idempotence**: Resizing the browser window and returning to original size SHALL restore the original layout

---

### Requirement 11: Performance and Optimization

**User Story:** As a student, I want the application to load quickly and respond instantly to my interactions, so that I can efficiently track my grades without frustration.

#### Acceptance Criteria

1. THE Application SHALL load within 2 seconds on standard internet connections (3G/4G)
2. THE Application SHALL respond to user interactions (clicks, input) within 100ms
3. THE Application SHALL optimize chart rendering to avoid lag when displaying large datasets
4. THE Application SHALL use lazy loading for images and heavy components
5. THE Application SHALL minimize bundle size by using efficient libraries (Recharts or Chart.js)
6. THE Application SHALL cache static assets for faster subsequent loads
7. THE Application SHALL use efficient localStorage queries to minimize data retrieval time

#### Correctness Properties

- **Invariant**: Application performance SHALL not degrade as more semesters are added
- **Idempotence**: Loading the application multiple times SHALL take approximately the same time

---

### Requirement 12: Tone and Messaging

**User Story:** As a student, I want the application to feel warm and encouraging, so that I'm motivated to track my progress and stay engaged with my studies.

#### Acceptance Criteria

1. THE Application SHALL use warm, encouraging language throughout all pages and messages
2. THE Application SHALL always address the Student by their name in greetings and messages
3. THE Application SHALL provide personalized motivational messages based on the Student's academic standing
4. WHEN the Student's GWA is strong (≥3.5), THE Application SHALL display encouraging messages about their excellent progress
5. WHEN the Student's GWA is at risk (< 2.0), THE Application SHALL display supportive messages with actionable suggestions
6. THE Application SHALL use an academic but approachable tone, avoiding jargon where possible
7. THE Application SHALL provide helpful context and explanations for technical terms (e.g., GWA, Latin honors)
8. THE Application SHALL celebrate milestones (e.g., completing a semester, achieving a target grade)

#### Correctness Properties

- **Invariant**: Motivational messages SHALL be appropriate to the Student's current academic standing
- **Idempotence**: Displaying the same motivational message multiple times SHALL not diminish its impact

---

## Non-Functional Requirements

### Technology Stack

- **Frontend Framework**: React (preferred) or plain HTML/CSS/JavaScript
- **Charting Library**: Recharts or Chart.js
- **Storage**: Browser localStorage (client-side only)
- **Styling**: CSS-in-JS or CSS modules with responsive design
- **Build Tool**: Vite, Webpack, or Create React App
- **Package Manager**: npm or yarn

### Deployment

- THE Application SHALL be deployable as a static web application
- THE Application SHALL require no backend server or database
- THE Application SHALL be accessible via HTTPS
- THE Application SHALL work offline after initial load (with service worker support)

### Browser Compatibility

- THE Application SHALL support Chrome/Edge 90+
- THE Application SHALL support Firefox 88+
- THE Application SHALL support Safari 14+
- THE Application SHALL support mobile browsers (iOS Safari 14+, Chrome Mobile 90+)

### Data Privacy

- THE Application SHALL store all data locally in the Student's browser
- THE Application SHALL not transmit any student data to external servers
- THE Application SHALL not use any third-party analytics or tracking
- THE Application SHALL provide a clear data deletion option

### Accessibility

- THE Application SHALL comply with WCAG 2.1 Level AA standards
- THE Application SHALL be tested with screen readers (NVDA, JAWS, VoiceOver)
- THE Application SHALL support keyboard-only navigation
- THE Application SHALL provide sufficient color contrast (4.5:1 for normal text)

