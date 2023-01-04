from rest_framework import serializers
from .models import (
    TestQuestion, ReadingPassage, Test, StudentTestAttempt, StudentResponse, TestPrepStudentUser
)
from django.contrib.auth import get_user_model

User = get_user_model()

class TestPrepStudentUserSerializer(serializers.ModelSerializer):
    existing_attempts_for_tests = serializers.SerializerMethodField()
    # completed_test_attempts = serializers.SerializerMethodField()

    class Meta:
        model = TestPrepStudentUser
        fields = '__all__'

    def get_existing_attempts_for_tests(self, test_prep_user):
        return StudentTestAttemptSerializer(test_prep_user.student_test_attempts.all(),many=True).data

    # def get_completed_test_attempts(self, test_prep_user):
    #     return test_prep_user.user_test_attempts.filter(is_completed=True)

class TestSerializer(serializers.ModelSerializer):
    test_attempt = serializers.SerializerMethodField()

    class Meta:
        model = Test
        fields = '__all__'

    def get_student(self, test):
        return TestPrepStudentUser.objects.get(user=self.context['request'].user)

    def get_test_attempt(self, test):
        return StudentTestAttemptSerializer(self.get_student(test).student_test_attempts.filter(test_id=test),many=True).data

class TestQuestionSerializer(serializers.ModelSerializer):

    class Meta:
        model = TestQuestion
        fields = '__all__'

class ReadingPassageSerializer(serializers.ModelSerializer):

    class Meta:
        model = ReadingPassage
        fields = '__all__'

class StudentResponseSerializer(serializers.ModelSerializer):

    class Meta:
        model = StudentResponse
        fields = '__all__'

class StudentTestAttemptSerializer(serializers.ModelSerializer):
    student_response = serializers.SerializerMethodField()

    class Meta:
        model = StudentTestAttempt
        fields = '__all__'

    def get_student_response(self, student_test_attempt):
        return StudentResponseSerializer(student_test_attempt.student_test_responses.all(),many=True).data

