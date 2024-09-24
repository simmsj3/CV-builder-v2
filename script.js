console.log("Script is running");

const { useState, useEffect } = React;

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
            { name: "Volunteer in a community project, charity or organization", points: 50 }
        ],
        explanation: "Work experience and volunteering develop professional skills and demonstrate responsibility and community engagement."
    },
    "Extracurricular Activities": {
        availableYears: [1, 2, 3, 4],
        items: [
            { name: "Join BioSoc or other relevant society", points: 25, url: "https://www.astonsu.com/activities/clubsandsocieties/" },
            { name: "Take on a leadership role", points: 50 }
        ],
        explanation: "Joining relevant societies helps you network with peers and develop skills specific to your field."
    },
    "Skills Development": {
        availableYears: [1, 2, 3, 4],
        items: [
            { name: "Improve top 10 in-demand skills (list to be updated)", points: 40 },
            { name: "Take online course (e.g., bioinformatics)", points: 30 }
        ],
        explanation: "Developing skills that are in high demand by employers increases your employability."
    },
    "External Events": {
        availableYears: [1, 2, 3, 4],
        items: [
            { name: "Attend networking event", points: 20 },
            { name: "Attend seminar or inaugural professorial talk", points: 15 }
        ],
        explanation: "Attending events outside your curriculum broadens your knowledge and professional network."
    },
    "Networking": {
        availableYears: [1, 2, 3, 4],
        items: [
            { name: "Attend career fairs", points: 20, url: "https://www.aston.ac.uk/careers/find-a-job/researching-employers" },
            { name: "Connect with alumni", points: 25 }
        ],
        explanation: "Building a professional network early can lead to opportunities later. It also helps you learn about different career paths in biochemistry."
    },
    "Placement Preparation": {
        availableYears: [2],
        items: [
            { name: "Have a 1-to-1 meeting with Placement Coordinator", points: 30 },
            { name: "Attend all Placement Workshops", points: 40 },
            { name: "Attend The Big Careers Fair and speak to 3 employers", points: 50 },
            { name: "Take selfie with employer rep at career fair", points: 10, bonus: true }
        ],
        explanation: "Preparing for your placement year is crucial for securing valuable work experience."
    },
    "Final Year Preparation": {
        availableYears: [4],
        items: [
            { name: "Apply for 3 graduate programmes", points: 60 },
            { name: "Attend meeting with Careers Consultant", points: 30 },
            { name: "Research employers/opportunities or postgraduate courses", points: 40 },
            { name: "Connect with Alumni on LinkedIn", points: 20 },
            { name: "Mentor a Year 1 or 2 student", points: 50 },
            { name: "Record placement experience overview and tips", points: 40 },
            { name: "Keep record of job applications", points: 30 }
        ],
        explanation: "Preparing for life after graduation involves a mix of job searching, networking, and sharing your experiences."
    }
};

const levelThresholds = [100, 250, 500, 1000];

const checkForAwards = (totalPoints) => {
    const awards = [
        { points: 100, name: "Bronze Achievement" },
        { points: 250, name: "Silver Achievement" },
        { points: 500, name: "Gold Achievement" },
        { points: 1000, name: "Platinum Achievement" }
    ];
    return awards.filter(award => totalPoints >= award.points);
};

const SkillNode = ({ title, items, explanation, onAddEntry, onRemoveEntry, entries, currentYear }) => {
    const [showExplanation, setShowExplanation] = useState(false);

    const getDaysSinceLastEntry = (itemEntries) => {
        if (itemEntries.length === 0) return 0;
        const lastEntryDate = new Date(itemEntries[itemEntries.length - 1].date);
        const today = new Date();
        return Math.floor((today - lastEntryDate) / (1000 * 60 * 60 * 24));
    };

    return (
        <div className="skill-node p-4 border rounded-lg bg-white shadow-md">
            <h3 className="font-bold text-lg mb-3">{title}</h3>
            <button 
                onClick={() => setShowExplanation(!showExplanation)}
                className="text-blue-500 mb-2"
            >
                {showExplanation ? 'Hide' : 'Show'} Explanation
            </button>
            {showExplanation && (
                <p className="text-sm mb-3 animate-slide-in">
                    {explanation}
                </p>
            )}
            <ul className="text-sm text-gray-600 space-y-4">
                {items.map((item, index) => {
                    const daysSinceLastEntry = getDaysSinceLastEntry(entries[item.name]);
                    const isOverdue = item.periodic && daysSinceLastEntry > item.periodDays;
                    const emphasizeYear2 = currentYear === 2 && title === "Placement Preparation";
                    const progress = (entries[item.name].length * item.points) / (item.points * 5); // Assume max 5 entries
                    return (
                        <li key={index} className={emphasizeYear2 ? "font-bold" : ""}>
                            <div className="flex justify-between items-center">
                                <span>
                                    {item.name} ({item.points} pts)
                                    {item.bonus && <span className="text-yellow-500 ml-2">(Bonus)</span>}
                                    {item.url && (
                                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-500">
                                            Learn More
                                        </a>
                                    )}
                                </span>
                                <button 
                                    onClick={() => onAddEntry(title, item.name)}
                                    className="bg-green-500 text-white p-1 rounded-full"
                                >
                                    +
                                </button>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
                                <div className="bg-blue-600 h-2.5 rounded-full progress-bar" style={{ width: `${progress * 100}%` }}></div>
                            </div>
                            {isOverdue && (
                                <span className="text-red-500 text-xs">
                                    Overdue! ({daysSinceLastEntry} days since last entry)
                                </span>
                            )}
                            {entries[item.name] && entries[item.name].map((entry, entryIndex) => (
                                <div key={entryIndex} className="ml-4 mt-2 flex items-center justify-between animate-slide-in">
                                    <span>{entry.name} - {entry.date}</span>
                                    <button 
                                        onClick={() => onRemoveEntry(title, item.name, entryIndex)} 
                                        className="text-red-500"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

const SkillTree = () => {
    const [currentYear, setCurrentYear] = useState(1);
    const [skills, setSkills] = useState(() => {
        const initialSkills = {};
        Object.keys(skillData).forEach(skillTitle => {
            initialSkills[skillTitle] = {
                ...skillData[skillTitle],
                entries: skillData[skillTitle].items.reduce((acc, item) => {
                    acc[item.name] = [];
                    return acc;
                }, {})
            };
        });
        return initialSkills;
    });
    const [totalPoints, setTotalPoints] = useState(0);
    const [level, setLevel] = useState(0);
    const [awards, setAwards] = useState([]);

    useEffect(() => {
        const newLevel = levelThresholds.findIndex(threshold => totalPoints < threshold);
        const newAwards = checkForAwards(totalPoints);
        if (newLevel !== level || newAwards.length > awards.length) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
        setLevel(newLevel === -1 ? levelThresholds.length : newLevel);
        setAwards(newAwards);
    }, [totalPoints, level, awards]);

    const resetProgress = () => {
        setSkills(prevSkills => {
            const resetSkills = {};
            Object.keys(prevSkills).forEach(skillTitle => {
                resetSkills[skillTitle] = {
                    ...prevSkills[skillTitle],
                    entries: Object.keys(prevSkills[skillTitle].entries).reduce((acc, itemName) => {
                        acc[itemName] = [];
                        return acc;
                    }, {})
                };
            });
            return resetSkills;
        });
        setTotalPoints(0);
        setCurrentYear(1);
    };

    const addEntry = (skillTitle, itemName) => {
        const entryName = prompt("Enter a name for this entry:");
        const entryDate = prompt("Enter the date of completion (YYYY-MM-DD):");
        if (entryName && entryDate) {
            setSkills(prevSkills => {
                const newSkills = { ...prevSkills };
                const newEntry = { name: entryName, date: entryDate };
                newSkills[skillTitle].entries[itemName].push(newEntry);
                const item = newSkills[skillTitle].items.find(item => item.name === itemName);
                const itemPoints = item.points;
                const bonusPoints = item.bonus ? itemPoints : 0;
                setTotalPoints(prev => prev + itemPoints + bonusPoints);
                return newSkills;
            });
        }
    };

    const removeEntry = (skillTitle, itemName, entryIndex) => {
        setSkills(prevSkills => {
            const newSkills = { ...prevSkills };
            newSkills[skillTitle].entries[itemName].splice(entryIndex, 1);
            const item = newSkills[skillTitle].items.find(item => item.name === itemName);
            const itemPoints = item.points;
            const bonusPoints = item.bonus ? itemPoints : 0;
            setTotalPoints(prev => prev - itemPoints - bonusPoints);
            return newSkills;
        });
    };

    const visibleSkills = Object.keys(skills).filter(skillTitle => 
        skills[skillTitle].availableYears.includes(currentYear)
    );

    return (
        <div className="p-6 max-w-6xl mx-auto bg-gray-100 shadow-lg rounded-xl">
            <div className="flex justify-between items-center mb-6 animate-slide-in">
                <h2 className="text-3xl font-bold text-blue-600">Biochemistry CV Skill Tree</h2>
                <div className="flex items-center space-x-4">
                    <button 
                        onClick={() => setCurrentYear(prev => Math.max(1, prev - 1))} 
                        disabled={currentYear === 1}
                        className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
                    >
                        ◀
                    </button>
                    <span className="text-xl font-semibold">Year {currentYear}</span>
                    <button 
                        onClick={() => setCurrentYear(prev => Math.min(4, prev + 1))} 
                        disabled={currentYear === 4}
                        className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
                    >
                        ▶
                    </button>
                    <button 
                        onClick={resetProgress} 
                        className="ml-4 p-2 bg-red-500 text-white rounded-full"
                    >
                        ↺
                    </button>
                </div>
            </div>
            <div className="mb-4 text-xl font-semibold animate-slide-in">
                Total Points: {totalPoints} | Level: {level}
                {level < levelThresholds.length && (
                    <span> (Next level at {levelThresholds[level]} points)</span>
                )}
            </div>
            {awards.length > 0 && (
                <div className="mb-4 animate-slide-in">
                    <h3 className="text-lg font-bold">Awards Earned:</h3>
                    <div className="flex flex-wrap">
                        {awards.map(award => (
                            <span key={award.name} className="award">{award.name}</span>
                        ))}
                    </div>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleSkills.map(skillTitle => (
                    <SkillNode
                        key={skillTitle}
                        title={skillTitle}
                        items={skills[skillTitle].items}
                        explanation={skills[skillTitle].explanation}
                        entries={skills[skillTitle].entries}
                        onAddEntry={addEntry}
                        onRemoveEntry={removeEntry}
                        currentYear={currentYear}
                    />
                ))}
            </div>
        </div>
    );
};

console.log("Rendering SkillTree component");
ReactDOM.render(React.createElement(SkillTree), document.getElementById('root'));
