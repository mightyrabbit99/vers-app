from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
  """
  Custom permission to only allow owners of an object to edit it.
  """

  def has_object_permission(self, request, view, obj):
    # Read permissions are allowed to any request,
    # so we'll always allow GET, HEAD or OPTIONS requests.
    if request.method in permissions.SAFE_METHODS:
      return True

    # Write permissions are only allowed to the owner of the snippet.
    return obj.owner == request.user


'''
permissions
	view (GET)
		1. cannot view (cannot create)
		2. can view self
		3. can view all
	create (POST)
		1. cannot create (cannot edit/delete)
		2. can create (can view self, can edit/delete self)
	edit/delete (PUT/DELETE)
		1. cannot edit/delete (cannot create)
		2. can edit/delete self
		3. can edit/delete all (can view all, can create)
	
	
groups
	1. owner
		3, 2, 3
	2. user
		2, 1, 1
	3. none
		1, 1, 1
'''


class VersPermission1(permissions.BasePermission):
  def has_permission(self, request, view):
    if not request.user.is_authenticated:
      return False
    return super().has_permission(request, view)

  def has_object_permission(self, request, view, obj):
    if not request.user.is_authenticated:
      return False
    if request.user.is_superuser:
      return True
    if 'vers_user' not in request.user.__dict__:
      return False
    if request.method in permissions.SAFE_METHODS:
      return True
    if request.method == 'POST':
      return False
    return obj.owner == request.user


class UserProfileEditDeletePermission(permissions.BasePermission):
  def has_object_permission(self, request, view, obj):
    return obj == request.user
