from rest_framework import routers
from test_prep_backend import views

router = routers.DefaultRouter()
router.register(r'users', views.TestPrepStudentUserViewSet, basename="user")
router.register(r'testquestions', views.TestQuestionViewSet, basename="testquestion")
router.register(r'readingpassages', views.ReadingPassageViewSet, basename="readingpassage")
router.register(r'tests', views.TestViewSet, basename="test")
router.register(r'scoretestsection', views.StudentResponseViewSet, basename="scoretestsection")
router.register(r'student_test_attempts', views.StudentTestAttemptViewSet, basename="student_test_attempt")


