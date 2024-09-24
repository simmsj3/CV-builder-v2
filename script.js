console.log("Script is running");

const { useState, useEffect } = React;

// Progress tracking and skill data
const skillData = {
    "Professional Presence": {
        availableYears: [1, 2, 3, 4],
        items: [
            { name: "Set up LinkedIn profile", points: 20, url: "https://www.aston.ac.uk/careers/cv/resource-library" },
            { name: "Create professional email", points: 10 }
        ],
        explanation: "A strong professional online presence showcases your seriousness about your career. LinkedIn allows you to connect with professionals, alumni, and potential employers."
    },
    "Academic Engagement": {
        availableYears: [1, 2, 3, 4],
        items: [
            { name: "Join BioSoc @Aston", points: 30, url: "https://www.astonsu.com/activities/clubsandsocieties/" },
            { name: "Attend departmental seminars", points: 15 },
            { name: "Participate in peer mentoring (2nd year)", points: 40 }
        ],
        explanation: "Engaging in academic activities beyond coursework shows genuine interest in your field and a proactive approach to learning."
    },
    "Work Experience": {
        availableYears: [1, 2, 3, 4],
        items: [
            { name: "Find part-time job", points: 40, url: "https://www.aston.ac.uk/careers/get-experience/part-time-jobs-and-volunteering" },
            { name: "Explore summer internships", points: 60, url: "https://www.aston.ac.uk/careers/get-experience/internships" },
            { name: "Volunteer in a community project", points: 50 }
        ],
        explanation: "Gaining work experience improves your employability, confidence, and real-world skills."
    }
};

// Adding extra tasks to enhance engagement
skillData["Leadership"] = {
    availableYears: [2, 3, 4],
    items: [
        { name: "Lead a student project", points: 50 },
        { name: "Join a leadership training program", points: 40, url: "https://www.aston.ac.uk/careers/leadership-training" }
    ],
    explanation: "Leadership roles demonstrate initiative and the ability to manage teams and projects."
};

skillData["Personal Development"] = {
    availableYears: [1, 2, 3, 4],
    items: [
        { name: "Take an online course", points: 20, url: "https://www.coursera.org" },
        { name: "Read a book related to your field", points: 15 }
    ],
    explanation: "Personal development activities show your dedication to improving yourself and staying updated in your field."
};

// Component for displaying progress
function ProgressBar({ completed, total }) {
    const percentage = (completed / total) * 100;
    return (
        <div className="w-full bg-gray-300 rounded-full h-4">
            <div
                className="bg-blue-500 h-4 rounded-full transition-all"
                style={{ width: `${percentage}%` }}
            ></div>
            <p className="text-sm text-center mt-1">{Math.floor(percentage)}% completed</p>
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
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={handleComplete}
                    >
                        Complete Task
                    </button>
                ) : (
                    <span className="bg-yellow-400 text-black px-2 py-1 rounded-full">✔️ Completed!</span>
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
        <div className="mb-6 p-4 bg-white shadow-lg rounded-lg">
            <h3 className="text-xl font-bold mb-3">{title}</h3>
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
            <h1 className="text-3xl font-bold text-center mb-8">Build Your CV</h1>
            <div className="mb-8">
                <h2 className="text-2xl font-bold">Total Points: {totalPoints}</h2>
                <ProgressBar completed={totalPoints} total={500} />
            </div>
            {Object.keys(skillData).map((category) => (
                <SkillCategory
                    key={category}
                    title={category}
                    data={skillData[category]}
                    onTaskComplete={handleTaskComplete}
                />
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
