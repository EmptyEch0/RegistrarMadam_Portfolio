// Real 5-unit QLearn courses mirrored from the instructor's GitHub course sites:
//   https://github.com/gjayasuma/QC  https://github.com/gjayasuma/Data-Science  https://github.com/gjayasuma/IOT
// PDFs are linked (not copied) from GitHub Pages, so updating a PDF in a repo updates QLearn too.

type Quiz = { question: string; options: string[]; correctAnswer: number; explanation: string };
type Extra = { id: string; title: string; description: string; url: string; embedUrl?: string };

type UnitSpec = {
  name: string;
  topics: string[];
  outcomes: string[];
  duration: string;
  quiz: Quiz[];
  extraNotes?: Extra[];
  extraPpts?: Extra[];
};

type CourseSpec = {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  glowColor: string;
  references: string;
  files: (unit: number) => { notes: string; slides: string; slidesDownload?: string; worksheet: string; comics?: string };
  units: UnitSpec[];
};

const NOTE_IMAGE = "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800";
const ROMAN = ["I", "II", "III", "IV", "V"];

const pdfNote = (id: string, title: string, description: string, url: string, embedUrl = url) => ({
  id, title, description, imageUrl: NOTE_IMAGE, docUrl: url, embedUrl,
});

function buildCourse(c: CourseSpec) {
  return {
    id: c.id,
    name: c.name,
    icon: c.icon,
    description: c.description,
    color: c.color,
    glowColor: c.glowColor,
    modules: c.units.map((u, i) => {
      const n = i + 1;
      const f = c.files(n);
      const short = u.name.replace(/^Unit [IVX]+:\s*/, "");
      return {
        id: `unit-${n}`,
        name: u.name,
        description: `Topics: ${u.topics.join(", ")}`,
        syllabus: u.topics.map((t, k) => `${k + 1}. ${t}`).join("\n"),
        learningOutcomes: u.outcomes.join("\n"),
        duration: u.duration,
        referenceMaterials: c.references,
        videos: [],
        notes: [
          pdfNote(`${c.id}-u${n}-notes`, `Unit ${ROMAN[i]}: Study Notes`, `Complete study notes for ${short}.`, f.notes),
          pdfNote(`${c.id}-u${n}-worksheet`, `Unit ${ROMAN[i]}: Worksheet`, `Practice worksheet for ${short}.`, f.worksheet),
          ...(f.comics
            ? [pdfNote(`${c.id}-u${n}-comics`, `Unit ${ROMAN[i]}: Concept Comics`, `Illustrated comic walkthrough of ${short}.`, f.comics)]
            : []),
          ...(u.extraNotes || []).map((x) => pdfNote(x.id, x.title, x.description, x.url, x.embedUrl)),
        ],
        ppts: [
          {
            id: `${c.id}-u${n}-slides`,
            title: `Unit ${ROMAN[i]}: Lecture Slides`,
            pptUrl: f.slidesDownload || f.slides,
            embedUrl: f.slides,
            description: `Lecture slides for ${short}.`,
            slideCount: "Unit Slides (PDF)",
          },
          ...(u.extraPpts || []).map((x) => ({
            id: x.id, title: x.title, pptUrl: x.url, embedUrl: x.embedUrl || x.url, description: x.description, slideCount: "Course Slides",
          })),
        ],
        quiz: u.quiz,
      };
    }),
  };
}

const q = (question: string, options: string[], correctAnswer: number, explanation: string): Quiz => ({
  question, options, correctAnswer, explanation,
});

// ---------------------------------------------------------------- Quantum Computing
const QC = "https://gjayasuma.github.io/QC/pdfs";
const QC_SYLLABUS_DOC = "https://docs.google.com/document/d/1W-zkE-9D6FP_vVpaBzZuz0ShoPGKN2gH";

export const QC_COURSE = buildCourse({
  id: "quantum-computing",
  name: "Quantum Computing",
  icon: "⚛️",
  description: "5-unit B.Tech course (Dept. of IT, JNTUGV-CEV): qubits, gates & circuits, quantum algorithms, Qiskit programming and applications.",
  color: "from-blue-600 to-indigo-700",
  glowColor: "rgba(59, 130, 246, 0.4)",
  references: "Course Study Notes, Slides & Worksheets by Prof. G. Jaya Suma (github.com/gjayasuma/QC)",
  files: (n) => ({ notes: `${QC}/Study-Notes-Unit-${n}.pdf`, slides: `${QC}/Slides-Unit-${n}.pdf`, worksheet: `${QC}/Worksheet-Unit-${n}.pdf` }),
  units: [
    {
      name: "Unit I: Foundations of Quantum Mechanics for Computing",
      duration: "5 Hours",
      topics: ["Complex Numbers and Linear Algebra", "Dirac Notation", "Qubits and Superposition", "Phase and Interference", "Bloch Sphere", "Measurement", "Multi-Qubit States", "Entanglement"],
      outcomes: ["Represent qubit states using Dirac notation and the Bloch sphere", "Compute measurement probabilities for single- and multi-qubit states", "Distinguish product states from entangled states"],
      extraNotes: [{ id: "quantum-computing-syllabus", title: "Course Syllabus", description: "Official Quantum Computing course syllabus.", url: `${QC_SYLLABUS_DOC}/edit`, embedUrl: `${QC_SYLLABUS_DOC}/preview` }],
      quiz: [
        q("A qubit state α|0⟩ + β|1⟩ must satisfy which condition?", ["α + β = 1", "|α|² + |β|² = 1", "α = β", "α · β = 0"], 1, "Amplitudes are normalised: the measurement probabilities |α|² and |β|² must sum to 1."),
        q("Measuring the state |+⟩ = (|0⟩ + |1⟩)/√2 in the computational basis gives 0 with probability:", ["0", "1/4", "1/2", "1"], 2, "Both amplitudes are 1/√2, so each outcome occurs with probability (1/√2)² = 1/2."),
      ],
    },
    {
      name: "Unit II: Quantum Gates and Circuits",
      duration: "5 Hours",
      topics: ["Unitary and Reversible Computing", "Pauli Gates", "Hadamard, S and T Gates", "Rotation Gates", "Multi-Qubit Gates", "Universal Gate Sets", "Bell States", "Quantum Teleportation", "Superdense Coding"],
      outcomes: ["Apply single- and multi-qubit gates to quantum states", "Construct Bell states and simple quantum circuits", "Explain teleportation and superdense coding protocols"],
      quiz: [
        q("Applying a Hadamard gate to |0⟩ produces:", ["|1⟩", "(|0⟩ + |1⟩)/√2", "(|0⟩ − |1⟩)/√2", "|0⟩"], 1, "H|0⟩ = |+⟩ = (|0⟩ + |1⟩)/√2, an equal superposition."),
        q("Teleporting one qubit uses a shared Bell pair plus how many classical bits?", ["0", "1", "2", "3"], 2, "Alice sends her two measurement results (2 classical bits) so Bob can apply the correcting X/Z gates."),
      ],
    },
    {
      name: "Unit III: Quantum Algorithms",
      duration: "5 Hours",
      topics: ["Oracles and Phase Kickback", "Deutsch Algorithm", "Deutsch–Jozsa Algorithm", "Bernstein–Vazirani Algorithm", "Simon's Algorithm"],
      outcomes: ["Explain how oracles and phase kickback encode functions", "Trace the Deutsch–Jozsa and Bernstein–Vazirani algorithms", "Compare quantum and classical query complexity"],
      quiz: [
        q("The Deutsch–Jozsa algorithm decides whether f is constant or balanced using how many oracle queries?", ["1", "2", "n", "2ⁿ⁻¹ + 1"], 0, "A single query on a superposition of all inputs suffices, versus up to 2ⁿ⁻¹ + 1 classically."),
        q("Phase kickback in oracle-based algorithms means:", ["The oracle measures the input", "The function value appears as a phase on the input register", "The target qubit is reset", "Noise flips the phase"], 1, "With the target in |−⟩, the oracle multiplies the input state by (−1)^f(x), kicking the result into the phase."),
      ],
    },
    {
      name: "Unit IV: Quantum Programming and Simulation Platforms",
      duration: "5 Hours",
      topics: ["Qiskit", "Cirq", "Q#", "PennyLane", "Amazon Braket", "OpenQASM", "Simulators vs Real Hardware", "Noise and Decoherence", "Error Mitigation", "Introduction to Quantum Error Correction"],
      outcomes: ["Build and run quantum circuits in Qiskit and other SDKs", "Compare simulator results with noisy hardware runs", "Explain decoherence, error mitigation and the idea of error correction"],
      quiz: [
        q("OpenQASM is best described as:", ["A quantum hardware vendor", "An assembly-like language for describing quantum circuits", "A classical database", "A Python plotting library"], 1, "OpenQASM is an intermediate representation for quantum circuits, used by Qiskit and IBM hardware."),
        q("Decoherence refers to:", ["Adding more qubits", "Loss of quantum information through interaction with the environment", "Compiling a circuit", "Entangling two qubits"], 1, "Environmental interaction destroys superposition and entanglement over time, a key source of hardware errors."),
      ],
    },
    {
      name: "Unit V: Quantum Computing Applications and Emerging Trends",
      duration: "5 Hours",
      topics: ["Quantum Key Distribution (BB84, E91)", "Post-Quantum Cryptography", "Quantum Machine Learning", "Optimization and Quantum Annealing", "Quantum Chemistry", "Industry and Careers"],
      outcomes: ["Explain how QKD detects eavesdropping", "Contrast quantum cryptography with post-quantum cryptography", "Identify application areas and career paths in quantum computing"],
      quiz: [
        q("BB84 detects an eavesdropper because:", ["Photons travel faster than light", "Measuring a qubit in the wrong basis disturbs it, raising the error rate", "Keys are encrypted with RSA", "The channel is wired"], 1, "Eve cannot copy unknown states (no-cloning); her measurements introduce detectable errors."),
        q("Post-quantum cryptography refers to:", ["Cryptography run on quantum computers", "Classical algorithms believed secure against quantum attacks", "Breaking RSA with Shor's algorithm", "Quantum key distribution"], 1, "PQC schemes (e.g. lattice-based) run on classical hardware but resist known quantum attacks."),
      ],
    },
  ],
});

// ---------------------------------------------------------------- Data Science
const DS = "https://gjayasuma.github.io/Data-Science/pdfs";

export const DS_COURSE = buildCourse({
  id: "data-science",
  name: "Data Science",
  icon: "📊",
  description: "Data Science with Python — 5-unit B.Tech course (Dept. of IT, JNTUGV-CEV): Python, data handling, NumPy & Pandas, visualization and machine learning.",
  color: "from-emerald-500 to-teal-700",
  glowColor: "rgba(16, 185, 129, 0.4)",
  references: "Text Books: Learning Python & Programming Python (Mark Lutz, O'Reilly); Python for Data Analysis (Wes McKinney, O'Reilly); Introduction to Machine Learning with Python (Müller & Guido, O'Reilly)",
  files: (n) => ({ notes: `${DS}/Study-Notes-Unit-${n}.pdf`, slides: `${DS}/Slides-Unit-${n}.pdf`, worksheet: `${DS}/Worksheet-Unit-${n}.pdf`, comics: `${DS}/Comics-Unit-${n}.pdf` }),
  units: [
    {
      name: "Unit I: Python Basics and Programming Concepts",
      duration: "10 Hours",
      topics: ["Types and Operations: Numbers, Strings, Lists, Tuples, Dictionaries, Files", "Dynamic Typing", "Statements and Syntax: Assignments, Expressions, Loops, Comprehensions", "Functions: Scopes, Arguments, Advanced Functions", "Modules and Packages", "Classes and OOP: Operator Overloading, Class Design", "Exceptions and Parallel System Tools"],
      outcomes: ["Explain how data is collected, managed and stored for data science (CO1)", "Write Python programs using core types, functions, modules and classes", "Handle errors robustly with exceptions"],
      extraNotes: [{ id: "data-science-syllabus", title: "Course Syllabus", description: "Official Data Science with Python course syllabus.", url: `${DS}/Syllabus.pdf` }],
      quiz: [
        q("Which of these Python types is immutable?", ["list", "dict", "tuple", "set"], 2, "Tuples cannot be changed after creation; lists, dicts and sets are mutable."),
        q("What does [x * x for x in range(3)] evaluate to?", ["[1, 4, 9]", "[0, 1, 4]", "[0, 1, 2]", "[3, 6, 9]"], 1, "range(3) yields 0, 1, 2, and the comprehension squares each value."),
      ],
    },
    {
      name: "Unit II: Python Tools for Data Handling — GUI, APIs, Web Data and Databases",
      duration: "10 Hours",
      topics: ["GUI Programming with Tkinter", "Jupyter Notebook / IPython", "Network Scripting Basics", "REST APIs with requests (JSON, Authentication)", "Web Scraping with BeautifulSoup", "SQL Fundamentals with sqlite3 / SQLAlchemy", "Text and Language Data Handling"],
      outcomes: ["Understand the data scientist's toolkit and its real-world applications (CO2)", "Fetch data from REST APIs and web pages", "Store and query data in SQL databases from Python"],
      quiz: [
        q("Which library is used to call REST APIs and receive JSON responses?", ["Tkinter", "requests", "Matplotlib", "sqlite3"], 1, "requests sends HTTP calls; response.json() parses the JSON body."),
        q("BeautifulSoup is mainly used for:", ["Training ML models", "Parsing HTML to scrape web data", "Drawing GUIs", "Managing databases"], 1, "BeautifulSoup parses HTML/XML so you can extract elements from web pages."),
      ],
    },
    {
      name: "Unit III: Pandas and NumPy",
      duration: "12 Hours",
      topics: ["NumPy Basics: Fast Element-wise Array Functions", "Multidimensional Arrays", "Data Processing Using Arrays", "File I/O with Arrays", "Pandas Data Structures: Series and DataFrame", "Essential Functionality", "Descriptive Statistics", "Handling Missing Data", "Hierarchical Indexing"],
      outcomes: ["Discuss NumPy, Pandas and Matplotlib and how to use them for data analysis (CO3)", "Perform vectorised computations on arrays", "Clean and summarise tabular data with Pandas"],
      quiz: [
        q("Which Pandas method detects missing values?", ["df.dropna()", "df.isna()", "df.fillna()", "df.describe()"], 1, "isna() (alias isnull()) returns a boolean mask of missing entries; dropna/fillna then act on them."),
        q("The main advantage of NumPy arrays over Python lists for numeric work is:", ["They can hold mixed types", "Fast vectorised element-wise operations without Python loops", "They are always sorted", "They use less code to print"], 1, "NumPy executes operations in compiled code over contiguous memory, avoiding slow Python loops."),
      ],
    },
    {
      name: "Unit IV: Data Preprocessing and Visualization",
      duration: "12 Hours",
      topics: ["Data Loading, Storage and File Formats", "Interacting with HTML, Web APIs and Databases", "Data Wrangling: Clean, Transform, Merge, Reshape", "Reshaping and Pivoting, String Manipulation", "Data Aggregation and GroupBy Operations", "Pivot Tables and Cross Tabulation", "Matplotlib API Primer", "Statistical Visualization with Seaborn", "Time Series and Case Studies"],
      outcomes: ["Implement data collection, preprocessing and visualization scripts with Pandas and Matplotlib (CO4)", "Merge, reshape and aggregate datasets", "Communicate insights through effective charts"],
      quiz: [
        q("pd.merge() is used to:", ["Plot two columns", "Combine DataFrames on common keys, like an SQL join", "Remove duplicates", "Sort a DataFrame"], 1, "merge performs database-style joins (inner, left, right, outer) on key columns."),
        q("df.groupby('dept')['salary'].mean() follows which pattern?", ["Map-reduce-filter", "Split-apply-combine", "Extract-load-transform", "Train-test-split"], 1, "Rows are split by group, the mean is applied per group, and results are combined."),
      ],
    },
    {
      name: "Unit V: Machine Learning for Data Science",
      duration: "12 Hours",
      topics: ["Types of Learning: Supervised, Unsupervised, Reinforcement", "The Machine Learning Workflow", "Feature Engineering and Scaling", "Train-Test Split and Cross-Validation", "Linear & Logistic Regression, k-NN, Decision Trees", "k-Means, Hierarchical Clustering, PCA", "Overfitting/Underfitting and Evaluation Metrics", "Building Models with scikit-learn"],
      outcomes: ["Build and evaluate basic ML models for data science applications in Python (CO5)", "Prepare features and validate models correctly", "Interpret confusion matrix, precision, recall, F1 and ROC"],
      quiz: [
        q("k-Means clustering is an example of:", ["Supervised learning", "Unsupervised learning", "Reinforcement learning", "Semi-supervised regression"], 1, "k-Means groups unlabeled data into k clusters without target labels."),
        q("Precision is defined as:", ["TP / (TP + FN)", "TP / (TP + FP)", "(TP + TN) / Total", "FP / (FP + TN)"], 1, "Precision is the fraction of predicted positives that are actually positive."),
      ],
    },
  ],
});

// ---------------------------------------------------------------- Internet of Things
const IOT = "https://gjayasuma.github.io/IOT/pdfs";

export const IOT_COURSE = buildCourse({
  id: "iot-internet-of-things",
  name: "IoT (Internet of Things)",
  icon: "🌐",
  description: "IoT with Applications — 5-unit B.Tech course (Dept. of IT, JNTUGV-CEV): architecture, communication, platforms, edge/cloud, security and real-world applications.",
  color: "from-cyan-600 to-blue-700",
  glowColor: "rgba(8, 145, 178, 0.4)",
  references: "Course Study Notes, Slides, Question Bank & Lecture Outline by Prof. G. Jaya Suma (github.com/gjayasuma/IOT)",
  files: (n) => ({
    notes: `${IOT}/Study-Notes-Units/Study-Notes-Unit-${n}.pdf`,
    slides: `${IOT}/Slides-PDF/Slides-Unit-${n}.pdf`,
    slidesDownload: `${IOT}/Slides-Units/Slides-Unit-${n}.pptx`,
    worksheet: `${IOT}/Worksheets/Worksheet-Unit-${n}.pdf`,
    comics: `${IOT}/Comic-Images/Comics-Unit-${n}.pdf`,
  }),
  units: [
    {
      name: "Unit I: Introduction to IoT",
      duration: "6 Lectures",
      topics: ["Definition, Characteristics and Evolution of IoT", "IoT vs Internet, M2M and Cyber-Physical Systems", "Components and Enabling Technologies", "Three-layer and Five-layer Architectures", "Edge and Fog Computing Overview", "IoT Devices: Sensors, Actuators, Microcontrollers, RFID, NFC, GPS", "IoT Data: Acquisition, Transmission, Storage, Analytics, Dashboards"],
      outcomes: ["Explain IoT architecture, components and enabling technologies (CO1)", "Differentiate IoT from M2M and cyber-physical systems", "Trace the IoT data journey from sensor to dashboard"],
      extraNotes: [
        { id: "iot-syllabus", title: "Course Syllabus, Lecture Plan & Lab Manual", description: "Official IoT with Applications syllabus with the 30-lecture plan and 15 lab experiments.", url: `${IOT}/Syllabus.pdf` },
        { id: "iot-question-bank", title: "IoT Question Bank (Units I–V)", description: "Question bank covering all five units.", url: `${IOT}/IoT_Question_Bank.pdf` },
        { id: "iot-lecture-outline", title: "Video Lecture Series Outline", description: "Unit-wise headings and timings for the lecture series.", url: `${IOT}/IoT_with_Applications_Lecture_Outline.pdf` },
        // Earlier Google Drive resources for Unit 1 (kept from the previous QLearn content)
        { id: "note-iot-unit1", title: "Unit 1: 4th Year B.Tech IoT Resource Notes", description: "Resource notes document covering Unit 1 topics for 4th Year B.Tech IoT.", url: "https://docs.google.com/document/d/1ZaMRQws02NVIJ07k-u9rcZyoagAbvO7J/edit?usp=sharing&ouid=116710741773817925660&rtpof=true&sd=true", embedUrl: "https://drive.google.com/file/d/1ZaMRQws02NVIJ07k-u9rcZyoagAbvO7J/preview" },
      ],
      extraPpts: [
        { id: "ppt-iot-unit1", title: "Unit 1: 4th Year B.Tech IoT Presentation Slides", description: "Unit 1 presentation slides for 4th Year B.Tech IoT.", url: "https://docs.google.com/presentation/d/1o2oU9JwiQlJHIuvCLhqPq7-u-27D5rUK/edit?usp=sharing&ouid=116710741773817925660&rtpof=true&sd=true", embedUrl: "https://drive.google.com/file/d/1o2oU9JwiQlJHIuvCLhqPq7-u-27D5rUK/preview" },
      ],
      quiz: [
        {
          "question": "What is the primary role of the MQTT protocol in IoT architecture?",
          "options": [
            "Lightweight Publish/Subscribe messaging protocol designed for constrained networks and low-bandwidth devices",
            "Heavyweight Synchronous Remote Procedure Call (RPC) for high-performance computing",
            "Direct P2P Video Streaming and Multi-media distribution protocol",
            "Relational database query protocol for edge servers"
          ],
          "correctAnswer": 0,
          "explanation": "MQTT is a lightweight publish-subscribe messaging protocol ideal for IoT sensors operating in low bandwidth or constrained environments."
        },
        {
          "question": "Which layer of the standard IoT architecture is directly responsible for capturing data from physical sensors and actuators?",
          "options": [
            "Application Layer",
            "Perception / Physical Sensing Layer",
            "Network / Transport Layer",
            "Business & Analytics Layer"
          ],
          "correctAnswer": 1,
          "explanation": "The Perception (or Sensing) Layer consists of sensors, RFID tags, and actuators that physically detect and gather environmental data."
        },
        {
          "question": "In 4th Year B.Tech IoT systems, what is the primary function of an IoT Gateway?",
          "options": [
            "To supply electrical voltage directly to external microcontrollers",
            "To translate communication protocols, aggregate sensor data, and bridge edge devices to the Cloud",
            "To execute complex deep learning model training on raw sensor nodes",
            "To replace physical microprocessors with virtual cloud machines"
          ],
          "correctAnswer": 1,
          "explanation": "An IoT Gateway acts as a bridge between local sensor networks and the internet/cloud, handling protocol conversion, filtering, and data transmission."
        },
        {
          "question": "Which wireless communication technology is specifically optimized for low-power, long-range (LoRaWAN) outdoor IoT deployments?",
          "options": [
            "High-speed Wi-Fi 6 (802.11ax)",
            "LoRa (Long Range RF)",
            "USB 3.1 SuperSpeed",
            "Ethernet CAT6"
          ],
          "correctAnswer": 1,
          "explanation": "LoRa (Long Range) enables long-range transmissions (up to 15+ km) with low power consumption, making it ideal for smart agriculture and remote sensors."
        },
        {
          "question": "What does GPIO stand for on IoT hardware platforms like Raspberry Pi and ESP32?",
          "options": [
            "General Purpose Input/Output",
            "Graphical Processing and Input Operations",
            "Global Positioning and Internet Output",
            "General Protocol for IoT Operations"
          ],
          "correctAnswer": 0,
          "explanation": "GPIO stands for General Purpose Input/Output pins, which allow microcontrollers to interface with digital sensors, switches, LEDs, and relays."
        },
        {
          "question": "Why is Edge/Fog Computing heavily integrated into modern IoT deployments?",
          "options": [
            "To eliminate the need for physical sensors entirely",
            "To process critical sensor data near the source, reducing network latency and bandwidth consumption",
            "To replace cloud data storage with paper logs",
            "To prevent microcontrollers from using electrical power"
          ],
          "correctAnswer": 1,
          "explanation": "Edge and Fog computing perform real-time data processing and analytics locally near IoT devices, reducing latency, cloud bandwidth costs, and network dependence."
        }
      ],
    },
    {
      name: "Unit II: IoT Communication and Networking",
      duration: "6 Lectures",
      topics: ["Short Range: Bluetooth/BLE, Zigbee, RFID, NFC, Wi-Fi", "Long Range: LoRaWAN, NB-IoT, LTE-M, 4G/5G", "Protocols: MQTT, CoAP, HTTP/HTTPS, AMQP, WebSockets", "IPv4 and IPv6, 6LoWPAN", "Wireless Sensor Networks", "Gateways, Addressing and Routing"],
      outcomes: ["Select appropriate communication technologies and protocols (CO2)", "Compare short-range and long-range IoT networks by range, power and bandwidth", "Explain publish-subscribe messaging with MQTT"],
      quiz: [
        q("MQTT follows which communication model?", ["Request–response over a broker-less mesh", "Publish–subscribe through a broker", "Peer-to-peer file sharing", "Client polling over FTP"], 1, "Devices publish to topics on a broker, which forwards messages to subscribers."),
        q("6LoWPAN enables:", ["5G voice calls", "IPv6 packets over low-power wireless personal area networks", "Bluetooth audio streaming", "Wired Ethernet for sensors"], 1, "6LoWPAN compresses IPv6 headers so constrained IEEE 802.15.4 devices can be IP-addressable."),
      ],
    },
    {
      name: "Unit III: IoT Platforms, Edge and Cloud",
      duration: "6 Lectures",
      topics: ["Hardware Platforms: Arduino, ESP32, Raspberry Pi, NodeMCU", "Sensors and Modules", "IoT Cloud Architecture, Device Management, Storage and Analytics", "Edge Computing: Edge vs Cloud, Real-Time Processing", "Edge AI and Fog Computing", "IoT + AI: Anomaly Detection, Predictive Maintenance, Computer Vision"],
      outcomes: ["Develop IoT applications using Arduino/ESP32/Raspberry Pi (CO3)", "Apply cloud and edge computing to IoT data (CO4)", "Design a Sensor → ESP32 → Edge AI → Cloud → Dashboard pipeline"],
      quiz: [
        q("Which board has built-in Wi-Fi and Bluetooth?", ["Arduino Uno", "ESP32", "ATmega328P chip alone", "555 timer"], 1, "The ESP32 integrates Wi-Fi and Bluetooth/BLE, making it popular for connected IoT nodes."),
        q("The main benefit of edge computing in IoT is:", ["Unlimited storage", "Lower latency and bandwidth by processing data near its source", "Removing the need for sensors", "Higher cloud bills"], 1, "Processing locally gives real-time responses and sends only useful data to the cloud."),
      ],
    },
    {
      name: "Unit IV: IoT Security and Data Analytics",
      duration: "6 Lectures",
      topics: ["Security Requirements: Authentication, Authorization, Encryption", "Device, Network and Cloud Security", "Threats: Device Attacks, Eavesdropping, Spoofing, DoS, Malware, Data Leakage", "Data Preprocessing and Time-Series Data", "Visualization, Anomaly Detection and Predictive Analytics", "Blockchain + IoT: Smart Contracts, Data Integrity, Identity Management"],
      outcomes: ["Design secure IoT solutions for real-world applications (CO5)", "Identify common IoT threats and countermeasures", "Apply analytics and ML to IoT time-series data"],
      quiz: [
        q("A spoofing attack in IoT means:", ["Flooding a device with traffic", "Impersonating a legitimate device or identity", "Physically destroying a sensor", "Encrypting sensor data"], 1, "Spoofing fakes an identity (device ID, MAC, IP) to gain trust; strong authentication counters it."),
        q("Blockchain is used with IoT mainly to provide:", ["Faster Wi-Fi", "Tamper-evident data integrity and decentralised trust", "Cheaper sensors", "Longer battery life"], 1, "A shared, append-only ledger makes sensor records and device identities hard to alter."),
      ],
    },
    {
      name: "Unit V: IoT Applications",
      duration: "6 Lectures",
      topics: ["Smart Agriculture", "Healthcare IoT", "Industrial IoT (IIoT) and Digital Twins", "Smart City", "Smart Energy", "Smart Transportation", "Smart Home", "Case Studies and Mini-Projects"],
      outcomes: ["Develop an application-oriented IoT mini-project (CO6)", "Map sensing, networking, computing and security to domain applications", "Evaluate IoT solutions across agriculture, healthcare, industry and cities"],
      quiz: [
        q("In smart agriculture, automatic irrigation is typically triggered by:", ["GPS coordinates", "Soil moisture sensor readings", "RFID tags", "Smart meters"], 1, "When soil moisture drops below a threshold, the controller switches the water pump on."),
        q("A digital twin in Industrial IoT is:", ["A backup server", "A virtual replica of a physical asset kept in sync with real-time sensor data", "A duplicate sensor", "A second factory"], 1, "Digital twins mirror machines so operators can monitor, simulate and predict failures."),
      ],
    },
  ],
});
