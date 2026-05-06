# Implementation Plan: USTats

## Overview

This implementation plan breaks down the USTats application into discrete, sequential coding tasks. The application is a React 18 + TypeScript + Vite web application with client-side state management (Context API), localStorage persistence, Recharts visualizations, and optional OCR integration. The implementation follows a layered architecture: Routing → State Management → Business Logic → Data Access → UI Components.

**Key Technologies**: React 18, TypeScript, Vite, React Router v6, Recharts, CSS Modules, fast-check (property testing), Vitest + React Testing Library

**Project Structure**: Atomic design pattern (atoms → molecules → organisms → pages) with separate directories for contexts, hooks, lib (calculators, validators, utils, storage), data, and types.

## Tasks

- [ ] 1. Project initialization and configuration
  - Initialize Vite + React + TypeScript project with `npm create vite@latest ustats -- --template react-ts`
  - Install core dependencies: react-router-dom, recharts
  - Install dev dependencies: vitest, @testing-library/react, @testing-library/jest-dom, fast-check, jest-axe, @types/node
  - Configure TypeScript (tsconfig.json) with strict mode and path aliases
  - Configure Vitest (vitest.config.ts) with React Testing Library setup
  - Create project folder structure (components/atoms, components/molecules, components/organisms, components/charts, pages, contexts, hooks, lib, data, types, styles)
  - Set up CSS reset and global styles with CSS custom properties for design tokens
  - Configure ESLint and Prettier for code quality
  - _Requirements: Non-functional (Technology Stack, Build Tool)_

- [ ] 2. Define TypeScript types and interfaces
  - Create `types/user.ts` with UserProfile interface
  - Create `types/grades.ts` with Semester, Subject interfaces
  - Create `types/curriculum.ts` with CurriculumProgress, CompletedSubject, CurriculumSubject interfaces
  - Create `types/calculator.ts` with CalculatorState, GradingComponent, Assessment interfaces
  - Create `types/index.ts` as central export for all types
  - _Requirements: 5.1 (Data Persistence), Design: Data Models section_

- [ ] 3. Implement localStorage adapter and data persistence layer
  - [ ] 3.1 Create `lib/storage/storageAdapter.ts` with localStorage wrapper functions
    - Implement getItem, setItem, removeItem with error handling
    - Add fallback to sessionStorage if localStorage unavailable
    - Include schema version field in all stored data
    - _Requirements: 5.1, 5.2, 5.3_
  
  - [ ]* 3.2 Write property test for localStorage round-trip preservation
    - **Property 1: localStorage Round-Trip Preservation**
    - **Validates: Requirements 1.3, 2.6, 5.1**
    - Test that serializing, storing, retrieving, and deserializing produces equivalent data
    - Use fast-check generators for UserProfile, Semester, CurriculumProgress, CalculatorState
  
  - [ ] 3.3 Create `lib/storage/exportImport.ts` for JSON export/import
    - Implement exportData function (serialize all localStorage data to JSON)
    - Implement importData function with schema validation
    - Add data integrity checks before import
    - _Requirements: 5.4, 5.5, 5.7_
  
  - [ ]* 3.4 Write unit tests for export/import functions
    - Test successful export with valid data
    - Test import with valid JSON
    - Test import rejection with corrupted data
    - _Requirements: 5.7, 5.8_

- [ ] 4. Implement business logic calculators and validators
  - [ ] 4.1 Create `lib/calculators/gpaCalculator.ts`
    - Implement calculateSemesterGPA function (weighted average formula)
    - Handle edge cases: empty subjects array, zero credit units
    - Round result to 2 decimal places
    - _Requirements: 2.8_
  
  - [ ]* 4.2 Write property test for semester GPA calculation
    - **Property 3: Semester GPA Calculation**
    - **Validates: Requirements 2.8**
    - Test that GPA equals Σ(grade × creditUnits) / Σ(creditUnits) for all valid inputs
    - Use fast-check to generate random subject arrays
  
  - [ ] 4.3 Create `lib/calculators/gwaCalculator.ts`
    - Implement calculateGWA function with NSTP exclusion logic
    - Filter out subjects with codes containing "NSTP"
    - Apply weighted average formula to non-NSTP subjects
    - _Requirements: 3.6, 9.3_
  
  - [ ]* 4.4 Write property test for GWA calculation with NSTP exclusion
    - **Property 5: GWA Calculation with NSTP Exclusion**
    - **Validates: Requirements 3.6, 9.3**
    - Test that NSTP subjects are excluded from both numerator and denominator
    - Generate test data with mixed NSTP and non-NSTP subjects
  
  - [ ] 4.5 Create `lib/calculators/projectionEngine.ts`
    - Implement calculateProjectedGWA function
    - Combine completed subjects (actual grades) with remaining subjects (assumed grade)
    - Exclude NSTP subjects from projection
    - _Requirements: 3.10_
  
  - [ ]* 4.6 Write property test for GWA projection calculation
    - **Property 6: GWA Projection Calculation**
    - **Validates: Requirements 3.10**
    - Test that projected GWA correctly combines actual and assumed grades
  
  - [ ] 4.7 Create `lib/calculators/feasibilityAnalyzer.ts`
    - Implement calculateRequiredGrade function (solve for required grade given target)
    - Implement classifyFeasibility function (achievable/challenging/not-achievable)
    - _Requirements: 4.10, 4.11_
  
  - [ ]* 4.8 Write property tests for required grade calculation and feasibility
    - **Property 9: Required Grade Calculation**
    - **Validates: Requirements 4.10**
    - **Property 10: Feasibility Classification**
    - **Validates: Requirements 4.11**
  
  - [ ] 4.9 Create `lib/validators/gradeValidator.ts`
    - Implement validateGrade function (0-100 range check)
    - Implement validateCreditUnits function (positive number check)
    - Implement validateComponentWeights function (sum to 100% check)
    - _Requirements: 2.5, 4.6_
  
  - [ ]* 4.10 Write property tests for validation functions
    - **Property 2: Grade Value Validation**
    - **Validates: Requirements 2.5**
    - **Property 8: Component Weight Sum Validation**
    - **Validates: Requirements 4.6**
  
  - [ ] 4.11 Create `lib/utils/colorCoder.ts`
    - Implement getGradeColor function (map grade to color: Green 80-100, Yellow 70-79, Orange 60-69, Red <60)
    - _Requirements: 2.12_
  
  - [ ]* 4.12 Write property test for grade color mapping
    - **Property 4: Grade Color Mapping**
    - **Validates: Requirements 2.12**
    - Test that all grades map to exactly one color with correct boundary handling

- [ ] 5. Checkpoint - Ensure all business logic tests pass
  - Run all property tests and unit tests for calculators and validators
  - Verify test coverage for business logic layer is 100%
  - Ask the user if questions arise

- [ ] 6. Implement React Context providers for state management
  - [ ] 6.1 Create `contexts/UserContext.tsx`
    - Define UserState interface and UserAction type
    - Implement userReducer with actions: SET_USER_NAME, SET_COLLEGE_PROGRAM, LOAD_USER, CLEAR_USER
    - Create UserProvider component with useReducer and localStorage persistence
    - Export useUser custom hook for consuming context
    - _Requirements: 1.3, 1.4, 1.6_
  
  - [ ] 6.2 Create `contexts/GradesContext.tsx`
    - Define GradesState interface and GradesAction type
    - Implement gradesReducer with actions: ADD_SEMESTER, UPDATE_SEMESTER, DELETE_SEMESTER, ADD_SUBJECT, UPDATE_SUBJECT, DELETE_SUBJECT, RECALCULATE_GPA
    - Create GradesProvider with localStorage persistence
    - Export useGrades custom hook
    - _Requirements: 2.6, 2.7, 2.8, 2.9_
  
  - [ ] 6.3 Create `contexts/CurriculumContext.tsx`
    - Define CurriculumState interface and CurriculumAction type
    - Implement curriculumReducer with actions: LOAD_CURRICULUM, MARK_COMPLETE, UPDATE_GRADE, SET_ASSUMED_GRADE, RECALCULATE_GWA, RECALCULATE_PROJECTION
    - Create CurriculumProvider with localStorage persistence
    - Export useCurriculum custom hook
    - _Requirements: 3.5, 3.6, 3.10, 3.11_
  
  - [ ] 6.4 Create `contexts/CalculatorContext.tsx`
    - Define CalculatorState interface and CalculatorAction type
    - Implement calculatorReducer with actions: CREATE_CALCULATOR, UPDATE_CALCULATOR, DELETE_CALCULATOR, SET_ACTIVE, ADD_COMPONENT, UPDATE_COMPONENT, DELETE_COMPONENT, SET_ASSESSMENT_GRADE, SET_TARGET_GRADE, CALCULATE_REQUIRED
    - Create CalculatorProvider with localStorage persistence
    - Export useCalculator custom hook
    - _Requirements: 4.2, 4.4, 4.5, 4.9, 4.10, 4.13_
  
  - [ ] 6.5 Create `contexts/UIContext.tsx`
    - Define UIState interface and UIAction type
    - Implement uiReducer with actions: SHOW_TOAST, HIDE_TOAST, SHOW_MODAL, HIDE_MODAL, SET_LOADING, SET_THEME
    - Create UIProvider component
    - Export useUI custom hook
    - _Requirements: 8.1, 8.2_

- [ ] 7. Create reusable custom hooks
  - [ ] 7.1 Create `hooks/useLocalStorage.ts`
    - Implement generic useLocalStorage hook with type parameter
    - Handle localStorage read/write with error handling
    - Include fallback to sessionStorage
    - _Requirements: 5.1, 5.2_
  
  - [ ] 7.2 Create `hooks/useDebounce.ts`
    - Implement useDebounce hook for debouncing state updates (300ms delay)
    - Use for localStorage writes to avoid excessive I/O
    - _Requirements: 11.7_
  
  - [ ] 7.3 Create `hooks/useMediaQuery.ts`
    - Implement useMediaQuery hook for responsive breakpoints
    - Support breakpoints: 768px (tablet), 1024px (desktop)
    - _Requirements: 10.1, 10.2_

- [ ] 8. Implement atomic design components (atoms)
  - [ ] 8.1 Create `components/atoms/Button/Button.tsx`
    - Implement Button component with variants: primary (gold), secondary (outline)
    - Add CSS Module styling with hover/active states
    - Ensure minimum 44px touch target height
    - _Requirements: 6.1, 6.2, 10.4_
  
  - [ ]* 8.2 Write unit tests for Button component
    - Test rendering with different variants
    - Test click handler invocation
    - Test accessibility (ARIA labels, keyboard navigation)
  
  - [ ] 8.3 Create `components/atoms/Input/Input.tsx`
    - Implement Input component with label, error state, and validation
    - Add CSS Module styling with focus states
    - Include error message display
    - _Requirements: 2.4, 8.1, 8.2_
  
  - [ ]* 8.4 Write unit tests for Input component
    - Test value changes and onChange handler
    - Test error state display
    - Test accessibility (label association, ARIA attributes)
  
  - [ ] 8.5 Create `components/atoms/Card/Card.tsx`
    - Implement Card component with optional grain texture variant
    - Add CSS Module styling with hover elevation
    - _Requirements: 6.3_
  
  - [ ] 8.6 Create `components/atoms/Toast/Toast.tsx`
    - Implement Toast component with success/error variants
    - Add slide-up animation and auto-dismiss after 5 seconds
    - Include ARIA live region for screen readers
    - _Requirements: 8.1, 10.7_

- [ ] 9. Implement molecular components
  - [ ] 9.1 Create `components/molecules/GradeInput/GradeInput.tsx`
    - Combine Input atoms for subject name, grade, and credit units
    - Add inline validation with error display
    - _Requirements: 2.4, 2.5_
  
  - [ ] 9.2 Create `components/molecules/SubjectRow/SubjectRow.tsx`
    - Display subject code, name, units, grade input, and completion checkbox
    - Apply color-coding to grade display
    - Show prerequisite warning if prerequisites not met
    - _Requirements: 3.5, 9.2, 9.5_
  
  - [ ] 9.3 Create `components/molecules/StatCard/StatCard.tsx`
    - Display a statistic with label, value, and optional icon
    - Use Card atom as base with custom styling
    - _Requirements: 6.4_

- [ ] 10. Implement chart components
  - [ ] 10.1 Create `components/charts/GPATrendChart/GPATrendChart.tsx`
    - Implement line chart using Recharts with semester GPA data
    - Configure responsive behavior (600×300px desktop, 100% width mobile)
    - Add ARIA labels and keyboard navigation
    - _Requirements: 2.10, 7.2_
  
  - [ ] 10.2 Create `components/charts/SubjectComparisonChart/SubjectComparisonChart.tsx`
    - Implement bar chart using Recharts with subject grades
    - Apply color-coding to bars (Green/Yellow/Orange/Red)
    - Configure responsive behavior (horizontal bars on mobile)
    - _Requirements: 2.11, 7.3_
  
  - [ ] 10.3 Create `components/charts/GradeDistributionChart/GradeDistributionChart.tsx`
    - Implement pie chart using Recharts with grade range distribution
    - Add custom labels showing percentages
    - _Requirements: 7.4_
  
  - [ ] 10.4 Create `components/charts/HonorsGauge/HonorsGauge.tsx`
    - Implement custom SVG gauge showing current GWA relative to honors tiers
    - Display tier segments (Cum Laude 3.0, Magna 3.25, Summa 3.5)
    - Add current GWA indicator with gold circle
    - _Requirements: 3.8, 3.9, 3.12_
  
  - [ ] 10.5 Create `components/charts/GradeBreakdownChart/GradeBreakdownChart.tsx`
    - Implement stacked horizontal bar chart using Recharts
    - Show current grade contribution vs. remaining assessment contribution
    - _Requirements: 4.12, 7.7_

- [ ] 11. Implement organism components
  - [ ] 11.1 Create `components/organisms/Navigation/Navigation.tsx`
    - Implement sidebar navigation for desktop (280px width, fixed position)
    - Implement bottom navigation for mobile (64px height, fixed bottom)
    - Use useMediaQuery hook to switch between layouts
    - Highlight active route with gold background
    - _Requirements: 6.5, 10.1, 10.2_
  
  - [ ] 11.2 Create `components/organisms/GradeTable/GradeTable.tsx`
    - Display semester grades in sortable table (Subject, Grade, Units, Grade Points columns)
    - Add sorting by column (click header to sort)
    - Apply color-coding to grade cells
    - Show risk alerts for grades below 70
    - _Requirements: 2.7, 2.12, 2.13_
  
  - [ ] 11.3 Create `components/organisms/CurriculumList/CurriculumList.tsx`
    - Display curriculum as accordion organized by year and semester
    - Use SubjectRow molecules for each subject
    - Show completion progress bar at top
    - Disable subjects with unmet prerequisites
    - _Requirements: 3.4, 3.5, 9.2, 9.5_
  
  - [ ] 11.4 Create `components/organisms/ProjectionPanel/ProjectionPanel.tsx`
    - Display current GWA and projected GWA prominently
    - Add slider for assumed grade (1.0-4.0 range)
    - Show minimum grade needed for each honors tier
    - Display gap to next tier with visual indicator
    - _Requirements: 3.10, 3.11, 3.13_

- [ ] 12. Checkpoint - Ensure component tests pass
  - Run all unit tests for atoms, molecules, and organisms
  - Verify accessibility with jest-axe (no violations)
  - Ask the user if questions arise

- [ ] 13. Implement page components
  - [x] 13.1 Create `pages/WelcomePage/WelcomePage.tsx`
    - Display full-screen centered card with UST logo
    - Show heading "Welcome to USTats" (Playfair Display, 48px)
    - Include name input field and "Continue" button
    - Store name in UserContext and redirect to /dashboard on submit
    - _Requirements: 1.1, 1.2, 1.3, 1.5, 1.7, 1.8_
  
  - [ ]* 13.2 Write integration test for WelcomePage
    - Test name submission and localStorage persistence
    - Test redirect to dashboard after submission
    - Test accessibility (WCAG AA compliance)
  
  - [x] 13.3 Create `pages/DashboardPage/DashboardPage.tsx`
    - Display personalized greeting with user's name
    - Show quick stats cards (Current GWA, Semesters Completed, Honor Tier)
    - Display feature cards in 2×2 grid (Grades, Honors, Calculator, Settings)
    - _Requirements: 1.5, 6.4, 6.5_
  
  - [x] 13.4 Create `pages/GradesPage/GradesPage.tsx`
    - Display semester selector dropdown
    - Show grade upload form with tabs (Image Upload | Manual Entry)
    - Display GradeTable organism with current semester grades
    - Show GPA card with large semester GPA display
    - Display charts section with GPATrendChart, SubjectComparisonChart, GradeDistributionChart
    - _Requirements: 2.1, 2.2, 2.7, 2.8, 2.10, 2.11, 2.15_
  
  - [x] 13.5 Create `pages/HonorsPage/HonorsPage.tsx`
    - Display college and program selector dropdowns
    - Show CurriculumList organism with all subjects
    - Display GWA card with current GWA
    - Show HonorsGauge chart with tier indicator
    - Display ProjectionPanel organism
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.7, 3.8, 3.14, 3.16_
  
  - [x] 13.6 Create `pages/CalculatorPage/CalculatorPage.tsx`
    - Display subject selector dropdown for saved calculators
    - Show grading system form with dynamic component weight inputs
    - Display assessment input form for completed assessments
    - Show target grade input field
    - Display required grade with large number and feasibility indicator
    - Show GradeBreakdownChart
    - _Requirements: 4.1, 4.5, 4.6, 4.8, 4.9, 4.10, 4.11, 4.12, 4.15_
  
  - [x] 13.7 Create `pages/SettingsPage/SettingsPage.tsx`
    - Display profile settings (name change input)
    - Show data management section with Export, Import, Clear Data buttons
    - Add confirmation modal for Clear Data action
    - _Requirements: 1.6, 5.4, 5.5, 5.6_

- [ ] 14. Implement routing and app shell
  - [x] 14.1 Create `App.tsx` with React Router configuration
    - Wrap app in all Context providers (User, Grades, Curriculum, Calculator, UI)
    - Configure routes: / (Welcome), /dashboard, /grades, /honors, /calculator, /settings
    - Add route guard: redirect to / if no user name stored
    - Wrap routes in Suspense with loading spinner fallback
    - _Requirements: 1.4, 6.5_
  
  - [x] 14.2 Implement lazy loading for page components
    - Use React.lazy() for GradesPage, HonorsPage, CalculatorPage, SettingsPage
    - Keep WelcomePage and DashboardPage eagerly loaded
    - _Requirements: 11.1, 11.4_
  
  - [ ]* 14.3 Write integration test for routing
    - Test navigation between pages
    - Test route guard (redirect to welcome if no user)
    - Test lazy loading behavior

- [ ] 15. Add curriculum data
  - [x] 15.1 Create `data/curricula/compsci.json`
    - Include all UST Computer Science subjects from COMPSCI_UST.md
    - Structure by year and semester with subject code, name, lecture units, lab units, prerequisites, notes
    - Mark NSTP subjects with excludeFromGWA flag
    - _Requirements: 9.1, 9.2, 9.3_
  
  - [x] 15.2 Create `data/colleges.json`
    - Include all UST colleges from UST_COLLEGES.md
    - Structure as array of college names
    - _Requirements: 3.1, 9.6_
  
  - [x] 15.3 Create `data/curricula/index.ts`
    - Export curriculum loader function that returns curriculum by college and program
    - Support Computer Science as primary program
    - _Requirements: 9.6, 9.7_

- [ ] 16. Implement grade upload functionality
  - [ ] 16.1 Create `components/organisms/GradeUploadForm/GradeUploadForm.tsx`
    - Implement tabbed interface (Image Upload | Manual Entry)
    - For manual entry: dynamic table with add/remove rows
    - Validate grade range (0-100) and credit units (> 0)
    - Calculate semester GPA before submission
    - Dispatch ADD_SUBJECT actions to GradesContext
    - _Requirements: 2.1, 2.2, 2.4, 2.5, 2.6, 2.8_
  
  - [ ]* 16.2 Write integration test for grade upload workflow
    - Test manual grade entry and submission
    - Test GPA calculation after submission
    - Test localStorage persistence
    - _Requirements: 2.6, 2.8_

- [ ] 17. Implement optional OCR enhancement
  - [x] 17.1 Create `hooks/useOCR.ts`
    - Implement useOCR hook with Tesseract.js integration
    - Run OCR in Web Worker to avoid blocking UI
    - Parse OCR text into grade data structure
    - Return isProcessing, result, error states
    - _Requirements: 2.2, 2.3, 4.2, 4.3_
  
  - [-] 17.2 Integrate OCR into GradeUploadForm and CalculatorPage
    - Add image upload input with file validation
    - Show loading spinner during OCR processing
    - Display extracted data in editable form for manual correction
    - Show warning banner: "OCR extraction may be incomplete. Please verify all data."
    - _Requirements: 2.2, 2.3, 4.2, 4.3, 8.3_

- [ ] 18. Implement error handling and validation
  - [ ] 18.1 Add inline validation to all form inputs
    - Display error messages below problematic fields
    - Apply red border highlight to invalid inputs
    - Disable submit button until all errors resolved
    - _Requirements: 8.1, 8.2_
  
  - [ ] 18.2 Add localStorage error handling with fallback
    - Wrap all localStorage operations in try-catch
    - Fallback to sessionStorage if localStorage unavailable
    - Show toast notification: "Data persistence failed. Changes may be lost."
    - _Requirements: 5.2, 8.4_
  
  - [ ] 18.3 Add data import validation
    - Validate JSON format and schema before import
    - Show specific error messages for validation failures
    - Preserve existing data if import fails (no partial imports)
    - _Requirements: 5.7, 5.8, 8.5_

- [ ] 19. Implement responsive design and accessibility
  - [ ] 19.1 Add responsive breakpoints to all components
    - Mobile: 375px min-width, single-column layouts, bottom navigation
    - Tablet: 768px min-width, 2-column layouts, sidebar navigation
    - Desktop: 1024px min-width, 3-column chart grids, full sidebar
    - _Requirements: 10.1, 10.2, 10.3_
  
  - [ ] 19.2 Ensure all interactive elements meet accessibility standards
    - Minimum 44px touch targets on mobile
    - Keyboard navigation with visible focus indicators
    - ARIA labels for icon-only buttons
    - Alt text for all images and charts
    - Color contrast ratio ≥ 4.5:1 for normal text
    - _Requirements: 10.4, 10.5, 10.6, 10.7, 10.8, 10.9, 10.10_
  
  - [ ]* 19.3 Run accessibility audit with jest-axe
    - Test all pages for WCAG AA compliance
    - Fix any violations found
    - _Requirements: 10.6, 10.7, 10.8_

- [ ] 20. Implement performance optimizations
  - [ ] 20.1 Add code splitting and lazy loading
    - Lazy load page components (already done in task 14.2)
    - Lazy load Tesseract.js for OCR (only when image upload used)
    - _Requirements: 11.4, 11.5_
  
  - [ ] 20.2 Add memoization for expensive calculations
    - Memoize GPA, GWA, and projection calculations with useMemo
    - Memoize chart components with React.memo
    - _Requirements: 11.3_
  
  - [ ] 20.3 Add debouncing for localStorage writes
    - Use useDebounce hook for all localStorage writes (300ms delay)
    - _Requirements: 11.7_
  
  - [ ] 20.4 Optimize bundle size
    - Configure Vite for production build with minification
    - Verify bundle size < 500KB gzipped
    - _Requirements: 11.5_

- [ ] 21. Add motivational messaging and tone
  - [x] 21.1 Create `lib/utils/messageGenerator.ts`
    - Implement getMotivationalMessage function based on GWA
    - Strong GWA (≥3.5): "Excellent progress! Keep up the outstanding work."
    - At-risk GWA (<2.0): "You've got this! Let's focus on improvement strategies."
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_
  
  - [ ] 21.2 Integrate motivational messages into Dashboard and HonorsPage
    - Display personalized message below greeting
    - Update message when GWA changes
    - _Requirements: 12.1, 12.2, 12.3_

- [ ] 22. Final integration and testing
  - [ ]* 22.1 Write end-to-end integration tests
    - Test complete user workflow: Welcome → Dashboard → Grade Upload → View Charts
    - Test curriculum workflow: Select College → Enter Grades → View GWA → Projection
    - Test calculator workflow: Setup Components → Enter Assessments → View Required Grade
    - _Requirements: All requirements_
  
  - [ ]* 22.2 Run full test suite
    - Run all property tests (fast-check)
    - Run all unit tests (Vitest + RTL)
    - Run all integration tests
    - Run accessibility tests (jest-axe)
    - Verify overall code coverage ≥ 85%
  
  - [ ] 22.3 Manual testing and polish
    - Test on Chrome, Firefox, Safari (desktop and mobile)
    - Verify responsive behavior at all breakpoints
    - Test offline functionality (after initial load)
    - Verify performance targets: FCP < 1.5s, TTI < 3.0s
    - _Requirements: 11.1, 11.2_

- [ ] 23. Final checkpoint - Ensure all tests pass and app is production-ready
  - Verify all features work as specified in requirements
  - Confirm all property tests pass (12 properties)
  - Confirm accessibility compliance (WCAG AA)
  - Confirm performance targets met
  - Ask the user if questions arise

## Notes

- Tasks marked with `*` are optional testing tasks and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The implementation uses TypeScript throughout for type safety
- All localStorage keys use "ustats:" prefix (e.g., "ustats:user", "ustats:semesters")
- OCR integration (tasks 17.1-17.2) is optional and can be deferred to post-MVP
- The application name is **USTats** (not "UST GradeTracker") throughout all UI text
