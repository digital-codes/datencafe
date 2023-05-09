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

    async def subscribe(self, websocket, topic,appId,device):
        print("Subscribe to ",topic,appId,device,self.clients,self.subscriptions)

        self.clients.add(websocket)
        if topic in self.subscriptions and len(self.subscriptions[topic]) > 0:
            print("Existing topic ",topic,self.subscriptions)
            self.subscriptions[topic].add(websocket)
        else:
            print("Adding topic ",topic,self.subscriptions)
            self.subscriptions[topic] = {websocket}

    async def unsubscribe(self, websocket, topic, appId):
        print("subscriptions: ",self.subscriptions)

        self.clients.remove(websocket)
        if topic in self.subscriptions:
            self.subscriptions[topic].remove(websocket)


    async def publish(self, topic, message):
        print("Publish to: ",topic)
        try:
            data = json.loads(message)
            print("Json Data:",data)
        except:
            print("Text Data:",data)
            data = message
        print("subscriptions: ",self.subscriptions)
        if topic in self.subscriptions:
            print("topic ok")
            for websocket in self.subscriptions[topic]:
                print("return message",message)
                await websocket.send(message)

async def handle(websocket, path):
    print("handle")
    global pubsub
    client_ip = websocket.remote_address[0]
    print(f"Received message from {client_ip}")
    # can be ::1  or 127.0.0.1
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
                appId = data.get("id")
                device = data.get("device")
                await pubsub.subscribe(websocket, topic,appId,device)
            elif action == 'unsubscribe':
                appId = data.get("id")
                await pubsub.unsubscribe(websocket, topic,appId)
            elif action == 'publish':
                await pubsub.publish(topic, payload)
    except websockets.exceptions.ConnectionClosed:
        pass
    finally:
        print("Cleaning up")
        pubsub.clients.remove(websocket)
        for topic in pubsub.subscriptions:
            await pubsub.unsubscribe(websocket, topic,"")

async def main():
    async with websockets.serve(handle, 'localhost', 9000):
        await asyncio.Future()  # Run forever

pubsub = PubSub()

asyncio.run(main())

