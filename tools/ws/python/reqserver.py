import asyncio
from aiohttp import web

async def handle_post(request):
    data = await request.post()
    # Process the data received from the POST request
    # ...
    print("Data:",data)
    # Return a response
    return web.Response(text='POST request processed')

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


