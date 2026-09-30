// Comprehensive Worksheets Dataset for Data Science with Python
// Extracted from official curriculum worksheets

export interface WorksheetConcept {
  id: number;
  concept: string;
  explanation: string;
}

export interface WorksheetTerm {
  id: number;
  term: string;
  definition: string;
}

export interface WorksheetMCQ {
  id: number;
  question: string;
  options: string[];
  correctOption: string;
  correctIndex: number;
  explanation: string;
}

export interface WorksheetFillBlank {
  id: number;
  question: string;
  answer: string;
}

export interface WorksheetTrueFalse {
  id: number;
  statement: string;
  isTrue: boolean;
}

export interface WorksheetMatchItem {
  id: number;
  left: string;
  right: string;
  matchedLetter?: string;
}

export interface WorksheetShortAnswer {
  id: number;
  question: string;
  keyPoint: string;
}

export interface WorksheetDescriptive {
  id: number;
  question: string;
  keyPoint: string;
}

export interface WorksheetPractical {
  title: string;
  problem: string;
  tasks: string[];
  expectedOutput: string;
}

export interface WorksheetCaseStudy {
  scenario: string;
  questions: string[];
  expectedOutcome: string;
}

export interface WorksheetConceptMap {
  title: string;
  branches: { branch: string; topic: string; example: string }[];
}

export interface WorksheetData {
  id: string;
  unitNumber: number;
  title: string;
  unitName: string;
  course: string;
  unit: string;
  duration: string;
  topics: string;
  docxFileName: string | null;
  learningObjectives: string[];
  keyConcepts: WorksheetConcept[];
  terminology: WorksheetTerm[];
  mcqs: WorksheetMCQ[];
  fillInBlanks: WorksheetFillBlank[];
  trueFalse: WorksheetTrueFalse[];
  matchTheFollowing: WorksheetMatchItem[];
  shortAnswerQuestions: WorksheetShortAnswer[];
  descriptiveQuestions: WorksheetDescriptive[];
  practicals: WorksheetPractical[];
  conceptMap: WorksheetConceptMap;
  caseStudy: WorksheetCaseStudy;
  selfAssessment: string[];
  reflection: string[];
  answerKey: {
    mcqs: string[];
    fillInBlanks: string[];
    trueFalse: string[];
    matchKey: string;
    shortAnswer: string[];
    descriptive: string[];
    practicals: string[];
  };
}

export const WORKSHEETS_DATA: WorksheetData[] = [
  {
    "id": "unit-1",
    "unitNumber": 1,
    "title": "WORKSHEET \u2014 UNIT I",
    "unitName": "Python Basics and Programming Concepts",
    "course": "Data Science with Python",
    "unit": "I (10 Hrs)",
    "duration": "10 Hrs",
    "topics": "Types and Operations; Statements and Syntax; Functions; Modules and Packages; Classes and OOP; Exceptions and Tools",
    "docxFileName": null,
    "learningObjectives": [
      "Explain basic Python data types, operators, and dynamic typing principles.",
      "Apply control flow statements including if-elif-else conditionals, while loops, and for loops.",
      "Design modular Python functions using positional, keyword, and variable arguments (*args, **kwargs).",
      "Implement Python modules and organize code using packages and namespaces.",
      "Construct object-oriented Python classes utilizing inheritance, encapsulation, and special methods.",
      "Handle runtime errors robustly using try-except-finally blocks and custom exceptions."
    ],
    "keyConcepts": [
      {
        "id": 1,
        "concept": "Dynamic Typing",
        "explanation": "Variables are bound to objects at runtime without explicit type declarations."
      },
      {
        "id": 2,
        "concept": "Mutability",
        "explanation": "Mutable objects (lists, dicts) can be changed in place; immutable objects (strings, tuples) cannot."
      },
      {
        "id": 3,
        "concept": "List Comprehensions",
        "explanation": "Concise syntax for generating new lists by applying expressions to existing iterables."
      },
      {
        "id": 4,
        "concept": "First-Class Functions",
        "explanation": "Functions can be passed as arguments, returned from other functions, and assigned to variables."
      },
      {
        "id": 5,
        "concept": "Namespaces & Scopes",
        "explanation": "LEGB rule (Local, Enclosing, Global, Built-in) governing variable lookup resolution."
      },
      {
        "id": 6,
        "concept": "OOP & Encapsulation",
        "explanation": "Bundling data attributes and member methods into classes with controlled access."
      },
      {
        "id": 7,
        "concept": "Inheritance & Polymorphism",
        "explanation": "Creating child classes that inherit and customize parent class behavior."
      },
      {
        "id": 8,
        "concept": "Exception Handling",
        "explanation": "Structured error management with try, except, else, and finally clauses."
      }
    ],
    "terminology": [
      {
        "id": 1,
        "term": "Python",
        "definition": "A high-level, interpreted, general-purpose programming language emphasizing readability."
      },
      {
        "id": 2,
        "term": "Type Hierarchy",
        "definition": "The built-in system of primitives, sequences, mappings, sets, and custom objects in Python."
      },
      {
        "id": 3,
        "term": "Tuple",
        "definition": "An immutable sequence of heterogeneous Python objects enclosed in parentheses."
      },
      {
        "id": 4,
        "term": "Dictionary",
        "definition": "A mutable, unordered/insertion-ordered mapping of unique keys to arbitrary values."
      },
      {
        "id": 5,
        "term": "Lambda",
        "definition": "An anonymous inline function defined using the lambda keyword."
      },
      {
        "id": 6,
        "term": "Generator",
        "definition": "A memory-efficient iterator function that yields values on demand using the yield statement."
      },
      {
        "id": 7,
        "term": "Decorator",
        "definition": "A callable that takes another function and extends its behavior without modifying its source."
      },
      {
        "id": 8,
        "term": "Dunder Methods",
        "definition": "Double-underscore special methods (__init__, __str__, __len__) enabling operator overloading."
      },
      {
        "id": 9,
        "term": "Module",
        "definition": "A single Python file containing definitions, functions, and runnable code."
      },
      {
        "id": 10,
        "term": "Package",
        "definition": "A directory containing multiple modules and an __init__.py initialization file."
      },
      {
        "id": 11,
        "term": "Global Keyword",
        "definition": "Declaration allowing functions to modify variables in the module-level global namespace."
      },
      {
        "id": 12,
        "term": "Exception",
        "definition": "An event triggered during execution that disrupts normal instruction flow."
      },
      {
        "id": 13,
        "term": "Traceback",
        "definition": "A report containing the sequence of function calls leading up to an unhandled exception."
      },
      {
        "id": 14,
        "term": "Self Parameter",
        "definition": "Explicit reference to the current instance of a class passed to method calls."
      },
      {
        "id": 15,
        "term": "Docstring",
        "definition": "String literal occurring as the first statement in a module, function, or class for documentation."
      }
    ],
    "mcqs": [
      {
        "id": 1,
        "question": "Which of the following built-in types is immutable in Python?",
        "options": [
          "List",
          "Dictionary",
          "Tuple",
          "Set"
        ],
        "correctOption": "C",
        "correctIndex": 2,
        "explanation": "Tuples are immutable; once created, their elements cannot be modified."
      },
      {
        "id": 2,
        "question": "What is the output of bool([]) in Python?",
        "options": [
          "True",
          "False",
          "None",
          "Error"
        ],
        "correctOption": "B",
        "correctIndex": 1,
        "explanation": "Empty collections (lists, tuples, dicts, strings) evaluate to False in boolean context."
      },
      {
        "id": 3,
        "question": "Which scope rule defines the lookup order for variables in Python?",
        "options": [
          "LIFO",
          "FIFO",
          "LEGB",
          "SOLID"
        ],
        "correctOption": "C",
        "correctIndex": 2,
        "explanation": "Python resolves names using Local -> Enclosing -> Global -> Built-in (LEGB)."
      },
      {
        "id": 4,
        "question": "How are variable keyword arguments accepted in a Python function definition?",
        "options": [
          "*args",
          "**kwargs",
          "&params",
          "$kwargs"
        ],
        "correctOption": "B",
        "correctIndex": 1,
        "explanation": "**kwargs captures arbitrary named arguments into a dictionary."
      },
      {
        "id": 5,
        "question": "What does the 'is' operator test for in Python?",
        "options": [
          "Value equality",
          "Object identity (same memory address)",
          "Data type similarity",
          "Subclass relationship"
        ],
        "correctOption": "B",
        "correctIndex": 1,
        "explanation": "'is' checks whether two variables refer to the exact same object in memory."
      },
      {
        "id": 6,
        "question": "Which method is invoked automatically when a new object instance is created in Python?",
        "options": [
          "__new__",
          "__init__",
          "__start__",
          "__main__"
        ],
        "correctOption": "B",
        "correctIndex": 1,
        "explanation": "__init__ acts as the class initializer/constructor."
      },
      {
        "id": 7,
        "question": "What happens if an exception is not caught in a try-except block?",
        "options": [
          "Program ignores it and continues",
          "Program terminates with a traceback",
          "Python compiles it into byte-code",
          "Variable is set to None"
        ],
        "correctOption": "B",
        "correctIndex": 1,
        "explanation": "Unhandled exceptions bubble up to the interpreter and terminate execution with a traceback."
      },
      {
        "id": 8,
        "question": "Which keyword is used to create a generator function?",
        "options": [
          "return",
          "yield",
          "generate",
          "iter"
        ],
        "correctOption": "B",
        "correctIndex": 1,
        "explanation": "The 'yield' statement produces a value and suspends execution until the next value is requested."
      },
      {
        "id": 9,
        "question": "What is the purpose of the __name__ == '__main__' idiom?",
        "options": [
          "To define class variables",
          "To execute code only when the file is run directly",
          "To import standard library modules",
          "To speed up loop execution"
        ],
        "correctOption": "B",
        "correctIndex": 1,
        "explanation": "It allows a module to act both as an importable library and as a standalone executable script."
      },
      {
        "id": 10,
        "question": "Which block in exception handling executes regardless of whether an exception occurred?",
        "options": [
          "try",
          "except",
          "else",
          "finally"
        ],
        "correctOption": "D",
        "correctIndex": 3,
        "explanation": "The finally block always runs, making it ideal for cleanup operations like closing files."
      }
    ],
    "fillInBlanks": [
      {
        "id": 1,
        "question": "In Python, strings and tuples are __________ data types.",
        "answer": "immutable"
      },
      {
        "id": 2,
        "question": "The __________ statement allows a function to produce a sequence of values lazily.",
        "answer": "yield"
      },
      {
        "id": 3,
        "question": "The special first argument in Python instance methods is conventionally named __________.",
        "answer": "self"
      },
      {
        "id": 4,
        "question": "The __________ block executes only if NO exceptions were raised in the try block.",
        "answer": "else"
      },
      {
        "id": 5,
        "question": "A directory must contain an __________ file to be recognized as a standard package in older Python versions.",
        "answer": "__init__.py"
      }
    ],
    "trueFalse": [
      {
        "id": 1,
        "statement": "Python lists can contain elements of multiple different data types.",
        "isTrue": true
      },
      {
        "id": 2,
        "statement": "A function in Python cannot return multiple values in a single statement.",
        "isTrue": false
      },
      {
        "id": 3,
        "statement": "The 'finally' block in exception handling will execute even if a return statement is reached in 'try'.",
        "isTrue": true
      },
      {
        "id": 4,
        "statement": "Private class attributes in Python are enforced strictly by the compiler and cannot be accessed.",
        "isTrue": false
      },
      {
        "id": 5,
        "statement": "List comprehensions generally execute faster than equivalent for-loops in CPython.",
        "isTrue": true
      }
    ],
    "matchTheFollowing": [
      {
        "id": 1,
        "left": "1. __init__",
        "right": "a. Captures arbitrary keyword arguments"
      },
      {
        "id": 2,
        "left": "2. lambda",
        "right": "b. Class constructor/initializer method"
      },
      {
        "id": 3,
        "left": "3. **kwargs",
        "right": "c. Anonymous single-expression function"
      },
      {
        "id": 4,
        "left": "4. yield",
        "right": "d. Variable name resolution hierarchy"
      },
      {
        "id": 5,
        "left": "5. LEGB",
        "right": "e. Memory cleanup block in exception handling"
      },
      {
        "id": 6,
        "left": "6. finally",
        "right": "f. Suspends state and yields next generator item"
      },
      {
        "id": 7,
        "left": "7. immutable",
        "right": "g. Strings, Tuples, and FrozenSets"
      }
    ],
    "shortAnswerQuestions": [
      {
        "id": 1,
        "question": "Explain the difference between mutable and immutable data types in Python.",
        "keyPoint": "Mutable types (list, dict, set) can have their contents altered in-place without changing object ID, while immutable types (int, float, str, tuple) cannot be modified after instantiation."
      },
      {
        "id": 2,
        "question": "What is the difference between shallow copy and deep copy in Python?",
        "keyPoint": "A shallow copy creates a new compound object and inserts references to the original child objects, whereas a deep copy recursively duplicates all nested objects."
      },
      {
        "id": 3,
        "question": "How does the LEGB rule determine variable lookup resolution?",
        "keyPoint": "Python looks for variable names first in the Local scope, then in Enclosing function scopes, then Global module namespace, and finally in the Built-in namespace."
      },
      {
        "id": 4,
        "question": "Explain how *args and **kwargs work in function definitions.",
        "keyPoint": "*args bundles extra positional arguments into a tuple, while **kwargs bundles extra keyword arguments into a key-value dictionary."
      },
      {
        "id": 5,
        "question": "Why is it recommended to catch specific exceptions rather than a bare except clause?",
        "keyPoint": "A bare except catches everything including KeyboardInterrupt and SystemExit, masking legitimate bugs and making debugging difficult."
      }
    ],
    "descriptiveQuestions": [
      {
        "id": 1,
        "question": "Describe object-oriented programming concepts in Python including classes, instances, inheritance, and encapsulation.",
        "keyPoint": "Classes act as blueprints; __init__ initializes instances. Inheritance allows subclasses to extend base behavior via super(), and encapsulation protects state via name mangling conventions."
      },
      {
        "id": 2,
        "question": "Explain Python exception handling architecture with try, except, else, and finally blocks.",
        "keyPoint": "Code prone to error is wrapped in try. Targeted except clauses handle specific failures, else runs on error-free completion, and finally guarantees critical resource cleanup."
      },
      {
        "id": 3,
        "question": "Compare regular functions, lambda functions, and generator functions with appropriate use cases.",
        "keyPoint": "Regular functions handle complex logic with docstrings, lambdas serve as quick throwaway callbacks (e.g. in sorted()), and generators handle large streaming data without high memory footprints."
      },
      {
        "id": 4,
        "question": "Discuss Python module creation, packages, __all__, and namespace isolation.",
        "keyPoint": "Modules group related code in .py files, packages structure modules into folders with __init__.py, and namespace management prevents name collisions across large applications."
      }
    ],
    "practicals": [
      {
        "title": "Practical 1",
        "problem": "Create a robust function that processes student test scores and computes averages while filtering outliers.",
        "tasks": [
          "1. Define a function calculate_stats(*scores, min_pass=40) using variable arguments.",
          "2. Validate input data types using try-except blocks.",
          "3. Return the average score, highest score, and number of passing students."
        ],
        "expectedOutput": "A dictionary containing computed statistics with handled edge cases for empty or non-numeric inputs."
      },
      {
        "title": "Practical 2",
        "problem": "Build an Object-Oriented BankAccount class hierarchy with Transaction history and balance checks.",
        "tasks": [
          "1. Implement a base BankAccount class with deposit, withdraw, and check_balance methods.",
          "2. Raise a custom InsufficientFundsError when withdrawal exceeds available balance.",
          "3. Create a SavingsAccount subclass that awards monthly interest."
        ],
        "expectedOutput": "Class instances operating correctly, enforcing positive balances and custom exception handling."
      },
      {
        "title": "Practical 3",
        "problem": "Develop a generator function to stream and parse large CSV-like string data line-by-line.",
        "tasks": [
          "1. Define a generator function stream_records(data_string) using yield.",
          "2. Strip whitespace and parse comma-delimited fields into clean dictionaries.",
          "3. Demonstrate memory efficiency by consuming records with a for-in loop."
        ],
        "expectedOutput": "Memory-efficient dictionary streaming with minimal memory overhead."
      }
    ],
    "conceptMap": {
      "title": "CONCEPT MAP \u2014 PYTHON BASICS & PROGRAMMING",
      "branches": [
        {
          "branch": "Branch 1",
          "topic": "Core Data Types",
          "example": "Lists, Tuples, Dicts, Sets"
        },
        {
          "branch": "Branch 2",
          "topic": "Functions & Scopes",
          "example": "*args, **kwargs, LEGB, Lambdas"
        },
        {
          "branch": "Branch 3",
          "topic": "OOP Concepts",
          "example": "Classes, __init__, Inheritance"
        },
        {
          "branch": "Branch 4",
          "topic": "Error Handling",
          "example": "try-except-else-finally"
        }
      ]
    },
    "caseStudy": {
      "scenario": "A university grade processing system needs to intake raw exam score records from different departments, validate and normalize the inputs, instantiate Student objects, and generate summary report cards without crashing on corrupted lines.",
      "questions": [
        "1. How would you design the Student class hierarchy to represent Undergraduate and Postgraduate students?",
        "2. Where would you apply exception handling (try-except) to prevent a single malformed score line from crashing the entire batch?",
        "3. How can list comprehensions or generator functions be used to process thousands of student records efficiently?",
        "4. What module structure would you set up to separate data ingestion, business logic, and reporting into clean packages?"
      ],
      "expectedOutcome": "Students apply Python data structures, OOP design patterns, generator pipelines, and defensive exception handling to build an enterprise-grade processing tool."
    },
    "selfAssessment": [
      "I can explain the major concepts of this unit.",
      "I can define the important terminology from this unit.",
      "I can solve problems/exercises from this unit.",
      "I can apply the concepts of this unit to a new situation."
    ],
    "reflection": [
      "What did I learn in this unit?",
      "What was difficult for me?",
      "What do I need to practice more?",
      "One important concept I learned:"
    ],
    "answerKey": {
      "mcqs": [
        "1. C \u2014 Tuples are immutable sequence objects in Python.",
        "2. B \u2014 Empty collections evaluate to False.",
        "3. C \u2014 LEGB specifies Local, Enclosing, Global, Built-in lookup order.",
        "4. B \u2014 **kwargs accepts arbitrary keyword arguments as a dictionary.",
        "5. B \u2014 'is' checks object identity / memory address equality.",
        "6. B \u2014 __init__ is called when an instance is initialized.",
        "7. B \u2014 Unhandled exceptions bubble up and print tracebacks.",
        "8. B \u2014 'yield' creates a generator function.",
        "9. B \u2014 Prevents script execution when imported as a module.",
        "10. D \u2014 finally always executes regardless of exceptions."
      ],
      "fillInBlanks": [
        "immutable",
        "yield",
        "self",
        "else",
        "__init__.py"
      ],
      "trueFalse": [
        "True",
        "False",
        "True",
        "False",
        "True"
      ],
      "matchKey": "1\u2192b   2\u2192c   3\u2192a   4\u2192f   5\u2192d   6\u2192e   7\u2192g",
      "shortAnswer": [
        "Mutable objects can be modified in place; immutable objects cannot.",
        "Shallow copy copies outer container only; deep copy recursively copies all nested elements.",
        "Lookup order: Local -> Enclosing -> Global -> Built-in.",
        "*args packs positional args into tuple; **kwargs packs keyword args into dictionary.",
        "Bare except masks SystemExit and KeyboardInterrupt, hindering diagnostics."
      ],
      "descriptive": [
        "Covers classes, constructors, inheritance with super(), and encapsulation with private attributes.",
        "try encapsulates hazardous code, except handles error, else runs on success, finally releases resources.",
        "Regular functions for general reuse, lambdas for inline expressions, generators for streamed iterators.",
        "Package hierarchy with __init__.py prevents namespace pollution and facilitates code modularity."
      ],
      "practicals": [
        "A dictionary containing computed statistics with handled edge cases for empty or non-numeric inputs.",
        "Class instances operating correctly, enforcing positive balances and custom exception handling.",
        "Memory-efficient dictionary streaming with minimal memory overhead."
      ]
    }
  },
  {
    "id": "unit-2",
    "unitNumber": 2,
    "title": "WORKSHEET \u2014 UNIT II",
    "unitName": "Python Tools for Data Handling: GUI, APIs, Web Data and Databases",
    "course": "Data Science with Python",
    "unit": "II (10 Hrs)",
    "duration": "10-12 Hrs",
    "topics": "Python GUI (Tkinter); Jupyter/IPython; Internet Programming & REST APIs; Web Scraping (BeautifulSoup); Databases (SQL, sqlite3/SQLAlchemy)",
    "docxFileName": "Unit_II_Worksheet_Python_Tools_for_Data_Handling_GUI_APIs_Web_Data_and_Databases.docx",
    "learningObjectives": [
      "Explain the basics of building a simple GUI using Tkinter widgets.",
      "Describe the role of Jupyter Notebook/IPython as a data science working environment.",
      "Apply the requests library to call a REST API and process a JSON response.",
      "Identify how BeautifulSoup is used to extract data from web pages.",
      "Apply SQL fundamentals to query data stored in a relational database.",
      "Implement a Python program that connects to a database using sqlite3 or SQLAlchemy."
    ],
    "keyConcepts": [
      {
        "id": 1,
        "concept": "GUI Widget",
        "explanation": "A visual component (button, label, entry box) used to build an interactive interface with Tkinter."
      },
      {
        "id": 2,
        "concept": "Jupyter Notebook/IPython",
        "explanation": "An interactive coding environment that mixes code, output, and text in one document."
      },
      {
        "id": 3,
        "concept": "REST API",
        "explanation": "A web service that exposes data/functionality over HTTP using standard verbs like GET and POST."
      },
      {
        "id": 4,
        "concept": "JSON",
        "explanation": "A lightweight, text-based format used to structure data exchanged with web APIs."
      },
      {
        "id": 5,
        "concept": "Authentication Basics",
        "explanation": "Methods (e.g., API keys, tokens) used to verify a client's identity before granting API access."
      },
      {
        "id": 6,
        "concept": "Web Scraping",
        "explanation": "Programmatically extracting data from HTML web pages, commonly using BeautifulSoup."
      },
      {
        "id": 7,
        "concept": "SQL Fundamentals",
        "explanation": "The standard language for creating, querying, and updating data in relational databases."
      },
      {
        "id": 8,
        "concept": "Database Connectivity",
        "explanation": "Using sqlite3 or SQLAlchemy to connect Python programs to a database and run queries."
      }
    ],
    "terminology": [
      {
        "id": 1,
        "term": "Tkinter",
        "definition": "Python's standard library for building graphical user interfaces."
      },
      {
        "id": 2,
        "term": "Widget",
        "definition": "A GUI element such as a button, label, or text box."
      },
      {
        "id": 3,
        "term": "Jupyter",
        "definition": "An interactive notebook environment for running and documenting code."
      },
      {
        "id": 4,
        "term": "API",
        "definition": "Application Programming Interface \u2014 a defined way for programs to communicate."
      },
      {
        "id": 5,
        "term": "REST",
        "definition": "An architectural style for designing networked web services."
      },
      {
        "id": 6,
        "term": "Requests",
        "definition": "A Python library used to send HTTP requests to web servers/APIs."
      },
      {
        "id": 7,
        "term": "JSON",
        "definition": "JavaScript Object Notation \u2014 a text format for structured data."
      },
      {
        "id": 8,
        "term": "Authentication",
        "definition": "The process of verifying the identity of a user or application."
      },
      {
        "id": 9,
        "term": "Web Scraping",
        "definition": "Extracting data automatically from web pages."
      },
      {
        "id": 10,
        "term": "BeautifulSoup",
        "definition": "A Python library for parsing HTML and XML documents."
      },
      {
        "id": 11,
        "term": "SQL",
        "definition": "Structured Query Language, used to manage relational databases."
      },
      {
        "id": 12,
        "term": "SQLite",
        "definition": "A lightweight, file-based relational database engine."
      },
      {
        "id": 13,
        "term": "SQLAlchemy",
        "definition": "A Python library/toolkit for working with SQL databases using Python objects."
      },
      {
        "id": 14,
        "term": "Database",
        "definition": "An organised collection of structured data."
      },
      {
        "id": 15,
        "term": "Query",
        "definition": "A request to retrieve or manipulate data in a database."
      }
    ],
    "mcqs": [
      {
        "id": 1,
        "question": "Which Python library is used for building simple desktop GUI applications?",
        "options": [
          "NumPy",
          "Tkinter",
          "Pandas",
          "Requests"
        ],
        "correctOption": "B",
        "correctIndex": 1,
        "explanation": "Tkinter is Python's standard GUI toolkit."
      },
      {
        "id": 2,
        "question": "What environment allows you to mix code, output, and text explanations interactively?",
        "options": [
          "Tkinter",
          "Jupyter Notebook",
          "SQLite",
          "BeautifulSoup"
        ],
        "correctOption": "B",
        "correctIndex": 1,
        "explanation": "Jupyter Notebook supports interactive, documented coding."
      },
      {
        "id": 3,
        "question": "Which HTTP method is typically used to retrieve data from a REST API?",
        "options": [
          "POST",
          "DELETE",
          "GET",
          "PUT"
        ],
        "correctOption": "C",
        "correctIndex": 2,
        "explanation": "GET is used to fetch/retrieve resources from a server."
      },
      {
        "id": 4,
        "question": "Which Python library is commonly used to send HTTP requests to a web API?",
        "options": [
          "requests",
          "tkinter",
          "sqlite3",
          "matplotlib"
        ],
        "correctOption": "A",
        "correctIndex": 0,
        "explanation": "The 'requests' library simplifies making HTTP calls in Python."
      },
      {
        "id": 5,
        "question": "What format do most modern REST APIs use to structure their response data?",
        "options": [
          "CSV",
          "JSON",
          "XLSX",
          "DOCX"
        ],
        "correctOption": "B",
        "correctIndex": 1,
        "explanation": "JSON is the most common data-exchange format for REST APIs."
      },
      {
        "id": 6,
        "question": "Which library is primarily used for parsing HTML content when web scraping?",
        "options": [
          "BeautifulSoup",
          "SQLAlchemy",
          "Tkinter",
          "NumPy"
        ],
        "correctOption": "A",
        "correctIndex": 0,
        "explanation": "BeautifulSoup parses and navigates HTML/XML documents."
      },
      {
        "id": 7,
        "question": "Which SQL statement is used to retrieve records from a table?",
        "options": [
          "INSERT",
          "SELECT",
          "UPDATE",
          "DELETE"
        ],
        "correctOption": "B",
        "correctIndex": 1,
        "explanation": "SELECT is used to query/retrieve data from a table."
      },
      {
        "id": 8,
        "question": "Which built-in Python module provides a lightweight, file-based SQL database?",
        "options": [
          "sqlite3",
          "requests",
          "tkinter",
          "json"
        ],
        "correctOption": "A",
        "correctIndex": 0,
        "explanation": "sqlite3 is included in Python's standard library for file-based databases."
      },
      {
        "id": 9,
        "question": "What is the main advantage of using SQLAlchemy over raw SQL queries in Python?",
        "options": [
          "It replaces the need for a database entirely",
          "It lets you work with databases using Python objects (ORM)",
          "It only works with NoSQL databases",
          "It is a GUI library"
        ],
        "correctOption": "B",
        "correctIndex": 1,
        "explanation": "SQLAlchemy provides an ORM layer to map Python objects to database tables."
      },
      {
        "id": 10,
        "question": "Which concept ensures that only authorised clients can access a protected API?",
        "options": [
          "Web scraping",
          "Authentication",
          "Reshaping",
          "Widget binding"
        ],
        "correctOption": "B",
        "correctIndex": 1,
        "explanation": "Authentication verifies the identity of the requester before granting access."
      }
    ],
    "fillInBlanks": [
      {
        "id": 1,
        "question": "__________ is Python's standard library for building simple desktop GUIs.",
        "answer": "Tkinter"
      },
      {
        "id": 2,
        "question": "The __________ library is commonly used to make HTTP requests to REST APIs in Python.",
        "answer": "requests"
      },
      {
        "id": 3,
        "question": "__________ is a lightweight, text-based format used to exchange data with web APIs.",
        "answer": "JSON"
      },
      {
        "id": 4,
        "question": "__________ is a Python library used for parsing HTML pages while web scraping.",
        "answer": "BeautifulSoup"
      },
      {
        "id": 5,
        "question": "The __________ module provides a simple file-based relational database in Python's standard library.",
        "answer": "sqlite3"
      }
    ],
    "trueFalse": [
      {
        "id": 1,
        "statement": "Jupyter Notebook allows mixing code, text, and output in a single document.",
        "isTrue": true
      },
      {
        "id": 2,
        "statement": "The POST method is normally used only to retrieve data, never to send it.",
        "isTrue": false
      },
      {
        "id": 3,
        "statement": "BeautifulSoup is used specifically for parsing and navigating HTML/XML content.",
        "isTrue": true
      },
      {
        "id": 4,
        "statement": "SQL is only used with NoSQL databases.",
        "isTrue": false
      },
      {
        "id": 5,
        "statement": "SQLAlchemy allows Python programs to interact with databases using an ORM.",
        "isTrue": true
      }
    ],
    "matchTheFollowing": [
      {
        "id": 1,
        "left": "1. Tkinter",
        "right": "a. Interactive notebook environment"
      },
      {
        "id": 2,
        "left": "2. Jupyter",
        "right": "b. GUI toolkit for desktop apps"
      },
      {
        "id": 3,
        "left": "3. requests",
        "right": "c. ORM library for database access"
      },
      {
        "id": 4,
        "left": "4. BeautifulSoup",
        "right": "d. Library for HTML parsing"
      },
      {
        "id": 5,
        "left": "5. SQLite",
        "right": "e. Lightweight file-based database"
      },
      {
        "id": 6,
        "left": "6. SQLAlchemy",
        "right": "f. Text format for API data exchange"
      },
      {
        "id": 7,
        "left": "7. JSON",
        "right": "g. Library for sending HTTP requests"
      }
    ],
    "shortAnswerQuestions": [
      {
        "id": 1,
        "question": "What is the role of Jupyter Notebook in a data science workflow?",
        "keyPoint": "It provides an interactive environment to write, run, and document code alongside results."
      },
      {
        "id": 2,
        "question": "Differentiate between a GET and a POST request.",
        "keyPoint": "GET retrieves data from a server; POST sends new data to be processed/stored."
      },
      {
        "id": 3,
        "question": "What is the purpose of BeautifulSoup in web scraping?",
        "keyPoint": "It parses HTML/XML so specific tags/data can be located and extracted programmatically."
      },
      {
        "id": 4,
        "question": "State one difference between SQLite and a full-scale database server.",
        "keyPoint": "SQLite is a lightweight, file-based, serverless database suited to small applications."
      },
      {
        "id": 5,
        "question": "Give one example of authentication used when calling a REST API.",
        "keyPoint": "Using an API key or bearer token included in the request header."
      }
    ],
    "descriptiveQuestions": [
      {
        "id": 1,
        "question": "Explain how a simple Tkinter GUI application is structured, including common widgets.",
        "keyPoint": "Cover main window creation, widgets (Label, Button, Entry), layout, and event binding."
      },
      {
        "id": 2,
        "question": "Describe the process of calling a REST API with the requests library and processing its JSON response.",
        "keyPoint": "Send a GET/POST request, check status code, parse response.json(), use returned data."
      },
      {
        "id": 3,
        "question": "Explain the steps involved in web scraping a web page using BeautifulSoup.",
        "keyPoint": "Fetch page HTML, parse with BeautifulSoup, locate tags/classes, extract and clean text."
      },
      {
        "id": 4,
        "question": "Discuss how Python connects to a relational database using sqlite3 or SQLAlchemy.",
        "keyPoint": "Establish a connection, create a cursor/session, execute SQL, fetch/commit results, close connection."
      }
    ],
    "practicals": [
      {
        "title": "Practical 1",
        "problem": "Build a basic Tkinter GUI with a text entry box and a button.",
        "tasks": [
          "1. Create a Tkinter window.",
          "2. Add an Entry widget and a Button widget.",
          "3. On button click, display the entered text in a Label."
        ],
        "expectedOutput": "A window that shows the typed text in a label after the button is clicked."
      },
      {
        "title": "Practical 2",
        "problem": "Fetch data from a public REST API using the requests library.",
        "tasks": [
          "1. Send a GET request to a sample public API endpoint.",
          "2. Parse the JSON response.",
          "3. Print two or three specific fields from the response."
        ],
        "expectedOutput": "The selected fields from the JSON response printed to the console."
      },
      {
        "title": "Practical 3",
        "problem": "Create a small SQLite database and run a simple query from Python.",
        "tasks": [
          "1. Connect to a SQLite database using sqlite3.",
          "2. Create a table 'students' with name and marks columns.",
          "3. Insert two records and query all rows."
        ],
        "expectedOutput": "All inserted student records printed as query results."
      }
    ],
    "conceptMap": {
      "title": "CONCEPT MAP \u2014 PYTHON TOOLS FOR DATA HANDLING: GUI, APIS, WEB DATA AND DATABASES",
      "branches": [
        {
          "branch": "Branch 1",
          "topic": "GUI",
          "example": "Example: ____________________"
        },
        {
          "branch": "Branch 2",
          "topic": "Web/APIs",
          "example": "Example: ____________________"
        },
        {
          "branch": "Branch 3",
          "topic": "Scraping",
          "example": "Example: ____________________"
        },
        {
          "branch": "Branch 4",
          "topic": "Databases",
          "example": "Example: ____________________"
        }
      ]
    },
    "caseStudy": {
      "scenario": "A small e-commerce startup wants to track competitor product prices. They plan to fetch prices from a partner's REST API where available, scrape prices from competitor websites where no API exists, and store all collected prices in a local SQLite database for daily comparison.",
      "questions": [
        "Which Python library would you use to call the partner's REST API, and how would you process the JSON response?",
        "Which library would you use to scrape competitor websites, and what risks should you be aware of?",
        "Design a simple database table structure to store the collected price data.",
        "How would authentication be handled when accessing the partner's API?"
      ],
      "expectedOutcome": "Students apply API consumption, web scraping, and database storage concepts together in one realistic data-collection pipeline."
    },
    "selfAssessment": [
      "I can explain the major concepts of this unit.",
      "I can define the important terminology from this unit.",
      "I can solve problems/exercises from this unit.",
      "I can apply the concepts of this unit to a new situation."
    ],
    "reflection": [
      "What did I learn in this unit?",
      "What was difficult for me?",
      "What do I need to practice more?",
      "One important concept I learned:"
    ],
    "answerKey": {
      "mcqs": [
        "1. B \u2014 Tkinter is Python's standard GUI toolkit.",
        "2. B \u2014 Jupyter Notebook supports interactive, documented coding.",
        "3. C \u2014 GET is used to fetch/retrieve resources from a server.",
        "4. A \u2014 The 'requests' library simplifies making HTTP calls in Python.",
        "5. B \u2014 JSON is the most common data-exchange format for REST APIs.",
        "6. A \u2014 BeautifulSoup parses and navigates HTML/XML documents.",
        "7. B \u2014 SELECT is used to query/retrieve data from a table.",
        "8. A \u2014 sqlite3 is included in Python's standard library for file-based databases.",
        "9. B \u2014 SQLAlchemy provides an ORM layer to map Python objects to database tables.",
        "10. B \u2014 Authentication verifies the identity of the requester before granting access."
      ],
      "fillInBlanks": [
        "Tkinter",
        "requests",
        "JSON",
        "BeautifulSoup",
        "sqlite3"
      ],
      "trueFalse": [
        "True",
        "False",
        "True",
        "False",
        "True"
      ],
      "matchKey": "1\u2192b 2\u2192a 3\u2192g 4\u2192d 5\u2192e 6\u2192c 7\u2192f",
      "shortAnswer": [
        "It provides an interactive environment to write, run, and document code alongside results.",
        "GET retrieves data from a server; POST sends new data to be processed/stored.",
        "It parses HTML/XML so specific tags/data can be located and extracted programmatically.",
        "SQLite is a lightweight, file-based, serverless database suited to small applications.",
        "Using an API key or bearer token included in the request header."
      ],
      "descriptive": [
        "Cover main window creation, widgets (Label, Button, Entry), layout, and event binding.",
        "Send a GET/POST request, check status code, parse response.json(), use returned data.",
        "Fetch page HTML, parse with BeautifulSoup, locate tags/classes, extract and clean text.",
        "Establish a connection, create a cursor/session, execute SQL, fetch/commit results, close connection."
      ],
      "practicals": [
        "A window that shows the typed text in a label after the button is clicked.",
        "The selected fields from the JSON response printed to the console.",
        "All inserted student records printed as query results."
      ]
    }
  },
  {
    "id": "unit-3",
    "unitNumber": 3,
    "title": "WORKSHEET \u2014 UNIT III",
    "unitName": "Pandas and NumPy",
    "course": "Data Science with Python",
    "unit": "III (12 Hrs)",
    "duration": "10-12 Hrs",
    "topics": "NumPy Basics (arrays, element-wise functions, file I/O); Pandas (data structures, essential functionality, descriptive statistics, missing data, hierarchical indexing)",
    "docxFileName": "Unit_III_Worksheet_Pandas_and_NumPy.docx",
    "learningObjectives": [
      "Explain the structure and advantages of NumPy's multidimensional array (ndarray).",
      "Identify appropriate NumPy element-wise functions for array-based data processing.",
      "Differentiate between Pandas Series and DataFrame data structures.",
      "Apply Pandas functions to summarise and compute descriptive statistics on a dataset.",
      "Analyze and handle missing data using Pandas methods.",
      "Implement hierarchical indexing to organise multi-level data in Pandas."
    ],
    "keyConcepts": [
      {
        "id": 1,
        "concept": "ndarray",
        "explanation": "NumPy's core object: a fast, fixed-type, multidimensional array."
      },
      {
        "id": 2,
        "concept": "Vectorization",
        "explanation": "Performing operations on whole arrays at once instead of looping element by element."
      },
      {
        "id": 3,
        "concept": "Broadcasting",
        "explanation": "NumPy's rule for applying operations between arrays of different but compatible shapes."
      },
      {
        "id": 4,
        "concept": "Series",
        "explanation": "A one-dimensional labeled array, the building block of a Pandas DataFrame."
      },
      {
        "id": 5,
        "concept": "DataFrame",
        "explanation": "A two-dimensional labeled data structure with rows and columns, like a table."
      },
      {
        "id": 6,
        "concept": "Descriptive Statistics",
        "explanation": "Summary measures (mean, median, std, etc.) that describe a dataset's central tendency and spread."
      },
      {
        "id": 7,
        "concept": "Missing Data Handling",
        "explanation": "Techniques (dropna, fillna) to detect and manage NaN/null values in a dataset."
      },
      {
        "id": 8,
        "concept": "Hierarchical Indexing",
        "explanation": "Using multiple index levels (MultiIndex) to represent higher-dimensional data in a DataFrame."
      }
    ],
    "terminology": [
      {
        "id": 1,
        "term": "NumPy",
        "definition": "A Python library for fast numerical computing with multidimensional arrays."
      },
      {
        "id": 2,
        "term": "Pandas",
        "definition": "A Python library for labeled, tabular data manipulation and analysis."
      },
      {
        "id": 3,
        "term": "Array",
        "definition": "A grid of values of the same type, indexed by a tuple of integers."
      },
      {
        "id": 4,
        "term": "ndarray",
        "definition": "NumPy's core n-dimensional array object."
      },
      {
        "id": 5,
        "term": "Series",
        "definition": "A one-dimensional labeled Pandas data structure."
      },
      {
        "id": 6,
        "term": "DataFrame",
        "definition": "A two-dimensional labeled Pandas data structure (rows and columns)."
      },
      {
        "id": 7,
        "term": "Vectorization",
        "definition": "Applying operations to entire arrays without explicit loops."
      },
      {
        "id": 8,
        "term": "Broadcasting",
        "definition": "NumPy's mechanism for operating on arrays of different shapes."
      },
      {
        "id": 9,
        "term": "Indexing",
        "definition": "Accessing specific elements, rows, or columns of an array/DataFrame."
      },
      {
        "id": 10,
        "term": "Missing Data",
        "definition": "Absent or null values (NaN) in a dataset."
      },
      {
        "id": 11,
        "term": "Hierarchical Indexing",
        "definition": "Using multiple levels of row/column labels (MultiIndex)."
      },
      {
        "id": 12,
        "term": "Descriptive Statistics",
        "definition": "Summary values like mean, median, and standard deviation."
      },
      {
        "id": 13,
        "term": "Mean",
        "definition": "The average value of a set of numbers."
      },
      {
        "id": 14,
        "term": "Median",
        "definition": "The middle value of a sorted set of numbers."
      },
      {
        "id": 15,
        "term": "Aggregation",
        "definition": "Combining multiple values into a single summary value."
      }
    ],
    "mcqs": [
      {
        "id": 1,
        "question": "What is the core data structure provided by NumPy?",
        "options": [
          "DataFrame",
          "ndarray",
          "Series",
          "Dictionary"
        ],
        "correctOption": "B",
        "correctIndex": 1,
        "explanation": "NumPy's core object is the n-dimensional array, ndarray."
      },
      {
        "id": 2,
        "question": "Which term describes applying an operation to an entire array without explicit Python loops?",
        "options": [
          "Broadcasting",
          "Vectorization",
          "Indexing",
          "Aggregation"
        ],
        "correctOption": "B",
        "correctIndex": 1,
        "explanation": "Vectorization applies operations to whole arrays at once for speed."
      },
      {
        "id": 3,
        "question": "What does NumPy's broadcasting feature allow?",
        "options": [
          "Sending arrays over a network",
          "Operating on arrays of different but compatible shapes",
          "Converting arrays to strings",
          "Plotting arrays automatically"
        ],
        "correctOption": "B",
        "correctIndex": 1,
        "explanation": "Broadcasting lets NumPy apply operations between differently shaped arrays."
      },
      {
        "id": 4,
        "question": "Which Pandas structure is one-dimensional and labeled?",
        "options": [
          "DataFrame",
          "Series",
          "Panel",
          "ndarray"
        ],
        "correctOption": "B",
        "correctIndex": 1,
        "explanation": "A Series is a one-dimensional labeled array; a DataFrame is two-dimensional."
      },
      {
        "id": 5,
        "question": "Which Pandas method is used to compute summary statistics like mean and std quickly?",
        "options": [
          ".describe()",
          ".dropna()",
          ".merge()",
          ".pivot()"
        ],
        "correctOption": "A",
        "correctIndex": 0,
        "explanation": ".describe() returns count, mean, std, min, max, and quartiles."
      },
      {
        "id": 6,
        "question": "Which method removes rows containing missing values from a DataFrame?",
        "options": [
          ".fillna()",
          ".dropna()",
          ".isnull()",
          ".describe()"
        ],
        "correctOption": "B",
        "correctIndex": 1,
        "explanation": ".dropna() removes rows/columns with NaN values."
      },
      {
        "id": 7,
        "question": "Which method fills missing values with a specified value?",
        "options": [
          ".dropna()",
          ".fillna()",
          ".isnull()",
          ".sum()"
        ],
        "correctOption": "B",
        "correctIndex": 1,
        "explanation": ".fillna() replaces NaN entries with a given value."
      },
      {
        "id": 8,
        "question": "What is a MultiIndex used for in Pandas?",
        "options": [
          "Sorting a single column",
          "Representing multiple levels of row/column labels",
          "Removing duplicate rows",
          "Plotting a chart"
        ],
        "correctOption": "B",
        "correctIndex": 1,
        "explanation": "A MultiIndex (hierarchical index) supports multiple label levels."
      },
      {
        "id": 9,
        "question": "Which NumPy function reads array data from a text file?",
        "options": [
          "np.loadtxt()",
          "pd.read_csv()",
          "np.plot()",
          "np.merge()"
        ],
        "correctOption": "A",
        "correctIndex": 0,
        "explanation": "np.loadtxt() is a NumPy function for reading array data from text files."
      },
      {
        "id": 10,
        "question": "Which function checks for missing (NaN) values in a DataFrame?",
        "options": [
          ".isnull()",
          ".sum()",
          ".mean()",
          ".groupby()"
        ],
        "correctOption": "A",
        "correctIndex": 0,
        "explanation": ".isnull() returns a boolean mask identifying NaN values."
      }
    ],
    "fillInBlanks": [
      {
        "id": 1,
        "question": "NumPy's core data structure is called an __________.",
        "answer": "ndarray"
      },
      {
        "id": 2,
        "question": "Applying an operation to a full array at once instead of looping is called __________.",
        "answer": "vectorization"
      },
      {
        "id": 3,
        "question": "A Pandas __________ is a two-dimensional, labeled data structure similar to a table.",
        "answer": "DataFrame"
      },
      {
        "id": 4,
        "question": "The __________ method removes rows with missing values from a DataFrame.",
        "answer": "dropna()"
      },
      {
        "id": 5,
        "question": "__________ indexing allows multiple levels of row or column labels in a DataFrame.",
        "answer": "Hierarchical"
      }
    ],
    "trueFalse": [
      {
        "id": 1,
        "statement": "A Pandas Series is a two-dimensional data structure.",
        "isTrue": false
      },
      {
        "id": 2,
        "statement": "NumPy arrays require all elements to be of the same data type.",
        "isTrue": true
      },
      {
        "id": 3,
        "statement": "The .fillna() method can be used to replace missing values in a DataFrame.",
        "isTrue": true
      },
      {
        "id": 4,
        "statement": "Broadcasting only works when two arrays have exactly identical shapes.",
        "isTrue": false
      },
      {
        "id": 5,
        "statement": ".describe() in Pandas returns descriptive statistics such as mean and standard deviation.",
        "isTrue": true
      }
    ],
    "matchTheFollowing": [
      {
        "id": 1,
        "left": "1. ndarray",
        "right": "a. Removes rows with missing values"
      },
      {
        "id": 2,
        "left": "2. Series",
        "right": "b. NumPy's core n-dimensional array"
      },
      {
        "id": 3,
        "left": "3. DataFrame",
        "right": "c. Fills missing values with a given value"
      },
      {
        "id": 4,
        "left": "4. dropna()",
        "right": "d. Two-dimensional labeled data structure"
      },
      {
        "id": 5,
        "left": "5. fillna()",
        "right": "e. Returns summary statistics"
      },
      {
        "id": 6,
        "left": "6. MultiIndex",
        "right": "f. One-dimensional labeled data structure"
      },
      {
        "id": 7,
        "left": "7. describe()",
        "right": "g. Multiple levels of row/column labels"
      }
    ],
    "shortAnswerQuestions": [
      {
        "id": 1,
        "question": "Define vectorization and explain why it is faster than a Python for-loop.",
        "keyPoint": "Operations run on whole arrays using optimized, compiled C code rather than interpreted per-element loops."
      },
      {
        "id": 2,
        "question": "What is the difference between a Pandas Series and a DataFrame?",
        "keyPoint": "A Series is one-dimensional; a DataFrame is two-dimensional with rows and columns."
      },
      {
        "id": 3,
        "question": "Name two ways to handle missing data in a Pandas DataFrame.",
        "keyPoint": "Drop rows/columns with dropna(), or fill missing values with fillna()."
      },
      {
        "id": 4,
        "question": "What is hierarchical indexing and when would you use it?",
        "keyPoint": "Using a MultiIndex to represent multiple grouping levels, e.g. year and month together."
      },
      {
        "id": 5,
        "question": "Give one example of an element-wise NumPy function.",
        "keyPoint": "np.sqrt(), np.exp(), or np.add() applied element-wise across an array."
      }
    ],
    "descriptiveQuestions": [
      {
        "id": 1,
        "question": "Explain the concept of NumPy arrays, including creation, indexing, and element-wise operations.",
        "keyPoint": "Cover np.array(), shape, dtype, slicing, and vectorized arithmetic operations."
      },
      {
        "id": 2,
        "question": "Compare NumPy arrays and Pandas DataFrames in terms of structure and use cases.",
        "keyPoint": "NumPy arrays are homogeneous and numeric-focused; DataFrames are labeled, heterogeneous, tabular."
      },
      {
        "id": 3,
        "question": "Describe the essential functionality of Pandas for summarizing and computing descriptive statistics.",
        "keyPoint": "Discuss mean(), sum(), describe(), value_counts(), and groupby-based summaries."
      },
      {
        "id": 4,
        "question": "Discuss strategies for handling missing data and their trade-offs.",
        "keyPoint": "Dropping data loses information; filling with mean/median/mode may introduce bias \u2014 choose based on context."
      }
    ],
    "practicals": [
      {
        "title": "Practical 1",
        "problem": "Given a 2D NumPy array of exam scores, compute row-wise and column-wise averages.",
        "tasks": [
          "1. Create a 2D NumPy array of shape (5,3) with sample scores.",
          "2. Compute the mean along axis=0 (columns) and axis=1 (rows).",
          "3. Print both results."
        ],
        "expectedOutput": "Two arrays: one with per-column averages, one with per-row averages."
      },
      {
        "title": "Practical 2",
        "problem": "Given a Pandas DataFrame with some missing values, clean the dataset.",
        "tasks": [
          "1. Create a DataFrame with a few NaN values.",
          "2. Identify missing values using .isnull().sum().",
          "3. Fill numeric missing values with the column mean using fillna()."
        ],
        "expectedOutput": "A cleaned DataFrame with no missing values in the numeric columns."
      },
      {
        "title": "Practical 3",
        "problem": "Use Pandas descriptive statistics to summarize a sales dataset.",
        "tasks": [
          "1. Load or create a small DataFrame of sales figures.",
          "2. Use .describe() to view summary statistics.",
          "3. Print the mean and median of the 'sales' column separately."
        ],
        "expectedOutput": "A statistics summary table plus the specific mean and median values."
      }
    ],
    "conceptMap": {
      "title": "CONCEPT MAP \u2014 PANDAS AND NUMPY",
      "branches": [
        {
          "branch": "Branch 1",
          "topic": "NumPy Arrays",
          "example": "Example: ____________________"
        },
        {
          "branch": "Branch 2",
          "topic": "Pandas Structures",
          "example": "Example: ____________________"
        },
        {
          "branch": "Branch 3",
          "topic": "Descriptive Stats",
          "example": "Example: ____________________"
        },
        {
          "branch": "Branch 4",
          "topic": "Data Cleaning",
          "example": "Example: ____________________"
        }
      ]
    },
    "caseStudy": {
      "scenario": "A retail company has a CSV of daily sales figures across multiple stores, but the file has some missing sales values and needs monthly summary statistics for a management report.",
      "questions": [
        "How would you load this dataset into a Pandas DataFrame and inspect it for missing values?",
        "Which method would you use to handle the missing sales values, and why?",
        "Which Pandas function would give you an overall statistical summary (mean, min, max) of sales?",
        "How could hierarchical indexing help organise the data by store and month together?"
      ],
      "expectedOutcome": "Students apply NumPy/Pandas data structures, descriptive statistics, and missing-data handling to a realistic business reporting scenario."
    },
    "selfAssessment": [
      "I can explain the major concepts of this unit.",
      "I can define the important terminology from this unit.",
      "I can solve problems/exercises from this unit.",
      "I can apply the concepts of this unit to a new situation."
    ],
    "reflection": [
      "What did I learn in this unit?",
      "What was difficult for me?",
      "What do I need to practice more?",
      "One important concept I learned:"
    ],
    "answerKey": {
      "mcqs": [
        "1. B \u2014 NumPy's core object is the n-dimensional array, ndarray.",
        "2. B \u2014 Vectorization applies operations to whole arrays at once for speed.",
        "3. B \u2014 Broadcasting lets NumPy apply operations between differently shaped arrays.",
        "4. B \u2014 A Series is a one-dimensional labeled array; a DataFrame is two-dimensional.",
        "5. A \u2014 .describe() returns count, mean, std, min, max, and quartiles.",
        "6. B \u2014 .dropna() removes rows/columns with NaN values.",
        "7. B \u2014 .fillna() replaces NaN entries with a given value.",
        "8. B \u2014 A MultiIndex (hierarchical index) supports multiple label levels.",
        "9. A \u2014 np.loadtxt() is a NumPy function for reading array data from text files.",
        "10. A \u2014 .isnull() returns a boolean mask identifying NaN values."
      ],
      "fillInBlanks": [
        "ndarray",
        "vectorization",
        "DataFrame",
        "dropna()",
        "Hierarchical"
      ],
      "trueFalse": [
        "False",
        "True",
        "True",
        "False",
        "True"
      ],
      "matchKey": "1\u2192b 2\u2192f 3\u2192d 4\u2192a 5\u2192c 6\u2192g 7\u2192e",
      "shortAnswer": [
        "Operations run on whole arrays using optimized, compiled C code rather than interpreted per-element loops.",
        "A Series is one-dimensional; a DataFrame is two-dimensional with rows and columns.",
        "Drop rows/columns with dropna(), or fill missing values with fillna().",
        "Using a MultiIndex to represent multiple grouping levels, e.g. year and month together.",
        "np.sqrt(), np.exp(), or np.add() applied element-wise across an array."
      ],
      "descriptive": [
        "Cover np.array(), shape, dtype, slicing, and vectorized arithmetic operations.",
        "NumPy arrays are homogeneous and numeric-focused; DataFrames are labeled, heterogeneous, tabular.",
        "Discuss mean(), sum(), describe(), value_counts(), and groupby-based summaries.",
        "Dropping data loses information; filling with mean/median/mode may introduce bias \u2014 choose based on context."
      ],
      "practicals": [
        "Two arrays: one with per-column averages, one with per-row averages.",
        "A cleaned DataFrame with no missing values in the numeric columns.",
        "A statistics summary table plus the specific mean and median values."
      ]
    }
  },
  {
    "id": "unit-4",
    "unitNumber": 4,
    "title": "WORKSHEET \u2014 UNIT IV",
    "unitName": "Data Preprocessing and Visualization",
    "course": "Data Science with Python",
    "unit": "IV (12 Hrs)",
    "duration": "10-12 Hrs",
    "topics": "Data Loading/Storage/File Formats; Data Wrangling (combine, merge, reshape, transform, string manipulation); Data Aggregation & Group Operations; Data Visualization (matplotlib, Seaborn, pandas plotting, time series)",
    "docxFileName": "Unit_IV_Worksheet_Data_Preprocessing_and_Visualization.docx",
    "learningObjectives": [
      "Explain different file formats and methods used to load and store data in Pandas.",
      "Apply data wrangling operations such as merging, reshaping, and transforming datasets.",
      "Implement groupby-based aggregation operations on a dataset.",
      "Analyze data using pivot tables and cross-tabulation.",
      "Apply matplotlib and Seaborn to create effective statistical visualizations.",
      "Critically evaluate a data visualization for a real-world case study."
    ],
    "keyConcepts": [
      {
        "id": 1,
        "concept": "Data Loading/Storage",
        "explanation": "Reading/writing data in formats such as CSV, text, binary, HTML, or databases."
      },
      {
        "id": 2,
        "concept": "Merging & Combining",
        "explanation": "Joining two or more datasets together based on common keys/columns."
      },
      {
        "id": 3,
        "concept": "Reshaping & Pivoting",
        "explanation": "Rearranging data between long and wide formats for analysis."
      },
      {
        "id": 4,
        "concept": "String Manipulation",
        "explanation": "Cleaning and transforming text data within columns (e.g., splitting, replacing)."
      },
      {
        "id": 5,
        "concept": "Groupby Mechanics",
        "explanation": "Splitting data into groups, applying a function, and combining the results."
      },
      {
        "id": 6,
        "concept": "Pivot Table / Cross-tab",
        "explanation": "Summary tables that aggregate data across two or more dimensions."
      },
      {
        "id": 7,
        "concept": "Matplotlib",
        "explanation": "Python's foundational plotting library for creating static charts."
      },
      {
        "id": 8,
        "concept": "Seaborn",
        "explanation": "A statistical visualization library built on matplotlib with attractive defaults."
      },
      {
        "id": 9,
        "concept": "Time Series Visualization",
        "explanation": "Plotting data points over time to reveal trends and seasonality."
      }
    ],
    "terminology": [
      {
        "id": 1,
        "term": "Merge",
        "definition": "Combining two datasets based on a common key column."
      },
      {
        "id": 2,
        "term": "Reshape",
        "definition": "Changing the layout/structure of a dataset (e.g., wide to long)."
      },
      {
        "id": 3,
        "term": "Pivot Table",
        "definition": "A table that summarizes data by grouping and aggregating values."
      },
      {
        "id": 4,
        "term": "Cross Tabulation",
        "definition": "A table showing the frequency distribution between two or more variables."
      },
      {
        "id": 5,
        "term": "Groupby",
        "definition": "A Pandas operation that splits data into groups for aggregation."
      },
      {
        "id": 6,
        "term": "Aggregation",
        "definition": "Computing a summary value (sum, mean, count) for grouped data."
      },
      {
        "id": 7,
        "term": "Data Wrangling",
        "definition": "The process of cleaning, transforming, and preparing raw data for analysis."
      },
      {
        "id": 8,
        "term": "Matplotlib",
        "definition": "A core Python library for creating static plots and charts."
      },
      {
        "id": 9,
        "term": "Seaborn",
        "definition": "A statistical data visualization library built on top of matplotlib."
      },
      {
        "id": 10,
        "term": "Time Series",
        "definition": "Data points indexed and ordered by time."
      },
      {
        "id": 11,
        "term": "String Manipulation",
        "definition": "Operations to clean or transform text data, such as split() or replace()."
      },
      {
        "id": 12,
        "term": "CSV",
        "definition": "Comma-Separated Values \u2014 a simple text file format for tabular data."
      },
      {
        "id": 13,
        "term": "Transformation",
        "definition": "Converting data into a different format or scale for analysis."
      },
      {
        "id": 14,
        "term": "Outlier",
        "definition": "A data point that differs significantly from other observations."
      },
      {
        "id": 15,
        "term": "Visualization",
        "definition": "The graphical representation of data to reveal patterns and insights."
      }
    ],
    "mcqs": [
      {
        "id": 1,
        "question": "Which Pandas function is commonly used to read data from a CSV file?",
        "options": [
          "pd.read_csv()",
          "pd.load_data()",
          "pd.open_csv()",
          "pd.import_csv()"
        ],
        "correctOption": "A",
        "correctIndex": 0,
        "explanation": "pd.read_csv() is the standard function to load CSV data into a DataFrame."
      },
      {
        "id": 2,
        "question": "Which operation combines two DataFrames based on a common column?",
        "options": [
          "concat()",
          "merge()",
          "pivot()",
          "melt()"
        ],
        "correctOption": "B",
        "correctIndex": 1,
        "explanation": "merge() joins DataFrames using one or more shared key columns."
      },
      {
        "id": 3,
        "question": "What does 'reshaping' data typically involve?",
        "options": [
          "Deleting all rows",
          "Changing the layout between wide and long formats",
          "Renaming columns only",
          "Sorting values"
        ],
        "correctOption": "B",
        "correctIndex": 1,
        "explanation": "Reshaping rearranges data structure, e.g. via pivot or melt operations."
      },
      {
        "id": 4,
        "question": "Which Pandas mechanism splits data into groups before applying a function?",
        "options": [
          "merge()",
          "groupby()",
          "read_csv()",
          "plot()"
        ],
        "correctOption": "B",
        "correctIndex": 1,
        "explanation": "groupby() implements the split-apply-combine pattern for aggregation."
      },
      {
        "id": 5,
        "question": "Which table type shows aggregated values across two categorical dimensions?",
        "options": [
          "Pivot table",
          "Series",
          "ndarray",
          "List comprehension"
        ],
        "correctOption": "A",
        "correctIndex": 0,
        "explanation": "A pivot table summarizes data across rows and columns of categorical variables."
      },
      {
        "id": 6,
        "question": "Which library is best known for providing attractive statistical visualizations built on matplotlib?",
        "options": [
          "NumPy",
          "Seaborn",
          "SQLAlchemy",
          "BeautifulSoup"
        ],
        "correctOption": "B",
        "correctIndex": 1,
        "explanation": "Seaborn offers high-level statistical plotting with better default styling."
      },
      {
        "id": 7,
        "question": "Which matplotlib function is used to create a basic line plot?",
        "options": [
          "plt.bar()",
          "plt.plot()",
          "plt.pie()",
          "plt.hist()"
        ],
        "correctOption": "B",
        "correctIndex": 1,
        "explanation": "plt.plot() is used to draw line charts in matplotlib."
      },
      {
        "id": 8,
        "question": "Which term describes analyzing data points ordered over time?",
        "options": [
          "Cross tabulation",
          "Time series analysis",
          "String manipulation",
          "Data merging"
        ],
        "correctOption": "B",
        "correctIndex": 1,
        "explanation": "Time series analysis studies data ordered by time to find trends/patterns."
      },
      {
        "id": 9,
        "question": "Which Pandas function creates a frequency table between two categorical variables?",
        "options": [
          "pd.crosstab()",
          "pd.pivot()",
          "pd.merge()",
          "pd.concat()"
        ],
        "correctOption": "A",
        "correctIndex": 0,
        "explanation": "pd.crosstab() computes a cross-tabulation of two or more factors."
      },
      {
        "id": 10,
        "question": "Which of these is a common data wrangling task?",
        "options": [
          "Handling missing/duplicate values",
          "Compiling machine code",
          "Rendering a GUI window",
          "Sending an HTTP request"
        ],
        "correctOption": "A",
        "correctIndex": 0,
        "explanation": "Cleaning missing or duplicate values is a core data wrangling activity."
      }
    ],
    "fillInBlanks": [
      {
        "id": 1,
        "question": "The __________ function is used to combine two DataFrames based on a shared column.",
        "answer": "merge()"
      },
      {
        "id": 2,
        "question": "A __________ table summarizes data by aggregating it across two categorical dimensions.",
        "answer": "pivot"
      },
      {
        "id": 3,
        "question": "The __________ operation splits data into groups, applies a function, and combines results.",
        "answer": "groupby"
      },
      {
        "id": 4,
        "question": "__________ is a Python library built on matplotlib known for statistical visualizations.",
        "answer": "Seaborn"
      },
      {
        "id": 5,
        "question": "Data indexed and ordered by time is called __________ data.",
        "answer": "time series"
      }
    ],
    "trueFalse": [
      {
        "id": 1,
        "statement": "merge() is used to combine two DataFrames using a common key column.",
        "isTrue": true
      },
      {
        "id": 2,
        "statement": "A pivot table can only summarize numeric data using the sum function.",
        "isTrue": false
      },
      {
        "id": 3,
        "statement": "Seaborn is built on top of matplotlib.",
        "isTrue": true
      },
      {
        "id": 4,
        "statement": "Cross-tabulation shows the frequency distribution between two or more variables.",
        "isTrue": true
      },
      {
        "id": 5,
        "statement": "Time series data has no relationship with the order of observations.",
        "isTrue": false
      }
    ],
    "matchTheFollowing": [
      {
        "id": 1,
        "left": "1. merge()",
        "right": "a. Foundational static plotting library"
      },
      {
        "id": 2,
        "left": "2. groupby()",
        "right": "b. Combines datasets on a common key"
      },
      {
        "id": 3,
        "left": "3. Pivot Table",
        "right": "c. Statistical visualization library"
      },
      {
        "id": 4,
        "left": "4. Cross Tabulation",
        "right": "d. Splits data into groups for aggregation"
      },
      {
        "id": 5,
        "left": "5. Seaborn",
        "right": "e. Data ordered and indexed by time"
      },
      {
        "id": 6,
        "left": "6. Matplotlib",
        "right": "f. Summarizes data across two dimensions"
      },
      {
        "id": 7,
        "left": "7. Time Series",
        "right": "g. Frequency table between two variables"
      }
    ],
    "shortAnswerQuestions": [
      {
        "id": 1,
        "question": "What is the difference between merge() and concat() in Pandas?",
        "keyPoint": "merge() joins on common columns/keys; concat() stacks DataFrames along an axis without key matching."
      },
      {
        "id": 2,
        "question": "Define data wrangling and give one example task.",
        "keyPoint": "Cleaning/transforming raw data for analysis, e.g. handling missing values or renaming columns."
      },
      {
        "id": 3,
        "question": "Explain the purpose of the groupby operation.",
        "keyPoint": "It splits data into groups based on a key, applies an aggregate function, then combines results."
      },
      {
        "id": 4,
        "question": "What is the difference between a pivot table and cross-tabulation?",
        "keyPoint": "A pivot table aggregates numeric values; cross-tabulation typically shows frequency counts between categories."
      },
      {
        "id": 5,
        "question": "Name one situation where a time series plot would be more useful than a bar chart.",
        "keyPoint": "Visualizing daily stock prices over a year to reveal trends and seasonality."
      }
    ],
    "descriptiveQuestions": [
      {
        "id": 1,
        "question": "Explain the different file formats Pandas can read from and write to, with examples.",
        "keyPoint": "Cover CSV, Excel, JSON, HTML, and SQL sources using read_/to_ functions."
      },
      {
        "id": 2,
        "question": "Describe the steps involved in data wrangling: combining, reshaping, and transforming data.",
        "keyPoint": "Discuss merge/concat, pivot/melt, and apply/map based transformations with examples."
      },
      {
        "id": 3,
        "question": "Compare the use of matplotlib and Seaborn for statistical visualization.",
        "keyPoint": "Matplotlib gives fine control over low-level plot elements; Seaborn simplifies statistical plots with better defaults."
      },
      {
        "id": 4,
        "question": "Discuss how groupby, aggregation, and pivot tables work together for data analysis.",
        "keyPoint": "groupby splits data, aggregation summarizes each group, and pivot tables present the results in a two-dimensional table."
      },
      {
        "id": 5,
        "question": "Analyze a real-world example where time series visualization reveals an important business insight.",
        "keyPoint": "E.g., plotting monthly sales to detect seasonal peaks that inform inventory planning."
      }
    ],
    "practicals": [
      {
        "title": "Practical 1",
        "problem": "Combine two datasets \u2014 customer details and their orders \u2014 into a single DataFrame.",
        "tasks": [
          "1. Create two small DataFrames: customers and orders, sharing a customer_id column.",
          "2. Use merge() to join them on customer_id.",
          "3. Print the resulting combined DataFrame."
        ],
        "expectedOutput": "A single DataFrame containing customer details alongside their corresponding orders."
      },
      {
        "title": "Practical 2",
        "problem": "Use groupby and aggregation to summarize sales data by region.",
        "tasks": [
          "1. Create a DataFrame with columns region and sales.",
          "2. Use groupby('region') and compute the sum and mean of sales.",
          "3. Print the summarized results."
        ],
        "expectedOutput": "A summary table showing total and average sales per region."
      },
      {
        "title": "Practical 3",
        "problem": "Visualize monthly sales data using matplotlib and Seaborn.",
        "tasks": [
          "1. Create a small DataFrame with month and sales columns.",
          "2. Plot a line chart of sales over months using matplotlib.",
          "3. Plot the same data as a bar chart using Seaborn."
        ],
        "expectedOutput": "Two charts (line and bar) showing the sales trend across months."
      }
    ],
    "conceptMap": {
      "title": "CONCEPT MAP \u2014 DATA PREPROCESSING AND VISUALIZATION",
      "branches": [
        {
          "branch": "Branch 1",
          "topic": "Loading Data",
          "example": "Example: ____________________"
        },
        {
          "branch": "Branch 2",
          "topic": "Wrangling",
          "example": "Example: ____________________"
        },
        {
          "branch": "Branch 3",
          "topic": "Aggregation",
          "example": "Example: ____________________"
        },
        {
          "branch": "Branch 4",
          "topic": "Visualization",
          "example": "Example: ____________________"
        }
      ]
    },
    "caseStudy": {
      "scenario": "A retail chain collects daily transaction data from multiple stores in separate CSV files, plus a separate product-details file. Management wants a monthly report showing total sales per product category per region, along with a chart of sales trends over the year.",
      "questions": [
        "How would you combine the transaction files and the product-details file into one dataset?",
        "Which Pandas operations would you use to compute total sales per category per region?",
        "Which type of chart would you use to show the sales trend over the year, and why?",
        "What data wrangling steps might be needed before this analysis can be done (e.g., missing values, inconsistent formats)?"
      ],
      "expectedOutcome": "Students combine data wrangling, aggregation, and visualization skills to solve a realistic multi-source business reporting problem."
    },
    "selfAssessment": [
      "I can explain the major concepts of this unit.",
      "I can define the important terminology from this unit.",
      "I can solve problems/exercises from this unit.",
      "I can apply the concepts of this unit to a new situation."
    ],
    "reflection": [
      "What did I learn in this unit?",
      "What was difficult for me?",
      "What do I need to practice more?",
      "One important concept I learned:"
    ],
    "answerKey": {
      "mcqs": [
        "1. A \u2014 pd.read_csv() is the standard function to load CSV data into a DataFrame.",
        "2. B \u2014 merge() joins DataFrames using one or more shared key columns.",
        "3. B \u2014 Reshaping rearranges data structure, e.g. via pivot or melt operations.",
        "4. B \u2014 groupby() implements the split-apply-combine pattern for aggregation.",
        "5. A \u2014 A pivot table summarizes data across rows and columns of categorical variables.",
        "6. B \u2014 Seaborn offers high-level statistical plotting with better default styling.",
        "7. B \u2014 plt.plot() is used to draw line charts in matplotlib.",
        "8. B \u2014 Time series analysis studies data ordered by time to find trends/patterns.",
        "9. A \u2014 pd.crosstab() computes a cross-tabulation of two or more factors.",
        "10. A \u2014 Cleaning missing or duplicate values is a core data wrangling activity."
      ],
      "fillInBlanks": [
        "merge()",
        "pivot",
        "groupby",
        "Seaborn",
        "time series"
      ],
      "trueFalse": [
        "True",
        "False",
        "True",
        "True",
        "False"
      ],
      "matchKey": "1\u2192b 2\u2192d 3\u2192f 4\u2192g 5\u2192c 6\u2192a 7\u2192e",
      "shortAnswer": [
        "merge() joins on common columns/keys; concat() stacks DataFrames along an axis without key matching.",
        "Cleaning/transforming raw data for analysis, e.g. handling missing values or renaming columns.",
        "It splits data into groups based on a key, applies an aggregate function, then combines results.",
        "A pivot table aggregates numeric values; cross-tabulation typically shows frequency counts between categories.",
        "Visualizing daily stock prices over a year to reveal trends and seasonality."
      ],
      "descriptive": [
        "Cover CSV, Excel, JSON, HTML, and SQL sources using read_/to_ functions.",
        "Discuss merge/concat, pivot/melt, and apply/map based transformations with examples.",
        "Matplotlib gives fine control over low-level plot elements; Seaborn simplifies statistical plots with better defaults.",
        "groupby splits data, aggregation summarizes each group, and pivot tables present the results in a two-dimensional table.",
        "E.g., plotting monthly sales to detect seasonal peaks that inform inventory planning."
      ],
      "practicals": [
        "A single DataFrame containing customer details alongside their corresponding orders.",
        "A summary table showing total and average sales per region.",
        "Two charts (line and bar) showing the sales trend across months."
      ]
    }
  },
  {
    "id": "unit-5",
    "unitNumber": 5,
    "title": "WORKSHEET \u2014 UNIT V",
    "unitName": "Machine Learning for Data Science",
    "course": "Data Science with Python",
    "unit": "V (12 Hrs)",
    "duration": "10-12 Hrs",
    "topics": "Introduction to ML (supervised/unsupervised/reinforcement, ML workflow); Data Preparation (feature engineering, scaling, train-test split, cross-validation); Supervised Learning (linear/logistic regression, kNN, decision trees); Unsupervised Learning (k-means, hierarchical clustering, PCA); Model Evaluation; Introduction to scikit-learn",
    "docxFileName": "Unit_V_Worksheet_Machine_Learning_for_Data_Science.docx",
    "learningObjectives": [
      "Explain the types of machine learning (supervised, unsupervised, reinforcement) and the ML workflow.",
      "Apply data preparation techniques such as feature scaling, train-test split, and cross-validation.",
      "Implement supervised learning algorithms including linear regression, logistic regression, kNN, and decision trees.",
      "Apply unsupervised learning techniques such as k-means clustering and PCA.",
      "Analyze model performance using confusion matrix, accuracy, precision, recall, and F1-score.",
      "Build and evaluate a basic ML model using scikit-learn."
    ],
    "keyConcepts": [
      {
        "id": 1,
        "concept": "Supervised Learning",
        "explanation": "Learning a mapping from labeled input-output pairs to predict outcomes on new data."
      },
      {
        "id": 2,
        "concept": "Unsupervised Learning",
        "explanation": "Finding patterns or structure in data without labeled outputs."
      },
      {
        "id": 3,
        "concept": "Feature Scaling",
        "explanation": "Transforming features to a common scale (e.g., normalization) so models train effectively."
      },
      {
        "id": 4,
        "concept": "Train-Test Split",
        "explanation": "Dividing data into separate sets to train the model and evaluate it on unseen data."
      },
      {
        "id": 5,
        "concept": "Cross-Validation",
        "explanation": "Repeatedly splitting data into folds to get a more reliable estimate of model performance."
      },
      {
        "id": 6,
        "concept": "Overfitting/Underfitting",
        "explanation": "Overfitting memorizes training data poorly generalizing; underfitting fails to capture patterns at all."
      },
      {
        "id": 7,
        "concept": "Confusion Matrix",
        "explanation": "A table showing true/false positives and negatives to evaluate classification performance."
      },
      {
        "id": 8,
        "concept": "Precision & Recall",
        "explanation": "Precision measures correct positive predictions; recall measures how many actual positives were found."
      },
      {
        "id": 9,
        "concept": "k-Means Clustering",
        "explanation": "An unsupervised algorithm that groups data into k clusters based on similarity."
      },
      {
        "id": 10,
        "concept": "PCA",
        "explanation": "Principal Component Analysis reduces data dimensionality while preserving as much variance as possible."
      }
    ],
    "terminology": [
      {
        "id": 1,
        "term": "Supervised Learning",
        "definition": "Training a model on labeled input-output data."
      },
      {
        "id": 2,
        "term": "Unsupervised Learning",
        "definition": "Finding structure in data without labeled outputs."
      },
      {
        "id": 3,
        "term": "Regression",
        "definition": "A supervised technique for predicting a continuous numeric value."
      },
      {
        "id": 4,
        "term": "Classification",
        "definition": "A supervised technique for predicting a discrete category."
      },
      {
        "id": 5,
        "term": "k-Nearest Neighbours",
        "definition": "A classification algorithm based on the closest labeled data points."
      },
      {
        "id": 6,
        "term": "Decision Tree",
        "definition": "A tree-like model that splits data based on feature values to make predictions."
      },
      {
        "id": 7,
        "term": "Clustering",
        "definition": "Grouping similar data points together without predefined labels."
      },
      {
        "id": 8,
        "term": "Feature Scaling",
        "definition": "Rescaling features so they contribute equally to model training."
      },
      {
        "id": 9,
        "term": "Cross-Validation",
        "definition": "A technique to evaluate a model's performance across multiple data splits."
      },
      {
        "id": 10,
        "term": "Overfitting",
        "definition": "When a model performs well on training data but poorly on new data."
      },
      {
        "id": 11,
        "term": "Confusion Matrix",
        "definition": "A table summarizing correct and incorrect classification predictions."
      },
      {
        "id": 12,
        "term": "Accuracy",
        "definition": "The proportion of total predictions that are correct."
      },
      {
        "id": 13,
        "term": "Precision",
        "definition": "The proportion of positive predictions that are actually correct."
      },
      {
        "id": 14,
        "term": "Recall",
        "definition": "The proportion of actual positives that were correctly predicted."
      },
      {
        "id": 15,
        "term": "Scikit-learn",
        "definition": "A popular Python library for building and evaluating machine learning models."
      }
    ],
    "mcqs": [
      {
        "id": 1,
        "question": "Which type of machine learning uses labeled data to train a model?",
        "options": [
          "Unsupervised learning",
          "Supervised learning",
          "Reinforcement learning",
          "None of these"
        ],
        "correctOption": "B",
        "correctIndex": 1,
        "explanation": "Supervised learning trains on input-output pairs where labels are known."
      },
      {
        "id": 2,
        "question": "Which algorithm is used for predicting a continuous numeric value?",
        "options": [
          "Logistic Regression",
          "k-Means Clustering",
          "Linear Regression",
          "Decision Tree Classifier"
        ],
        "correctOption": "C",
        "correctIndex": 2,
        "explanation": "Linear regression predicts continuous outcomes; logistic regression predicts categories."
      },
      {
        "id": 3,
        "question": "What is the purpose of a train-test split?",
        "options": [
          "To duplicate the dataset",
          "To evaluate the model on unseen data",
          "To remove outliers",
          "To scale features"
        ],
        "correctOption": "B",
        "correctIndex": 1,
        "explanation": "Splitting data lets us test the model's performance on data it hasn't seen during training."
      },
      {
        "id": 4,
        "question": "Which technique reduces the dimensionality of a dataset while preserving variance?",
        "options": [
          "k-Means Clustering",
          "PCA",
          "Decision Tree",
          "Cross-validation"
        ],
        "correctOption": "B",
        "correctIndex": 1,
        "explanation": "Principal Component Analysis (PCA) reduces dimensions while retaining as much variance as possible."
      },
      {
        "id": 5,
        "question": "What does a high recall value indicate in a classification model?",
        "options": [
          "Most actual positives were correctly identified",
          "Most predictions are negative",
          "The model always predicts positive",
          "The model is overfitting"
        ],
        "correctOption": "A",
        "correctIndex": 0,
        "explanation": "Recall measures the fraction of actual positives correctly identified by the model."
      },
      {
        "id": 6,
        "question": "Which algorithm groups data points into clusters without using labels?",
        "options": [
          "Logistic Regression",
          "k-Means Clustering",
          "Decision Tree",
          "kNN"
        ],
        "correctOption": "B",
        "correctIndex": 1,
        "explanation": "k-Means is an unsupervised clustering algorithm that groups similar points."
      },
      {
        "id": 7,
        "question": "What does overfitting mean in machine learning?",
        "options": [
          "The model performs poorly on both training and test data",
          "The model performs well on training data but poorly on new data",
          "The model has too few parameters",
          "The model cannot be trained at all"
        ],
        "correctOption": "B",
        "correctIndex": 1,
        "explanation": "Overfitting means the model memorizes training data but fails to generalize to new data."
      },
      {
        "id": 8,
        "question": "Which metric represents the proportion of total predictions that are correct?",
        "options": [
          "Precision",
          "Recall",
          "Accuracy",
          "F1-Score"
        ],
        "correctOption": "C",
        "correctIndex": 2,
        "explanation": "Accuracy = (correct predictions) / (total predictions)."
      },
      {
        "id": 9,
        "question": "Which Python library is commonly used to build and evaluate ML models?",
        "options": [
          "BeautifulSoup",
          "Tkinter",
          "scikit-learn",
          "SQLAlchemy"
        ],
        "correctOption": "C",
        "correctIndex": 2,
        "explanation": "scikit-learn provides a wide range of ML algorithms and evaluation tools."
      },
      {
        "id": 10,
        "question": "What does the ROC curve help evaluate in classification models?",
        "options": [
          "Clustering quality",
          "Trade-off between true positive rate and false positive rate",
          "Feature scaling accuracy",
          "Data loading speed"
        ],
        "correctOption": "B",
        "correctIndex": 1,
        "explanation": "The ROC curve plots true positive rate vs false positive rate across thresholds."
      }
    ],
    "fillInBlanks": [
      {
        "id": 1,
        "question": "__________ learning uses labeled data to train a predictive model.",
        "answer": "Supervised"
      },
      {
        "id": 2,
        "question": "__________ is an unsupervised algorithm that groups data into k clusters.",
        "answer": "k-Means"
      },
      {
        "id": 3,
        "question": "__________ occurs when a model performs well on training data but poorly on new data.",
        "answer": "Overfitting"
      },
      {
        "id": 4,
        "question": "The __________ matrix summarizes true/false positives and negatives for a classification model.",
        "answer": "confusion"
      },
      {
        "id": 5,
        "question": "__________ is a Python library widely used for building and evaluating ML models.",
        "answer": "scikit-learn"
      }
    ],
    "trueFalse": [
      {
        "id": 1,
        "statement": "Linear regression is used to predict a continuous numeric outcome.",
        "isTrue": true
      },
      {
        "id": 2,
        "statement": "k-Means clustering requires labeled training data.",
        "isTrue": false
      },
      {
        "id": 3,
        "statement": "Cross-validation helps produce a more reliable estimate of model performance.",
        "isTrue": true
      },
      {
        "id": 4,
        "statement": "Precision measures how many actual positive cases were correctly identified.",
        "isTrue": false
      },
      {
        "id": 5,
        "statement": "PCA is used to reduce the number of features while preserving variance.",
        "isTrue": true
      }
    ],
    "matchTheFollowing": [
      {
        "id": 1,
        "left": "1. Linear Regression",
        "right": "a. Dimensionality reduction technique"
      },
      {
        "id": 2,
        "left": "2. Logistic Regression",
        "right": "b. Predicts a continuous numeric value"
      },
      {
        "id": 3,
        "left": "3. k-Means",
        "right": "c. Table summarizing classification results"
      },
      {
        "id": 4,
        "left": "4. PCA",
        "right": "d. Predicts a categorical outcome (0/1)"
      },
      {
        "id": 5,
        "left": "5. Decision Tree",
        "right": "e. Tree-based supervised model"
      },
      {
        "id": 6,
        "left": "6. Confusion Matrix",
        "right": "f. Groups data into unlabeled clusters"
      },
      {
        "id": 7,
        "left": "7. Cross-Validation",
        "right": "g. Evaluates a model across multiple data splits"
      }
    ],
    "shortAnswerQuestions": [
      {
        "id": 1,
        "question": "Differentiate between supervised and unsupervised learning.",
        "keyPoint": "Supervised learning uses labeled data; unsupervised learning finds structure without labels."
      },
      {
        "id": 2,
        "question": "What is the purpose of feature scaling before training a model?",
        "keyPoint": "It ensures features with different ranges contribute fairly, improving model training and convergence."
      },
      {
        "id": 3,
        "question": "Define precision and recall, and explain the difference between them.",
        "keyPoint": "Precision = correct positive predictions / all positive predictions; Recall = correct positive predictions / all actual positives."
      },
      {
        "id": 4,
        "question": "What is the difference between k-means clustering and k-nearest neighbours?",
        "keyPoint": "k-means is unsupervised clustering; kNN is a supervised classification/regression algorithm using labeled neighbours."
      },
      {
        "id": 5,
        "question": "Why is cross-validation preferred over a single train-test split?",
        "keyPoint": "It reduces the risk of a lucky/unlucky split by averaging performance across multiple folds."
      }
    ],
    "descriptiveQuestions": [
      {
        "id": 1,
        "question": "Explain the different types of machine learning with real-world examples of each.",
        "keyPoint": "Supervised (spam detection), unsupervised (customer segmentation), reinforcement (game-playing agents)."
      },
      {
        "id": 2,
        "question": "Describe the typical machine learning workflow from data collection to model evaluation.",
        "keyPoint": "Data collection, preprocessing, feature engineering, train-test split, model training, evaluation, tuning."
      },
      {
        "id": 3,
        "question": "Compare linear regression, logistic regression, and decision trees as supervised learning methods.",
        "keyPoint": "Linear regression: continuous output; logistic regression: binary classification; decision trees: rule-based splits for both tasks."
      },
      {
        "id": 4,
        "question": "Explain overfitting and underfitting, and how cross-validation helps address them.",
        "keyPoint": "Overfitting fits noise; underfitting misses patterns; cross-validation helps tune model complexity appropriately."
      },
      {
        "id": 5,
        "question": "Discuss the key evaluation metrics used for classification models and when each is most important.",
        "keyPoint": "Accuracy for balanced data, precision when false positives are costly, recall when false negatives are costly, F1 balances both."
      }
    ],
    "practicals": [
      {
        "title": "Practical 1",
        "problem": "Build a simple linear regression model to predict house prices from house size.",
        "tasks": [
          "1. Create a small dataset with house size and price columns.",
          "2. Split the data into training and test sets.",
          "3. Train a LinearRegression model using scikit-learn and predict prices on the test set."
        ],
        "expectedOutput": "Predicted house prices for the test set, close to the actual values."
      },
      {
        "title": "Practical 2",
        "problem": "Apply k-Means clustering to group customers based on spending behaviour.",
        "tasks": [
          "1. Create a dataset with customer income and spending score columns.",
          "2. Apply KMeans clustering with k=3 using scikit-learn.",
          "3. Print the cluster label assigned to each customer."
        ],
        "expectedOutput": "Each customer assigned to one of three clusters based on similarity."
      },
      {
        "title": "Practical 3",
        "problem": "Evaluate a classification model using a confusion matrix and accuracy score.",
        "tasks": [
          "1. Train a simple classifier (e.g., Logistic Regression or Decision Tree) on a small labeled dataset.",
          "2. Predict labels on the test set.",
          "3. Compute and print the confusion matrix, accuracy, precision, and recall."
        ],
        "expectedOutput": "A confusion matrix and the corresponding accuracy, precision, and recall values."
      }
    ],
    "conceptMap": {
      "title": "CONCEPT MAP \u2014 MACHINE LEARNING FOR DATA SCIENCE",
      "branches": [
        {
          "branch": "Branch 1",
          "topic": "Supervised Learning",
          "example": "Example: ____________________"
        },
        {
          "branch": "Branch 2",
          "topic": "Unsupervised Learning",
          "example": "Example: ____________________"
        },
        {
          "branch": "Branch 3",
          "topic": "Model Evaluation",
          "example": "Example: ____________________"
        },
        {
          "branch": "Branch 4",
          "topic": "Tools",
          "example": "Example: ____________________"
        }
      ]
    },
    "caseStudy": {
      "scenario": "A bank wants to build a system that predicts whether a loan applicant is likely to default, using historical applicant data (income, credit history, loan amount, and past defaults).",
      "questions": [
        "Would this be a supervised or unsupervised learning problem? Justify your answer.",
        "Which algorithm(s) from this unit would be suitable for this classification task, and why?",
        "What data preparation steps (scaling, train-test split) would you apply before training the model?",
        "Which evaluation metrics would matter most for this problem \u2014 accuracy, precision, or recall? Explain why."
      ],
      "expectedOutcome": "Students connect supervised learning algorithms, data preparation, and evaluation metrics to a realistic financial risk-prediction scenario."
    },
    "selfAssessment": [
      "I can explain the major concepts of this unit.",
      "I can define the important terminology from this unit.",
      "I can solve problems/exercises from this unit.",
      "I can apply the concepts of this unit to a new situation."
    ],
    "reflection": [
      "What did I learn in this unit?",
      "What was difficult for me?",
      "What do I need to practice more?",
      "One important concept I learned:"
    ],
    "answerKey": {
      "mcqs": [
        "1. B \u2014 Supervised learning trains on input-output pairs where labels are known.",
        "2. C \u2014 Linear regression predicts continuous outcomes; logistic regression predicts categories.",
        "3. B \u2014 Splitting data lets us test the model's performance on data it hasn't seen during training.",
        "4. B \u2014 Principal Component Analysis (PCA) reduces dimensions while retaining as much variance as possible.",
        "5. A \u2014 Recall measures the fraction of actual positives correctly identified by the model.",
        "6. B \u2014 k-Means is an unsupervised clustering algorithm that groups similar points.",
        "7. B \u2014 Overfitting means the model memorizes training data but fails to generalize to new data.",
        "8. C \u2014 Accuracy = (correct predictions) / (total predictions).",
        "9. C \u2014 scikit-learn provides a wide range of ML algorithms and evaluation tools.",
        "10. B \u2014 The ROC curve plots true positive rate vs false positive rate across thresholds."
      ],
      "fillInBlanks": [
        "Supervised",
        "k-Means",
        "Overfitting",
        "confusion",
        "scikit-learn"
      ],
      "trueFalse": [
        "True",
        "False",
        "True",
        "False",
        "True"
      ],
      "matchKey": "1\u2192b 2\u2192d 3\u2192f 4\u2192a 5\u2192e 6\u2192c 7\u2192g",
      "shortAnswer": [
        "Supervised learning uses labeled data; unsupervised learning finds structure without labels.",
        "It ensures features with different ranges contribute fairly, improving model training and convergence.",
        "Precision = correct positive predictions / all positive predictions; Recall = correct positive predictions / all actual positives.",
        "k-means is unsupervised clustering; kNN is a supervised classification/regression algorithm using labeled neighbours.",
        "It reduces the risk of a lucky/unlucky split by averaging performance across multiple folds."
      ],
      "descriptive": [
        "Supervised (spam detection), unsupervised (customer segmentation), reinforcement (game-playing agents).",
        "Data collection, preprocessing, feature engineering, train-test split, model training, evaluation, tuning.",
        "Linear regression: continuous output; logistic regression: binary classification; decision trees: rule-based splits for both tasks.",
        "Overfitting fits noise; underfitting misses patterns; cross-validation helps tune model complexity appropriately.",
        "Accuracy for balanced data, precision when false positives are costly, recall when false negatives are costly, F1 balances both."
      ],
      "practicals": [
        "Predicted house prices for the test set, close to the actual values.",
        "Each customer assigned to one of three clusters based on similarity.",
        "A confusion matrix and the corresponding accuracy, precision, and recall values."
      ]
    }
  }
];
