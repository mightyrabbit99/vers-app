from django.shortcuts import render

def index(request):
	if request.method.upper() == 'GET':
		return render(request, 'index.html', {})
