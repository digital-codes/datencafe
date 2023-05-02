from graphviz import Digraph

# Initialize graph
g = Digraph()

# Add input layer nodes
##g.node('x1'); g.node('x2'); g.node('x3'); g.node('x4'); g.node('x5'); g.node('x6'); g.node('x7'); g.node('x8')
##g.node('x9'); g.node('x10'); g.node('x11'); g.node('x12'); g.node('x13'); g.node('x14'); g.node('x15'); g.node('x16')

# Add input layer nodes with label
for i in range(1,17):
    name = "input" + str(i)
    g.node(name, label='256 pixels')

for i in range(1,17):
    name = "hidden" + str(i)
    g.node(name,style='filled', fillcolor='lightblue', label='ReLU')

# Add output layer nodes
g.node('Triangle',label='SoftMax',style='filled', fillcolor='lightgreen' )
g.node('Rectangle',label='SoftMax',style='filled', fillcolor='lightgreen')
g.node('Ellipse',label='SoftMax',style='filled', fillcolor='lightgreen')

# Connect input to hidden layer
for i in range(1, 17):
    for j in range(1, 17):
        fromNode = "input" + str(i)
        toNode = "hidden" + str(j)
        g.edge(fromNode,toNode)

# Connect hidden to output layer
for i in range(1, 17):
    fromNode = "hidden" + str(i)
    g.edge(fromNode, 'Triangle')
    g.edge(fromNode, 'Rectangle')
    g.edge(fromNode, 'Ellipse')



# Set orientation to horizontal using the attr method
g.attr(rankdir='LR')
# Set distance between layers using the attr method
g.attr(ranksep='2.5')


# Generate DOT file
g.format = 'svg'
g.render('neural_network', view=False)
g.format = 'png'
g.render('neural_network', view=True)

