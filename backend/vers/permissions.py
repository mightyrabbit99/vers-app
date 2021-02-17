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
  view
    1. cannot view (cannot create)
    2. can view self
    3. can view all
  create
    1. cannot create (cannot edit/delete)
    2. can create (can view self, can edit/delete self)
  edit/delete
    1. cannot edit/delete (cannot create)
    2. can edit/delete self
    3. can edit/delete all (can view all, can create)


groups
  1. super user
    3, 2, 3
  2. owner
    3, 2, 2
  3. admin
    2, 2, 2
  4. user
    2, 1, 1
'''


class ReadPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return True


class CreatePermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return super().has_object_permission(request, view, obj)


class UserProfileListPermission(permissions.BasePermission):
    # TODO: does not get called, dunno why
    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser:
            return True
        else:
            return obj == request.user


class UserProfileEditDeletePermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj == request.user
