for i in range(1,5):
    file_name = f'Practice Test {i} - Reading Passages.json'

with open(file, 'r') as test_file:
    test_data = test_file.read()

test_data = json.loads(test_data)