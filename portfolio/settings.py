"""
Django settings for portfolio project.

Generated by 'django-admin startproject' using Django 4.1.3.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.1/ref/settings/
"""

from pathlib import Path

import os, sys
import dj_database_url

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

AUTH_USER_MODEL = 'tutor_tracker_backend.User'

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv("DEBUG", False) == True
PRODUCTION = os.getenv("PRODUCTION", True) == True

# ALLOWED_HOSTS = os.environ.get('DJANGO_ALLOWED_HOSTS').split(",") if PRODUCTION else ['*']
ALLOWED_HOSTS = os.getenv("DJANGO_ALLOWED_HOSTS", "127.0.0.1,localhost,localhost:3000,andrewdole.com").split(",")
# CORS_ALLOWED_ORIGINS = os.environ.get('DJANGO_ALLOWED_HOSTS').split(",") if PRODUCTION else [
#     'http://localhost:3000', 'http://127.0.0.1', 'http://localhost:8000', 'http://127.0.0.1:8000'
# ]

if PRODUCTION:
    CORS_ALLOWED_ORIGINS = ["https://" + host for host in ALLOWED_HOSTS]
else:
    CORS_ALLOWED_ORIGINS = ["http://" + host for host in ALLOWED_HOSTS]

print("ALLOWED_HOSTS: ", ALLOWED_HOSTS)
print("CORS_ALLOWED_ORIGINS: ", CORS_ALLOWED_ORIGINS)

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    'homepage.apps.HomepageConfig',
    'ecommerce_backend.apps.EcommerceBackendConfig',
    'tutor_tracker_backend.apps.TutorTrackerBackendConfig',
    # 'test_prep_backend.apps.TestPrepBackendConfig',
    'rest_framework.authtoken',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'portfolio.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(BASE_DIR, 'templates'), 
            os.path.join(BASE_DIR, 'tracker-build'),
            os.path.join(BASE_DIR, 'ecommerce-build'),
            
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'portfolio.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.1/ref/settings/#databases

if not PRODUCTION:
    DATABASES = {
        # 'default': {
        #     'ENGINE': 'django.db.backends.sqlite3',
        #     'NAME': BASE_DIR / 'db.sqlite3',
        # }
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.environ.get('LOCAL_DB_NAME'),
            'USER': os.environ.get('LOCAL_DB_USER'),
            'PASSWORD': os.environ.get('LOCAL_DB_PASSWORD'),
            'HOST': os.environ.get('LOCAL_DB_HOST'),
            'PORT': os.environ.get('LOCAL_DB_PORT'),
        }
    }
elif len(sys.argv) > 0 and sys.argv[1] != 'collectstatic':
    if os.getenv("DATABASE_URL", None) is None:
        raise Exception("DATABASE_URL environment variable not defined")
    DATABASES = {
        "default": dj_database_url.parse(os.environ.get("DATABASE_URL")),
    }


# Password validation
# https://docs.djangoproject.com/en/4.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.1/howto/static-files/

STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'tracker-build/static'),
    os.path.join(BASE_DIR, 'ecommerce-build/static'),
    
]

# Default primary key field type
# https://docs.djangoproject.com/en/4.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.TokenAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated', )
}

EMAIL_HOST = 'smtp.gmail.com' 
EMAIL_PORT = 587
EMAIL_HOST_USER = os.environ.get("TCR_USER", "tauruscanisrex@gmail.com") 
EMAIL_HOST_PASSWORD = os.environ.get("TCR_PASSWORD") 
EMAIL_USE_TLS = True
EMAIL_USE_SSL = False
