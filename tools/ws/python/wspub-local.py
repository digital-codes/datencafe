import asyncio
import json
import websockets
import random

async def main():
    async with websockets.connect(
        'ws://localhost:9000',
        extra_headers={'Proxy-Authorization': 'Basic <base64-encoded-username-password>'},
        ) as websocket:
        # Publish a message to topic 'test'
        await websocket.send(
			json.dumps({'action': 'publish', 'topic': 'dcaf', 'payload': str(random.randint(-10,10))})
		)

if __name__ == '__main__':
    asyncio.run(main())

