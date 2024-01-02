<template>
	<client-only>
		<div v-show="licensePresent" id="graphHost"></div>
		<div v-show="!licensePresent">
			<div class="flex flex-col items-center justify-center h-full">
				<div class="text-2xl font-bold">yFiles license is missing.</div>
				<div class="text-xl">Please add it to the .env file.</div>
			</div>
		</div>
	</client-only>
</template>
<script setup lang="ts">
	import { GraphLike, IGraphView, type IQwieryEdge, type IQwieryNode } from "@orbifold/utils";
	import { onMounted, ref, watch } from "vue";
	import _ from "lodash";
	import { Class, DefaultLabelStyle, GraphComponent, IGraph, LayoutExecutor, License, OrganicLayout, Rect, ShapeNodeStyle, ShinyPlateNodeStyle, TextWrapping } from "yfiles";
	import { Utils } from "@orbifold/utils";
	import { yFilesUtils } from "../yFilesUtils";

	Class.ensure(LayoutExecutor);

	let selectionDebounceTimeout: any = null;
	const licensePresent = ref(false);
	let currentPosition: any = { x: 0, y: 0 };
	let edgeCreator: any = null;
	let nodeCreationEnabled = false;
	let edgeCreationEnabled = false;
	let graphComponent: GraphComponent;
	let graph: IGraph;
	const emit = defineEmits<{
		(e: "selectionChanged", selection: any[]): void;
		(e: "doubleClick", id: string): void;
		(e: "createNode", node: any): void;
	}>();

	onMounted(() => {

		// addEventHandlers();
		// for debugging
		// window["g"] = graphComponent;
	});

	function setLicense() {
		if (checkLicense()) {
			licensePresent.value = true;
			setTimeout(() => {
				graphComponent = new GraphComponent("#graphHost");
				graph = graphComponent.graph;
			}, 200);
		} else {
			licensePresent.value = false;
		}
	}

	function checkLicense() {
		if (props.license && !Utils.isEmpty(props.license)) {
			License.value = <any>props.license;
			return true;
		}
		return false;


	}

	/**
	 * Add a node to the graph.
	 * @param node {IQwieryNode} The node to add.
	 */
	function addNode(node: IQwieryNode) {
		yFilesUtils.createNode(node, graphComponent);
	}

	function addEdge(edge: IQwieryEdge) {
	}

	/**
	 * Loads a graph.
	 * @param g {GraphLike} The graph to load.
	 * @param replace {boolean} If true the current graph is cleared.
	 */
	function loadGraph(g: GraphLike | any, replace: boolean = true) {
		if (replace) {
			clear();
		}
		yFilesUtils.loadGraph(g, graphComponent);
	}

	/**
	 * Clear the graph.
	 */
	function clear() {
		graph.clear();
	}

	async function layout(layoutName: string = "organic", options: any = {}) {
		switch (layoutName.toLowerCase()) {
			case "organic":
				await organicLayout(options);
				break;
			case "hierarchical":
				await hierarchicalLayout(options);
				break;
			case "concentric":
				break;
			default:
				throw new Error(`The layout type '${layoutName}' is not handled or not supported.`);
		}
		fit();
	}

	async function organicLayout(options: any = {}) {
		const layout = new OrganicLayout(options);
		await graphComponent.morphLayout(layout);
	}

	function fit() {
	}

	function setStyle(name: string = "default") {
		switch (name) {
			case "default":
				graph.nodeDefaults.style = new ShapeNodeStyle({
					fill: "orange",
					shape: "ellipse",
					stroke: "orangered",
				});
				graph.nodeDefaults.labels.style = new DefaultLabelStyle({
					textFill: "white",
					textSize: 12,
					textAlign: "center",
					textVerticalAlign: "center",
					verticalTextAlignment: "center",
					horizontalTextAlignment: "center",

					insets: [3, 5, 3, 5],
					wrapping: TextWrapping.WORD_ELLIPSIS,
					maximumTextWidth: 100,

				});
				break;
			case "schema":
				graph.nodeDefaults.style = new ShapeNodeStyle({
					fill: "steelblue",
					shape: "round-rectangle",
					stroke: "darkblue",

				});
				graph.nodeDefaults.labels.style = new DefaultLabelStyle({
					textFill: "whitesmoke",
					textSize: 12,
					textAlign: "center",
					textVerticalAlign: "center",
					verticalTextAlignment: "center",
					horizontalTextAlignment: "center",

					insets: [3, 5, 3, 5],
					wrapping: TextWrapping.WORD_ELLIPSIS,
					maximumTextWidth: 100,

				});
				break;
			default:
				throw new Error(`The style '${name}' is not handled or not supported.`);
		}
	}

	function center() {
		graphComponent.fitGraphBounds();
	}

	function zoom(factor: number | null = null) {
		if (factor) {
			graphComponent.zoom = factor;
		}
		return graphComponent.zoom;
	}

	function removeNode(id: string | any) {
		if (!Utils.isEmpty(id)) {
			if (_.isString(id)) {
				graphComponent.graph.remove(graphComponent.graph.nodes.find(n => n.tag.id === id));
			} else {
				graphComponent.graph.remove(id);
			}
		}
	}

	function removeEdge(id: string | any) {
		if (!Utils.isEmpty(id)) {
			if (_.isString(id)) {
				graphComponent.graph.remove(graphComponent.graph.edges.find(n => n.tag.id === id));
			} else {
				graphComponent.graph.remove(id);
			}
		}
	}

	function getNodes(filter: Function | null = null): IQwieryNode[] {
		let found = [];
		if (filter) {
			found = graph.nodes.filter(filter);
		} else {
			found = graph.nodes;
		}
		return yFilesUtils.toPlain(found.toArray());
	}

	function getEdges(filter: Function | null = null): IQwieryNode[] {
		let found = [];
		if (filter) {
			found = graph.edges.filter(filter);
		} else {
			found = graph.edges;
		}
		return yFilesUtils.toPlain(found.toArray());
	}

	const props = defineProps({
		license: {
			type: Object,
			default: null,
			required: true,
		},
	});
	watch(() => props.license, (selection, prevSelection) => {
		setLicense();
	}, { immediate: true });
	/**
	 * Expose the IGraphView interface.
	 */
	defineExpose<IGraphView>({
		addNode,
		addEdge,
		loadGraph,
		clear,
		setStyle,
		layout,
		center,
		fit,
		zoom,
		removeNode,
		removeEdge,
		getNodes,
		getEdges,
		removeIsolatedNodes: () => {
		},
		edgeCreation: () => {
		},
		nodeCreation: () => {
		},
		selectedNodes: () => {
		},
		centerNode: () => {
		},
		getPosition: () => {
		},
		removeSelection: () => {
		},
		getNode: () => {
		},
		refreshStyle: () => {
		},
		forceResize: () => {
		},
		augment: () => {
		},
		setNodeProperty: () => {
		},
		setNodeProperties: () => {
		},
	});
</script>
<style scoped>
	#graphHost {
		z-index: 0;
		height: 85vh;
		width: 100%;
		background-color: transparent;
		outline: none;
	}
</style>
