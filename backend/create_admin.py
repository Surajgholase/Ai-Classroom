import os
import django
import sys

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'classroom_backend.settings')
django.setup()

from django.contrib.auth import get_user_model

def create_admin():
    User = get_user_model()
    username = 'superadmin'
    email = 'admin@example.com'
    password = 'AdminPassword123'

    if not User.objects.filter(username=username).exists():
        print(f"Creating superuser {username}...")
        User.objects.create_superuser(username=username, email=email, password=password, role='admin')
        print("Superuser created successfully!")
    else:
        print(f"Superuser {username} already exists. Updating password...")
        user = User.objects.get(username=username)
        user.set_password(password)
        user.is_superuser = True
        user.is_staff = True
        user.role = 'admin'
        user.save()
        print("Superuser updated successfully!")

    print("\n--- Admin Login Credentials ---")
    print(f"Username: {username}")
    print(f"Password: {password}")
    print("-------------------------------\n")

if __name__ == '__main__':
    create_admin()
