from rest_framework import serializers
from .models import (
    TestQuestion, ReadingPassage, Test, StudentTestAttempt, StudentResponse, TestPrepStudentUser
)
from django.contrib.auth import get_user_model
from user_auth.serializers import UserSerializer

User = get_user_model()

class TestPrepStudentUserSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    # student_test_attempts = serializers.SerializerMethodField(read_only=True)
    # existing_attempts_for_tests = serializers.SerializerMethodField()
    # completed_test_attempts = serializers.SerializerMethodField()

    class Meta:
        model = TestPrepStudentUser
        fields = ['user', 'student_test_attempts']
        # fields = '__all__'

    # def get_student_test_attempts(self, obj):
    #     return StudentTestAttemptSerializer(obj.student_test_attempts,many=True)

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
        print("TEST: ", test, " type: ", type(test))
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
    # student_response = serializers.SerializerMethodField()
    student_test_responses = StudentResponseSerializer(many=True, read_only=True)

    class Meta:
        model = StudentTestAttempt
        fields = ['id', 'student', 'test', 'start_timestamp', 'is_completed', 'finish_timestamp', 'scores', 'student_test_responses']

    # def get_student_response(self, student_test_attempt):
    #     print("HERE")
    #     return StudentResponseSerializer(student_test_attempt.student_test_responses.all(),many=True)

