from rest_framework.authtoken.models import Token
from channels.db import database_sync_to_async


@database_sync_to_async
def fetch_user_from_token(token):
    return Token.objects.get(key=token).user

def is_auth(scope):
    try:
        return scope['user'].is_authenticated
    except Exception:
        return False

class TokenAuthMiddleware:
    """
    Custom middleware (insecure) that takes user IDs from the query string.
    """

    def __init__(self, app):
        # Store the ASGI application we were passed
        self.app = app

    async def __call__(self, scope, receive, send):
        # Look up user from query string (you should also do things like
        # checking if it is a valid user ID, or if scope["user"] is already
        # populated).
        if not is_auth(scope):
            try:
                qs: str = scope["query_string"].decode("utf-8") 
                qs_d = dict([s.split('=') for s in qs.split('&')])
                scope['user'] = await fetch_user_from_token(qs_d['token'])
            except Exception as e:
                print(e)

        return await self.app(scope, receive, send)
