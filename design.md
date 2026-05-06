# USTats Design Document

## Overview

USTats is a client-side React web application that transforms the text-heavy UST student portal experience into an intuitive visual dashboard. The application provides four interconnected features: personalized welcome, semester grade tracking with analytics, Latin honor projection, and subject-level grade calculation. All data persists locally in browser localStorage, ensuring privacy and offline capability.

### Design Philosophy

The design embraces a **refined academic aesthetic** that balances professionalism with warmth. Drawing from UST's heritage and the user's academic journey, the interface uses:

- **Visual Language**: Elegant cards with subtle grain texture, dark navy/gold accents, generous whitespace
- **Color Psychology**: UST Gold (#F5A800) for achievement and highlights, Black (#1C1C1C) for sophistication, with color-coded performance indicators (Green/Yellow/Orange/Red)
- **Typography**: Playfair Display (serif) for headings conveys academic gravitas; DM Sans (sans-serif) for body text ensures readability
- **Tone**: Warm and encouraging, always addressing the student by name, celebrating progress while providing actionable guidance

### Key Design Decisions

1. **Client-Side Architecture**: No backend eliminates deployment complexity, ensures data privacy, and enables offline use after initial load
2. **React + Recharts**: React provides component reusability and state management; Recharts offers declarative, responsive charts with minimal configuration
3. **localStorage Schema**: Normalized data structure with separate stores for user profile, semesters, curriculum progress, and calculator states
4. **Mobile-First Responsive**: Breakpoints at 375px (mobile), 768px (tablet), 1024px (desktop) ensure usability across devices
5. **OCR as Enhancement**: Manual entry is primary; OCR (via Tesseract.js) is optional convenience with manual correction fallback



## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser Environment                      │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                  React Application                     │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐ │  │
│  │  │   Routing   │  │ State Mgmt   │  │  UI Layer    │ │  │
│  │  │ (React      │  │ (Context +   │  │ (Components) │ │  │
│  │  │  Router)    │  │  useReducer) │  │              │ │  │
│  │  └──────┬──────┘  └──────┬───────┘  └──────┬───────┘ │  │
│  │         │                 │                  │         │  │
│  │         └─────────────────┼──────────────────┘         │  │
│  │                           │                            │  │
│  │  ┌────────────────────────┴─────────────────────────┐ │  │
│  │  │           Business Logic Layer                    │ │  │
│  │  │  • GPA/GWA Calculators                           │ │  │
│  │  │  • Grade Validators                              │ │  │
│  │  │  • Projection Algorithms                         │ │  │
│  │  │  • Feasibility Analyzers                         │ │  │
│  │  └────────────────────┬─────────────────────────────┘ │  │
│  │                       │                                │  │
│  │  ┌────────────────────┴─────────────────────────────┐ │  │
│  │  │           Data Access Layer                       │ │  │
│  │  │  • localStorage Adapter                          │ │  │
│  │  │  • Data Serialization/Deserialization            │ │  │
│  │  │  • Import/Export Handlers                        │ │  │
│  │  └────────────────────┬─────────────────────────────┘ │  │
│  └───────────────────────┼───────────────────────────────┘  │
│                          │                                   │
│  ┌───────────────────────┴───────────────────────────────┐  │
│  │              Browser localStorage                      │  │
│  │  • userProfile                                        │  │
│  │  • semesters                                          │  │
│  │  │  curriculumProgress                                │  │
│  │  • calculatorStates                                   │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         Optional: Tesseract.js (OCR Worker)           │  │
│  │         Runs in Web Worker for non-blocking OCR       │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Architecture Layers

#### 1. Routing Layer
- **Technology**: React Router v6
- **Responsibility**: URL-based navigation, route guards (redirect to welcome if no name stored)
- **Routes**:
  - `/` - Welcome page (first-time) or redirect to `/dashboard`
  - `/dashboard` - Main dashboard with navigation to other features
  - `/grades` - Semester grade upload and visualization
  - `/honors` - Latin honor tracker with curriculum progress
  - `/calculator` - Subject grade calculator
  - `/settings` - User settings (name change, data export/import/clear)

#### 2. State Management Layer
- **Technology**: React Context API + useReducer
- **Rationale**: Sufficient for this application's complexity; avoids Redux overhead
- **Contexts**:
  - `UserContext`: User profile (name, selected college/program)
  - `GradesContext`: All semester data and GPA calculations
  - `CurriculumContext`: Curriculum progress, completed subjects, GWA
  - `CalculatorContext`: Saved calculator states for multiple subjects
  - `UIContext`: Theme preferences, toast notifications, loading states

#### 3. Business Logic Layer
- **Pure Functions**: All calculation logic is pure (deterministic, no side effects)
- **Modules**:
  - `gpaCalculator.js`: Semester GPA calculation (weighted average)
  - `gwaCalculator.js`: Cumulative GWA calculation (excludes NSTP)
  - `gradeValidator.js`: Input validation (0-100 range, required fields)
  - `projectionEngine.js`: Latin honor projection based on remaining subjects
  - `feasibilityAnalyzer.js`: Target grade achievability assessment
  - `colorCoder.js`: Grade-to-color mapping (Green/Yellow/Orange/Red)

#### 4. Data Access Layer
- **localStorage Adapter**: Abstraction over browser localStorage
- **Schema Version**: Includes version field for future migration support
- **Operations**: CRUD operations with error handling and fallback to sessionStorage
- **Export/Import**: JSON serialization with integrity validation

#### 5. UI Component Layer
- **Component Structure**: Atomic design pattern (Atoms → Molecules → Organisms → Pages)
- **Styling**: CSS Modules for scoped styles, CSS custom properties for theming
- **Responsiveness**: Mobile-first with breakpoints at 375px, 768px, 1024px



## Components and Interfaces

### Component Hierarchy

```
App
├── Router
│   ├── WelcomePage
│   │   └── WelcomeForm
│   ├── DashboardPage
│   │   ├── Navigation (Sidebar/BottomNav)
│   │   ├── UserGreeting
│   │   ├── QuickStats
│   │   └── FeatureCards
│   ├── GradesPage
│   │   ├── SemesterSelector
│   │   ├── GradeUploadForm
│   │   │   ├── ImageUpload (with OCR)
│   │   │   └── ManualEntryTable
│   │   ├── GradeTable (sortable, filterable)
│   │   ├── GPACard
│   │   └── ChartsSection
│   │       ├── GPATrendChart (Line)
│   │       ├── SubjectComparisonChart (Bar)
│   │       └── GradeDistributionChart (Pie)
│   ├── HonorsPage
│   │   ├── CollegeProgramSelector
│   │   ├── CurriculumList
│   │   │   └── SubjectRow (with grade input)
│   │   ├── GWACard
│   │   ├── HonorsTierIndicator
│   │   ├── ProjectionPanel
│   │   │   └── AssumedGradeSlider
│   │   └── ProgressBar
│   ├── CalculatorPage
│   │   ├── SubjectSelector
│   │   ├── GradingSystemForm
│   │   │   ├── ImageUpload (OCR for syllabus)
│   │   │   └── ComponentWeightInputs
│   │   ├── AssessmentInputForm
│   │   ├── TargetGradeInput
│   │   ├── RequiredGradeDisplay
│   │   ├── FeasibilityIndicator
│   │   └── GradeBreakdownChart (Stacked Bar)
│   └── SettingsPage
│       ├── ProfileSettings
│       ├── DataManagement
│       │   ├── ExportButton
│       │   ├── ImportButton
│       │   └── ClearDataButton
│       └── AboutSection
└── GlobalComponents
    ├── Toast (notifications)
    ├── Modal (confirmations)
    └── LoadingSpinner
```

### Key Component Specifications

#### WelcomeForm
**Purpose**: First-time user onboarding with name capture
**Props**: `onSubmit: (name: string) => void`
**State**: `name: string`, `error: string | null`
**Behavior**:
- Validates non-empty name (trim whitespace)
- Stores name in localStorage via UserContext
- Redirects to `/dashboard` on success
**Styling**: Full-screen centered card, UST logo, gold accent button

#### GradeUploadForm
**Purpose**: Dual-mode grade entry (image OCR or manual table)
**Props**: `semesterId: string`, `onSubmit: (grades: Grade[]) => void`
**State**: `mode: 'image' | 'manual'`, `ocrResult: Grade[] | null`, `manualGrades: Grade[]`
**Behavior**:
- Image mode: Tesseract.js OCR in Web Worker, displays extracted data for correction
- Manual mode: Dynamic table with add/remove rows
- Validates grade range (0-100) and credit units (> 0)
- Calculates semester GPA before submission
**Styling**: Tabbed interface, responsive table, inline validation errors

#### CurriculumList
**Purpose**: Display curriculum with grade entry and completion tracking
**Props**: `curriculum: Subject[]`, `completedSubjects: Map<string, number>`
**State**: `expandedYears: Set<number>`, `editingSubject: string | null`
**Behavior**:
- Accordion by year/semester
- Inline grade input with validation
- Prerequisite checking (disable if prerequisites not met)
- Excludes NSTP from GWA calculation (visual indicator)
- Real-time GWA update on grade entry
**Styling**: Nested list with indentation, color-coded completion status

#### ProjectionPanel
**Purpose**: Interactive GWA projection with assumed grade slider
**Props**: `currentGWA: number`, `completedUnits: number`, `remainingSubjects: Subject[]`
**State**: `assumedGrade: number` (default: current GWA)
**Behavior**:
- Slider range: 1.0 - 4.0 (UST scale)
- Real-time projection calculation
- Displays minimum grade needed for each honor tier
- Shows gap to next tier with visual indicator
**Styling**: Card with large projected GWA number, slider with tier markers

#### RequiredGradeDisplay
**Purpose**: Show required grade on remaining assessments with feasibility
**Props**: `currentGrade: number`, `targetGrade: number`, `remainingWeight: number`
**State**: None (pure presentation)
**Behavior**:
- Calculates: `required = (target - current * completedWeight) / remainingWeight`
- Feasibility: Achievable (≤100), Challenging (90-100), Not Achievable (>100)
- Color-coded: Green, Yellow, Red
**Styling**: Large number display, icon + text feasibility label

### Component Communication Patterns

#### Context-Based State Sharing
- Global state (user, grades, curriculum) accessed via `useContext` hooks
- Avoids prop drilling for deeply nested components
- Context providers wrap entire app in `App.jsx`

#### Event-Driven Updates
- Form submissions dispatch actions to context reducers
- Reducers update state and trigger localStorage persistence
- UI components re-render automatically via React's reactivity

#### Optimistic UI Updates
- Grade entry shows immediate feedback (GPA recalculation)
- localStorage write happens asynchronously
- Error handling reverts optimistic update if write fails



## Data Models

### localStorage Schema

#### 1. User Profile
```typescript
interface UserProfile {
  version: string;           // Schema version (e.g., "1.0.0")
  name: string;              // Student's name
  college: string | null;    // Selected college (e.g., "College of Information and Computing Sciences")
  program: string | null;    // Selected program (e.g., "Computer Science")
  createdAt: string;         // ISO 8601 timestamp
  updatedAt: string;         // ISO 8601 timestamp
}

// localStorage key: "ustats:user"
```

#### 2. Semesters
```typescript
interface Semester {
  id: string;                // UUID
  academicYear: string;      // e.g., "2023-2024"
  term: "1st Term" | "2nd Term";
  subjects: Subject[];
  gpa: number;               // Calculated weighted average
  createdAt: string;
  updatedAt: string;
}

interface Subject {
  id: string;                // UUID
  code: string;              // e.g., "ICS2603"
  name: string;              // e.g., "DISCRETE STRUCTURES"
  grade: number;             // 0-100 or converted to 4.0 scale
  creditUnits: number;       // Lecture + Lab units
  gradePoints: number;       // grade * creditUnits
}

// localStorage key: "ustats:semesters"
// Value: Semester[]
```

#### 3. Curriculum Progress
```typescript
interface CurriculumProgress {
  college: string;
  program: string;
  completedSubjects: Map<string, CompletedSubject>; // Key: subject code
  currentGWA: number;
  totalUnitsCompleted: number;
  totalUnitsRequired: number;
  updatedAt: string;
}

interface CompletedSubject {
  code: string;
  name: string;
  grade: number;             // 1.0 - 4.0 scale
  creditUnits: number;
  semester: string;          // When completed (e.g., "1st Year, 1st Term")
  excludeFromGWA: boolean;   // true for NSTP
}

// localStorage key: "ustats:curriculum"
```

#### 4. Calculator States
```typescript
interface CalculatorState {
  id: string;                // UUID
  subjectName: string;
  components: GradingComponent[];
  assessments: Assessment[];
  targetGrade: number | null;
  requiredGrade: number | null;
  feasibility: "achievable" | "challenging" | "not-achievable" | null;
  createdAt: string;
  updatedAt: string;
}

interface GradingComponent {
  id: string;
  name: string;              // e.g., "Midterm Exam"
  weight: number;            // Percentage (0-100)
}

interface Assessment {
  componentId: string;
  grade: number | null;      // null if not yet taken
  maxGrade: number;          // Usually 100
}

// localStorage key: "ustats:calculators"
// Value: CalculatorState[]
```

#### 5. App Settings
```typescript
interface AppSettings {
  theme: "light" | "dark";
  lastVisitedPage: string;   // Route path for restoration
  onboardingCompleted: boolean;
  version: string;
}

// localStorage key: "ustats:settings"
```

### Data Relationships

```
UserProfile (1)
    ↓
    ├─→ CurriculumProgress (1) ─→ CompletedSubjects (N)
    │
    └─→ Semesters (N) ─→ Subjects (N)

CalculatorStates (N) [Independent, no foreign keys]
```

### Data Validation Rules

#### Grade Validation
- **Range**: 0-100 (input) or 1.0-4.0 (GWA scale)
- **Conversion**: UST uses 1.0 (highest) to 4.0 (passing), 5.0 (failing)
  - 95-100 → 1.0
  - 90-94 → 1.25
  - 85-89 → 1.5
  - 80-84 → 1.75
  - 75-79 → 2.0
  - 70-74 → 2.25
  - 65-69 → 2.5
  - 60-64 → 2.75
  - 55-59 → 3.0
  - Below 55 → 5.0 (Failing)

#### Credit Units Validation
- **Range**: 0-6 (typical range for UST subjects)
- **Type**: Positive integer or decimal (for lab units)

#### Component Weight Validation
- **Sum Constraint**: All component weights must sum to exactly 100%
- **Individual Range**: Each component 0-100%

#### GWA Calculation Rules
- **Inclusion**: All subjects except NSTP (NSTP 1, NSTP 2)
- **Formula**: `GWA = Σ(grade × creditUnits) / Σ(creditUnits)`
- **Rounding**: Round to 2 decimal places

### Data Migration Strategy

#### Version Field
- Each data structure includes a `version` field
- Current version: "1.0.0"
- Future versions: Increment and provide migration functions

#### Migration Function Pattern
```typescript
function migrateUserProfile(data: any): UserProfile {
  if (data.version === "1.0.0") return data;
  
  // Example: v1.0.0 → v1.1.0
  if (!data.version || data.version < "1.1.0") {
    return {
      ...data,
      version: "1.1.0",
      newField: defaultValue,
    };
  }
  
  return data;
}
```



## State Management

### Context Architecture

#### UserContext
**Purpose**: Manage user profile and authentication state
**State**:
```typescript
{
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}
```
**Actions**:
- `SET_USER_NAME`: Update user name
- `SET_COLLEGE_PROGRAM`: Update selected college/program
- `LOAD_USER`: Load from localStorage
- `CLEAR_USER`: Clear user data (logout)

#### GradesContext
**Purpose**: Manage semester grades and GPA calculations
**State**:
```typescript
{
  semesters: Semester[];
  selectedSemesterId: string | null;
  isLoading: boolean;
  error: string | null;
}
```
**Actions**:
- `ADD_SEMESTER`: Create new semester
- `UPDATE_SEMESTER`: Modify semester data
- `DELETE_SEMESTER`: Remove semester
- `ADD_SUBJECT`: Add subject to semester
- `UPDATE_SUBJECT`: Modify subject grade
- `DELETE_SUBJECT`: Remove subject
- `SELECT_SEMESTER`: Set active semester
- `RECALCULATE_GPA`: Trigger GPA recalculation

#### CurriculumContext
**Purpose**: Manage curriculum progress and GWA
**State**:
```typescript
{
  progress: CurriculumProgress | null;
  curriculum: Subject[];
  projectedGWA: number | null;
  assumedGrade: number;
  isLoading: boolean;
  error: string | null;
}
```
**Actions**:
- `LOAD_CURRICULUM`: Load curriculum for selected program
- `MARK_COMPLETE`: Mark subject as completed with grade
- `UPDATE_GRADE`: Update completed subject grade
- `SET_ASSUMED_GRADE`: Update projection assumption
- `RECALCULATE_GWA`: Trigger GWA recalculation
- `RECALCULATE_PROJECTION`: Update projected GWA

#### CalculatorContext
**Purpose**: Manage subject grade calculator states
**State**:
```typescript
{
  calculators: CalculatorState[];
  activeCalculatorId: string | null;
  isLoading: boolean;
  error: string | null;
}
```
**Actions**:
- `CREATE_CALCULATOR`: New calculator for subject
- `UPDATE_CALCULATOR`: Modify calculator data
- `DELETE_CALCULATOR`: Remove calculator
- `SET_ACTIVE`: Select active calculator
- `ADD_COMPONENT`: Add grading component
- `UPDATE_COMPONENT`: Modify component weight
- `DELETE_COMPONENT`: Remove component
- `SET_ASSESSMENT_GRADE`: Enter assessment grade
- `SET_TARGET_GRADE`: Set target grade
- `CALCULATE_REQUIRED`: Calculate required grade

#### UIContext
**Purpose**: Manage UI state (toasts, modals, loading)
**State**:
```typescript
{
  toasts: Toast[];
  modal: Modal | null;
  isGlobalLoading: boolean;
  theme: "light" | "dark";
}
```
**Actions**:
- `SHOW_TOAST`: Display notification
- `HIDE_TOAST`: Dismiss notification
- `SHOW_MODAL`: Display modal dialog
- `HIDE_MODAL`: Close modal
- `SET_LOADING`: Toggle global loading state
- `SET_THEME`: Switch theme

### State Persistence Strategy

#### Automatic Persistence
- All context state changes trigger localStorage writes
- Debounced writes (300ms) to avoid excessive I/O
- Error handling with fallback to sessionStorage

#### Persistence Middleware
```typescript
function persistMiddleware(key: string) {
  return (state: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(`Failed to persist ${key}:`, error);
      // Fallback to sessionStorage
      try {
        sessionStorage.setItem(key, JSON.stringify(state));
      } catch (fallbackError) {
        // Show user notification
        showToast("Data persistence failed. Changes may be lost.", "error");
      }
    }
  };
}
```

#### State Hydration on Load
- App initialization loads all contexts from localStorage
- Migration functions applied if version mismatch detected
- Corrupted data triggers error state with recovery options



## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

The USTats application contains significant business logic in the form of pure calculation functions. While UI rendering, localStorage operations, and chart visualizations are not suitable for property-based testing, the core calculation algorithms are ideal candidates. The following properties define the correctness guarantees for these pure functions.

### Property 1: localStorage Round-Trip Preservation

*For any* valid data structure (user profile, semester data, curriculum progress, or calculator state), serializing to JSON, storing in localStorage, retrieving, and deserializing SHALL produce an equivalent data structure with all fields preserved.

**Validates: Requirements 1.3, 2.6, 5.1**

**Rationale**: This property ensures data integrity across browser sessions. Since all application data persists in localStorage, round-trip preservation is critical for reliability.

### Property 2: Grade Value Validation

*For any* numeric input value, the grade validator SHALL correctly classify it as valid (within 0-100 range) or invalid (outside range or non-numeric), and SHALL reject invalid values before they enter the system.

**Validates: Requirements 2.5**

**Rationale**: Input validation is the first line of defense against data corruption. This property ensures only valid grades are stored and calculated.

### Property 3: Semester GPA Calculation

*For any* non-empty set of subjects with valid grades (0-100) and positive credit units, the calculated semester GPA SHALL equal the weighted average: `GPA = Σ(grade × creditUnits) / Σ(creditUnits)`, rounded to 2 decimal places.

**Validates: Requirements 2.8**

**Rationale**: GPA calculation is a core feature. This property verifies the weighted average formula is correctly implemented for all possible subject combinations.

### Property 4: Grade Color Mapping

*For any* valid grade value (0-100), the color mapping function SHALL return exactly one color according to the ranges: Green (80-100), Yellow (70-79), Orange (60-69), Red (below 60), with boundary values correctly assigned.

**Validates: Requirements 2.12**

**Rationale**: Consistent color-coding is essential for visual feedback. This property ensures grade ranges are correctly mapped without gaps or overlaps.

### Property 5: GWA Calculation with NSTP Exclusion

*For any* set of completed subjects including NSTP subjects (NSTP 1, NSTP 2), the calculated GWA SHALL exclude NSTP subjects from both numerator and denominator, and SHALL equal `GWA = Σ(grade × creditUnits for non-NSTP) / Σ(creditUnits for non-NSTP)`, rounded to 2 decimal places.

**Validates: Requirements 3.6, 9.3**

**Rationale**: UST Latin honors policy explicitly excludes NSTP from GWA. This property ensures the exclusion rule is correctly applied in all scenarios.

### Property 6: GWA Projection Calculation

*For any* curriculum state with completed subjects (with grades) and remaining subjects (with assumed grade), the projected GWA SHALL equal the weighted average of all subjects: `Projected GWA = (Σ(completed grade × units) + Σ(assumed grade × remaining units)) / total units`, excluding NSTP subjects.

**Validates: Requirements 3.10**

**Rationale**: Projection helps students plan their academic path. This property ensures the projection formula correctly combines actual and assumed grades.

### Property 7: Minimum Required Grade Calculation

*For any* current GWA, completed units, remaining units, and target GWA tier, the calculated minimum average grade SHALL satisfy: if all remaining subjects achieve this grade, the final GWA will equal or exceed the target tier threshold.

**Validates: Requirements 3.13**

**Rationale**: This reverse calculation helps students understand what performance is needed. The property verifies the algebraic solution is correct.

### Property 8: Component Weight Sum Validation

*For any* set of grading components with weight values, the validation function SHALL return true if and only if the sum of all weights equals exactly 100% (within floating-point tolerance of 0.01%).

**Validates: Requirements 4.6**

**Rationale**: Grading systems must sum to 100% for meaningful calculations. This property ensures the constraint is enforced.

### Property 9: Required Grade Calculation

*For any* grading system with completed assessments (grades and weights) and remaining assessments (weights only), and a target grade, the calculated required grade SHALL satisfy: `target = (Σ(completed grade × weight) + required × Σ(remaining weight)) / 100`.

**Validates: Requirements 4.10**

**Rationale**: This calculation is the core of the subject grade calculator. The property verifies the algebraic solution for the required grade.

### Property 10: Feasibility Classification

*For any* calculated required grade value, the feasibility classifier SHALL return exactly one category: "achievable" if required ≤ 100, "challenging" if 90 < required ≤ 100, "not-achievable" if required > 100, with boundary values correctly assigned.

**Validates: Requirements 4.11**

**Rationale**: Feasibility feedback guides student expectations. This property ensures the classification logic has no gaps or overlaps.

### Property 11: Data Schema Validation

*For any* JSON data structure, the schema validator SHALL correctly identify whether it conforms to the expected schema (UserProfile, Semester, CurriculumProgress, or CalculatorState) by checking required fields, types, and constraints.

**Validates: Requirements 5.7**

**Rationale**: Import functionality must reject malformed data to prevent corruption. This property ensures schema validation is comprehensive.

### Property 12: Prerequisite Validation

*For any* subject with prerequisites and a set of completed subjects, the prerequisite validator SHALL return true if and only if all prerequisite subjects appear in the completed set with passing grades (< 5.0 on UST scale).

**Validates: Requirements 9.5**

**Rationale**: Prerequisite enforcement prevents invalid curriculum progression. This property ensures the validation logic correctly checks all dependencies.



## Error Handling

### Error Categories

#### 1. User Input Errors
**Examples**: Invalid grade values, empty required fields, component weights not summing to 100%
**Handling**:
- Inline validation with immediate feedback
- Error messages displayed below the problematic field
- Red border highlight on invalid inputs
- Submit button disabled until all errors resolved
- Clear, actionable error messages (e.g., "Grade must be between 0 and 100" not "Invalid input")

#### 2. localStorage Errors
**Examples**: Storage quota exceeded, localStorage disabled, corrupted data
**Handling**:
- Try-catch wrapper around all localStorage operations
- Fallback to sessionStorage if localStorage unavailable
- User notification via toast: "Data persistence failed. Changes may be lost on page refresh."
- Offer data export as backup option
- Graceful degradation: app remains functional with session-only storage

#### 3. OCR Errors
**Examples**: Image upload fails, OCR extraction produces no results, extracted data is malformed
**Handling**:
- Display extracted data for manual correction (never auto-submit OCR results)
- Show warning banner: "OCR extraction may be incomplete. Please verify all data."
- Provide clear "Edit" affordance for each extracted field
- Fallback to manual entry if OCR completely fails
- Loading spinner during OCR processing (can take 2-5 seconds)

#### 4. Data Import Errors
**Examples**: Invalid JSON format, schema mismatch, version incompatibility
**Handling**:
- Validate imported data before applying to state
- Show specific error message: "Import failed: Invalid data format. Expected version 1.0.0, found 0.9.0."
- Preserve existing data (no partial imports)
- Offer to download error log for debugging
- Provide link to documentation on correct format

#### 5. Calculation Errors
**Examples**: Division by zero, NaN results, floating-point precision issues
**Handling**:
- Defensive checks in all calculation functions
- Return null or default value (0) for invalid inputs
- Log error to console for debugging
- Display fallback UI: "Unable to calculate. Please check your data."
- Prevent error propagation to UI (no white screen of death)

### Error Recovery Strategies

#### Undo/Redo for Data Entry
- Maintain history stack (last 10 actions)
- Undo button in UI for recent changes
- Keyboard shortcuts: Ctrl+Z (undo), Ctrl+Shift+Z (redo)

#### Auto-Save with Conflict Resolution
- Debounced auto-save every 300ms after user input
- Detect concurrent edits (multiple tabs)
- Show conflict resolution dialog: "Data was modified in another tab. Keep current or reload?"

#### Data Export as Safety Net
- Prominent "Export Data" button in settings
- Automatic export prompt before "Clear All Data"
- Export includes timestamp and version for recovery

### Error Logging

#### Client-Side Logging
- Console logging for development (verbose)
- Structured error objects: `{ type, message, context, timestamp }`
- No external error tracking (privacy requirement)

#### User-Facing Error Messages
- Avoid technical jargon
- Provide actionable next steps
- Use warm, supportive tone: "Oops! Something went wrong. Let's try that again."



## Testing Strategy

### Testing Approach

The USTats testing strategy employs a **dual approach**: property-based testing for pure calculation logic and example-based testing for UI components, integration points, and user workflows.

### 1. Property-Based Testing (Business Logic)

**Library**: fast-check (JavaScript/TypeScript property-based testing library)
**Scope**: All pure calculation functions in the business logic layer
**Configuration**: Minimum 100 iterations per property test

#### Test Structure
Each property test must include:
- **Tag comment** referencing the design property: `// Feature: ust-grade-tracker, Property 1: localStorage Round-Trip Preservation`
- **Generator** for random test inputs
- **Property assertion** that must hold for all generated inputs
- **Shrinking** to find minimal failing case if property fails

#### Property Test Examples

**Property 3: Semester GPA Calculation**
```typescript
// Feature: ust-grade-tracker, Property 3: Semester GPA Calculation
test('GPA calculation follows weighted average formula', () => {
  fc.assert(
    fc.property(
      fc.array(
        fc.record({
          grade: fc.integer({ min: 0, max: 100 }),
          creditUnits: fc.integer({ min: 1, max: 6 }),
        }),
        { minLength: 1, maxLength: 15 }
      ),
      (subjects) => {
        const calculatedGPA = calculateSemesterGPA(subjects);
        const expectedGPA = 
          subjects.reduce((sum, s) => sum + s.grade * s.creditUnits, 0) /
          subjects.reduce((sum, s) => sum + s.creditUnits, 0);
        
        expect(calculatedGPA).toBeCloseTo(expectedGPA, 2);
      }
    ),
    { numRuns: 100 }
  );
});
```

**Property 5: GWA Calculation with NSTP Exclusion**
```typescript
// Feature: ust-grade-tracker, Property 5: GWA Calculation with NSTP Exclusion
test('GWA excludes NSTP subjects from calculation', () => {
  fc.assert(
    fc.property(
      fc.array(
        fc.record({
          code: fc.oneof(
            fc.constant('NSTP 1'),
            fc.constant('NSTP 2'),
            fc.string({ minLength: 5, maxLength: 10 })
          ),
          grade: fc.float({ min: 1.0, max: 4.0 }),
          creditUnits: fc.integer({ min: 1, max: 6 }),
        }),
        { minLength: 3, maxLength: 20 }
      ),
      (subjects) => {
        const calculatedGWA = calculateGWA(subjects);
        const nonNSTP = subjects.filter(s => !s.code.includes('NSTP'));
        const expectedGWA = 
          nonNSTP.reduce((sum, s) => sum + s.grade * s.creditUnits, 0) /
          nonNSTP.reduce((sum, s) => sum + s.creditUnits, 0);
        
        expect(calculatedGWA).toBeCloseTo(expectedGWA, 2);
      }
    ),
    { numRuns: 100 }
  );
});
```

#### Property Test Coverage
- `gpaCalculator.test.js`: Properties 3, 5, 6, 7
- `gradeValidator.test.js`: Properties 2, 8, 11
- `projectionEngine.test.js`: Properties 6, 7
- `feasibilityAnalyzer.test.js`: Properties 9, 10
- `colorCoder.test.js`: Property 4
- `prerequisiteValidator.test.js`: Property 12
- `storageAdapter.test.js`: Property 1

### 2. Example-Based Unit Testing (UI Components)

**Library**: Vitest + React Testing Library
**Scope**: React components, hooks, UI interactions

#### Test Categories

**Component Rendering**
- Verify components render without crashing
- Check for presence of key elements (buttons, inputs, labels)
- Validate initial state display
- Example: WelcomeForm renders with name input and submit button

**User Interactions**
- Simulate user events (click, type, submit)
- Verify state updates correctly
- Check for expected UI changes
- Example: Typing in name input updates component state

**Conditional Rendering**
- Test different UI states (loading, error, success, empty)
- Verify correct component shown based on state
- Example: GradeTable shows empty state when no grades exist

**Accessibility**
- Verify ARIA labels and roles
- Check keyboard navigation
- Test screen reader compatibility
- Example: All form inputs have associated labels

#### Example Unit Test
```typescript
describe('WelcomeForm', () => {
  it('displays error for empty name submission', () => {
    render(<WelcomeForm onSubmit={jest.fn()} />);
    
    const submitButton = screen.getByRole('button', { name: /continue/i });
    fireEvent.click(submitButton);
    
    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
  });
  
  it('calls onSubmit with trimmed name', () => {
    const mockSubmit = jest.fn();
    render(<WelcomeForm onSubmit={mockSubmit} />);
    
    const input = screen.getByLabelText(/enter your name/i);
    fireEvent.change(input, { target: { value: '  Juan Dela Cruz  ' } });
    
    const submitButton = screen.getByRole('button', { name: /continue/i });
    fireEvent.click(submitButton);
    
    expect(mockSubmit).toHaveBeenCalledWith('Juan Dela Cruz');
  });
});
```

### 3. Integration Testing

**Library**: Vitest + Testing Library
**Scope**: Multi-component workflows, localStorage integration, context interactions

#### Integration Test Scenarios

**Complete User Workflows**
- Welcome → Dashboard → Grade Upload → View Charts
- Curriculum Selection → Grade Entry → GWA Calculation → Projection
- Calculator Setup → Assessment Entry → Required Grade Display

**localStorage Integration**
- Data persistence across component unmount/remount
- Data retrieval on app initialization
- Export/import round-trip

**Context Integration**
- State updates propagate to all consuming components
- Actions trigger correct reducer updates
- Side effects (localStorage writes) execute correctly

#### Example Integration Test
```typescript
describe('Grade Upload Workflow', () => {
  it('completes full grade entry and displays GPA', async () => {
    render(<App />);
    
    // Navigate to grades page
    fireEvent.click(screen.getByRole('link', { name: /grades/i }));
    
    // Add semester
    fireEvent.click(screen.getByRole('button', { name: /add semester/i }));
    fireEvent.change(screen.getByLabelText(/academic year/i), {
      target: { value: '2023-2024' }
    });
    
    // Add subject
    fireEvent.click(screen.getByRole('button', { name: /add subject/i }));
    fireEvent.change(screen.getByLabelText(/subject name/i), {
      target: { value: 'Discrete Structures' }
    });
    fireEvent.change(screen.getByLabelText(/grade/i), {
      target: { value: '85' }
    });
    fireEvent.change(screen.getByLabelText(/credit units/i), {
      target: { value: '3' }
    });
    
    // Submit
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    
    // Verify GPA displayed
    await waitFor(() => {
      expect(screen.getByText(/semester gpa/i)).toBeInTheDocument();
      expect(screen.getByText(/85/)).toBeInTheDocument();
    });
    
    // Verify localStorage
    const stored = JSON.parse(localStorage.getItem('ustats:semesters'));
    expect(stored).toHaveLength(1);
    expect(stored[0].subjects).toHaveLength(1);
  });
});
```

### 4. Visual Regression Testing (Optional)

**Library**: Playwright + Percy (or similar)
**Scope**: Critical UI pages to catch unintended visual changes

#### Snapshot Scenarios
- Welcome page (light and dark theme)
- Dashboard with data
- Grade table with multiple semesters
- Charts (line, bar, pie)
- Calculator with feasibility indicators

### 5. Accessibility Testing

**Library**: axe-core + jest-axe
**Scope**: All pages and major components

#### Accessibility Checks
- Color contrast ratios (WCAG AA: 4.5:1 for normal text)
- Keyboard navigation (tab order, focus indicators)
- ARIA labels and roles
- Form labels and error associations
- Heading hierarchy (h1 → h6 sequential)

#### Example Accessibility Test
```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('WelcomePage Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<WelcomePage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### 6. Performance Testing

**Library**: Lighthouse CI (automated), Chrome DevTools (manual)
**Scope**: Page load times, bundle size, runtime performance

#### Performance Targets
- **First Contentful Paint (FCP)**: < 1.5s
- **Time to Interactive (TTI)**: < 3.0s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Bundle Size**: < 500KB (gzipped)
- **Chart Rendering**: < 500ms for 100 data points

### Test Coverage Goals

- **Business Logic (Pure Functions)**: 100% coverage via property-based tests
- **UI Components**: 80% coverage via example-based tests
- **Integration Workflows**: 70% coverage of critical paths
- **Overall Code Coverage**: 85% minimum

### Continuous Integration

**CI Pipeline** (GitHub Actions or similar):
1. Lint (ESLint + Prettier)
2. Type Check (TypeScript)
3. Unit Tests (Vitest)
4. Property Tests (fast-check)
5. Integration Tests
6. Accessibility Tests (axe)
7. Build (Vite)
8. Lighthouse CI (performance)

**Pre-commit Hooks** (Husky):
- Lint staged files
- Run tests for changed files
- Type check



## UI/UX Design Specifications

### Design System

#### Color Palette

**Primary Colors** (UST Brand)
```css
--ust-gold: #F5A800;
--ust-black: #1C1C1C;
--ust-white: #FFFFFF;
--ust-dark-accent: #2C1810;
```

**Semantic Colors** (Performance Indicators)
```css
--grade-excellent: #10B981;  /* Green - 80-100 */
--grade-good: #F59E0B;       /* Yellow - 70-79 */
--grade-concern: #F97316;    /* Orange - 60-69 */
--grade-risk: #EF4444;       /* Red - below 60 */
```

**Neutral Palette**
```css
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-200: #E5E7EB;
--gray-300: #D1D5DB;
--gray-400: #9CA3AF;
--gray-500: #6B7280;
--gray-600: #4B5563;
--gray-700: #374151;
--gray-800: #1F2937;
--gray-900: #111827;
```

**Background & Surface**
```css
--bg-primary: #FAFAF9;       /* Light warm gray */
--bg-secondary: #F5F5F4;
--surface-card: #FFFFFF;
--surface-elevated: #FFFFFF;
--overlay: rgba(0, 0, 0, 0.5);
```

#### Typography

**Font Families**
```css
--font-heading: 'Playfair Display', serif;
--font-body: 'DM Sans', sans-serif;
--font-mono: 'JetBrains Mono', monospace; /* For grades/numbers */
```

**Type Scale**
```css
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */
```

**Font Weights**
```css
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

**Line Heights**
```css
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

#### Spacing Scale

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
```

#### Border Radius

```css
--radius-sm: 0.25rem;   /* 4px */
--radius-md: 0.5rem;    /* 8px */
--radius-lg: 0.75rem;   /* 12px */
--radius-xl: 1rem;      /* 16px */
--radius-2xl: 1.5rem;   /* 24px */
--radius-full: 9999px;
```

#### Shadows

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
--shadow-gold: 0 4px 12px rgba(245, 168, 0, 0.2); /* UST gold glow */
```

#### Transitions

```css
--transition-fast: 150ms ease-out;
--transition-base: 200ms ease-out;
--transition-slow: 300ms ease-out;
```

### Component Specifications

#### Button

**Primary Button** (Gold CTA)
```css
.btn-primary {
  background: var(--ust-gold);
  color: var(--ust-black);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-lg);
  font-weight: var(--font-semibold);
  font-size: var(--text-base);
  transition: all var(--transition-base);
  box-shadow: var(--shadow-md);
}

.btn-primary:hover {
  background: #E09A00; /* Darker gold */
  box-shadow: var(--shadow-gold);
  transform: translateY(-1px);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}
```

**Secondary Button** (Outline)
```css
.btn-secondary {
  background: transparent;
  color: var(--ust-black);
  border: 2px solid var(--gray-300);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-lg);
  font-weight: var(--font-medium);
  transition: all var(--transition-base);
}

.btn-secondary:hover {
  border-color: var(--ust-gold);
  color: var(--ust-gold);
}
```

**Touch Target**: Minimum 44px height for mobile accessibility

#### Card

**Base Card**
```css
.card {
  background: var(--surface-card);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--gray-200);
  transition: all var(--transition-base);
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
```

**Card with Grain Texture** (Academic aesthetic)
```css
.card-textured {
  background: var(--surface-card);
  background-image: url('data:image/svg+xml,...'); /* Subtle grain SVG */
  background-blend-mode: multiply;
  opacity: 0.03;
}
```

#### Input Field

**Text Input**
```css
.input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: 2px solid var(--gray-300);
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  font-family: var(--font-body);
  transition: all var(--transition-fast);
}

.input:focus {
  outline: none;
  border-color: var(--ust-gold);
  box-shadow: 0 0 0 3px rgba(245, 168, 0, 0.1);
}

.input.error {
  border-color: var(--grade-risk);
}

.input.error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}
```

**Label**
```css
.label {
  display: block;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--gray-700);
  margin-bottom: var(--space-2);
}
```

**Error Message**
```css
.error-message {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--grade-risk);
  font-size: var(--text-sm);
  margin-top: var(--space-2);
}
```

#### Navigation

**Sidebar Navigation** (Desktop)
```css
.sidebar {
  width: 280px;
  height: 100vh;
  background: var(--ust-black);
  color: var(--ust-white);
  padding: var(--space-6);
  position: fixed;
  left: 0;
  top: 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  color: var(--gray-300);
  transition: all var(--transition-fast);
  cursor: pointer;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--ust-white);
}

.nav-item.active {
  background: var(--ust-gold);
  color: var(--ust-black);
  font-weight: var(--font-semibold);
}
```

**Bottom Navigation** (Mobile)
```css
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: var(--ust-white);
  border-top: 1px solid var(--gray-200);
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: var(--space-2) var(--space-4);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.bottom-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  color: var(--gray-500);
  font-size: var(--text-xs);
  transition: all var(--transition-fast);
}

.bottom-nav-item.active {
  color: var(--ust-gold);
}
```

#### Toast Notification

```css
.toast {
  position: fixed;
  bottom: var(--space-6);
  right: var(--space-6);
  background: var(--ust-black);
  color: var(--ust-white);
  padding: var(--space-4) var(--space-6);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  display: flex;
  align-items: center;
  gap: var(--space-3);
  animation: slideInUp 300ms ease-out;
  max-width: 400px;
}

.toast.success {
  border-left: 4px solid var(--grade-excellent);
}

.toast.error {
  border-left: 4px solid var(--grade-risk);
}

@keyframes slideInUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
```

### Page Layouts

#### Welcome Page

**Layout**: Full-screen centered card
**Elements**:
- UST logo (top center)
- Heading: "Welcome to USTats" (Playfair Display, 48px)
- Subheading: "Track your academic journey with clarity and confidence" (DM Sans, 18px, gray-600)
- Name input field (centered, max-width 400px)
- Primary button: "Continue" (gold, full-width on mobile)
- Background: Subtle gradient (gray-50 to gray-100) with grain texture

**Responsive**:
- Mobile: Full-screen, padding 24px
- Tablet/Desktop: Centered card (max-width 600px), elevated shadow

#### Dashboard Page

**Layout**: Sidebar + Main Content (Desktop), Bottom Nav + Main Content (Mobile)
**Elements**:
- **Header**: Personalized greeting "Good morning, [Name]!" (Playfair Display, 36px)
- **Quick Stats**: 3-column grid (Current GWA, Semesters Completed, Honor Tier)
- **Feature Cards**: 4 cards in 2×2 grid (Grades, Honors, Calculator, Settings)
- **Recent Activity**: Timeline of recent grade entries

**Responsive**:
- Desktop: Sidebar (280px) + Main (calc(100% - 280px))
- Tablet: Sidebar (240px) + Main (calc(100% - 240px))
- Mobile: Bottom Nav (64px) + Main (calc(100vh - 64px))

#### Grades Page

**Layout**: Header + Semester Selector + Content Area
**Elements**:
- **Semester Selector**: Dropdown or tabs for semester selection
- **Upload Section**: Tabbed interface (Image Upload | Manual Entry)
- **Grade Table**: Sortable table with columns (Subject, Grade, Units, Grade Points)
- **GPA Card**: Large card with semester GPA (Playfair Display, 64px)
- **Charts Section**: 3 charts in responsive grid (Line, Bar, Pie)

**Responsive**:
- Desktop: 3-column chart grid
- Tablet: 2-column chart grid
- Mobile: Single-column stacked charts

#### Honors Page

**Layout**: Header + Selector + Curriculum + Projection
**Elements**:
- **College/Program Selector**: Dropdown with search
- **Curriculum List**: Accordion by year/semester
- **GWA Card**: Current GWA with large number display
- **Honors Tier Indicator**: Visual gauge with 3 tiers (Cum Laude, Magna, Summa)
- **Projection Panel**: Slider + Projected GWA + Gap to next tier
- **Progress Bar**: Completion percentage (units completed / total units)

**Responsive**:
- Desktop: 2-column layout (Curriculum left, Projection right)
- Tablet: 2-column layout (narrower)
- Mobile: Single-column stacked

#### Calculator Page

**Layout**: Header + Subject Selector + Form + Results
**Elements**:
- **Subject Selector**: Dropdown to load saved calculators
- **Grading System Form**: Component weights input (dynamic rows)
- **Assessment Input**: Current grades for completed assessments
- **Target Grade Input**: Desired final grade
- **Required Grade Display**: Large number with feasibility indicator
- **Breakdown Chart**: Stacked bar showing current vs. remaining contribution

**Responsive**:
- Desktop: 2-column layout (Form left, Results right)
- Tablet: 2-column layout (narrower)
- Mobile: Single-column stacked

### Responsive Breakpoints

```css
/* Mobile First */
@media (min-width: 768px) {
  /* Tablet */
}

@media (min-width: 1024px) {
  /* Desktop */
}

@media (min-width: 1440px) {
  /* Large Desktop */
}
```

### Animation Specifications

#### Page Transitions
- **Duration**: 300ms
- **Easing**: ease-out
- **Effect**: Fade + slide (20px)

#### Micro-interactions
- **Button Hover**: Scale 1.02, shadow increase (150ms)
- **Card Hover**: Translate Y -2px, shadow increase (200ms)
- **Input Focus**: Border color change + shadow (150ms)
- **Toast Enter**: Slide up + fade in (300ms)
- **Toast Exit**: Fade out (200ms)

#### Chart Animations
- **Initial Load**: Stagger reveal (100ms delay per element)
- **Data Update**: Smooth transition (400ms)
- **Hover**: Highlight + tooltip (150ms)

### Accessibility Specifications

#### Color Contrast
- **Normal Text**: Minimum 4.5:1 (WCAG AA)
- **Large Text** (18px+): Minimum 3:1
- **UI Components**: Minimum 3:1

#### Keyboard Navigation
- **Tab Order**: Logical flow (top to bottom, left to right)
- **Focus Indicators**: 2px solid outline (gold) with 2px offset
- **Skip Links**: "Skip to main content" at top of page

#### Screen Reader Support
- **ARIA Labels**: All icon-only buttons
- **ARIA Roles**: Semantic HTML + ARIA where needed
- **Alt Text**: Descriptive text for all images and charts
- **Live Regions**: Toast notifications use aria-live="polite"

#### Touch Targets
- **Minimum Size**: 44×44px (Apple HIG)
- **Spacing**: 8px minimum between targets
- **Feedback**: Visual feedback within 100ms of tap



## Chart and Visualization Specifications

### Chart Library Selection

**Chosen Library**: Recharts
**Rationale**:
- Declarative React components (better DX than Chart.js)
- Built-in responsive behavior
- Composable API (easy to customize)
- TypeScript support
- Smaller bundle size for our use case (~50KB vs Chart.js ~200KB)
- Active maintenance and community

### Chart Specifications

#### 1. GPA Trend Chart (Line Chart)

**Purpose**: Show GPA progression across semesters
**Data**: Array of `{ semester: string, gpa: number }`
**Configuration**:
```typescript
<LineChart width={600} height={300} data={semesterData}>
  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
  <XAxis 
    dataKey="semester" 
    tick={{ fill: '#6B7280', fontSize: 14 }}
    axisLine={{ stroke: '#D1D5DB' }}
  />
  <YAxis 
    domain={[0, 100]}
    tick={{ fill: '#6B7280', fontSize: 14 }}
    axisLine={{ stroke: '#D1D5DB' }}
    label={{ value: 'GPA', angle: -90, position: 'insideLeft' }}
  />
  <Tooltip 
    contentStyle={{ 
      background: '#FFFFFF', 
      border: '1px solid #E5E7EB',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}
  />
  <Legend 
    wrapperStyle={{ paddingTop: '20px' }}
    iconType="line"
  />
  <Line 
    type="monotone" 
    dataKey="gpa" 
    stroke="#F5A800" 
    strokeWidth={3}
    dot={{ fill: '#F5A800', r: 5 }}
    activeDot={{ r: 7 }}
  />
</LineChart>
```

**Responsive Behavior**:
- Desktop: 600×300px
- Tablet: 100% width, 300px height
- Mobile: 100% width, 250px height, rotated X-axis labels

**Accessibility**:
- ARIA label: "Line chart showing GPA trend across semesters"
- Keyboard navigation: Tab to focus, arrow keys to navigate data points
- Screen reader: Announce data on focus

#### 2. Subject Comparison Chart (Bar Chart)

**Purpose**: Compare grades across subjects within a semester
**Data**: Array of `{ subject: string, grade: number, color: string }`
**Configuration**:
```typescript
<BarChart width={600} height={400} data={subjectData}>
  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
  <XAxis 
    dataKey="subject" 
    tick={{ fill: '#6B7280', fontSize: 12 }}
    angle={-45}
    textAnchor="end"
    height={100}
  />
  <YAxis 
    domain={[0, 100]}
    tick={{ fill: '#6B7280', fontSize: 14 }}
    label={{ value: 'Grade', angle: -90, position: 'insideLeft' }}
  />
  <Tooltip />
  <Bar dataKey="grade" radius={[8, 8, 0, 0]}>
    {subjectData.map((entry, index) => (
      <Cell key={`cell-${index}`} fill={entry.color} />
    ))}
  </Bar>
</BarChart>
```

**Color Mapping**:
- Green (#10B981): 80-100
- Yellow (#F59E0B): 70-79
- Orange (#F97316): 60-69
- Red (#EF4444): below 60

**Responsive Behavior**:
- Desktop: 600×400px
- Tablet: 100% width, 400px height
- Mobile: Horizontal bar chart (swap X/Y axes), 100% width, 300px height

#### 3. Grade Distribution Chart (Pie Chart)

**Purpose**: Show distribution of grade ranges across all semesters
**Data**: Array of `{ range: string, count: number, percentage: number }`
**Configuration**:
```typescript
<PieChart width={400} height={400}>
  <Pie
    data={distributionData}
    cx="50%"
    cy="50%"
    labelLine={false}
    label={renderCustomLabel}
    outerRadius={120}
    fill="#8884d8"
    dataKey="count"
  >
    {distributionData.map((entry, index) => (
      <Cell key={`cell-${index}`} fill={COLORS[entry.range]} />
    ))}
  </Pie>
  <Tooltip 
    formatter={(value, name, props) => [
      `${value} subjects (${props.payload.percentage}%)`,
      props.payload.range
    ]}
  />
  <Legend 
    verticalAlign="bottom" 
    height={36}
    formatter={(value, entry) => `${value}: ${entry.payload.count}`}
  />
</PieChart>
```

**Custom Label**:
```typescript
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      fontSize={14}
      fontWeight={600}
    >
      {`${percentage}%`}
    </text>
  );
};
```

**Responsive Behavior**:
- Desktop: 400×400px
- Tablet: 350×350px
- Mobile: 300×300px, legend below chart

#### 4. Honors Tier Gauge

**Purpose**: Visual indicator of current GWA relative to honors tiers
**Implementation**: Custom SVG component (not Recharts)
**Configuration**:
```typescript
<svg width="300" height="200" viewBox="0 0 300 200">
  {/* Background arc */}
  <path
    d="M 50 150 A 100 100 0 0 1 250 150"
    fill="none"
    stroke="#E5E7EB"
    strokeWidth="20"
  />
  
  {/* Tier segments */}
  <path
    d="M 50 150 A 100 100 0 0 1 130 80"
    fill="none"
    stroke="#EF4444"
    strokeWidth="20"
  />
  <path
    d="M 130 80 A 100 100 0 0 1 170 80"
    fill="none"
    stroke="#F59E0B"
    strokeWidth="20"
  />
  <path
    d="M 170 80 A 100 100 0 0 1 250 150"
    fill="none"
    stroke="#10B981"
    strokeWidth="20"
  />
  
  {/* Current GWA indicator */}
  <circle
    cx={calculateX(currentGWA)}
    cy={calculateY(currentGWA)}
    r="10"
    fill="#F5A800"
    stroke="#FFFFFF"
    strokeWidth="3"
  />
  
  {/* Tier labels */}
  <text x="50" y="170" fontSize="12" fill="#6B7280">3.0</text>
  <text x="130" y="60" fontSize="12" fill="#6B7280">3.25</text>
  <text x="170" y="60" fontSize="12" fill="#6B7280">3.5</text>
  <text x="240" y="170" fontSize="12" fill="#6B7280">4.0</text>
  
  {/* Center GWA display */}
  <text x="150" y="140" fontSize="36" fontWeight="700" fill="#1C1C1C" textAnchor="middle">
    {currentGWA.toFixed(2)}
  </text>
  <text x="150" y="160" fontSize="14" fill="#6B7280" textAnchor="middle">
    Current GWA
  </text>
</svg>
```

#### 5. Grade Breakdown Chart (Stacked Bar)

**Purpose**: Show current grade contribution vs. remaining assessment contribution
**Data**: `{ current: number, remaining: number }`
**Configuration**:
```typescript
<BarChart 
  width={400} 
  height={100} 
  data={[breakdownData]} 
  layout="vertical"
>
  <XAxis type="number" domain={[0, 100]} hide />
  <YAxis type="category" dataKey="name" hide />
  <Tooltip />
  <Bar dataKey="current" stackId="a" fill="#10B981" radius={[8, 0, 0, 8]}>
    <LabelList 
      dataKey="current" 
      position="center" 
      formatter={(value) => `${value}%`}
      fill="#FFFFFF"
      fontSize={14}
      fontWeight={600}
    />
  </Bar>
  <Bar dataKey="remaining" stackId="a" fill="#E5E7EB" radius={[0, 8, 8, 0]}>
    <LabelList 
      dataKey="remaining" 
      position="center" 
      formatter={(value) => `${value}%`}
      fill="#6B7280"
      fontSize={14}
      fontWeight={600}
    />
  </Bar>
</BarChart>
```

### Chart Interaction Patterns

#### Hover States
- **Tooltip**: Display on hover with exact values
- **Highlight**: Increase opacity/size of hovered element
- **Cursor**: Change to pointer on interactive elements

#### Click Interactions
- **Bar/Line Click**: Navigate to detailed view (e.g., click semester → view subjects)
- **Legend Click**: Toggle series visibility
- **Data Point Click**: Show detailed modal with full information

#### Touch Interactions (Mobile)
- **Tap**: Show tooltip (persist until tap outside)
- **Long Press**: Show detailed modal
- **Pinch Zoom**: Enable for large datasets (optional)

### Chart Loading States

**Skeleton Loader**:
```typescript
<div className="chart-skeleton">
  <div className="skeleton-bar" style={{ width: '80%', height: '200px' }} />
  <div className="skeleton-axis" style={{ width: '100%', height: '20px' }} />
</div>
```

**Animation**: Shimmer effect (gradient moving left to right)

### Chart Empty States

**No Data Message**:
```typescript
<div className="chart-empty">
  <Icon name="chart-line" size={48} color="#D1D5DB" />
  <p className="text-gray-600">No data to display yet</p>
  <p className="text-sm text-gray-500">Add grades to see your progress</p>
</div>
```

### Chart Accessibility

#### ARIA Attributes
```typescript
<div 
  role="img" 
  aria-label="Line chart showing GPA trend across 5 semesters"
  aria-describedby="chart-description"
>
  <LineChart {...props} />
  <div id="chart-description" className="sr-only">
    Your GPA has increased from 85 in Semester 1 to 92 in Semester 5.
  </div>
</div>
```

#### Keyboard Navigation
- **Tab**: Focus chart container
- **Arrow Keys**: Navigate between data points
- **Enter**: Activate data point (show details)
- **Escape**: Close tooltip/modal

#### Screen Reader Support
- Provide text summary of chart data
- Announce data point values on focus
- Offer data table alternative (toggle button)



## Technical Implementation Details

### Technology Stack

#### Core Framework
- **React 18**: Component-based UI with hooks
- **TypeScript**: Type safety and better DX
- **Vite**: Fast build tool and dev server
- **React Router v6**: Client-side routing

#### State Management
- **React Context API**: Global state management
- **useReducer**: Complex state logic
- **Custom Hooks**: Reusable stateful logic

#### Styling
- **CSS Modules**: Scoped component styles
- **CSS Custom Properties**: Theming and design tokens
- **PostCSS**: CSS processing (autoprefixer, nesting)

#### Data Visualization
- **Recharts**: React chart library
- **Custom SVG**: For specialized visualizations (gauge)

#### OCR (Optional Enhancement)
- **Tesseract.js**: Client-side OCR
- **Web Worker**: Non-blocking OCR processing

#### Testing
- **Vitest**: Unit and integration testing
- **React Testing Library**: Component testing
- **fast-check**: Property-based testing
- **jest-axe**: Accessibility testing

#### Build & Deployment
- **Vite**: Production build
- **GitHub Pages / Netlify / Vercel**: Static hosting
- **GitHub Actions**: CI/CD pipeline

### Project Structure

```
ustats/
├── public/
│   ├── favicon.ico
│   ├── logo.svg
│   └── manifest.json
├── src/
│   ├── assets/
│   │   ├── fonts/
│   │   │   ├── PlayfairDisplay-Regular.woff2
│   │   │   └── DMSans-Regular.woff2
│   │   └── images/
│   │       └── ust-logo.svg
│   ├── components/
│   │   ├── atoms/
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.module.css
│   │   │   │   └── Button.test.tsx
│   │   │   ├── Input/
│   │   │   ├── Card/
│   │   │   └── Toast/
│   │   ├── molecules/
│   │   │   ├── GradeInput/
│   │   │   ├── SubjectRow/
│   │   │   └── StatCard/
│   │   ├── organisms/
│   │   │   ├── Navigation/
│   │   │   ├── GradeTable/
│   │   │   ├── CurriculumList/
│   │   │   └── ProjectionPanel/
│   │   └── charts/
│   │       ├── GPATrendChart/
│   │       ├── SubjectComparisonChart/
│   │       ├── GradeDistributionChart/
│   │       └── HonorsGauge/
│   ├── contexts/
│   │   ├── UserContext.tsx
│   │   ├── GradesContext.tsx
│   │   ├── CurriculumContext.tsx
│   │   ├── CalculatorContext.tsx
│   │   └── UIContext.tsx
│   ├── hooks/
│   │   ├── useLocalStorage.ts
│   │   ├── useDebounce.ts
│   │   ├── useMediaQuery.ts
│   │   └── useOCR.ts
│   ├── lib/
│   │   ├── calculators/
│   │   │   ├── gpaCalculator.ts
│   │   │   ├── gpaCalculator.test.ts
│   │   │   ├── gwaCalculator.ts
│   │   │   ├── projectionEngine.ts
│   │   │   └── feasibilityAnalyzer.ts
│   │   ├── validators/
│   │   │   ├── gradeValidator.ts
│   │   │   ├── schemaValidator.ts
│   │   │   └── prerequisiteValidator.ts
│   │   ├── utils/
│   │   │   ├── colorCoder.ts
│   │   │   ├── dateFormatter.ts
│   │   │   └── gradeConverter.ts
│   │   └── storage/
│   │       ├── storageAdapter.ts
│   │       ├── migrations.ts
│   │       └── exportImport.ts
│   ├── data/
│   │   ├── curricula/
│   │   │   ├── compsci.json
│   │   │   └── index.ts
│   │   └── colleges.json
│   ├── pages/
│   │   ├── WelcomePage/
│   │   │   ├── WelcomePage.tsx
│   │   │   ├── WelcomePage.module.css
│   │   │   └── WelcomePage.test.tsx
│   │   ├── DashboardPage/
│   │   ├── GradesPage/
│   │   ├── HonorsPage/
│   │   ├── CalculatorPage/
│   │   └── SettingsPage/
│   ├── styles/
│   │   ├── global.css
│   │   ├── variables.css
│   │   └── reset.css
│   ├── types/
│   │   ├── index.ts
│   │   ├── user.ts
│   │   ├── grades.ts
│   │   ├── curriculum.ts
│   │   └── calculator.ts
│   ├── App.tsx
│   ├── App.test.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── .github/
│   └── workflows/
│       └── ci.yml
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
└── README.md
```

### Key Implementation Patterns

#### Custom Hook: useLocalStorage

```typescript
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
      // Fallback to sessionStorage
      try {
        window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (fallbackError) {
        // Show user notification
      }
    }
  };

  return [storedValue, setValue] as const;
}
```

#### Context Pattern: GradesContext

```typescript
interface GradesState {
  semesters: Semester[];
  selectedSemesterId: string | null;
  isLoading: boolean;
  error: string | null;
}

type GradesAction =
  | { type: 'ADD_SEMESTER'; payload: Semester }
  | { type: 'UPDATE_SEMESTER'; payload: { id: string; updates: Partial<Semester> } }
  | { type: 'DELETE_SEMESTER'; payload: string }
  | { type: 'ADD_SUBJECT'; payload: { semesterId: string; subject: Subject } }
  | { type: 'RECALCULATE_GPA'; payload: string };

function gradesReducer(state: GradesState, action: GradesAction): GradesState {
  switch (action.type) {
    case 'ADD_SEMESTER':
      return {
        ...state,
        semesters: [...state.semesters, action.payload],
      };
    case 'RECALCULATE_GPA': {
      const semester = state.semesters.find(s => s.id === action.payload);
      if (!semester) return state;
      
      const gpa = calculateSemesterGPA(semester.subjects);
      return {
        ...state,
        semesters: state.semesters.map(s =>
          s.id === action.payload ? { ...s, gpa } : s
        ),
      };
    }
    // ... other cases
    default:
      return state;
  }
}

export function GradesProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gradesReducer, initialState);
  const [, setStoredSemesters] = useLocalStorage('ustats:semesters', []);

  // Persist to localStorage on state change
  useEffect(() => {
    setStoredSemesters(state.semesters);
  }, [state.semesters]);

  return (
    <GradesContext.Provider value={{ state, dispatch }}>
      {children}
    </GradesContext.Provider>
  );
}
```

#### Calculation Function: GPA Calculator

```typescript
export function calculateSemesterGPA(subjects: Subject[]): number {
  if (subjects.length === 0) return 0;

  const totalGradePoints = subjects.reduce(
    (sum, subject) => sum + subject.grade * subject.creditUnits,
    0
  );
  const totalUnits = subjects.reduce(
    (sum, subject) => sum + subject.creditUnits,
    0
  );

  if (totalUnits === 0) return 0;

  return Math.round((totalGradePoints / totalUnits) * 100) / 100;
}
```

#### OCR Integration: useOCR Hook

```typescript
function useOCR() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<OCRResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const processImage = async (imageFile: File) => {
    setIsProcessing(true);
    setError(null);

    try {
      const worker = await createWorker();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      
      const { data } = await worker.recognize(imageFile);
      
      // Parse OCR text into grade data
      const grades = parseGradeText(data.text);
      
      setResult({ grades, confidence: data.confidence });
      await worker.terminate();
    } catch (err) {
      setError('OCR processing failed. Please enter grades manually.');
      console.error('OCR error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return { processImage, isProcessing, result, error };
}
```

### Performance Optimizations

#### Code Splitting
```typescript
// Lazy load pages
const GradesPage = lazy(() => import('./pages/GradesPage'));
const HonorsPage = lazy(() => import('./pages/HonorsPage'));
const CalculatorPage = lazy(() => import('./pages/CalculatorPage'));

// Wrap in Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/grades" element={<GradesPage />} />
    <Route path="/honors" element={<HonorsPage />} />
    <Route path="/calculator" element={<CalculatorPage />} />
  </Routes>
</Suspense>
```

#### Memoization
```typescript
// Memoize expensive calculations
const projectedGWA = useMemo(() => {
  return calculateProjectedGWA(completedSubjects, remainingSubjects, assumedGrade);
}, [completedSubjects, remainingSubjects, assumedGrade]);

// Memoize components
const GradeTable = memo(({ subjects }: { subjects: Subject[] }) => {
  // ... component implementation
});
```

#### Debouncing
```typescript
// Debounce localStorage writes
const debouncedSave = useMemo(
  () => debounce((data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  }, 300),
  [key]
);
```

#### Virtual Scrolling (for large lists)
```typescript
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={subjects.length}
  itemSize={60}
  width="100%"
>
  {({ index, style }) => (
    <SubjectRow subject={subjects[index]} style={style} />
  )}
</FixedSizeList>
```

### Security Considerations

#### Input Sanitization
```typescript
function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .slice(0, 100); // Limit length
}
```

#### localStorage Quota Handling
```typescript
function checkStorageQuota(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}
```

#### XSS Prevention
- Use React's built-in XSS protection (JSX escaping)
- Sanitize user input before rendering
- Avoid `dangerouslySetInnerHTML`

### Browser Compatibility

#### Polyfills
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    target: 'es2015',
    polyfillModulePreload: true,
  },
});
```

#### Feature Detection
```typescript
if (!('localStorage' in window)) {
  // Fallback to sessionStorage or in-memory storage
  console.warn('localStorage not available, using sessionStorage');
}
```

### Deployment Configuration

#### Vite Build Configuration
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  base: '/', // Adjust for subdirectory deployment
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'chart-vendor': ['recharts'],
        },
      },
    },
  },
});
```

#### Static Hosting (Netlify)
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### GitHub Pages
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Progressive Web App (PWA) Support

#### Service Worker
```typescript
// vite-plugin-pwa configuration
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'USTats',
        short_name: 'USTats',
        description: 'Track your UST academic progress visually',
        theme_color: '#F5A800',
        background_color: '#FAFAF9',
        display: 'standalone',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
        ],
      },
    }),
  ],
});
```

## Design Rationale and Trade-offs

### Why Client-Side Only?

**Advantages**:
- **Privacy**: No data leaves the user's device
- **Simplicity**: No backend infrastructure to maintain
- **Cost**: Zero hosting costs for backend
- **Offline**: Works without internet after initial load
- **Speed**: No network latency for data operations

**Trade-offs**:
- **No Cross-Device Sync**: Data tied to single browser
- **No Backup**: User responsible for data export
- **Limited Collaboration**: Can't share data with advisors
- **Browser Dependency**: Data lost if localStorage cleared

**Mitigation**:
- Prominent export/import functionality
- Clear user education about data persistence
- Future enhancement: Optional cloud sync

### Why React Context over Redux?

**Advantages**:
- **Simplicity**: Less boilerplate, easier to understand
- **Bundle Size**: No additional library
- **Sufficient**: App complexity doesn't warrant Redux
- **Performance**: Context + useReducer handles our use case

**Trade-offs**:
- **DevTools**: No Redux DevTools (but React DevTools sufficient)
- **Middleware**: No built-in middleware (implement custom if needed)
- **Scalability**: May need refactor if app grows significantly

### Why Recharts over Chart.js?

**Advantages**:
- **React-Native**: Declarative components, better DX
- **Bundle Size**: Smaller for our use case (~50KB vs ~200KB)
- **Composability**: Easier to customize and extend
- **TypeScript**: Better type support

**Trade-offs**:
- **Ecosystem**: Smaller plugin ecosystem than Chart.js
- **Customization**: Some advanced features require custom implementation
- **Learning Curve**: Different API than popular Chart.js

### Why Tesseract.js for OCR?

**Advantages**:
- **Client-Side**: No backend API needed
- **Free**: Open-source, no API costs
- **Privacy**: Image never leaves device

**Trade-offs**:
- **Accuracy**: Lower than cloud OCR services (Google Vision, AWS Textract)
- **Performance**: Slower processing (2-5 seconds)
- **Bundle Size**: Large library (~2MB)

**Mitigation**:
- OCR is optional enhancement, not core feature
- Manual entry is primary method
- Load Tesseract.js lazily only when needed

## Future Enhancements

### Phase 2 Features (Post-MVP)

1. **Cloud Sync** (Optional)
   - Firebase/Supabase integration
   - User authentication
   - Cross-device data sync
   - Backup and restore

2. **Advanced Analytics**
   - Predictive modeling (ML-based GWA prediction)
   - Trend analysis (identify weak subjects)
   - Peer comparison (anonymized benchmarks)

3. **Collaboration Features**
   - Share progress with academic advisors
   - Export PDF reports
   - Email grade summaries

4. **Curriculum Expansion**
   - Support all UST colleges and programs
   - Custom curriculum builder
   - Import curriculum from CSV

5. **Mobile App**
   - React Native version
   - Native iOS/Android apps
   - Push notifications for grade reminders

6. **Gamification**
   - Achievement badges
   - Streak tracking
   - Milestone celebrations

7. **AI Assistant**
   - Study recommendations based on performance
   - Grade prediction based on historical data
   - Personalized motivational messages

## Conclusion

The USTats design balances **simplicity, privacy, and functionality**. By leveraging client-side technologies and focusing on core features, the application provides immediate value to UST students while maintaining a refined academic aesthetic. The architecture supports future enhancements without requiring a complete rewrite, and the comprehensive testing strategy ensures reliability and correctness.

The design prioritizes **user experience** through warm, encouraging messaging, intuitive visualizations, and responsive design. Property-based testing of calculation logic provides confidence in correctness, while example-based testing ensures UI components behave as expected.

This design document serves as a blueprint for implementation, providing sufficient detail for developers to build the application while maintaining flexibility for creative problem-solving during development.

