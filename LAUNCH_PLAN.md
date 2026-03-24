# GraphR Launch Plan

## Product: Patent-Based Exam Proctoring Calculator App
**Target**: K-12 schools and school districts, teachers administering math exams.
**Model**: Freemium (free calculator + paid exam proctoring subscription).
**Platforms**: iOS and Android via React Native + Expo.
**Patent**: App-switching violation detection for exam integrity.

---

## Phase 1: App Store Readiness

- [ ] Complete Expo EAS production build configuration for iOS and Android
- [ ] Set up Firebase production project (separate from dev/staging)
- [ ] Configure Firestore security rules for production (student data isolation)
- [ ] Test in-app purchase flow end-to-end (iOS App Store + Google Play)
- [ ] COPPA compliance review: verify no behavioral tracking, parental consent flow works
- [ ] Accessibility audit: VoiceOver (iOS), TalkBack (Android), contrast ratios
- [ ] Performance testing: 30+ concurrent exam takers on Firestore
- [ ] App Store screenshot preparation (iPhone, iPad, Android phone/tablet)
- [ ] Write App Store / Google Play descriptions and metadata
- [ ] Privacy policy and Terms of Service pages hosted on graphrapp.com

## Phase 2: TestFlight / Internal Testing

- [ ] Distribute via TestFlight (iOS) and internal track (Google Play)
- [ ] Recruit 5-10 teachers for beta testing in real classroom settings
- [ ] Run mock exams: verify violation detection catches app switching reliably
- [ ] Test teacher dashboard: real-time monitoring of 30-student exam
- [ ] Validate grading accuracy across question types
- [ ] Test push notifications: exam alerts, grade notifications, violation warnings
- [ ] Gather teacher feedback on UX, especially exam creation flow
- [ ] Fix critical issues from beta testing

## Phase 3: App Store Submission

- [ ] Submit to Apple App Review (allow 2-4 weeks for education category)
- [ ] Submit to Google Play Review
- [ ] Address any reviewer feedback or rejections
- [ ] Prepare launch marketing materials
- [ ] Set up customer support email and FAQ page
- [ ] Configure analytics for key funnels (signup → classroom → exam → subscription)

## Phase 4: School Pilot Program

- [ ] Partner with 3-5 schools for structured pilot (free premium access)
- [ ] Provide teacher onboarding: 30-minute video walkthrough + PDF guide
- [ ] Collect usage data: exams created, violations detected, teacher satisfaction
- [ ] Case study: "How [School] reduced exam cheating by X% with GraphR"
- [ ] Iterate on teacher-requested features from pilot feedback
- [ ] Explore school district-level licensing (annual per-school pricing)

## Phase 5: Public Launch & Growth

- [ ] Launch announcement on education technology forums and social media
- [ ] Outreach to education technology publications (EdSurge, THE Journal)
- [ ] Conference presence: ISTE, FETC, regional ed-tech conferences
- [ ] Teacher referral program (free months for referring colleagues)
- [ ] Expand to higher education (university proctoring use case)
- [ ] Explore LMS integrations (Google Classroom, Canvas, Schoology)
- [ ] Evaluate white-label opportunity for test prep companies

---

## Key Metrics

| Metric | Pilot | Launch (3 Month) | Growth (12 Month) |
|--------|-------|-------------------|-------------------|
| Schools using GraphR | 5 | 25 | 200 |
| Active teachers | 15 | 100 | 1,000 |
| Exams administered | 50 | 500 | 10,000 |
| Subscription conversion | - | 5% | 10% |
| App Store rating | - | 4.0+ | 4.5+ |

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Apple rejects exam monitoring feature | Can't launch on iOS | Frame as "exam focus mode" not "surveillance"; emphasize safety-first design |
| Schools block app installations | Adoption barrier | MDM deployment guide for IT admins; web fallback for calculator |
| COPPA violations | Legal liability | Third-party compliance audit before launch; no analytics SDK |
| Firebase costs spike with scale | Margin erosion | Firestore query optimization; cache aggressively; evaluate pricing tiers |
| Patent challenge | IP risk | Document prior art thoroughly; maintain detailed invention records |
