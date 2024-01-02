import _ from "lodash";
import { Utils } from "@orbifold/utils";
import { DefaultLabelStyle, GraphComponent, IEdge, INode, Rect, Size, TextRenderSupport } from "yfiles";
import { GraphLike } from "@orbifold/utils";

export class yFilesUtils {
	/**
	 * Loads the graph.
	 * @param g {Graph}
	 * @param graphComponent {GraphComponent}
	 * @return {void}
	 */
	static loadGraph(g: GraphLike, graphComponent) {
		const nodeDic = {};
		for (const n of g.nodes) {
			const node = yFilesUtils.createNode(n, graphComponent);
			nodeDic[n.id] = node;
		}
		for (const e of g.edges) {
			const sourceNode = nodeDic[e.sourceId];
			const targetNode = nodeDic[e.targetId];
			if (sourceNode && targetNode) {
				const tag = yFilesUtils.toEdgeTag(e);
				graphComponent.graph.createEdge({ source: sourceNode, target: targetNode, tag });
			}
		}
	}

	/**
	 * Extracts an yFiles RawNode for the given plain object.
	 * @see https://doc.linkurious.com/ogma/latest/api.html#RawNode
	 * @see https://doc.linkurious.com/ogma/latest/api.html#NodeAttributes
	 * @param n
	 * @param graphComponent {GraphComponent}
	 * @return {*}
	 */
	static createNode(n, graphComponent) {
		if (!_.isPlainObject(n)) {
			throw new Error("Expect plain object.");
		}
		const tag = {
			id: Utils.id(),
		};
		const location = {
			x: 0,
			y: 0,
		};
		let labels = [];
		const d = _.clone(n);

		if (d.x) {
			location.x = d.x;
			delete d.x;
		}
		if (d.y) {
			location.y = d.y;
			delete d.x;
		}
		if (d.labels) {
			labels = d.labels;
		}
		_.assign(tag, d);
		const node = graphComponent.graph.createNodeAt({ location, tag });
		let text=null;
		if (!Utils.isEmpty(d.name)) {
			text = d.name

		} else {
			if (labels.length > 0) {
				// todo: handle multiple labels
				text = labels[0];
			}
		}
		if(text){
			// resize the node to fit the label
			const label = graphComponent.graph.addLabel(node, text);
			const size = TextRenderSupport.measureText({
				text,
				font:new DefaultLabelStyle().font,
			})
			graphComponent.graph.setNodeLayout(node, Rect.fromCenter(node.layout.center, size).getEnlarged([5,10]));
		}

		return node;
	}

	static toEdgeTag(e) {
		const tag = _.clone(e);
		delete tag.source;
		delete tag.sourceId;
		delete tag.target;
		delete tag.targetId;
		return tag;
	}

	static toPlain(obj){
		if(Utils.isEmpty(obj)){
			return null;
		}
		if(_.isArray(obj)){
			return obj.map(o=>yFilesUtils.toPlain(o));
		}
		if(INode.isInstance(obj)){
			return obj.tag
		}
		if(IEdge.isInstance(obj)){
			const e = <IEdge>obj;
			const p = _.clone(e.tag);
			p.sourceId = e.sourceNode.tag.id;
			p.targetId = e.targetNode.tag.id;
			return p;
		}
	}
	/**
	 *
	 * @param rawNode {*} The raw node to extend.
	 * @param name {string} The name or a path of the RawNode to set.
	 * @param value {*} The value to set.
	 * @return {*}
	 */
	static setRawProperty(rawNode, name, value) {
		if (!rawNode) {
			rawNode = {};
		}
		if (name.indexOf(".") > -1) {
			Utils.ensureJsonPath(rawNode, name, value);
		} else {
			let path;
			switch (name.toLowerCase()) {
				case "color":
					path = "attributes.color";
					break;
				case "text":
					path = "attributes.text.content";
					break;

				default:
					throw new Error(`RawNode property '' is not recognized as a valid Ogma RawNode property.`);
			}
			Utils.ensureJsonPath(rawNode, path, value);
		}
		return rawNode;
	}
}
