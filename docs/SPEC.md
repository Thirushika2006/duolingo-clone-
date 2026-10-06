# Assignment Spec — Duolingo Clone

## Description
Build a functional clone of the Duolingo web application that replicates Duolingo's
design, user experience, and core lesson and gamification workflows.

The platform should let a learner move through a skill tree / learning path, complete
lessons made of varied interactive exercises, earn XP and maintain a streak, lose and
regain hearts, and track progress, all within the playful, gamified interface of the
original Duolingo app.

The implementation should visually and functionally feel like a modern Duolingo. The
focus is on recreating the lesson loop and gamification mechanics; actual language
content can be small and seeded.

**Note:** The application should match the original application in terms of UI and UX —
look and feel should be as close as possible.

## Technical Stack
- Frontend: Next.js (TypeScript)
- Backend: Python with FastAPI / Django
- Database: SQLite (design your own schema)
- Only a small amount of seeded course content (one language, a handful of skills).
  Audio optional/placeholder.

## Core Features (Must Have)

### 1. Learning Path / Skill Tree
- Recreate the Duolingo home path.
- A visual path/tree of units and skills with lock/unlock progression.
- Completed vs available vs locked states.
- Progress rings/crowns per skill.
- Top bar showing streak, XP, hearts, and (mocked) gems.

### 2. Lesson Player (the core loop)
- A lesson made of a sequence of exercises.
- Multiple exercise types: multiple choice, translate (word bank / tap-the-words),
  match pairs, fill in the blank, and type-the-answer.
- Immediate correct/incorrect feedback with the signature feedback bar.
- Progress bar across the lesson.
- Hearts: lose one on a wrong answer; lesson end/failure handled.
- Award XP and mark the skill's progress on completion.

### 3. Gamification & Progress
- Streak counter that increments on daily activity (day logic can be simulated/testable).
- XP totals and a simple leaderboard (can be seeded).
- Hearts regeneration over time or via a mocked "practice/refill".
- Daily goal / XP goal indicator.
- All progress (XP, streak, hearts, completed skills) must persist per user.

### 4. Content Management
- Course content (units, skills, lessons, exercises) stored in the database and seeded.
- A learner profile page with stats (streak, total XP, achievements).
- All learner progress must persist.

### 5. Duolingo Experience
- Playful, colorful, gamified UI with mascot-style flourishes.
- The lesson player with animated feedback.
- Modals (lesson complete, out of hearts), toasts, and celebratory states.
- Path navigation and progress visuals.
- Settings placeholders.
- Goal: feel like Duolingo, not a generic quiz app.

## Mocked / Placeholder Sections (Coming Soon is fine)
- Real speech recognition / pronunciation exercises.
- In-app purchases / Super subscription (gems can be mocked).
- Friends / social features (leaderboard can be seeded).
- Multiple languages (one seeded language is enough).
- Real user authentication may be simplified (assume a default logged-in learner).

## Bonus (Optional)
- Audio for exercises (text-to-speech or seeded audio).
- Achievements / badges system.
- Real functioning leaderboard across seeded users.
- Timed practice / "legendary" challenge mode.
- Dark mode.
- Responsive design (mobile, tablet, desktop).

## Important Notes
- UI Design must closely resemble Duolingo's design.
- Seed the database: one language course with a few units/skills/lessons and varied
  exercises, plus a sample learner with some progress, so the app is immediately usable.
- Design your own database schema — this is evaluated.
- README must include: setup instructions, tech stack, architecture overview, database
  schema, and any assumptions made.
- Original work only — plagiarism from existing repos = immediate disqualification.
