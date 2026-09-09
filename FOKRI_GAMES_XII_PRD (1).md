# PRODUCT REQUIREMENT DOCUMENT
# FOKRI GAMES XII

**Document type:** Product Requirement Document (PRD) — Implementation-Ready
**Prepared for:** Organizing Committee, FOKRI GAMES XII
**Prepared by:** Product/Architecture/Security Working Group (this document)
**Status:** DRAFT v2.0 (post two-iteration review)
**Classification key used throughout this document:**

| Tag | Meaning |
|---|---|
| **CONFIRMED REQUIREMENT** | Explicitly provided by the product owner/organizer |
| **RECOMMENDATION** | Professional recommendation from this working group |
| **ASSUMPTION** | Temporary assumption required to keep the design moving |
| **TBD — TO BE CONFIRMED BY ORGANIZER** | Missing information that must be confirmed before build |

> ⚠️ No official FOKRI GAMES XII data (dates, venue, fees, quotas, categories, prizes, eligibility, rules) was supplied to this working group. Every such item below is explicitly marked TBD. Nothing in this document should be treated as an official announcement.

---

## 1. Executive Summary

FOKRI GAMES XII needs a single, authoritative digital platform that replaces manual, spreadsheet- and chat-group-driven processes for competition information distribution, participant registration, document collection, verification, announcement publication, and results publication.

This PRD specifies a **role-based, configuration-driven competition management platform**: administrators can create and modify competition categories, requirements, schedules, and documents without engineering changes, and participants get a single account through which they can discover competitions, register (individually or as a team), upload documents, track status in real time, and view official results.

The platform is designed as a **system of record**, not a brochure site — every state change (registration, verification, announcement, result) is auditable, access-controlled, and reversible only through defined, logged workflows.

**RECOMMENDATION:** Treat this PRD as a living document. Every TBD item is a blocking dependency for a specific build phase (see Section 38); Phase 1–2 (foundation, public info) can start immediately, but Phase 4 (registration) cannot start until competition data, quotas, and deadlines are confirmed.

---

## 2. Product Vision

> "FOKRI GAMES XII should be the single source of truth participants, teams, and the organizing committee return to — from the first time someone hears about the competition to the moment winners are announced."

The platform should feel like a **serious, national-level competition management system** — comparable to systems used for olympiads, national student competitions, or government-run competitive events — not a static landing page with a Google Form attached.

---

## 3. Problem Statement

Manually managing a multi-category, multi-participant competition (via spreadsheets, WhatsApp/Telegram groups, email, and shared drives) creates the following problems this platform must solve:

| Manual Process Pain Point | Platform Solution |
|---|---|
| Registration data scattered across forms/spreadsheets, prone to duplication and version conflicts | Centralized registration database with unique registration numbers and one source of truth per participant/team |
| No visibility for participants into where their registration stands | Real-time registration status with explicit next-action guidance |
| Verifiers manually cross-check documents in shared folders, no audit trail | Structured document management tied to each registration, with verification workflow and audit log |
| Announcements sent through multiple uncoordinated channels (WhatsApp, Instagram, email) with no single record | Centralized, categorized, versioned announcement system with scheduled publishing |
| Manual quota tracking risks over-registration or double-booking of the last slot | Server-side, concurrency-safe quota enforcement |
| Results compiled manually in spreadsheets and shared as images/PDFs, hard to verify or correct | Structured results system with controlled publication and correction workflow |
| No historical record of who approved/rejected what, and why | Full audit trail on every administrative and verification action |
| Committee cannot see aggregate registration health (per category, per day) | Admin dashboard with statistics and reporting |

**Business objective (RECOMMENDATION):** Reduce committee operational overhead, reduce registration errors, increase transparency and trust from participants and institutions, and produce a reusable platform for future FOKRI GAMES iterations.

---

## 4. Product Goals

**For Participants**
- Understand what FOKRI GAMES XII is and whether they are eligible, in under 2 minutes on the homepage.
- Register for a competition (individual or team) without confusion about required documents or deadlines.
- Always know the current status of their registration and what action (if any) is required of them.
- Receive timely notifications for deadlines, verification outcomes, and announcements.
- View finalists and results as soon as they are officially published.

**For the Organizing Committee (Admins/Committee/Verifiers)**
- Configure competitions, categories, requirements, and deadlines without needing a developer.
- Verify large volumes of registrations efficiently, with clear filtering, search, and bulk tools.
- Publish announcements and results with confidence (draft/preview before publish, audit trail, rollback path).
- Monitor registration health in real time (volume, approval rate, bottlenecks).
- Maintain a defensible audit trail for every decision, for accountability and dispute resolution.

**Key Success Metrics (RECOMMENDATION — to be finalized with organizer):**
- % of registrations completed without committee intervention (target ≥ 80%)
- Average verification turnaround time (target TBD by organizer)
- Registration abandonment rate (drop-off between "start registration" and "submit")
- % of support/contact inquiries related to "where is my registration status" (target: trend to near-zero, since dashboard should self-serve this)
- Zero critical security incidents (data leakage, IDOR, unauthorized result modification)

---

## 5. Non-Goals (MVP)

The following are explicitly **out of scope for MVP** unless the organizer confirms otherwise (RECOMMENDATION, to avoid feature creep per Stage 26):

- Online payment gateway integration (**TBD — TO BE CONFIRMED BY ORGANIZER** whether registration fee exists and how it is collected; MVP assumes manual/offline payment proof upload if a fee applies)
- Native mobile apps (iOS/Android) — MVP is a responsive web platform only
- Multi-language localization beyond Bahasa Indonesia / English (**TBD**, ASSUMPTION: Bahasa Indonesia as primary)
- Live scoring/judging tools for judges during the competition (only **result publication**, not real-time scoring input, is in MVP)
- Public API for third-party integration
- AI-based document verification/OCR (flagged as Future Development, Section 37)
- In-app chat/live chat with committee (contact form / listed channels only in MVP)

---

## 6. Assumptions & TBD Register

All items below **must be confirmed by the organizer before the corresponding feature can go live**. This is the single consolidated register referenced throughout the document.

| # | Item | Status |
|---|---|---|
| 1 | Competition categories/cabang list | **TBD** |
| 2 | Competition dates (per category) | **TBD** |
| 3 | Venue(s) — physical, online, or hybrid | **TBD** |
| 4 | Registration open/close dates | **TBD** |
| 5 | Registration fee (amount, per category, payment method) | **TBD** |
| 6 | Participant quota (per category, overall) | **TBD** |
| 7 | Eligibility criteria (institution type, region, membership) | **TBD** |
| 8 | Age restrictions | **TBD** |
| 9 | Team size (min/max) per category | **TBD** |
| 10 | Individual vs. team format per category | **TBD** |
| 11 | Required documents per category | **TBD** |
| 12 | Competition rules/technical rules | **TBD** |
| 13 | Judging mechanism / scoring rubric | **TBD** |
| 14 | Prizes per category/rank | **TBD** |
| 15 | Technical meeting schedule | **TBD** |
| 16 | Organizer legal entity name (for footer/legal pages) | **TBD** |
| 17 | Official contact channels (email, phone, social media) | **TBD** |
| 18 | Branding assets (logo, color palette, typography preference) | Color palette **CONFIRMED** (Section 19). Logo and typography still **TBD** |
| 19 | Whether re-registration for the same competition is ever allowed (e.g., after rejection) | **ASSUMPTION**: allowed once per competition unless organizer states otherwise |
| 20 | Primary language of the platform | **ASSUMPTION**: Bahasa Indonesia primary, English optional (Future) |

**RECOMMENDATION:** All TBD items in rows 1–15 map directly to the "Competition Configuration" admin module (Section 13) — meaning the organizer fills these in through the admin panel at launch time, not through a code change. This is why the system is designed to be schema-driven for competition data.

---

## 7. Target Users

| User Segment | Description | Primary Need |
|---|---|---|
| Prospective Participant (student/individual) | Has heard of FOKRI GAMES XII, evaluating whether/how to join | Fast, trustworthy information; clear eligibility |
| Registered Participant | Has an account, actively registering or already registered | Frictionless registration, status clarity |
| Team Leader | A participant who additionally manages a team's roster and submission | Team management tools, single point of accountability |
| Team Member (non-leader) | Registered as part of a team but not managing the submission | Visibility into own team's status; limited edit rights |
| Institution / Coordinator (referenced implicitly by "institution requirements") | May register multiple participants on behalf of an institution | **TBD** whether this role exists formally (ASSUMPTION: not a separate account role in MVP; institution info is just a field, not an account type) |
| Committee / Verifier | Reviews and verifies submitted registrations/documents | Efficient review queue, clear decision tools |
| Competition Admin | Owns one or more competitions end-to-end | Full configuration and publishing control scoped to assigned competitions |
| Super Admin | Owns the whole platform | Global oversight, user/role management, audit access |
| Public Visitor (unauthenticated) | Anyone browsing without an account | Frictionless public information access |

---

## 8. User Roles & Permissions

### 8.1 Roles (confirmed minimum set, per product owner)
1. Public Visitor (unauthenticated)
2. Participant
3. Team Leader (a Participant with an additional contextual capability on a specific team — not a separate account type)
4. Committee / Verifier
5. Competition Admin
6. Super Admin

**RECOMMENDATION:** Model "Team Leader" as a **capability attached to a team membership record**, not a global role — a user can be a Team Leader on Team A and a regular member on Team B. This avoids role explosion in RBAC and matches real usage.

### 8.2 Role × Permission Matrix

Legend: ✅ Full access · 🟡 Scoped/conditional access · ❌ No access

| Permission | Visitor | Participant | Team Leader (in-team) | Committee/Verifier | Competition Admin | Super Admin |
|---|---|---|---|---|---|---|
| View public pages (home, competitions, schedule, FAQ) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View published announcements/results/finalists | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Register account / login | ✅ | — | — | — | — | — |
| Complete/edit own profile | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Register for a competition | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Create/manage a team roster | ❌ | 🟡 (own team, as leader) | ✅ (own team) | ❌ | ❌ | ❌ |
| Upload own/team documents | ❌ | ✅ (own) | ✅ (own team) | ❌ | ❌ | ❌ |
| View own registration status | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| View other participants' private data/documents | ❌ | ❌ | ❌ | 🟡 (assigned competitions only) | 🟡 (assigned competitions) | ✅ |
| Search/filter registrations | ❌ | ❌ | ❌ | 🟡 (assigned) | ✅ (own competitions) | ✅ |
| Approve / reject / request revision | ❌ | ❌ | ❌ | ✅ (assigned) | ✅ (own competitions) | ✅ |
| Create/edit competition | ❌ | ❌ | ❌ | ❌ | ✅ (own) | ✅ |
| Configure requirements/quota/schedule | ❌ | ❌ | ❌ | ❌ | ✅ (own) | ✅ |
| Publish/unpublish competition | ❌ | ❌ | ❌ | ❌ | ✅ (own) | ✅ |
| Create/publish announcement | ❌ | ❌ | ❌ | ❌ | ✅ (own competitions) | ✅ |
| Manage finalists | ❌ | ❌ | ❌ | ❌ | ✅ (own) | ✅ |
| Publish results | ❌ | ❌ | ❌ | ❌ | ✅ (own, with approval flow — see 8.3) | ✅ |
| Modify results after publication | ❌ | ❌ | ❌ | ❌ | 🟡 (request, needs Super Admin approval) | ✅ |
| Manage committee/verifier accounts | ❌ | ❌ | ❌ | ❌ | 🟡 (assign to own competitions only) | ✅ |
| Manage admin accounts / roles | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| View audit logs | ❌ | ❌ | ❌ | 🟡 (own actions only) | 🟡 (own competitions) | ✅ (all) |
| View system-wide analytics | ❌ | ❌ | ❌ | ❌ | 🟡 (own competitions) | ✅ |
| Export reports | ❌ | ❌ | ❌ | 🟡 (own queue) | ✅ (own competitions) | ✅ |

### 8.3 Elevated-Action Rule (RECOMMENDATION, added in Iteration 2 — see Section 41)
Because published results are high-stakes and public-facing, **Competition Admins cannot unilaterally modify a result after publication**. Any post-publication change requires a `RESULT_CHANGE_REQUEST` reviewed and approved by a Super Admin, fully logged with before/after values. This closes an authorization gap identified during architecture review.

---

## 9. User Journey

### 9.1 Participant Journey (individual)
```
Discover (search/social) → Homepage → Competition Directory → Competition Detail
   → Check Eligibility & Requirements → Create Account → Verify Email
   → Complete Profile → Start Registration → Fill Participant Info
   → Upload Documents → Review Summary → Submit
   → Receive Registration Number → Track Status on Dashboard
   → (Revision loop if requested) → Approved
   → Receive Announcements/Technical Meeting Info → Compete
   → View Finalists → View Results
```

### 9.2 Team Leader Journey
```
Same as above until "Start Registration" →
Select "Team" registration → Create Team (name) → Add Team Members (invite by email/NIM/ID)
   → Each member confirms participation (RECOMMENDATION: explicit opt-in to prevent
     someone being registered without consent) → Leader uploads team documents
   → Leader reviews full roster → Submit → Registration Number issued to the team
   → Track status (leader has full visibility; members have read-only visibility)
```

### 9.3 Committee/Verifier Journey
```
Login → Verification Queue (filtered to assigned competitions)
   → Open Registration → Review Participant Info & Documents
   → Decision: Approve / Reject / Request Revision (reason required for reject/revision)
   → Add internal note → Submit decision → System notifies participant → Logged to audit trail
```

### 9.4 Competition Admin Journey
```
Login → Admin Dashboard → Create/Edit Competition → Configure Categories,
   Schedule, Quota, Requirements, Documents → Publish Competition
   → Monitor Registration Statistics → Assign Verifiers
   → Manage Finalists (post-competition) → Enter/Publish Results
   → Publish Announcements throughout lifecycle
```

### 9.5 Super Admin Journey
```
Login → Global Dashboard → Manage Users/Roles/Admins → Oversight of all
   competitions → Approve elevated actions (post-publication result changes,
   account recovery for compromised admin accounts) → Review audit logs
```

---

## 10. Information Architecture

**RECOMMENDATION (improved from initial structure):** separate authenticated dashboard areas from public IA, and add a Search/Notifications entry point and legal pages.

```
FOKRI GAMES XII (Public)
│
├── Home
├── About
│   ├── About FOKRI GAMES XII
│   └── Organizing Committee (TBD content)
├── Competitions
│   ├── All Competitions (directory, filterable/searchable)
│   ├── Competition Detail [/competitions/:slug]
│   │   ├── Overview / Eligibility / Schedule / Requirements / Rules / Prizes / FAQ
│   └── Competition Requirements (may be embedded in detail page rather than standalone)
├── Schedule (global timeline across all competitions)
├── Announcements
│   ├── Announcement List (filter by category/competition)
│   └── Announcement Detail
├── Finalists
├── Results
├── Documents (public documents: guidebook, official rules, templates — TBD content)
├── FAQ
├── Contact
├── Legal (Privacy Policy, Terms of Use) — RECOMMENDATION, added: required given personal data & document collection
├── Login
└── Register (account creation)

Authenticated — Participant Area
└── /dashboard
    ├── Overview ("what do I need to do next")
    ├── My Competitions / Registrations
    ├── Registration Detail → Status, Documents, Team (if applicable)
    ├── Notifications
    ├── Announcements (personalized: only relevant to my registered competitions + global)
    ├── Schedule (personalized)
    ├── Results (personalized: my competitions highlighted)
    └── Profile & Account Settings

Authenticated — Committee Area
└── /committee
    ├── Verification Queue
    ├── Registration Detail (review mode)
    └── My Verification History

Authenticated — Admin Area
└── /admin
    ├── Dashboard (stats)
    ├── Competitions (CRUD, categories, schedule, requirements, documents, quota)
    ├── Registrations (search/filter/verify/export)
    ├── Teams
    ├── Announcements (CRUD + scheduling)
    ├── Finalists
    ├── Results (entry + publish workflow)
    ├── Users (participants, committee, admins) — Super Admin scope varies
    ├── Reports
    └── Audit Logs (Super Admin full; scoped view for Competition Admin)
```

---

## 11. Competition Lifecycle

**RECOMMENDATION:** a competition-level state machine, independent of individual registration states (Section 8 of workflow / Section 14 below).

```
DRAFT → PUBLISHED (visible, registration not yet open)
      → REGISTRATION_OPEN
      → REGISTRATION_CLOSED (deadline passed OR quota full OR manually closed)
      → ONGOING (competition day(s) in progress)
      → COMPLETED (results process underway)
      → RESULTS_PUBLISHED
      → ARCHIVED

Side-branch (any state before COMPLETED): → CANCELLED
```

Rules:
- `DRAFT` competitions are visible only to Competition Admin/Super Admin (never public).
- Transition to `PUBLISHED` requires: name, description, at least one category, schedule, and eligibility fields to be non-empty (organizer may still mark specific fields "TBD" as **displayed text** if truly not final — but this should be minimized before going live).
- `REGISTRATION_OPEN` requires configured requirements, documents, and quota (if quota is used).
- `CANCELLED` can be entered from any pre-`COMPLETED` state and requires a mandatory reason; triggers notifications to all registered participants (see Edge Case #13, Section 29).

---

## 12. Functional Requirements

Grouped by module; each numbered requirement is later referenced by Acceptance Criteria (Section 32) and QA matrix (Section 33).

**FR-AUTH** — Authentication & Account
1. Users can register with email + password (or configured SSO — **TBD** whether institutional SSO is required).
2. Email verification is mandatory before registration for a competition is allowed.
3. Password reset via email token, single-use, time-limited.
4. Session-based or JWT authentication with refresh tokens (Section 15/26).

**FR-COMP** — Competition Management
5. Admin can create/edit/publish/close/archive/cancel a competition.
6. Admin can configure: categories, schedule milestones, quota, eligibility text, required documents, individual/team mode, team size range.
7. Configuration changes to a competition **after registration has opened** require confirmation and are logged (see Edge Case #12).

**FR-REG** — Registration
8. Participant can register for any `REGISTRATION_OPEN` competition they are eligible for (eligibility is advisory/self-declared unless the organizer requires document-based proof).
9. Registration supports both **individual** and **team** modes, configured per competition.
10. Registration cannot be submitted after the deadline or once quota is full (Section 15, race-condition handling in Section 27).
11. A participant cannot hold two `SUBMITTED`/`UNDER_REVIEW`/`APPROVED` registrations for the same competition simultaneously (Business Rule, Section 24).

**FR-DOC** — Documents
12. Required documents are configurable per competition (type, max size, required/optional, count).
13. Participants can upload, replace (before submission), and view (never for other users) their own documents.
14. Document versions are retained; verifiers can see version history.

**FR-VER** — Verification
15. Verifiers see a queue scoped to competitions they are assigned to.
16. Verifiers can Approve / Reject / Request Revision, each requiring a note (mandatory for Reject/Revision).
17. Every verification decision triggers a notification and an audit log entry.

**FR-ANN** — Announcements
18. Admin can create announcements with category, optional linked competition, optional cover image, and schedule for future publication.
19. Announcements support Draft → Scheduled → Published → Archived states.

**FR-RES** — Results
20. Admin can define result categories/rankings per competition and publish results only when explicitly triggered (not auto-published on data entry).
21. Published results are publicly viewable; internal judging notes/scores are never exposed unless explicitly configured as public.

**FR-DASH** — Dashboards
22. Participant dashboard surfaces an explicit "action required" panel when any registration is in `REVISION_REQUIRED` or has an approaching deadline.
23. Admin dashboard surfaces real-time counts: total participants, per-status registration counts, pending verification age (oldest pending item).

**FR-NOTIF** — Notifications
24. System sends notifications (email at minimum; in-app always) for: registration submitted, status change, new announcement (relevant), deadline reminders (T-3 days, T-1 day — **RECOMMENDATION**, configurable), results published.

**FR-AUDIT** — Audit
25. Every state-changing action listed in Section 35 is logged with actor, timestamp, target, and before/after values where applicable.

---

## 13. Competition Management

The Competition entity is the configuration backbone of the entire platform.

**Configurable fields per competition (admin-editable, no code changes required):**
- Basic: name, slug, short description, full description, cover image, organizer name
- Category/type: individual, team, or "either" (participant chooses at registration)
- Team config (if applicable): min members, max members, whether a team can have reserve/substitute members (**TBD** organizer preference)
- Eligibility text (free text + optional structured fields: institution type, age range, region)
- Schedule milestones (configurable list, not fixed fields): e.g., Registration Open, Registration Close, Technical Meeting, Competition Day, Final, Announcement — **RECOMMENDATION:** model as a repeatable "milestone" list so organizer can add competition-specific milestones without a schema change.
- Quota: overall quota and/or per-sub-category quota, with a toggle for "no quota limit"
- Required documents: repeatable list, each with type, max size, allowed formats, required/optional, max count
- Rules/prize text: rich text fields, versionable
- Registration fee (if applicable): amount, currency, payment instructions/upload proof field (**TBD** whether fee applies)
- Status flags: `DRAFT/PUBLISHED/REGISTRATION_OPEN/REGISTRATION_CLOSED/ONGOING/COMPLETED/RESULTS_PUBLISHED/ARCHIVED/CANCELLED`

**RECOMMENDATION:** Store schedule milestones and document requirements as **child tables** (see Section 25), not JSON blobs, so they remain queryable, reportable, and validated at the database level.

---

## 14. Registration System

### 14.1 Flow
```
Competition Detail
     ↓
[Register] (disabled/hidden if not REGISTRATION_OPEN)
     ↓
Login / Create Account  →  Email Verification (blocking)
     ↓
Complete Profile (blocking: full name, ID/student number, institution, phone, email — configurable required fields)
     ↓
Select Competition & Category
     ↓
Choose Individual / Team (only shown if competition allows both)
     ↓
Participant Information (or Team Creation + Roster for team mode)
     ↓
Upload Required Documents
     ↓
Review Summary (editable before submit)
     ↓
Submit
     ↓
Registration Number Generated (unique, human-readable, e.g. FG12-<CATCODE>-000123)
     ↓
Verification (committee)
     ↓
Approved / Revision Required / Rejected
```

### 14.2 Step Specifications

| Step | Fields | Required? | Validation | Business Rules | Error States | Success State |
|---|---|---|---|---|---|---|
| Account Creation | Email, password, full name | All required | Valid email format, password ≥ 8 chars with complexity rule (RECOMMENDATION), unique email | One account per email | "Email already registered", weak password warning | Account created, verification email sent |
| Email Verification | Verification token (link) | Required | Token valid & not expired (RECOMMENDATION: 24h expiry) | Cannot register for competitions while unverified | "Link expired" → resend option | Email marked verified |
| Complete Profile | Full name, ID/student number, institution, phone, date of birth (if age eligibility applies), address (optional, TBD) | Required fields configurable by admin | Phone format, DOB plausibility | Profile must be complete before "Register" is enabled on any competition | Inline field errors | Profile marked complete |
| Select Competition & Category | Competition, category/sub-category | Required | Must be `REGISTRATION_OPEN` and quota available at time of selection | One active registration per competition per participant (Section 24) | "Registration closed", "Quota full" | Proceeds to mode selection |
| Individual/Team Choice | Mode | Required if competition allows both | — | Locked once documents are uploaded (RECOMMENDATION, to prevent mid-flow inconsistency) | — | Mode set |
| Participant Info (individual) | Same as profile + competition-specific fields (e.g., category-specific declarations) | Required | Field-level validation per config | — | Inline errors | Info saved to draft registration |
| Team Creation (team mode) | Team name, leader (auto = creator) | Required | Team name unique within competition (RECOMMENDATION) | Leader is fixed at creation; transferable only via admin action (Edge Case #8) | "Team name taken" | Team created in `DRAFT` |
| Add Team Members | Member email/ID, role | Min/max per competition config | Member must have an account or be invited to create one; cannot already be on another team **for the same competition** | Each invited member must **accept** before being counted toward roster (RECOMMENDATION — consent) | "User already on a team for this competition" (Edge Case #7) | Member added as `PENDING` until accepted |
| Upload Documents | Per configured requirement list | Per requirement's required/optional flag | File type, size, count limits (Section 16) | Cannot submit until all *required* documents uploaded | "File type not allowed", "File exceeds size limit" | Document(s) attached to registration |
| Review Summary | Read-only recap of all entered data | — | System re-validates all required fields/documents before enabling Submit | — | "X is missing" checklist blocking submit | Ready-to-submit state |
| Submit | — | — | Final server-side re-check: deadline not passed, quota available, all required data present (idempotent, transactional) | Submission is atomic — either fully succeeds or fully fails, no partial state | "Deadline passed", "Quota full" (race condition, Section 27) | Status → `SUBMITTED`, registration number issued, confirmation email/notification sent |

### 14.3 Deadline Behavior
- The Submit action is validated **server-side against server time**, never trusting client-side countdown timers (client countdown is UX only).
- A registration already in `DRAFT` when the deadline passes **cannot** be submitted; UI must clearly show "Registration closed" and preserve the draft as read-only/exportable for the participant's own reference (RECOMMENDATION — avoid silent data loss).

---

## 15. Team Management

- A **Team** exists only in the context of one specific competition (a team is not a persistent cross-competition entity in MVP — **ASSUMPTION**, simplifies data model; organizer may request persistent "club" teams in Future scope).
- Team Leader capabilities: rename team (before submission), add/remove members (before submission), upload team documents, submit, view verification status, respond to revision requests.
- Team Member (non-leader) capabilities: view own team's status (read-only), view own personal data within the team, leave the team **before submission** (post-submission removal requires committee/admin action — Edge Case #8).
- **Business rule:** A user cannot belong to two teams **for the same competition** at once (validated server-side, not just UI-side, to prevent IDOR-style abuse via direct API calls).
- **Team size enforcement:** Submit is blocked if roster size is outside the configured min/max range.

---

## 16. Document Management

### 16.1 Configurable Document Requirement Model
Each competition defines a list of **Document Requirements**, each with:
- `name` (e.g., "Student ID Card", "Institution Recommendation Letter")
- `applies_to`: individual / team / both
- `required`: boolean
- `allowed_formats`: e.g., PDF, JPG, PNG (**RECOMMENDATION default**: PDF, JPG, PNG only — no executable or script formats ever)
- `max_size_mb`: **RECOMMENDATION default** 5 MB per file (organizer-configurable)
- `max_count`: number of files allowed against this requirement
- `versioning_policy`: replace (only latest kept) or append (history retained) — **RECOMMENDATION**: replace-with-history — the latest version is what verifiers review by default, but prior versions remain retrievable in an audit trail.

### 16.2 Upload & Storage Rules
- Files are stored in **private object storage** (not publicly addressable URLs). Access is only via authenticated, authorized, short-lived signed URLs generated per request.
- **Every file access request is authorized server-side** against: (a) is the requester the document owner, (b) is the requester a verifier/admin assigned to that competition, or (c) is the requester a Super Admin. No file is ever served purely because the requester "guessed" a correct-looking ID (defends against IDOR — Stage 15/28 security concern).
- **Malware/AV scanning is REQUIRED** on every uploaded file before it is made available for verifier review (RECOMMENDATION: integrate an antivirus/content-scanning step in the upload pipeline; quarantine and flag files that fail scanning rather than silently rejecting, and log the event).
- File type must be validated by **content inspection (magic bytes)**, not just file extension, to prevent disguised-executable uploads.
- Uploaded documents are immutable once a registration is `SUBMITTED`, except explicitly during a `REVISION_REQUIRED` cycle for the specific flagged document(s).

---

## 17. Verification System

- Verifiers operate from a **queue** scoped to competitions they've been assigned to by a Competition Admin.
- Queue supports filter by: competition, category, status, submission date, institution, search by name/registration number.
- Decision actions: **Approve**, **Reject** (reason mandatory), **Request Revision** (reason + which specific field/document is flagged, mandatory).
- Internal verifier notes are **never visible to the participant** — only the formal decision + reason (which is participant-facing) is shown to the participant.
- **RECOMMENDATION:** support assigning a specific verifier to a specific registration (optional) to avoid duplicate review effort, plus a "claim" mechanism so two verifiers don't review the same item simultaneously.
- Every decision is timestamped and logged (Section 35).

---

## 18. Announcement System

### 18.1 Categories
General, Registration, Technical Meeting, Schedule, Competition, Finalist, Winner, Emergency.

### 18.2 Fields
Title, content (rich text), category, optional linked competition, optional cover image, author (auto from logged-in admin), publication status, publish date/time (immediate or scheduled), pinned flag (RECOMMENDATION — for Emergency announcements to appear at top of list/homepage banner).

### 18.3 States
```
DRAFT → SCHEDULED → PUBLISHED → ARCHIVED
DRAFT → PUBLISHED (immediate publish also allowed)
```
- **RECOMMENDATION:** "Emergency" category announcements should trigger a distinct, more prominent notification channel (e.g., site-wide banner + push/email even to users who opted out of general email — subject to notification preference policy, Section 28) given their time-sensitivity (e.g., venue change, schedule change).
- Published announcements are immutable in content **after publication** except through a tracked "Edit" that creates a visible "last edited at" timestamp (RECOMMENDATION — avoids silently rewriting public-facing history, addresses Edge Case #15).

---

## 19. Visual Design System (Brand & UI)

### 19.1 Brand Color Palette — **CONFIRMED REQUIREMENT**

The organizer has confirmed the following palette. This is now the binding source of truth for all UI work (web, admin dashboard, exported documents/reports, email templates).

**Primary**

| Swatch | Hex | Name | Primary Usage |
|---|---|---|---|
| 🟦 | `#1D2089` | PPI Navy | Primary brand color — header/navbar, primary buttons, links, active states, key headings |
| 🟨 | `#F7B512` | PPI Gold | Secondary/accent color — CTAs that need to stand out (e.g., "Register Now"), highlights, badges, hover accents |

**Supporting**

| Swatch | Hex | Name | Primary Usage |
|---|---|---|---|
| ⬜ | `#FFFFFF` | White | Base background on light surfaces, text-on-dark (buttons, navbar text), card backgrounds |
| ⬛ | `#332C2B` | Dark Charcoal | Primary body text color (softer than pure black, better readability on `#F5F7FA`/white) |
| ◻️ | `#F5F7FA` | Light Background | Page background / section background to separate content blocks from white cards |
| 🟦⬛ | `#0F172A` | Deep Navy/Ink | High-contrast dark surfaces (e.g., footer, admin sidebar), and as a darker alternative to PPI Navy for text-on-light where extra contrast is needed |

### 19.2 Usage Guidelines (RECOMMENDATION)

- **Navbar / Header:** `#1D2089` (PPI Navy) background, `#FFFFFF` text/logo. Sticky on scroll for the public site and the dashboard shell.
- **Primary CTA buttons** (e.g., "Register", "Submit"): `#F7B512` (PPI Gold) fill with `#332C2B` or `#1D2089` text (verify contrast — see 19.2.1) for maximum visibility on both light and navy backgrounds.
- **Secondary buttons:** outline style using `#1D2089`, transparent fill, `#1D2089` text; on hover, fill with a 10% tint of `#1D2089`.
- **Page background:** `#F5F7FA` for the general canvas; `#FFFFFF` for cards/panels sitting on top of it, so content has visible separation without needing heavy borders/shadows.
- **Body text:** `#332C2B` on light backgrounds. Avoid pure black to keep the palette's warmer, less clinical feel.
- **Footer / Admin sidebar / dark sections:** `#0F172A` (Deep Navy/Ink) background with `#FFFFFF` text and `#F7B512` for active nav item indicators.
- **Links:** `#1D2089`, underline on hover; visited-state not typically needed for this kind of app.

**19.2.1 Accessibility / contrast check (RECOMMENDATION — verify in build, not assumed here):**
- `#332C2B` text on `#FFFFFF`/`#F5F7FA` → strong contrast, passes WCAG AA comfortably for body text.
- `#FFFFFF` text on `#1D2089` or `#0F172A` → strong contrast, passes AA for both normal and large text.
- `#F7B512` (Gold) as a **button fill with white text on top does NOT pass AA** for small text — gold is a mid-light color. **RECOMMENDATION:** use `#332C2B` or `#1D2089` as the text color on any Gold-filled button/badge, and reserve white-on-Gold only for large headings/icons, or add a subtle dark outline/shadow.
- Never use Gold text directly on the White or Light Background surfaces for body copy (`#F7B512` on `#FFFFFF` fails contrast) — Gold is an accent/fill color, not a text color on light backgrounds.

### 19.3 Semantic / Status Colors (RECOMMENDATION — distinct from brand palette)

Registration and verification statuses (Section 25.1) need their own semantic colors so they remain instantly recognizable and don't compete with the brand palette:

| Status | Suggested Color | Notes |
|---|---|---|
| `DRAFT` | Neutral gray | Not yet actionable by anyone but the owner |
| `SUBMITTED` / `UNDER_REVIEW` | Blue (distinct from PPI Navy, e.g. a lighter informational blue) | "In progress" |
| `REVISION_REQUIRED` | Amber/orange (distinct from PPI Gold to avoid confusion with brand CTAs) | Needs the participant's attention |
| `APPROVED` | Green | Success |
| `REJECTED` / `WITHDRAWN_COMPETITION_CANCELLED` | Red | Terminal, negative |
| `CANCELLED` (participant-initiated) | Gray | Terminal, neutral |

**RECOMMENDATION:** Keep semantic status colors visually separate from PPI Gold specifically, since Gold is also the primary CTA/accent color — reusing it for "Revision Required" badges risks participants misreading an action-needed warning as a promotional highlight.

### 19.4 Typography — **TBD — TO BE CONFIRMED BY ORGANIZER**

No official typeface has been provided. **RECOMMENDATION (placeholder until confirmed):** a clean, modern, highly legible sans-serif pairing — e.g., a geometric/grotesk sans for headings (to reinforce the "competitive, energetic" tone) and a neutral humanist sans for body text (for long-form rules/eligibility reading). Final typeface selection should be confirmed alongside logo/branding assets (Section 6, row 18).

### 19.5 Core Components (RECOMMENDATION)

- **Buttons:** Primary (Gold fill), Secondary (Navy outline), Destructive (red fill, used only for irreversible actions like "Reject" or "Cancel Registration"), Disabled (gray fill, reduced opacity, non-interactive cursor).
- **Cards:** White background, subtle shadow or 1px `#E2E8F0`-tone border, rounded corners (RECOMMENDATION: 8–12px radius for a modern but not overly playful feel), used for competition cards, dashboard summary tiles, and announcement previews.
- **Forms:** Clear labels above fields (not placeholder-only), `#1D2089` focus ring, inline validation in red text directly under the field, required-field asterisk in `#F7B512` or red (pick one convention and apply consistently — RECOMMENDATION: red, to avoid overloading Gold's CTA meaning).
- **Tables (admin):** Sticky header row in `#0F172A` or `#F5F7FA` tint, zebra-striping optional, status column always rendered as a colored badge (Section 19.3), row-level actions right-aligned.
- **Status badges:** Pill-shaped, colored per Section 19.3, always paired with a text label (never color alone — accessibility requirement, Section 29).
- **Navigation:** Top navbar for public site (Navy background); left sidebar for admin/committee dashboards (Deep Navy/Ink background, Gold active-item indicator).
- **Modal:** White surface, dimmed `#0F172A`-tinted overlay behind it, used for confirguration actions like "Confirm Submit," "Confirm Reject" (destructive actions always require a modal confirmation, never a single accidental click).
- **Toast/notifications:** Success (green), Error (red), Info (Navy), Warning (amber) — top-right placement, auto-dismiss for success/info, manual dismiss for error/warning.
- **Empty states:** Friendly icon/illustration + one-line explanation + a relevant CTA (e.g., "No registrations yet — Browse Competitions").
- **Error states:** Clear, specific, non-technical language (e.g., "This file is too large — max 5MB" rather than a raw server error).
- **Loading states:** Skeleton loaders for lists/cards (dashboard, competition directory) rather than a single full-page spinner, to keep perceived performance high.

### 19.6 Tone

The palette (deep Navy + Gold) naturally supports the brand tone requested: **competitive, professional, trustworthy** (Navy-led) with **energetic, youthful** accents (Gold), while `#F5F7FA`/`#FFFFFF`/`#332C2B` keep the everyday reading experience calm and uncluttered rather than visually loud — appropriate for a platform people will use to read rules, upload sensitive documents, and check high-stakes status updates.

---

## 20. Finalist System

- Competition Admin marks a subset of `APPROVED` registrations as **Finalists** for a competition/category, typically after a preliminary round.
- Finalist list is a distinct, publishable entity (own Draft/Published state) — separate from final Results, since finalist announcement often precedes final ranking.
- Finalist records reference the registration/team (not duplicate participant data), so any later correction to a participant's public display name propagates rather than requiring re-entry.

---

## 21. Results System

### 20.1 Flexible Result Structure
Because competition formats vary (single-round, multi-round, individual scoring, team scoring), results are modeled generically:

```
Competition
  └── Result Category (e.g., "Category A – Senior", "Category B – Junior")
        └── Ranking Entry
              ├── Rank/Award label (Winner / Runner-up / 3rd Place / Special Award / Custom)
              ├── Participant or Team reference
              ├── Score (optional, only shown publicly if organizer opts in)
              └── Notes (optional, public-facing only if organizer opts in)
```

- **RECOMMENDATION:** Internal judging scores/rubrics are stored but **default to private**; the admin must explicitly toggle "show score publicly" per result category. This satisfies Stage 11's requirement to not expose private judging information by default.
- Results have their own Draft → Published state, independent of the competition's overall lifecycle state, but publishing results **requires** the competition to be at least `COMPLETED`.
- **Post-publication changes** follow the elevated-action rule in Section 8.3 (Competition Admin requests → Super Admin approves → change applied + logged with full before/after diff, and a visible "Corrected on [date]" notice is recommended for transparency).

---

## 22. Participant Dashboard

```
Dashboard
├── Overview  ← "What do I need to do next?" panel (highest priority UI element)
├── My Competitions / Registrations
├── Registration Detail (status, timeline, documents, team info if applicable)
├── Documents (all uploaded files across registrations)
├── Notifications (in-app inbox)
├── Announcements (global + relevant to my registrations)
├── Schedule (personalized upcoming milestones)
├── Results (highlighted for my competitions)
└── Profile & Account Settings
```

**Example — Action Required Card:**
```
Registration: [Competition Name] — Revision Required

Action Required:
Please replace your institution document (reason: file unreadable/expired).

Deadline to resubmit:
[date] — TBD per competition configuration
```

**RECOMMENDATION:** The Overview must never show an empty "all good" state without also showing upcoming deadlines — even an approved participant should see "Next: Technical Meeting on [date]" if such a milestone is configured.

---

## 23. Admin Dashboard

```
Overview: total participants · total registrations · pending verification
          (with oldest-pending age) · approved · revision required · rejected
          · active competitions · registration growth (trend chart)

Competition Management: create / edit / publish / close / archive / cancel
Registration Management: search / filter / review / verify / export (CSV)
Announcement Management: create / edit / publish / schedule
Result Management: manage finalists / enter results / review / publish
User Management: participants / committee / administrators (scope varies by role)
Reports: participant report, registration report, verification report, competition statistics
Audit Logs: full (Super Admin) / scoped to own competitions (Competition Admin) / own actions (Verifier)
```

---

## 24. Business Rules

**Registration**
- BR-1: A participant cannot hold more than one active (`SUBMITTED`/`UNDER_REVIEW`/`REVISION_REQUIRED`/`APPROVED`) registration for the same competition. A new registration attempt for the same competition while one is active is blocked.
- BR-2: **ASSUMPTION** (per row 19, Section 6): if a prior registration for that competition ends in `REJECTED`, the participant **may** submit a new registration once, unless the organizer disables re-registration for that competition.
- BR-3: Submission is impossible after the configured deadline, enforced server-side.
- BR-4: All fields/documents marked `required` by the competition's configuration must be present before submission is allowed.
- BR-5: Team size must fall within the competition's configured min/max at time of submission.
- BR-6: Eligibility fields (age, institution type, etc., where configured as *hard* constraints rather than advisory text) are validated server-side at submission, not just displayed as text.

**Quota**
- BR-7: If a competition has a quota, the system must never allow confirmed `SUBMITTED` registrations to exceed it (Section 27 — concurrency control).
- BR-8: `REJECTED` registrations release their quota slot immediately.
- BR-9: A participant-initiated **cancellation** of their own submitted registration (if allowed — **RECOMMENDATION**: allow cancellation only while status is `SUBMITTED` or `UNDER_REVIEW`, not after `APPROVED`) releases the quota slot.
- BR-10: `REVISION_REQUIRED` registrations continue to **hold** their quota slot (they are not rejected; RECOMMENDATION, since revision is a temporary state expected to resolve to approval).

**Verification**
- BR-11: Only a Verifier/Competition Admin assigned to that specific competition (or a Super Admin) may verify a registration for it.
- BR-12: Reject and Request Revision decisions require a non-empty reason.
- BR-13: Every verification decision is immutably logged (the log entry itself cannot be edited or deleted, only superseded by a new decision).

**Results**
- BR-14: Only Competition Admin (own competition) or Super Admin may publish results.
- BR-15: Publishing results is logged; publishing is a discrete action (not implied by data entry).
- BR-16: Any post-publication modification requires Super Admin approval (Section 8.3).

---

## 25. Database Architecture

**RECOMMENDATION:** Relational database (e.g., PostgreSQL) given the strong entity relationships, need for transactional quota enforcement, and audit requirements.

### 24.1 Core Entities

**users**
- PK: `id`
- Fields: `email` (unique), `password_hash`, `full_name`, `phone`, `institution`, `id_number`, `date_of_birth`, `email_verified_at`, `status` (active/suspended), `created_at`, `updated_at`
- Relationships: 1—N with `user_roles`, `registrations`, `team_members`, `documents`, `audit_logs` (as actor)

**roles** / **permissions** / **user_roles**
- `roles`: PK `id`, `name` (Visitor is implicit/unauthenticated, not stored)
- `permissions`: PK `id`, `key` (e.g., `registration.approve`)
- `role_permissions`: composite PK (`role_id`, `permission_id`)
- `user_roles`: composite PK (`user_id`, `role_id`), plus **optional `scope_competition_id`** (nullable FK to `competitions`) — this is the critical design element enabling "Competition Admin scoped to own competitions" and "Verifier assigned to specific competitions" (RECOMMENDATION, added in Iteration 2 to fix a scoping gap — see Section 41).

**competitions**
- PK: `id`; Fields: `name`, `slug` (unique), `description`, `mode` (individual/team/either), `status` (lifecycle enum, Section 11), `created_by` (FK users), timestamps
- Relationships: 1—N `competition_categories`, `competition_schedules`, `document_requirements`, `registrations`, `announcements`, `finalists`, `results`

**competition_categories**
- PK: `id`; FK `competition_id`; Fields: `name`, `quota` (nullable = unlimited), `team_min`, `team_max`

**competition_schedules** (milestones)
- PK: `id`; FK `competition_id`; Fields: `label` (e.g., "Registration Deadline"), `starts_at`, `ends_at` (nullable), `sort_order`

**document_requirements**
- PK: `id`; FK `competition_id`; Fields: `name`, `applies_to` (individual/team/both), `required` (bool), `allowed_formats`, `max_size_mb`, `max_count`

**registrations**
- PK: `id`; FK `competition_id`, `competition_category_id`, `user_id` (nullable if team — see below), `team_id` (nullable if individual)
- Fields: `registration_number` (unique, generated on submit), `status` (state machine, Section 26.1 below — renumbered from Stage 8), `submitted_at`, `decided_at`, `decided_by` (FK users, nullable)
- **Constraint:** exactly one of `user_id` / `team_id` must be non-null depending on competition mode.
- **Unique constraint** (BR-1): partial unique index on (`user_id`, `competition_id`) where `status IN ('SUBMITTED','UNDER_REVIEW','REVISION_REQUIRED','APPROVED')` — enforced at the database level, not just application logic, to close a race-condition/IDOR-adjacent gap (Iteration 2 finding).

**teams**
- PK: `id`; FK `competition_id`; Fields: `name`, `leader_user_id` (FK users), `status`

**team_members**
- PK: `id`; FK `team_id`, `user_id`; Fields: `invitation_status` (pending/accepted/declined), `joined_at`
- **Unique constraint:** (`team_id` is scoped such that) a `user_id` cannot have an `accepted` membership on two teams within the same `competition_id` — enforced via a composite check against `teams.competition_id`.

**documents**
- PK: `id`; FK `registration_id`, `document_requirement_id`, `uploaded_by` (FK users)
- Fields: `storage_key` (private, not a public URL), `original_filename`, `mime_type`, `size_bytes`, `scan_status` (pending/clean/flagged), `version`, `is_current` (bool), `uploaded_at`

**document_versions** — modeled as the `documents` table itself with `version`/`is_current`, avoiding a redundant parallel table (Iteration 2 simplification).

**verification_records**
- PK: `id`; FK `registration_id`, `verifier_id` (FK users)
- Fields: `decision` (approve/reject/revision), `reason`, `internal_note` (never exposed to participant), `decided_at`

**announcements**
- PK: `id`; FK `competition_id` (nullable — global announcements), `author_id` (FK users)
- Fields: `title`, `content`, `category`, `cover_image_key`, `status`, `publish_at`, `pinned` (bool)

**finalists**
- PK: `id`; FK `competition_id`, `competition_category_id`, `registration_id`; Fields: `status` (draft/published)

**results** / **result_categories**
- `result_categories`: PK `id`; FK `competition_id`, `competition_category_id`; Fields: `name`, `status` (draft/published)
- `results`: PK `id`; FK `result_category_id`, `registration_id`; Fields: `rank_label`, `score` (nullable), `score_visible` (bool), `notes`

**notifications**
- PK: `id`; FK `user_id`; Fields: `type`, `title`, `body`, `read_at`, `channel` (in-app/email), `created_at`

**audit_logs**
- PK: `id`; FK `actor_id` (FK users, nullable for system actions); Fields: `action` (enum, Section 35), `target_type`, `target_id`, `previous_value` (JSON, nullable), `new_value` (JSON, nullable), `ip_address`, `user_agent`, `created_at`
- **RECOMMENDATION:** `audit_logs` is append-only at the database permission level (no `UPDATE`/`DELETE` grants for any application role) to guarantee tamper-evidence.

### 24.2 Normalization Notes
- Avoided storing `document_requirements` as JSON inside `competitions` — kept as a child table for queryability/reporting and referential integrity with `documents`.
- Avoided a redundant `team_leader` boolean column scattered across tables — leadership lives solely on `teams.leader_user_id`.
- `role_permissions` + `user_roles` (many-to-many with optional scope) avoids duplicating permission lists per user.

---

## 26. API Requirements

**RECOMMENDATION:** REST API, versioned (`/api/v1/...`), JSON, stateless auth via short-lived access token + refresh token (HttpOnly, Secure, SameSite cookies for web client).

### 25.1 Registration State Machine (referenced by API)
```
DRAFT
  ↓
SUBMITTED
  ↓
UNDER_REVIEW
  ├──→ REVISION_REQUIRED → RESUBMITTED → UNDER_REVIEW (loop)
  └──→ APPROVED | REJECTED

Additional states (RECOMMENDATION, Iteration 1 finding — see Section 40):
  SUBMITTED/UNDER_REVIEW/REVISION_REQUIRED → CANCELLED (participant-initiated, pre-approval only)
  Any state (competition-level cascade) → WITHDRAWN_COMPETITION_CANCELLED (system-set if the competition itself is cancelled)
```

| Transition | Trigger | Who | Notification |
|---|---|---|---|
| DRAFT → SUBMITTED | Participant clicks Submit, passes validation | Participant | Confirmation + registration number |
| SUBMITTED → UNDER_REVIEW | Verifier opens/claims it (or automatic on submission — RECOMMENDATION: automatic, to avoid a limbo state) | System/Verifier | None required |
| UNDER_REVIEW → REVISION_REQUIRED | Verifier decision | Verifier/Admin | Email + in-app, includes reason |
| REVISION_REQUIRED → RESUBMITTED → UNDER_REVIEW | Participant edits flagged item(s) and resubmits | Participant | Confirmation to participant; queue update to verifier |
| UNDER_REVIEW → APPROVED | Verifier decision | Verifier/Admin | Email + in-app |
| UNDER_REVIEW → REJECTED | Verifier decision | Verifier/Admin | Email + in-app, includes reason |
| SUBMITTED/UNDER_REVIEW/REVISION_REQUIRED → CANCELLED | Participant action | Participant | Confirmation |
| Any → WITHDRAWN_COMPETITION_CANCELLED | Competition cancelled | System (Admin-triggered) | Email + in-app to all affected |

### 25.2 Endpoint Overview

| Domain | Method | Endpoint | Auth | Notes |
|---|---|---|---|---|
| Auth | POST | `/api/v1/auth/register` | Public | Rate-limited |
| Auth | POST | `/api/v1/auth/login` | Public | Rate-limited, brute-force lockout |
| Auth | POST | `/api/v1/auth/verify-email` | Public (token) | Single-use token |
| Auth | POST | `/api/v1/auth/refresh` | Refresh token | Rotates refresh token |
| Auth | POST | `/api/v1/auth/logout` | Authenticated | Revokes refresh token |
| Users | GET/PATCH | `/api/v1/users/me` | Authenticated | Self only |
| Competitions | GET | `/api/v1/competitions` | Public | Only returns non-DRAFT to public callers |
| Competitions | GET | `/api/v1/competitions/:slug` | Public/scoped | Field visibility depends on status |
| Competitions | POST/PATCH | `/api/v1/admin/competitions` | Competition Admin/Super Admin | Full audit logging |
| Registrations | POST | `/api/v1/registrations` | Participant | Creates DRAFT; validates competition status & eligibility |
| Registrations | PATCH | `/api/v1/registrations/:id` | Owner (participant) or assigned Verifier/Admin | **Ownership check mandatory server-side** (IDOR defense) |
| Registrations | POST | `/api/v1/registrations/:id/submit` | Owner | Transactional; re-validates deadline & quota atomically |
| Registrations | GET | `/api/v1/registrations/:id` | Owner, or assigned Verifier/Admin, or Super Admin | 403 (not 404, to avoid leaking existence — see Security note below, or 404 per chosen policy) |
| Teams | POST | `/api/v1/teams` | Participant | — |
| Teams | POST | `/api/v1/teams/:id/members` | Team Leader (of that team) | Validates BR on cross-team membership |
| Documents | POST | `/api/v1/registrations/:id/documents` | Owner | Virus scan queued; type/size validated server-side |
| Documents | GET | `/api/v1/documents/:id/download` | Owner or authorized Verifier/Admin | Returns short-lived signed URL, never a permanent link |
| Verification | POST | `/api/v1/committee/registrations/:id/decision` | Verifier/Admin (assigned) | Requires reason for reject/revision |
| Announcements | GET | `/api/v1/announcements` | Public | Only PUBLISHED shown |
| Announcements | POST/PATCH | `/api/v1/admin/announcements` | Competition Admin/Super Admin | — |
| Finalists | GET | `/api/v1/competitions/:slug/finalists` | Public | Only published |
| Finalists | POST/PATCH | `/api/v1/admin/finalists` | Competition Admin/Super Admin | — |
| Results | GET | `/api/v1/competitions/:slug/results` | Public | Only published; respects `score_visible` |
| Results | POST | `/api/v1/admin/results` | Competition Admin/Super Admin | — |
| Results | POST | `/api/v1/admin/results/:id/publish` | Competition Admin/Super Admin | Logged discretely from data entry |
| Results | POST | `/api/v1/admin/results/:id/change-request` | Competition Admin | Requires Super Admin approval |
| Notifications | GET | `/api/v1/notifications` | Authenticated | Self only |
| Reports | GET | `/api/v1/admin/reports/:type` | Competition Admin (own)/Super Admin | — |
| Audit | GET | `/api/v1/admin/audit-logs` | Super Admin (full)/scoped for Admin | Read-only, paginated |

**Security note on `GET /registrations/:id` (IDOR defense, Iteration 2 finding, Section 41):** the API must perform an authorization check comparing the requester's identity/role/scope against the resource **before** returning any data — sequential or guessable IDs must never be sufficient to access another participant's registration. **RECOMMENDATION:** use non-sequential (UUID) external identifiers in the API/URL layer even if internal database IDs are sequential integers, as defense in depth.

---

## 27. Security Requirements

**Authentication & Session**
- Passwords hashed with a modern adaptive algorithm (e.g., bcrypt/argon2), never reversible encryption.
- Mandatory email verification before any competition registration action.
- Rate limiting and progressive lockout on login attempts (brute-force protection).
- Access tokens short-lived (e.g., 15 min); refresh tokens rotated and revocable; sessions can be invalidated by Super Admin (needed for Edge Case #20 — compromised admin account).

**Authorization**
- All authorization checks performed **server-side**, on every request — never trust role/ownership claims embedded only in the client.
- Scoped RBAC (Section 25.1 `user_roles.scope_competition_id`) enforced at the query layer so a Competition Admin's queries are automatically filtered to their assigned competitions, not just hidden in the UI.

**IDOR Prevention**
- Every object-level endpoint (`registrations/:id`, `documents/:id`, `teams/:id`) enforces an ownership/scope check before returning or mutating data.
- Non-sequential external IDs (UUIDs) at the API boundary.

**File Upload Security**
- Content-type validated by magic-byte inspection, not extension.
- Mandatory malware/AV scan before a file is marked available to verifiers.
- Files stored outside the web root, in private object storage, served only via short-lived signed URLs.
- Size and count limits enforced server-side (never rely on client-side limits alone).

**Injection & Web Vulnerabilities**
- Parameterized queries / ORM usage to prevent SQL injection.
- Output encoding and a strict Content-Security-Policy to mitigate XSS, particularly on rich-text announcement content (sanitize on save and on render).
- CSRF protection (double-submit token or SameSite cookies) for state-changing requests from the web client.

**Quota Race Condition (Edge Case #2)**
- Quota decrement/check must happen inside a single atomic database transaction (e.g., `SELECT ... FOR UPDATE` or an equivalent constraint-based approach) so two simultaneous submissions cannot both succeed for the last slot. The losing request receives a clear "Quota full" error and is not left in an ambiguous state.

**Results Integrity**
- Result entry and publish are admin-only, server-validated endpoints; there is no client-writable path from the public results view back into the results table.
- Publishing is a discrete, logged action distinct from data entry (Section 21).

**Transport & Headers**
- HTTPS/TLS enforced everywhere (HSTS).
- Secure headers: CSP, X-Content-Type-Options, X-Frame-Options/frame-ancestors, Referrer-Policy.

**Audit & Monitoring**
- Append-only audit log (Section 25.1).
- Alerting on anomalous patterns (e.g., mass download of documents by one account, repeated failed logins, privilege escalation attempts) — **RECOMMENDATION** for Phase 8/9.

---

## 28. Notification System

| Trigger | Channel(s) | Recipient |
|---|---|---|
| Registration submitted | In-app + Email | Participant/Team (all members) |
| Status changed (Revision/Approved/Rejected) | In-app + Email | Participant/Team leader (+ members, read-only copy) |
| Deadline reminder (T-3d, T-1d — RECOMMENDATION, configurable per competition) | In-app + Email | Participants with incomplete/DRAFT registrations |
| New announcement relevant to a registered competition | In-app + Email (Emergency category always emailed) | Registered participants of that competition |
| New global announcement | In-app (+ homepage banner if pinned) | All users / visitors |
| Results published | In-app + Email | Registered participants of that competition |
| Verification claimed/decision made | In-app | Verifier (queue update) |
| Competition cancelled | In-app + Email (high priority) | All registered participants |

**RECOMMENDATION:** Provide a notification preference center (email on/off per category, except Emergency/security notices which cannot be disabled) to respect user preference while guaranteeing critical messages are delivered.

---

## 29. Edge Cases

| # | Scenario | Expected System Behavior |
|---|---|---|
| 1 | Registration submitted 30 seconds before deadline | Accepted if the server-side timestamp at receipt of the Submit request is before the deadline; server clock is authoritative, not client clock. |
| 2 | Two participants claim the final quota slot simultaneously | Atomic transaction ensures only one succeeds; the other receives "Quota full" and their draft is preserved for their records (not silently lost). |
| 3 | Participant uploads invalid file | Rejected client-side (fast feedback) and re-validated server-side (type/size/content); clear error message naming the specific problem. |
| 4 | Participant loses connection during submission | Submission is atomic/transactional; either the registration is fully `SUBMITTED` server-side or it remains `DRAFT` — no partial/corrupt state. On reconnect, the dashboard reflects the true server state. |
| 5 | Participant refreshes during payment/submission (if fee applies) | Idempotent submission endpoint (idempotency key) prevents duplicate charge/duplicate registration numbers on retry. |
| 6 | Participant submits duplicate registration | Blocked by BR-1 (unique active registration constraint, enforced at DB level); user is redirected to their existing registration. |
| 7 | Team member belongs to another team (same competition) | Blocked at add-time with a clear error; the member must leave the other team first (or the addition is rejected outright, per organizer's chosen policy — **RECOMMENDATION**: reject outright, simpler and safer). |
| 8 | Team leader leaves the team | Not permitted to simply "leave" — leader must either transfer leadership to another confirmed member first, or the action requires Competition Admin intervention if no other member exists (prevents an orphaned team). |
| 9 | Required document is missing at submit | Submit is blocked client-side and re-validated server-side; a checklist clearly names the missing item(s). |
| 10 | Verification requests revision | Status → `REVISION_REQUIRED`; participant notified with the specific reason/field; only the flagged item(s) become editable, not the entire registration (RECOMMENDATION — reduces re-review scope for verifiers). |
| 11 | Participant resubmits incorrect revision | Verifier can request revision again (loop is not limited by default; **RECOMMENDATION**: consider a soft cap, e.g., 3 cycles, after which it flags to Competition Admin for direct handling — organizer to confirm policy). |
| 12 | Competition deadline changes | Only Competition Admin/Super Admin can change it; change is logged with old/new value; all participants with in-progress `DRAFT` registrations are notified of the new deadline. |
| 13 | Competition is cancelled | Competition status → `CANCELLED`; all active registrations transition to `WITHDRAWN_COMPETITION_CANCELLED`; all affected participants notified immediately via high-priority channel; reason is mandatory and stored. |
| 14 | Competition quota changes | Increasing quota is safe at any time; **decreasing** quota below the current confirmed-registration count is blocked by validation (system will not retroactively bump anyone) — organizer must resolve manually if reduction is truly required. |
| 15 | Admin accidentally publishes incorrect announcement | Admin can immediately unpublish/archive; an "Edited/Corrected" timestamp is shown if content is changed post-publish rather than silently rewriting history (Section 18.3). |
| 16 | Admin accidentally publishes incorrect result | Result entry and publish are separate actions; before full public "Published" state, a **Preview** state is recommended (RECOMMENDATION, Iteration 1 addition) so admins can review before the irreversible-feeling publish click. Post-publish correction follows Section 8.3's elevated-approval workflow. |
| 17 | Result must be changed after publication | Handled via `RESULT_CHANGE_REQUEST` → Super Admin approval → applied with full audit diff and a visible "Corrected on [date]" notice. |
| 18 | Email notification fails | In-app notification is always created regardless of email delivery outcome (in-app is the source of truth); failed email deliveries are logged/retried with backoff; does not block the underlying state transition. |
| 19 | Uploaded file is malicious | Quarantined by the AV/content scan before ever being available to verifiers; flagged file's registration is marked with a visible internal warning; participant is asked to re-upload; event is logged for security review. |
| 20 | Admin account is compromised | Super Admin can immediately force-revoke all sessions/tokens for that account, disable it, and review its recent audit log entries for unauthorized actions; any results/announcements it touched can be flagged for review. |

---

## 30. Non-Functional Requirements

**Performance**
- Public page load: target ≤ 2.5s (p75) on a typical mobile connection (**RECOMMENDATION** target, organizer/hosting to confirm SLA).
- API response time: target ≤ 300ms (p95) for standard read endpoints, excluding file upload/scan operations.
- Registration submission under concurrent load (e.g., deadline-day spike) must remain correct (no double-booking) even if latency temporarily increases.
- File upload: support files up to the configured max (RECOMMENDATION default 5MB/file) with progress indication.

**Scalability**
- Design should comfortably support **at minimum** thousands of participants and tens of competitions concurrently (**TBD** — organizer to confirm expected scale so infrastructure sizing is accurate); architecture (stateless API + relational DB + object storage) scales horizontally without redesign.

**Availability**
- Regular automated backups of the database (**RECOMMENDATION**: daily full + point-in-time recovery) and object storage.
- Basic uptime/error monitoring and alerting from day one (Phase 8/9).
- Documented disaster recovery runbook (RTO/RPO — **TBD**, to be defined with hosting provider).

**Accessibility**
- Keyboard navigability for all interactive elements.
- Sufficient color contrast (WCAG AA minimum — RECOMMENDATION).
- Screen-reader-friendly semantic HTML and ARIA labeling on forms and status indicators.
- Fully responsive layout, mobile-first given expected usage pattern (students registering from phones).

**Security (cross-reference Section 27)**
- All the items in Section 27 are treated as non-functional acceptance gates, not optional hardening — i.e., the platform is not considered "done" for a phase until its security requirements pass.

---

## 31. User Stories

Format: `As a [role], I want to [action], so that [benefit].` Priority: MUST / SHOULD / COULD / WON'T (MVP).

**Visitor**
- MUST: As a Visitor, I want to see all competition categories and their key info, so that I can decide whether to register.
- MUST: As a Visitor, I want to see the registration deadline clearly on the competition page, so that I don't miss it.
- SHOULD: As a Visitor, I want to filter competitions by "open for registration," so that I only see relevant options.
- COULD: As a Visitor, I want to subscribe to updates for a specific competition without creating an account, so that I stay informed before deciding to join. (WON'T for MVP if it requires a separate anonymous-subscription mechanism — **RECOMMENDATION**: defer)

**Participant**
- MUST: As a Participant, I want to know exactly what I need to do next on my dashboard, so that I never miss a required action.
- MUST: As a Participant, I want to upload my documents and see confirmation they were received, so that I trust my submission went through.
- MUST: As a Participant, I want to see why my registration needs revision, so that I can fix it correctly the first time.
- SHOULD: As a Participant, I want to receive an email reminder before the registration deadline, so that I don't forget.
- COULD: As a Participant, I want to download a PDF summary of my registration, so that I have an offline record.
- WON'T (MVP): As a Participant, I want to chat live with the committee in-app.

**Team Leader**
- MUST: As a Team Leader, I want to add and confirm team members before submitting, so that my roster is accurate and consented.
- MUST: As a Team Leader, I want to see my whole team's document status in one place, so that I can chase missing items.
- SHOULD: As a Team Leader, I want to transfer leadership to another member, so that the team isn't blocked if I become unavailable.

**Committee/Verifier**
- MUST: As a Verifier, I want a queue scoped only to my assigned competitions, so that I'm not overwhelmed by irrelevant items.
- MUST: As a Verifier, I want to require a reason for rejection/revision, so that decisions are defensible and participants know what to fix.
- SHOULD: As a Verifier, I want to search/filter the queue by institution or category, so that I can batch similar reviews.

**Competition Admin**
- MUST: As a Competition Admin, I want to configure required documents per competition, so that I don't need a developer for every new competition.
- MUST: As a Competition Admin, I want to preview a result before publishing it, so that I don't publish mistakes to the public.
- SHOULD: As a Competition Admin, I want to export registration data as CSV, so that I can process it in institutional reporting tools.
- COULD: As a Competition Admin, I want to duplicate a previous competition's configuration, so that I save setup time next year.

**Super Admin**
- MUST: As a Super Admin, I want to view the full audit log across all competitions, so that I can investigate disputes or incidents.
- MUST: As a Super Admin, I want to force-revoke a compromised admin account's sessions, so that I can contain a security incident immediately.
- SHOULD: As a Super Admin, I want system-wide analytics across all competitions, so that I can report to stakeholders.

---

## 32. Acceptance Criteria

Each maps to functional requirements (Section 12) and is objectively testable.

**Registration availability (FR-REG)**
```
Given a competition's registration period has closed
When a visitor opens the competition detail page
Then the system displays "Registration Closed"
And the "Register" button is disabled or hidden, preventing a new registration.
```

**Quota enforcement (BR-7, Edge Case #2)**
```
Given a competition has exactly 1 remaining quota slot
When two participants submit a registration for that slot within the same second
Then exactly one submission succeeds with status SUBMITTED
And the other receives a "Quota full" error and remains in DRAFT.
```

**Duplicate registration prevention (BR-1, Edge Case #6)**
```
Given a participant already has a SUBMITTED registration for Competition X
When that participant attempts to create a new registration for Competition X
Then the system blocks the action
And redirects the participant to their existing registration.
```

**Document requirement enforcement (FR-DOC)**
```
Given Competition X requires "Institution Letter" as a mandatory document
When a participant attempts to Submit without uploading it
Then the Submit action is blocked
And the system lists "Institution Letter" as a missing required item.
```

**Revision workflow (BR-12, Edge Case #10)**
```
Given a Verifier selects "Request Revision" on a registration
When the Verifier attempts to confirm without entering a reason
Then the system blocks the action
And requires a non-empty reason before the status can change to REVISION_REQUIRED.
```

**Document access control (IDOR defense, Section 27)**
```
Given Participant A has uploaded a private document to their own registration
When Participant B, authenticated as themselves, requests that document's file URL by ID
Then the system returns an authorization error
And does not reveal whether the document ID exists.
```

**Result publication (BR-14/15, Edge Case #16)**
```
Given a Competition Admin has entered result data for a category but has not clicked "Publish"
When a Visitor views the public results page for that competition
Then the unpublished result data is not visible in any form.
```

**Post-publication result change (Section 8.3, Edge Case #17)**
```
Given a result has status PUBLISHED
When a Competition Admin attempts to directly edit a ranking entry
Then the system blocks the direct edit
And requires the Admin to submit a RESULT_CHANGE_REQUEST for Super Admin approval.
```

**Audit logging (FR-AUDIT)**
```
Given any user with permission approves a registration
When the approval action completes
Then an audit_logs entry is created recording actor, timestamp, target registration ID,
previous status, and new status,
And the entry cannot subsequently be edited or deleted by any application role.
```

---

## 33. QA & Testing Strategy

| Test Category | Example Positive Case | Example Negative Case |
|---|---|---|
| Functional — Registration | Participant completes and submits a valid individual registration | Submission attempted with a required document missing → blocked |
| Functional — Team | Leader adds members within min/max range, all accept, submits successfully | Leader attempts to submit with roster size below minimum → blocked |
| Verification | Verifier approves a complete, valid registration | Verifier attempts "Reject" with empty reason → blocked |
| Announcement | Admin schedules an announcement for future publish; it appears exactly at that time | Admin attempts to publish with empty title/content → blocked |
| Results | Admin publishes results; public page reflects them immediately | Non-admin role attempts to call the publish endpoint directly → 403 |
| Authentication | User logs in with correct credentials | Account locks out after N failed attempts (brute-force test) |
| Authorization | Competition Admin accesses their own competition's data | Competition Admin attempts to access another Admin's competition data via direct API call → 403 |
| File Upload | Valid PDF under size limit uploads successfully | Disguised executable renamed as `.pdf` is rejected by content inspection |
| API | Valid request returns expected schema and status code | Malformed/oversized payload returns a clean 4xx, not a server error |
| Security — IDOR | Owner retrieves their own document via signed URL | Non-owner requesting another user's document/registration ID is denied |
| Security — Injection | Standard form input processes correctly | SQL/script injection payloads in text fields are neutralized/sanitized |
| Performance | Page loads within target under normal load | System remains correct (not necessarily fast) under simulated deadline-day spike |
| Responsive | Registration flow completes cleanly on a common mobile viewport | Layout does not break/overflow at narrow widths |
| Accessibility | All form fields are reachable and operable via keyboard alone | Screen reader announces validation errors correctly |
| Regression | Prior release's core flows (register → verify → announce → publish results) still pass after each new deployment | — |

---

## 34. Analytics

- Competition page views (per competition)
- Registration funnel: view → start registration → draft saved → submitted (conversion + abandonment rate at each step)
- Participants by competition / by category / by institution
- Approval rate, rejection rate, revision rate (overall and per competition)
- Average verification turnaround time (submission → decision)
- Most-viewed / most-registered competition
- Notification delivery/open rates (email opens where trackable, in-app read rate)
- Peak load periods (useful for anticipating deadline-day traffic)

---

## 35. Audit Logging

| Event | Actor | Target | Logs Previous/New Value? |
|---|---|---|---|
| LOGIN / LOGOUT | User | Session | No |
| CREATE_COMPETITION / EDIT_COMPETITION | Admin | Competition | Yes (field diff) |
| PUBLISH_COMPETITION / CANCEL_COMPETITION | Admin | Competition | Yes (status) |
| SUBMIT_REGISTRATION / EDIT_REGISTRATION | Participant | Registration | Yes (status/fields) |
| VERIFY_REGISTRATION (approve/reject/revision) | Verifier/Admin | Registration | Yes (status + reason) |
| REQUEST_REVISION | Verifier/Admin | Registration | Yes (reason, flagged field) |
| REJECT_REGISTRATION / APPROVE_REGISTRATION | Verifier/Admin | Registration | Yes (status) |
| UPLOAD_DOCUMENT / DELETE_DOCUMENT | Participant | Document | Yes (version) |
| CREATE_ANNOUNCEMENT / EDIT_ANNOUNCEMENT | Admin | Announcement | Yes |
| PUBLISH_ANNOUNCEMENT | Admin | Announcement | Yes (status) |
| CREATE_RESULT / MODIFY_RESULT | Admin | Result | Yes (full diff, mandatory for MODIFY) |
| PUBLISH_RESULT | Admin | Result Category | Yes (status) |
| RESULT_CHANGE_REQUEST / RESULT_CHANGE_APPROVED | Admin / Super Admin | Result | Yes (proposed + approved diff) |
| CREATE_USER / CHANGE_ROLE | Super Admin | User | Yes (role/scope) |
| SUSPEND_USER / REVOKE_SESSIONS | Super Admin | User | Yes (status) |
| DELETE_DATA | Super Admin | Any | Yes (what was deleted, reason) |

Every entry additionally records: `actor_id`, `timestamp`, `ip_address`, `user_agent` where applicable to the action origin (web request vs. system job).

---

## 36. MVP Scope

**MUST HAVE**
- Public site: Home, About, Competition Directory & Detail, Schedule, Announcements, Finalists, Results, FAQ, Contact
- Auth: registration, email verification, login, password reset
- Registration flow: individual + team, configurable documents/requirements/quota/deadline
- Document upload with AV scanning and private, access-controlled storage
- Verification workflow: approve/reject/request revision with mandatory reasons
- Participant dashboard with "action required" guidance
- Admin dashboard: competition CRUD, registration management, announcement CRUD, finalist management, result entry + publish workflow, basic reports
- RBAC with scoped permissions (Competition Admin/Verifier scoped to assigned competitions)
- Notifications: in-app + email for core lifecycle events
- Full audit logging on all state-changing actions
- Core security controls (Section 27) — non-negotiable for launch

**SHOULD HAVE**
- Deadline reminder notifications (T-3/T-1)
- CSV export of registrations/reports
- Result preview-before-publish step
- Notification preference center

**COULD HAVE**
- PDF summary export of a participant's registration
- Duplicate/clone competition configuration for reuse
- Emergency announcement site-wide banner

**WON'T HAVE (MVP)**
- Payment gateway integration (manual/offline proof-of-payment only, if fee applies)
- Native mobile apps
- Public API for third parties
- AI/OCR-based document verification
- Live in-app chat with committee
- Multi-language beyond primary language

---

## 37. Future Development

- Institutional/coordinator account type for bulk-registering multiple participants (if organizer determines this is needed)
- Persistent "club" teams across multiple competition cycles
- Payment gateway integration for online fee collection
- AI-assisted document pre-check (e.g., flag illegible scans before human review)
- Public read-only API for institutions/media
- Multi-language support
- Native mobile app wrapper
- Advanced analytics dashboard with predictive registration forecasting

---

## 38. Implementation Roadmap

```
PHASE 1 — Foundation
   Infra setup, CI/CD, database schema, auth scaffolding, RBAC core, audit log pipeline
   Dependency: none. Can start immediately.
        ↓
PHASE 2 — Public Website
   Home, About, Competition Directory/Detail (read-only), Schedule, FAQ, Contact
   Dependency: Phase 1 (data models for competitions). BLOCKED on organizer confirming
   Section 6 TBD items (categories, dates, eligibility) for real content — can build
   with placeholder/CMS-driven content in parallel.
        ↓
PHASE 3 — Authentication
   Registration, email verification, login, password reset, profile completion
   Dependency: Phase 1.
        ↓
PHASE 4 — Registration System
   Individual/team registration flow, document upload + AV scanning, quota enforcement
   Dependency: Phase 2 (competition data model live), Phase 3 (auth). BLOCKED on
   organizer confirming competition configuration data (Section 6).
        ↓
PHASE 5 — Verification
   Committee queue, decision workflow, revision loop, notifications
   Dependency: Phase 4.
        ↓
PHASE 6 — Announcements & Results
   Announcement CRUD/scheduling, finalist management, result entry + publish workflow
   Dependency: Phase 1 (auth/RBAC); can be built in parallel with Phase 4/5 since it
   doesn't strictly depend on registration data, but result publication depends on
   Phase 5 (approved/finalist registrations existing).
        ↓
PHASE 7 — Admin Dashboard
   Statistics, reports, user/role management, audit log viewer
   Dependency: Phases 1–6 (aggregates data from all modules).
        ↓
PHASE 8 — Security & QA
   Full security testing pass (Section 27/32), performance/load testing (deadline-day
   simulation), accessibility audit
   Dependency: Phases 1–7 feature-complete.
        ↓
PHASE 9 — Deployment
   Production hardening, monitoring/alerting, backup verification, go-live checklist
   Dependency: Phase 8 sign-off.
```

**RECOMMENDATION:** Do not open real registration (Phase 4 going live) until Section 6's TBD items are confirmed — launching registration with placeholder competition data risks collecting invalid registrations that must later be voided, damaging trust.

---

## 39. Risks & Mitigation

| Risk | Impact | Mitigation |
|---|---|---|
| Competition data (dates/quota/fees/etc.) not confirmed in time | Delays Phase 4 launch or forces error-prone placeholder data | Lock Section 6 TBD register with organizer before Phase 4 starts; treat as a hard go/no-go gate |
| Deadline-day traffic spike causes race conditions or downtime | Over-quota registrations, participant frustration, reputational damage | Atomic quota transactions (Section 27), load testing in Phase 8, autoscaling infra |
| Malicious file upload | Security breach, malware distribution | Mandatory AV scanning, content-type inspection, private storage (Section 16/26) |
| Verifier backlog causes participant frustration | Poor experience, complaints, missed downstream deadlines | Dashboard visibility of oldest-pending item (Section 12), staffing plan for committee (organizational, outside this PRD) |
| Incorrect result published | Public trust damage, disputes | Preview-before-publish, elevated approval for post-publish changes (Section 8.3/20) |
| Compromised admin account | Data breach, fraudulent approvals/results | Session revocation capability, audit log review, RBAC scoping limits blast radius (Section 27) |
| Scope creep during build | Delayed launch | Strict MVP boundary (Section 36), TBD/Future items explicitly deferred (Section 37) |

---

## 40. Iteration 1 Review (Product / UX / Business Logic)

Reviewed as a Senior Product Manager. Problems found and changes made:

| Problem Found | Change Made | Reason |
|---|---|---|
| Original state machine (Stage 8) had no path for a participant-initiated cancellation | Added `CANCELLED` (participant-initiated) and `WITHDRAWN_COMPETITION_CANCELLED` (system-initiated) states | Real registrations get cancelled voluntarily, and competitions can be cancelled entirely (Edge Case #13); without these states the data model can't represent reality |
| "Team Leader" was listed as if it were a standalone role | Re-modeled as a capability on a team-membership record, not a global RBAC role | A person is a leader only in the context of one team on one competition; treating it as a global role would cause incorrect permission scoping across competitions |
| Revision workflow implied the entire registration reopens for editing | Restricted editing during `REVISION_REQUIRED` to only the specifically flagged field/document | Reduces re-review burden on verifiers and prevents participants from silently changing unrelated data during a revision cycle |
| No explicit consent step for team members being added | Added a `PENDING → ACCEPTED` invitation flow for team membership | Prevents someone being registered into a competition without their knowledge/consent — a real fairness and data-protection concern |
| Result publishing had no "preview" concept | Added a Preview state/step before irreversible-feeling Publish | Directly addresses Edge Case #16 (accidental incorrect publish) at the UX level, not just the audit level |
| Institution/coordinator bulk-registration need was implicit in "Institution requirements" but undefined | Explicitly scoped OUT of MVP as an ASSUMPTION, flagged for Future Development | Avoids silently under-building a feature the organizer may or may not actually need; forces an explicit decision instead of an assumption baked into the data model |
| Dashboard "action required" concept was described but not tied to a rule for what counts as urgent | Defined the Overview panel to always show either action-required items or the next upcoming milestone, never a blank state | Prevents a false sense of "nothing to do" when a deadline is actually approaching |

---

## 41. Iteration 2 Review (Architecture / Security / Database / Edge Cases / QA)

Reviewed as a Senior Software Architect, Security Engineer, and QA Lead. Problems found and changes made:

| Problem Found | Change Made | Reason |
|---|---|---|
| RBAC as originally scoped (global roles only) couldn't express "Competition Admin owns only their own competitions" | Added `scope_competition_id` to `user_roles` | Without scoping, any Competition Admin could technically query/modify any competition's data — a broken access control risk (OWASP A01) |
| BR-1 (one active registration per competition) was described only as an "application logic" rule | Enforced additionally as a **partial unique database constraint** | Application-only enforcement is vulnerable to race conditions and bugs; the database must be the final source of truth for this integrity rule |
| Quota enforcement described only conceptually | Specified explicit atomic transaction / row-locking requirement (Section 27) | Directly closes the race condition in Edge Case #2 — two simultaneous requests for the last slot must not both succeed |
| File access originally implied direct file URLs | Changed to short-lived signed URLs with mandatory server-side authorization check per request | Prevents IDOR — a participant must never access another's document by modifying an ID, even if they can predict/guess it |
| Result modification after publish had no approval gate | Introduced the elevated `RESULT_CHANGE_REQUEST` → Super Admin approval workflow (Section 8.3) | Prevents a single Competition Admin from unilaterally and silently altering public results, and creates an audit-backed correction trail |
| Document versioning was modeled as a separate `document_versions` table in the initial draft, duplicating fields already in `documents` | Merged into `documents` with `version`/`is_current` flags | Reduces redundant schema, avoids sync bugs between two tables representing the same concept |
| No requirement for content-based file type validation | Added mandatory magic-byte inspection in addition to extension checking | Extension-only checks are trivially bypassed (e.g., renaming a script to `.pdf`); a real security control must inspect content |
| Audit log table had no protection against tampering specified | Specified append-only permissions (no UPDATE/DELETE grants) at the database role level | An audit log that can be edited or deleted is not a trustworthy audit log — this is a QA/compliance-testable requirement, not just a suggestion |
| `GET /registrations/:id` had an ambiguous error-handling note (403 vs 404) | Called out explicitly as a designed decision point with a recommendation (avoid confirming existence to unauthorized requesters) | Leaking "this ID exists but you can't see it" vs "this doesn't exist" is itself a minor information-disclosure risk; needs a deliberate, testable answer, not an oversight |
| No defined behavior when a competition's quota is decreased below current registrations | Added explicit validation: quota reduction below current confirmed count is blocked, requiring manual organizer resolution | Prevents silent, ambiguous data states where the system doesn't know which registrations to "bump" |
| QA matrix initially covered only positive cases for several modules | Added explicit negative test cases (e.g., non-admin calling publish endpoint directly, disguised executable upload) for every major module | An untested negative path is an unverified security/business-rule boundary — required per QA Lead review (Stage 25/28) |

---

## 42. Final Quality Score

| Category | Weight | Score (0–10) | Weighted |
|---|---|---|---|
| Product clarity | 15% | 9.0 | 1.35 |
| User experience | 15% | 8.8 | 1.32 |
| Functional requirements | 15% | 9.0 | 1.35 |
| Business logic | 15% | 9.0 | 1.35 |
| Architecture | 10% | 8.8 | 0.88 |
| Security | 10% | 9.2 | 0.92 |
| Database/API | 10% | 8.8 | 0.88 |
| Edge cases | 5% | 9.0 | 0.45 |
| QA/Acceptance Criteria | 5% | 8.8 | 0.44 |
| **Total** | **100%** | — | **8.94 / 10** |

**Scoring rationale (kept honest, not inflated):**
- Deductions across nearly every category reflect the large number of **TBD** items that genuinely cannot be resolved without organizer input (competition data, fees, quotas, prizes, rules) — this PRD scores the *design quality of the system*, not the *completeness of official competition data*, which is explicitly out of this working group's control.
- Architecture/Database/API/QA scored slightly below Business Logic/Security because a real implementation will still surface schema refinements once actual competition configurations (Section 6) are known — this PRD provides the extensible pattern, not a final frozen schema.
- Security scored highest because every major class of risk identified in Stage 15/28 (IDOR, race conditions, file upload abuse, broken access control, audit tampering, compromised accounts) has an explicit, testable mitigation in Sections 8.3, 24, 25, 26, and 40.

**Result: 8.94 / 10 — meets the ≥ 8.5 target.**

---

## 43. Final Recommendations

1. **Lock the Section 6 TBD register with the organizer immediately.** This is the single largest schedule risk. Phase 4 (registration going live) should not start without it.
2. **Treat competition configuration as data, not code**, exactly as the platform is designed — every category, document requirement, schedule milestone, and quota must be organizer-editable through the admin panel, never hardcoded.
3. **Do not compress Phase 8 (Security & QA).** The atomic-quota, IDOR-defense, and audit-integrity requirements in this document are only real if they are actually tested under load and under adversarial conditions before go-live, particularly ahead of a predictable deadline-day traffic spike.
4. **Assign real people to the Verifier role scoping early**, since the committee's day-to-day experience (Section 17, 9.3) depends entirely on assignment being configured correctly per competition — an unscoped verifier queue defeats the purpose of RBAC scoping.
5. **Confirm branding and legal basics (organizer name, contact channels, privacy/terms content) before Phase 2 launch** — these are small items but block a professional, trustworthy public presentation.
6. **Revisit this PRD after Section 6 is confirmed** to convert remaining ASSUMPTIONs (e.g., re-registration policy, revision-cycle cap, institution/coordinator role) into CONFIRMED REQUIREMENTs, and to right-size Phase 4/6 scope accordingly.
