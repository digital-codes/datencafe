import json
import tensorflow as tf
import matplotlib.pyplot as plt


fn = "public/datencafe-cnn-model.json"

with open(fn) as f:
    mdesc = json.load(f)

# Load the TensorFlow.js model
model = tf.keras.models.model_from_json(mdesc["topo"])
print(model.summary())

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

