import asyncio
import json
import websockets

device="12345678"
pwd="aigh9En7ri"
async def main():
    async with websockets.connect(
        'wss://daten.cafe:443/ws',
        extra_headers={'Proxy-Authorization': 'Basic <base64-encoded-username-password>'},
        ssl=True,
        # proxy=('https://daten.cafe/ws', 443)
    ) as websocket:
        # Subscribe to topic 'test'
        await websocket.send(json.dumps({
            'action': 'subscribe',
            'topic': 'dcaf',
            "device":device,
            "pwd":pwd
            }))

        # Receive messages from the server
        async for message in websocket:
            print(f'Received message: {message}')

if __name__ == '__main__':
    asyncio.run(main())

