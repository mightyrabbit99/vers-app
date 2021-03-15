# chat/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class PlantConsumer(AsyncWebsocketConsumer):
    room_group_name = 'plants'

    async def connect(self):
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
    async def update_plant(self, event):
        typ = event['type']
        content = event['content']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type': typ,
            'content': content
        }))
