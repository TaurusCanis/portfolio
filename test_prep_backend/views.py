from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .serializers import (
    TestQuestionSerializer, ReadingPassageSerializer, TestSerializer, StudentTestAttemptSerializer,
    TestPrepStudentUserSerializer, StudentResponseSerializer
)

from .models import (
    TestQuestion, ReadingPassage, Test, StudentTestAttempt, StudentResponse, TestPrepStudentUser
)
import json

from django.contrib.auth import get_user_model
User = get_user_model()

class TestPrepStudentUserViewSet(viewsets.ModelViewSet):
    """
    CRUD actions for TestQuestion objects/querysets
    """
    serializer_class = TestPrepStudentUserSerializer
    permission_classes_by_action = {
        "default": [IsAuthenticated],
        "create": [AllowAny],
    }

    def get_permissions(self):
        try:
            # return permission_classes depending on `action`
            return [
                permission()
                for permission in self.permission_classes_by_action[self.action]
            ]
        except KeyError:
            # action is not set return default permission_classes
            return [
                permission()
                for permission in self.permission_classes_by_action["default"]
            ]

    # Create a new User using AUTH_USER_MODEL
    def create_user(self):
        self.request.data.pop("prep_for_test")
        return User.objects.create_user(**self.request.data)

    # Create a new TestPrepUser
    def create(self, request, *args, **kwargs):
        user = self.create_user()
        data = self.request.data
        data['user'] = user.id
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer, user)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    # Save relationship to new AUTH_USER_MODEL instance
    def perform_create(self, serializer, user):
        serializer.save(user=user)

    def get_object(self):
        user = TestPrepStudentUser.objects.get(user=self.request.user)
        print(user)
        return user

    def get_queryset(self):
        try:
            user = TestPrepStudentUser.objects.filter(user=self.request.user)
            print("user: ", user)
            return user
        except:
            return TestPrepStudentUser.objects.all()

class TestViewSet(viewsets.ModelViewSet):
    """
    CRUD actions for TestQuestion objects/querysets
    """
    serializer_class = TestSerializer
    queryset = Test.objects.all()
    permission_classes = [IsAuthenticated]

class TestQuestionViewSet(viewsets.ModelViewSet):
    """
    CRUD actions for TestQuestion objects/querysets
    """
    serializer_class = TestQuestionSerializer
    # queryset = TestQuestion.objects.all()
    permission_classes = []

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        question_data = serializer.data
        time_limit = self.get_test_time_limit(question_data[0]['test'], question_data[0]['section'])
        response_data = {
            'time_limit': time_limit,
            'question_data': question_data
        }
        return Response(response_data)

    def get_test_time_limit(self, test_id, section):
        test = self.get_test(test_id)
        return test.time_limits[section]

    def get_test(self, test_id):
        return Test.objects.get(id=test_id)

    def get_queryset(self):
        test_id = self.request.query_params.get('test_id')
        section = self.request.query_params.get('section')
        qs = TestQuestion.objects.filter(test=test_id,section=section).order_by('number')
        return qs

    def get_object(self):
        return TestQuestion.objects.get(id=self.kwargs.get('pk'))

class ReadingPassageViewSet(viewsets.ModelViewSet):
    """
    CRUD actions for ReadingPassage objects/querysets
    """
    serializer_class = ReadingPassageSerializer
    permission_classes = []

    def get_queryset(self):
        test_id = self.request.query_params.get('test_id')
        qs = ReadingPassage.objects.filter(test=test_id).order_by('id')
        print("QUERY_SET: ", qs)
        return qs

class ScoreTestView(viewsets.ModelViewSet):
    serializer_class = StudentTestAttemptSerializer
    permission_classes = []
    # queryset = UserTestAttempt.objects.all()

    def get_object(self):
        print("self.KWARGS: ", self.kwargs)
        return super().get_object()

    def get_queryset(self):
        print("self.KWARGS: ", self.kwargs)
        print("self.request.query_params: ", self.request.query_params)
        filter_kwargs = { key: value for key, value in self.request.query_params.items() }
        print("filter_kwargs: ", filter_kwargs)
        uas = UserTestAttempt.objects.filter(**filter_kwargs)
        print("UAS: ", uas)
        return uas

    def create(self, request):
        test_id = self.request.query_params.get('test_id')
        section = self.request.query_params.get('section').split("/")[0]
        user_responses = self.request.data.get('user_responses')
        user_test_data = self.score_test(test_id, section, user_responses)
        serializer = self.get_serializer(data={
            # "user": 1,
            "test": test_id,
            "responses": user_test_data['user_test_section_data'],
            "scores": [user_test_data['raw_score']]
        })
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        print("UPDATE")
        return super().update(request, *args, **kwargs)

    def score_test(self, test_id, section, user_responses):
        test_questions = self.get_test_questions(test_id, section)
        user_test_section_data = []
        raw_score = 0
        number_correct = 0
        number_incorrect = 0
        for index, question in enumerate(test_questions):
            is_omitted = user_responses[index] == -1
            is_correct = user_responses[index] == question.correct_answer_value
            if not is_omitted:
                if is_correct:
                    number_correct += 1
                else:
                    number_incorrect += 1
            
            user_test_section_data.append({
                "question_id": question.id,
                "test_id": question.test.id,
                "section": section,
                "user_response": user_responses[index],
                "is_correct": is_correct,
                "is_omitted": is_omitted,
                "correct_answer": question.correct_answer_value
            })

        raw_score = round(number_correct - (.25 * number_incorrect))

        return { "raw_score": raw_score, "user_test_section_data": user_test_section_data }

    def get_test_questions(self, test_id, section):
        return TestQuestion.objects.filter(test=test_id, section=section).order_by('number')

class StudentTestAttemptViewSet(viewsets.ModelViewSet):
    serializer_class = StudentTestAttemptSerializer
    permission_classes = []
    # queryset = StudentTestAttempt.objects.all()

    # Formatting keys/values to exclude (when necessary) StudentTestAttempts that exist but are 
    # not complete
    def format_key(self, key, value):
        if value in ["null", "None"]:
            return f'{key}__isnull'
        return key

    def format_value(self, value):
        if value in ["null", "None"]:
            return True 
        elif value in ['False']:
            return False
        return value

    def get_queryset(self):
        query_args = { self.format_key(key, value): self.format_value(value) for key, value in self.request.query_params.items() } 
        return StudentTestAttempt.objects.filter(student__user=self.request.user, **query_args)

    def get_student_user(self):
        return TestPrepStudentUser.objects.get(user=self.request.user)

    def create(self, request, *args, **kwargs):
        # Check to see if an incomplete StudentTestAttempt already exists for this student for this test
        try:
            # if a StudentTestAttempt exists, return that
            test_attempt = StudentTestAttempt.objects.get(
                                        student__user=self.request.user, 
                                        test_id=self.request.data.get('test'), 
                                        is_completed=False
                                    )
            return Response(StudentTestAttemptSerializer(test_attempt).data, status=status.HTTP_200_OK)
        except Exception as e:
            print("***EXCEPTION: ", e)
            # if not, create a new StudentTestAttempt
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        serializer.save(student=self.get_student_user())

class StudentResponseViewSet(viewsets.ModelViewSet):
    serializer_class = StudentResponseSerializer
    permission_classes = []
    queryset = StudentResponse.objects.all()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        is_completed = self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        data = serializer.data 
        data['is_completed'] = is_completed
        return Response(data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        print("perform_create: ", self.request.data)
        test_attempt = self.get_test_attempt(self.request.data.get('student_test_attempt'))
        score = self.score_section(self.request.data.get('section'), self.request.data.get('user_responses'), test_attempt.test.id)
        serializer.save(score=score[0], responses=score[1], total_correct=score[2], total_incorrect=score[3], total_omitted=score[4])

        print("test_attempt.student_test_responses.count(): ", test_attempt.student_test_responses.count())
        if test_attempt.student_test_responses.count() == test_attempt.test.number_of_sections:
            test_attempt.is_completed = True 
            test_attempt.scores = self.calculate_scores(test_attempt.student_test_responses.all())
            test_attempt.save()

        return test_attempt.is_completed

    def perform_update(self, serializer):
        print("perform_update: ", self.request.data)
        super().perform_update(serializer)

    def calculate_scores(self, test_responses):
        score_data = {
            "math": 0,
            "reading": 0,
            "verbal": 0
        }
        for test_response in test_responses:
            if not test_response.section.startswith('math_'):
                score_data[test_response.section] = test_response.score
            else:
                score_data["math"] += test_response.score

        return score_data

    def score_section(self, section, user_responses, test_id):
        test_questions = self.get_test_questions(test_id, section)
        user_test_section_data = []
        raw_score = 0
        number_correct = 0
        number_incorrect = 0
        number_omitted = 0
        for index, question in enumerate(test_questions):
            is_omitted = user_responses[index] == -1
            is_correct = user_responses[index] == question.correct_answer_value
            if not is_omitted:
                if is_correct:
                    number_correct += 1
                else:
                    number_incorrect += 1
            else:
                number_omitted += 1
            
            user_test_section_data.append({
                "question_id": question.id,
                "test_id": question.test.id,
                "section": section,
                "user_response": user_responses[index],
                "is_correct": is_correct,
                "is_omitted": is_omitted,
                "correct_answer": question.correct_answer_value
            })

        raw_score = round(number_correct - (.25 * number_incorrect))

        return [raw_score, user_test_section_data, number_correct, number_incorrect, number_omitted]

    def get_test_attempt(self, student_test_attempt_id):
        return StudentTestAttempt.objects.get(id=student_test_attempt_id)

    def get_test_questions(self, test_id, section):
        return TestQuestion.objects.filter(test=test_id, section=section).order_by('number')

