console.log("Script is running");

const { useState, useEffect } = React;
const { motion, AnimatePresence } = framerMotion;

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
    "Extracurricular Activities": {
        availableYears: [1, 2, 3, 4],
        items: [
            { name: "Join a university club/society", points: 25, url: "https://www.astonsu.com/activities/clubsandsocieties/" },
            { name: "Take on a leadership role", points: 50 }
        ],
        explanation: "Extracurricular activities develop soft skills like teamwork, communication, and time management. Leadership roles provide valuable experience in organizing and managing people and projects."
    },
    "Work Experience": {
        availableYears: [1, 2, 3, 4],
        items: [
            { name: "Find part-time job", points: 40, url: "https://www.aston.ac.uk/careers/get-experience/part-time-jobs-and-volunteering" },
            { name: "Explore summer internships", points: 60, url: "https://www.aston.ac.uk/careers/get-experience/internships" }
        ],
        explanation: "Work experience, even if not directly related to biochemistry, develops professional skills and demonstrates responsibility and time management."
    },
    "Volunteering": {
        availableYears: [1, 2, 3, 4],
        items: [
            { name: "Volunteer in hospitals/clinics/labs", points: 50, url: "https://www.aston.ac.uk/careers/get-experience/part-time-jobs-and-volunteering" },
            { name: "Participate in science outreach", points: 35 }
        ],
        explanation: "Volunteering shows commitment to your community and your field. It can provide hands-on experience in scientific or healthcare settings."
    },
    "Skills Development": {
        availableYears: [1, 2, 3, 4],
        items: [
            { name: "Take online course (e.g., bioinformatics)", points: 30 },
            { name: "Improve computer skills (Excel, R, Python)", points: 40 }
        ],
        explanation: "Developing technical skills beyond those taught in your courses makes you more versatile and valuable to potential employers."
    },
    "Networking": {
        availableYears: [1, 2, 3, 4],
        items: [
            { name: "Attend career fairs", points: 20, url: "https://www.aston.ac.uk/careers/find-a-job/researching-employers" },
            { name: "Connect with alumni", points: 25 }
        ],
        explanation: "Building a professional network early can lead to opportunities later. It also helps you learn about different career paths in biochemistry."
    },
    "Personal Projects": {
        availableYears: [2, 3, 4],
        items: [
            { name: "Start a science blog", points: 45 },
            { name: "Develop small research project", points: 70 }
        ],
        explanation: "Personal projects showcase your initiative, creativity, and genuine interest in biochemistry beyond coursework."
    },
    "Professional Development": {
        availableYears: [1, 2, 3, 4],
        items: [
            { name: "Attend CV writing workshop", points: 25, url: "https://www.aston.ac.uk/careers/cv" },
            { name: "Participate in mock interviews", points: 35, url: "https://www.aston.ac.uk/careers/cv" }
        ],
        explanation: "These activities help you present yourself more effectively to potential employers."
    },
    "Placement Preparation": {
        availableYears: [1, 2, 3, 4],
        items: [
            { name: "Attend placement information session", points: 30, url: "https://www.aston.ac.uk/careers/placements" },
            { name: "Contact Careers and Placements team", points: 20, url: "https://www.aston.ac.uk/careers/contact-us", periodic: true, periodDays: 90 },
            { name: "Search for placement opportunities", points: 40, url: "https://www.aston.ac.uk/careers/placements", periodic: true, periodDays: 30 },
            { name: "Attend employer presentation", points: 25 }
        ],
        explanation: "Preparing for your placement year is crucial. Regular engagement with the Careers and Placements team and consistent searching for opportunities will greatly enhance your chances of securing a valuable placement."
    }
};

const levelThresholds = [100, 250, 500, 1000];

const Modal = ({ isOpen, onClose, onSubmit, skillTitle, itemName }) => {
    const [entryName, setEntryName] = useState('');
    const [entryDate, setEntryDate] = useState('');

    if (!isOpen) return null;

    return (
        <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div 
                className="bg-white p-6 rounded-lg"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
            >
                <h3 className="text-lg font-bold mb-4">Add Entry for {itemName}</h3>
                <input
                    type="text"
                    placeholder="Entry name"
                    value={entryName}
                    onChange={(e) => setEntryName(e.target.value)}
                    className="w-full p-2 mb-4 border rounded"
                />
                <input
                    type="date"
                    value={entryDate}
                    onChange={(e) => setEntryDate(e.target.value)}
                    className="w-full p-2 mb-4 border rounded"
                />
                <div className="flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                    <button 
                        onClick={() => {
                            onSubmit(skillTitle, itemName, entryName, entryDate);
                            onClose();
                        }} 
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Add Entry
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

const SkillNode = ({ title, items, explanation, onAddEntry, onRemoveEntry, entries, currentYear }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);

    const getDaysSinceLastEntry = (itemEntries) => {
        if (itemEntries.length === 0) return 0;
        const lastEntryDate = new Date(itemEntries[itemEntries.length - 1].date);
        const today = new Date();
        return Math.floor((today - lastEntryDate) / (1000 * 60 * 60 * 24));
    };

    return (
        <motion.div 
            className="p-4 border rounded-lg bg-white shadow-md"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h3 className="font-bold text-lg mb-3">{title}</h3>
            <button 
                onClick={() => setShowExplanation(!showExplanation)}
                className="text-blue-500 mb-2"
            >
                {showExplanation ? 'Hide' : 'Show'} Explanation
            </button>
            <AnimatePresence>
                {showExplanation && (
                    <motion.p 
                        className="text-sm mb-3"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        {explanation}
                    </motion.p>
                )}
            </AnimatePresence>
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
                                    {item.url && (
                                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-500">
                                            Learn More
                                        </a>
                                    )}
                                </span>
                                <button 
                                    onClick={() => {
                                        setSelectedItem(item.name);
                                        setModalOpen(true);
                                    }} 
                                    className="bg-green-500 text-white p-1 rounded-full"
                                >
                                    +
                                </button>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
                                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress * 100}%` }}></div>
                            </div>
                            {isOverdue && (
                                <span className="text-red-500 text-xs">
                                    Overdue! ({daysSinceLastEntry} days since last entry)
                                </span>
                            )}
                            {entries[item.name] && entries[item.name].map((entry, entryIndex) => (
                                <div key={entryIndex} className="ml-4 mt-2 flex items-center justify-between">
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
            <AnimatePresence>
                {modalOpen && (
                    <Modal 
                        isOpen={modalOpen} 
                        onClose={() => setModalOpen(false)} 
                        onSubmit={onAddEntry}
                        skillTitle={title}
                        itemName={selectedItem}
                    />
                )}
            </AnimatePresence>
        </motion.div>
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

    useEffect(() => {
        const newLevel = levelThresholds.findIndex(threshold => totalPoints < threshold);
        setLevel(newLevel === -1 ? levelThresholds.length : newLevel);
    }, [totalPoints]);

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

    const addEntry = (skillTitle, itemName, entryName, entryDate) => {
        setSkills(prevSkills => {
            const newSkills = { ...prevSkills };
            const newEntry = { name: entryName, date: entryDate };
            newSkills[skillTitle].entries[itemName].push(newEntry);
            const itemPoints = newSkills[skillTitle].items.find(item => item.name === itemName).points;
            setTotalPoints(prev => prev + itemPoints);
            return newSkills;
        });
    };

    const removeEntry = (skillTitle, itemName, entryIndex) => {
        setSkills(prevSkills => {
            const newSkills = { ...prevSkills };
            newSkills[skillTitle].entries[itemName].splice(entryIndex, 1);
            const itemPoints = newSkills[skillTitle].items.find(item => item.name === itemName).points;
            setTotalPoints(prev => prev - itemPoints);
            return newSkills;
        });
    };

    const visibleSkills = Object.keys(skills).filter(skillTitle => 
        skills[skillTitle].availableYears.includes(currentYear)
    );

    console.log("Current skills state:", skills);
    console.log("Total points:", totalPoints);
    console.log("Current level:", level);

return (
        <div className="p-6 max-w-6xl mx-auto bg-gray-100 shadow-lg rounded-xl">
            <div className="flex justify-between items-center mb-6">
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
            <div className="mb-4 text-xl font-semibold">
                Total Points: {totalPoints} | Level: {level}
                {level < levelThresholds.length && (
                    <span> (Next level at {levelThresholds[level]} points)</span>
                )}
            </div>
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
