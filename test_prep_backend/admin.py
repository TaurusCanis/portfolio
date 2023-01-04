from django.contrib import admin
from .models import Test, TestQuestion, ReadingPassage, StudentTestAttempt, TestPrepStudentUser, StudentResponse

class TestQuestionAdmin(admin.ModelAdmin):
    list_filter = ('test', 'section')

admin.site.register(Test)
admin.site.register(TestQuestion, TestQuestionAdmin)
admin.site.register(ReadingPassage)
admin.site.register(StudentTestAttempt)
admin.site.register(TestPrepStudentUser)
admin.site.register(StudentResponse)

