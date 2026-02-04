# TypingTest

TypingTest is a web-based typing test application developed as a minor project during the VW CMT Batch 3 corporate training program. The project focuses on measuring typing speed and accuracy while applying core front-end web development concepts.

## Project Overview

The application allows users to take timed typing tests and receive real-time feedback on their performance. It calculates standard typing metrics such as Words Per Minute (WPM), accuracy, and characters per second, and presents a graphical view of typing performance over time. The project is implemented using only HTML, CSS, and JavaScript and runs entirely in the browser.

## Objectives

- Develop a browser-based typing test using core web technologies  
- Measure typing speed using standard WPM calculations  
- Track and display typing accuracy in real time  
- Provide visual feedback for correct and incorrect input  
- Store and display best performance across sessions  
- Strengthen understanding of JavaScript event handling and DOM manipulation  

## Technology Stack

- HTML5 for application structure  
- CSS3 for styling, dark theme, and responsive layout  
- JavaScript (ES6) for application logic and calculations  
- Browser APIs:
  - LocalStorage for best score persistence  
  - Canvas API for performance chart visualization  

## Key Features

- Timed test modes (30s and 60s)  
- Auto-start on first keystroke  
- Real-time WPM and accuracy updates  
- Character-level correctness highlighting  
- Detailed result summary after each test  
- WPM-over-time graphical representation  
- Responsive, minimal dark-themed user interface  

## Calculation Logic

- Raw WPM = (Total characters typed / 5) ÷ time in minutes  
- Net WPM = (Correct characters / 5) ÷ time in minutes  
- Accuracy (%) = (Correct characters / total typed characters) × 100  
- Characters per second = Correct characters ÷ time in seconds  

## Edge Case Handling

- Prevents division-by-zero when no input is provided  
- Defaults accuracy to 100% before typing begins  
- Disables input when the test is completed  
- Prevents negative timer values  
- Ensures clean state reset on restart  

## Future Enhancements

- User authentication and profile-based tracking  
- Backend and database integration  
- Difficulty levels and customizable content  
- Leaderboards and competitive modes  
- Mobile-first optimizations  
- Multi-language support  

## Author

Kanishk Marwal  
Minor Project – VW CMT Batch 3 Corporate Training Program

## License

This project is developed for educational and training purposes.

