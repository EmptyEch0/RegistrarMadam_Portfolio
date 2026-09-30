import zipfile
import xml.etree.ElementTree as ET
import json
import re
import os

ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}

def parse_docx(filepath):
    with zipfile.ZipFile(filepath) as z:
        tree = ET.fromstring(z.read('word/document.xml'))
        
        # 1. Tables
        tables = []
        for tbl in tree.findall('.//w:tbl', ns):
            rows = []
            for tr in tbl.findall('.//w:tr', ns):
                cells = [' '.join(''.join(tc.itertext()).strip().split()) for tc in tr.findall('.//w:tc', ns)]
                rows.append(cells)
            tables.append(rows)
            
        # 2. Paragraphs
        paras = []
        for p in tree.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'):
            t = ' '.join(''.join(p.itertext()).strip().split())
            if t:
                paras.append(t)
                
    return paras, tables

def process_worksheet(paras, tables, unit_id, unit_number, docx_filename):
    title = paras[0] if len(paras) > 0 else ""
    unit_name = paras[1] if len(paras) > 1 else ""
    course = paras[2].replace("Course: ", "") if len(paras) > 2 else "Data Science with Python"
    unit_str = paras[3].replace("Unit: ", "") if len(paras) > 3 else f"Unit {unit_number}"
    topics_str = paras[4].replace("Topics: ", "") if len(paras) > 4 else ""

    # Split paragraphs by Section
    sections = {}
    current_sec = "HEADER"
    sections[current_sec] = []
    
    for p in paras[5:]:
        if "Section " in p:
            # find letter A-O
            m = re.search(r"Section ([A-O])", p)
            if m:
                current_sec = "SEC_" + m.group(1)
                sections[current_sec] = []
                continue
        sections[current_sec].append(p)
        
    # Section A: Learning Objectives
    sec_a_raw = sections.get("SEC_A", [])
    objectives = []
    for p in sec_a_raw:
        clean_p = re.sub(r"^\d+\.\s*", "", p).strip()
        if clean_p:
            objectives.append(clean_p)
            
    # Section B: Key Concepts (Table 0)
    key_concepts = []
    if len(tables) > 0 and len(tables[0]) > 1:
        for row in tables[0][1:]:
            if len(row) >= 3:
                try:
                    c_id = int(row[0])
                except:
                    c_id = len(key_concepts) + 1
                key_concepts.append({
                    "id": c_id,
                    "concept": row[1],
                    "explanation": row[2]
                })
                
    # Section C: Terminology (Table 1)
    terminology = []
    if len(tables) > 1 and len(tables[1]) > 1:
        for idx, row in enumerate(tables[1][1:], 1):
            if len(row) >= 2:
                terminology.append({
                    "id": idx,
                    "term": row[0],
                    "definition": row[1]
                })
                
    # Section O: Instructor Answer Key
    sec_o_raw = sections.get("SEC_O", [])
    mcq_answers_map = {}
    fill_answers = []
    tf_answers = []
    match_key_str = ""
    short_answer_points = []
    descriptive_points = []
    practical_outputs = []
    
    current_o_mode = None
    for p in sec_o_raw:
        if "MCQ Answers" in p: current_o_mode = "MCQ"; continue
        elif "Fill in the Blanks" in p: current_o_mode = "FILL"; continue
        elif "True/False" in p or "True or False" in p: current_o_mode = "TF"; continue
        elif "Match the Following" in p: current_o_mode = "MATCH"; continue
        elif "Short Answer" in p: current_o_mode = "SHORT"; continue
        elif "Descriptive Questions" in p: current_o_mode = "DESC"; continue
        elif "Practical Activities" in p: current_o_mode = "PRACTICAL"; continue
        
        if current_o_mode == "MCQ":
            # format: • 1. B — explanation
            m = re.search(r"(\d+)\.\s*([A-D])\s*[—–-]\s*(.*)", p)
            if m:
                mcq_answers_map[int(m.group(1))] = {
                    "letter": m.group(2),
                    "explanation": m.group(3).strip()
                }
        elif current_o_mode == "FILL":
            m = re.search(r"(\d+)\.\s*(.*)", p)
            if m:
                fill_answers.append(m.group(2).strip())
            elif p.startswith("•"):
                fill_answers.append(p.lstrip("•").strip())
        elif current_o_mode == "TF":
            m = re.search(r"(\d+)\.\s*(True|False)", p, re.IGNORECASE)
            if m:
                tf_answers.append(m.group(2).strip().capitalize())
            elif "True" in p: tf_answers.append("True")
            elif "False" in p: tf_answers.append("False")
        elif current_o_mode == "MATCH":
            match_key_str = p.strip()
        elif current_o_mode == "SHORT":
            m = re.search(r"(\d+)\.\s*(.*)", p)
            if m: short_answer_points.append(m.group(2).strip())
            elif p.startswith("•"): short_answer_points.append(p.lstrip("•").strip())
        elif current_o_mode == "DESC":
            m = re.search(r"(\d+)\.\s*(.*)", p)
            if m: descriptive_points.append(m.group(2).strip())
            elif p.startswith("•"): descriptive_points.append(p.lstrip("•").strip())
        elif current_o_mode == "PRACTICAL":
            m = re.search(r"(\d+)\.\s*(.*)", p)
            if m: practical_outputs.append(m.group(2).strip())
            elif p.startswith("•"): practical_outputs.append(p.lstrip("•").strip())
            
    # Section D: MCQs (10 items)
    sec_d_raw = sections.get("SEC_D", [])
    mcqs = []
    i = 0
    q_num = 1
    while i < len(sec_d_raw):
        line = sec_d_raw[i]
        if re.match(r"^\d+\.", line):
            q_text = re.sub(r"^\d+\.\s*", "", line).strip()
            opts = []
            i += 1
            while i < len(sec_d_raw) and re.match(r"^[A-D]\.", sec_d_raw[i]):
                opts.append(re.sub(r"^[A-D]\.\s*", "", sec_d_raw[i]).strip())
                i += 1
            ans_info = mcq_answers_map.get(q_num, {"letter": "A", "explanation": ""})
            correct_letter = ans_info["letter"]
            letter_idx = {"A": 0, "B": 1, "C": 2, "D": 3}.get(correct_letter, 0)
            mcqs.append({
                "id": q_num,
                "question": q_text,
                "options": opts,
                "correctOption": correct_letter,
                "correctIndex": letter_idx,
                "explanation": ans_info["explanation"]
            })
            q_num += 1
        else:
            i += 1
            
    # Section E: Fill in the Blanks (5 items)
    sec_e_raw = sections.get("SEC_E", [])
    fill_in_blanks = []
    for idx, p in enumerate(sec_e_raw, 1):
        q_text = re.sub(r"^\d+\.\s*", "", p).strip()
        ans = fill_answers[idx-1] if idx-1 < len(fill_answers) else ""
        if q_text:
            fill_in_blanks.append({
                "id": idx,
                "question": q_text,
                "answer": ans
            })
            
    # Section F: True or False (5 items)
    sec_f_raw = sections.get("SEC_F", [])
    true_false = []
    for idx, p in enumerate(sec_f_raw, 1):
        statement = re.sub(r"^\d+\.\s*", "", p).replace("(True / False)", "").strip()
        ans_str = tf_answers[idx-1] if idx-1 < len(tf_answers) else "True"
        is_true = ans_str.lower() == "true"
        if statement:
            true_false.append({
                "id": idx,
                "statement": statement,
                "isTrue": is_true
            })
            
    # Section G: Match the Following (Table 2)
    match_items = []
    if len(tables) > 2 and len(tables[2]) > 1:
        for idx, row in enumerate(tables[2][1:], 1):
            if len(row) >= 2:
                match_items.append({
                    "id": idx,
                    "left": row[0],
                    "right": row[1]
                })
                
    # Section H: Short Answer Questions (5 items)
    sec_h_raw = sections.get("SEC_H", [])
    short_answers = []
    for idx, p in enumerate(sec_h_raw, 1):
        q_text = re.sub(r"^\d+\.\s*", "", p).strip()
        kp = short_answer_points[idx-1] if idx-1 < len(short_answer_points) else ""
        if q_text:
            short_answers.append({
                "id": idx,
                "question": q_text,
                "keyPoint": kp
            })
            
    # Section I: Descriptive Questions (4-5 items)
    sec_i_raw = sections.get("SEC_I", [])
    descriptive = []
    for idx, p in enumerate(sec_i_raw, 1):
        q_text = re.sub(r"^\d+\.\s*", "", p).strip()
        kp = descriptive_points[idx-1] if idx-1 < len(descriptive_points) else ""
        if q_text:
            descriptive.append({
                "id": idx,
                "question": q_text,
                "keyPoint": kp
            })
            
    # Section J: Practical Questions (3 items)
    sec_j_raw = sections.get("SEC_J", [])
    practicals = []
    p_blocks = []
    curr_block = []
    for p in sec_j_raw:
        if p.startswith("Practical "):
            if curr_block: p_blocks.append(curr_block)
            curr_block = [p]
        else:
            curr_block.append(p)
    if curr_block: p_blocks.append(curr_block)
    
    for idx, blk in enumerate(p_blocks, 1):
        p_title = blk[0] if len(blk) > 0 else f"Practical {idx}"
        problem = ""
        tasks = []
        expected = practical_outputs[idx-1] if idx-1 < len(practical_outputs) else ""
        mode = None
        for line in blk[1:]:
            if line.startswith("Problem:"):
                problem = line.replace("Problem:", "").strip()
            elif line.startswith("Task:"):
                mode = "TASKS"
            elif line.startswith("Expected Output:"):
                expected = line.replace("Expected Output:", "").strip()
                mode = None
            elif mode == "TASKS":
                tasks.append(line)
        practicals.append({
            "title": p_title,
            "problem": problem,
            "tasks": tasks,
            "expectedOutput": expected
        })
        
    # Section K: Concept Map (Table 3)
    concept_map = {
        "title": f"CONCEPT MAP — {unit_name.upper()}",
        "branches": []
    }
    if len(tables) > 3 and len(tables[3]) >= 2:
        header_row = tables[3][0] # ['Branch 1', 'Branch 2', ...]
        topic_row = tables[3][1]  # ['NumPy Arrays', 'Pandas Structures', ...]
        example_row = tables[3][2] if len(tables[3]) > 2 else []
        for b_idx in range(len(header_row)):
            b_name = header_row[b_idx] if b_idx < len(header_row) else f"Branch {b_idx+1}"
            b_topic = topic_row[b_idx] if b_idx < len(topic_row) else ""
            b_ex = example_row[b_idx] if b_idx < len(example_row) else ""
            concept_map["branches"].append({
                "branch": b_name,
                "topic": b_topic,
                "example": b_ex
            })
            
    # Section L: Case Study
    sec_l_raw = sections.get("SEC_L", [])
    scenario = ""
    cs_questions = []
    expected_outcome = ""
    mode = None
    for p in sec_l_raw:
        if p == "Scenario": mode = "SCENARIO"; continue
        elif p == "Questions": mode = "QUESTIONS"; continue
        elif p == "Expected Learning Outcome": mode = "OUTCOME"; continue
        
        if mode == "SCENARIO":
            scenario += (" " + p if scenario else p)
        elif mode == "QUESTIONS":
            clean_q = re.sub(r"^\d+\.\s*", "", p).strip()
            if clean_q: cs_questions.append(clean_q)
        elif mode == "OUTCOME":
            expected_outcome += (" " + p if expected_outcome else p)
            
    case_study = {
        "scenario": scenario,
        "questions": cs_questions,
        "expectedOutcome": expected_outcome
    }
    
    # Section M & N
    self_assessment = [
        "I can explain the major concepts of this unit.",
        "I can define the important terminology from this unit.",
        "I can solve problems/exercises from this unit.",
        "I can apply the concepts of this unit to a new situation."
    ]
    reflection = [
        "What did I learn in this unit?",
        "What was difficult for me?",
        "What do I need to practice more?",
        "One important concept I learned:"
    ]
    
    return {
        "id": unit_id,
        "unitNumber": unit_number,
        "title": title,
        "unitName": unit_name,
        "course": course,
        "unit": unit_str,
        "duration": "10-12 Hrs",
        "topics": topics_str,
        "docxFileName": docx_filename,
        "learningObjectives": objectives,
        "keyConcepts": key_concepts,
        "terminology": terminology,
        "mcqs": mcqs,
        "fillInBlanks": fill_in_blanks,
        "trueFalse": true_false,
        "matchTheFollowing": match_items,
        "shortAnswerQuestions": short_answers,
        "descriptiveQuestions": descriptive,
        "practicals": practicals,
        "conceptMap": concept_map,
        "caseStudy": case_study,
        "selfAssessment": self_assessment,
        "reflection": reflection,
        "answerKey": {
            "mcqs": [f"{m['id']}. {m['correctOption']} — {m['explanation']}" for m in mcqs],
            "fillInBlanks": fill_answers,
            "trueFalse": tf_answers,
            "matchKey": match_key_str,
            "shortAnswer": short_answer_points,
            "descriptive": descriptive_points,
            "practicals": practical_outputs
        }
    }

print("Parsing started...")
results = []

# Unit 1 (Synthesized to complete syllabus)
unit_1 = {
    "id": "unit-1",
    "unitNumber": 1,
    "title": "WORKSHEET — UNIT I",
    "unitName": "Python Basics and Programming Concepts",
    "course": "Data Science with Python",
    "unit": "I (10 Hrs)",
    "duration": "10 Hrs",
    "topics": "Types and Operations; Statements and Syntax; Functions; Modules and Packages; Classes and OOP; Exceptions and Tools",
    "docxFileName": None,
    "learningObjectives": [
        "Explain basic Python data types, operators, and dynamic typing principles.",
        "Apply control flow statements including if-elif-else conditionals, while loops, and for loops.",
        "Design modular Python functions using positional, keyword, and variable arguments (*args, **kwargs).",
        "Implement Python modules and organize code using packages and namespaces.",
        "Construct object-oriented Python classes utilizing inheritance, encapsulation, and special methods.",
        "Handle runtime errors robustly using try-except-finally blocks and custom exceptions."
    ],
    "keyConcepts": [
        {"id": 1, "concept": "Dynamic Typing", "explanation": "Variables are bound to objects at runtime without explicit type declarations."},
        {"id": 2, "concept": "Mutability", "explanation": "Mutable objects (lists, dicts) can be changed in place; immutable objects (strings, tuples) cannot."},
        {"id": 3, "concept": "List Comprehensions", "explanation": "Concise syntax for generating new lists by applying expressions to existing iterables."},
        {"id": 4, "concept": "First-Class Functions", "explanation": "Functions can be passed as arguments, returned from other functions, and assigned to variables."},
        {"id": 5, "concept": "Namespaces & Scopes", "explanation": "LEGB rule (Local, Enclosing, Global, Built-in) governing variable lookup resolution."},
        {"id": 6, "concept": "OOP & Encapsulation", "explanation": "Bundling data attributes and member methods into classes with controlled access."},
        {"id": 7, "concept": "Inheritance & Polymorphism", "explanation": "Creating child classes that inherit and customize parent class behavior."},
        {"id": 8, "concept": "Exception Handling", "explanation": "Structured error management with try, except, else, and finally clauses."}
    ],
    "terminology": [
        {"id": 1, "term": "Python", "definition": "A high-level, interpreted, general-purpose programming language emphasizing readability."},
        {"id": 2, "term": "Type Hierarchy", "definition": "The built-in system of primitives, sequences, mappings, sets, and custom objects in Python."},
        {"id": 3, "term": "Tuple", "definition": "An immutable sequence of heterogeneous Python objects enclosed in parentheses."},
        {"id": 4, "term": "Dictionary", "definition": "A mutable, unordered/insertion-ordered mapping of unique keys to arbitrary values."},
        {"id": 5, "term": "Lambda", "definition": "An anonymous inline function defined using the lambda keyword."},
        {"id": 6, "term": "Generator", "definition": "A memory-efficient iterator function that yields values on demand using the yield statement."},
        {"id": 7, "term": "Decorator", "definition": "A callable that takes another function and extends its behavior without modifying its source."},
        {"id": 8, "term": "Dunder Methods", "definition": "Double-underscore special methods (__init__, __str__, __len__) enabling operator overloading."},
        {"id": 9, "term": "Module", "definition": "A single Python file containing definitions, functions, and runnable code."},
        {"id": 10, "term": "Package", "definition": "A directory containing multiple modules and an __init__.py initialization file."},
        {"id": 11, "term": "Global Keyword", "definition": "Declaration allowing functions to modify variables in the module-level global namespace."},
        {"id": 12, "term": "Exception", "definition": "An event triggered during execution that disrupts normal instruction flow."},
        {"id": 13, "term": "Traceback", "definition": "A report containing the sequence of function calls leading up to an unhandled exception."},
        {"id": 14, "term": "Self Parameter", "definition": "Explicit reference to the current instance of a class passed to method calls."},
        {"id": 15, "term": "Docstring", "definition": "String literal occurring as the first statement in a module, function, or class for documentation."}
    ],
    "mcqs": [
        {"id": 1, "question": "Which of the following built-in types is immutable in Python?", "options": ["List", "Dictionary", "Tuple", "Set"], "correctOption": "C", "correctIndex": 2, "explanation": "Tuples are immutable; once created, their elements cannot be modified."},
        {"id": 2, "question": "What is the output of bool([]) in Python?", "options": ["True", "False", "None", "Error"], "correctOption": "B", "correctIndex": 1, "explanation": "Empty collections (lists, tuples, dicts, strings) evaluate to False in boolean context."},
        {"id": 3, "question": "Which scope rule defines the lookup order for variables in Python?", "options": ["LIFO", "FIFO", "LEGB", "SOLID"], "correctOption": "C", "correctIndex": 2, "explanation": "Python resolves names using Local -> Enclosing -> Global -> Built-in (LEGB)."},
        {"id": 4, "question": "How are variable keyword arguments accepted in a Python function definition?", "options": ["*args", "**kwargs", "&params", "$kwargs"], "correctOption": "B", "correctIndex": 1, "explanation": "**kwargs captures arbitrary named arguments into a dictionary."},
        {"id": 5, "question": "What does the 'is' operator test for in Python?", "options": ["Value equality", "Object identity (same memory address)", "Data type similarity", "Subclass relationship"], "correctOption": "B", "correctIndex": 1, "explanation": "'is' checks whether two variables refer to the exact same object in memory."},
        {"id": 6, "question": "Which method is invoked automatically when a new object instance is created in Python?", "options": ["__new__", "__init__", "__start__", "__main__"], "correctOption": "B", "correctIndex": 1, "explanation": "__init__ acts as the class initializer/constructor."},
        {"id": 7, "question": "What happens if an exception is not caught in a try-except block?", "options": ["Program ignores it and continues", "Program terminates with a traceback", "Python compiles it into byte-code", "Variable is set to None"], "correctOption": "B", "correctIndex": 1, "explanation": "Unhandled exceptions bubble up to the interpreter and terminate execution with a traceback."},
        {"id": 8, "question": "Which keyword is used to create a generator function?", "options": ["return", "yield", "generate", "iter"], "correctOption": "B", "correctIndex": 1, "explanation": "The 'yield' statement produces a value and suspends execution until the next value is requested."},
        {"id": 9, "question": "What is the purpose of the __name__ == '__main__' idiom?", "options": ["To define class variables", "To execute code only when the file is run directly", "To import standard library modules", "To speed up loop execution"], "correctOption": "B", "correctIndex": 1, "explanation": "It allows a module to act both as an importable library and as a standalone executable script."},
        {"id": 10, "question": "Which block in exception handling executes regardless of whether an exception occurred?", "options": ["try", "except", "else", "finally"], "correctOption": "D", "correctIndex": 3, "explanation": "The finally block always runs, making it ideal for cleanup operations like closing files."}
    ],
    "fillInBlanks": [
        {"id": 1, "question": "In Python, strings and tuples are __________ data types.", "answer": "immutable"},
        {"id": 2, "question": "The __________ statement allows a function to produce a sequence of values lazily.", "answer": "yield"},
        {"id": 3, "question": "The special first argument in Python instance methods is conventionally named __________.", "answer": "self"},
        {"id": 4, "question": "The __________ block executes only if NO exceptions were raised in the try block.", "answer": "else"},
        {"id": 5, "question": "A directory must contain an __________ file to be recognized as a standard package in older Python versions.", "answer": "__init__.py"}
    ],
    "trueFalse": [
        {"id": 1, "statement": "Python lists can contain elements of multiple different data types.", "isTrue": True},
        {"id": 2, "statement": "A function in Python cannot return multiple values in a single statement.", "isTrue": False},
        {"id": 3, "statement": "The 'finally' block in exception handling will execute even if a return statement is reached in 'try'.", "isTrue": True},
        {"id": 4, "statement": "Private class attributes in Python are enforced strictly by the compiler and cannot be accessed.", "isTrue": False},
        {"id": 5, "statement": "List comprehensions generally execute faster than equivalent for-loops in CPython.", "isTrue": True}
    ],
    "matchTheFollowing": [
        {"id": 1, "left": "1. __init__", "right": "a. Captures arbitrary keyword arguments"},
        {"id": 2, "left": "2. lambda", "right": "b. Class constructor/initializer method"},
        {"id": 3, "left": "3. **kwargs", "right": "c. Anonymous single-expression function"},
        {"id": 4, "left": "4. yield", "right": "d. Variable name resolution hierarchy"},
        {"id": 5, "left": "5. LEGB", "right": "e. Memory cleanup block in exception handling"},
        {"id": 6, "left": "6. finally", "right": "f. Suspends state and yields next generator item"},
        {"id": 7, "left": "7. immutable", "right": "g. Strings, Tuples, and FrozenSets"}
    ],
    "shortAnswerQuestions": [
        {"id": 1, "question": "Explain the difference between mutable and immutable data types in Python.", "keyPoint": "Mutable types (list, dict, set) can have their contents altered in-place without changing object ID, while immutable types (int, float, str, tuple) cannot be modified after instantiation."},
        {"id": 2, "question": "What is the difference between shallow copy and deep copy in Python?", "keyPoint": "A shallow copy creates a new compound object and inserts references to the original child objects, whereas a deep copy recursively duplicates all nested objects."},
        {"id": 3, "question": "How does the LEGB rule determine variable lookup resolution?", "keyPoint": "Python looks for variable names first in the Local scope, then in Enclosing function scopes, then Global module namespace, and finally in the Built-in namespace."},
        {"id": 4, "question": "Explain how *args and **kwargs work in function definitions.", "keyPoint": "*args bundles extra positional arguments into a tuple, while **kwargs bundles extra keyword arguments into a key-value dictionary."},
        {"id": 5, "question": "Why is it recommended to catch specific exceptions rather than a bare except clause?", "keyPoint": "A bare except catches everything including KeyboardInterrupt and SystemExit, masking legitimate bugs and making debugging difficult."}
    ],
    "descriptiveQuestions": [
        {"id": 1, "question": "Describe object-oriented programming concepts in Python including classes, instances, inheritance, and encapsulation.", "keyPoint": "Classes act as blueprints; __init__ initializes instances. Inheritance allows subclasses to extend base behavior via super(), and encapsulation protects state via name mangling conventions."},
        {"id": 2, "question": "Explain Python exception handling architecture with try, except, else, and finally blocks.", "keyPoint": "Code prone to error is wrapped in try. Targeted except clauses handle specific failures, else runs on error-free completion, and finally guarantees critical resource cleanup."},
        {"id": 3, "question": "Compare regular functions, lambda functions, and generator functions with appropriate use cases.", "keyPoint": "Regular functions handle complex logic with docstrings, lambdas serve as quick throwaway callbacks (e.g. in sorted()), and generators handle large streaming data without high memory footprints."},
        {"id": 4, "question": "Discuss Python module creation, packages, __all__, and namespace isolation.", "keyPoint": "Modules group related code in .py files, packages structure modules into folders with __init__.py, and namespace management prevents name collisions across large applications."}
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
        "title": "CONCEPT MAP — PYTHON BASICS & PROGRAMMING",
        "branches": [
            {"branch": "Branch 1", "topic": "Core Data Types", "example": "Lists, Tuples, Dicts, Sets"},
            {"branch": "Branch 2", "topic": "Functions & Scopes", "example": "*args, **kwargs, LEGB, Lambdas"},
            {"branch": "Branch 3", "topic": "OOP Concepts", "example": "Classes, __init__, Inheritance"},
            {"branch": "Branch 4", "topic": "Error Handling", "example": "try-except-else-finally"}
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
            "1. C — Tuples are immutable sequence objects in Python.",
            "2. B — Empty collections evaluate to False.",
            "3. C — LEGB specifies Local, Enclosing, Global, Built-in lookup order.",
            "4. B — **kwargs accepts arbitrary keyword arguments as a dictionary.",
            "5. B — 'is' checks object identity / memory address equality.",
            "6. B — __init__ is called when an instance is initialized.",
            "7. B — Unhandled exceptions bubble up and print tracebacks.",
            "8. B — 'yield' creates a generator function.",
            "9. B — Prevents script execution when imported as a module.",
            "10. D — finally always executes regardless of exceptions."
        ],
        "fillInBlanks": ["immutable", "yield", "self", "else", "__init__.py"],
        "trueFalse": ["True", "False", "True", "False", "True"],
        "matchKey": "1→b   2→c   3→a   4→f   5→d   6→e   7→g",
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
}

results.append(unit_1)

# Units 2-5 from docx
unit_configs = [
    ('Quizzes/Unit_II_Worksheet_Python_Tools_for_Data_Handling_GUI_APIs_Web_Data_and_Databases.docx', 'unit-2', 2, 'Unit_II_Worksheet_Python_Tools_for_Data_Handling_GUI_APIs_Web_Data_and_Databases.docx'),
    ('Quizzes/Unit_III_Worksheet_Pandas_and_NumPy.docx', 'unit-3', 3, 'Unit_III_Worksheet_Pandas_and_NumPy.docx'),
    ('Quizzes/Unit_IV_Worksheet_Data_Preprocessing_and_Visualization.docx', 'unit-4', 4, 'Unit_IV_Worksheet_Data_Preprocessing_and_Visualization.docx'),
    ('Quizzes/Unit_V_Worksheet_Machine_Learning_for_Data_Science.docx', 'unit-5', 5, 'Unit_V_Worksheet_Machine_Learning_for_Data_Science.docx'),
]

for filepath, uid, u_num, docx_name in unit_configs:
    paras, tables = parse_docx(filepath)
    ws = process_worksheet(paras, tables, uid, u_num, docx_name)
    results.append(ws)
    print(f"Processed {uid}: {len(ws['mcqs'])} MCQs, {len(ws['keyConcepts'])} concepts, {len(ws['terminology'])} terms")

# Write to src/data/worksheetsData.ts
ts_content = '''// Comprehensive Worksheets Dataset for Data Science with Python
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

export const WORKSHEETS_DATA: WorksheetData[] = ''' + json.dumps(results, indent=2) + ''';
'''

with open('src/data/worksheetsData.ts', 'w', encoding='utf-8') as out_f:
    out_f.write(ts_content)

print("Generated src/data/worksheetsData.ts successfully!")
