# GraphR Web Application

A complete web implementation of GraphR - the world's first intuitive, all-in-one calculator app for education.

## Features

### For Students
- **Multi-mode Calculator**: Basic, Scientific, and Graphing modes
- **Secure Exam Mode**: Patent-based proctoring with violation detection
- **Classroom Management**: Join classrooms and access materials
- **Learning Analytics**: Track progress and performance
- **Real-time Feedback**: Instant exam results and grades

### For Teachers
- **Dashboard**: Real-time exam monitoring
- **Exam Creation**: Build custom exams with multiple question types
- **Grade Book**: Manage and track student grades
- **Violation Tracking**: Monitor app-switching and cheating attempts
- **Analytics**: Class performance and student metrics

### Core Technology
- **Calculator Module**: Basic arithmetic, scientific functions, graphing
- **Exam Engine**: Secure testing with built-in proctoring
- **Real-time Monitoring**: Patent-based violation detection
- **Responsive Design**: Works on desktop and tablet devices

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server required - runs fully client-side

### Installation

1. Clone the repository:
```bash
git clone <repo-url>
cd GraphR\ App\ Production/web
```

2. Open in browser:
```bash
# Simple approach - open index.html directly
open index.html

# Or use a local server (Python 3):
python -m http.server 8000

# Or use Node.js http-server:
npx http-server
```

3. Access at `http://localhost:8000`

## Usage

### Student Workflow

1. **Sign In**: Create account or login as student
2. **Calculator**: Use the calculator for computations
3. **Join Classroom**: Use classroom code to join
4. **Take Exam**: Start exam from exam list
5. **View Results**: Check grades and analytics

### Teacher Workflow

1. **Sign In**: Login as teacher
2. **Create Classroom**: Set up classroom with students
3. **Create Exam**: Build custom exams
4. **Monitor**: Track student progress in real-time
5. **Grade**: Review and grade submissions

## File Structure

```
web/
├── index.html                 # Main HTML file
├── styles/
│   ├── main.css              # Core styles
│   ├── calculator.css        # Calculator styles
│   ├── exam.css              # Exam styles
│   └── classroom.css         # Classroom styles
├── js/
│   ├── app.js                # Main application logic
│   ├── calculator.js         # Calculator module
│   ├── graphing.js           # Graphing module
│   ├── exam.js               # Exam module
│   ├── classroom.js          # Classroom module
│   ├── auth.js               # Authentication
│   └── proctoring.js         # Patent-based proctoring
└── README.md                 # This file
```

## Calculator Modes

### Basic Mode
- Arithmetic operations (+, -, *, /)
- Decimal support
- Calculation history
- Clear function

### Scientific Mode
- Trigonometric functions (sin, cos, tan)
- Logarithmic functions (ln, log)
- Power operation (^)
- Square root (√)
- Factorial (!)
- Parentheses support
- Constants (π, e)

### Graphing Mode
- Equation input (e.g., y=x^2+3x+1)
- Interactive canvas
- Zoom and pan
- Axis labeling
- Grid display

## Exam Features

### Question Types
- Multiple choice
- Short answer
- Fill-in-the-blank

### Proctoring (Patent-based)
- App switching detection
- Tab visibility monitoring
- Right-click prevention
- Copy/paste blocking
- Violation logging
- Real-time teacher notifications
- Auto-submit on excessive violations
- Emergency call support (device never locked)

### Exam Controls
- Timer with countdown
- Question navigation
- Progress tracking
- Instant grading
- Feedback display

## Data Storage

The web app uses browser localStorage for data persistence:
- `graphr_current_user`: Currently logged-in user
- `graphr_users`: All user accounts
- `graphr_classrooms`: Classroom data
- `graphr_exams`: Exam definitions
- `graphr_exam_results`: Student exam results
- `graphr_violations`: Proctoring violations

**Note**: In production, replace with Firebase or backend API.

## Configuration

### Default Test Accounts

Student:
- Email: `student@school.edu`
- Password: `password`
- Role: Student

Teacher:
- Email: `teacher@school.edu`
- Password: `password`
- Role: Teacher

### Customization

Edit `constants` in `js/app.js` to customize:
- Color scheme
- Button layouts
- Default exams
- Time limits
- Grading scale

## Proctoring Details

The GraphR proctoring system detects:
1. **Window/Tab Switching**: Detects blur/focus events
2. **Tab Visibility**: Monitors if tab is hidden
3. **Copy Attempts**: Prevents copying answers
4. **Paste Attempts**: Prevents pasting content
5. **Right-Click**: Blocks context menu
6. **Developer Tools**: Detects F12/DevTools access

**Key Innovation**: Device is never locked - emergency calls always work.

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader compatible
- High contrast mode
- Adjustable font sizes

## Performance

- **Load Time**: <2 seconds
- **Calculator**: Instant response
- **Graphing**: Real-time rendering
- **Exams**: Smooth 60 FPS

## Security

- Client-side encryption (localStorage)
- HTTPS recommended for production
- CSP headers recommended
- Input validation on all forms

## Testing

### Manual Testing Checklist

- [ ] Calculator basic operations
- [ ] Scientific functions
- [ ] Graphing equations
- [ ] Login/signup flow
- [ ] Exam taking flow
- [ ] Violation detection
- [ ] Grade calculation
- [ ] Classroom join
- [ ] Profile management

### Test Cases

1. **Calculator Test**:
   - 2 + 2 = 4
   - 10 - 3 = 7
   - 5 * 4 = 20
   - 20 / 4 = 5

2. **Exam Test**:
   - Start exam
   - Answer questions
   - Submit exam
   - View results

3. **Proctoring Test**:
   - Switch to another tab
   - Return to exam
   - Check violation log

## Production Deployment

### Recommended Setup

1. **Backend**: Firebase or Node.js API
2. **Database**: Firestore or PostgreSQL
3. **Hosting**: Vercel, Netlify, or AWS
4. **CDN**: CloudFlare or AWS CloudFront
5. **Monitoring**: Sentry or DataDog

### Deployment Checklist

- [ ] Replace localStorage with backend
- [ ] Set up Firebase or backend API
- [ ] Configure HTTPS
- [ ] Enable CSP headers
- [ ] Set up error logging
- [ ] Configure email service
- [ ] Set up SSL certificate
- [ ] Enable CORS properly
- [ ] Configure rate limiting
- [ ] Test in production environment

### Environment Variables

```env
REACT_APP_API_URL=https://api.graphr.app
REACT_APP_FIREBASE_KEY=xxx
REACT_APP_FIREBASE_ID=xxx
```

## API Integration

When integrating with a backend:

### Authentication
```javascript
POST /api/auth/login
POST /api/auth/signup
POST /api/auth/logout
GET /api/auth/me
```

### Exams
```javascript
GET /api/exams
POST /api/exams
GET /api/exams/:id
POST /api/exams/:id/submit
```

### Classrooms
```javascript
GET /api/classrooms
POST /api/classrooms
POST /api/classrooms/:id/join
```

### Violations
```javascript
POST /api/violations
GET /api/violations/:examId
```

## Troubleshooting

### Calculator not responding
- Refresh the page
- Clear browser cache
- Check browser console for errors

### Exam timer freezes
- Ensure JavaScript is enabled
- Check system time
- Reload the page

### Violations not logged
- Check if monitoring started
- Verify exam is active
- Check browser console

### Data not saving
- Enable localStorage
- Check browser storage quota
- Clear cookies if needed

## Support

For issues or feature requests:
- Email: support@graphr.app
- Website: graphr.app
- GitHub Issues: [Create issue]

## License

Proprietary - GraphR App

## About

**GraphR** - Calculating the Future of Education
- **Tagline**: #CalculatingTheFuture
- **Mission**: Make phones educational tools, not distractions
- **Innovation**: Patent-based proctoring technology

---

Built with passion for education. Every line of code serves students.

Author: Pawan K Jajoo
