console.log("Script is running");

const { useState, useEffect } = React;

// Progress tracking and skill data for each year
const skillData = {
    "Year 1": {
        availableYears: [1],
        items: [
            { name: "Get involved in a community project or charity", points: 20, url: "https://www.volunteering-website.com" },
            { name: "Join BioSoc or other relevant societies", points: 15, url: "https://www.astonsu.com/activities/clubsandsocieties/" },
            { name: "Participate in a skills development workshop", points: 20, url: "https://www.aston.ac.uk/careers/skills-workshop" },
            { name: "Attend networking events, seminars, or talks", points: 25, url: "https://www.aston.ac.uk/careers/events" }
        ],
        explanation: "Year 1 is about building foundational experiences and exploring opportunities that will help you grow personally and professionally."
    },
    "Year 2": {
        availableYears: [2],
        items: [
            { name: "Have a 1-to-1 meeting with the Placement Coordinator", points: 20, url: "https://www.aston.ac.uk/careers/placement" },
            { name: "Attend all placement workshops", points: 25, url: "https://www.aston.ac.uk/careers/workshops" },
            { name: "Attend The Big Careers Fair and speak to 3 employers", points: 30, url: "https://www.aston.ac.uk/careers/careers-fair" },
            { name: "Volunteer at an organisation or project", points: 20, url: "https://www.aston.ac.uk/careers/get-experience" },
            { name: "Network with employers and take a selfie with their stand", points: 10 }
        ],
        explanation: "Year 2 focuses on career preparation, networking with potential employers, and participating in career development events."
    },
    "Year 3": {
        availableYears: [3],
        items: [],
        explanation: "Year 3 is often spent on placement, so the focus is on applying what you've learned to a real-world environment."
    },
    "Year 4": {
        availableYears: [4],
        items: [
            { name: "Apply for 3 graduate programmes", points: 40, url: "https://www.prospects.ac.uk/graduate-jobs" },
            { name: "Attend a meeting with a Careers Consultant", points: 30, url: "https://www.aston.ac.uk/careers/consultants" },
            { name: "Research employers or postgraduate courses", points: 20, url: "https://www.prospects.ac.uk/postgraduate-courses" },
            { name: "Connect with alumni on LinkedIn and professionals in your field", points: 20, url: "https://www.linkedin.com" },
            { name: "Mentor a Year 1 or 2 student", points: 30, url: "https://www.aston.ac.uk/mentoring" },
            { name: "Record a video overview of your placement experience", points: 25, url: "https://www.aston.ac.uk/careers/placement-video" },
            { name: "Keep a record of your job applications", points: 15 }
        ],
        explanation: "Year 4 emphasizes the transition to professional life or further education by applying for jobs, connecting with alumni, and reflecting on your placement experience."
    }
};

// Component for displaying a progress bar with enhanced visuals
function ProgressBar({ completed, total }) {
    const percentage = (completed / total) * 100;

    return (
        <div className="progress-bar-container">
            <div
                className="progress-bar"
                style={{ width: `${percentage}%` }}
            ></div>
            <p className="progress-bar-text">{Math.floor(percentage)}% completed</p>
        </div>
    );
}

// Task component with interactive feedback and badges
function Task({ name, points, url, onComplete }) {
    const [isCompleted, setIsCompleted] = useState(false);

    const handleComplete = () => {
        if (!isCompleted) {
            setIsCompleted(true);
            onComplete(points);
            // Trigger confetti for fun interaction
            confetti();
        }
    };

    return (
        <div className={`p-3 border-b border-gray-200 ${isCompleted ? 'bg-green-100' : ''}`}>
            <div className="flex justify-between items-center">
                <div>
                    <h4 className="font-bold">{name}</h4>
                    {url && (
                        <a href={url} target="_blank" className="text-blue-500">
                            Learn more
                        </a>
                    )}
                </div>
                {!isCompleted ? (
                    <button
                        className="complete-task-btn"
                        onClick={handleComplete}
                    >
                        +
                    </button>
                ) : (
                    <span className="completed-badge">✔️ Completed!</span>
                )}
            </div>
        </div>
    );
}

// Main component for displaying categories and tasks
function SkillCategory({ title, data, onTaskComplete }) {
    const [completedTasks, setCompletedTasks] = useState(0);

    const handleTaskComplete = (points) => {
        setCompletedTasks(completedTasks + 1);
        onTaskComplete(points);
    };

    return (
        <div className={`skill-category year-${data.availableYears[0]}`}>
            <div className="skill-category-title">
                <h3 className="text-xl font-bold mb-3">{title}</h3>
            </div>
            <p className="mb-3">{data.explanation}</p>
            {data.items.map((task, index) => (
                <Task key={index} {...task} onComplete={handleTaskComplete} />
            ))}
            <ProgressBar completed={completedTasks} total={data.items.length} />
        </div>
    );
}

// Main app component with gamification and progress tracking
function App() {
    const [totalPoints, setTotalPoints] = useState(0);
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        // Provide task suggestions based on what's not completed
        const incompleteTasks = Object.keys(skillData).flatMap((category) =>
            skillData[category].items.filter((item) => !item.completed)
        );
        setSuggestions(incompleteTasks);
    }, [totalPoints]);

    const handleTaskComplete = (points) => {
        setTotalPoints(totalPoints + points);
    };

    return (
        <div className="container mx-auto mt-10">
            {Object.keys(skillData).map((category) => (
                <div className="year-section" key={category}>
                    <h2>{category}</h2>
                    <SkillCategory
                        title={category}
                        data={skillData[category]}
                        onTaskComplete={handleTaskComplete}
                    />
                </div>
            ))}
            <div className="mt-10">
                <h3 className="text-xl font-bold">Suggestions for you:</h3>
                {suggestions.length > 0 ? (
                    suggestions.slice(0, 3).map((task, index) => (
                        <p key={index}>{task.name}</p>
                    ))
                ) : (
                    <p>You're doing great! Keep completing tasks to build your CV.</p>
                )}
            </div>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
