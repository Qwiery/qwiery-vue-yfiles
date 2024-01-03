# Vue yFiles Component

This is a Vue 3 component that wraps the [yFiles](https://www.yworks.com/products/yfiles) graph visualization library. It implements [the generic graph visualization API of Qwiery](https://qwiery.com/graphviz/graphView) and thus allows an in-place replacement (betweeen Cytoscape, Ogma, yFiles and GoJs).

Note that yFiles is a commercial component and you need to [obtain a license](https://www.yworks.com/products/yfiles-for-html/evaluate) to use it.

If you don't have a license you can use [the free Cytoscape version](https://qwiery.com/graphviz/cytoscape/). It implements the same API referred above.

## Installation

Assuming you have a Vue 3 application, install the component with

```bash
npm i @orbifold/vue-yfiles
```

and make sure you also have the yFiles library installed. You can [download it from the yWorks website](https://www.yworks.com/products/yfiles-for-html/evaluate).

If you don't have a Vue app, use 

```bash
npx nuxi init myapp
cd myapp
npm i <the path to the yFiles tgz package>
npm i @orbifold/vue-yfiles
```

Assign the license via the `license` prop like so:

```html
<GraphViewer  :license="license"/>
```
The license looks like this:
```js
const license = {
    "company": "Your Corp",
    "date": "2021-09-01",
    "distribution": "global",
    "domains": [ "localhost"],
    "key": "your key",
    ...
```

See the demo application (`npm run dev`) for a complete example. 

 

## IGraphView

This wrapper implements the [Qwiery](https://qwiery.com) `IGraphView` interface and it means you can transparently exchange it with other implementations.
The [yFiles](https://github.com/Qwiery/qwiery-vue-yfiles) and [Linkurious Ogma](https://github.com/Qwiery/qwiery-vue-ogma) implementations are more advanced but are not free.

## Build and Testing

Clone the repo, install things (`npm i`). To build the library run `npm run build` and to test it run `npm run test`.

## Sample Application

You can run the sample application with `npm run dev` and then open `http://localhost:5173` (or whatever Vite shows in the console) in your browser.

If you include the [Qwiery Graph](https://github.com/Qwiery/qwiery-graphs) package (`npm i @orbifold/graphs`) you can use diverse graph generators to create graphs and then visualize them with this component.

For instance

```js
import { Graph } from "@orbifold/graphs";

const g = Graph.create("erdos");
const viewe = <IGraphView>viewer.value; //see snippet above
	viewer.loadGraph(g);
	viewer.layout(); //organica layout by default
```

# Graph structure

The `loadGraph` method expects a JSON graph:

```js

const g = {
	nodes: [
		{ id: 'a', name: 'A' },
		{ id: 'b', name: 'B' }
	],
	edges: [
		{ sourceId: 'a', targetId: 'b', name: 'A to B' },

	]
};
cy.loadGraph(g)
```

The `name` property is optional and will be used as the label of the node or edge.
The style of the graph defines whether the label is shown or not.

There are many different graph structures out there and if you wish to convert or use them, see the [Qwiery Graph](https://github.com/Qwiery/qwiery-graphs) package.

## Feedback

This component is part of the [Qwiery](https://qwiery.com) framework to help jump-start your graph visualizations. It's neither bug-free nor complete and  
if you find something isn't as expected you [can report it](https://github.com/Qwiery/qwiery-nuxt/issues) or contact us:

- [ X](https://twitter.com/theorbifold)
- [Email](mailto:info@qwiery.com)
- [Orbifold Consulting](https://GraphsAndNetworks.com)

## Consulting and Custom Development

You can use any of the links above to contact us with respect to custom development and beyond. We have more than 20 years experience with everything graphs.

## License

**MIT License**

_Copyright (c) 2024 Orbifold B.V._

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


