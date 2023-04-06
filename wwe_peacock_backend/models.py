from django.db import models

class City(models.Model):
	name = models.CharField(max_length=500)

	def __str__(self):
		return self.name

class Venue(models.Model):
	name = models.CharField(max_length=500)
	city = models.ForeignKey(City, null=True, on_delete=models.SET_NULL)

	def __str__(self):
		return self.name

class Match(models.Model):
	event = models.ForeignKey('Event', on_delete=models.CASCADE)

class Performer(models.Model):
	name = models.CharField(max_length = 500)

class EventName(models.Model):
	name = models.CharField(max_length=500)

	def __str__(self):
		return self.name

class Brand(models.Model):
	name = models.CharField(max_length=100)

class Event(models.Model):
	name = models.ForeignKey(EventName, on_delete=models.CASCADE)
	date = models.DateField()
	venue = models.ForeignKey(Venue, null=True, on_delete=models.SET_NULL)
	brand = models.ManyToManyField(Brand, null=True, blank=True)
	peacock_url = models.URLField(max_length=5000, default="https://www.peacocktv.com/sports/wwe")

	def __str__(self):
		return f"{self.name} {self.date.__str__().split('-')[0]}"
