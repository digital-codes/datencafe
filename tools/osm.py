import requests

# Query a location by its name or address
def query_location(query):
    url = f"https://nominatim.openstreetmap.org/search?q={query}&format=json"
    response = requests.get(url).json()
    if len(response) > 0:
        location = response[0]
        return location
    else:
        return None

# Lookup an address by its latitude and longitude
def lookup_address(lat, lon):
    url = f"https://nominatim.openstreetmap.org/reverse?lat={lat}&lon={lon}&format=json"
    response = requests.get(url).json()
    if 'address' in response:
        return response['address']
    else:
        return None

# Reverse lookup a latitude and longitude by its address
def reverse_lookup_address(query):
    url = f"https://nominatim.openstreetmap.org/search?q={query}&format=json"
    response = requests.get(url).json()
    if len(response) > 0:
        location = response[0]
        return location['lat'], location['lon']
    else:
        return None

# Example usage
location = query_location("New York City")
if location:
    print("Location found:", location['display_name'])
    address = lookup_address(location['lat'], location['lon'])
    if address:
        print("Address:", address)
    else:
        print("Address not found.")
else:
    print("Location not found.")


# Example usage
address_query = "1600 Pennsylvania Avenue NW, Washington DC"
result = reverse_lookup_address(address_query)
if result:
    print(f"The latitude and longitude of {address_query} are: {result[0]}, {result[1]}")
else:
    print(f"No location found for {address_query}.")
