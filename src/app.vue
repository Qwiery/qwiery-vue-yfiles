<template>
	<div style="display: flex">
		<img src="https://qwiery.com/QwierySmall.png" alt="" style="width: 50px; margin: 0 0 10px 0">
		<h1>yFiles Graph Viewer</h1></div>
	<p>Demonstrates how to use the graph view API. This API is also implemented around <a href="https://qwiery.com/graphviz/yfiles/" target="_blank">yFiles</a> and <a href="https://qwiery.com/graphviz/ogma/" target="_blank">Ogma</a>, see <a href="https://qwiery.com">Qwiery</a> for more into.</p>
	<div class="toolbar">
		<button class="btn" @click="loadSomething()">Sample Graph</button>
		<button class="btn" @click="removeIsolated()">Drop Isolated</button>
		<button class="btn" @click="addEdge()">Add Edge</button>
		<button class="btn" @click="removeEdge()">Remove Edge</button>
		<button class="btn" @click="addNode()">Add Node</button>
		<button class="btn" @click="removeNode()">Remove Node</button>
		<button class="btn" @click="clear()">Clear</button>
		<button class="btn" @click="augment()">Augment</button>
		<button class="btn" @click="center()">Center</button>
		<button class="btn" @click="zoomIn()">Zoom In</button>
		<button class="btn" @click="zoomOut()">Zoom Out</button>

		<div class="btn"><label for="edgeCreation">Edge Creation</label>
			<input id="edgeCreation" type="checkbox" @click="toggleEdgeCreation()"></div>
		<div class="btn"><label for="nodeCreation">Node Creation</label>
			<input id="nodeCreation" type="checkbox" @click="toggleNodeCreation()"></div>

		<span style="margin-left: 20px;">Layout: </span>
		<button style="margin-left: 20px" class="btn cyan" @click="layout('concentric')">Concentric</button>
		<button class="btn cyan" @click="layout('organic')">Organic</button>
		<button class="btn cyan" @click="layout('hierarchical')">Hierarchical</button>
	</div>
	<div class="wrapper">
		<GraphViewer class="graphViewer" ref="viewer" :license="license" />
	</div>
</template>
<script setup lang="ts">

	import { ref, onMounted, watch } from "vue";
	import { IGraphView, Utils } from "@orbifold/utils";
	import _ from "lodash";

	let edgeCreation = false;
	let nodeCreation = false;
	const viewer = ref(null);
	let view: IGraphView;
	let license = ref<any>(null);

	onMounted(() => {
		view = <IGraphView><unknown>viewer.value;
		// this uses the license from the .env file, but you can also assign it directly
		license.value = JSON.parse(import.meta.env.VITE_YFILES_LICENSE);
		setTimeout(() => {
			view.setStyle("default");
		}, 300);
	});

	function layout(name: string = "organic") {
		switch (name) {
			case "organic":
				view.layout(name, { minimumNodeDistance: 100 });
				break;
			case "concentric":
				view.layout(name, {});
				break;
			case "hierarchical":
				view.layout(name, {});
				break;
		}

	}

	function removeIsolated() {
		view.removeIsolatedNodes();
	}

	function loadSomething() {
		const g = {
			nodes: [
				{ id: "a", name: "A" },
				{ id: "b", name: "B" },
				{ id: "c", name: "C" },
				{ id: "d", name: "D" },
				{ id: "e", name: "E" },
			],
			edges: [
				{ sourceId: "a", targetId: "e", name: "A to E", id: Utils.id() },

			],
		};

		view.loadGraph(g);
		layout();
	}

	/**
	 * Add an edge between two random nodes
	 */
	function addEdge() {
		const ids = view.getNodes().map(n => n.id);
		if (ids.length > 1) {
			const tuple = _.sampleSize(ids, 2);
			const sourceId = tuple[0];
			const targetId = tuple[1];
			view.addEdge({ sourceId, targetId });
		}

	}

	/**
	 * Add a node at a random position
	 */
	function addNode() {
		view.addNode({ id: Utils.id(), name: "New Node", x: window.innerWidth / 2 - 200 + Math.random() * 40, y: window.innerHeight / 2 - 200 + Math.random() * 40, color: "red" });
	}

	/**
	 * Toggle edge creation mode
	 */
	function toggleEdgeCreation() {
		edgeCreation = !edgeCreation;
		view.edgeCreation(edgeCreation);
	}

	function toggleNodeCreation() {
		nodeCreation = !nodeCreation;
		view.nodeCreation(nodeCreation);
	}

	/**
	 * Clears the graph.
	 */
	function clear() {
		view.clear();
	}

	function center() {
		view.center();
	}

	function augment() {
		const id1 = Math.random() < 0.3 ? "a" : Utils.id(), id2 = Math.random() < 0.3 ? "b" : Utils.id();
		view.augment({
			nodes: [
				{
					id: id1,
					name: Utils.randomId(4),
				},
				{
					id: id2,
					name: Utils.randomId(4),
				}],
			edges: [
				{
					id: Utils.id(),
					sourceId: id1,
					targetId: id2,
				},
			]
			,
		});
	}

	function removeEdge() {
		const edges = view.getEdges();
		if (edges.length > 0) {
			const edge = _.sample(edges);
			view.removeEdge(edge.id);
		}
	}

	function removeNode() {
		const nodes = view.getNodes();
		if (nodes.length > 0) {
			const node = _.sample(nodes);
			view.removeNode(node.id);
		}
	}

	function zoomIn() {
		view.zoom(view.zoom() + 0.1);
	}

	function zoomOut() {
		view.zoom(view.zoom() - 0.1);
	}
</script>


<style>
	a {
		text-decoration: none;
		color: steelblue;
		font-weight: bold;
	}

	.wrapper {
		padding: 5px;
		height: 80vh;
		width: 90vw;
		position: relative;
		border: 1px solid silver;
		border-radius: 5px;
		overflow: hidden;

	}

	.toolbar {
		padding: 5px;
		width: 90vw;
		position: relative;
		border: 1px solid silver;
		border-radius: 5px;
		margin-bottom: 5px;
	}

	.graphViewer {
		height: 100vh;
		width: 100vw;
		position: absolute;
	}

	.btn {
		display: inline;
		height: 30px;
		background-color: steelblue;
		color: white;
		border: none;
		padding: 5px;
		cursor: pointer;
		border-radius: 4px;
		margin-right: 5px;
	}

	.cyan {
		background-color: #3da8a8;
	}
</style>
