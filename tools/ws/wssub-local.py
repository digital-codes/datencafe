import asyncio
import json
import websockets

async def main():
    async with websockets.connect(
        'ws://localhost:9000',
        extra_headers={'Proxy-Authorization': 'Basic <base64-encoded-username-password>'},
    ) as websocket:
        # Subscribe to topic 'test'
        await websocket.send(json.dumps({'action': 'subscribe', 'topic': 'test'}))

        # Receive messages from the server
        async for message in websocket:
            print(f'Received message: {message}')

if __name__ == '__main__':
    asyncio.run(main())
