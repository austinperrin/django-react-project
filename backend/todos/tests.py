from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from .models import Todo

class TodoApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_create_and_list(self):
        r = self.client.post(reverse("todo-list-create"), {"title": "Test"}, format="json")
        self.assertEqual(r.status_code, 201)
        r = self.client.get(reverse("todo-list-create"))
        self.assertEqual(r.status_code, 200)
        self.assertEqual(len(r.json()), 1)

    def test_update_and_delete(self):
        t = Todo.objects.create(title="X")
        r = self.client.patch(reverse("todo-rud", args=[t.id]), {"completed": True}, format="json")
        self.assertEqual(r.status_code, 200)
        self.assertTrue(r.json()["completed"])
        r = self.client.delete(reverse("todo-rud", args=[t.id]))
        self.assertEqual(r.status_code, 204)
