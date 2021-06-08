from django.shortcuts import render, redirect

def index(request):
	if request.method.upper() == 'GET':
		return render(request, 'index.html', {})

def redirect_view(request):
	response = redirect('/dg/')
	return response
