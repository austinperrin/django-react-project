from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

class AuthenticatedTodosTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user("u1", password="p@ssword123")
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {str(refresh.access_token)}")

    def test_scoped_todos(self):
        # create
        r = self.client.post(reverse("todo-list-create"), {"title": "Secure Task"}, format="json")
        self.assertEqual(r.status_code, 201)

        # list
        r = self.client.get(reverse("todo-list-create"))
        self.assertEqual(r.status_code, 200)
        self.assertEqual(len(r.json()), 1)
