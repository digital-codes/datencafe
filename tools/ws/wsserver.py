""" simple websocket server. make sure to listen on 0.0.0.0 for ubserspace
else localhost"""
import asyncio
import json
import websockets

class PubSub:
    def __init__(self):
        print("Init")
        self.clients = set()
        self.subscriptions = {}

    async def subscribe(self, websocket, topic):
        print("Subscribe to ",topic,self.clients,self.subscriptions)

        self.clients.add(websocket)
        if topic in self.subscriptions and len(self.subscriptions[topic]) > 0:
            print("Existing topic ",topic,self.subscriptions)
            self.subscriptions[topic].add(websocket)
        else:
            print("Adding topic ",topic,self.subscriptions)
            self.subscriptions[topic] = {websocket}

    async def unsubscribe(self, websocket, topic):
        print("subscriptions: ",self.subscriptions)

        self.clients.remove(websocket)
        if topic in self.subscriptions:
            self.subscriptions[topic].remove(websocket)


    async def publish(self, topic, message):
        print("Publish to: ",topic)
        print("subscriptions: ",self.subscriptions)
        if topic in self.subscriptions:
            print("topic ok")
            for websocket in self.subscriptions[topic]:
                print("return message",message)
                await websocket.send(message)

async def handle(websocket, path):
    print("handle")
    global pubsub
    # pubsub = PubSub()
    pubsub.clients.add(websocket)

    try:
        async for message in websocket:
            data = json.loads(message)
            action = data.get('action')
            topic = data.get('topic')
            payload = data.get('payload')
            print(data,action,topic,payload)

            if action == 'subscribe':
                await pubsub.subscribe(websocket, topic)
            elif action == 'unsubscribe':
                await pubsub.unsubscribe(websocket, topic)
            elif action == 'publish':
                await pubsub.publish(topic, payload)
    except websockets.exceptions.ConnectionClosed:
        pass
    finally:
        print("Cleaning up")
        pubsub.clients.remove(websocket)
        for topic in pubsub.subscriptions:
            await pubsub.unsubscribe(websocket, topic)

async def main():
    async with websockets.serve(handle, '0.0.0.0', 9000):
        await asyncio.Future()  # Run forever

pubsub = PubSub()

asyncio.run(main())

