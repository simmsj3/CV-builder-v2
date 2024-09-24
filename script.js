const { useState, useEffect } = React;

const skillsByYear = {
    1: ['Professional Presence', 'Academic Engagement', 'Extracurricular Activities'],
    2: ['Work Experience', 'Volunteering', 'Skills Development'],
    3: ['Networking', 'Personal Projects', 'Professional Development'],
    4: ['All']
};

const initialSkills = {
    'Professional Presence': { 
        items: [
            { name: 'Set up LinkedIn profile', points: 20, entries: [] },
            { name: 'Create professional email', points: 10, entries: [] }
        ],
        totalPoints: 0 
    },
    'Academic Engagement': { 
        items: [
            { name: 'Join BioSoc @Aston', points: 30, entries: [] },
            { name: 'Attend departmental seminars', points: 15, entries: [] },
            { name: 'Participate in peer mentoring (2nd year)', points: 40, entries: [] }
        ],
        totalPoints: 0 
    },
    'Extracurricular Activities': { 
        items: [
            { name: 'Join a university club/society', points: 25, entries: [] },
            { name: 'Take on a leadership role', points: 50, entries: [] }
        ],
        totalPoints: 0 
    },
    'Work Experience': { 
        items: [
            { name: 'Find part-time job', points: 40, entries: [] },
            { name: 'Explore summer internships', points: 60, entries: [] }
        ],
        totalPoints: 0 
    },
    'Volunteering': { 
        items: [
            { name: 'Volunteer in hospitals/clinics/labs', points: 50, entries: [] },
            { name: 'Participate in science outreach', points: 35, entries: [] }
        ],
        totalPoints: 0 
    },
    'Skills Development': { 
        items: [
            { name: 'Take online course (e.g., bioinformatics)', points: 30, entries: [] },
            { name: 'Improve computer skills (Excel, R, Python)', points: 40, entries: [] }
        ],
        totalPoints: 0 
    },
    'Networking': { 
        items: [
            { name: 'Attend career fairs', points: 20, entries: [] },
            { name: 'Connect with alumni', points: 25, entries: [] }
        ],
        totalPoints: 0 
    },
    'Personal Projects': { 
        items: [
            { name: 'Start a science blog', points: 45, entries: [] },
            { name: 'Develop small research project', points: 70, entries: [] }
        ],
        totalPoints: 0 
    },
    'Professional Development': { 
        items: [
            { name: 'Attend CV writing workshop', points: 25, entries: [] },
            { name: 'Participate in mock interviews', points: 35, entries: [] }
        ],
        totalPoints: 0 
    }
};

const Modal = ({ isOpen, onClose, onSubmit, skillTitle, itemName }) => {
    const [entryName, setEntryName] = useState('');
    const [entryDate, setEntryDate] = useState('');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg">
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
            </div>
        </div>
    );
};

const SkillNode = ({ title, items, onAddEntry, onRemoveEntry }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    return (
        <div className="p-4 border rounded-lg bg-white shadow-md">
            <h3 className="font-bold text-lg mb-3">{title}</h3>
            <ul className="text-sm text-gray-600 space-y-4">
                {items.map((item, index) => (
                    <li key={index}>
                        <div className="flex justify-between items-center">
                            <span>{item.name} ({item.points} pts)</span>
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
                        {item.entries.map((entry, entryIndex) => (
                            <div key={entryIndex} className="ml-4 mt-2 flex items-center justify-between">
                                <span>{entry.name} - {entry.date}</span>
                                <button 
                                    onClick={() => onRemoveEntry(title, index, entryIndex)} 
                                    className="text-red-500"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </li>
                ))}
            </ul>
            <Modal 
                isOpen={modalOpen} 
                onClose={() => setModalOpen(false)} 
                onSubmit={onAddEntry}
                skillTitle={title}
                itemName={selectedItem}
            />
        </div>
    );
};

const SkillTree = () => {
    const [currentYear, setCurrentYear] = useState(1);
    const [skills, setSkills] = useState(initialSkills);
    const [totalPoints, setTotalPoints] = useState(0);

    const resetProgress = () => {
        setSkills(initialSkills);
        setTotalPoints(0);
        setCurrentYear(1);
    };

    const addEntry = (skillTitle, itemName, entryName, entryDate) => {
        setSkills(prevSkills => {
            const newSkills = { ...prevSkills };
            const itemIndex = newSkills[skillTitle].items.findIndex(item => item.name === itemName);
            if (itemIndex !== -1) {
                const newEntry = { name: entryName, date: entryDate };
                newSkills[skillTitle].items[itemIndex].entries.push(newEntry);
                newSkills[skillTitle].totalPoints += newSkills[skillTitle].items[itemIndex].points;
                setTotalPoints(prev => prev + newSkills[skillTitle].items[itemIndex].points);
            }
            return newSkills;
        });
    };

    const removeEntry = (skillTitle, itemIndex, entryIndex) => {
        setSkills(prevSkills => {
            const newSkills = { ...prevSkills };
            newSkills[skillTitle].items[itemIndex].entries.splice(entryIndex, 1);
            newSkills[skillTitle].totalPoints -= newSkills[skillTitle].items[itemIndex].points;
            setTotalPoints(prev => prev - newSkills[skillTitle].items[itemIndex].points);
            return newSkills;
        });
    };

    const visibleSkills = currentYear === 4 ? Object.keys(skills) : skillsByYear[currentYear];

    return (
        <div className="p-6 max-w-6xl mx-auto bg-gray-100 shadow-lg rounded-xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-blue-600">Biochemistry CV Skill Tree</h2>
                <div className="flex items-center space-x-4">
                    <button onClick={() => setCurrentYear(prev => Math.max(1, prev - 1))} disabled={currentYear === 1}>
                        ◀
                    </button>
                    <span className="text-xl font-semibold">Year {currentYear}</span>
                    <button onClick={() => setCurrentYear(prev => Math.min(4, prev + 1))} disabled={currentYear === 4}>
                        ▶
                    </button>
                    <button onClick={resetProgress} className="ml-4 p-2 bg-red-500 text-white rounded-full">
                        ↺
                    </button>
                </div>
            </div>
            <div className="mb-4 text-xl font-semibold">Total Points: {totalPoints}</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleSkills.map(skillTitle => (
                    <SkillNode
                        key={skillTitle}
                        title={skillTitle}
                        items={skills[skillTitle].items}
                        onAddEntry={addEntry}
                        onRemoveEntry={removeEntry}
                    />
                ))}
            </div>
        </div>
    );
};

ReactDOM.render(React.createElement(SkillTree), document.getElementById('root'));
