import asyncio
import os
import websockets
import json

clients = set()
subscriptions = {}

async def subscribe(websocket, topic):
    global clients, subscriptions
    print("Subscribe to ",topic) #,clients,subscriptions)

    clients.add(websocket)
    if topic in subscriptions and len(subscriptions[topic]) > 0:
        print("Existing topic ",topic) #,subscriptions)
        subscriptions[topic].add(websocket)
    else:
        print("Adding topic ",topic) #,subscriptions)
        subscriptions[topic] = {websocket}

async def unsubscribe(websocket, topic):
    global clients, subscriptions
    print("subscriptions: ",subscriptions)

    clients.remove(websocket)
    if topic in subscriptions:
        subscriptions[topic].remove(websocket)


async def publish(topic, message):
    global clients, subscriptions
    print("Publish to: ",topic)
    print("subscriptions: ",subscriptions)
    if topic in subscriptions:
        print("topic ok")
        for websocket in subscriptions[topic]:
            print("return message",message)
            await websocket.send(message)


async def websocket_handler(websocket, path):
    global clients, subscriptions
    print("ws handler",websocket)
    # clients.add(websocket)
    try:
        async for message in websocket:
            data = json.loads(message)
            action = data.get('action')
            topic = data.get('topic')
            payload = data.get('payload')
            print(data,action,topic,payload)

            if action == 'subscribe':
                await subscribe(websocket, topic)
            elif action == 'unsubscribe':
                await unsubscribe(websocket, topic)
            elif action == 'publish':
                await publish(topic, payload)

    except websockets.exceptions.ConnectionClosed:
        print("Closed")
        pass
    finally:
        print("Cleaning up",websocket)
        clients.remove(websocket)
        for topic in subscriptions:
            try:
                await unsubscribe(websocket, topic)
            except:
                print("remove failed")
                pass


async def read_from_named_pipe(pipe_path):
    with open(pipe_path, "r") as pipe:
        while True:
            line = await asyncio.to_thread(pipe.readline)
            #line = await loop.run_in_executor(None, pipe.readline)
            if line:
                msg = line.strip()
                print(f"Received from named pipe: {msg}")
                await publish("test", msg)
            else:
                await asyncio.sleep(0)

async def main():
    pipe_path = "/tmp/datencafe_pipe"
    if not os.path.exists(pipe_path):
        print("Creating pipe:",pipe_path)
        os.mkfifo(pipe_path)

    server = await websockets.serve(websocket_handler, "localhost", 9000)
    print("WebSocket server started on ws://localhost:9000")
    await asyncio.sleep(0)

    named_pipe_task = asyncio.create_task(read_from_named_pipe(pipe_path))
    await asyncio.sleep(0)

    await asyncio.gather(server.wait_closed(), named_pipe_task)


if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    try:
        loop.run_until_complete(main())
    except KeyboardInterrupt:
        pass
    finally:
        loop.close()
