# chat/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer


class MainConsumer(AsyncWebsocketConsumer):
  room_group_name = 'main'

  def is_auth(self):
    try:
      return self.scope['user'].is_authenticated
    except Exception:
      return False

  async def connect(self):
    if not self.is_auth():
      await self.close()
      return
    # Join room group
    await self.channel_layer.group_add(
        self.room_group_name,
        self.channel_name
    )

    await self.accept()

  async def disconnect(self, close_code):
    # Leave room group
    await self.channel_layer.group_discard(
        self.room_group_name,
        self.channel_name
    )

  ### event handlers ###

  # Receive message from room group

  async def update_store(self, event):
    payload = event['payload']
    typ = payload['data_type']
    action = payload['action']
    content = payload['content']

    # Send message to WebSocket
    await self.send(text_data=json.dumps({
        'action': action,
        'data_type': typ,
        'content': content,
    }, default=str))
