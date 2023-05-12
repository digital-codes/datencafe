import asyncio
import websockets
from aiohttp import web
import json
import csv

#userList = ["12345678","23456789"]
# goodPwd = "dummy"

# need to read file on each access, will remain constant in server
# otherwise
#with open('potd.txt', 'r') as f:
#        goodPwd = f.readlines()[0].strip()

#print("Pwd",goodPwd)

with open('sensors.csv', 'r') as f:
        reader = csv.DictReader(f)
        sensors = list(reader)
        userList = [str(s["user"]) for s in sensors]

#print(userList)


async def handle_post(request):
    headers = request.headers
    user = headers.get('user')
    pwd = headers.get('pwd')
    with open('potd.txt', 'r') as f:
        goodPwd = f.readlines()[0].strip()

    if (not user in userList) or (pwd != goodPwd):
        raise web.HTTPUnauthorized()

    # access data
    data = await request.json()
    data["device"] = user
    # Process the data received from the POST request
    # ...
    # print("data:",data)
    # print("items.",list(data.items()))
    # for key, value in data.items():
    #     print(f'{key}: {value}')


    # send to ws
    async with websockets.connect(
        'ws://localhost:9000',
        extra_headers={'Proxy-Authorization': 'Basic <base64-encoded-username-password>'},
        ) as websocket:
        # Publish a message to topic 'test'
        await websocket.send(
			json.dumps({'action': 'publish', 'topic': 'dcaf', 'payload': json.dumps(data)}) #data})
		)

    # Return a response
    return web.Response(text='OK')

async def main():
    app = web.Application()
    app.add_routes([web.post('/', handle_post)])
    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, '0.0.0.0', 42402)
    print("Site:",site)
    await site.start()

   # Run the event loop continuously
    while True:
        await asyncio.sleep(3600)


if __name__ == '__main__':
    asyncio.run(main())


