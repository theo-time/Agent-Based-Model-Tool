# Agent-Based-Model-Tool
This project aims to build an Agent Based Modelling tool in Javascript.

Agent-based model (ABM) is a class of computational models for simulating the actions and interactions of autonomous agents with a view to assessing their effects on the system as a whole. It combines elements of game theory, complex systems, emergence, computational sociology, multi-agent systems, and evolutionary programming.

There are already some softwares offering to implement ABM (NetLogo, RePast, Swarm...). However, the purpose here is to build one in Javascript, so that it could be implemented on a Website. 

Currently, the program only features a Terrain that is composed of many pads (which can be assimilated to a cellular automata), and a basic agent object, which can interact with the terrain and the neighboring agents. A population object handles the Agents, and a selection method can be used to make agents evolve genetically toward a better fitness. 

Alongside with those basic ABM features, the purpose is to introduce neural networks features, so that Agents can be trained to develop an optimized complex behavior. 

Another purpose of this project is to allow the user to save the Agents DNA (containing their features and their learned behavior), and to share them. Thus, one researcher could use Agents that have been trained by another researcher on a completely different environment, and introduce them into his own environment to see wheter they do a good job or not. This way, huge progress could be done in artificial intelligence, and in the understanding of social science. 

Lastly, this tool could be used to generate real-time, ambitious simulations, composed of thousands of Agents, which would be hosted on a public server and available for everyone.
