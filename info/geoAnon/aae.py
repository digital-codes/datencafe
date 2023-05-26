import gpxpy
import gpxpy.gpx
import geopandas as gpd
from shapely.geometry import Point
from shapely.ops import unary_union
from datetime import datetime, timedelta
import random

# Step 1: Preprocessing
# Read and parse the GPS tracks and environmental sensor data
##gps_data = [
##    {"id": 1, "lat": 40.7128, "lon": -74.0060, "timestamp": 1621960800000},
##    # ... other GPS data points
##]

# ## more complex
# Constants
total_duration = timedelta(hours=3.5)
num_waypoints = 20
desired_speed_kmph = 5
max_displacement_degrees = 0.01

# Calculate the distance between waypoints (assuming a straight line)
total_distance_km = desired_speed_kmph * total_duration.total_seconds() / 3600
distance_between_waypoints_km = total_distance_km / (num_waypoints - 1)

# Calculate the time interval between each waypoint based on the speed and distance
interval_seconds = (distance_between_waypoints_km / desired_speed_kmph) * 3600

waypoints = []

# Start time for the first waypoint
current_time = datetime.now()

# Initial latitude and longitude
initial_lat = 40.7128  # Replace with actual initial latitude
initial_lon = -74.0060  # Replace with actual initial longitude

for i in range(num_waypoints):
    # Randomly displace the latitude and longitude
    lat = initial_lat + random.uniform(-max_displacement_degrees, max_displacement_degrees)
    lon = initial_lon + random.uniform(-max_displacement_degrees, max_displacement_degrees)
    
    waypoint = {
        "lat": lat,
        "lon": lon,
        "timestamp": current_time.timestamp() * 1000,  # Convert to milliseconds
    }
    waypoints.append(waypoint)
    
    # Increment the current time by the interval
    current_time += timedelta(seconds=interval_seconds)

# Print the generated waypoints
for waypoint in waypoints:
    print(waypoint)

# Create GeoDataFrame from the GPS data
points = [Point(point["lon"], point["lat"]) for point in waypoints]
gdf = gpd.GeoDataFrame(waypoints, geometry=points)


# Create GPX objects for initial data
gpx_initial = gpxpy.gpx.GPX()
initial_track = gpxpy.gpx.GPXTrack()
initial_segment = gpxpy.gpx.GPXTrackSegment()

# Add waypoints to the GPX objects
for point in waypoints:
    waypoint = gpxpy.gpx.GPXTrackPoint(point["lat"], point["lon"], time=datetime.utcfromtimestamp(point["timestamp"] / 1000))
    initial_segment.points.append(waypoint)
    
##    gpx_initial.waypoints.append(gpxpy.gpx.GPXWaypoint(
##        point["lat"],
##        point["lon"],
##        time=datetime.utcfromtimestamp(point["timestamp"] / 1000)))

initial_track.segments.append(initial_segment)
gpx_initial.tracks.append(initial_track)

# Save GPX tracks to files
gpx_initial_file = "initial_tracks.gpx"

with open(gpx_initial_file, "w") as f:
    f.write(gpx_initial.to_xml())


# Save initial GPS data as GPX file
gpx_initial = gpxpy.gpx.GPX()
for point in waypoints:
    timestamp = datetime.fromtimestamp(point["timestamp"] / 1000)  # Convert milliseconds to seconds
    gpx_initial.waypoints.append(gpxpy.gpx.GPXWaypoint(point["lat"], point["lon"], time=timestamp))
gpx_initial_file = "initial_data.gpx"
with open(gpx_initial_file, "w") as f:
    f.write(gpx_initial.to_xml())



# Step 2: Spatial Analysis
# Define the desired buffer distance for street-level granularity
buffer_distance = 0.01  # Adjust as needed

# Create buffer zones around the data points
gdf["buffer"] = gdf.buffer(buffer_distance)

# Merge overlapping buffers to eliminate redundant areas
merged_buffers = unary_union(gdf["buffer"])

# Step 3: Anonymization
# Modify timestamps to the desired granularity (e.g., hour)
anonymized_data = []
for point in waypoints:
    timestamp = datetime.fromtimestamp(point["timestamp"] / 1000)  # Convert milliseconds to seconds
    new_timestamp = timestamp.replace(minute=0, second=0, microsecond=0)
    new_lat = int(point["lat"] * 1000) / 1000 
    new_lon = int(point["lon"] * 1000) / 1000 
    #anonymized_data.append({**point, "timestamp": new_timestamp})
    anonymized_data.append({"lat":new_lat, "lon":new_lon, "timestamp": new_timestamp})

# Step 4: Output

# Save anonymized GPS data as GPX file
gpx_anonymized = gpxpy.gpx.GPX()
for point in anonymized_data:
    gpx_anonymized.waypoints.append(gpxpy.gpx.GPXWaypoint(point["lat"], point["lon"], time=point["timestamp"]))
gpx_anonymized_file = "anonymized_data.gpx"
with open(gpx_anonymized_file, "w") as f:
    f.write(gpx_anonymized.to_xml())

# Create GPX objects for anon data
gpx_anon = gpxpy.gpx.GPX()
anon_track = gpxpy.gpx.GPXTrack()
anon_segment = gpxpy.gpx.GPXTrackSegment()

# Add waypoints to the GPX objects
for point in anonymized_data:
    waypoint = gpxpy.gpx.GPXTrackPoint(point["lat"], point["lon"], time=datetime.utcfromtimestamp(point["timestamp"] / 1000))
    anon_segment.points.append(waypoint)
    
##    gpx_initial.waypoints.append(gpxpy.gpx.GPXWaypoint(
##        point["lat"],
##        point["lon"],
##        time=datetime.utcfromtimestamp(point["timestamp"] / 1000)))

anon_track.segments.append(anon_segment)
gpx_anon.tracks.append(anon_track)

# Save GPX tracks to files
gpx_anon_file = "anon_tracks.gpx"

with open(gpx_anon_file, "w") as f:
    f.write(gpx_anon.to_xml())



# Print the file paths of the generated GPX files
print("Initial GPS data saved as:", gpx_initial_file)
print("Anonymized GPS data saved as:", gpx_anonymized_file)

