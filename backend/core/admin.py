from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Classroom, Enrollment, Assignment, Submission, AIReport, Announcement, Notification

# Register Custom User model
@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('role', 'avatar')}),
    )
    list_display = ('username', 'email', 'role', 'is_staff')
    list_filter = ('role', 'is_staff', 'is_superuser')

@admin.register(Classroom)
class ClassroomAdmin(admin.ModelAdmin):
    list_display = ('name', 'subject_code', 'class_code', 'faculty')
    search_fields = ('name', 'class_code')

@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display = ('title', 'classroom', 'due_date', 'points')
    list_filter = ('classroom', 'due_date')

@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ('student', 'assignment', 'status', 'submitted_at')
    list_filter = ('status', 'submitted_at')

@admin.register(AIReport)
class AIReportAdmin(admin.ModelAdmin):
    list_display = ('submission', 'similarity_score', 'suggested_grade', 'analyzed_at')

admin.site.register(Enrollment)
admin.site.register(Announcement)
admin.site.register(Notification)
