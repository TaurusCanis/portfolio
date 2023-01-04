from django.db import models
from django.conf import settings
from django.contrib.postgres.fields import ArrayField, IntegerRangeField

SSAT_CHOICES = [
    ('math_1', 'math_1'), 
    ('math_2', 'math_2'), 
    ('verbal', 'verbal'), 
    ('reading', 'reading')
]

class TestPrepParentUser(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.user.last_name}, {self.user.first_name}'

class TestPrepInstructorUser(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.user.last_name}, {self.user.first_name}'

class TestPrepStudentUser(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    parent = models.ForeignKey(TestPrepParentUser, on_delete=models.CASCADE, blank=True, null=True)
    instructor = models.ForeignKey(TestPrepInstructorUser, on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return f'{self.user.last_name}, {self.user.first_name}'

class Test(models.Model):
    type = models.CharField(max_length=10, choices=[('SSAT', 'SSAT')])
    name = models.CharField(max_length=100)
    number_of_sections = models.IntegerField(default=4)
    time_limits = models.JSONField(null=True, blank=True)

    def __str__(self):
        return self.name

class ReadingPassage(models.Model):
    test = models.ForeignKey(Test, on_delete=models.CASCADE)
    text = models.CharField(max_length=10000)
    question_range = IntegerRangeField(blank=True, null=True)

    # def __str__(self):
    #     return f'Reading Passage - #s {self.question_range.lower} - {self.question_range.upper}'

class TestQuestion(models.Model):
    number = models.IntegerField()
    test = models.ForeignKey(Test, on_delete=models.CASCADE)
    section = models.CharField(max_length=10, choices=SSAT_CHOICES)
    prompt = models.CharField(max_length=10000)
    answers = ArrayField(models.JSONField())
    correct_answer_value = models.IntegerField()
    reading_passage = models.ForeignKey(ReadingPassage, on_delete=models.CASCADE, default=None, blank=True, null=True)
    topics = models.JSONField()
    difficulty = models.CharField(max_length=10)
    explanations = ArrayField(models.JSONField())

    def __str__(self):
        return f'{self.test} - {self.section} - # {self.number} - ID: {self.id}'

class StudentTestAttempt(models.Model):
    student = models.ForeignKey(TestPrepStudentUser, related_name="student_test_attempts", on_delete=models.CASCADE, null=True, blank=True)
    test = models.ForeignKey(Test, on_delete=models.CASCADE)
    start_timestamp = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    is_completed = models.BooleanField(default=False)
    finish_timestamp = models.DateTimeField(null=True, blank=True)
    scores = models.JSONField(null=True, blank=True)

    def __str__(self):
        return f'{self.student} - {self.test} - {self.start_timestamp}'

class StudentResponse(models.Model):
    student_test_attempt = models.ForeignKey(StudentTestAttempt, related_name="student_test_responses", on_delete=models.CASCADE)
    section = models.CharField(max_length=15, choices=SSAT_CHOICES)
    start_timestamp = models.DateTimeField(auto_now_add=True)
    finish_timestamp = models.DateTimeField(null=True, blank=True)
    score = models.IntegerField(null=True, blank=True)
    responses = models.JSONField(null=True, blank=True)
    total_correct = models.IntegerField(null=True, blank=True)
    total_incorrect = models.IntegerField(null=True, blank=True)
    total_omitted = models.IntegerField(null=True, blank=True)
