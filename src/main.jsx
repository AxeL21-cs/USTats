import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {
  AlertTriangle,
  BookOpen,
  Calculator,
  ChevronRight,
  FileImage,
  GraduationCap,
  LineChart as LineChartIcon,
  Plus,
  Save,
  Search,
  Sparkles,
  RotateCcw,
  Trash2,
  Trophy,
  Upload,
  User
} from "lucide-react";
import collegesMarkdown from "../UST_COLLEGES.md?raw";
import curriculumMarkdown from "../COMPSCI_UST.md?raw";
import "./styles.css";

const gradeBands = [
  { label: "Excellent", min: 1, max: 1.5, color: "#3FA76A" },
  { label: "Good", min: 1.51, max: 2, color: "#3977D6" },
  { label: "Satisfactory", min: 2.01, max: 2.5, color: "#F5A800" },
  { label: "Passing", min: 2.51, max: 3, color: "#D7782F" },
  { label: "At Risk", min: 3.01, max: 5, color: "#D94B4B" }
];

const seedSemester = {
  id: crypto.randomUUID(),
  name: "2025-2026 1st Term",
  image: "",
  subjects: [
    { id: crypto.randomUUID(), subject: "ICS2603", description: "Discrete Structures", lecUnits: 3, labUnits: 0, prelim: 81, finals: 1.75 },
    { id: crypto.randomUUID(), subject: "ICS2604", description: "Values Education", lecUnits: 2, labUnits: 0, prelim: 91, finals: 1 },
    { id: crypto.randomUUID(), subject: "ICS2601", description: "Introduction to Computing", lecUnits: 3, labUnits: 0, prelim: 94, finals: 1 },
    { id: crypto.randomUUID(), subject: "ICS2602", description: "Computer Programming I (Fundamentals of Programming - Imperative)", lecUnits: 4, labUnits: 1, prelim: 87, finals: 2 },
    { id: crypto.randomUUID(), subject: "THY 1", description: "Christian Vision of the Human Person", lecUnits: 3, labUnits: 0, prelim: 84, finals: 1.5 },
    { id: crypto.randomUUID(), subject: "PATH-FIT 1", description: "Physical Activities Toward Health and Fitness I: Movement Competency Training", lecUnits: 2, labUnits: 0, prelim: 96, finals: 1 },
    { id: crypto.randomUUID(), subject: "NSTP LTS 1", description: "NSTP Literacy Training Service I", lecUnits: 0, labUnits: 3, prelim: "", finals: 1.75 },
    { id: crypto.randomUUID(), subject: "UND_SELF", description: "Understanding the Self", lecUnits: 3, labUnits: 0, prelim: 93, finals: 1.25 },
    { id: crypto.randomUUID(), subject: "MATH_MW", description: "Mathematics in the Modern World", lecUnits: 3, labUnits: 0, prelim: 97, finals: 1 },
    { id: crypto.randomUUID(), subject: "ART_APP", description: "Art Appreciation", lecUnits: 3, labUnits: 0, prelim: 96, finals: 1.25 }
  ]
};

function createBlankSemester(name = "Semester 1") {
  return {
    id: crypto.randomUUID(),
    name,
    image: "",
    subjects: []
  };
}

const honors = [
  { tier: "Cum Laude", required: 1.75, color: "#F5A800" },
  { tier: "Magna Cum Laude", required: 1.5, color: "#3977D6" },
  { tier: "Summa Cum Laude", required: 1.25, color: "#3FA76A" }
];

function useStoredState(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  const setStoredValue = (next) => {
    setValue((current) => {
      const resolved = typeof next === "function" ? next(current) : next;
      localStorage.setItem(key, JSON.stringify(resolved));
      return resolved;
    });
  };

  return [value, setStoredValue];
}

function useStoredStateWithVersion(key, initialValue, version) {
  const versionKey = `${key}:version`;
  const [value, setValue] = useState(() => {
    const storedVersion = localStorage.getItem(versionKey);
    if (storedVersion !== version) {
      localStorage.setItem(versionKey, version);
      localStorage.setItem(key, JSON.stringify(initialValue));
      return initialValue;
    }

    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  const setStoredValue = (next) => {
    setValue((current) => {
      const resolved = typeof next === "function" ? next(current) : next;
      localStorage.setItem(versionKey, version);
      localStorage.setItem(key, JSON.stringify(resolved));
      return resolved;
    });
  };

  return [value, setStoredValue];
}

function parseColleges(markdown) {
  return markdown
    .split("\n")
    .filter((line) => line.startsWith("- "))
    .map((line) => line.replace("- ", "").trim());
}

function parseCurriculum(markdown) {
  const lines = markdown.split("\n");
  const terms = [];
  let current = null;
  let readingSubjectTable = false;

  for (const line of lines) {
    if (line.startsWith("## ")) {
      current = { term: line.replace("## ", "").trim(), subjects: [] };
      terms.push(current);
      readingSubjectTable = false;
    }

    if (line.startsWith("| Subject | Description | Lec | Lab |")) {
      readingSubjectTable = true;
      continue;
    }

    if (line.startsWith("|") && current && readingSubjectTable && !line.includes("---")) {
      const cells = line
        .split("|")
        .slice(1, -1)
        .map((cell) => cell.trim());
      if (cells.length >= 4) {
        const [code, description, lec, lab, prerequisite = "", notes = ""] = cells;
        const lecUnits = Number(lec) || 0;
        const labUnits = Number(lab) || 0;
        current.subjects.push({
          id: crypto.randomUUID(),
          code,
          name: description,
          description,
          lecUnits,
          labUnits,
          units: lecUnits + labUnits,
          prerequisite,
          notes,
          includedInHonors: !notes.toLowerCase().includes("not included"),
          term: current.term
        });
      }
    }

    if (line.startsWith("- ") && current && line.includes("|")) {
      const [name, unitText] = line.replace("- ", "").split("|");
      const units = Number(unitText.match(/\d+/)?.[0] ?? 3);
      current.subjects.push({
        id: crypto.randomUUID(),
        code: "",
        name: name.trim(),
        description: name.trim(),
        lecUnits: units,
        labUnits: 0,
        units,
        prerequisite: "",
        notes: "",
        includedInHonors: true,
        term: current.term
      });
    }
  }

  return terms;
}

function bandForGrade(grade) {
  if (grade === null || grade === "" || !Number.isFinite(Number(grade)) || Number(grade) <= 0) return gradeBands[4];
  return gradeBands.find((band) => grade >= band.min && grade <= band.max) ?? gradeBands[4];
}

function formatGrade(value) {
  if (value === null || value === "") return "—";
  const number = Number(value);
  return Number.isFinite(number) ? number.toFixed(2) : "—";
}

function Welcome({ onStart }) {
  const [draftName, setDraftName] = useState("");

  return (
    <main className="welcome-screen">
      <section className="welcome-panel">
        <div className="brand-lockup large">
          <img className="brand-logo" src="/assets/ustats-logo-transparent.png" alt="USTats logo" />
        </div>
        <div className="welcome-copy">
          <h1>See your academic progress with the clarity the portal never gave you.</h1>
          <p>Track grades, project Latin honors, and calculate target scores in a refined workspace built for Thomasians.</p>
        </div>
        <form
          className="name-entry"
          onSubmit={(event) => {
            event.preventDefault();
            if (draftName.trim()) onStart(draftName.trim());
          }}
        >
          <label htmlFor="student-name">What's your name, Thomasian?</label>
          <div className="input-action">
            <User size={18} aria-hidden="true" />
            <input
              id="student-name"
              value={draftName}
              onChange={(event) => setDraftName(event.target.value)}
              placeholder="Enter your name"
            />
            <button type="submit">
              Proceed <ChevronRight size={17} aria-hidden="true" />
            </button>
          </div>
        </form>
      </section>
      <aside className="welcome-visual" aria-label="UST progress preview">
        <div className="crest-orbit">
          <GraduationCap size={72} />
        </div>
        <div className="mini-transcript">
          <span>Semester GWA</span>
          <strong>1.58</strong>
          <AreaChart width={260} height={110} data={[{ p: "Prelim", g: 1.54 }, { p: "Finals", g: 1.38 }, { p: "Average", g: 1.46 }]}>
            <Area type="monotone" dataKey="g" stroke="#F5A800" fill="#F5A80033" />
          </AreaChart>
        </div>
      </aside>
    </main>
  );
}

function AppShell({ name, activePage, setActivePage, onLogout, children }) {
  const items = [
    { id: "dashboard", label: "Dashboard", icon: LineChartIcon },
    { id: "honors", label: "Latin Honor Tracker", icon: Trophy },
    { id: "calculator", label: "Subject Calculator", icon: Calculator }
  ];

  return (
    <div className="app-shell">
      <header className="top-nav">
        <button className="brand-lockup nav-brand" onClick={() => setActivePage("dashboard")}>
          <img className="brand-logo" src="/assets/ustats-logo-transparent.png" alt="USTats logo" />
          <div>
            <small>For {name}</small>
          </div>
        </button>
        <nav aria-label="Main navigation">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.id} className={activePage === item.id ? "active" : ""} onClick={() => setActivePage(item.id)}>
                <Icon size={17} aria-hidden="true" />
                {item.label}
              </button>
            );
          })}
          <button className="logout-button" onClick={onLogout}>
            Logout
          </button>
        </nav>
      </header>
      {children}
    </div>
  );
}

function GradeDashboard({ name, semesters, setSemesters }) {
  const [selectedSemesterId, setSelectedSemesterId] = useState(semesters[0]?.id);
  const [subjectFilter, setSubjectFilter] = useState("All subjects");
  const selectedSemester = semesters.find((semester) => semester.id === selectedSemesterId) ?? semesters[0];
  const normalizedSubjects = selectedSemester.subjects.map(normalizeSubjectRow);
  const visibleSubjects = subjectFilter === "All subjects" ? normalizedSubjects : normalizedSubjects.filter((row) => row.subject === subjectFilter);
  const hasRisk = normalizedSubjects.some((row) => computeSubjectFinalGrade(row) > 3 || Number(row.finals) === 5);
  const semesterAverage = semestralAverage(normalizedSubjects);
  const safetyForecast = buildSafetyForecast(normalizedSubjects, semesterAverage, name);
  const semesterComparison = semesters.map((semester) => ({
    name: semester.name,
    gwa: semestralAverage(semester.subjects.map(normalizeSubjectRow))
  }));

  function updateSubject(id, key, value) {
    setSemesters((current) =>
      current.map((semester) =>
        semester.id === selectedSemester.id
          ? {
              ...semester,
              subjects: semester.subjects.map((subject) => {
                if (subject.id !== id) return subject;
                const textFields = ["subject", "description"];
                return { ...subject, [key]: textFields.includes(key) ? value : value === "" ? "" : Number(value) };
              })
            }
          : semester
      )
    );
  }

  function addSubject() {
    setSemesters((current) =>
      current.map((semester) =>
        semester.id === selectedSemester.id
          ? {
              ...semester,
              subjects: [...semester.subjects, { id: crypto.randomUUID(), subject: "COURSE", description: "New Subject", lecUnits: 3, labUnits: 0, prelim: 90, finals: 1.75 }]
            }
          : semester
      )
    );
  }

  function addSemester() {
    const next = {
      id: crypto.randomUUID(),
      name: `Semester ${semesters.length + 1}`,
      image: "",
      subjects: [{ id: crypto.randomUUID(), subject: "COURSE", description: "New Subject", lecUnits: 3, labUnits: 0, prelim: 90, finals: 1.75 }]
    };
    setSemesters((current) => [...current, next]);
    setSelectedSemesterId(next.id);
    setSubjectFilter("All subjects");
  }

  function deleteCurrentSemester() {
    if (semesters.length <= 1) {
      const blank = createBlankSemester(selectedSemester.name);
      setSemesters([blank]);
      setSelectedSemesterId(blank.id);
      setSubjectFilter("All subjects");
      return;
    }

    const remaining = semesters.filter((semester) => semester.id !== selectedSemester.id);
    setSemesters(remaining);
    setSelectedSemesterId(remaining[0].id);
    setSubjectFilter("All subjects");
  }

  function startFreshGrades() {
    const blank = createBlankSemester("Semester 1");
    setSemesters([blank]);
    setSelectedSemesterId(blank.id);
    setSubjectFilter("All subjects");
  }

  function handleImageUpload(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setSemesters((current) => current.map((semester) => (semester.id === selectedSemester.id ? { ...semester, image: reader.result } : semester)));
    };
    reader.readAsDataURL(file);
  }

  function deleteUploadedGrades() {
    setSemesters((current) => current.map((semester) => (semester.id === selectedSemester.id ? { ...semester, image: "" } : semester)));
  }

  return (
    <main className="page-grid">
      <section className="page-intro">
        <p>Welcome back, {name}.</p>
        <h1>Upload Your Grades</h1>
          <span>Here&apos;s your progress, {name}. Enter Prelims and Finals only; the app computes each final grade and your semestral average automatically.</span>
      </section>

      <section className="toolbar-row">
        <div className="segmented">
          {semesters.map((semester) => (
            <button key={semester.id} className={selectedSemester.id === semester.id ? "active" : ""} onClick={() => setSelectedSemesterId(semester.id)}>
              {semester.name}
            </button>
          ))}
        </div>
        <div className="semester-actions">
          <button className="danger-button" onClick={deleteCurrentSemester}>
            <Trash2 size={16} /> Delete grades
          </button>
          <button className="reset-button" onClick={startFreshGrades}>
            <RotateCcw size={16} /> Start fresh
          </button>
          <button className="ghost-button" onClick={addSemester}>
            <Plus size={16} /> Add semester
          </button>
        </div>
      </section>

      <section className={`forecast-banner ${safetyForecast.level}`}>
        <div className="forecast-message">
          {safetyForecast.level === "safe" ? <Sparkles size={21} /> : <AlertTriangle size={21} />}
          <div>
            <strong>{safetyForecast.title}</strong>
            <span>{safetyForecast.message}</span>
          </div>
        </div>
        <div className="forecast-score">
          <span>Safety score</span>
          <strong>{safetyForecast.score}%</strong>
        </div>
      </section>

      <section className="forecast-strip">
        <Metric label="Semestral average" value={formatGrade(semesterAverage)} tone={safetyForecast.level} />
        <Metric label="At-risk subjects" value={safetyForecast.atRiskCount} tone={safetyForecast.atRiskCount ? "risk" : "safe"} />
        <Metric label="Forecast" value={safetyForecast.shortLabel} tone={safetyForecast.level} />
      </section>

      <section className="dashboard-layout">
        <div className="panel grade-panel">
          <div className="panel-heading">
            <div>
              <p>Semester records</p>
                <h2>{selectedSemester.name}</h2>
              </div>
            <label className="upload-button">
              <Upload size={16} />
              Upload screenshot
              <input type="file" accept="image/png,image/jpeg" onChange={(event) => handleImageUpload(event.target.files?.[0])} />
            </label>
          </div>
          {selectedSemester.image && (
            <figure className="upload-preview">
              <img src={selectedSemester.image} alt={`${selectedSemester.name} uploaded grades`} />
              <figcaption>
                <span>OCR-ready preview. Use the editable table below as a precise fallback.</span>
                <button type="button" className="delete-upload-button" onClick={deleteUploadedGrades}>
                  Delete upload
                </button>
              </figcaption>
            </figure>
          )}
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Description</th>
                  <th>Lec Units</th>
                  <th>Lab Units</th>
                  <th>Prelims</th>
                  <th>Finals</th>
                  <th>Final Grade</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {normalizedSubjects.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <input value={row.subject} onChange={(event) => updateSubject(row.id, "subject", event.target.value)} />
                    </td>
                    <td>
                      <input value={row.description} onChange={(event) => updateSubject(row.id, "description", event.target.value)} />
                    </td>
                    {["lecUnits", "labUnits", "prelim", "finals"].map((key) => (
                      <td key={key}>
                        <input
                          type="number"
                          min="0"
                          max={key === "prelim" ? "100" : key === "finals" ? "5" : "12"}
                          step={key === "finals" ? "0.01" : "1"}
                          value={row[key]}
                          onChange={(event) => updateSubject(row.id, key, event.target.value)}
                        />
                      </td>
                    ))}
                    <td>
                      <output className="computed-grade">{formatGrade(computeSubjectFinalGrade(row))}</output>
                    </td>
                    <td>
                      <span className={`grade-status ${statusForGrade(computeSubjectFinalGrade(row)).className}`}>
                        {statusForGrade(computeSubjectFinalGrade(row)).label}
                      </span>
                    </td>
                  </tr>
                ))}
                {!normalizedSubjects.length && (
                  <tr>
                    <td colSpan="8" className="empty-table-cell">
                      No grades yet. Add a subject or upload a screenshot to start tracking this semester.
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="6">Semestral Average</td>
                  <td>{formatGrade(semesterAverage)}</td>
                  <td>{safetyForecast.shortLabel}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <button className="ghost-button compact" onClick={addSubject}>
            <Plus size={15} /> Add subject
          </button>
        </div>

        <div className="visual-stack">
          <div className="panel">
            <div className="panel-heading compact-heading">
              <div>
                <p>Course trend</p>
                <h2>Prelims to Final Grade</h2>
              </div>
              <select value={subjectFilter} onChange={(event) => setSubjectFilter(event.target.value)}>
                <option>All subjects</option>
                {normalizedSubjects.map((row) => (
                  <option key={row.id}>{row.subject}</option>
                ))}
              </select>
            </div>
            <div className="chart-frame">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={trendData(visibleSubjects)}>
                  <CartesianGrid stroke="#E8DDC7" vertical={false} />
                  <XAxis dataKey="period" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip formatter={(value) => formatGrade(value)} />
                  {visibleSubjects.map((subject, index) => (
                    <Line key={subject.id} type="monotone" dataKey={subject.subject} stroke={gradeBands[index % gradeBands.length].color} strokeWidth={3} dot={{ r: 4 }} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="panel">
            <div className="panel-heading compact-heading">
              <div>
                <p>Semester comparison</p>
                <h2>Computed final grades</h2>
              </div>
            </div>
            <div className="chart-frame">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={normalizedSubjects.map((subject) => ({ ...subject, computedFinal: computeSubjectFinalGrade(subject) }))}>
                  <CartesianGrid stroke="#E8DDC7" vertical={false} />
                  <XAxis dataKey="subject" hide />
                  <YAxis domain={[0, 5]} />
                  <Tooltip formatter={(value) => formatGrade(value)} />
                  <Bar dataKey="computedFinal" radius={[6, 6, 0, 0]}>
                    {normalizedSubjects.map((subject) => (
                      <Cell key={subject.id} fill={bandForGrade(computeSubjectFinalGrade(subject)).color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="legend-row">
              {gradeBands.map((band) => (
                <span key={band.label}>
                  <i style={{ background: band.color }} />
                  {band.label}
                </span>
              ))}
            </div>
          </div>

          <div className="panel comparison-panel">
            <p>Across semesters</p>
            <ResponsiveContainer width="100%" height={130}>
              <AreaChart data={semesterComparison}>
                <Area dataKey="gwa" stroke="#F5A800" fill="#F5A80035" strokeWidth={3} />
                <XAxis dataKey="name" />
                <YAxis reversed domain={[1, 5]} hide />
                <Tooltip formatter={(value) => formatGrade(value)} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </main>
  );
}

function LatinHonorTracker({ name, semesters }) {
  const colleges = useMemo(() => parseColleges(collegesMarkdown), []);
  const curriculumTerms = useMemo(() => parseCurriculum(curriculumMarkdown), []);
  const allSubjects = curriculumTerms.flatMap((term) => term.subjects);
  const [collegeQuery, setCollegeQuery] = useState("");
  const [college, setCollege] = useStoredStateWithVersion("ust-college", "", "defer-cics-programs-v1");
  const [course, setCourse] = useStoredStateWithVersion("ust-course", "", "defer-cics-programs-v1");
  const uploadedGrades = semesters.flatMap((semester) => semester.subjects);
  const filteredColleges = colleges.filter((item) => item.toLowerCase().includes(collegeQuery.toLowerCase()));
  const honorsSubjects = allSubjects.filter((subject) => subject.includedInHonors);
  const completed = honorsSubjects
    .map((subject) => {
      const uploaded = uploadedGrades
        .map(normalizeSubjectRow)
        .find((row) => {
          const rowCode = row.subject.toLowerCase();
          const rowDescription = row.description.toLowerCase();
          const subjectCode = subject.code.toLowerCase();
          const subjectDescription = subject.description.toLowerCase();
          return (
            (subjectCode && rowCode === subjectCode) ||
            rowDescription.includes(subjectDescription) ||
            subjectDescription.includes(rowDescription)
          );
        });
      const grade = uploaded ? computeSubjectFinalGrade(uploaded) : "";
      return { ...subject, grade: grade === "" ? "" : Number(grade) };
    })
    .filter((subject) => Number.isFinite(subject.grade));
  const totalUnits = honorsSubjects.reduce((sum, subject) => sum + subject.units, 0);
  const completedUnits = completed.reduce((sum, subject) => sum + subject.units, 0);
  const remainingUnits = totalUnits - completedUnits;
  const currentGwa = weightedGwa(completed);
  const totalTerms = new Set(honorsSubjects.map((subject) => subject.term)).size;
  const completedTerms = new Set(completed.map((subject) => subject.term)).size;
  const remainingTerms = Math.max(0, totalTerms - completedTerms);
  const honorSummary = buildHonorSummary(currentGwa, remainingTerms, name);

  return (
    <main className="page-grid">
      <section className="page-intro">
        <p>Latin Honor Eligibility Tracker</p>
        <h1>Let&apos;s forecast the finish line, {name}.</h1>
        <span>Your projection uses weighted units from the Computer Science curriculum and any matching grades from your dashboard.</span>
      </section>

      <section className="selector-grid">
        <div className="panel">
          <div className="panel-heading compact-heading">
            <div>
              <p>College selection</p>
              <h2>What college are you from?</h2>
            </div>
          </div>
          <div className="search-field">
            <Search size={17} />
            <input value={collegeQuery} onChange={(event) => setCollegeQuery(event.target.value)} placeholder="Search UST colleges" />
          </div>
          <div className="option-list">
            {filteredColleges.map((item) => (
              <button
                key={item}
                className={college === item ? "selected" : ""}
                onClick={() => {
                  setCollege(item);
                  setCourse(item === "College of Information and Computing Sciences" ? "" : "");
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {college === "College of Information and Computing Sciences" ? (
          <div className="panel">
            <div className="panel-heading compact-heading">
              <div>
                <p>Course selection</p>
                <h2>CICS programs</h2>
              </div>
            </div>
            <div className="course-options">
              {["Computer Science", "Information Technology", "Information Systems"].map((item) => (
                <button key={item} className={course === item ? "selected" : ""} onClick={() => setCourse(item)}>
                  <BookOpen size={17} />
                  {item}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="panel pending-selection">
            <div className="soft-empty">Select a college first, bro.</div>
          </div>
        )}
      </section>

      {college === "College of Information and Computing Sciences" && course === "Computer Science" && (
        <>
          <section className="stats-strip">
            <Metric label="Current weighted GWA" value={formatGrade(currentGwa)} />
            <Metric label="Completed units" value={`${completedUnits}/${totalUnits}`} />
            <Metric label="Remaining semesters" value={remainingTerms || 0} />
          </section>

          <section className={`honor-summary ${honorSummary.level}`}>
            <div className="honor-summary-message">
              <strong>{honorSummary.title}</strong>
              <span>{honorSummary.message}</span>
            </div>
            <div className="honor-summary-grid">
              <div>
                <span>Term</span>
                <strong>1st Term | S.Y 2025-2026</strong>
              </div>
              <div>
                <span>Term GWA</span>
                <strong>{formatGrade(currentGwa)}</strong>
              </div>
              <div>
                <span>Cumulative GWA</span>
                <strong>{formatGrade(currentGwa)}</strong>
              </div>
              <div>
                <span>Source</span>
                <strong>USTats Semester Average</strong>
              </div>
              <div>
                <span>Current standing</span>
                <strong>{honorSummary.standing}</strong>
              </div>
              <div>
                <span>Remaining academic load</span>
                <strong>{remainingUnits} units across {remainingTerms || 0} semesters</strong>
              </div>
            </div>
            <div className="honor-target-list">
              {honors.map((honor) => {
                  const targetQuality = honor.required * totalUnits;
                  const completedQuality = completed.reduce((sum, subject) => sum + subject.grade * subject.units, 0);
                  const neededAverage = remainingUnits > 0 ? (targetQuality - completedQuality) / remainingUnits : currentGwa;
                  const met = currentGwa > 0 && currentGwa <= honor.required;
                  return (
                    <div key={honor.tier}>
                      <span>{honor.tier} target</span>
                      <strong>{met ? "Requirement already met" : `${formatGrade(neededAverage)} or better across remaining ${remainingUnits} units`}</strong>
                    </div>
                  );
                })}
            </div>
            <p className="honor-note">
              Remaining load is estimated from unfinished Computer Science curriculum units. Target grades are weighted across remaining units.
            </p>
          </section>

          <section className="honor-cards">
            {honors.map((honor) => {
              const targetQuality = honor.required * totalUnits;
              const completedQuality = completed.reduce((sum, subject) => sum + subject.grade * subject.units, 0);
              const neededAverage = remainingUnits > 0 ? (targetQuality - completedQuality) / remainingUnits : currentGwa;
              const met = currentGwa > 0 && currentGwa <= honor.required;
              const reachable = met || neededAverage >= 1;
              const progress = met
                ? 100
                : Math.max(0, Math.min(100, Math.round(((3 - currentGwa) / (3 - honor.required)) * 100)));
              const gap = currentGwa - honor.required;
              const gapAmount = Math.abs(gap);
              return (
                <article key={honor.tier} className={`honor-card ${met ? "met" : ""}`}>
                  <div className="gauge">
                    <ResponsiveContainer width="100%" height={170}>
                      <RadialBarChart innerRadius="72%" outerRadius="95%" data={[{ value: progress, fill: honor.color }]} startAngle={210} endAngle={-30}>
                        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                        <RadialBar dataKey={() => 100} fill="#EDE3D2" cornerRadius={10} />
                        <RadialBar dataKey="value" cornerRadius={10} />
                      </RadialBarChart>
                    </ResponsiveContainer>
                    <strong>{formatGrade(honor.required)}</strong>
                    <span>Required GWA</span>
                  </div>
                  <div className="honor-detail">
                    <div className="tier-heading">
                      <h2>{honor.tier}</h2>
                      <span className={met ? "status-badge completed" : reachable ? "status-badge reachable" : "status-badge blocked"}>
                        {met ? "Requirement met" : reachable ? "Reachable" : "No longer reachable"}
                      </span>
                    </div>
                    {met ? (
                      <p>
                        Congratulations, {name}! Your current GWA of <strong>{formatGrade(currentGwa)}</strong> already meets the requirement for {honor.tier}.
                      </p>
                    ) : reachable ? (
                      <p>
                        You need to average <strong>{formatGrade(neededAverage)}</strong> across your remaining <strong>{remainingTerms || 0}</strong> semesters.
                      </p>
                    ) : (
                      <p>Keep pushing — you&apos;re building something great, {name}. This tier needs better than a 1.000 average from here.</p>
                    )}
                    <dl>
                      <div className={`gap-callout ${met ? "ahead" : gap <= 0 ? "ontrack" : "behind"}`}>
                        <dt>Gap</dt>
                        <dd>
                          {met
                            ? `${formatGrade(gapAmount)} ahead`
                            : gap <= 0
                              ? "On track"
                              : `Improve by ${formatGrade(gapAmount)}`}
                        </dd>
                        <small>{met ? "Requirement successfully met" : "Lower GWA is better"}</small>
                      </div>
                      <div>
                        <dt>Remaining units</dt>
                        <dd>{remainingUnits}</dd>
                      </div>
                    </dl>
                  </div>
                </article>
              );
            })}
          </section>

        </>
      )}
    </main>
  );
}

function SubjectCalculator({ name }) {
  const [image, setImage] = useState("");
  const [target, setTarget] = useState(1.75);
  const [components, setComponents] = useStoredState("ust-grade-components", [
    { id: crypto.randomUUID(), name: "Quizzes", weight: 30, count: 3, assessments: [{ max: 50, score: 43 }, { max: 50, score: "" }, { max: 50, score: "" }] },
    { id: crypto.randomUUID(), name: "Midterm Exam", weight: 30, count: 1, assessments: [{ max: 100, score: 88 }] },
    { id: crypto.randomUUID(), name: "Final Exam", weight: 40, count: 1, assessments: [{ max: 100, score: "" }] }
  ]);
  const calculation = calculateTarget(components, target);

  function handleImageUpload(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  }

  function updateComponent(id, key, value) {
    setComponents((current) =>
      current.map((component) => {
        if (component.id !== id) return component;
        const updated = { ...component, [key]: key === "name" ? value : Number(value) };
        if (key === "count") {
          const nextCount = Math.max(1, Number(value));
          updated.assessments = Array.from({ length: nextCount }, (_, index) => component.assessments[index] ?? { max: 100, score: "" });
        }
        return updated;
      })
    );
  }

  function updateAssessment(componentId, index, key, value) {
    setComponents((current) =>
      current.map((component) =>
        component.id === componentId
          ? {
              ...component,
              assessments: component.assessments.map((assessment, assessmentIndex) =>
                assessmentIndex === index ? { ...assessment, [key]: value === "" ? "" : Number(value) } : assessment
              )
            }
          : component
      )
    );
  }

  function addComponent() {
    setComponents((current) => [...current, { id: crypto.randomUUID(), name: "New Component", weight: 10, count: 1, assessments: [{ max: 100, score: "" }] }]);
  }

  return (
    <main className="page-grid">
      <section className="page-intro">
        <p>Target Grade Calculator</p>
        <h1>Know what the next scores need to be, {name}.</h1>
        <span>Upload the grading breakdown, confirm the parsed components, and solve the blank assessments.</span>
      </section>

      <section className="calculator-layout">
        <div className="panel">
          <div className="panel-heading">
            <div>
              <p>Professor&apos;s grading system</p>
              <h2>Upload breakdown</h2>
            </div>
            <label className="upload-button">
              <FileImage size={16} />
              Upload image
              <input type="file" accept="image/png,image/jpeg" onChange={(event) => handleImageUpload(event.target.files?.[0])} />
            </label>
          </div>
          {image ? (
            <figure className="grading-preview">
              <img src={image} alt="Uploaded grading system" />
              <figcaption>Parsed as editable fields below. Adjust any component that needs refinement.</figcaption>
            </figure>
          ) : (
            <div className="soft-empty">Upload a screenshot or use the editable starter breakdown, {name}.</div>
          )}

          <div className="component-list">
            {components.map((component) => (
              <article key={component.id} className="component-card">
                <div className="component-head">
                  <input value={component.name} onChange={(event) => updateComponent(component.id, "name", event.target.value)} />
                  <label>
                    Weight %
                    <input type="number" min="0" max="100" value={component.weight} onChange={(event) => updateComponent(component.id, "weight", event.target.value)} />
                  </label>
                  <label>
                    Assessments
                    <input type="number" min="1" max="12" value={component.count} onChange={(event) => updateComponent(component.id, "count", event.target.value)} />
                  </label>
                </div>
                <div className="assessment-grid">
                  {component.assessments.map((assessment, index) => (
                    <div key={`${component.id}-${index}`} className="assessment-row">
                      <span>{index + 1}</span>
                      <label>
                        Max
                        <input type="number" min="1" value={assessment.max} onChange={(event) => updateAssessment(component.id, index, "max", event.target.value)} />
                      </label>
                      <label>
                        Score
                        <input type="number" min="0" placeholder="Future" value={assessment.score} onChange={(event) => updateAssessment(component.id, index, "score", event.target.value)} />
                      </label>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
          <button className="ghost-button compact" onClick={addComponent}>
            <Plus size={15} /> Add component
          </button>
        </div>

        <aside className="panel result-panel">
          <div className="panel-heading compact-heading">
            <div>
              <p>Desired final grade</p>
              <h2>Target solver</h2>
            </div>
          </div>
          <label className="target-input">
            What grade do you want for this subject?
            <input type="number" min="1" max="5" step="0.01" value={target} onChange={(event) => setTarget(Number(event.target.value))} />
          </label>
          <div className={`feasibility ${calculation.status}`}>
            <Sparkles size={20} />
            <strong>{calculation.title}</strong>
            <span>{calculation.message.replace("[Name]", name)}</span>
          </div>
          <div className="needed-list">
            {calculation.remaining.map((item) => (
              <div key={item.key}>
                <span>{item.label}</span>
                <strong>{item.neededScore}</strong>
              </div>
            ))}
          </div>
          <div className="best-grade">
            <span>Best possible equivalent</span>
            <strong>{formatGrade(calculation.bestGrade)}</strong>
          </div>
        </aside>
      </section>
    </main>
  );
}

function Metric({ label, value, tone = "" }) {
  return (
    <div className={`metric ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function trendData(subjects) {
  return [
    {
      period: "Prelims",
      ...Object.fromEntries(subjects.map((subject) => [subject.subject, prelimGradeEquivalent(subject.prelim)]))
    },
    {
      period: "Finals",
      ...Object.fromEntries(subjects.map((subject) => [subject.subject, Number(subject.finals)]))
    },
    {
      period: "Final Grade",
      ...Object.fromEntries(subjects.map((subject) => [subject.subject, computeSubjectFinalGrade(subject)]))
    }
  ];
}

function averageGrade(values) {
  const valid = values.map(Number).filter(Number.isFinite);
  if (!valid.length) return 0;
  return valid.reduce((sum, value) => sum + value, 0) / valid.length;
}

function weightedGwa(subjects) {
  const units = subjects.reduce((sum, subject) => sum + subject.units, 0);
  if (!units) return 0;
  return subjects.reduce((sum, subject) => sum + subject.grade * subject.units, 0) / units;
}

function subjectKey(subject) {
  return subject.code || subject.name;
}

function normalizeSubjectRow(row) {
  return {
    id: row.id ?? crypto.randomUUID(),
    subject: row.subject ?? "COURSE",
    description: row.description ?? row.subject ?? "New Subject",
    lecUnits: row.lecUnits ?? row.units ?? 3,
    labUnits: row.labUnits ?? 0,
    prelim: row.prelim ?? "",
    finals: row.finals ?? row.finalGrade ?? ""
  };
}

function prelimGradeEquivalent(prelim) {
  if (prelim === "" || prelim === null || prelim === undefined) return null;
  const value = Number(prelim);
  if (!Number.isFinite(value)) return 0;
  if (value <= 5) return value;
  if (value >= 96) return 1;
  if (value >= 94) return 1.25;
  if (value >= 91) return 1.5;
  if (value >= 88) return 1.75;
  if (value >= 85) return 2;
  if (value >= 82) return 2.25;
  if (value >= 79) return 2.5;
  if (value >= 76) return 2.75;
  if (value >= 75) return 3;
  return 5;
}

function computeSubjectFinalGrade(subject) {
  const finalsGrade = Number(subject.finals);
  return Number.isFinite(finalsGrade) ? finalsGrade : null;
}

function semestralAverage(subjects) {
  const weightedSubjects = subjects
    .filter((subject) => !subject.subject.toLowerCase().startsWith("nstp"))
    .map((subject) => ({ grade: computeSubjectFinalGrade(subject), units: (Number(subject.lecUnits) || 0) + (Number(subject.labUnits) || 0) }))
    .filter((subject) => subject.units > 0 && Number.isFinite(subject.grade) && subject.grade > 0);
  if (!weightedSubjects.length) return null;
  return weightedGwa(weightedSubjects);
}

function statusForGrade(grade) {
  const value = Number(grade);
  if (!Number.isFinite(value) || value <= 0) return { label: "Pending", className: "pending" };
  if (value <= 1.5) return { label: "Excellent", className: "excellent" };
  if (value <= 2) return { label: "Good", className: "good" };
  if (value <= 2.5) return { label: "Satisfactory", className: "satisfactory" };
  if (value <= 3) return { label: "Passing", className: "passing" };
  return { label: "At Risk", className: "risk" };
}

function buildSafetyForecast(subjects, semesterAverage, name) {
  const completed = subjects
    .map((subject) => ({ ...subject, grade: computeSubjectFinalGrade(subject) }))
    .filter((subject) => Number.isFinite(subject.grade) && subject.grade > 0);
  const atRisk = completed.filter((subject) => subject.grade > 3 || subject.grade === 5);
  const watch = completed.filter((subject) => subject.grade > 2.5 && subject.grade <= 3);
  if (!completed.length) {
    return {
      level: "pending",
      shortLabel: "Pending",
      score: 0,
      atRiskCount: 0,
      title: `Start fresh, ${name}.`,
      message: "Add your subjects and finals grades to generate the safety forecast."
    };
  }
  const excellentShare = completed.length ? completed.filter((subject) => subject.grade <= 1.5).length / completed.length : 0;
  const average = Number(semesterAverage);
  const averageSafety = Number.isFinite(average) ? Math.max(0, Math.min(100, Math.round(((3 - average) / 2) * 100))) : 0;
  const riskPenalty = atRisk.length * 18 + watch.length * 8;
  const score = Math.max(0, Math.min(100, averageSafety + Math.round(excellentShare * 10) - riskPenalty));

  if (atRisk.length > 0 || average > 2.5) {
    return {
      level: "risk",
      shortLabel: "At Risk",
      score,
      atRiskCount: atRisk.length,
      title: `Attention, ${name}.`,
      message: `${atRisk.length || 1} subject${(atRisk.length || 1) > 1 ? "s" : ""} may put this term at risk. Review the red status rows and prioritize recovery work.`
    };
  }

  if (watch.length > 0 || average > 2) {
    return {
      level: "watch",
      shortLabel: "Watch",
      score,
      atRiskCount: 0,
      title: `You're still in a manageable zone, ${name}.`,
      message: `${watch.length || 1} subject${(watch.length || 1) > 1 ? "s" : ""} should be watched closely so the average does not drift toward risk.`
    };
  }

  return {
    level: "safe",
    shortLabel: "Safe",
    score,
    atRiskCount: 0,
    title: `You're doing well so far, ${name}.`,
    message: "Your current finals grades are in a safe range. Keep the rhythm steady and finish strong."
  };
}

function buildHonorSummary(currentGwa, remainingTerms, name) {
  const gwa = Number(currentGwa);
  if (!Number.isFinite(gwa) || gwa <= 0) {
    return {
      level: "building",
      title: "Let's build your Latin honors forecast.",
      message: `Add completed subject grades first, ${name}, then USTats can estimate your standing.`,
      standing: "Pending grades"
    };
  }

  if (gwa <= 1.25) {
    return {
      level: "excellent",
      title: "Outstanding work. Summa range is currently alive.",
      message: `Your current GWA is already within the highest Latin honors band, ${name}. Keep protecting that average.`,
      standing: "Eligible for Summa Cum Laude range"
    };
  }

  if (gwa <= 1.5) {
    return {
      level: "excellent",
      title: "You are in a strong Latin honors position.",
      message: `Your current GWA clears Magna and Cum Laude requirements, ${name}. Stay consistent across the remaining ${remainingTerms || 0} semesters.`,
      standing: "Eligible for Magna Cum Laude range"
    };
  }

  if (gwa <= 1.75) {
    return {
      level: "steady",
      title: "You are currently meeting Cum Laude requirements.",
      message: `Your current GWA is on track for Cum Laude, ${name}. A strong next term can pull the higher tiers closer.`,
      standing: "Eligible for Cum Laude range"
    };
  }

  if (gwa <= 2.25) {
    return {
      level: "building",
      title: "You are still building momentum.",
      message: `You still have ${remainingTerms || 0} semesters to catch up, ${name}. One better semester can shift your direction more than you think.`,
      standing: "Not yet eligible for Latin honors"
    };
  }

  return {
    level: "risk",
    title: "This needs a recovery plan.",
    message: `The current GWA is outside the Latin honors range, ${name}, but the forecast can still show the clearest path forward.`,
    standing: "At risk for Latin honors"
  };
}

function ustGradeToPercent(grade) {
  const clamped = Math.max(1, Math.min(5, grade));
  return 100 - ((clamped - 1) / 4) * 40;
}

function percentToUstGrade(percent) {
  return 1 + ((100 - percent) / 40) * 4;
}

function calculateTarget(components, targetGrade) {
  const targetPercent = ustGradeToPercent(targetGrade);
  let achievedWeighted = 0;
  let remainingWeight = 0;
  const remaining = [];

  components.forEach((component) => {
    const componentWeight = Number(component.weight) || 0;
    const eachAssessmentWeight = componentWeight / Math.max(component.assessments.length, 1);
    component.assessments.forEach((assessment, index) => {
      const max = Number(assessment.max) || 0;
      const score = assessment.score;
      if (score === "" || !Number.isFinite(Number(score))) {
        remainingWeight += eachAssessmentWeight;
        remaining.push({
          key: `${component.id}-${index}`,
          label: `${component.name} ${index + 1}`,
          max,
          eachAssessmentWeight
        });
      } else {
        achievedWeighted += (Number(score) / max) * 100 * eachAssessmentWeight / 100;
      }
    });
  });

  const neededAveragePercent = remainingWeight > 0 ? ((targetPercent - achievedWeighted) / remainingWeight) * 100 : 0;
  const possible = neededAveragePercent <= 100;
  const easy = neededAveragePercent <= 82;
  const bestPercent = achievedWeighted + remainingWeight;
  const bestGrade = percentToUstGrade(bestPercent);

  return {
    status: possible ? (easy ? "easy" : "challenging") : "blocked",
    title: possible ? (easy ? "Comfortably reachable" : "Challenging but possible") : "Not mathematically reachable",
    message: possible
      ? `Aim for about ${Math.max(0, neededAveragePercent).toFixed(1)}% on each remaining assessment, [Name].`
      : "This grade may no longer be reachable with current scores, [Name]. Here's the best possible grade you can achieve.",
    bestGrade,
    remaining: remaining.map((item) => ({
      ...item,
      neededScore: possible ? `${Math.ceil((Math.max(0, neededAveragePercent) / 100) * item.max)} / ${item.max}` : `${item.max} / ${item.max}`
    }))
  };
}

function App() {
  const [name, setName] = useStoredState("ust-student-name", "");
  const [activePage, setActivePage] = useStoredState("ust-active-page", "dashboard");
  const [semesters, setSemesters] = useStoredState("ust-semesters", [seedSemester]);

  if (!name) return <Welcome onStart={setName} />;

  function handleLogout() {
    setName("");
    setActivePage("dashboard");
  }

  return (
    <AppShell name={name} activePage={activePage} setActivePage={setActivePage} onLogout={handleLogout}>
      {activePage === "dashboard" && <GradeDashboard name={name} semesters={semesters} setSemesters={setSemesters} />}
      {activePage === "honors" && <LatinHonorTracker name={name} semesters={semesters} />}
      {activePage === "calculator" && <SubjectCalculator name={name} />}
    </AppShell>
  );
}

createRoot(document.getElementById("root")).render(<App />);
