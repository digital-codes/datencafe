import asyncio
import json
import websockets
import random

async def main():
    async with websockets.connect(
        'wss://daten.cafe:443/ws',
        extra_headers={'Proxy-Authorization': 'Basic <base64-encoded-username-password>'},
        ssl=True) as websocket:
        # Publish a message to topic 'test'
        await websocket.send(
			json.dumps({'action': 'publish', 'topic': 'dcaf', 'payload': str(random.randint(-10,10))})
		)

if __name__ == '__main__':
    asyncio.run(main())

