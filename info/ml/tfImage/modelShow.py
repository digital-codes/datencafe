import json
import tensorflow as tf
import matplotlib.pyplot as plt
import base64
import sys
import numpy as np

fn = "public/datencafe-cnn-model.json"

with open(fn) as f:
    mdesc = json.load(f)

# Load the TensorFlow.js model
model = tf.keras.models.model_from_json(mdesc["topo"])
print(model.summary())

print("----------")

# load weights too
wspecs = json.loads(mdesc["wspecs"])
wstring = mdesc["wdata"]
wdata = base64.b64decode(wstring)

# parse weight data
# Use a pointer to keep track of our position in byte_data
pointer = 0

# List to hold parsed weights
parsed_weights = []

# Parse the weights based on wspecs
for spec in wspecs:
    dtype = np.dtype(spec["dtype"])
    num_bytes = np.prod(spec["shape"]) * dtype.itemsize
    print(spec,spec["name"],dtype,num_bytes)
    weight_array = np.frombuffer(wdata[pointer:pointer+num_bytes], dtype=dtype).reshape(spec["shape"])
    print(weight_array.shape)
    parsed_weights.append(weight_array)
    pointer += num_bytes


# Split parsed_weights into separate lists for kernel and bias for each layer
weights_to_set = np.empty((len(parsed_weights)//2,2)) #[]
for i in range(0, len(parsed_weights), 2):
    weights_to_set[i] = (parsed_weights[i], parsed_weights[i+1])
    #weights_to_set.append([parsed_weights[i], parsed_weights[i+1]])

# Set weights to the model
for layer, weights in zip(model.layers, weights_to_set):
    print(layer, weights.shape)
    layer.set_weights(weights)

sys.exit()

# Set weights to the model
for layer, weights in zip(model.layers, parsed_weights):
    print(layer, weights.shape)
    layer.set_weights([weights])


sys.exit()

########
# Save as Keras model (optional)
model.save('model.h5')

# Use this line to plot the model architecture directly
tf.keras.utils.plot_model(model, to_file='model.png', show_shapes=True, show_layer_names=True)



def plotLayer(idx):
    # Extract weights from the desired layer
    filters, biases = model.layers[idx].get_weights()

    # Normalize filter values between 0 and 1 for visualization
    f_min, f_max = filters.min(), filters.max()
    filters = (filters - f_min) / (f_max - f_min)

    # Number of filters and channels
    n_filters = filters.shape[-1]
    n_channels = filters.shape[-2]

    # Width of the grid
    grid_width = 10
    grid_height = int(n_filters * n_channels / grid_width) + (n_filters * n_channels % grid_width > 0)

    # Create a figure to contain the subplots
    fig, axes = plt.subplots(grid_height, grid_width, figsize=(15, 15))

    # Adjust layout
    fig.tight_layout()

    index = 0
    for i in range(n_filters):
        f = filters[:, :, :, i]
        for j in range(n_channels):
            row = index // grid_width
            col = index % grid_width
            ax = axes[row, col]
            ax.imshow(f[:, :, j], cmap='gray')
            ax.axis('off')
            index += 1

    # Hide any remaining unused subplots
    for i in range(index, grid_width * grid_height):
        row = i // grid_width
        col = i % grid_width
        axes[row, col].axis('off')

    # Save the figure
    plt.savefig(f"model-layer-{idx}.png", dpi=300, bbox_inches='tight')
    plt.close()


for i in range(len(model.layers)):
    if not "Conv2D" == model.layers[i].__class__.__name__:
        print(f"Skipping layer {i}")
        continue
    print(f"Printing layer {i}")
    plotLayer(i)

