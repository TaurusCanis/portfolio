import json, os, sys

test_info = []
reading_passages = []

def save(data, name):
    location = f'../practice_tests/{name}.json'
    with open(location, 'w') as f:
        json.dump(data, f)

def add_test_info(info, index):
    test_info.append({
            "pk": index + 1,
            "model": "test_prep_backend.test",
            "fields": info
        })

def extract_data(file, index, extacted_data, reading_passages):
    with open(file, 'r') as test_file:
        test_data = test_file.read()
    
    test_data = json.loads(test_data)
    # add_test_info(test_data['test_info'], index)
    
    # process_questions(test_data['initData']['questions'], index, extacted_data)
    # save(extacted_data, f'{test_data["test_info"]["name"]}')

    process_reading_passages(test_data['initData']['features'], index)
    save(reading_passages, f'{test_data["test_info"]["name"]} - Reading Passages')

def process_reading_passages(passages, testId):
    for index, passage in enumerate(passages):
        if index < 8:
            reading_passages.append({
                "pk": (testId * 8) + (index + 1),
                "model": "test_prep_backend.readingpassage",
                "fields": {
                    "test": testId + 1,
                    "text": passage['content']
                }
            })

def process_questions(questions, testId, extacted_data):
    number = 1
    section = "math_1"
    for index, question in enumerate(questions):
        if index in [25,65,125]:
            number = 1 
            if index == 25:
                section = "reading"
            if index == 65:
                section = "verbal"
            else:
                section = "math_2"
        extacted_data.append(
            {
                "pk": (testId * 150) + (index + 1),
                "model": "test_prep_backend.testquestion",
                "fields": {
                    "number": number,
                    "test": testId + 1,
                    "prompt": question['stimulus'],
                    "section": section,
                    "answers": question['options'],
                    "correct_answer_value": question['validation']['valid_response']['value'][0],
                    # "reading_passage": "",
                    "topics": question['topics'],
                    "difficulty": question['difficulty'],
                    "explanations": question['metadata']['distractor_rationale_response_level'],
                }
            }
        )
        number += 1

files = os.listdir("../../test_prep_frontend/src/practice_tests/")
file_path = "../../test_prep_frontend/src/practice_tests/"

index = 0
for file in files:
    extacted_data = []
    reading_passages = []
    extract_data(file_path + file, index, extacted_data, reading_passages)
    index += 1

# save(test_info, 'Test Info')

