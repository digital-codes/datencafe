import plotly.graph_objs as go
import plotly.io as pio
import json
import numpy as np
import webbrowser


# Load the input and result data from files
with open('input.json', 'r') as f:
    input_data = json.load(f)
with open('clusters.json', 'r') as f:
    result_data = json.load(f)


# Parse the input and result data into x and y arrays
input_x = [point["x"] for point in input_data]
input_y = [point["y"] for point in input_data]
result_x = np.empty(0)
result_y = np.empty(0)
result_lbl = np.empty(0,dtype=int)
for (i,dataset) in enumerate(result_data):
    result_x  = np.append(result_x,np.array([point["x"] for point in dataset]))
    result_y = np.append(result_y,np.array([point["y"] for point in dataset]))
    result_lbl = np.append(result_lbl,np.full(len(dataset),i))

# markers
result_marker = dict(
        size=10,
        opacity = .5
)
input_marker = dict(
     size=8,
     color='red',
     symbol='cross'  # Use a different symbol for input points
)

# Define the traces for the input and result data
input_trace = go.Scatter(x=input_x, y=input_y, mode='markers', marker=input_marker,name='Input Data')
# result_trace = go.Scatter(x=result_x, y=result_y, mode='markers', name='Result Data')
cluster_traces = []


for i in range(max(result_lbl) + 1):
    x = [result_x[j] for j in range(len(result_x)) if result_lbl[j] == i]
    y = [result_y[j] for j in range(len(result_y)) if result_lbl[j] == i]
    trace = go.Scatter(x=x, y=y, mode='markers', marker=result_marker, name='Cluster {}'.format(i+1))
    cluster_traces.append(trace)

# Combine the traces into a single data array
#data = [input_trace, cluster_traces]
data = [input_trace] + cluster_traces

# Define the layout of the plot
layout = go.Layout(title='Input and Result Data', xaxis=dict(title='X Axis'), yaxis=dict(title='Y Axis'))


# Create the figure and export it as an HTML file
fig = go.Figure(data=data, layout=layout)
pio.write_html(fig, 'plot.html', auto_open=False)
webbrowser.open_new_tab('plot.html')
